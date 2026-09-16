import React from 'react';
import { sound } from '../services/soundService';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 border-4 border-amber-600 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-700/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h2 className="text-2xl sm:text-3xl font-cartoon font-bold text-amber-200">
              How to Play
            </h2>
          </div>
          <button
            id="close-how-to-play-btn"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-amber-800 hover:bg-amber-700 border border-amber-500 text-white font-bold flex items-center justify-center text-lg active:scale-90 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 overflow-y-auto pr-1 text-amber-100 text-sm">
          {/* Controls Section */}
          <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-700/60">
            <h3 className="font-cartoon font-bold text-base text-amber-300 mb-2 flex items-center gap-2">
              <span>🎮</span> Controls (Desktop & Mobile)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-amber-900/40 p-2.5 rounded-xl border border-amber-800/60">
                <span className="font-bold text-yellow-300 block mb-1">⬆️ Jump / Fly:</span>
                Press <span className="bg-amber-950 px-1.5 py-0.5 rounded font-mono">SPACE</span>, <span className="bg-amber-950 px-1.5 py-0.5 rounded font-mono">W</span>, <span className="bg-amber-950 px-1.5 py-0.5 rounded font-mono">Up Arrow</span>, or tap the <span className="font-bold text-white">Jump Button / Swipe Up</span> on touchscreens.
              </div>

              <div className="bg-amber-900/40 p-2.5 rounded-xl border border-amber-800/60">
                <span className="font-bold text-yellow-300 block mb-1">⬇️ Slide / Duck:</span>
                Press <span className="bg-amber-950 px-1.5 py-0.5 rounded font-mono">S</span>, <span className="bg-amber-950 px-1.5 py-0.5 rounded font-mono">Down Arrow</span>, or hold the <span className="font-bold text-white">Slide Button / Swipe Down</span> to duck under high obstacles.
              </div>

              <div className="bg-amber-900/40 p-2.5 rounded-xl border border-amber-800/60">
                <span className="font-bold text-yellow-300 block mb-1">⬅️ ➡️ Lane Adjust:</span>
                Use Left / Right Arrows or A / D keys or on-screen directional touch arrows to adjust position.
              </div>

              <div className="bg-amber-900/40 p-2.5 rounded-xl border border-amber-800/60">
                <span className="font-bold text-yellow-300 block mb-1">⏸️ Pause:</span>
                Press <span className="bg-amber-950 px-1.5 py-0.5 rounded font-mono">P</span> or <span className="bg-amber-950 px-1.5 py-0.5 rounded font-mono">ESC</span> or the Pause icon in top HUD.
              </div>
            </div>
          </div>

          {/* Funny Power-Ups Section */}
          <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-700/60">
            <h3 className="font-cartoon font-bold text-base text-amber-300 mb-2 flex items-center gap-2">
              <span>✨</span> Funny Power-Ups
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2.5 bg-amber-900/40 p-2.5 rounded-xl border border-orange-500/40">
                <span className="text-2xl">☕</span>
                <div>
                  <h4 className="font-cartoon font-bold text-orange-400 text-sm">Chai Boost</h4>
                  <p className="text-amber-200/90 text-[11px] mt-0.5">
                    Temporarily gives a high-speed turbo sprint with magnetic coin suction!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-amber-900/40 p-2.5 rounded-xl border border-yellow-500/40">
                <span className="text-2xl">🙏</span>
                <div>
                  <h4 className="font-cartoon font-bold text-yellow-400 text-sm">Namaste Power</h4>
                  <p className="text-amber-200/90 text-[11px] mt-0.5">
                    Surrounds the character with a calm golden aura that slows incoming obstacles down to safe speed!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-amber-900/40 p-2.5 rounded-xl border border-sky-500/40">
                <span className="text-2xl">📸</span>
                <div>
                  <h4 className="font-cartoon font-bold text-sky-400 text-sm">Selfie Bonus</h4>
                  <p className="text-amber-200/90 text-[11px] mt-0.5">
                    Camera flashes for a memorable photo pose and instantly awards +500 bonus points!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-amber-900/40 p-2.5 rounded-xl border border-red-500/40">
                <span className="text-2xl">🚀</span>
                <div>
                  <h4 className="font-cartoon font-bold text-red-400 text-sm">Rocket Boost</h4>
                  <p className="text-amber-200/90 text-[11px] mt-0.5">
                    Launches on a fictional cartoon rocket, rocketing forward and blasting obstacles into starbursts!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Special Mission Objectives */}
          <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-700/60">
            <h3 className="font-cartoon font-bold text-base text-amber-300 mb-1 flex items-center gap-2">
              <span>🎯</span> Mission Objectives
            </h3>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Cover the target distance (e.g. 500m in Parliament Dash, 600m in Train Rush, 700m in Gaganyaan Space Mission) without losing all 3 hearts! Earn 3 stars by preserving your lives and collecting coins.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-4 pt-3 border-t border-amber-800/80 flex justify-end">
          <button
            id="got-it-btn"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="btn-cartoon-orange px-6 py-2.5 rounded-2xl font-cartoon font-bold text-white text-base shadow-md cursor-pointer active:scale-95"
          >
            Got It, Let&apos;s Run! 🏃
          </button>
        </div>
      </div>
    </div>
  );
};
