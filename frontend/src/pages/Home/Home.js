import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const API_URL = 'http://localhost:8000';
const fallbackThumbnail = '/images/bg.jpg';

const images = [
  '/images/bg.jpg',
  '/images/2.jpg',
  '/images/1.jpg',
];

const texts = [
  'Stream what moves you',
  'New titles added every week',
  'Your next favorite is one click away',
];

const toMediaUrl = (mediaPath) => {
  if (!mediaPath) return '';
  return mediaPath.startsWith('http')
    ? mediaPath
    : `${API_URL}${mediaPath.startsWith('/') ? '' : '/'}${mediaPath}`;
};

const perks = [
  {
    title: 'Watch anywhere',
    body: 'Start on your phone, pick up on your TV. Your place in every title is saved automatically.',
  },
  {
    title: 'No ads, ever',
    body: 'Every title plays start to finish without interruptions.',
  },
  {
    title: 'New titles weekly',
    body: 'Fresh releases and catalog favorites are added to the library every week.',
  },
];

const Home = (props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/media/`);
        const list = Array.isArray(response.data) ? response.data : response.data.results || [];
        setTrending(list.slice(0, 10));
      } catch (error) {
        setTrending([]);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="ott-home">
      {/* HERO */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">
            {texts[currentImageIndex]}
            {props.username ? `, ${props.username}` : ''}
          </h1>

          <p className="hero-subtitle">
            Unlimited movies and shows, streaming in one place. Cancel anytime.
          </p>

          <div className="hero-actions">
            <Link to="/VideoList" className="btn btn-primary">
              Browse titles
            </Link>
            <Link to="/VideoList" className="btn btn-secondary">
              Watch trailer
            </Link>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* TRENDING ROW */}
      {trending.length > 0 && (
        <section className="trending-row">
          <div className="section-heading">
            <h2>Trending now</h2>
            <p>What everyone's watching this week.</p>
          </div>

          <div className="trending-scroll">
            {trending.map((item) => (
              <Link className="trending-card" to={`/video/${item.id}`} key={item.id}>
                <div
                  className="trending-thumb"
                  style={{
                    backgroundImage: `url(${toMediaUrl(item.thumbnail) || fallbackThumbnail})`,
                  }}
                >
                  <span className="play-icon" aria-hidden="true" />
                </div>
                <h4>{item.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PERKS */}
      <section className="perks">
        <div className="section-heading">
          <h2>Why watch here</h2>
        </div>

        <div className="perks-grid">
          {perks.map((perk) => (
            <div className="perk-card" key={perk.title}>
              <h3>{perk.title}</h3>
              <p>{perk.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="cta-banner">
        <h2>Ready to start watching?</h2>
        <p>Jump into the full library, free with your account.</p>
        <Link to="/VideoList" className="btn btn-primary">
          Browse titles
        </Link>
      </section>
    </div>
  );
};

export default Home;