import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const DeepDive = () => {
  const { isDeepDiveOpen, setIsDeepDiveOpen, currentProject } = usePortfolio();
  const [copied, setCopied] = useState(false);

  if (!isDeepDiveOpen || !currentProject) return null;

  const data = currentProject.deepDive;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="deep-dive-overlay" onClick={() => setIsDeepDiveOpen(false)}>
      <div className="deep-dive-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="deep-dive-header">
          <div className="title-group">
            <span className="project-category-badge">{currentProject.categoryId.replace('-', ' ').toUpperCase()}</span>
            <h2>{currentProject.title}</h2>
          </div>
          <button className="close-panel-btn" onClick={() => setIsDeepDiveOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="deep-dive-body">
          {/* Section: Overview */}
          <div className="deep-dive-section">
            <h3>Technical Architecture & Stack</h3>
            <p className="architecture-text">{data.description}</p>
            <div className="architecture-diagram-box">
              <div className="diagram-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="diagram-flow">
                <strong>Flow:</strong> {data.architecture}
              </div>
            </div>
          </div>

          {/* Section: Code Snippet */}
          {data.codeSnippet && (
            <div className="deep-dive-section">
              <div className="code-header">
                <h3>Core Implementation Snippet</h3>
                <button className="copy-code-btn" onClick={handleCopyCode}>
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="code-block">
                <code>{data.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Section: Action Links */}
          <div className="deep-dive-links">
            {data.githubLink && (
              <a href={data.githubLink} target="_blank" rel="noopener noreferrer" className="deep-dive-link github">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>View Repository</span>
              </a>
            )}

            {data.liveLink && (
              <a href={data.liveLink} target="_blank" rel="noopener noreferrer" className="deep-dive-link live">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>Visit Live App</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeepDive;
