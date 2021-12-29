import * as React from "react";
import { useVideo } from "react-use";

import { trimVideo, convertVideoFromWebmToMp4 } from "../../services";

const TrimVideo = ({ videoSrc, setVideoSrc }) => {
    const inputRef = React.useRef();
    const [video, state, controls, ref] = useVideo(
        <video style={styles.video} src="" autoPlay controls />
    );
    const [videoFile, setVideoFile] = React.useState(videoSrc ? new File([videoSrc], "video.webm") : null);
    const [trim, setTrim] = React.useState({ start: 0, end: 0 });
    const [isTrimming, setIsTrimming] = React.useState(false);

    const onTrim = async () => {
        setIsTrimming(true);
        console.log(videoFile);
        await trimVideo(videoFile, trim.start, trim.end, function (e) {
          const video = e.result;
          setVideoSrc(URL.createObjectURL(video));
          setIsTrimming(false);
        });
    }
    
    const onFileChange = async (e) => {
        const videoFile = e.target.files[0];
        setVideoFile(videoFile);
        setVideoSrc(URL.createObjectURL(videoFile));
    }

    React.useEffect(() => {
        if (inputRef === null) {
            return;
        }
        if (videoSrc === null) {
            inputRef.current.click();
        }
    }, [inputRef, videoSrc]);

    React.useEffect(() => {
        if (ref.current === null) {
          return;
        }
        ref.current.src = videoSrc;
        setTrim({
          start: 0,
          end: Math.floor(state.duration),
        })
    }, [ref, state.duration, videoSrc]);

    React.useEffect(() => {
        var file = new File([videoSrc], "name.webm");
        convertVideoFromWebmToMp4(file, (f) => {
            console.log(f);
        });
    }, [videoSrc]);

    return (
        <div style={styles.mainTrimVideoWrapper}>
            <input
                ref={inputRef}
                type="file"
                accept="audio/*,video/*"
                onChange={onFileChange}
                style={{
                    display: "none",
                }}
            />
            {video}
            <br />
            Trim Video Length (time in seconds)
            <input
                placeholder="Start time"
                type="number"
                value={trim.start}
                onChange={(e) => {
                    if (e.currentTarget.value < 0) {
                        e.currentTarget.value = 0;
                    }
                    setTrim({
                        start: e.currentTarget.value,
                        end: trim.end,
                    })
                }}
            />
            <input
                placeholder="End time"
                type="number"
                value={trim.end}
                onChange={(e) => {
                    if (e.currentTarget.value > state.duration) {
                        e.currentTarget.value = state.duration
                    }
                    setTrim({
                        start: trim.start,
                        end: e.currentTarget.value,
                    })
                }}
            />
            <button
                style={{
                    display: "block",
                }}
                onClick={() => {
                    if (isTrimming) {
                        return;
                    }
                    onTrim();
                }}
            >
                {isTrimming ? "Trimming" : "Trim"}
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

export default TrimVideo;
