import * as React from "react";
import './App.css';

// importing components
import TrimVideo from "./components/TrimVideo/TrimVideo";
import CreateVideo from "./components/CreateVideo/CreateVideo";

const App = () => {
  const [type, setType] = React.useState(null); // type: null | "record" | "pick"
  const [videoSrc, setVideoSrc] = React.useState(null);

  React.useEffect(() => {
    const ffmpeg = require("ffmpeg.js");
    let stdout = "";
    let stderr = "";
    // Print FFmpeg's version.
    ffmpeg({
      arguments: ["-version"],
      print: function(data) { stdout += data + "\n"; },
      printErr: function(data) { stderr += data + "\n"; },
      onExit: function(code) {
        console.log("Process exited with code " + code);
        console.log(stdout);
        console.log(stderr);
      },
    });
  }, []);

  if (type === null) {
    return (
      <div style={styles.mainDivAppWrapper}>
        <div onClick={() => setType("record")} style={styles.typeButtons}>
          Open Camera
        </div>
        <div onClick={() => setType("pick")} style={styles.typeButtons} >
          Upload Video
        </div>
      </div>
    )
  }

  return (
    <div style={styles.mainDivAppWrapper}>
      {type === "record" ?  <CreateVideo setVideoSrc={(src) => {
        setVideoSrc(src);
        setType("pick")
      }} /> : <TrimVideo videoSrc={videoSrc} setVideoSrc={setVideoSrc} />}
    </div>
  );
}

const styles = {
  mainDivAppWrapper: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "black",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  typeButtons: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#1A6751",
  },
  mainDivWrapper: {
    height: "100vh",
    width: "80vw",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default App;
