import { motion } from 'motion/react';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { CloudBackground } from './CloudBackground';
import { useEffect } from 'react';

interface GameOverProps {
  score: number;
  highScore: number;
  onReplay: () => void;
  onBackToMenu: () => void;
  difficulty: string;
}

export function GameOver({ score, highScore, onReplay, onBackToMenu, difficulty }: GameOverProps) {
  const isNewHighScore = score === highScore && score > 0;

  // Save score to localStorage
  useEffect(() => {
    if (score > 0) {
      const scoreHistory = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
      const difficultyNames: Record<string, string> = {
        easy: 'Kolay',
        normal: 'Normal',
        hard: 'Zor',
        hardcore: 'Hardcore',
      };
      const newScore = {
        score,
        date: new Date().toLocaleDateString('tr-TR', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        difficulty: difficultyNames[difficulty] || 'Normal',
      };
      scoreHistory.push(newScore);
      localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
    }
  }, [score, difficulty]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Blurred Background */}
      <div className="absolute inset-0">
        <CloudBackground />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 w-full max-w-md">
        {/* Game Over Title */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl text-white drop-shadow-lg">
            Oyun Bitti
          </h1>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl"
        >
          {/* Current Score */}
          <div className="text-center mb-6">
            <div className="text-[#868E96] mb-2">Skorunuz</div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.5,
                type: 'spring',
                stiffness: 150,
              }}
              className="text-6xl text-[#74C0FC]"
            >
              {score}
            </motion.div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent mb-6" />

          {/* High Score */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#FFF9E6] to-[#FFE066]/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFD43B] to-[#FCC419] rounded-full flex items-center justify-center shadow-md">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-[#868E96]">En Yüksek Skor</div>
                <div className="text-2xl text-[#495057]">{highScore}</div>
              </div>
            </div>
            
            {isNewHighScore && (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.7,
                  type: 'spring',
                  stiffness: 200,
                }}
                className="bg-gradient-to-r from-[#FFD43B] to-[#FCC419] text-white px-4 py-2 rounded-full text-sm shadow-lg"
              >
                YENİ REKOR!
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full flex flex-col gap-3"
        >
          <Button
            onClick={onReplay}
            className="w-full h-16 bg-gradient-to-r from-[#74C0FC] to-[#A5D8FF] hover:from-[#5DADE2] hover:to-[#74C0FC] text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <RotateCcw className="w-6 h-6 mr-3" />
            <span className="text-xl">Tekrar Oyna</span>
          </Button>

          <Button
            onClick={onBackToMenu}
            variant="outline"
            className="w-full h-14 bg-white/80 backdrop-blur-sm border-2 border-white hover:bg-white hover:border-[#74C0FC] text-[#495057] rounded-xl shadow-md transition-all duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Ana Menü
          </Button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-8 mt-4"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-8 h-8 bg-white/40 rounded-lg backdrop-blur-sm"
            />
          ))}
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
