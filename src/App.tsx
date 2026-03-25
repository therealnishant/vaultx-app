import React, { useState, useEffect } from "react";
import Calculator from "./components/Calculator";
import Vault from "./components/Vault";
import Onboarding from "./components/Onboarding";
import PremiumUpgrade from "./components/PremiumUpgrade";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Shield, Check, Crown, X, ExternalLink } from "lucide-react";

import { get, set, clear } from "idb-keyval";

export function AdBanner({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-6 mb-6 p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/50 flex items-center justify-between relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
          <Crown size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Remove Ads</h4>
          <p className="text-xs font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Upgrade to Pro for ₹49/mo</p>
        </div>
      </div>
      <button 
        onClick={onUpgrade}
        className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all relative z-10"
      >
        Upgrade
      </button>
    </motion.div>
  );
}

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [secretCode, setSecretCode] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const [setupStep, setSetupStep] = useState<"initial" | "confirm">("initial");
  const [tempPin, setTempPin] = useState("");
  const [setupError, setSetupError] = useState<string | null>(null);

  // Premium Features State
  const [isFakeCalculator, setIsFakeCalculator] = useState(true);
  const [isIntruderSelfie, setIsIntruderSelfie] = useState(false);
  const [isHiddenIcon, setIsHiddenIcon] = useState(false);
  const [appTheme, setAppTheme] = useState("default");
  const [intruderPhotos, setIntruderPhotos] = useState<any[]>([]);

  useEffect(() => {
    const initApp = async () => {
      // Check if first time
      const hasSeenGuide = localStorage.getItem("vaultx_guide_seen");
      if (!hasSeenGuide) {
        setShowGuide(true);
      }

      // Load PIN from localStorage
      const savedPin = localStorage.getItem("vaultx_pin");
      if (savedPin) {
        setSecretCode(savedPin);
      }

      // Load Premium status
      const savedPremium = localStorage.getItem("vaultx_premium");
      if (savedPremium === "true") {
        setIsPremiumUser(true);
      }

      // Load Premium Features
      setIsFakeCalculator(localStorage.getItem("vaultx_fake_calc") !== "false");
      setIsIntruderSelfie(localStorage.getItem("vaultx_intruder_selfie") === "true");
      setIsHiddenIcon(localStorage.getItem("vaultx_hidden_icon") === "true");
      setAppTheme(localStorage.getItem("vaultx_theme") || "default");
      
      const savedIntruders = await get<any[]>("vaultx_intruders");
      if (savedIntruders) setIntruderPhotos(savedIntruders);
      
      // Simulate loading/initialization
      setTimeout(() => setIsInitialized(true), 1500);
    };

    initApp();
  }, []);

  useEffect(() => {
    if (isHiddenIcon) {
      document.title = "Calculator";
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) link.href = "https://cdn-icons-png.flaticon.com/512/564/564429.png";
    } else {
      document.title = "VaultX";
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) link.href = "/vite.svg";
    }
  }, [isHiddenIcon]);

  const handleOnboardingComplete = () => {
    setShowGuide(false);
    localStorage.setItem("vaultx_guide_seen", "true");
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const handleLock = () => {
    setIsLocked(true);
  };

  const handleUpdatePin = (newPin: string) => {
    setSecretCode(newPin);
    localStorage.setItem("vaultx_pin", newPin);
  };

  const handleInitialSetup = (pin: string) => {
    setTempPin(pin);
    setSetupStep("confirm");
    setSetupError(null);
  };

  const handleConfirmSetup = (pin: string) => {
    if (pin === tempPin) {
      handleUpdatePin(pin);
      setSetupError(null);
    } else {
      setSetupError("PINs do not match. Please try again.");
      setSetupStep("initial");
      setTempPin("");
    }
  };

  const handleSkipSetup = () => {
    handleUpdatePin("1234");
  };

  const handleUpgrade = (plan: "monthly" | "lifetime") => {
    setIsPremiumUser(true);
    localStorage.setItem("vaultx_premium", "true");
    setShowPremiumUpgrade(false);
  };

  const handleTogglePremium = () => {
    const newState = !isPremiumUser;
    setIsPremiumUser(newState);
    localStorage.setItem("vaultx_premium", newState ? "true" : "false");
  };

  const handleToggleFeature = (feature: string) => {
    if (!isPremiumUser) {
      setShowPremiumUpgrade(true);
      return;
    }

    switch (feature) {
      case "fake_calc":
        const newCalc = !isFakeCalculator;
        setIsFakeCalculator(newCalc);
        localStorage.setItem("vaultx_fake_calc", String(newCalc));
        break;
      case "intruder_selfie":
        const newIntruder = !isIntruderSelfie;
        setIsIntruderSelfie(newIntruder);
        localStorage.setItem("vaultx_intruder_selfie", String(newIntruder));
        break;
      case "hidden_icon":
        const newHidden = !isHiddenIcon;
        setIsHiddenIcon(newHidden);
        localStorage.setItem("vaultx_hidden_icon", String(newHidden));
        break;
    }
  };

  const handleSetTheme = (theme: string) => {
    if (!isPremiumUser) {
      setShowPremiumUpgrade(true);
      return;
    }
    setAppTheme(theme);
    localStorage.setItem("vaultx_theme", theme);
  };

  const handleFailedAttempt = async () => {
    if (!isIntruderSelfie) return;
    
    const newIntruder = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      // Simulated photo - in a real app we'd use the camera API
      photoUrl: `https://picsum.photos/seed/${Math.random()}/400/400`
    };
    
    const updated = [newIntruder, ...intruderPhotos];
    setIntruderPhotos(updated);
    await set("vaultx_intruders", updated);
  };

  const handleReset = async () => {
    // Clear all localStorage
    localStorage.clear();
    // Clear IndexedDB
    await clear();
    // Reload the app to initial state
    window.location.reload();
  };

  const getThemeColors = () => {
    switch (appTheme) {
      case "midnight": return "from-indigo-600 to-purple-700 shadow-indigo-500/40";
      case "emerald": return "from-emerald-500 to-teal-600 shadow-emerald-500/40";
      case "rose": return "from-rose-500 to-pink-600 shadow-rose-500/40";
      case "sunset": return "from-orange-500 to-red-600 shadow-orange-500/40";
      default: return "from-cyan-500 to-blue-600 shadow-cyan-500/40";
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${getThemeColors()} flex items-center justify-center mb-6`}
        >
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
          VaultX
        </h1>
        <p className="text-zinc-500 text-sm mt-2 font-medium tracking-widest uppercase">
          Secure Storage
        </p>
      </div>
    );
  }

  // Show onboarding guide first
  if (showGuide) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // First time setup flow
  if (!secretCode) {
    return (
      <div className="h-screen bg-black text-white p-8 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto w-full text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-8">
            <Shield size={40} className="text-cyan-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {setupStep === "initial" ? "Set Your PIN" : "Confirm PIN"}
          </h2>
          <p className="text-zinc-500 mb-10">
            {setupStep === "initial" 
              ? "Enter a 4-6 digit code to secure your vault." 
              : "Enter the same code again to confirm."}
          </p>

          {setupError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 px-4 rounded-2xl mb-6 font-medium"
            >
              {setupError}
            </motion.div>
          )}
          
          <div className="grid grid-cols-4 gap-4 max-w-xs mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "OK"].map((key) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (key === "C") {
                    setTempPin("");
                  } else if (key === "OK") {
                    if (tempPin.length >= 4) {
                      if (setupStep === "initial") handleInitialSetup(tempPin);
                      else handleConfirmSetup(tempPin);
                      setTempPin("");
                    }
                  } else {
                    if (tempPin.length < 6) setTempPin(tempPin + key);
                  }
                }}
                className={`h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all ${
                  key === "OK" 
                    ? "bg-cyan-500 text-black col-span-1" 
                    : key === "C"
                    ? "bg-zinc-800 text-zinc-400"
                    : "bg-zinc-900 text-white border border-zinc-800"
                }`}
              >
                {key === "OK" ? <Check size={24} /> : key}
              </motion.button>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < tempPin.length ? "bg-cyan-500 scale-125 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-zinc-800"
                  }`} 
                />
              ))}
            </div>

            <button 
              onClick={handleSkipSetup}
              className="text-zinc-500 text-sm font-medium hover:text-zinc-300 transition-colors"
            >
              Skip and use default PIN (1234)
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-hidden font-sans selection:bg-cyan-500/30">
      <AnimatePresence mode="wait">
        {isLocked ? (
          <motion.div
            key="calculator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {isFakeCalculator ? (
              <Calculator 
                onUnlock={handleUnlock} 
                secretCode={secretCode} 
                onFailedAttempt={handleFailedAttempt}
                themeColor={getThemeColors()}
              />
            ) : (
              <div className="h-full bg-black flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8">
                  <Lock size={40} className="text-cyan-500" />
                </div>
                <h2 className="text-2xl font-bold mb-8">Enter PIN</h2>
                <div className="grid grid-cols-3 gap-4 max-w-xs w-full">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "OK"].map((key) => (
                    <motion.button
                      key={key}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        if (key === "C") setTempPin("");
                        else if (key === "OK") {
                          if (tempPin === secretCode) {
                            handleUnlock();
                          } else {
                            handleFailedAttempt();
                            setTempPin("");
                          }
                        } else {
                          if (tempPin.length < 6) setTempPin(tempPin + key);
                        }
                      }}
                      className="h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-bold"
                    >
                      {key}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-8 flex gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i < tempPin.length ? "bg-cyan-500" : "bg-zinc-800"}`} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="vault"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="h-full"
          >
            <Vault 
              onLock={handleLock} 
              secretCode={secretCode} 
              onUpdatePin={handleUpdatePin} 
              onShowGuide={() => setShowGuide(true)}
              isPremiumUser={isPremiumUser}
              onShowPremium={() => setShowPremiumUpgrade(true)}
              onReset={handleReset}
              onTogglePremium={handleTogglePremium}
              // New Premium Features
              isFakeCalculator={isFakeCalculator}
              isIntruderSelfie={isIntruderSelfie}
              isHiddenIcon={isHiddenIcon}
              appTheme={appTheme}
              intruderPhotos={intruderPhotos}
              onToggleFeature={handleToggleFeature}
              onSetTheme={handleSetTheme}
              themeColors={getThemeColors()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPremiumUpgrade && (
          <PremiumUpgrade 
            onClose={() => setShowPremiumUpgrade(false)} 
            onUpgrade={handleUpgrade}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
