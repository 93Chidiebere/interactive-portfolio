import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { projects, categories } from '../data/projectsData';

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

// Dynamic background music URL (defaulting to a beautiful ambient track)
const AMBIENT_MUSIC_URL = import.meta.env.BASE_URL + 'Adiemus.mp3';

export const PortfolioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(-1); // -1 is Intro screen
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0); // 0: Overview, 1: Why, 2: Challenges, 3: Solution
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 1.5x, 2x
  const [isMuted, setIsMuted] = useState(true); // Mute speech synthesis by default to respect browser policies
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const musicRef = useRef(null);
  const sceneAudioRef = useRef(null); // Reference for custom narration audio tracks
  
  // Timer ref for fallback mode (when muted or speech unsupported)
  const timerRef = useRef(null);
  const utteranceRef = useRef(null);

  // Total runtime calculations (for progress indicators)
  const totalScenes = projects.length * 4;
  
  // Get active items
  const currentProject = currentProjectIndex >= 0 && currentProjectIndex < projects.length 
    ? projects[currentProjectIndex] 
    : null;
  const currentScene = currentProject ? currentProject.scenes[currentSceneIndex] : null;

  // Calculate current flat index (from 0 to totalScenes - 1)
  const getFlatIndex = () => {
    if (currentProjectIndex < 0) return -1;
    if (currentProjectIndex >= projects.length) return totalScenes;
    return currentProjectIndex * 4 + currentSceneIndex;
  };

  // Navigations
  const startPortfolio = () => {
    setHasStarted(true);
    setCurrentProjectIndex(0);
    setCurrentSceneIndex(0);
    setIsPlaying(true);
    setIsMusicPlaying(true); // Auto-start background music
  };

  const pause = () => {
    setIsPlaying(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
    if (sceneAudioRef.current) {
      sceneAudioRef.current.pause();
    }
  };

  const play = () => {
    setHasStarted(true);
    if (currentProjectIndex === -1) {
      setCurrentProjectIndex(0);
      setCurrentSceneIndex(0);
    }
    setIsPlaying(true);
    if (window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    if (sceneAudioRef.current && sceneAudioRef.current.paused) {
      sceneAudioRef.current.play().catch(err => console.warn("Custom audio resume failed", err));
    }
  };

  const nextScene = () => {
    if (currentProjectIndex === -1) {
      setCurrentProjectIndex(0);
      setCurrentSceneIndex(0);
      return;
    }

    if (currentSceneIndex < 3) {
      setCurrentSceneIndex(prev => prev + 1);
    } else if (currentProjectIndex < projects.length - 1) {
      setCurrentProjectIndex(prev => prev + 1);
      setCurrentSceneIndex(0);
    } else {
      // Completed last project
      setIsPlaying(false);
      setCurrentProjectIndex(projects.length); // Outro/End screen
      setCurrentSceneIndex(0);
    }
  };

  const prevScene = () => {
    if (currentProjectIndex === -1) return;
    
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
    } else if (currentProjectIndex > 0) {
      setCurrentProjectIndex(prev => prev - 1);
      setCurrentSceneIndex(3);
    } else {
      // Back to intro
      setCurrentProjectIndex(-1);
      setCurrentSceneIndex(0);
      setIsPlaying(false);
    }
  };

  const jumpToProject = (projectIndex) => {
    if (projectIndex >= -1 && projectIndex <= projects.length) {
      setCurrentProjectIndex(projectIndex);
      setCurrentSceneIndex(0);
      setIsPlaying(true);
    }
  };

  // Speak narration
  const speakActiveScene = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel active speech
    window.speechSynthesis.cancel();

    if (isMuted || !isPlaying || !currentScene) return;

    const cleanSceneTitle = currentScene.title.replace('&', 'and');
    const textToSpeak = currentSceneIndex === 0
      ? `${currentProject.title}. Overview: ${currentScene.text}`
      : `${cleanSceneTitle}: ${currentScene.text}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;
    
    // Attempt to load standard natural-sounding English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      v => v.lang.startsWith('en') && 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft'))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.rate = playbackSpeed;
    
    utterance.onend = () => {
      if (isPlaying) {
        nextScene();
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech error, falling back to timer", e);
      startFallbackTimer(textToSpeak.length);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Play custom pre-recorded audio recording if provided, else fall back to synthesized TTS
  const playCustomAudioOrTTS = () => {
    if (sceneAudioRef.current) {
      sceneAudioRef.current.pause();
      sceneAudioRef.current = null;
    }

    if (isMuted || !isPlaying) return;

    if (currentScene.audioPath) {
      const finalAudioPath = currentScene.audioPath.startsWith('http') || currentScene.audioPath.startsWith('data:')
        ? currentScene.audioPath
        : import.meta.env.BASE_URL + currentScene.audioPath.replace(/^\//, '');
      const audio = new Audio(finalAudioPath);
      sceneAudioRef.current = audio;
      audio.volume = 1.0;
      audio.playbackRate = playbackSpeed;

      audio.onended = () => {
        if (isPlaying) {
          nextScene();
        }
      };

      audio.onerror = (e) => {
        console.warn("Custom audio file loading failed, falling back to TTS", e);
        speakActiveScene();
      };

      audio.play().catch(err => {
        console.warn("Custom audio play blocked or failed, falling back to TTS", err);
        speakActiveScene();
      });
    } else {
      speakActiveScene();
    }
  };

  // Helper to start fallback timer based on text reading speed
  const startFallbackTimer = (charLength) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Baseline: ~15 characters per second at 1x speed.
    const baseDuration = (charLength / 15) * 1000;
    // Add small buffer for slide transitions
    const adjustedDuration = Math.max(5000, baseDuration) / playbackSpeed;

    timerRef.current = setTimeout(() => {
      if (isPlaying) {
        nextScene();
      }
    }, adjustedDuration);
  };

  // Handle Playback State Transitions
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (sceneAudioRef.current) {
      sceneAudioRef.current.pause();
      sceneAudioRef.current = null;
    }

    if (!isPlaying) {
      return;
    }

    // If active scene is available
    if (currentScene) {
      if (!isMuted) {
        playCustomAudioOrTTS();
      } else {
        startFallbackTimer(currentScene.text.length + 30);
      }
    } else if (currentProjectIndex === -1) {
      // Intro screen duration (5 seconds)
      timerRef.current = setTimeout(() => {
        nextScene();
      }, 5000 / playbackSpeed);
    } else if (currentProjectIndex === projects.length) {
      // Outro screen - stop playback
      setIsPlaying(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentProjectIndex, currentSceneIndex, isPlaying, isMuted, playbackSpeed]);

  // Pause speech synthesis when user opens deep dive modal
  useEffect(() => {
    if (isDeepDiveOpen) {
      pause();
    }
  }, [isDeepDiveOpen]);

  // Initialize background music
  useEffect(() => {
    musicRef.current = new Audio(AMBIENT_MUSIC_URL);
    musicRef.current.loop = true;
    musicRef.current.volume = 0.15; // Set volume soft in background

    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, []);

  // Manage music play/pause states based on playback and settings
  useEffect(() => {
    if (!musicRef.current) return;

    if (isPlaying && isMusicPlaying) {
      musicRef.current.play().catch(err => {
        console.warn("Audio play blocked by browser policy until user interaction:", err);
      });
    } else {
      musicRef.current.pause();
    }
  }, [isPlaying, isMusicPlaying]);

  // Clean up speech and audio on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (sceneAudioRef.current) {
        sceneAudioRef.current.pause();
        sceneAudioRef.current = null;
      }
    };
  }, []);

  return (
    <PortfolioContext.Provider value={{
      isPlaying,
      currentProjectIndex,
      currentSceneIndex,
      playbackSpeed,
      isMuted,
      isDeepDiveOpen,
      hasStarted,
      projects,
      categories,
      currentProject,
      currentScene,
      totalScenes,
      flatIndex: getFlatIndex(),
      startPortfolio,
      play,
      pause,
      nextScene,
      prevScene,
      jumpToProject,
      setPlaybackSpeed,
      setIsMuted,
      setIsDeepDiveOpen,
      setHasStarted,
      isMusicPlaying,
      setIsMusicPlaying
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
