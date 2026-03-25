import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, Delete, X, Minus, Plus, Equal, Divide } from "lucide-react";

interface CalculatorProps {
  onUnlock: () => void;
  secretCode: string;
  onFailedAttempt: () => void;
  themeColor: string;
}

export default function Calculator({ onUnlock, secretCode, onFailedAttempt, themeColor }: CalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [masterSequence, setMasterSequence] = useState("");

  const handleNumber = (num: string) => {
    setMasterSequence(""); // Reset sequence on number press
    if (display === "0" || lastResult !== null) {
      setDisplay(num);
      setLastResult(null);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setMasterSequence(prev => (prev + op).slice(-3));
    setEquation(display + " " + op + " ");
    setDisplay("0");
  };

  const calculate = () => {
    // Check for secret code or master unlock sequence (+×-=)
    if (display === secretCode || masterSequence === "+×-") {
      onUnlock();
      return;
    }

    if (display.length >= 4 && display !== secretCode) {
      onFailedAttempt();
    }

    try {
      const fullEquation = equation + display;
      // Basic safe evaluation for a calculator
      // Note: In a real app, use a proper math parser
      const result = eval(fullEquation.replace(/×/g, "*").replace(/÷/g, "/"));
      setDisplay(String(result));
      setEquation("");
      setLastResult(result);
    } catch (e) {
      setDisplay("Error");
      setEquation("");
    }
  };

  const clear = () => {
    setDisplay("0");
    setEquation("");
    setLastResult(null);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const Button = ({ 
    children, 
    onClick, 
    className = "", 
    variant = "default" 
  }: { 
    children: React.ReactNode; 
    onClick: () => void; 
    className?: string;
    variant?: "default" | "operator" | "action" | "equal";
  }) => {
    const baseStyles = "flex items-center justify-center text-2xl font-medium rounded-2xl transition-all duration-200 active:scale-95 h-16 w-16 md:h-20 md:w-20";
    const variants = {
      default: "bg-zinc-900/50 text-white hover:bg-zinc-800 border border-zinc-800/50",
      operator: "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 border border-zinc-700/50",
      action: "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 border border-zinc-700/50",
      equal: `bg-gradient-to-br ${themeColor} text-white shadow-lg shadow-black/20`,
    };

    return (
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-black text-white p-6 justify-end">
      {/* Display Area */}
      <div className="flex flex-col items-end mb-8 px-4">
        <div className="text-zinc-500 text-lg h-8 overflow-hidden transition-all">
          {equation}
        </div>
        <div className="text-6xl font-light tracking-tighter truncate w-full text-right">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        <Button onClick={clear} variant="action">AC</Button>
        <Button onClick={backspace} variant="action"><Delete size={24} /></Button>
        <Button onClick={() => handleOperator("%")} variant="action">%</Button>
        <Button onClick={() => handleOperator("÷")} variant="operator"><Divide size={24} /></Button>

        <Button onClick={() => handleNumber("7")}>7</Button>
        <Button onClick={() => handleNumber("8")}>8</Button>
        <Button onClick={() => handleNumber("9")}>9</Button>
        <Button onClick={() => handleOperator("×")} variant="operator"><X size={24} /></Button>

        <Button onClick={() => handleNumber("4")}>4</Button>
        <Button onClick={() => handleNumber("5")}>5</Button>
        <Button onClick={() => handleNumber("6")}>6</Button>
        <Button onClick={() => handleOperator("-")} variant="operator"><Minus size={24} /></Button>

        <Button onClick={() => handleNumber("1")}>1</Button>
        <Button onClick={() => handleNumber("2")}>2</Button>
        <Button onClick={() => handleNumber("3")}>3</Button>
        <Button onClick={() => handleOperator("+")} variant="operator"><Plus size={24} /></Button>

        <Button onClick={() => handleNumber("0")} className="col-span-1">0</Button>
        <Button onClick={() => handleNumber(".")}>.</Button>
        <Button onClick={calculate} variant="equal" className="col-span-2 w-full">
          <Equal size={28} />
        </Button>
      </div>

      {/* Subtle hint for dev/test */}
      <div className="mt-8 text-center text-[10px] text-zinc-800 uppercase tracking-[0.2em]">
        VaultX Secure System
      </div>
    </div>
  );
}
