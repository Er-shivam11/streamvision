import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VideoList.css';

const API_URL = 'http://localhost:8000';
const fallbackThumbnail = '/images/bg.jpg';

const toMediaUrl = (mediaPath) => {
  if (!mediaPath) return '';
  return mediaPath.startsWith('http')
    ? mediaPath
    : `${API_URL}${mediaPath.startsWith('/') ? '' : '/'}${mediaPath}`;
};

const VideoCard = ({ video, onOpen }) => (
  <div
    className="video-card"
    onClick={() => onOpen(video.id)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onOpen(video.id);
    }}
  >
    <div
      className="video-thumb"
      style={{ backgroundImage: `url(${toMediaUrl(video.thumbnail) || fallbackThumbnail})` }}
    >
      <span className="play-icon" aria-hidden="true" />
      {video.status && (
        <span className={`status-badge ${video.status}`}>
          {video.status === 'flagged' ? 'Flagged' : 'Normal'}
        </span>
      )}
    </div>
    <p className="video-card-title">{video.title}</p>
  </div>
);

const VideoRow = ({ title, items, onOpen }) => {
  if (!items.length) return null;
  return (
    <section className="video-row">
      <h3 className="row-title">{title}</h3>
      <div className="row-scroll">
        {items.map((video) => (
          <VideoCard video={video} key={video.id} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
};

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/media/`);
        const list = Array.isArray(response.data) ? response.data : response.data.results || [];
        setVideos(list);
      } catch (error) {
        console.error('Error fetching videos: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const featured = videos[0];

  const flagged = useMemo(() => videos.filter((v) => v.status === 'flagged'), [videos]);
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return videos;
    const term = searchTerm.trim().toLowerCase();
    return videos.filter((v) => (v.title || '').toLowerCase().includes(term));
  }, [videos, searchTerm]);

  const openVideo = (id) => navigate(`/video/${id}`);

  if (loading) {
    return <div className="video-list-message">Loading library…</div>;
  }

  if (videos.length === 0) {
    return (
      <div className="video-list-empty">
        <img src={fallbackThumbnail} alt="" />
        <p>No videos available yet.</p>
      </div>
    );
  }

  return (
    <div className="video-list-page">
      <header className="browse-bar">
        <span className="brand">FleetWatch</span>
        <input
          type="search"
          className="search-input"
          placeholder="Search routes or titles…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      {searchTerm.trim() ? (
        <div className="search-results">
          <h3 className="row-title">
            {filtered.length ? `Results for "${searchTerm}"` : `No matches for "${searchTerm}"`}
          </h3>
          <div className="results-grid">
            {filtered.map((video) => (
              <VideoCard video={video} key={video.id} onOpen={openVideo} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {featured && (
            <section className="hero">
              <video
                className="hero-video"
                src={toMediaUrl(featured.file)}
                autoPlay
                muted={muted}
                loop
                playsInline
              >
                Your browser does not support the video tag.
              </video>
              <div className="hero-gradient" />

              <div className="hero-content">
                {featured.status === 'flagged' && (
                  <span className="status-badge flagged hero-badge">Damage flagged</span>
                )}
                <h1 className="hero-title">{featured.title}</h1>
                <p className="hero-description">
                  {featured.description || 'Live footage from the fleet, streaming now.'}
                </p>
                <div className="hero-actions">
                  <button className="btn btn-primary" onClick={() => openVideo(featured.id)}>
                    Play
                  </button>
                  <button className="btn btn-secondary" onClick={() => openVideo(featured.id)}>
                    More info
                  </button>
                </div>
              </div>

              <button
                className="mute-toggle"
                onClick={() => setMuted((prev) => !prev)}
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? '🔇' : '🔊'}
              </button>
            </section>
          )}

          <div className="rows-wrap">
            <VideoRow title="Flagged for review" items={flagged} onOpen={openVideo} />
            <VideoRow title="Recently added" items={videos} onOpen={openVideo} />
          </div>
        </>
      )}
    </div>
  );
};

export default VideoList;