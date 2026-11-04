import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ShieldCheck, Eye, EyeOff, LogOut } from 'lucide-react';
import { Switch } from './ui/switch';
import { Language } from '../App';

const ADMIN_PASSWORD = '88krVUB++dcbjjz';

interface AdminPanelProps {
  isAdminLoggedIn: boolean;
  onAdminLogin: () => void;
  onAdminLogout: () => void;
  cheatsEnabled: boolean;
  onSetCheatsEnabled: (v: boolean) => void;
  funModeEnabled: boolean;
  onSetFunModeEnabled: (v: boolean) => void;
  topDownMode: boolean;
  onSetTopDownMode: (v: boolean) => void;
  language: Language;
}

export function AdminPanel({
  isAdminLoggedIn,
  onAdminLogin,
  onAdminLogout,
  cheatsEnabled,
  onSetCheatsEnabled,
  funModeEnabled,
  onSetFunModeEnabled,
  topDownMode,
  onSetTopDownMode,
  language,
}: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      onAdminLogin();
      setPassword('');
      setShowError(false);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleLogout = () => {
    onAdminLogout();
    setIsOpen(false);
  };

  return (
    <div
      className="fixed bottom-4 left-4 z-[60]"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Popup panel — slides up on hover */}
      <div
        className={`absolute bottom-14 left-0 transition-all duration-200 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72">
          {/* Panel header */}
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck
              className={`w-5 h-5 ${isAdminLoggedIn ? 'text-amber-500' : 'text-gray-400'}`}
            />
            <span className="text-sm font-semibold text-gray-700">
              {language === 'tr' ? 'Yönetici Paneli' : 'Admin Panel'}
            </span>
            {isAdminLoggedIn && (
              <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {language === 'tr' ? 'Aktif' : 'Active'}
              </span>
            )}
          </div>

          {!isAdminLoggedIn ? (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder={language === 'tr' ? 'Şifre' : 'Password'}
                  className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {showError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500"
                >
                  {language === 'tr' ? 'Hatalı şifre!' : 'Incorrect password!'}
                </motion.p>
              )}

              <button
                onClick={handleLogin}
                className="w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg text-sm font-medium transition-all"
              >
                {language === 'tr' ? 'Giriş Yap' : 'Login'}
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Cheats toggle */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm text-gray-700">
                    {language === 'tr' ? 'Hile Modu' : 'Cheats Mode'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {language === 'tr' ? 'Puan kazanılır' : 'Points earned'}
                  </p>
                </div>
                <Switch checked={cheatsEnabled} onCheckedChange={onSetCheatsEnabled} />
              </div>

              {/* Fun mode toggle */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm text-gray-700">
                    {language === 'tr' ? 'Eğlence Modu' : 'Fun Mode'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {language === 'tr' ? 'Puan kazanılmaz' : 'No points earned'}
                  </p>
                </div>
                <Switch checked={funModeEnabled} onCheckedChange={onSetFunModeEnabled} />
              </div>

              {/* Top-down toggle */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm text-gray-700">
                    {language === 'tr' ? 'Yukarıdan Görünüm' : 'Top-Down View'}
                  </p>
                  <p className="text-xs text-gray-400">3D</p>
                </div>
                <Switch checked={topDownMode} onCheckedChange={onSetTopDownMode} />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full py-2 flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {language === 'tr' ? 'Çıkış Yap' : 'Logout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trigger icon */}
      <motion.div
        animate={{ opacity: isOpen || isAdminLoggedIn ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors select-none ${
          isAdminLoggedIn
            ? 'bg-gradient-to-br from-amber-400 to-amber-500'
            : 'bg-white border border-gray-200'
        }`}
      >
        <Shield className={`w-5 h-5 ${isAdminLoggedIn ? 'text-white' : 'text-gray-400'}`} />
      </motion.div>
    </div>
  );
}
