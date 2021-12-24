import * as React from "react";
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const App = () => {
  const [videoPath, setVideoPath] = React.useState('');
  const [videoSrc, setVideoSrc] = React.useState('');
  const [message, setMessage] = React.useState('Click Start to transcode');
  const ffmpeg = createFFmpeg({
    log: true,
  });

  const doTranscode = async () => {
    await ffmpeg.load();
    setMessage('Start transcoding');
    ffmpeg.FS('writeFile', 'test.avi', await fetchFile(videoPath)); // need to save the video file to MEMFS before ffmpeg can consume it
    await ffmpeg.run('-i', 'test.avi', 'test.mp4'); // run the actual operation
    setMessage('Complete transcoding');
    const data = ffmpeg.FS('readFile', 'test.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };

  return (
    <div className="App">
      <p/>
      <video src={videoSrc} controls></video><br/>
      <input type="file" onChange={(e) => setVideoPath(e.target.value)} />
      <button onClick={doTranscode}>Start</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
