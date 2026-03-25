import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Lock, Smartphone, Camera, ChevronRight, Check } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to VaultX",
      description: "The most secure place for your private photos and videos. Everything is encrypted and hidden behind a fake calculator.",
      icon: <Shield size={48} className="text-cyan-400" />,
      color: "from-cyan-500 to-blue-600"
    },
    {
      title: "Fake Calculator Lock",
      description: "The app looks like a normal calculator. Enter your secret code and press '=' to unlock your private vault.",
      icon: <Lock size={48} className="text-blue-400" />,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Forgot Your PIN?",
      description: "Don't worry! If you ever forget your code, just press '+', '×', '-', and then '=' on the calculator to unlock.",
      icon: <Smartphone size={48} className="text-indigo-400" />,
      color: "from-indigo-500 to-purple-600"
    },
    {
      title: "Intruder Detection",
      description: "VaultX captures a selfie of anyone who tries to break into your vault with the wrong PIN.",
      icon: <Camera size={48} className="text-purple-400" />,
      color: "from-purple-500 to-pink-600"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex-1 flex flex-col items-center justify-center p-8 text-center"
        >
          <div className={`w-32 h-32 rounded-[40px] bg-gradient-to-br ${steps[currentStep].color} flex items-center justify-center mb-12 shadow-[0_0_40px_rgba(6,182,212,0.2)]`}>
            {steps[currentStep].icon}
          </div>
          
          <h2 className="text-4xl font-bold mb-6 tracking-tight">
            {steps[currentStep].title}
          </h2>
          
          <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
            {steps[currentStep].description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="p-12 flex flex-col items-center gap-8">
        {/* Step Indicators */}
        <div className="flex gap-3">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? "w-8 bg-cyan-500" : "w-2 bg-zinc-800"
              }`} 
            />
          ))}
        </div>

        {/* Action Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={nextStep}
          className="w-full max-w-xs py-5 rounded-3xl bg-white text-black font-bold text-lg flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
        >
          {currentStep === steps.length - 1 ? (
            <>Get Started <Check size={20} /></>
          ) : (
            <>Next <ChevronRight size={20} /></>
          )}
        </motion.button>

        <button 
          onClick={onComplete}
          className="text-zinc-500 font-medium hover:text-zinc-300 transition-colors"
        >
          Skip Guide
        </button>
      </div>
    </div>
  );
}
