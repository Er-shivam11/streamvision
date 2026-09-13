import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Hls from 'hls.js';
import './VideoDetail.css';

const API_URL = 'http://localhost:8000';
const fallbackThumbnail = '/images/bg.jpg';

const toMediaUrl = (mediaPath) => {
  if (!mediaPath) return '';
  return mediaPath.startsWith('http')
    ? mediaPath
    : `${API_URL}${mediaPath.startsWith('/') ? '' : '/'}${mediaPath}`;
};

const formatDate = (value) => {
  if (!value) return null;
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return null;
  }
};

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

const VideoPlayer = ({ video }) => {
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(-1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const videoElement = videoRef.current;
    const hlsUrl = toMediaUrl(video.hls);

    if (!videoElement || !hlsUrl || !Hls.isSupported()) return undefined;

    const hls = new Hls();
    hls.loadSource(hlsUrl);
    hls.attachMedia(videoElement);
    videoElement.hlsInstance = hls;
    hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
      const levels = data.levels
        .map((level, index) => ({ index, height: level.height }))
        .filter((level, index, levels) => (
          level.height && levels.findIndex((item) => item.height === level.height) === index
        ))
        .sort((first, second) => second.height - first.height);
      setQualityLevels(levels);
    });

    return () => {
      delete videoElement.hlsInstance;
      hls.destroy();
    };
  }, [video.hls]);

  const hlsSupported = Boolean(video.hls && Hls.isSupported());

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  };

  const handleQualityChange = (event) => {
    const quality = Number(event.target.value);
    setSelectedQuality(quality);
    if (videoRef.current?.hlsInstance) videoRef.current.hlsInstance.currentLevel = quality;
  };

  const handlePlaybackRateChange = (event) => {
    const rate = Number(event.target.value);
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) playerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  return (
    <div className="player-shell" ref={playerRef}>
      <video
        ref={videoRef}
        className="player"
        src={hlsSupported ? undefined : toMediaUrl(video.hls || video.file)}
        poster={toMediaUrl(video.thumbnail) || fallbackThumbnail}
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
      >
        Your browser does not support the video tag.
      </video>
      <div className="player-controls">
        <input
          className="seek-control"
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={(event) => {
            const time = Number(event.target.value);
            setCurrentTime(time);
            if (videoRef.current) videoRef.current.currentTime = time;
          }}
          aria-label="Video progress"
        />
        <div className="player-control-row">
          <button className="player-icon-button" type="button" onClick={togglePlayback} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <span className="player-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <label className="volume-control" aria-label="Volume">
            <span aria-hidden="true">Vol</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(event) => {
                const nextVolume = Number(event.target.value);
                setVolume(nextVolume);
                if (videoRef.current) videoRef.current.volume = nextVolume;
              }}
            />
          </label>
          <div className="player-menu">
            <button
              className="player-menu-button"
              type="button"
              aria-label="More video options"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((isOpen) => !isOpen)}
            >
              More <span aria-hidden="true">⋮</span>
            </button>
            {menuOpen && (
              <div className="player-menu-popover">
                <label className="menu-option">
                  <span>Quality</span>
                  <select value={selectedQuality} onChange={handleQualityChange} disabled={!qualityLevels.length}>
                    <option value={-1}>Auto</option>
                    {qualityLevels.map((level) => (
                      <option value={level.index} key={level.index}>{level.height}p</option>
                    ))}
                  </select>
                </label>
                <label className="menu-option">
                  <span>Playback speed</span>
                  <select value={playbackRate} onChange={handlePlaybackRateChange}>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <option value={rate} key={rate}>{rate === 1 ? 'Normal' : `${rate}x`}</option>
                    ))}
                  </select>
                </label>
                <button className="menu-action" type="button" disabled>
                  Subtitles unavailable
                </button>
                {video.file && (
                  <a className="menu-action" href={toMediaUrl(video.file)} download>Download video</a>
                )}
              </div>
            )}
          </div>
          <button className="player-icon-button" type="button" onClick={toggleFullscreen} aria-label="Fullscreen">
            Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
};

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/media/${id}/`);
        setVideo(response.data);
      } catch (requestError) {
        setError('This video could not be loaded.');
      }
    };

    fetchVideo();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/media/`);
        const list = Array.isArray(response.data) ? response.data : response.data.results || [];
        setRelated(list.filter((item) => String(item.id) !== String(id)).slice(0, 8));
      } catch {
        setRelated([]);
      }
    };

    fetchRelated();
  }, [id]);

  if (error) return <p className="video-detail-message">{error}</p>;
  if (!video) return <p className="video-detail-message">Loading video…</p>;

  const uploadDate = formatDate(video.created_at);
  const status = video.status; // e.g. 'flagged' | 'normal', only rendered if present

  return (
    <main className="video-detail-page">
      <section
        className="stage"
        style={{ backgroundImage: `url(${toMediaUrl(video.thumbnail) || fallbackThumbnail})` }}
      >
        <div className="stage-overlay" />

        <div className="stage-inner">
          <Link className="back-link" to="/VideoList">
            Back to library
          </Link>

          <div className="player-wrap">
            <VideoPlayer video={video} />
          </div>
        </div>
      </section>

      <section className="details">
        <div className="details-main">
          <div className="title-row">
            <h1>{video.title}</h1>
            {status && (
              <span className={`status-badge ${status}`}>
                {status === 'flagged' ? 'Damage flagged' : 'Normal'}
              </span>
            )}
          </div>

          <div className="meta-row">
            {uploadDate && <span>{uploadDate}</span>}
            {video.duration && <span>{video.duration}</span>}
            {video.route && <span>{video.route}</span>}
          </div>

          <p className="description">
            {video.description || 'No description available.'}
          </p>

          <div className="detail-actions">
            <button className="btn btn-primary">Download report</button>
            <button className="btn btn-secondary">Share</button>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="more-like-this">
          <div className="section-heading">
            <h2>More like this</h2>
          </div>

          <div className="related-scroll">
            {related.map((item) => (
            //   <Link className="related-card" to={`/videos/${item.id}`} key={item.id}>
                <Link className="related-card" to={`/video/${item.id}`} key={item.id}>
                <div
                  className="related-thumb"
                  style={{
                    backgroundImage: `url(${toMediaUrl(item.thumbnail) || fallbackThumbnail})`,
                  }}
                >
                  <span className="play-icon" aria-hidden="true" />
                  {item.status && (
                    <span className={`status-badge ${item.status}`}>
                      {item.status === 'flagged' ? 'Flagged' : 'Normal'}
                    </span>
                  )}
                </div>
                <h4>{item.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default VideoDetail;