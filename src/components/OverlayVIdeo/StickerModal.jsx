import * as React from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const StickerModal = ({ isOpen, onClose, onAddSticker }) => {
    const [stickerMessage, setStickerMessage] = React.useState("");

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Stickers
                </Typography>
                <TextField
                    type="text"
                    placeholder="Add Sticker Text"
                    value={stickerMessage}
                    onChange={(e) => setStickerMessage(e.currentTarget.value)}
                />
                <Button
                    variant="contained" 
                    style={{
                        marginTop: 10,
                        alignSelf: "flex-end",
                    }}
                    onClick={() => {
                        const newSticker = {
                            x: 100,
                            y: 200,
                            message: stickerMessage,
                            id: Date.now(),
                        };
                        onAddSticker(newSticker);
                        setStickerMessage("");
                    }}
                >
                    Done
                </Button>
            </Box>
        </Modal>
    );
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 260,
    maxHeight: "80vh",
    borderRadius: 4,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default StickerModal;
