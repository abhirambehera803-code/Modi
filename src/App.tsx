/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { MainMenu } from './components/MainMenu';
import { GameCanvas } from './game/GameCanvas';
import { LevelSelectModal } from './components/LevelSelectModal';
import { WardrobeModal } from './components/WardrobeModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { Costume, CostumeId, GameScreen, LevelConfig } from './types';
import {
  INITIAL_COSTUMES,
  INITIAL_LEVELS,
  StorageService,
} from './services/storageService';
import { sound } from './services/soundService';

export default function App() {
  // Game Flow States
  const [screen, setScreen] = useState<GameScreen>('MENU');
  const [levels, setLevels] = useState<LevelConfig[]>([]);
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [costumes, setCostumes] = useState<Costume[]>(INITIAL_COSTUMES);
  const [selectedCostumeId, setSelectedCostumeId] = useState<CostumeId>('classic');
  const [coins, setCoins] = useState<number>(50);

  // Audio settings
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);

  // Modals visibility
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);
  const [showWardrobe, setShowWardrobe] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Game End stats for Modals
  const [lastGameScore, setLastGameScore] = useState<number>(0);
  const [lastGameCoins, setLastGameCoins] = useState<number>(0);
  const [lastGameDistance, setLastGameDistance] = useState<number>(0);
  const [lastGameStars, setLastGameStars] = useState<number>(0);

  // Initialize data on mount
  useEffect(() => {
    const loadedCoins = StorageService.getCoins();
    const loadedLevels = StorageService.getLevels();
    const loadedSelectedCostume = StorageService.getSelectedCostume();
    const unlockedCostumesList = StorageService.getUnlockedCostumes();
    const loadedSettings = StorageService.getSettings();

    setCoins(loadedCoins);
    setLevels(loadedLevels);
    setSelectedCostumeId(loadedSelectedCostume);
    setBgmEnabled(loadedSettings.bgm);
    setSfxEnabled(loadedSettings.sfx);

    sound.setBgmEnabled(loadedSettings.bgm);
    sound.setSfxEnabled(loadedSettings.sfx);

    // Update costumes with unlocked list
    setCostumes(
      INITIAL_COSTUMES.map((c) => ({
        ...c,
        unlocked: unlockedCostumesList.includes(c.id) || c.id === 'classic',
      }))
    );
  }, []);

  // Safe level getter
  const currentLevel = levels.find((l) => l.id === currentLevelId) || INITIAL_LEVELS[0];
  const currentCostume =
    costumes.find((c) => c.id === selectedCostumeId) || INITIAL_COSTUMES[0];

  // Audio toggles
  const handleToggleBgm = useCallback(() => {
    setBgmEnabled((prev) => {
      const updated = !prev;
      sound.setBgmEnabled(updated);
      StorageService.saveSettings({ bgm: updated, sfx: sfxEnabled });
      return updated;
    });
  }, [sfxEnabled]);

  const handleToggleSfx = useCallback(() => {
    setSfxEnabled((prev) => {
      const updated = !prev;
      sound.setSfxEnabled(updated);
      StorageService.saveSettings({ bgm: bgmEnabled, sfx: updated });
      return updated;
    });
  }, [bgmEnabled]);

  // Start game session
  const handleStartGame = (lvl?: LevelConfig) => {
    if (lvl) {
      setCurrentLevelId(lvl.id);
    }
    setShowLevelSelect(false);
    setShowWardrobe(false);
    setScreen('PLAYING');
    if (bgmEnabled) {
      sound.startBgm();
    }
  };

  // Costume Wardrobe Actions
  const handleSelectCostume = (id: CostumeId) => {
    setSelectedCostumeId(id);
    StorageService.setSelectedCostume(id);
  };

  const handleUnlockCostume = (id: CostumeId, cost: number) => {
    if (coins >= cost) {
      const remainingCoins = StorageService.addCoins(-cost);
      setCoins(remainingCoins);
      StorageService.unlockCostume(id);
      setCostumes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, unlocked: true } : c))
      );
      setSelectedCostumeId(id);
      StorageService.setSelectedCostume(id);
    }
  };

  // Game Handlers
  const handleGameOver = (score: number, coinsEarned: number, distance: number) => {
    const updatedCoins = StorageService.addCoins(coinsEarned);
    setCoins(updatedCoins);
    setLastGameScore(score);
    setLastGameCoins(coinsEarned);
    setLastGameDistance(distance);
    setScreen('GAMEOVER');
  };

  const handleVictory = (score: number, coinsEarned: number, stars: number) => {
    const updatedCoins = StorageService.addCoins(coinsEarned);
    setCoins(updatedCoins);
    StorageService.saveLevelProgress(currentLevelId, score, stars);
    // Refresh level progression
    setLevels(StorageService.getLevels());

    setLastGameScore(score);
    setLastGameCoins(coinsEarned);
    setLastGameStars(stars);
    setScreen('VICTORY');
  };

  const handleNextLevel = () => {
    const nextId = currentLevelId + 1;
    if (nextId <= levels.length) {
      setCurrentLevelId(nextId);
      setScreen('PLAYING');
      if (bgmEnabled) sound.startBgm();
    } else {
      setScreen('MENU');
    }
  };

  const handleResetProgress = () => {
    localStorage.clear();
    setCoins(50);
    setLevels(INITIAL_LEVELS);
    setSelectedCostumeId('classic');
    setCostumes(INITIAL_COSTUMES);
    setShowSettings(false);
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-amber-950 overflow-hidden font-sans">
      {/* Top Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main Game Screen Container */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {screen === 'MENU' && (
          <MainMenu
            currentCostume={currentCostume}
            coins={coins}
            currentLevel={currentLevel}
            onPlay={() => handleStartGame(currentLevel)}
            onOpenLevelSelect={() => setShowLevelSelect(true)}
            onOpenWardrobe={() => setShowWardrobe(true)}
            onOpenHowToPlay={() => setShowHowToPlay(true)}
            onOpenSettings={() => setShowSettings(true)}
            bgmEnabled={bgmEnabled}
            onToggleBgm={handleToggleBgm}
          />
        )}

        {(screen === 'PLAYING' || screen === 'PAUSED') && (
          <GameCanvas
            level={currentLevel}
            costume={currentCostume}
            isPaused={screen === 'PAUSED'}
            onPause={() => setScreen('PAUSED')}
            onGameOver={handleGameOver}
            onVictory={handleVictory}
          />
        )}

        {/* OVERLAYS & MODALS */}
        {screen === 'PAUSED' && (
          <PauseModal
            onResume={() => setScreen('PLAYING')}
            onRestart={() => setScreen('PLAYING')}
            onQuitToMenu={() => {
              setScreen('MENU');
              sound.stopBgm();
            }}
            bgmEnabled={bgmEnabled}
            onToggleBgm={handleToggleBgm}
            sfxEnabled={sfxEnabled}
            onToggleSfx={handleToggleSfx}
          />
        )}

        {screen === 'GAMEOVER' && (
          <GameOverModal
            score={lastGameScore}
            coinsEarned={lastGameCoins}
            distance={lastGameDistance}
            targetDistance={currentLevel.targetDistance}
            levelName={currentLevel.name}
            onRetry={() => {
              setScreen('PLAYING');
              if (bgmEnabled) sound.startBgm();
            }}
            onSelectLevel={() => {
              setScreen('MENU');
              setShowLevelSelect(true);
            }}
            onMenu={() => {
              setScreen('MENU');
              sound.stopBgm();
            }}
          />
        )}

        {screen === 'VICTORY' && (
          <VictoryModal
            levelName={currentLevel.name}
            levelId={currentLevel.id}
            score={lastGameScore}
            coinsEarned={lastGameCoins}
            stars={lastGameStars}
            hasNextLevel={currentLevelId < levels.length}
            onNextLevel={handleNextLevel}
            onReplay={() => {
              setScreen('PLAYING');
              if (bgmEnabled) sound.startBgm();
            }}
            onLevelSelect={() => {
              setScreen('MENU');
              setShowLevelSelect(true);
            }}
            onMenu={() => {
              setScreen('MENU');
              sound.stopBgm();
            }}
          />
        )}

        {/* DIALOG MODALS */}
        {showLevelSelect && (
          <LevelSelectModal
            levels={levels}
            selectedLevelId={currentLevelId}
            onSelectLevel={(lvl) => setCurrentLevelId(lvl.id)}
            onClose={() => setShowLevelSelect(false)}
            onPlayLevel={(lvl) => handleStartGame(lvl)}
          />
        )}

        {showWardrobe && (
          <WardrobeModal
            costumes={costumes}
            selectedCostumeId={selectedCostumeId}
            coins={coins}
            onSelectCostume={handleSelectCostume}
            onUnlockCostume={handleUnlockCostume}
            onClose={() => setShowWardrobe(false)}
          />
        )}

        {showHowToPlay && (
          <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
        )}

        {showSettings && (
          <SettingsModal
            bgmEnabled={bgmEnabled}
            sfxEnabled={sfxEnabled}
            onToggleBgm={handleToggleBgm}
            onToggleSfx={handleToggleSfx}
            onResetProgress={handleResetProgress}
            onClose={() => setShowSettings(false)}
          />
        )}
      </main>
    </div>
  );
}
