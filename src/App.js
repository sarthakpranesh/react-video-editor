import * as React from "react";
import './App.css';

// importing components
import CreateVideo from "./components/CreateVideo/CreateVideo";
import OverlayVIdeo from "./components/OverlayVIdeo/OverlayVIdeo";

const App = () => {
  const [type, setType] = React.useState("record"); // type: null | "record" | "overlay"
  const [videoSrc, setVideoSrc] = React.useState("");

  return (
    <div style={styles.mainDivAppWrapper}>
      {type === "record" ?  <CreateVideo setVideoSrc={(src) => {
        setVideoSrc(src);
        setType("overlay");
      }} /> : <OverlayVIdeo videoSrc={videoSrc} setVideoSrc={(src) => {
        setVideoSrc(src);
        setType("record");
      }} />}
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
    justifyContent: "center",
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
