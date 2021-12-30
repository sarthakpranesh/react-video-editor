import FFMPEG from "react-ffmpeg";

const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');

const ffmpeg = createFFmpeg({
    log: true,
    corePath: "/ffmpeg-core/ffmpeg-core.js",
});

export const convertVideoFromWebmToMp4 = async (file, callback) => {
    await FFMPEG.process(
        file,
        '-fflags +genpts -r 24 1.webm 1.mp4', //-fflags +genpts -i 1.webm -r 24 1.mp4
        callback,
    )
}

export const ffmpegTimeFormatter = (time) => {
    // time in seconds
    const h = Math.floor(time/(60*60)); //seconds * min make hour
    const m = Math.floor((time - h*60)/60);
    const s = Math.floor((time - (h*60*60 + m*60)));
    return `${h}:${m}:${s}`;
}

export const trimVideo = async (file, start, end, callback) => {
    const startFormattedTime = ffmpegTimeFormatter(start);
    const endFormattedTime = ffmpegTimeFormatter(end);
    console.log(startFormattedTime, endFormattedTime);
    await FFMPEG.process(
        file,
        `-ss ${startFormattedTime} -to ${endFormattedTime} -c:v copy -c:a copy`,
        callback,
    )
}

export const convertVideoWithFfmpeg = async (file) => {
    console.log(file);
    await ffmpeg.load();
    ffmpeg.FS('writeFile', "video.webm", await fetchFile(file));
    await ffmpeg.run('-i', 'video.webm', "video.mp4");
    const raw = ffmpeg.FS('readFile', "video.mp4");
    console.log(raw);
    // process.exit(0);
}
