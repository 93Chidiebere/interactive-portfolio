import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Controls = () => {
  const {
    isPlaying,
    currentProjectIndex,
    playbackSpeed,
    isMuted,
    isDeepDiveOpen,
    projects,
    play,
    pause,
    nextScene,
    prevScene,
    jumpToProject,
    setPlaybackSpeed,
    setIsMuted,
    setIsDeepDiveOpen,
    isMusicPlaying,
    setIsMusicPlaying
  } = usePortfolio();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSpeed = () => {
    if (playbackSpeed === 1) setPlaybackSpeed(1.5);
    else if (playbackSpeed === 1.5) setPlaybackSpeed(2);
    else setPlaybackSpeed(1);
  };

  const currentProject = projects[currentProjectIndex];

  return (
    <div className="player-controls">
      {/* Chapter Dropdown Selector */}
      <div className="chapter-selector-container">
        <button 
          className="control-btn chapter-select-btn" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title="Chapters"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
          <span className="chapter-label">
            {currentProjectIndex === -1 ? 'Intro' : 
             currentProjectIndex === projects.length ? 'Outro' : 
             `Chapter ${currentProjectIndex + 1}: ${currentProject?.title.substring(0, 20)}...`}
          </span>
        </button>

        {isDropdownOpen && (
          <div className="chapter-dropdown">
            <div 
              className={`dropdown-item ${currentProjectIndex === -1 ? 'active' : ''}`}
              onClick={() => { jumpToProject(-1); setIsDropdownOpen(false); }}
            >
              Intro Scene
            </div>
            {projects.map((p, idx) => (
              <div 
                key={p.id}
                className={`dropdown-item ${currentProjectIndex === idx ? 'active' : ''}`}
                onClick={() => { jumpToProject(idx); setIsDropdownOpen(false); }}
              >
                {idx + 1}. {p.title}
              </div>
            ))}
            <div 
              className={`dropdown-item ${currentProjectIndex === projects.length ? 'active' : ''}`}
              onClick={() => { jumpToProject(projects.length); setIsDropdownOpen(false); }}
            >
              Outro & Contact
            </div>
          </div>
        )}
      </div>

      {/* Main Playback Controls */}
      <div className="playback-group">
        <button 
          className="control-btn" 
          onClick={prevScene} 
          title="Previous Scene"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="19 20 9 12 19 4 19 20"></polygon>
            <line x1="5" y1="19" x2="5" y2="5"></line>
          </svg>
        </button>

        {isPlaying ? (
          <button 
            className="control-btn play-pause-btn active" 
            onClick={pause} 
            title="Pause"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            </svg>
          </button>
        ) : (
          <button 
            className="control-btn play-pause-btn" 
            onClick={play} 
            title="Play"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        )}

        <button 
          className="control-btn" 
          onClick={nextScene} 
          title="Next Scene"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4"></polygon>
            <line x1="19" y1="5" x2="19" y2="19"></line>
          </svg>
        </button>
      </div>

      {/* Utility Panel */}
      <div className="utility-group">
        {/* Speed Adjustment */}
        <button 
          className="control-btn speed-btn" 
          onClick={toggleSpeed} 
          title="Playback Speed"
        >
          {playbackSpeed}x
        </button>

        {/* Voiceover Toggle */}
        <button 
          className={`control-btn voice-btn ${!isMuted ? 'speaking' : ''}`} 
          onClick={() => setIsMuted(!isMuted)} 
          title={isMuted ? "Unmute Voiceover" : "Mute Voiceover"}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg className="sound-wave-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </button>

        {/* Ambient Music Toggle */}
        <button 
          className={`control-btn music-toggle-btn ${isMusicPlaying ? 'playing' : ''}`} 
          onClick={() => setIsMusicPlaying(!isMusicPlaying)} 
          title={isMusicPlaying ? "Mute Background Music" : "Play Background Music"}
        >
          {isMusicPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
              <line x1="3" y1="3" x2="21" y2="21"></line>
            </svg>
          )}
        </button>

        {/* Pause & Inspect Deep Dive Button */}
        {currentProject && (
          <button 
            className="deep-dive-trigger-btn"
            onClick={() => setIsDeepDiveOpen(true)}
            title="Inspect project details"
          >
            <span>Pause & Inspect</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
export default Controls;
