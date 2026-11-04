import { motion } from 'motion/react';
import { X, Trophy, Star, Zap, Target, Clock, Package, Palette, Shield } from 'lucide-react';
import { Button } from './ui/button';
import React, { useEffect, useState } from 'react';
import { Language } from '../App';
import { t } from '../utils/translations';

interface AchievementsModalProps {
  onClose: () => void;
  currentHighScore: number;
  hardcoreHighScore: number;
  selectedSkin: string;
  language: Language;
}

type TranslationKey = Parameters<typeof t>[0];

interface Achievement {
  id: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  requirement: number;
  type: 'score' | 'time' | 'hardcore' | 'skin';
  icon: React.ReactNode;
  color: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_delivery',
    titleKey: 'firstDelivery',
    descKey: 'firstDeliveryDesc',
    requirement: 10,
    type: 'score',
    icon: <Package className="w-8 h-8" />,
    color: 'from-[#FFD43B] to-[#FCC419]',
  },
  {
    id: 'delivery_master',
    titleKey: 'deliveryMaster',
    descKey: 'deliveryMasterDesc',
    requirement: 100,
    type: 'score',
    icon: <Trophy className="w-8 h-8" />,
    color: 'from-[#FFD43B] to-[#FCC419]',
  },
  {
    id: 'speed_demon',
    titleKey: 'speedDemon',
    descKey: 'speedDemonDesc',
    requirement: 50,
    type: 'score',
    icon: <Zap className="w-8 h-8" />,
    color: 'from-[#74C0FC] to-[#A5D8FF]',
  },
  {
    id: 'century',
    titleKey: 'century',
    descKey: 'centuryDesc',
    requirement: 100,
    type: 'score',
    icon: <Star className="w-8 h-8" />,
    color: 'from-[#CC5DE8] to-[#E599F7]',
  },
  {
    id: 'double_century',
    titleKey: 'doubleCentury',
    descKey: 'doubleCenturyDesc',
    requirement: 200,
    type: 'score',
    icon: <Star className="w-8 h-8" />,
    color: 'from-[#51CF66] to-[#8CE99A]',
  },
  {
    id: 'triple_century',
    titleKey: 'tripleCentury',
    descKey: 'tripleCenturyDesc',
    requirement: 300,
    type: 'score',
    icon: <Star className="w-8 h-8" />,
    color: 'from-[#FF6B6B] to-[#FA5252]',
  },
  {
    id: 'survivor',
    titleKey: 'survivor',
    descKey: 'survivorDesc',
    requirement: 60,
    type: 'time',
    icon: <Clock className="w-8 h-8" />,
    color: 'from-[#74C0FC] to-[#A5D8FF]',
  },
  {
    id: 'marathon',
    titleKey: 'marathon',
    descKey: 'marathonDesc',
    requirement: 180,
    type: 'time',
    icon: <Clock className="w-8 h-8" />,
    color: 'from-[#FF922B] to-[#FFA94D]',
  },
  {
    id: 'sniper',
    titleKey: 'sniper',
    descKey: 'sniperDesc',
    requirement: 50,
    type: 'score',
    icon: <Target className="w-8 h-8" />,
    color: 'from-[#51CF66] to-[#8CE99A]',
  },
  {
    id: 'acemi_hardcore',
    titleKey: 'acemi',
    descKey: 'acemiDesc',
    requirement: 100,
    type: 'hardcore',
    icon: <Shield className="w-8 h-8" />,
    color: 'from-[#CED4DA] to-[#868E96]',
  },
  {
    id: 'caylak_hardcore',
    titleKey: 'caylak',
    descKey: 'caylakDesc',
    requirement: 200,
    type: 'hardcore',
    icon: <Shield className="w-8 h-8" />,
    color: 'from-[#A5D8FF] to-[#74C0FC]',
  },
  {
    id: 'yari_usta_hardcore',
    titleKey: 'yariUsta',
    descKey: 'yariUstaDesc',
    requirement: 400,
    type: 'hardcore',
    icon: <Shield className="w-8 h-8" />,
    color: 'from-[#51CF66] to-[#2B8A3E]',
  },
  {
    id: 'usta_hardcore',
    titleKey: 'usta',
    descKey: 'ustaDesc',
    requirement: 800,
    type: 'hardcore',
    icon: <Trophy className="w-8 h-8" />,
    color: 'from-[#FFD43B] to-[#F59F00]',
  },
  {
    id: 'how_did_we_get_here',
    titleKey: 'burayaNasılGeldik',
    descKey: 'burayaNasılGeldikDesc',
    requirement: 1000,
    type: 'hardcore',
    icon: <Star className="w-8 h-8" />,
    color: 'from-[#FF6B6B] to-[#C2255C]',
  },
  {
    id: 'beautiful_color',
    titleKey: 'neKadarGuzelRenk',
    descKey: 'neKadarGuzelRenkDesc',
    requirement: 0,
    type: 'skin',
    icon: <Palette className="w-8 h-8" />,
    color: 'from-[#FF922B] to-[#E8590C]',
  }
];

export function AchievementsModal({ onClose, currentHighScore, hardcoreHighScore, selectedSkin, language }: AchievementsModalProps) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('achievements');
    const existingUnlocked = saved ? new Set<string>(JSON.parse(saved)) : new Set<string>();

    const newUnlocked = new Set<string>(existingUnlocked);
    
    ACHIEVEMENTS.forEach(achievement => {
      if (achievement.type === 'score' || achievement.type === 'time') {
        if (currentHighScore >= achievement.requirement) {
          newUnlocked.add(achievement.id);
        }
      } else if (achievement.type === 'hardcore') {
        if (hardcoreHighScore >= achievement.requirement) {
          newUnlocked.add(achievement.id);
        }
      } else if (achievement.type === 'skin') {
        if (selectedSkin === 'orange') {
          newUnlocked.add(achievement.id);
        }
      }
    });

    if (newUnlocked.size !== existingUnlocked.size) {
      setUnlockedAchievements(newUnlocked);
      localStorage.setItem('achievements', JSON.stringify(Array.from(newUnlocked)));
    } else {
      setUnlockedAchievements(existingUnlocked);
    }
  }, [currentHighScore, hardcoreHighScore, selectedSkin]);

  const unlockedCount = unlockedAchievements.size;
  const totalCount = ACHIEVEMENTS.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFD43B] to-[#FFA94D] p-6 flex justify-between items-center">
          <div>
            <h2 className="text-white text-2xl flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              {t('achievementsTitle', language)}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {unlockedCount} / {totalCount} {t('achievementsUnlocked', language)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFD43B] to-[#FFA94D]"
            />
          </div>
          <p className="text-center text-[#868E96] text-xs mt-1">
            {progress.toFixed(0)}% {t('achievementsProgress', language)}
          </p>
        </div>

        {/* Achievements List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.has(achievement.id);
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${
                    isUnlocked
                      ? `bg-gradient-to-br ${achievement.color} border-transparent text-white shadow-md`
                      : 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-white/20' : 'bg-gray-200'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base font-bold truncate ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                        {t(achievement.titleKey, language)}
                      </h3>
                      <p className={`text-xs mt-0.5 leading-tight ${isUnlocked ? 'text-white/90' : 'text-gray-500'}`}>
                        {t(achievement.descKey, language)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-center border-t border-gray-200">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-[#FFD43B] to-[#FFA94D] hover:from-[#FCC419] hover:to-[#FF922B] text-white px-8 h-10 rounded-xl"
          >
            {t('close', language)}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
