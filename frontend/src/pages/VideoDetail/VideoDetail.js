import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
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
            <video
              className="player"
              src={toMediaUrl(video.file)}
              poster={toMediaUrl(video.thumbnail) || fallbackThumbnail}
              controls
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
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