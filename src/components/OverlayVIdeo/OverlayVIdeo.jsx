import * as React from "react";
import { useVideo } from "react-use";
import Draggable from "react-draggable";

const OverlayVIdeo = ({ videoSrc, setVideoSrc }) => {
    // eslint-disable-next-line no-unused-vars
    const [video, state, controls, ref] = useVideo(
        <video style={styles.video} src={videoSrc} autoPlay controls loop />
    );
    const [stickerMessage, setStickerMessage] = React.useState("");
    const [stickerArray, setStickerArray] = React.useState([]);

    React.useEffect(() => {
        console.log(stickerArray);
    }, [stickerArray])

    return (
        <div style={styles.mainTrimVideoWrapper}>
            <div style={{ height: 400, width: 200, display: "flex", marginBottom: 20, }}>
                {video}
                <div style={{ ...styles.video, ...styles.videoOverlay }}>
                    {
                        stickerArray.map((sticker, i) => {
                            return (
                                <Draggable
                                    key={sticker.id}
                                    axis="both"
                                    handle=".handle"
                                    defaultPosition={{x: sticker.x, y: sticker.y}}
                                    position={null}
                                    grid={[40, 40]}
                                    scale={1}
                                    onStart={() => {}}
                                    onDrag={() => {}}
                                    onStop={(e, d) => {
                                        if (d.x < -50 || d.x > 200+50 || d.y < 0 || d.y > 400) {
                                            // remove the sticker
                                            const newStickerArray = [...stickerArray.slice(0, i), ...stickerArray.slice(i+1)]
                                            setStickerArray(newStickerArray);
                                        } else {
                                            sticker.x = d.x;
                                            sticker.y = d.y;
                                            const newStickerArray = [...stickerArray.slice(0, i), sticker, ...stickerArray.slice(i+1)]
                                            setStickerArray(newStickerArray);
                                        }
                                    }}>
                                    <div style={styles.stickerWrapper} className="handle">
                                        {sticker.message.trim()}
                                    </div>
                                </Draggable>
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
    stickerWrapper: {
        padding: 4,
        borderRadius: 4,
        background: "pink",
        display: "inline-block" 
    },
};

export default OverlayVIdeo;
