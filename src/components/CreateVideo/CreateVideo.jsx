import * as React from "react";
import Webcam from "react-webcam";
import { IconButton } from "@mui/material";
import FlipCameraAndroidRoundedIcon from '@mui/icons-material/FlipCameraAndroidRounded';
import CollectionsIcon from '@mui/icons-material/Collections';

let clearId;

const CreateVideo = ({ setVideoSrc }) => {
    // references 
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const inputRef = React.useRef(null);
    // component states
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const [userFacingMode, setUserFacingMode] = React.useState(true);
    const [time, setTime] = React.useState(0);
    const [recordEndBlobOperationDone, setRecordEndBlobOperationDone] = React.useState(false);
  
    const handleStartCaptureClick = () => {
        setCapturing(true);
        setRecordEndBlobOperationDone(false);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
          mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
          "dataavailable",
          handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }
  
    const handleDataAvailable = (e) => {
        const { data } = e;
        if (data.size > 0) {
            setRecordedChunks((prev) => prev.concat(data));
            if (e.currentTarget.state === "inactive") {
                setRecordEndBlobOperationDone(true); // "dataavailable" blob event takes place after calling .stop() on media ref
            }
        }
    }
  
    const handleStopCaptureClick = React.useCallback(() => {
        if (recordedChunks.length) {
          const blob = new Blob(recordedChunks, {
            type: "video/webm"
          });
          const videoURL = URL.createObjectURL(blob);
          setVideoSrc(videoURL);
          setRecordedChunks([]);
        }
    }, [recordedChunks, setVideoSrc]);

    React.useEffect(() => {
        if (capturing) {
            clearId = setInterval(() => {
                setTime((t) => t + 1);
            }, 1000);
        } else {
            console.log("Interval cleared");
            clearInterval(clearId);
        }
    }, [capturing]);

    /**
     * The mediaRecorderRef.current.stop() takes time to actually create the first "dataavailable" call
     * if not called earlier. This cause the react to move ahead but recorderChunk to be empty for 
     * short videos, this is a little hack around it
     */
    React.useEffect(() => {
        if (!recordEndBlobOperationDone && recordedChunks.length > 0) {
            handleStopCaptureClick();
        }
    }, [capturing, handleStopCaptureClick, recordEndBlobOperationDone, recordedChunks.length]);

    return (
        <>
            <Webcam
                ref={webcamRef}
                style={styles.mainVideoCreateWrapper}
                videoConstraints={{
                    facingMode: userFacingMode ? "user" : { exact: "environment" }, // "user" | "environment",
                    width: { min: 640, ideal: 1920, max: 1920 },
                    height: { min: 400, ideal: 1080 },
                    aspectRatio: 1.777777778,
                    frameRate: { max: 60 },
                }}
            />
            <div style={styles.cameraMainControls}>
                <IconButton onClick={() => inputRef.current.click()}>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="audio/*,video/*"
                        onChange={(e) => {
                            const videoFile = e.target.files[0];
                            setVideoSrc(URL.createObjectURL(videoFile));
                        }}
                        style={{
                            display: "none",
                        }}
                    />
                    <CollectionsIcon style={styles.cameraIconButtons} />
                </IconButton>
                <div 
                    style={{
                        ...styles.cameraMainButton,
                        background: capturing ? "red" : "#3A8F78",
                    }}
                    onClick={() => {
                        if (capturing) {
                            mediaRecorderRef.current.stop();
                            setCapturing(false);
                            setTime(0);
                        } else {
                            handleStartCaptureClick()
                        }
                    }} 
                >
                    {capturing ? time : ""}
                </div>
                <IconButton onClick={() => setUserFacingMode(!userFacingMode)}>
                    <FlipCameraAndroidRoundedIcon style={styles.cameraIconButtons} />
                </IconButton>
            </div>
        </>
    );
};

const styles = {
    mainVideoCreateWrapper: {
        height: "100vh",
        width: "100vw",
    },
    cameraMainControls: {
        width: "100vw",
        height: "140px",
        position: "absolute",
        bottom: 0,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        background: "rgba(0, 0, 0, 0.25)"
    },
    cameraMainButton: {
        width: 50,
        height: 50,
        border: "4px white solid",
        borderRadius: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontWeight: "800",
    },
    cameraIconButtons: {
        width: 40,
        height: 40,
        color: "white",
    }
};

export default CreateVideo;
