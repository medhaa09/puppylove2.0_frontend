import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { FaPlay, FaPause } from "react-icons/fa";
import axios from "axios";

interface YoutubeAudioPlayerProps {
  youtubeUrl: string;
}

const getMetadata = async (videoUrl: string) => {
  try {
    const requestUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
    const result = await axios.get(requestUrl);
    return result.data;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return null;
  }
};

const YoutubeAudioPlayer: React.FC<YoutubeAudioPlayerProps> = ({ youtubeUrl }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [title, setTitle] = useState<string | null>(null);
  const [artist, setArtist] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const playerRef = useRef<ReactPlayer | null>(null);

  useEffect(() => {
    if (youtubeUrl) {
      setLoading(true);
      getMetadata(youtubeUrl)
        .then((metadata) => {
          if (metadata) {
            setTitle(metadata.title);
            setArtist(metadata.author_name);
            setThumbnail(metadata.thumbnail_url);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [youtubeUrl]);

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (playing) {
        playerRef.current.getInternalPlayer()?.pauseVideo();
      } else {
        playerRef.current.getInternalPlayer()?.playVideo();
      }
      setPlaying(!playing);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        width: "380px",
        background: "transparent",
        height: "100px",
      }}
    >
      {loading ? (
        <div style={{ width: "100%", textAlign: "center", fontSize: "14px", color: "#555" }}>
          Loading...
        </div>
      ) : (
        <>
          {thumbnail && (
            <img
              src={thumbnail}
              alt="Thumbnail"
              style={{
                width: "100px",
                height: "95%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          )}

          <div style={{ flex: 1, paddingLeft: "10px" }}>
            <h4
              style={{
                margin: "0",
                fontSize: "16px",
                whiteSpace: "normal",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                wordBreak: "break-word",
              }}
            >
              {title || "Now Playing"}
            </h4>
            <p style={{ margin: "5px 0", fontSize: "12px", color: "#555" }}>
              {artist || "Unknown Artist"}
            </p>

            <ReactPlayer
              ref={playerRef}
              url={youtubeUrl}
              playing={playing}
              volume={volume}
              width="0px"
              height="0px"
              controls={false}
              config={{ youtube: { playerVars: { showinfo: 0, controls: 0 } } }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />

            <button
              onClick={togglePlayPause}
              style={{
                cursor: "pointer",
                background: "transparent",
                border: "none",
                fontSize: "24px",
              }}
            >
              {playing ? <FaPause /> : <FaPlay />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default YoutubeAudioPlayer;
