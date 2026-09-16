import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../services/soundService';

interface VictoryModalProps {
  levelName: string;
  levelId: number;
  score: number;
  coinsEarned: number;
  stars: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
  onMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelName,
  score,
  coinsEarned,
  stars,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onLevelSelect,
  onMenu,
}) => {
  useEffect(() => {
    // Launch festive confetti bursts!
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const interval: number = window.setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#f97316', '#eab308', '#22c55e', '#38bdf8', '#ffffff'],
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-800 via-amber-950 to-stone-950 border-4 border-yellow-400 rounded-3xl p-6 sm:p-7 shadow-2xl text-center flex flex-col items-center">
        {/* Victory Ribbon & Laurel */}
        <div className="w-16 h-16 rounded-3xl bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center text-4xl mb-2 animate-bounce">
          🏆
        </div>

        <h2 className="text-3xl sm:text-4xl font-cartoon font-bold text-yellow-300 tracking-tight text-stroke">
          Shaandar!
        </h2>
        <p className="text-sm font-cartoon text-amber-200 font-semibold mb-4">
          Mission {levelName} Completed!
        </p>

        {/* 3 Stars Display */}
        <div className="flex items-center justify-center gap-3 my-2">
          {[1, 2, 3].map((starIndex) => (
            <div
              key={starIndex}
              className={`text-4xl sm:text-5xl transition-all duration-500 transform ${
                starIndex <= stars
                  ? 'scale-110 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] animate-pulse'
                  : 'scale-90 opacity-30 grayscale'
              }`}
            >
              ⭐
            </div>
          ))}
        </div>

        {/* Score & Coins Card */}
        <div className="w-full bg-amber-950/90 border border-amber-600/60 rounded-2xl p-4 my-5 space-y-2.5">
          <div className="flex justify-between items-center text-sm font-cartoon">
            <span className="text-amber-300">Final Score</span>
            <span className="text-white font-bold text-xl">{score}</span>
          </div>

          <div className="flex justify-between items-center text-sm font-cartoon">
            <span className="text-amber-300">Coins Deposited</span>
            <span className="text-yellow-300 font-bold text-lg flex items-center gap-1">
              🪙 +{coinsEarned}
            </span>
          </div>

          {hasNextLevel && (
            <div className="mt-2 pt-2 border-t border-amber-800/80 text-xs font-cartoon text-green-300 flex items-center justify-center gap-1.5 font-bold">
              <span>🔓</span>
              <span>Next Mission Unlocked in Level Select!</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          {hasNextLevel ? (
            <button
              id="next-level-btn"
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="btn-cartoon-green w-full py-4 rounded-2xl font-cartoon font-bold text-xl text-white tracking-wide shadow-xl cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🚀</span>
              <span>NEXT MISSION</span>
            </button>
          ) : (
            <div className="bg-amber-900/40 p-3 rounded-2xl border border-yellow-500/40 text-amber-200 text-xs font-cartoon font-bold">
              🎉 Congratulations! You have conquered all 5 Missions in Delhi & beyond!
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              id="replay-level-btn"
              onClick={() => {
                sound.playClick();
                onReplay();
              }}
              className="btn-cartoon-orange py-3 rounded-2xl font-cartoon font-bold text-sm text-white shadow-md cursor-pointer active:scale-95"
            >
              🔄 Play Again
            </button>

            <button
              id="victory-menu-btn"
              onClick={() => {
                sound.playClick();
                onMenu();
              }}
              className="btn-cartoon-blue py-3 rounded-2xl font-cartoon font-bold text-sm text-white shadow-md cursor-pointer active:scale-95"
            >
              🏠 Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
