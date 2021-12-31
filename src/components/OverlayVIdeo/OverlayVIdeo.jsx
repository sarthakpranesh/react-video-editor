import * as React from "react";
import { useVideo } from "react-use";
import { IconButton, Button } from "@mui/material";
import Sticker from "../Sticker/Sticker";
import StickerModal from "./StickerModal";
import Cancel from "@mui/icons-material/Cancel";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// constant value for video feed and overlay
const videoConts = {
    width: 300,
    height: 500,
}

const OverlayVIdeo = ({ videoSrc, setVideoSrc }) => {
    // eslint-disable-next-line no-unused-vars
    const [video, state, controls, ref] = useVideo(
        <video style={styles.video} src={videoSrc} autoPlay controls loop />
    );
    const [stickerArray, setStickerArray] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    const handleStickerModalOpen = () => setOpen(true);
    const handleStickerModalOnClose = () => setOpen(false);
    const handleStickerModalOnAddSticker = (sticker) => {
        setStickerArray([...stickerArray, sticker]);
        setOpen(false);
    }

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
            <IconButton style={{ alignSelf: "flex-end", right: 10, top: 10 }} onClick={() => setVideoSrc(null)}>
                <Cancel style={{ color: "white" }} />
            </IconButton>
            <div style={{ ...videoConts, display: "flex", marginBottom: 20, marginTop: 20, }}>
                {video}
                <div id="stickers-overlay" style={{ ...videoConts, ...styles.videoOverlay }}>
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
            <div style={styles.videoButtonWrapper}>
                <Button variant="contained" onClick={handleStickerModalOpen}>
                    Add Sticker
                </Button>
                <IconButton
                    onClick={() => {
                        const a = document.createElement("a");
                        a.href = videoSrc;
                        a.download = `nearcast-${Date.now()}`
                        a.click();
                    }}
                >
                    <FileDownloadIcon style={{ color: "white" }} />
                </IconButton>
            </div>
            <StickerModal isOpen={open} onClose={handleStickerModalOnClose} onAddSticker={handleStickerModalOnAddSticker} />
        </div>
    );
};

const styles = {
    mainTrimVideoWrapper: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    video: {
      ...videoConts,
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
    videoButtonWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: videoConts.width,
    }
};

export default OverlayVIdeo;
