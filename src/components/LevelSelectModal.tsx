import React from 'react';
import { LevelConfig } from '../types';
import { sound } from '../services/soundService';

interface LevelSelectModalProps {
  levels: LevelConfig[];
  selectedLevelId: number;
  onSelectLevel: (level: LevelConfig) => void;
  onClose: () => void;
  onPlayLevel: (level: LevelConfig) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  levels,
  selectedLevelId,
  onSelectLevel,
  onClose,
  onPlayLevel,
}) => {
  const selectedLevel = levels.find((l) => l.id === selectedLevelId) || levels[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-900 to-amber-950 border-4 border-amber-600 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-700/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <h2 className="text-2xl sm:text-3xl font-cartoon font-bold text-amber-200">
              Select Mission
            </h2>
          </div>
          <button
            id="close-level-select-btn"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-amber-800 hover:bg-amber-700 border border-amber-500 text-white font-bold flex items-center justify-center text-lg active:scale-90 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Level List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {levels.map((lvl) => {
            const isSelected = lvl.id === selectedLevelId;
            return (
              <div
                key={lvl.id}
                id={`level-card-${lvl.id}`}
                onClick={() => {
                  if (lvl.unlocked) {
                    sound.playClick();
                    onSelectLevel(lvl);
                  }
                }}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-800/90 border-yellow-400 shadow-lg scale-[1.01]'
                    : lvl.unlocked
                    ? 'bg-amber-950/70 border-amber-700/60 hover:bg-amber-900/50 cursor-pointer'
                    : 'bg-stone-900/60 border-stone-800 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Left Level Number & Info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-cartoon font-bold text-xl ${
                      lvl.unlocked
                        ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md'
                        : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {lvl.unlocked ? lvl.id : '🔒'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-cartoon font-bold text-amber-100">
                        {lvl.name}
                      </h3>
                      {isSelected && (
                        <span className="bg-yellow-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-300/80 font-medium">
                      {lvl.subtitle} • Target: {lvl.targetDistance}m
                    </p>
                  </div>
                </div>

                {/* Right: Stars & High Score or Locked Notice */}
                <div className="flex flex-col items-end">
                  {lvl.unlocked ? (
                    <>
                      <div className="flex gap-1 text-base">
                        {[1, 2, 3].map((star) => (
                          <span
                            key={star}
                            className={star <= lvl.stars ? 'text-yellow-400' : 'text-stone-600'}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-cartoon text-amber-400 mt-1">
                        Best: {lvl.highScore} pts
                      </span>
                    </>
                  ) : (
                    <span className="text-xs font-cartoon text-stone-400 bg-stone-800/80 px-2.5 py-1 rounded-lg">
                      Win Level {lvl.id - 1} to Unlock
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Level Details & Play CTA */}
        <div className="mt-4 pt-4 border-t border-amber-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-amber-300/90 font-medium text-center sm:text-left">
            <span className="font-bold text-amber-100">{selectedLevel.name}:</span>{' '}
            {selectedLevel.description}
          </div>

          <button
            id="start-selected-level-btn"
            onClick={() => {
              sound.playClick();
              onPlayLevel(selectedLevel);
            }}
            className="btn-cartoon-orange whitespace-nowrap px-6 py-3 rounded-2xl text-lg font-cartoon font-bold text-white shadow-lg cursor-pointer active:scale-95 w-full sm:w-auto"
          >
            Play Mission {selectedLevel.id} 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
