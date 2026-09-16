import React from 'react';
import { sound } from '../services/soundService';

interface GameOverModalProps {
  score: number;
  coinsEarned: number;
  distance: number;
  targetDistance: number;
  levelName: string;
  onRetry: () => void;
  onSelectLevel: () => void;
  onMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  coinsEarned,
  distance,
  targetDistance,
  levelName,
  onRetry,
  onSelectLevel,
  onMenu,
}) => {
  const percentCompleted = Math.min(100, Math.round((distance / targetDistance) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-stone-900 via-amber-950 to-stone-950 border-4 border-orange-600 rounded-3xl p-6 sm:p-7 shadow-2xl text-center flex flex-col items-center">
        {/* Funny Cartoon Icon & Header */}
        <div className="w-16 h-16 rounded-3xl bg-amber-900/60 border-2 border-orange-500 flex items-center justify-center text-3xl mb-3 shadow-inner">
          🩹
        </div>

        <h2 className="text-3xl sm:text-4xl font-cartoon font-bold text-amber-200 tracking-tight text-stroke">
          Ek Aur Prayas!
        </h2>
        <p className="text-sm font-cartoon text-orange-400 font-semibold mb-5">
          (Never mind, try once more!)
        </p>

        {/* Stats Recap Card */}
        <div className="w-full bg-amber-950/80 border border-amber-700/60 rounded-2xl p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center text-sm font-cartoon">
            <span className="text-amber-300">Mission</span>
            <span className="text-white font-bold">{levelName}</span>
          </div>

          <div className="flex justify-between items-center text-sm font-cartoon">
            <span className="text-amber-300">Distance Reached</span>
            <span className="text-yellow-400 font-bold">
              {distance}m <span className="text-xs text-amber-400/80">({percentCompleted}%)</span>
            </span>
          </div>

          <div className="flex justify-between items-center text-sm font-cartoon">
            <span className="text-amber-300">Score</span>
            <span className="text-white font-bold text-lg">{score}</span>
          </div>

          <div className="flex justify-between items-center text-sm font-cartoon">
            <span className="text-amber-300">Coins Collected</span>
            <span className="text-yellow-300 font-bold text-base flex items-center gap-1">
              🪙 +{coinsEarned}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-orange-500 h-full rounded-full transition-all"
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button
            id="retry-game-btn"
            onClick={() => {
              sound.playClick();
              onRetry();
            }}
            className="btn-cartoon-orange w-full py-3.5 rounded-2xl font-cartoon font-bold text-xl text-white tracking-wide shadow-lg cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            <span>TRY AGAIN</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              id="gameover-level-select-btn"
              onClick={() => {
                sound.playClick();
                onSelectLevel();
              }}
              className="btn-cartoon-blue py-3 rounded-2xl font-cartoon font-bold text-sm text-white shadow-md cursor-pointer active:scale-95"
            >
              🗺️ Missions
            </button>

            <button
              id="gameover-menu-btn"
              onClick={() => {
                sound.playClick();
                onMenu();
              }}
              className="btn-cartoon-green py-3 rounded-2xl font-cartoon font-bold text-sm text-white shadow-md cursor-pointer active:scale-95"
            >
              🏠 Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
