import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Timeline = () => {
  const {
    currentProjectIndex,
    currentSceneIndex,
    projects,
    categories,
    flatIndex,
    totalScenes,
    isPlaying,
    jumpToProject,
    nextScene,
    prevScene
  } = usePortfolio();

  // Create markers for category boundaries
  const categoryMarkers = [];
  let currentAccumulator = 0;

  categories.forEach((cat) => {
    const categoryProjects = projects.filter(p => p.categoryId === cat.id);
    if (categoryProjects.length === 0) return;

    categoryMarkers.push({
      category: cat,
      startIndex: currentAccumulator,
      projectCount: categoryProjects.length,
      widthPercent: (categoryProjects.length * 4 / totalScenes) * 100
    });
    
    currentAccumulator += categoryProjects.length * 4;
  });

  const handleTimelineClick = (e, index) => {
    e.stopPropagation();
    const projectIdx = Math.floor(index / 4);
    jumpToProject(projectIdx);
  };

  return (
    <div className="timeline-container">
      {/* Category Labels above timeline */}
      <div className="timeline-categories">
        {categoryMarkers.map((marker, i) => {
          const isActive = projects[currentProjectIndex]?.categoryId === marker.category.id;
          return (
            <div 
              key={marker.category.id} 
              className={`timeline-category-label ${isActive ? 'active' : ''}`}
              style={{ 
                width: `${marker.widthPercent}%`,
                '--cat-color': marker.category.color
              }}
              onClick={() => jumpToProject(Math.floor(marker.startIndex / 4))}
            >
              <span className="dot" style={{ backgroundColor: marker.category.color }}></span>
              <span className="label-text">{marker.category.name}</span>
            </div>
          );
        })}
      </div>

      {/* Main progress seek bar */}
      <div className="seek-bar-track">
        {Array.from({ length: totalScenes }).map((_, idx) => {
          const projectIdx = Math.floor(idx / 4);
          const sceneIdx = idx % 4;
          const isPassed = flatIndex > idx;
          const isActive = flatIndex === idx;
          
          const associatedProject = projects[projectIdx];
          const associatedCategory = categories.find(c => c.id === associatedProject.categoryId);
          
          let stateClass = '';
          if (isPassed) stateClass = 'passed';
          if (isActive) stateClass = 'active';

          return (
            <div
              key={idx}
              className={`seek-segment ${stateClass}`}
              style={{ 
                width: `${100 / totalScenes}%`,
                '--segment-color': associatedCategory?.color || 'var(--text-muted)'
              }}
              onClick={(e) => handleTimelineClick(e, idx)}
              title={`${associatedProject.title} - ${associatedProject.scenes[sceneIdx].title}`}
            >
              <div className="seek-fill"></div>
            </div>
          );
        })}
      </div>

      {/* Time Display */}
      <div className="time-display">
        <span>
          {currentProjectIndex === -1 ? 'Intro' : 
           currentProjectIndex === projects.length ? 'Outro' : 
           `Scene ${flatIndex + 1} / ${totalScenes}`}
        </span>
        <span className="project-title-mini">
          {projects[currentProjectIndex] ? projects[currentProjectIndex].title : ''}
        </span>
      </div>
    </div>
  );
};
export default Timeline;
