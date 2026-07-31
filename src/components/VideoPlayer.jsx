import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import ProjectSlide from './ProjectSlide';
import Timeline from './Timeline';
import Controls from './Controls';
import DeepDive from './DeepDive';

export const VideoPlayer = () => {
  const {
    currentProjectIndex,
    isPlaying,
    hasStarted,
    projects,
    startPortfolio,
    play,
    jumpToProject
  } = usePortfolio();

  return (
    <div className="portfolio-video-player glass-panel">
      {/* Top Banner / Brand logo */}
      <div className="player-brand-header">
        <div className="brand-logo">
          <span className="rec-dot animate-pulse"></span>
          <span className="brand-name">PORTFOLIO.LIVE</span>
        </div>
        <div className="active-mode-tag">
          {isPlaying ? 'PLAYING PREVIEW' : 'PAUSED'}
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="player-viewport">
        {/* Scenario 1: Intro Splash Screen */}
        {currentProjectIndex === -1 && (
          <div className="splash-view intro-splash">
            <div className="splash-content">
              <div className="eyebrow-text">WELCOME TO MY DIGITAL SPACE</div>
              <h1 className="cinematic-title">
                Chidiebere's <span>Interactive Portfolio</span>
              </h1>
              <p className="splash-description">
                Experience a curated tour through my projects in Data Analytics, Data Science, Product Development, and AI implementations. Play it like a short movie (~5 minutes), or pause to inspect the code at any time.
              </p>
              
              <button className="primary-play-btn" onClick={startPortfolio}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Play Portfolio Experience</span>
              </button>
            </div>
          </div>
        )}

        {/* Scenario 2: Active Project Presentation */}
        {currentProjectIndex >= 0 && currentProjectIndex < projects.length && (
          <ProjectSlide />
        )}

        {/* Scenario 3: Outro Splash Screen */}
        {currentProjectIndex === projects.length && (
          <div className="splash-view outro-splash">
            <div className="splash-content">
              <div className="eyebrow-text">THANKS FOR WATCHING</div>
              <h1 className="cinematic-title">Let's build something <span>together</span></h1>
              <p className="splash-description">
                You have completed the full walk-through of my core works. Feel free to jump to any chapter using the menu, or reach out directly to discuss collaborations.
              </p>

              <div className="outro-actions-grid">
                <button className="replay-btn" onClick={() => jumpToProject(-1)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                  </svg>
                  <span>Replay Tour</span>
                </button>
                
                <a href="mailto:contact@example.com" className="contact-btn-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>Email Me</span>
                </a>

                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="linkedin-btn-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Seek timeline at bottom */}
      <Timeline />

      {/* Persistent Control bar */}
      <Controls />

      {/* Sliding Inspector overlay */}
      <DeepDive />
    </div>
  );
};
export default VideoPlayer;
