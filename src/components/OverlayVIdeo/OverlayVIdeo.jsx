import * as React from "react";
import { useVideo } from "react-use";
import Sticker from "../Sticker/Sticker";

const OverlayVIdeo = ({ videoSrc, setVideoSrc }) => {
    // eslint-disable-next-line no-unused-vars
    const [video, state, controls, ref] = useVideo(
        <video style={styles.video} src={videoSrc} autoPlay controls loop />
    );
    const [stickerMessage, setStickerMessage] = React.useState("");
    const [stickerArray, setStickerArray] = React.useState([]);

    const updateSticker = (sticker, isDeleted) => {
        const { id } = sticker;
        if (isDeleted) {
            // remove sticker
            const newStickerArray = stickerArray.filter((sticker) => sticker.id !== id);
            setStickerArray(newStickerArray);
            return;
        }
        const index = stickerArray.findIndex((sticker) => sticker.id === id);
        const newStickerArray = [...stickerArray.slice(0, index), sticker, ...stickerArray.slice(index + 1)]
        setStickerArray(newStickerArray);
    }

    return (
        <div style={styles.mainTrimVideoWrapper}>
            <div style={{ height: 400, width: 200, display: "flex", marginBottom: 20, }}>
                {video}
                <div style={{ ...styles.video, ...styles.videoOverlay }}>
                    {
                        stickerArray.map((sticker) => {
                            return (
                                <Sticker
                                    sticker={sticker}
                                    updateSticker={updateSticker}
                                />
                            )
                        })
                    }
                </div>
            </div>
            <br />
            <input
                type="text"
                placeholder="Enter Sticker Text"
                value={stickerMessage}
                onChange={(e) => setStickerMessage(e.currentTarget.value)}
            />
            <button 
                onClick={() => {
                    const newSticker = {
                        x: 100,
                        y: 200,
                        message: stickerMessage,
                        id: Date.now(),
                    };
                    setStickerArray([...stickerArray, newSticker]);
                    setStickerMessage("");
                }}
            >
                Add Sticker
            </button>
            <a href={videoSrc} download="video.webm" style={{ marginTop: 20, }}>
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
      zIndex: 1,
    },
    videoOverlay: {
        zIndex: 99,
        position: "absolute",
        color: "white",
    },
    subDivWrapper: {
      marginLeft: 20,
      alignItems: "flex-start",
    },
};

export default OverlayVIdeo;
