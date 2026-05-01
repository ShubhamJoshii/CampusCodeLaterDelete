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
            Live: 42 Friends Competing Now
          </div>

          <h1 className="hero-title">
            Code Fast. <br />
            <span className="text-indigo">Outrank Friends.</span> <br />
            Own the Leaderboard.
          </h1>

          <p className="hero-description">
            The ultimate coding platform. Create private groups, track your friends' progress in real-time, and climb the ranks together.
          </p>

          <div className="hero-btns">
            <button onClick={() => navigate('/groups')} className="btn-primary">
              Create Your Group
            </button>
            <button onClick={() => navigate('/leaderboard')}  className="btn-secondary">
              View Global Ranks <span>→</span>
            </button>
          </div>

          <div className="hero-features">
            <div className="feature-item">
              <span className="check-mark">🏆</span> Daily Head-to-Head Challenges.
            </div>
            <div className="feature-item">
              <span className="check-mark">📊</span> Real-time "Friend Activity" Feed.
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          
          <div className="glass-card">
            <p className="card-header">Group Leaderboard</p>
            <div className="card-list">
              {[
                { name: "You", score: "1420", color: "#4f46e5", rank: 1 },
                { name: "Alex_Code", score: "1380", color: "#64748b", rank: 2 },
                { name: "Sarah.js", score: "1250", color: "#64748b", rank: 3 }
              ].map((user, i) => (
                <div key={i} className={`list-item ${i === 0 ? 'active-user' : ''}`}>
                  <div className="item-rank">{user.rank}</div>
                  <div className="item-skeleton">
                    <div className={`skeleton-title w-25 ${i === 0  ? "bg-[#4f46e5]  px-1 text-white!" : "bg-[e2e8f0]"}`} >{user.name}</div>
                    <div className="skeleton-subtitle">{user.score} pts</div>
                  </div>
                  {i === 0 && <span className="fire-emoji">🔥</span>}
                </div>
              ))}
            </div>

            <div className="float-badge">
              <div className="badge-check">⚡</div>
              <div>
                <p className="badge-label">New Activity</p>
                <p className="badge-value">Alex solved "Two Sum"</p>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
};

export default Home;