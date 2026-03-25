import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Shield, Lock, Bell, Smartphone, HelpCircle, Info, ChevronRight, Crown, Cloud, Palette, Sparkles, Camera, Calculator, EyeOff, Trash2, Image as ImageIcon } from "lucide-react";

interface SettingsProps {
  onBack: () => void;
  currentPin: string;
  onUpdatePin: (newPin: string) => void;
  onShowGuide: () => void;
  isPremiumUser: boolean;
  onShowPremium: () => void;
  onReset: () => void;
  onTogglePremium: () => void;
  isFakeCalculator: boolean;
  isIntruderSelfie: boolean;
  isHiddenIcon: boolean;
  appTheme: string;
  intruderPhotos: any[];
  onToggleFeature: (feature: string) => void;
  onSetTheme: (theme: string) => void;
}

export default function Settings({ 
  onBack, 
  currentPin, 
  onUpdatePin, 
  onShowGuide, 
  isPremiumUser, 
  onShowPremium, 
  onReset, 
  onTogglePremium,
  isFakeCalculator,
  isIntruderSelfie,
  isHiddenIcon,
  appTheme,
  intruderPhotos,
  onToggleFeature,
  onSetTheme
}: SettingsProps) {
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [showIntruders, setShowIntruders] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleUpdatePin = () => {
    if (newPin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    onUpdatePin(newPin);
    setIsChangingPin(false);
    setNewPin("");
    setConfirmPin("");
    setError("");
  };

  const SettingItem = ({ icon, title, subtitle, onClick, toggle = false, isPro = false, isToggled = false }: any) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={isPro && !isPremiumUser ? onShowPremium : onClick}
      className="w-full flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/30 rounded-2xl hover:bg-zinc-900/50 transition-all mb-3 relative overflow-hidden"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPro && !isPremiumUser ? 'bg-yellow-500/10 text-yellow-500' : 'bg-zinc-800/50 text-zinc-400'}`}>
          {icon}
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-zinc-200">{title}</h3>
            {isPro && !isPremiumUser && (
              <span className="px-1.5 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase tracking-tighter border border-yellow-500/20">Pro</span>
            )}
          </div>
          {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
        </div>
      </div>
      {toggle ? (
        <div className={`w-10 h-5 rounded-full relative transition-colors ${isToggled ? 'bg-cyan-500' : 'bg-zinc-800'}`}>
          <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${isToggled ? 'right-1 bg-white' : 'left-1 bg-zinc-600'}`} />
        </div>
      ) : (
        <ChevronRight size={18} className="text-zinc-600" />
      )}
    </motion.button>
  );

  return (
    <div className="flex flex-col h-full bg-black text-white p-6 overflow-hidden">
      {/* Reset Confirmation Overlay */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-zinc-900 rounded-[32px] border border-zinc-800 p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reset All Data?</h3>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                This will permanently delete all your photos, videos, and reset your PIN. This action cannot be undone.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={onReset}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Yes, Reset Everything
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-4 text-zinc-400 font-medium hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center gap-4 mb-8 mt-4 shrink-0">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-zinc-400" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </header>

      {isChangingPin ? (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-6">
            <h2 className="text-lg font-semibold mb-4">Change Secret Code</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">New PIN</label>
                <input 
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 4-6 digits"
                  className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all"
                  maxLength={6}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">Confirm PIN</label>
                <input 
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Repeat PIN"
                  className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all"
                  maxLength={6}
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsChangingPin(false)}
                  className="flex-1 p-4 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdatePin}
                  className="flex-1 p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : showIntruders ? (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <header className="flex items-center gap-4 mb-6 shrink-0">
            <button 
              onClick={() => setShowIntruders(false)}
              className="p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft size={20} className="text-zinc-400" />
            </button>
            <h2 className="text-xl font-bold">Intruder Selfies</h2>
          </header>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {intruderPhotos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-700">
                  <Smartphone size={32} />
                </div>
                <p className="text-zinc-500 text-sm">No intruders detected yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 pb-10">
                {intruderPhotos.map((photo) => (
                  <div key={photo.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
                    <img src={photo.photoUrl} alt="Intruder" className="w-full aspect-square object-cover" referrerPolicy="no-referrer" />
                    <div className="p-3">
                      <p className="text-[10px] text-zinc-500">{photo.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ) : showThemes ? (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <header className="flex items-center gap-4 mb-6 shrink-0">
            <button 
              onClick={() => setShowThemes(false)}
              className="p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft size={20} className="text-zinc-400" />
            </button>
            <h2 className="text-xl font-bold">App Themes</h2>
          </header>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "default", name: "Classic Cyan", colors: "from-cyan-500 to-blue-600" },
              { id: "midnight", name: "Midnight Purple", colors: "from-indigo-600 to-purple-700" },
              { id: "emerald", name: "Emerald Forest", colors: "from-emerald-500 to-teal-600" },
              { id: "rose", name: "Rose Petal", colors: "from-rose-500 to-pink-600" },
              { id: "sunset", name: "Sunset Glow", colors: "from-orange-500 to-red-600" },
            ].map((theme) => (
              <button 
                key={theme.id}
                onClick={() => onSetTheme(theme.id)}
                className={`p-4 rounded-3xl border-2 transition-all text-left ${
                  appTheme === theme.id ? "border-white bg-zinc-900" : "border-zinc-800 bg-zinc-900/30"
                }`}
              >
                <div className={`w-full aspect-video rounded-xl bg-gradient-to-br ${theme.colors} mb-3`} />
                <span className="text-sm font-bold">{theme.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
          {/* Premium Status Card */}
          {!isPremiumUser ? (
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={onShowPremium}
              className="w-full p-6 rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-600 mb-8 flex items-center justify-between shadow-lg shadow-yellow-500/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Crown size={80} />
              </div>
              <div className="relative z-10 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={16} className="text-black fill-black/20" />
                  <span className="text-[10px] font-black text-black uppercase tracking-widest">Premium Plan</span>
                </div>
                <h2 className="text-xl font-black text-black mb-1">Go Pro Today</h2>
                <p className="text-black/70 text-xs font-medium">Unlock all features & remove ads</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-black relative z-10">
                <ChevronRight size={24} />
              </div>
            </motion.button>
          ) : (
            <div className="w-full p-6 rounded-3xl bg-zinc-900 border border-yellow-500/30 mb-8 flex items-center justify-between shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Crown size={80} />
              </div>
              <div className="relative z-10 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={16} className="text-yellow-500 fill-yellow-500/20" />
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Premium Active</span>
                </div>
                <h2 className="text-xl font-black text-white mb-1">VaultX Pro</h2>
                <p className="text-zinc-500 text-xs font-medium">Lifetime subscription active</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 relative z-10">
                <Sparkles size={20} />
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 px-2">Security</h2>
            <SettingItem 
              icon={<Crown size={20} />} 
              title="Premium Access" 
              subtitle="Toggle for testing purposes"
              onClick={onTogglePremium}
              toggle={true}
              isPro={false}
              isToggled={isPremiumUser}
            />
            <SettingItem 
              icon={<Lock size={20} />} 
              title="Change Secret Code" 
              subtitle="Update your calculator PIN"
              onClick={() => setIsChangingPin(true)}
            />
            <SettingItem 
              icon={<Shield size={20} />} 
              title="Fake Calculator Mode" 
              subtitle="Hide vault behind calculator"
              onClick={() => onToggleFeature("fake_calc")}
              toggle={true}
              isPro={true}
              isToggled={isFakeCalculator}
            />
            <SettingItem 
              icon={<Smartphone size={20} />} 
              title="Intruder Selfie" 
              subtitle="Capture photo on wrong PIN"
              onClick={() => onToggleFeature("intruder_selfie")}
              toggle={true}
              isPro={true}
              isToggled={isIntruderSelfie}
            />
            <SettingItem 
              icon={<Camera size={20} />} 
              title="View Intruders" 
              subtitle={`${intruderPhotos.length} attempts captured`}
              onClick={() => setShowIntruders(true)}
              isPro={true}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 px-2">Customization</h2>
            <SettingItem 
              icon={<Palette size={20} />} 
              title="App Themes" 
              subtitle="Customize app appearance"
              onClick={() => setShowThemes(true)}
              isPro={true}
            />
            <SettingItem 
              icon={<Smartphone size={20} />} 
              title="Hidden App Icon" 
              subtitle="Disguise as regular calculator"
              onClick={() => onToggleFeature("hidden_icon")}
              toggle={true}
              isPro={true}
              isToggled={isHiddenIcon}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 px-2">General</h2>
            <SettingItem icon={<Bell size={20} />} title="Notifications" />
            <SettingItem 
              icon={<HelpCircle size={20} />} 
              title="App Guide" 
              subtitle="Learn how to use VaultX"
              onClick={onShowGuide}
            />
            <SettingItem icon={<Info size={20} />} title="About VaultX" subtitle="Version 1.0.0" />
          </div>

          <button 
            onClick={() => setShowResetConfirm(true)}
            className="w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold hover:bg-red-500/20 transition-all mb-10"
          >
            Reset All Data
          </button>
        </div>
      )}
    </div>
  );
}
