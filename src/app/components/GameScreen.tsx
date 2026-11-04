import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudBackground } from './CloudBackground';
import { Drone } from './Drone';
import { House } from './Houses';
import { Bird, Wind, Magnet, Clock, Shield, Package as PackageIcon, AlertCircle } from 'lucide-react';
import { Obstacle, PowerUp, ActivePowerUp, Package, HouseData } from '../types/game';
import { Difficulty, Language, KeyBindings, BackgroundSettings } from '../App';
import { MathQuestionModal } from './MathQuestionModal';
import { t } from '../utils/translations';

interface GameScreenProps {
  onGameOver: (score: number) => void;
  onReturnToMenu: () => void;
  difficulty: Difficulty;
  cheatsEnabled: boolean;
  funModeEnabled?: boolean;
  topDownMode?: boolean;
  trainingMode?: boolean;
  language: Language;
  keyBindings: KeyBindings;
  backgroundSettings: BackgroundSettings;
}

const SKIN_COLORS: Record<string, string> = {
  blue: '#74C0FC',
  red: '#FF6B6B',
  purple: '#CC5DE8',
  green: '#51CF66',
  yellow: '#FFD43B',
  orange: '#FF922B',
};

const DIFFICULTY_MULTIPLIERS = {
  easy: { speed: 0.6, spawn: 1.5 },
  normal: { speed: 1, spawn: 1 },
  hard: { speed: 1.4, spawn: 0.7 },
  hardcore: { speed: 2, spawn: 0.5 },
};

