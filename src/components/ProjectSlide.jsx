import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const ProjectSlide = () => {
  const { currentProject, currentScene, currentSceneIndex, categories } = usePortfolio();
  const [animate, setAnimate] = useState(false);

  // Trigger animation reset when project or scene changes
  useEffect(() => {
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timeout);
  }, [currentProject?.id, currentSceneIndex]);

  if (!currentProject || !currentScene) return null;

  const category = categories.find(c => c.id === currentProject.categoryId);
  const steps = ['Overview', 'Why It Was Built', 'Challenges & Blocks', 'Solution & Findings'];

  return (
    <div className={`project-slide ${animate ? 'animate-in' : ''}`} style={{ '--project-color': category?.color }}>
      {/* Category Header */}
      <div className="slide-header">
        <span className="category-tag" style={{ color: category?.color }}>
          {category?.name}
        </span>
        <h1 className="project-title">{currentProject.title}</h1>
        <p className="project-tagline">{currentProject.tagline}</p>
      </div>

      {/* Narrative Progress Path (Overview -> Why -> Challenges -> Solution) */}
      <div className="scene-steps-nav">
        {steps.map((step, idx) => {
          const isPassed = currentSceneIndex > idx;
          const isActive = currentSceneIndex === idx;
          return (
            <div 
              key={step} 
              className={`step-indicator ${isPassed ? 'passed' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="step-dot">
                {isPassed ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (idx + 1)}
              </div>
              <span className="step-name">{step}</span>
              {idx < 3 && <div className="step-connector"></div>}
            </div>
          );
        })}
      </div>

      {/* Main content split: Left = Text Narrative, Right = Dynamic Data Visualization / Metrics */}
      <div className="slide-content-grid">
        <div className="narrative-pane">
          <h2 className="scene-headline">{currentScene.title}</h2>
          <p className="scene-paragraph">
            {currentScene.text}
          </p>
        </div>

        <div className="metric-pane">
          <div className="metric-card glass-panel">
            <span className="metric-label">{currentScene.metric.label}</span>
            <span className="metric-value" style={{ color: category?.color }}>{currentScene.metric.value}</span>
            
            {/* Visualizer background mesh based on project type */}
            <div className="mesh-visualizer">
              {currentProject.categoryId === 'data-analytics' && (
                <div className="analytics-visual">
                  <div className="bar" style={{ height: '30%' }}></div>
                  <div className="bar" style={{ height: '50%' }}></div>
                  <div className="bar" style={{ height: '45%' }}></div>
                  <div className="bar animate" style={{ height: '80%' }}></div>
                </div>
              )}
              {currentProject.categoryId === 'data-science' && (
                <div className="science-visual">
                  <svg viewBox="0 0 100 50" className="chart-line-svg">
                    <path d="M0,45 Q20,35 40,40 T80,10 T100,5" fill="none" stroke="var(--project-color)" strokeWidth="3"></path>
                    <circle cx="80" cy="10" r="4" fill="var(--project-color)"></circle>
                  </svg>
                </div>
              )}
              {currentProject.categoryId === 'product-development' && (
                <div className="product-visual">
                  <div className="box first"></div>
                  <div className="box second"></div>
                  <div className="box third"></div>
                </div>
              )}
              {currentProject.categoryId === 'ai-products' && (
                <div className="ai-visual">
                  <div className="pulse-ring"></div>
                  <div className="pulse-dot"></div>
                </div>
              )}
              {currentProject.categoryId === 'startup-ideas' && (
                <div className="startup-visual">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--project-color)" strokeWidth="1.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
              )}
              {currentProject.categoryId === 'academic-research' && (
                <div className="research-visual">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--project-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectSlide;
