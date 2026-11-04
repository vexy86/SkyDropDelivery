import { motion } from 'motion/react';
import { X, Trophy, Lock, Check, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Language } from '../App';
import { t } from '../utils/translations';

interface SkinsModalProps {
  onClose: () => void;
  highScore: number;
  selectedSkin: string;
  onSelectSkin: (skinId: string) => void;
  language: Language;
  isAdminLoggedIn?: boolean;
}

export const SKINS = [
  { id: 'blue', name: 'Mavi', color: '#74C0FC', requirement: 0 },
  { id: 'red', name: 'Kırmızı', color: '#FF6B6B', requirement: 150 },
  { id: 'purple', name: 'Mor', color: '#CC5DE8', requirement: 300 },
  { id: 'green', name: 'Yeşil', color: '#51CF66', requirement: 600 },
  { id: 'yellow', name: 'Sarı', color: '#FFD43B', requirement: 900 },
  { id: 'orange', name: 'Turuncu', color: '#FF922B', requirement: 1200 },
];

export function SkinsModal({ onClose, highScore, selectedSkin, onSelectSkin, language, isAdminLoggedIn }: SkinsModalProps) {
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className={`p-6 flex justify-between items-center ${
          isAdminLoggedIn
            ? 'bg-gradient-to-r from-amber-400 to-amber-500'
            : 'bg-gradient-to-r from-[#74C0FC] to-[#A5D8FF]'
        }`}>
          <h2 className="text-white text-2xl flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            {t('skins', language)}
            {isAdminLoggedIn && (
              <span className="ml-2 text-sm bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {language === 'tr' ? 'Tümü Ücretsiz' : 'All Free'}
              </span>
            )}
          </h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SKINS.map((skin) => {
              const isUnlocked = isAdminLoggedIn || highScore >= skin.requirement;
              const isSelected = selectedSkin === skin.id;

              return (
                <motion.button
                  key={skin.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => isUnlocked && onSelectSkin(skin.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all h-32 flex flex-col items-center justify-center gap-2 ${
                    isSelected
                      ? isAdminLoggedIn
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-[#74C0FC] bg-blue-50'
                      : isUnlocked
                      ? 'border-gray-200 hover:border-blue-300'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {!isUnlocked && <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-400" />}
                  {isSelected && (
                    <Check className={`absolute top-2 right-2 w-5 h-5 ${isAdminLoggedIn ? 'text-amber-500' : 'text-blue-500'}`} />
                  )}
                  {isAdminLoggedIn && !isSelected && skin.requirement > 0 && (
                    <ShieldCheck className="absolute top-2 right-2 w-4 h-4 text-amber-400" />
                  )}

                  <div className="w-12 h-12 rounded-full shadow-inner" style={{ backgroundColor: skin.color }} />
                  <span className={`font-medium ${isUnlocked ? 'text-[#495057]' : 'text-gray-400'}`}>
                    {language === 'tr' ? skin.name : skin.id.charAt(0).toUpperCase() + skin.id.slice(1)}
                  </span>
                  {!isAdminLoggedIn && !isUnlocked && (
                    <span className="text-xs text-gray-400">{skin.requirement} puan</span>
                  )}
                  {isAdminLoggedIn && skin.requirement > 0 && (
                    <span className="text-xs text-amber-500 line-through">{skin.requirement} puan</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex justify-center border-t border-gray-200">
          <Button onClick={onClose} className="bg-[#74C0FC] text-white px-8 rounded-xl">
            {t('close', language)}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
