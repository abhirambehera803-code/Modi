import React from 'react';
import { sound } from '../services/soundService';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onQuitToMenu: () => void;
  bgmEnabled: boolean;
  onToggleBgm: () => void;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onQuitToMenu,
  bgmEnabled,
  onToggleBgm,
  sfxEnabled,
  onToggleSfx,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 border-4 border-amber-600 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
        <span className="text-4xl mb-2 animate-bounce">⏸️</span>
        <h2 className="text-3xl font-cartoon font-bold text-amber-200 mb-1 text-stroke">
          Game Paused
        </h2>
        <p className="text-xs text-amber-300/80 mb-6">Take a quick chai break!</p>

        {/* Audio Quick Toggles */}
        <div className="flex items-center gap-3 mb-6 bg-amber-950/80 border border-amber-800/80 px-4 py-2 rounded-2xl">
          <button
            id="pause-bgm-toggle"
            onClick={() => {
              sound.playClick();
              onToggleBgm();
            }}
            className="flex items-center gap-1.5 text-xs font-cartoon text-amber-200 cursor-pointer"
          >
            <span>{bgmEnabled ? '🎵 Music ON' : '🔇 Music OFF'}</span>
          </button>
          <span className="text-amber-700">•</span>
          <button
            id="pause-sfx-toggle"
            onClick={() => {
              sound.playClick();
              onToggleSfx();
            }}
            className="flex items-center gap-1.5 text-xs font-cartoon text-amber-200 cursor-pointer"
          >
            <span>{sfxEnabled ? '🔊 SFX ON' : '🔇 SFX OFF'}</span>
          </button>
        </div>

        {/* Main Action Buttons */}
        <div className="w-full space-y-3">
          <button
            id="resume-btn"
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="btn-cartoon-green w-full py-3.5 rounded-2xl font-cartoon font-bold text-lg text-white tracking-wide shadow-md cursor-pointer active:scale-95"
          >
            ▶️ Resume
          </button>

          <button
            id="restart-level-btn"
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="btn-cartoon-orange w-full py-3 rounded-2xl font-cartoon font-bold text-base text-white tracking-wide shadow-md cursor-pointer active:scale-95"
          >
            🔄 Restart Level
          </button>

          <button
            id="quit-to-menu-btn"
            onClick={() => {
              sound.playClick();
              onQuitToMenu();
            }}
            className="btn-cartoon-blue w-full py-3 rounded-2xl font-cartoon font-bold text-base text-white tracking-wide shadow-md cursor-pointer active:scale-95"
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
