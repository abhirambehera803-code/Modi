import React, { useState } from 'react';
import { Costume, CostumeId } from '../types';
import { CharacterPreview } from './CharacterPreview';
import { sound } from '../services/soundService';

interface WardrobeModalProps {
  costumes: Costume[];
  selectedCostumeId: CostumeId;
  coins: number;
  onSelectCostume: (id: CostumeId) => void;
  onUnlockCostume: (id: CostumeId, cost: number) => void;
  onClose: () => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  costumes,
  selectedCostumeId,
  coins,
  onSelectCostume,
  onUnlockCostume,
  onClose,
}) => {
  const [previewId, setPreviewId] = useState<CostumeId>(selectedCostumeId);
  const previewCostume = costumes.find((c) => c.id === previewId) || costumes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 border-4 border-amber-600 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-700/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👔</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-cartoon font-bold text-amber-200">
                Costume Wardrobe
              </h2>
              <p className="text-xs text-amber-400 font-medium">
                Unlock stylish fictional cartoon outfits with coins!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-900/90 border border-yellow-500/60 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
              <span className="text-base">🪙</span>
              <span className="text-amber-300 font-cartoon font-bold text-sm">{coins}</span>
            </div>

            <button
              id="close-wardrobe-btn"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-amber-800 hover:bg-amber-700 border border-amber-500 text-white font-bold flex items-center justify-center text-lg active:scale-90 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Center Stage: Live Fitting Room Preview & Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center flex-1 overflow-y-auto">
          {/* Left: Big Preview Character Box */}
          <div className="flex flex-col items-center justify-center p-4 bg-amber-950/80 rounded-2xl border-2 border-amber-700/60">
            <CharacterPreview costume={previewCostume} size={170} animate={true} />

            <h3 className="text-xl font-cartoon font-bold text-amber-100 mt-3">
              {previewCostume.name}
            </h3>
            <p className="text-xs text-amber-300/80 text-center mt-1 px-3">
              {previewCostume.tagline}
            </p>

            {/* Action button: Equip or Unlock */}
            <div className="mt-4 w-full">
              {previewCostume.unlocked ? (
                selectedCostumeId === previewCostume.id ? (
                  <div className="w-full py-2.5 rounded-xl bg-green-600/30 border border-green-500/60 text-green-300 text-center font-cartoon font-bold text-sm">
                    ✓ Equipped
                  </div>
                ) : (
                  <button
                    id={`equip-costume-${previewCostume.id}`}
                    onClick={() => {
                      sound.playClick();
                      onSelectCostume(previewCostume.id);
                    }}
                    className="btn-cartoon-green w-full py-2.5 rounded-xl font-cartoon font-bold text-white text-sm cursor-pointer active:scale-95"
                  >
                    Equip Outfit
                  </button>
                )
              ) : (
                <button
                  id={`unlock-costume-${previewCostume.id}`}
                  disabled={coins < previewCostume.cost}
                  onClick={() => {
                    if (coins >= previewCostume.cost) {
                      sound.playCoin();
                      onUnlockCostume(previewCostume.id, previewCostume.cost);
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl font-cartoon font-bold text-sm flex items-center justify-center gap-2 ${
                    coins >= previewCostume.cost
                      ? 'btn-cartoon-amber text-amber-950 cursor-pointer active:scale-95'
                      : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                  }`}
                >
                  <span>🪙 Unlock for {previewCostume.cost} Coins</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Costume Selection Thumbnails */}
          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-72 md:max-h-full pr-1">
            {costumes.map((c) => {
              const isSelectedForPreview = c.id === previewId;
              const isCurrentlyEquipped = c.id === selectedCostumeId;

              return (
                <div
                  key={c.id}
                  id={`wardrobe-item-${c.id}`}
                  onClick={() => {
                    sound.playClick();
                    setPreviewId(c.id);
                  }}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    isSelectedForPreview
                      ? 'bg-amber-800/90 border-yellow-400 shadow-md scale-[1.02]'
                      : 'bg-amber-950/60 border-amber-800/60 hover:bg-amber-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-amber-400/40 flex items-center justify-center text-lg"
                      style={{ backgroundColor: c.jacketColor }}
                    >
                      {c.id === 'classic'
                        ? '🦺'
                        : c.id === 'royal'
                        ? '👑'
                        : c.id === 'yoga'
                        ? '🧘'
                        : c.id === 'space'
                        ? '🚀'
                        : '🧭'}
                    </div>
                    <div>
                      <h4 className="text-sm font-cartoon font-bold text-amber-100 flex items-center gap-1.5">
                        {c.name}
                        {isCurrentlyEquipped && (
                          <span className="text-[10px] bg-green-500 text-white font-bold px-1.5 py-0.2 rounded-full uppercase">
                            Equipped
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-amber-400/80 font-medium">
                        {c.unlocked ? 'Unlocked' : `🪙 ${c.cost} Coins`}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm">
                    {c.unlocked ? '✔️' : '🔒'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
