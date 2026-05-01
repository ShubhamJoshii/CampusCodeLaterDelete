import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Home.css"
const Home = () => {
  const navigate = useNavigate();

  return (
      <main className="hero-section">
        <div className="hero-content">
          <div className="learner-badge">
            <span className="ping-container">
              <span className="ping-animate"></span>
              <span className="ping-dot"></span>
            </span>
            15,000+ Campus Learners
          </div>

          <h1 className="hero-title">
            ONE STOP <br />
            <span className="text-indigo">Learning Platform</span> <br />
            For TECH Interviews
          </h1>

          <p className="hero-description">
            Master DSA, System Design, and Core CS Subjects with personalized roadmaps and real-time coding challenges.
          </p>

          <div className="hero-btns">
            <button onClick={() => navigate('/signup')} className="btn-primary">
              Start Learning for Free
            </button>
            <button onClick={() => navigate('/problems')}  className="btn-secondary">
              Explore Problems <span>→</span>
            </button>
          </div>

          <div className="hero-features">
            <div className="feature-item">
              <span className="check-mark">✔</span> Curated sheets designed by experts.
            </div>
            <div className="feature-item">
              <span className="check-mark">✔</span> Detailed video editorials for every problem.
            </div>
          </div>
        </div>

        {/* Decorative Image/UI Card Mockup */}
        <div className="hero-visual">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          
          <div className="glass-card">
            <div className="card-skeleton-line"></div>
            <div className="card-list">
              {[1, 2, 3].map(i => (
                <div key={i} className="list-item">
                  <div className="item-icon">🚀</div>
                  <div className="item-skeleton">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-subtitle"></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Float Badge */}
            <div className="float-badge">
              <div className="badge-check">✓</div>
              <div>
                <p className="badge-label">Success</p>
                <p className="badge-value">Solved 2 Sum</p>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
};

export default Home;