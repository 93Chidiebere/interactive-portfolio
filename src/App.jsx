import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import VideoPlayer from './components/VideoPlayer';

function App() {
  return (
    <PortfolioProvider>
      <VideoPlayer />
    </PortfolioProvider>
  );
}

export default App;
