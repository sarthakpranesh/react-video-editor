import * as React from "react";
import Draggable from "react-draggable";

const Sticker = ({ sticker, updateSticker }) => {
    const stickerRef = React.useRef(null);
    const [overlayProp, setOverlayProp] = React.useState(0);

    React.useEffect(() => {
        const overlay = document.getElementById("stickers-overlay");
        setOverlayProp({
            width: overlay.offsetWidth,
            height: overlay.offsetHeight,
        });
    }, [])

    return (
        <Draggable
            key={sticker.id}
            axis="both"
            handle=".handle"
            defaultPosition={{x: sticker.x, y: sticker.y}}
            position={null}
            grid={[1, 1]}
            scale={1}
            onStart={() => {}}
            onDrag={() => {}}
            onStop={(e, d) => {
                const stickerWidth = stickerRef.current.offsetWidth;
                if (d.x < -stickerWidth || d.x > overlayProp.width || d.y < 0 || d.y > overlayProp.height) {
                    // remove the sticker
                    updateSticker(sticker, true);
                } else {
                    const newSticker = {
                        ...sticker,
                        x: d.x,
                        y: d.y,
                    }
                    updateSticker(newSticker, false);                    
                }
            }}>
                <div className="handle">
                    <div ref={stickerRef} style={styles.stickerWrapper}>
                        {sticker.message.trim()}
                    </div>
                </div>
        </Draggable>
    )
}

const styles = {
    stickerWrapper: {
        padding: 4,
        borderRadius: 4,
        background: "pink",
        display: "inline-flex",
    },
}

export default Sticker;
