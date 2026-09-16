import React from 'react';
import { sound } from '../services/soundService';

interface SettingsModalProps {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  onToggleBgm: () => void;
  onToggleSfx: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  bgmEnabled,
  sfxEnabled,
  onToggleBgm,
  onToggleSfx,
  onResetProgress,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 border-4 border-amber-600 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-700/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-2xl font-cartoon font-bold text-amber-200">Settings</h2>
          </div>
          <button
            id="close-settings-btn"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-amber-800 hover:bg-amber-700 border border-amber-500 text-white font-bold flex items-center justify-center text-lg active:scale-90 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Toggles */}
        <div className="space-y-4 my-2">
          {/* Background Music Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-950/80 border border-amber-800/60">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎵</span>
              <div>
                <h3 className="font-cartoon font-bold text-amber-100 text-sm">Background Music</h3>
                <p className="text-[11px] text-amber-400/80">Joyful Indian synth-pop game beats</p>
              </div>
            </div>
            <button
              id="settings-bgm-toggle-btn"
              onClick={() => {
                sound.playClick();
                onToggleBgm();
              }}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                bgmEnabled ? 'bg-green-500' : 'bg-stone-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  bgmEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-950/80 border border-amber-800/60">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔊</span>
              <div>
                <h3 className="font-cartoon font-bold text-amber-100 text-sm">Sound Effects (SFX)</h3>
                <p className="text-[11px] text-amber-400/80">Jumps, coins, chai sips & rockets</p>
              </div>
            </div>
            <button
              id="settings-sfx-toggle-btn"
              onClick={() => {
                sound.playClick();
                onToggleSfx();
              }}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                sfxEnabled ? 'bg-green-500' : 'bg-stone-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  sfxEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset Save Data */}
          <div className="pt-2">
            <button
              id="reset-progress-btn"
              onClick={() => {
                if (window.confirm('Reset all coins, high scores, and costume unlocks?')) {
                  sound.playClick();
                  onResetProgress();
                }
              }}
              className="w-full py-2.5 rounded-2xl border border-red-800/80 bg-red-950/40 hover:bg-red-950/70 text-red-300 font-cartoon text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>🗑️</span>
              <span>Reset Game Progress</span>
            </button>
          </div>
        </div>

        {/* Close CTA */}
        <div className="mt-4 pt-3 border-t border-amber-800/80 flex justify-end">
          <button
            id="save-settings-btn"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="btn-cartoon-orange px-6 py-2.5 rounded-2xl font-cartoon font-bold text-white text-sm shadow-md cursor-pointer active:scale-95"
          >
            Save & Return
          </button>
        </div>
      </div>
    </div>
  );
};
