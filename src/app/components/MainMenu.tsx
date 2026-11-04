import { motion } from 'motion/react';
import { useState } from 'react';
import { CloudBackground } from './CloudBackground';
import { Plane, Settings, TrendingUp, GraduationCap, Trophy, Palette, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { SettingsModal } from './SettingsModal';
import { SkinsModal } from './SkinsModal';
import { StatsModal } from './StatsModal';
import { AchievementsModal } from './AchievementsModal';
import { AdminPanel } from './AdminPanel';
import { MenuBackgroundAnimation } from './MenuBackgroundAnimation';
import { Difficulty, Language, KeyBindings, BackgroundSettings } from '../App';
import { t } from '../utils/translations';

interface MainMenuProps {
  onStart: () => void;
  highScore: number;
  hardcoreHighScore: number;
  difficulty: Difficulty;
  onSetDifficulty: (difficulty: Difficulty) => void;
  selectedSkin: string;
  onSelectSkin: (skinId: string) => void;
  cheatsEnabled: boolean;
  onSetCheatsEnabled: (enabled: boolean) => void;
  funModeEnabled: boolean;
  onSetFunModeEnabled: (enabled: boolean) => void;
  topDownMode: boolean;
  onSetTopDownMode: (enabled: boolean) => void;
  trainingMode: boolean;
  onSetTrainingMode: (enabled: boolean) => void;
  language: Language;
  onSetLanguage: (language: Language) => void;
  keyBindings: KeyBindings;
  onSetKeyBindings: (bindings: KeyBindings) => void;
  backgroundSettings: BackgroundSettings;
  onSetBackgroundSettings: (settings: BackgroundSettings) => void;
  isAdminLoggedIn: boolean;
  onAdminLogin: () => void;
  onAdminLogout: () => void;
}

export function MainMenu({
  onStart,
  highScore,
  hardcoreHighScore,
  difficulty,
  onSetDifficulty,
  selectedSkin,
  onSelectSkin,
  cheatsEnabled,
  onSetCheatsEnabled,
  funModeEnabled,
  onSetFunModeEnabled,
  topDownMode,
  onSetTopDownMode,
  trainingMode,
  onSetTrainingMode,
  language,
  onSetLanguage,
  keyBindings,
  onSetKeyBindings,
  backgroundSettings,
  onSetBackgroundSettings,
  isAdminLoggedIn,
  onAdminLogin,
  onAdminLogout,
}: MainMenuProps) {
  const [showSkinsModal, setShowSkinsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <CloudBackground />

      {/* Admin License Badge — top right */}
      {isAdminLoggedIn && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-2 rounded-full shadow-lg select-none"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-sm font-semibold">
            {language === 'tr' ? 'Yönetici Lisansı' : 'Admin License'}
          </span>
        </motion.div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#A5D8FF] to-[#74C0FC] rounded-3xl flex items-center justify-center shadow-lg">
              <Plane className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>

            <motion.div
              className="absolute -top-2 -right-2 w-12 h-12 opacity-60"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <svg viewBox="0 0 50 50" fill="white">
                <ellipse cx="15" cy="25" rx="12" ry="10" />
                <ellipse cx="30" cy="20" rx="15" ry="12" />
                <ellipse cx="38" cy="28" rx="10" ry="8" />
              </svg>
            </motion.div>
          </motion.div>

          <h1 className="text-center text-[#495057]">
            {language === 'tr' ? (
              <>
                <div className="text-5xl md:text-6xl tracking-tight">Gökyüzü</div>
                <div className="text-5xl md:text-6xl tracking-tight">Teslimatı</div>
              </>
            ) : (
              <>
                <div className="text-5xl md:text-6xl tracking-tight">SkyDrop</div>
                <div className="text-5xl md:text-6xl tracking-tight">Delivery</div>
              </>
            )}
            {trainingMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl text-[#FFD43B] mt-2"
              >
                {t('trainingMode', language)}
              </motion.div>
            )}
          </h1>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full"
        >
          <Button
            onClick={onStart}
            className="w-full h-16 bg-gradient-to-r from-[#74C0FC] to-[#A5D8FF] hover:from-[#5DADE2] hover:to-[#74C0FC] text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <span className="text-2xl">{t('start', language)}</span>
          </Button>
        </motion.div>

        {/* Row 1 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-3 gap-3 w-full"
        >
          <Button
            onClick={() => setShowSkinsModal(true)}
            variant="outline"
            className="flex-1 h-14 bg-white/80 backdrop-blur-sm border-2 border-[#E0E0E0] hover:bg-white hover:border-[#74C0FC] text-[#495057] rounded-xl shadow-md transition-all duration-300"
          >
            <Palette className="w-5 h-5 mr-1 md:mr-2" />
            <span className="text-xs md:text-sm">{t('skins', language)}</span>
          </Button>

          <Button
            onClick={() => setShowStatsModal(true)}
            variant="outline"
            className="flex-1 h-14 bg-white/80 backdrop-blur-sm border-2 border-[#E0E0E0] hover:bg-white hover:border-[#74C0FC] text-[#495057] rounded-xl shadow-md transition-all duration-300"
          >
            <TrendingUp className="w-5 h-5 mr-1 md:mr-2" />
            <span className="text-xs md:text-sm">{t('stats', language)}</span>
          </Button>

          <Button
            onClick={() => setShowSettingsModal(true)}
            variant="outline"
            className="flex-1 h-14 bg-white/80 backdrop-blur-sm border-2 border-[#E0E0E0] hover:bg-white hover:border-[#74C0FC] text-[#495057] rounded-xl shadow-md transition-all duration-300"
          >
            <Settings className="w-5 h-5 mr-1 md:mr-2" />
            <span className="text-xs md:text-sm">{t('settings', language)}</span>
          </Button>
        </motion.div>

        {/* Row 2 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex gap-3 w-full"
        >
          <Button
            onClick={() => setShowAchievementsModal(true)}
            variant="outline"
            className="flex-1 h-14 bg-white/80 backdrop-blur-sm border-2 border-[#E0E0E0] hover:bg-white hover:border-[#FFD43B] text-[#495057] rounded-xl shadow-md transition-all duration-300"
          >
            <Trophy className="w-5 h-5 mr-2" />
            {t('achievements', language)}
          </Button>

          <Button
            onClick={() => onSetTrainingMode(!trainingMode)}
            variant="outline"
            className={`flex-1 h-14 backdrop-blur-sm border-2 rounded-xl shadow-md transition-all duration-300 ${
              trainingMode
                ? 'bg-[#74C0FC] border-[#74C0FC] text-white hover:bg-[#5DADE2] hover:border-[#5DADE2]'
                : 'bg-white/80 border-[#E0E0E0] text-[#495057] hover:bg-white hover:border-[#FFD43B]'
            }`}
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            {trainingMode ? t('classic', language) : t('training', language)}
          </Button>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8 }}
          className="text-center text-[#868E96] text-sm mt-4"
        >
          {t('tagline', language)}
        </motion.div>
      </div>

      {/* Background Animations */}
      <MenuBackgroundAnimation settings={backgroundSettings} />

      {/* Floating Admin Panel — bottom left */}
      <AdminPanel
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogin={onAdminLogin}
        onAdminLogout={onAdminLogout}
        cheatsEnabled={cheatsEnabled}
        onSetCheatsEnabled={onSetCheatsEnabled}
        funModeEnabled={funModeEnabled}
        onSetFunModeEnabled={onSetFunModeEnabled}
        topDownMode={topDownMode}
        onSetTopDownMode={onSetTopDownMode}
        language={language}
      />

      {/* Skins Modal */}
      {showSkinsModal && (
        <SkinsModal
          onClose={() => setShowSkinsModal(false)}
          highScore={highScore}
          selectedSkin={selectedSkin}
          onSelectSkin={(skinId) => {
            onSelectSkin(skinId);
            setShowSkinsModal(false);
          }}
          language={language}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          difficulty={difficulty}
          onSetDifficulty={onSetDifficulty}
          language={language}
          onSetLanguage={onSetLanguage}
          keyBindings={keyBindings}
          onSetKeyBindings={onSetKeyBindings}
          backgroundSettings={backgroundSettings}
          onSetBackgroundSettings={onSetBackgroundSettings}
        />
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <StatsModal
          onClose={() => setShowStatsModal(false)}
          currentHighScore={highScore}
          language={language}
        />
      )}

      {/* Achievements Modal */}
      {showAchievementsModal && (
        <AchievementsModal
          onClose={() => setShowAchievementsModal(false)}
          currentHighScore={highScore}
          hardcoreHighScore={hardcoreHighScore}
          selectedSkin={selectedSkin}
          language={language}
        />
      )}
    </div>
  );
}
