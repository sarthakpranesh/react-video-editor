import * as React from "react";
import { useVideo } from "react-use";

const OverlayVIdeo = ({ videoSrc, setVideoSrc }) => {
    const [video, state, controls, ref] = useVideo(
        <video style={styles.video} src={videoSrc} autoPlay controls loop />
    );
    const [stickerMessage, setStickerMessage] = React.useState("");
    const [stickerArray, setStickerArray] = React.useState([]);

    console.log(state, videoSrc);

    return (
        <div style={styles.mainTrimVideoWrapper}>
            {video}
            <br />
            <input
                type="text"
                value={stickerMessage}
                onChange={(e) => setStickerMessage(e.current.value)}
            />
            <button 
                onClick={() => {
                    const newSticker = {
                        x: 100,
                        y: 200,
                        message: stickerMessage,
                        id: stickerArray.length,
                    };
                    setStickerArray([...stickerArray, newSticker]);
                    setStickerMessage("");
                }}
            >
                Add Sticker
            </button>
            <a href={videoSrc} download="video.mp4">
                Download
            </a>
        </div>
    );
};

const styles = {
    mainTrimVideoWrapper: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    video: {
      height: "400px",
      width: "200px",
      border: "1px solid white",
      borderRadius: 8,
    },
    subDivWrapper: {
      marginLeft: 20,
      alignItems: "flex-start",
    }
};

export default OverlayVIdeo;
