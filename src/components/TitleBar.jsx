import React, { useState, useEffect } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';

const TitleBar = ({ title = "Kas Sekolah" }) => {
  const [windowState, setWindowState] = useState({
    isMaximized: false,
    isMinimized: false,
    isFullScreen: false
  });

  useEffect(() => {
    // Get initial window state
    if (window.electronAPI) {
      window.electronAPI.getWindowState().then(state => {
        if (state) {
          setWindowState(state);
        }
      });
    }
  }, []);

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow().then(() => {
        // Update state after maximize/restore
        window.electronAPI.getWindowState().then(state => {
          if (state) {
            setWindowState(state);
          }
        });
      });
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  };

  // Check if we're in Electron
  const isElectron = window.electronAPI !== undefined;

  if (!isElectron) {
    // Don't show title bar in web browser
    return null;
  }

  return (
    <div className="flex items-center justify-between bg-gray-100 border-b border-gray-200 h-8 select-none">
      {/* Left side - App icon and title */}
      <div className="flex items-center px-2 space-x-2">
        <img 
          src="/vite.svg" 
          alt="App Icon" 
          className="w-4 h-4" 
        />
        <span className="text-sm font-medium text-gray-700">
          {title}
        </span>
      </div>

      {/* Draggable area */}
      <div 
        className="flex-1 h-full"
        style={{ 
          WebkitAppRegion: 'drag',
          appRegion: 'drag' 
        }}
      />

      {/* Right side - Window controls */}
      <div className="flex">
        {/* Minimize button */}
        <button
          onClick={handleMinimize}
          className="flex items-center justify-center w-12 h-8 text-gray-600 hover:bg-gray-200 transition-colors"
          style={{ 
            WebkitAppRegion: 'no-drag',
            appRegion: 'no-drag' 
          }}
          title="Minimize"
        >
          <Minus size={14} />
        </button>

        {/* Maximize/Restore button */}
        <button
          onClick={handleMaximize}
          className="flex items-center justify-center w-12 h-8 text-gray-600 hover:bg-gray-200 transition-colors"
          style={{ 
            WebkitAppRegion: 'no-drag',
            appRegion: 'no-drag' 
          }}
          title={windowState.isMaximized ? "Restore" : "Maximize"}
        >
          {windowState.isMaximized ? (
            <Copy size={14} />
          ) : (
            <Square size={14} />
          )}
        </button>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="flex items-center justify-center w-12 h-8 text-gray-600 hover:bg-red-500 hover:text-white transition-colors"
          style={{ 
            WebkitAppRegion: 'no-drag',
            appRegion: 'no-drag' 
          }}
          title="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;