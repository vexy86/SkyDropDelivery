import { motion } from 'motion/react';
import { X, Trophy, TrendingUp, Target, Award } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useEffect, useState } from 'react';
import { Language } from '../App';
import { t } from '../utils/translations';

interface StatsModalProps {
  onClose: () => void;
  currentHighScore: number;
  language: Language;
}

interface ScoreEntry {
  score: number;
  date: string;
  difficulty: string;
}

export function StatsModal({ onClose, currentHighScore, language }: StatsModalProps) {
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    averageScore: 0,
    bestStreak: 0,
  });

  useEffect(() => {
    // Load score history from localStorage
    const savedScores = localStorage.getItem('scoreHistory');
    if (savedScores) {
      const scores = JSON.parse(savedScores) as ScoreEntry[];
      setScoreHistory(scores.sort((a, b) => b.score - a.score).slice(0, 10)); // Top 10
      
      // Calculate stats
      const total = scores.length;
      const avg = scores.reduce((sum, s) => sum + s.score, 0) / (total || 1);
      
      setStats({
        totalGames: total,
        averageScore: Math.round(avg),
        bestStreak: scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0,
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFD43B] to-[#FCC419] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl text-white">{t('statsTitle', language)}</h2>
                <p className="text-white/80 mt-1">{t('statsSubtitle', language)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(80vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#E3F2FD] to-[#F0F8FF] rounded-xl p-4 border border-[#74C0FC]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#74C0FC] rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-[#868E96]">{t('highScore', language)}</div>
                    <div className="text-2xl text-[#495057]">{currentHighScore}</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#FFF9E6] to-[#FFE066]/20 rounded-xl p-4 border border-[#FFD43B]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FFD43B] rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-[#868E96]">{t('avgScoreLabel', language)}</div>
                    <div className="text-2xl text-[#495057]">{stats.averageScore}</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-[#E599F7] to-[#CC5DE8]/20 rounded-xl p-4 border border-[#CC5DE8]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#CC5DE8] rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-[#868E96]">{t('totalGamesLabel', language)}</div>
                    <div className="text-2xl text-[#495057]">{stats.totalGames}</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Score History */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#74C0FC]" />
                <h3 className="text-xl text-[#495057]">{t('topScoresLabel', language)}</h3>
              </div>

              {scoreHistory.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-3">🎮</div>
                  <p className="text-[#868E96]">{t('noScoresYet', language)}</p>
                  <p className="text-sm text-[#ADB5BD] mt-1">{t('noScoresHint', language)}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {scoreHistory.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        index === 0
                          ? 'bg-gradient-to-r from-[#FFD43B] to-[#FCC419] border-transparent shadow-lg'
                          : index === 1
                          ? 'bg-gradient-to-r from-[#CED4DA] to-[#ADB5BD] border-transparent'
                          : index === 2
                          ? 'bg-gradient-to-r from-[#FFB84D] to-[#FF922B] border-transparent'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {/* Rank */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index === 0
                          ? 'bg-white/30 text-white'
                          : index === 1
                          ? 'bg-white/30 text-white'
                          : index === 2
                          ? 'bg-white/30 text-white'
                          : 'bg-[#F1F3F5] text-[#868E96]'
                      }`}>
                        <span className="text-lg">#{index + 1}</span>
                      </div>

                      {/* Score */}
                      <div className="flex-1">
                        <div className={`text-xl ${
                          index < 3 ? 'text-white' : 'text-[#495057]'
                        }`}>
                          {entry.score} {t('pointsLabel', language)}
                        </div>
                        <div className={`text-sm ${
                          index < 3 ? 'text-white/80' : 'text-[#868E96]'
                        }`}>
                          {entry.date}
                        </div>
                      </div>

                      {/* Difficulty Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        index < 3
                          ? 'bg-white/20 text-white'
                          : 'bg-[#F1F3F5] text-[#868E96]'
                      }`}>
                        {entry.difficulty}
                      </div>

                      {/* Medal for top 3 */}
                      {index === 0 && <div className="text-2xl">🥇</div>}
                      {index === 1 && <div className="text-2xl">🥈</div>}
                      {index === 2 && <div className="text-2xl">🥉</div>}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-[#E3F2FD] to-[#F0F8FF] rounded-xl p-4 border border-[#74C0FC]/20"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="text-[#495057] mb-1">{t('tipLabel', language)}</h4>
                  <p className="text-sm text-[#868E96]">{t('tipText', language)}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  );
}
