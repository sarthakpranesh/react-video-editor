import * as React from "react";
import Webcam from "react-webcam";

const CreateVideo = ({ setVideoSrc }) => {
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const [userFacingMode, setUserFacingMode] = React.useState(false);
    const [time, setTime] = React.useState(0);
  
    const handleStartCaptureClick = () => {
        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
          mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
          "dataavailable",
          handleDataAvailable
        );
        mediaRecorderRef.current.start();
        setInterval(() => {
            setTime((t) => t + 1);
        }, 1000);
    }
  
    const handleDataAvailable = ({ data }) => {
        if (data.size > 0) {
          setRecordedChunks((prev) => prev.concat(data));
        }
    }
  
    const handleStopCaptureClick = () => {
        clearInterval();
        setTime(0);
        mediaRecorderRef.current.stop();
        if (recordedChunks.length) {
          const blob = new Blob(recordedChunks, {
            type: "video/webm"
          });
          const url = URL.createObjectURL(blob);
          setVideoSrc(url);
        }
        setCapturing(false);
    }

    return (
        <>
            <Webcam
                ref={webcamRef}
                style={styles.mainVideoCreateWrapper}
                videoConstraints={{
                    facingMode: userFacingMode ? "user" : "enviornment", // "user" | "environment",
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
                            handleStopCaptureClick()
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
