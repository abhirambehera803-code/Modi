import React from 'react';
import { Costume, LevelConfig } from '../types';
import { CharacterPreview } from './CharacterPreview';
import { sound } from '../services/soundService';

interface MainMenuProps {
  currentCostume: Costume;
  coins: number;
  currentLevel: LevelConfig;
  onPlay: () => void;
  onOpenLevelSelect: () => void;
  onOpenWardrobe: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  bgmEnabled: boolean;
  onToggleBgm: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  currentCostume,
  coins,
  currentLevel,
  onPlay,
  onOpenLevelSelect,
  onOpenWardrobe,
  onOpenHowToPlay,
  onOpenSettings,
  bgmEnabled,
  onToggleBgm,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-y-auto bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 text-white">
      {/* Top Bar: Coins and Quick Settings */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        {/* Total Coins Pill */}
        <div className="flex items-center gap-2 bg-amber-900/80 border-2 border-yellow-500/60 px-4 py-2 rounded-2xl shadow-lg">
          <span className="text-xl">🪙</span>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] uppercase font-bold text-yellow-300/80 font-cartoon">Treasury</span>
            <span className="text-xl font-cartoon font-bold text-yellow-300">{coins}</span>
          </div>
        </div>

        {/* Action icons (Sound toggle, Settings, How to play) */}
        <div className="flex items-center gap-2.5">
          <button
            id="toggle-bgm-menu-btn"
            onClick={() => {
              sound.playClick();
              onToggleBgm();
            }}
            aria-label="Toggle Music"
            className="w-11 h-11 rounded-2xl bg-amber-900/80 hover:bg-amber-800 border-2 border-amber-600/60 flex items-center justify-center text-lg active:scale-95 shadow-md cursor-pointer transition-colors"
          >
            {bgmEnabled ? '🔊' : '🔇'}
          </button>

          <button
            id="how-to-play-menu-btn"
            onClick={() => {
              sound.playClick();
              onOpenHowToPlay();
            }}
            aria-label="How to play guide"
            className="w-11 h-11 rounded-2xl bg-amber-900/80 hover:bg-amber-800 border-2 border-amber-600/60 flex items-center justify-center text-lg active:scale-95 shadow-md cursor-pointer transition-colors"
          >
            ❓
          </button>

          <button
            id="settings-menu-btn"
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            aria-label="Game Settings"
            className="w-11 h-11 rounded-2xl bg-amber-900/80 hover:bg-amber-800 border-2 border-amber-600/60 flex items-center justify-center text-lg active:scale-95 shadow-md cursor-pointer transition-colors"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Main Center Stage: Title, Character Display, and Play Button */}
      <div className="flex flex-col items-center justify-center text-center my-auto py-4 z-10 max-w-xl w-full">
        {/* Game Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/30 border border-orange-500/50 text-orange-300 text-xs font-cartoon font-bold uppercase tracking-widest mb-2 shadow-inner">
          <span>🇮🇳</span>
          <span>Endless Runner & Adventure</span>
        </div>

        {/* Title Logo Typography */}
        <h1 className="text-4xl sm:text-6xl font-cartoon font-bold text-amber-200 tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] text-stroke">
          Mission Delhi
        </h1>
        <p className="text-lg sm:text-2xl font-cartoon font-semibold text-orange-400 -mt-1 sm:-mt-2 mb-4 tracking-wide">
          The Funny Journey
        </p>

        {/* Cartoon Character Center Spotlight */}
        <div className="relative my-2">
          {/* Glowing Aura Ring */}
          <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-r from-orange-500/20 via-amber-400/20 to-yellow-500/20 blur-xl animate-pulse" />
          
          <CharacterPreview costume={currentCostume} size={150} animate={true} />

          {/* Quick Outfit Tag */}
          <button
            id="wardrobe-tag-btn"
            onClick={() => {
              sound.playClick();
              onOpenWardrobe();
            }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-800 hover:bg-amber-700 border border-amber-400 px-3 py-1 rounded-full text-xs font-cartoon text-amber-200 flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
          >
            <span>👔</span>
            <span>{currentCostume.name}</span>
          </button>
        </div>

        {/* Current Selected Mission Banner */}
        <div className="mt-6 mb-5 px-4 py-2 rounded-2xl bg-amber-950/80 border border-amber-600/40 text-xs sm:text-sm text-amber-200/90 font-cartoon flex items-center gap-2 shadow-md">
          <span className="text-base">🚩</span>
          <span>Next Mission: </span>
          <span className="text-amber-400 font-bold">{currentLevel.name}</span>
          <button
            id="change-mission-btn"
            onClick={() => {
              sound.playClick();
              onOpenLevelSelect();
            }}
            className="ml-2 underline text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
          >
            Change
          </button>
        </div>

        {/* BIG PLAY BUTTON */}
        <button
          id="play-game-btn"
          onClick={() => {
            sound.playClick();
            onPlay();
          }}
          className="btn-cartoon-orange w-full sm:w-80 py-4 sm:py-5 rounded-3xl text-2xl sm:text-3xl font-cartoon font-bold text-white tracking-wider cursor-pointer flex items-center justify-center gap-3 active:scale-95"
        >
          <span>🚀</span>
          <span>START MISSION</span>
        </button>

        {/* SECONDARY ACTION BUTTONS: Level Select & Wardrobe */}
        <div className="grid grid-cols-2 gap-3 w-full sm:w-80 mt-4">
          <button
            id="level-select-btn"
            onClick={() => {
              sound.playClick();
              onOpenLevelSelect();
            }}
            className="btn-cartoon-blue py-3 rounded-2xl font-cartoon font-bold text-sm sm:text-base text-white flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🗺️</span>
            <span>Missions</span>
          </button>

          <button
            id="open-wardrobe-btn"
            onClick={() => {
              sound.playClick();
              onOpenWardrobe();
            }}
            className="btn-cartoon-green py-3 rounded-2xl font-cartoon font-bold text-sm sm:text-base text-white flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>👔</span>
            <span>Wardrobe</span>
          </button>
        </div>
      </div>

      {/* Footer Power-up Teaser strip */}
      <div className="w-full max-w-2xl bg-amber-950/60 border border-amber-800/40 rounded-2xl px-4 py-2 flex items-center justify-around text-xs font-cartoon text-amber-300/80 z-10 shadow-sm mt-2">
        <span className="flex items-center gap-1">☕ Chai Boost</span>
        <span>•</span>
        <span className="flex items-center gap-1">🙏 Namaste Calm</span>
        <span>•</span>
        <span className="flex items-center gap-1">📸 Selfie Bonus</span>
        <span>•</span>
        <span className="flex items-center gap-1">🚀 Rocket Flight</span>
      </div>
    </div>
  );
};