export function GameScreen({ 
  onGameOver, 
  onReturnToMenu, 
  difficulty, 
  selectedSkin,
  cheatsEnabled, 
  funModeEnabled = false, 
  topDownMode = false, 
  trainingMode = false,
  language,
  keyBindings,
  backgroundSettings
}: GameScreenProps) {
  const [score, setScore] = useState(0);
  const [droneY, setDroneY] = useState(50);
  const [gameRunning, setGameRunning] = useState(true);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [showMathQuestion, setShowMathQuestion] = useState(false);
  const [droneSpeedPenalty, setDroneSpeedPenalty] = useState(1); // Multiplier for drone speed (reduced by wind)
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [houses, setHouses] = useState<HouseData[]>([]);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [hasPackage, setHasPackage] = useState(true);
  
  const gameLoopRef = useRef<number>();
  const obstacleSpawnRef = useRef<number>();
  const powerUpSpawnRef = useRef<number>();
  const houseSpawnRef = useRef<number>();
  const survivalTimerRef = useRef<number>();
  const lastSpawnTime = useRef<number>(Date.now());
  const lastPowerUpSpawn = useRef<number>(Date.now());
  const lastHouseSpawn = useRef<number>(Date.now());
  const windPenaltyTimeout = useRef<number | null>(null); // Timer for wind penalty

  const droneColor = SKIN_COLORS[selectedSkin] || SKIN_COLORS.blue;
  const hasShield = activePowerUps.some(p => p.type === 'shield');
  const hasSlowMotion = activePowerUps.some(p => p.type === 'slowMotion');
  const speedMultiplier = hasSlowMotion ? 0.5 : 1;
  
  // Get difficulty multipliers
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty];
  
  // Dynamic difficulty - speed increases every 100 points
  const difficultyLevel = Math.floor(score / 100);
  const baseObstacleSpeed = (0.5 + (difficultyLevel * 0.15)) * difficultyMultiplier.speed; // Apply difficulty multiplier
  const baseHouseSpeed = (0.3 + (difficultyLevel * 0.05)) * difficultyMultiplier.speed; // Apply difficulty multiplier

  // Survival timer - track time only, no points
  useEffect(() => {
    if (!gameRunning) return;

    survivalTimerRef.current = window.setInterval(() => {
      setSurvivalTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (survivalTimerRef.current) clearInterval(survivalTimerRef.current);
    };
  }, [gameRunning]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Pause key
      if (e.key === keyBindings.pause) {
        e.preventDefault();
        setShowPauseMenu(prev => !prev);
        setGameRunning(prev => !prev);
        return;
      }
      
      if (!gameRunning || showPauseMenu) return;
      
      const moveSpeed = 5 * droneSpeedPenalty; // Apply drone speed penalty
      
      if (e.key === keyBindings.moveUp) {
        e.preventDefault();
        setDroneY(prev => Math.max(5, prev - moveSpeed));
      } else if (e.key === keyBindings.moveDown) {
        e.preventDefault();
        setDroneY(prev => Math.min(85, prev + moveSpeed));
      } else if (e.key === keyBindings.dropPackage && hasPackage && !showMathQuestion) {
        e.preventDefault();
        // Can only drop package if drone is in upper half of screen (y < 50)
        if (droneY < 50) {
          // In training mode, show math question first
          if (trainingMode) {
            setShowMathQuestion(true);
            setGameRunning(false); // Pause game during question
          } else {
            // Normal mode - just drop package
            const newPackage: Package = {
              id: Date.now(),
              x: 15, // Drone's x position
              y: droneY,
              velocityY: 2,
            };
            setPackages(prev => [...prev, newPackage]);
            setHasPackage(false);
            
            // Regenerate package after 3 seconds
            setTimeout(() => setHasPackage(true), 3000);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameRunning, hasPackage, droneY, showMathQuestion, trainingMode, droneSpeedPenalty, keyBindings]);

  // Spawn obstacles
  useEffect(() => {
    if (!gameRunning || topDownMode) return; // No obstacles in top-down mode

    const spawnObstacle = () => {
      const now = Date.now();
      if (now - lastSpawnTime.current > 1500) {
        const types: Array<'bird' | 'balloon' | 'wind'> = ['bird', 'balloon', 'wind'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const newObstacle: Obstacle = {
          id: Date.now(),
          type,
          x: 100,
          y: Math.random() * 60 + 10, // Keep away from bottom
          speed: (Math.random() * 0.2 + baseObstacleSpeed) * speedMultiplier, // Dynamic speed based on score
        };
        
        setObstacles(prev => [...prev, newObstacle]);
        lastSpawnTime.current = now;
      }
    };

    obstacleSpawnRef.current = window.setInterval(spawnObstacle, 800);
    return () => {
      if (obstacleSpawnRef.current) clearInterval(obstacleSpawnRef.current);
    };
  }, [gameRunning, speedMultiplier, baseObstacleSpeed, topDownMode]);

  // Spawn power-ups
  useEffect(() => {
    if (!gameRunning || topDownMode) return; // No power-ups in top-down mode

    const spawnPowerUp = () => {
      const now = Date.now();
      if (now - lastPowerUpSpawn.current > 6000) {
        const types: Array<'slowMotion' | 'shield'> = ['slowMotion', 'shield'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const newPowerUp: PowerUp = {
          id: Date.now(),
          type,
          x: 100,
          y: Math.random() * 60 + 10,
          speed: (Math.random() * 0.2 + baseObstacleSpeed) * speedMultiplier,
          collected: false,
        };
        
        setPowerUps(prev => [...prev, newPowerUp]);
        lastPowerUpSpawn.current = now;
      }
    };

    powerUpSpawnRef.current = window.setInterval(spawnPowerUp, 1500);
    return () => {
      if (powerUpSpawnRef.current) clearInterval(powerUpSpawnRef.current);
    };
  }, [gameRunning, speedMultiplier, baseObstacleSpeed, topDownMode]);

  // Spawn houses
  useEffect(() => {
    if (!gameRunning || !backgroundSettings.showHouses) return;

    const spawnHouse = () => {
      const now = Date.now();
      if (now - lastHouseSpawn.current > 2500) {
        const newHouse: HouseData = {
          id: Date.now(),
          x: 110,
          chimneyX: 0,
          chimneyY: 30,
        };
        
        setHouses(prev => [...prev, newHouse]);
        lastHouseSpawn.current = now;
      }
    };

    houseSpawnRef.current = window.setInterval(spawnHouse, 800);
    return () => {
      if (houseSpawnRef.current) clearInterval(houseSpawnRef.current);
    };
  }, [gameRunning, backgroundSettings.showHouses]);

  // Game loop
  useEffect(() => {
    if (!gameRunning) return;

    const gameLoop = () => {
      // Update obstacles
      setObstacles(prev => {
        return prev
          .map(obs => ({ ...obs, x: obs.x - obs.speed }))
          .filter(obs => obs.x > -10);
      });

      // Update power-ups
      setPowerUps(prev => {
        return prev
          .map(pu => ({ ...pu, x: pu.x - pu.speed }))
          .filter(pu => pu.x > -10 && !pu.collected);
      });

      // Update houses
      setHouses(prev => {
        return prev
          .map(house => ({ ...house, x: house.x - baseHouseSpeed }))
          .filter(house => house.x > -20);
      });

      // Update packages
      setPackages(prev => {
        return prev
          .map(pkg => ({
            ...pkg,
            y: pkg.y + pkg.velocityY,
            velocityY: pkg.velocityY + 0.05
          }))
          .filter(pkg => pkg.y < 95);
      });

      // Remove expired power-ups
      setActivePowerUps(prev => prev.filter(pu => pu.endTime > Date.now()));

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameRunning, baseHouseSpeed]);

  // Collision detection
  useEffect(() => {
    if (!gameRunning) return;

    const droneBox = {
      x: 15,
      y: droneY,
      width: 10,
      height: 8,
    };

    // Check obstacle collisions
    if (!cheatsEnabled) {
      for (const obs of obstacles) {
        if (
          obs.x < droneBox.x + droneBox.width &&
          obs.x + 8 > droneBox.x &&
          obs.y < droneBox.y + droneBox.height &&
          obs.y + 8 > droneBox.y
        ) {
          if (obs.type === 'wind') {
            setDroneY(prev => Math.min(85, prev + 0.5));
            setObstacles(prev => prev.filter(o => o.id !== obs.id));
            setDroneSpeedPenalty(prev => prev * 0.8);
            if (windPenaltyTimeout.current) clearTimeout(windPenaltyTimeout.current);
            windPenaltyTimeout.current = window.setTimeout(() => setDroneSpeedPenalty(1), 5000);
          } else if (!hasShield) {
            setGameRunning(false);
            setTimeout(() => onGameOver(score), 100);
            return;
          } else {
            setActivePowerUps(prev => prev.filter(p => p.type !== 'shield'));
            setObstacles(prev => prev.filter(o => o.id !== obs.id));
          }
        }
      }
    }

    // Check power-up collisions
    for (const pu of powerUps) {
      if (
        !pu.collected &&
        pu.x < droneBox.x + droneBox.width &&
        pu.x + 6 > droneBox.x &&
        pu.y < droneBox.y + droneBox.height &&
        pu.y + 6 > droneBox.y
      ) {
        setPowerUps(prev => 
          prev.map(p => p.id === pu.id ? { ...p, collected: true } : p)
        );
        
        const duration = pu.type === 'shield' ? 5000 : 5000;
        setActivePowerUps(prev => [
          ...prev.filter(p => p.type !== pu.type),
          { type: pu.type, endTime: Date.now() + duration }
        ]);
      }
    }

    // Check package-chimney collisions
    for (const pkg of packages) {
      for (const house of houses) {
        const chimneyScreenX = house.x + (75 / 100) * 13;
        const chimneyScreenY = 100 - 35;
        
        if (
          Math.abs(pkg.x - chimneyScreenX) < 12 &&
          pkg.y > chimneyScreenY - 20 &&
          pkg.y < chimneyScreenY + 20
        ) {
          setPackages(prev => prev.filter(p => p.id !== pkg.id));
          if (!funModeEnabled && !topDownMode) {
            setScore(prev => prev + 10);
          }
          break;
        }
      }
    }
  }, [obstacles, powerUps, packages, houses, droneY, gameRunning, hasShield, score, onGameOver, cheatsEnabled, funModeEnabled, topDownMode]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#E3F2FD] via-[#F0F8FF] to-[#FFF9E6]">
      <CloudBackground />

      {/* Score Panel */}
      <div className="relative z-20 p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div className="flex gap-4">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg"
            >
              <div className="text-sm text-[#868E96]">{t('score', language)}</div>
              <div className="text-3xl text-[#495057]">{score}</div>
            </motion.div>

            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg"
            >
              <div className="text-sm text-[#868E96]">{t('time', language)}</div>
              <div className="text-3xl text-[#495057]">{survivalTime}s</div>
            </motion.div>
          </div>

          {/* Package Indicator */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`rounded-xl px-4 py-3 shadow-lg ${
              hasPackage 
                ? 'bg-gradient-to-br from-[#FFD43B] to-[#FCC419]' 
                : 'bg-gray-300'
            }`}
          >
            <PackageIcon className={`w-8 h-8 ${hasPackage ? 'text-white' : 'text-gray-500'}`} />
          </motion.div>
        </div>

        {/* Active Power-ups Display */}
        <div className="mt-4 flex gap-2 relative">
          {cheatsEnabled && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-gradient-to-br from-yellow-400 to-yellow-500 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg flex items-center gap-2"
            >
              <span className="text-white">⚡</span>
              <span className="text-sm text-white">{language === 'tr' ? 'Hileler Aktif' : 'Cheats Active'}</span>
            </motion.div>
          )}
          {activePowerUps.map((pu, index) => {
            const timeLeft = pu.endTime - Date.now();
            const showWarning = timeLeft <= 3000 && timeLeft > 0;
            
            return (
              <motion.div
                key={`${pu.type}-${index}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 relative"
              >
                {pu.type === 'shield' && <Shield className="w-5 h-5 text-[#74C0FC]" />}
                {pu.type === 'slowMotion' && <Clock className="w-5 h-5 text-[#FFD43B]" />}
                <span className="text-sm text-[#495057]">
                  {pu.type === 'shield' && (language === 'tr' ? 'Kalkan' : 'Shield')}
                  {pu.type === 'slowMotion' && (language === 'tr' ? 'Yavaşlatma' : 'Slow Motion')}
                </span>
                {showWarning && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="absolute -top-2 -right-2"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Game Area */}
      <div 
        className="relative z-10 h-[calc(100vh-200px)]"
        style={topDownMode ? {
          perspective: '1000px',
          perspectiveOrigin: 'center top',
        } : {}}
      >
        {/* Drone */}
        <motion.div
          className="absolute left-[15%]"
          style={topDownMode ? {
            top: `${droneY}%`,
            transform: 'rotateX(60deg) scale(1.2)',
            transformStyle: 'preserve-3d',
          } : { top: `${droneY}%` }}
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div style={topDownMode ? { transform: 'rotateZ(90deg)' } : {}}>
            <Drone color={droneColor} hasShield={hasShield} />
          </div>
        </motion.div>

        {/* Packages */}
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
            className="absolute w-6 h-6"
            style={topDownMode ? { 
              left: `${pkg.x}%`, 
              top: `${pkg.y}%`,
              transform: 'rotateX(60deg)',
              transformStyle: 'preserve-3d',
            } : { left: `${pkg.x}%`, top: `${pkg.y}%` }}
          >
            <div className="bg-[#FFD43B] border-2 border-[#FCC419] rounded-md w-full h-full shadow-lg" />
          </motion.div>
        ))}

        {/* Obstacles */}
        {obstacles.map((obstacle) => (
          <motion.div
            key={obstacle.id}
            className={`absolute ${
              obstacle.type === 'balloon' 
                ? 'w-18 h-18 md:w-18 md:h-18' 
                : 'w-12 h-12 md:w-14 md:h-14'
            }`}
            style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%` }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md w-full h-full flex items-center justify-center">
              {obstacle.type === 'bird' && <Bird className="w-full h-full text-[#868E96]" />}
              {obstacle.type === 'balloon' && (
                <svg viewBox="0 0 24 24" fill="#FF6B6B" className="w-full h-full">
                  <ellipse cx="12" cy="10" rx="7" ry="9" />
                  <path d="M12 19 L12 24" stroke="#FF6B6B" strokeWidth="1" />
                  <path d="M9 24 L15 24" stroke="#FF6B6B" strokeWidth="1" fill="none" />
                </svg>
              )}
              {obstacle.type === 'wind' && <Wind className="w-full h-full text-[#A5D8FF]" />}
            </div>
          </motion.div>
        ))}

        {/* Power-ups */}
        {powerUps.map((powerUp) => (
          !powerUp.collected && (
            <motion.div
              key={powerUp.id}
              className="absolute w-10 h-10 md:w-12 md:h-12"
              style={{ left: `${powerUp.x}%`, top: `${powerUp.y}%` }}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-white to-[#F0F8FF] backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center border-2 border-[#A5D8FF]">
                {powerUp.type === 'slowMotion' && <Clock className="w-6 h-6 text-[#FFD43B]" />}
                {powerUp.type === 'shield' && <Shield className="w-6 h-6 text-[#74C0FC]" />}
              </div>
            </motion.div>
          )
        ))}
      </div>

      {/* Houses at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 z-5">
        {backgroundSettings.showHouses && houses.map((house) => (
          <House key={house.id} x={house.x} id={house.id} />
        ))}
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg text-center">
          <div className="text-[#495057]">
            <span className="hidden md:inline">
              {language === 'tr' 
                ? 'Hareket Tuşları | Paket Bırak | Duraklat' 
                : 'Move Keys | Drop Package | Pause'}
            </span>
            <span className="md:hidden">
              🎮
            </span>
          </div>
        </div>
      </motion.div>

      {/* Pause Menu */}
      <AnimatePresence>
        {showPauseMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-black/70 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4"
            >
              <h2 className="text-4xl text-[#495057] mb-6">{t('gamePaused', language)}</h2>
              <div className="space-y-4">
                <button
                  className="w-full bg-gradient-to-br from-[#74C0FC] to-[#A5D8FF] hover:from-[#5DADE2] hover:to-[#74C0FC] text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                  onClick={() => {
                    setShowPauseMenu(false);
                    setGameRunning(true);
                  }}
                >
                  {t('resume', language)}
                </button>
                <button
                  className="w-full bg-gradient-to-br from-[#FF6B6B] to-[#FA5252] hover:from-[#F03E3E] hover:to-[#FF6B6B] text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                  onClick={onReturnToMenu}
                >
                  {t('returnToMenu', language)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Overlay */}
      {!gameRunning && !showPauseMenu && !showMathQuestion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-0 left-0 right-0 bottom-0 bg-black/70 z-50 flex items-center justify-center"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg text-center">
            <div className="text-3xl text-[#495057]">{t('gameOver', language)}</div>
            <div className="text-xl text-[#868E96] mt-2">{t('yourScore', language)}: {score}</div>
            <div className="text-xl text-[#868E96] mt-2">{t('yourTime', language)}: {survivalTime}s</div>
            <div className="mt-4 flex gap-4">
              <button
                className="bg-gradient-to-br from-[#FFD43B] to-[#FCC419] text-white px-4 py-2 rounded-lg shadow-lg"
                onClick={onReturnToMenu}
              >
                {t('returnToMenu', language)}
              </button>
              <button
                className="bg-gradient-to-br from-[#FFD43B] to-[#FCC419] text-white px-4 py-2 rounded-lg shadow-lg"
                onClick={() => {
                  setScore(0);
                  setSurvivalTime(0);
                  setObstacles([]);
                  setPowerUps([]);
                  setActivePowerUps([]);
                  setPackages([]);
                  setHouses([]);
                  setDroneY(50);
                  setGameRunning(true);
                }}
              >
                {t('tryAgain', language)}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Math Question Modal */}
      {showMathQuestion && (
        <MathQuestionModal
          difficulty={difficulty}
          onAnswer={(correct) => {
            setShowMathQuestion(false);
            if (correct) {
              // Drop package after correct answer
              const newPackage: Package = {
                id: Date.now(),
                x: 15,
                y: droneY,
                velocityY: 2,
              };
              setPackages(prev => [...prev, newPackage]);
              setHasPackage(false);
              setTimeout(() => setHasPackage(true), 3000);
              setGameRunning(true);
            } else {
              // Wrong answer - game over
              setGameRunning(false);
              setTimeout(() => onGameOver(score), 100);
            }
          }}
        />
      )}
    </div>
  );
}
