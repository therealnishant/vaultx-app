import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Crown, 
  Check, 
  X, 
  Zap, 
  Shield, 
  HardDrive, 
  Camera, 
  Palette, 
  Calculator as CalcIcon,
  Sparkles,
  EyeOff
} from "lucide-react";

interface PremiumUpgradeProps {
  onClose: () => void;
  onUpgrade: (plan: "monthly" | "lifetime") => void;
}

export default function PremiumUpgrade({ onClose, onUpgrade }: PremiumUpgradeProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime">("lifetime");
  const [isProcessing, setIsProcessing] = useState(false);

  const features = [
    { icon: <Zap size={20} className="text-yellow-400" />, title: "No Ads", desc: "Enjoy a completely ad-free experience" },
    { icon: <CalcIcon size={20} className="text-cyan-400" />, title: "Fake Calculator", desc: "Secondary vault with a different PIN" },
    { icon: <Camera size={20} className="text-red-400" />, title: "Intruder Selfie", desc: "Capture photos of failed login attempts" },
    { icon: <Palette size={20} className="text-purple-400" />, title: "Custom Themes", desc: "Unlock all premium app skins" },
    { icon: <HardDrive size={20} className="text-blue-400" />, title: "500 File Limit", desc: "Store up to 500 files (Free: 50)" },
    { icon: <EyeOff size={20} className="text-green-400" />, title: "Hidden Icon", desc: "Disguise the app as a regular calculator" },
  ];

  const handleStartPayment = () => {
    setIsProcessing(true);
    // Simple simulated delay
    setTimeout(() => {
      onUpgrade(selectedPlan);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col overflow-y-auto custom-scrollbar"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-6 shrink-0">
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition-colors"
        >
          <X size={20} className="text-zinc-400" />
        </button>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <Crown size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Premium</span>
        </div>
      </header>

      <div className="flex-1 px-6 pb-10 max-w-md mx-auto w-full">
        {/* Hero */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.3)]"
          >
            <Crown size={40} className="text-white fill-white/20" />
          </motion.div>
          <h2 className="text-4xl font-black mb-3 tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">Upgrade to Pro</h2>
          <p className="text-zinc-300 text-sm leading-relaxed font-medium">
            Unlock the full potential of VaultX and keep your privacy at its maximum level.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-4 mb-10">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-200">{f.title}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{f.desc}</p>
              </div>
              <Check size={16} className="text-cyan-500 ml-auto mt-1" />
            </motion.div>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button 
            onClick={() => setSelectedPlan("monthly")}
            className={`relative p-6 rounded-[32px] border-2 transition-all text-left flex flex-col justify-between h-40 ${
              selectedPlan === "monthly" 
                ? "border-cyan-500 bg-zinc-900 shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
                : "border-zinc-800 bg-zinc-900/50"
            }`}
          >
            <div>
              <span className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${selectedPlan === "monthly" ? "text-cyan-400" : "text-zinc-500"}`}>Monthly</span>
              <div className="flex flex-col">
                <span className="text-4xl font-black text-white leading-none">₹49</span>
                <span className="text-xs font-bold text-zinc-400 mt-1">per month</span>
              </div>
            </div>
            {selectedPlan === "monthly" && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg">
                <Check size={14} className="text-black font-bold" />
              </div>
            )}
          </button>

          <button 
            onClick={() => setSelectedPlan("lifetime")}
            className={`relative p-6 rounded-[32px] border-2 transition-all text-left flex flex-col justify-between h-40 ${
              selectedPlan === "lifetime" 
                ? "border-yellow-500 bg-zinc-900 shadow-[0_0_20px_rgba(234,179,8,0.2)]" 
                : "border-zinc-800 bg-zinc-900/50"
            }`}
          >
            <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-yellow-500 text-[10px] font-black text-black uppercase tracking-widest shadow-lg">Best Value</div>
            <div>
              <span className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${selectedPlan === "lifetime" ? "text-yellow-500" : "text-zinc-500"}`}>Lifetime</span>
              <div className="flex flex-col">
                <span className="text-4xl font-black text-white leading-none">₹99</span>
                <span className="text-xs font-bold text-zinc-400 mt-1">one-time</span>
              </div>
            </div>
            {selectedPlan === "lifetime" && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
                <Check size={14} className="text-black font-bold" />
              </div>
            )}
          </button>
        </div>

        {/* Action Button */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          disabled={isProcessing}
          onClick={handleStartPayment}
          className={`w-full py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${
            selectedPlan === "lifetime" 
              ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-black shadow-yellow-500/20" 
              : "bg-cyan-500 text-black shadow-cyan-500/20"
          }`}
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles size={20} />
              Upgrade Now
            </>
          )}
        </motion.button>

        <p className="text-center text-[10px] text-zinc-600 mt-6 px-10">
          Secure payment via Google Play. Cancel anytime. 
          By upgrading you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </motion.div>
  );
}
