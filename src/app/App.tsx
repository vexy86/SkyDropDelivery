import { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { GameOver } from './components/GameOver';

export type Screen = 'menu' | 'game' | 'gameOver';
export type Difficulty = 'easy' | 'normal' | 'hard' | 'hardcore';
export type Language = 'tr' | 'en';

export interface KeyBindings {
  moveUp: string;
  moveDown: string;
  dropPackage: string;
  pause: string;
}

export interface BackgroundSettings {
  showDrones: boolean;
  showHouses: boolean;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hardcoreHighScore, setHardcoreHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [selectedSkin, setSelectedSkin] = useState('blue');
  const [cheatsEnabled, setCheatsEnabled] = useState(false);
  const [funModeEnabled, setFunModeEnabled] = useState(false);
  const [topDownMode, setTopDownMode] = useState(false);
  const [trainingMode, setTrainingMode] = useState(false);
  const [language, setLanguage] = useState<Language>('tr');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Key bindings
  const [keyBindings, setKeyBindings] = useState<KeyBindings>({
    moveUp: 'ArrowUp',
    moveDown: 'ArrowDown',
    dropPackage: ' ', // Space key
    pause: 'Escape',
  });
  
  // Background settings
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    showDrones: true,
    showHouses: true,
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    const savedHardcoreHighScore = localStorage.getItem('hardcoreHighScore');
    if (savedHardcoreHighScore) {
      setHardcoreHighScore(parseInt(savedHardcoreHighScore, 10));
    }
    
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'en' || savedLanguage === 'tr') {
      setLanguage(savedLanguage);
    }

    const savedSkin = localStorage.getItem('selectedSkin');
    if (savedSkin) {
      setSelectedSkin(savedSkin);
    }
    
    const savedKeyBindings = localStorage.getItem('keyBindings');
    if (savedKeyBindings) {
      setKeyBindings(JSON.parse(savedKeyBindings));
    }
    
    const savedBackgroundSettings = localStorage.getItem('backgroundSettings');
    if (savedBackgroundSettings) {
      setBackgroundSettings(JSON.parse(savedBackgroundSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('selectedSkin', selectedSkin);
  }, [selectedSkin]);

  useEffect(() => {
    localStorage.setItem('hardcoreHighScore', hardcoreHighScore.toString());
  }, [hardcoreHighScore]);
  
  useEffect(() => {
    localStorage.setItem('keyBindings', JSON.stringify(keyBindings));
  }, [keyBindings]);
  
  useEffect(() => {
    localStorage.setItem('backgroundSettings', JSON.stringify(backgroundSettings));
  }, [backgroundSettings]);

  const handleStartGame = () => {
    setScore(0);
    setCurrentScreen('game');
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
    }
    if (difficulty === 'hardcore' && finalScore > hardcoreHighScore) {
      setHardcoreHighScore(finalScore);
    }
    setCurrentScreen('gameOver');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {currentScreen === 'menu' && (
        <MainMenu
          onStart={handleStartGame}
          highScore={highScore}
          hardcoreHighScore={hardcoreHighScore}
          difficulty={difficulty}
          onSetDifficulty={setDifficulty}
          selectedSkin={selectedSkin}
          onSelectSkin={setSelectedSkin}
          cheatsEnabled={cheatsEnabled}
          onSetCheatsEnabled={setCheatsEnabled}
          funModeEnabled={funModeEnabled}
          onSetFunModeEnabled={setFunModeEnabled}
          topDownMode={topDownMode}
          onSetTopDownMode={setTopDownMode}
          trainingMode={trainingMode}
          onSetTrainingMode={setTrainingMode}
          language={language}
          onSetLanguage={setLanguage}
          keyBindings={keyBindings}
          onSetKeyBindings={setKeyBindings}
          backgroundSettings={backgroundSettings}
          onSetBackgroundSettings={setBackgroundSettings}
          isAdminLoggedIn={isAdminLoggedIn}
          onAdminLogin={() => setIsAdminLoggedIn(true)}
          onAdminLogout={() => setIsAdminLoggedIn(false)}
        />
      )}
      {currentScreen === 'game' && (
        <GameScreen 
          onGameOver={handleGameOver} 
          onReturnToMenu={handleBackToMenu}
          difficulty={difficulty}
          selectedSkin={selectedSkin}
          cheatsEnabled={cheatsEnabled || funModeEnabled}
          funModeEnabled={funModeEnabled}
          topDownMode={topDownMode}
          trainingMode={trainingMode}
          language={language}
          keyBindings={keyBindings}
          backgroundSettings={backgroundSettings}
        />
      )}
      {currentScreen === 'gameOver' && (
        <GameOver 
          score={score} 
          highScore={highScore}
          onReplay={handleStartGame}
          onBackToMenu={handleBackToMenu}
          difficulty={difficulty}
        />
      )}
    </div>
  );
}
