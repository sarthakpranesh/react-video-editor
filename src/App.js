import * as React from "react";
import './App.css';
import { useVideo, useMediaDevices } from "react-use";
import { trimVideo } from "./services";

const App = () => {
  const [video, state, controls, ref] = useVideo(
    <video style={styles.video} src="" autoPlay controls />
  );
  const [videoFile, setVideoFile] = React.useState(null);
  const [videoSrc, setVideoSrc] = React.useState('');
  const [trim, setTrim] = React.useState({ start: 0, end: 0 });

  const onTrim = async () => {
    await trimVideo(videoFile, trim.start, trim.end, function (e) {
      const video = e.result;
      setVideoSrc(URL.createObjectURL(video));
    });
  }

  const onFileChange = async (e) => {
    const videoFile = e.target.files[0];
    setVideoFile(videoFile);
    setVideoSrc(URL.createObjectURL(videoFile));
  }

  React.useEffect(() => {
    if (ref.current === null) {
      return;
    }
    ref.current.src = videoSrc;
    setTrim({
      start: 0,
      end: Math.floor(state.duration),
    })
  }, [ref, state.duration, videoSrc]);

  return (
    <div style={styles.mainDivWrapper}>
      <div>{video}</div>
      <div style={styles.subDivWrapper}>
        <span>
          Select a File: 
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={onFileChange}
          />
        </span>
        <br />
        Trim Video Length (time in seconds)
        <input
          placeholder="Start time"
          type="number"
          value={trim.start}
          onChange={(e) => {
            if (e.currentTarget.value < 0) {
              e.currentTarget.value = 0;
            }
            setTrim({
              start: e.currentTarget.value,
              end: trim.end,
            })
          }}
        />
        <input
          placeholder="End time"
          type="number"
          value={trim.end}
          onChange={(e) => {
            if (e.currentTarget.value > state.duration) {
              e.currentTarget.value = state.duration
            }
            setTrim({
              start: trim.start,
              end: e.currentTarget.value,
            })
          }}
        />
        <button onClick={onTrim}>Trim</button>
      </div>
    </div>
  );
}

const styles = {
  mainDivWrapper: {
    height: "100vh",
    width: "80vw",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    height: "400px",
    width: "200px",
    border: "1px solid black",
  },
  subDivWrapper: {
    marginLeft: 20,
    alignItems: "flex-start",
  }
};

export default App;
