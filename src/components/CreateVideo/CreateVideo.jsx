import * as React from "react";
import Webcam from "react-webcam";

let clearId;

const CreateVideo = ({ setVideoSrc }) => {
    // references 
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
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
          const url = URL.createObjectURL(blob);
          setVideoSrc(url);
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
                    facingMode: userFacingMode ? "user" : { exact: "enviornment" }, // "user" | "environment",
                    width: 900,
                    height: 1500,
                }}
            />
            <div style={styles.cameraMainControls}>
                <div />
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
                <div style={{ color: "white" }} onClick={() => setUserFacingMode(!userFacingMode)}>
                    Flip
                </div>
            </div>
        </>
    );
};

const styles = {
    mainVideoCreateWrapper: {
        height: 500,
        width: 300,
        border: "1px solid white",
        borderRadius: 8,
    },
    cameraMainControls: {
        width: 300,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    cameraMainButton: {
        width: 50,
        height: 50,
        border: "4px white solid",
        borderRadius: 25,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
    }
};

export default CreateVideo;
