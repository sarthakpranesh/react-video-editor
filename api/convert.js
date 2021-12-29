import "@ffmpeg/core";
import { createFFmpeg } from '@ffmpeg/ffmpeg';
const app = require('express')();
const multer = require("multer");

const ffmpegInstance = createFFmpeg({ log: true });
let ffmpegLoadingPromise = ffmpegInstance.load();

async function getFFmpeg() {
    if (ffmpegLoadingPromise) {
        await ffmpegLoadingPromise;
        ffmpegLoadingPromise = undefined;
    }

    return ffmpegInstance;
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }
});

app.post('/thumbnail', upload.single('video'), async (req, res) => {
    const videoData = req.file.buffer;

    const ffmpeg = await getFFmpeg();
    const inputFileName = `input-video`;
    const outputFileName = `output-image.png`;
    let outputData = null;
    ffmpeg.FS('writeFile', inputFileName, videoData);
    await ffmpeg.run(
        '-ss', '00:00:01.000',
        '-i', inputFileName,
        '-frames:v', '1',
        outputFileName
    );
    outputData = ffmpeg.FS('readFile', outputFileName);
    ffmpeg.FS('unlink', inputFileName);
    ffmpeg.FS('unlink', outputFileName);
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment;filename=${outputFileName}`,
        'Content-Length': outputData.length
    });
    res.end(Buffer.from(outputData, 'binary'));
    res.sendStatus(200);
});

module.exports = app;
