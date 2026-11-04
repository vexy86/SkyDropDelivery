import { motion } from 'motion/react';
import { useState } from 'react';
import { X, ChevronRight, Zap, Gamepad2, Globe, Keyboard, Image, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Difficulty, Language, KeyBindings, BackgroundSettings } from '../App';
import { t } from '../utils/translations';

interface SettingsModalProps {
  onClose: () => void;
  difficulty: Difficulty;
  onSetDifficulty: (difficulty: Difficulty) => void;
  language: Language;
  onSetLanguage: (language: Language) => void;
  keyBindings: KeyBindings;
  onSetKeyBindings: (bindings: KeyBindings) => void;
  backgroundSettings: BackgroundSettings;
  onSetBackgroundSettings: (settings: BackgroundSettings) => void;
}

const UPDATE_NOTES = {
  tr: [
    '✅ Türkçe dili ana menü hatası düzeltildi',
    '✅ Eski skin maliyetleri geri getirildi',
    '✅ Admin paneli yeniden tasarlandı',
  ],
  en: [
    '✅ Turkish language main menu bug fixed',
    '✅ Old skin costs have been brought back',
    '✅ Admin panel redesigned',
  ],
};

export function SettingsModal({
  onClose,
  difficulty,
  onSetDifficulty,
  language,
  onSetLanguage,
  keyBindings,
  onSetKeyBindings,
  backgroundSettings,
  onSetBackgroundSettings,
}: SettingsModalProps) {
  const [editingKey, setEditingKey] = useState<keyof KeyBindings | null>(null);

  const handleKeyCapture = (e: React.KeyboardEvent) => {
    if (!editingKey) return;
    e.preventDefault();
    const key = e.key === ' ' ? ' ' : e.key;
    onSetKeyBindings({ ...keyBindings, [editingKey]: key });
    setEditingKey(null);
  };

  const getDifficultyConfig = (diff: Difficulty) => {
    const configs = {
      easy:     { name: t('easy', language),     description: t('easyDesc', language),     icon: '😊', color: 'from-green-400 to-green-500' },
      normal:   { name: t('normal', language),   description: t('normalDesc', language),   icon: '🎮', color: 'from-blue-400 to-blue-500' },
      hard:     { name: t('hard', language),     description: t('hardDesc', language),     icon: '🔥', color: 'from-orange-400 to-orange-500' },
      hardcore: { name: t('hardcore', language), description: t('hardcoreDesc', language), icon: '💀', color: 'from-red-500 to-red-600' },
    };
    return configs[diff];
  };

  const getKeyDisplay = (key: string) => {
    if (key === ' ') return 'Space';
    if (key === 'Escape') return 'Esc';
    if (key.startsWith('Arrow')) {
      const dir = key[5];
      if (dir === 'U') return '↑';
      if (dir === 'D') return '↓';
      if (dir === 'L') return '←';
      if (dir === 'R') return '→';
    }
    return key;
  };

  const currentUpdateNotes = UPDATE_NOTES[language] || UPDATE_NOTES.tr;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      onKeyDown={handleKeyCapture}
      tabIndex={-1}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#74C0FC] to-[#A5D8FF] p-6 flex justify-between items-center shrink-0">
          <h2 className="text-white text-2xl flex items-center gap-2">
            <Gamepad2 className="w-6 h-6" />
            {t('settings', language)}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

          {/* Difficulty */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FFD43B]" />
              <h3 className="text-xl text-[#495057]">{t('difficulty', language)}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['easy', 'normal', 'hard', 'hardcore'] as Difficulty[]).map((diff) => {
                const config = getDifficultyConfig(diff);
                return (
                  <motion.button
                    key={diff}
                    onClick={() => onSetDifficulty(diff)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      difficulty === diff
                        ? `border-transparent bg-gradient-to-br ${config.color} text-white shadow-lg`
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{config.icon}</div>
                    <div className={`text-sm ${difficulty === diff ? 'text-white' : 'text-[#495057]'}`}>
                      {config.name}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Language */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#51CF66]" />
              <h3 className="text-xl text-[#495057]">{t('language', language)}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={() => onSetLanguage('tr')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  language === 'tr'
                    ? 'border-transparent bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">🇹🇷</div>
                <div className={language === 'tr' ? 'text-white' : 'text-[#495057]'}>Türkçe</div>
              </motion.button>

              <motion.button
                onClick={() => onSetLanguage('en')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  language === 'en'
                    ? 'border-transparent bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">🇺🇸</div>
                <div className={language === 'en' ? 'text-white' : 'text-[#495057]'}>English</div>
              </motion.button>
            </div>
          </div>

          <Separator />

          {/* Background Customization */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-[#CC5DE8]" />
              <h3 className="text-xl text-[#495057]">{t('backgroundCustomization', language)}</h3>
            </div>
            <div className="bg-gradient-to-br from-[#F0F8FF] to-[#FFF9E6] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#868E96]">{t('backgroundDrones', language)}</span>
                <Switch
                  checked={backgroundSettings.showDrones}
                  onCheckedChange={(checked) =>
                    onSetBackgroundSettings({ ...backgroundSettings, showDrones: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#868E96]">{t('backgroundHouses', language)}</span>
                <Switch
                  checked={backgroundSettings.showHouses}
                  onCheckedChange={(checked) =>
                    onSetBackgroundSettings({ ...backgroundSettings, showHouses: checked })
                  }
                />
              </div>
              {!backgroundSettings.showDrones && !backgroundSettings.showHouses && (
                <div className="text-xs text-[#74C0FC] flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  {t('cloudsOnly', language)}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Key Bindings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-[#FF922B]" />
              <h3 className="text-xl text-[#495057]">{t('keyBindings', language)}</h3>
            </div>
            <div className="bg-gradient-to-br from-[#F0F8FF] to-[#FFF9E6] rounded-xl p-4 space-y-3">
              {(Object.keys(keyBindings) as Array<keyof KeyBindings>).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-[#495057]">
                    {t(
                      key === 'moveUp' ? 'moveUp'
                      : key === 'moveDown' ? 'moveDown'
                      : key === 'dropPackage' ? 'dropPackage'
                      : 'pause',
                      language
                    )}
                  </span>
                  <button
                    onClick={() => setEditingKey(key)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      editingKey === key
                        ? 'border-[#74C0FC] bg-[#74C0FC] text-white'
                        : 'border-gray-300 bg-white hover:border-[#74C0FC]'
                    }`}
                  >
                    {editingKey === key ? t('pressKey', language) : getKeyDisplay(keyBindings[key])}
                  </button>
                </div>
              ))}
              <p className="text-xs text-[#868E96] mt-2">{t('clickToChange', language)}</p>
            </div>
          </div>

          <Separator />

          {/* Update Notes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-[#FFD43B]" />
              <h3 className="text-xl text-[#495057]">{t('updateNotes', language)}</h3>
            </div>
            <div className="bg-gradient-to-br from-[#F0F8FF] to-[#FFF9E6] rounded-xl p-4 max-h-60 overflow-y-auto">
              <div className="mb-3 pb-2 border-b border-[#74C0FC]/20">
                <span className="text-lg text-[#74C0FC]">1.2.7
          </span>
              </div>
              <ul className="space-y-2">
                {currentUpdateNotes.map((note, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-sm text-[#495057] flex items-start gap-2"
                  >
                    <span className="text-[#74C0FC] mt-0.5">•</span>
                    <span>{note}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 flex justify-center border-t border-gray-200 shrink-0">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-[#74C0FC] to-[#A5D8FF] hover:from-[#5DADE2] hover:to-[#74C0FC] text-white px-8 rounded-xl"
          >
            {t('close', language)}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
