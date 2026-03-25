import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Lock, Image as ImageIcon, Video, Settings as SettingsIcon, User, Plus, Folder, LogOut, Crown } from "lucide-react";
import Settings from "./Settings";
import MediaGallery from "./MediaGallery";
import { get, set, clear } from "idb-keyval";
import { AdBanner } from "../App";

interface VaultProps {
  onLock: () => void;
  secretCode: string;
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
  themeColors: string;
}

export default function Vault({ 
  onLock, 
  secretCode, 
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
  onSetTheme,
  themeColors
}: VaultProps) {
  const [activeTab, setActiveTab] = useState<"vault" | "settings" | "photos" | "videos">("vault");
  const [counts, setCounts] = useState({ photos: 0, videos: 0 });
  const [customFolders, setCustomFolders] = useState<{name: string, count: number}[]>([]);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const totalFiles = counts.photos + counts.videos;
  const storageLimit = isPremiumUser ? 500 : 50;
  const storagePercent = Math.min((totalFiles / storageLimit) * 100, 100);

  useEffect(() => {
    const loadData = async () => {
      const photos = await get<any[]>("vaultx_media_photo");
      const videos = await get<any[]>("vaultx_media_video");
      const savedFolders = await get<{name: string, count: number}[]>("vaultx_custom_folders");
      
      setCounts({
        photos: photos?.length || 0,
        videos: videos?.length || 0
      });
      if (savedFolders) setCustomFolders(savedFolders);
    };
    loadData();
  }, [activeTab]);

  const handleAddFolder = async () => {
    if (!isPremiumUser) {
      onShowPremium();
      return;
    }
    if (!newFolderName.trim()) return;
    const updated = [...customFolders, { name: newFolderName, count: 0 }];
    setCustomFolders(updated);
    await set("vaultx_custom_folders", updated);
    setNewFolderName("");
    setIsAddingFolder(false);
  };

  const folders = [
    { name: "Photos", count: counts.photos, icon: <ImageIcon size={20} className="text-blue-400" />, type: "photos" },
    { name: "Videos", count: counts.videos, icon: <Video size={20} className="text-cyan-400" />, type: "videos" },
    ...customFolders.map(f => ({ 
      name: f.name, 
      count: f.count, 
      icon: <Folder size={20} className="text-indigo-400" />, 
      type: "photos" 
    }))
  ];

  if (activeTab === "settings") {
    return (
      <Settings 
        onBack={() => setActiveTab("vault")} 
        currentPin={secretCode} 
        onUpdatePin={onUpdatePin}
        onShowGuide={onShowGuide}
        isPremiumUser={isPremiumUser}
        onShowPremium={onShowPremium}
        onReset={onReset}
        onTogglePremium={onTogglePremium}
        isFakeCalculator={isFakeCalculator}
        isIntruderSelfie={isIntruderSelfie}
        isHiddenIcon={isHiddenIcon}
        appTheme={appTheme}
        intruderPhotos={intruderPhotos}
        onToggleFeature={onToggleFeature}
        onSetTheme={onSetTheme}
      />
    );
  }

  if (activeTab === "photos") {
    return (
      <MediaGallery 
        type="photo" 
        onBack={() => setActiveTab("vault")} 
        isPremiumUser={isPremiumUser}
        currentCount={totalFiles}
        limit={storageLimit}
        onShowPremium={onShowPremium}
      />
    );
  }

  if (activeTab === "videos") {
    return (
      <MediaGallery 
        type="video" 
        onBack={() => setActiveTab("vault")} 
        isPremiumUser={isPremiumUser}
        currentCount={totalFiles}
        limit={storageLimit}
        onShowPremium={onShowPremium}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-black text-white p-6 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between mb-10 mt-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${themeColors} flex items-center justify-center shadow-lg`}>
            <Lock size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">VaultX</h1>
        </div>
        <div className="flex items-center gap-3">
          {!isPremiumUser && (
            <button 
              onClick={onShowPremium}
              className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all"
            >
              <Crown size={20} />
            </button>
          )}
          <button 
            onClick={onLock}
            className="p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition-colors"
          >
            <LogOut size={20} className="text-zinc-400" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
        {/* Storage Info */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Vault Storage</span>
            <span className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${themeColors}`}>{totalFiles} / {storageLimit} files</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${storagePercent}%` }}
              className={`h-full bg-gradient-to-r ${themeColors}`}
            />
          </div>
        </div>

        {/* Ad Banner for Free Users */}
        {!isPremiumUser && <AdBanner onUpgrade={onShowPremium} />}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("photos")}
            className="flex flex-col items-center justify-center gap-3 bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-6 hover:bg-zinc-800/50 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <ImageIcon size={24} className="text-blue-400" />
            </div>
            <span className="font-medium">Photos</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("videos")}
            className="flex flex-col items-center justify-center gap-3 bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-6 hover:bg-zinc-800/50 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
              <Video size={24} className="text-cyan-400" />
            </div>
            <span className="font-medium">Videos</span>
          </motion.button>
        </div>

        {/* Folders Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-zinc-300">Folders</h2>
              <button 
                onClick={() => setIsAddingFolder(true)}
                className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <button 
              onClick={() => setActiveTab("photos")}
              className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${themeColors} hover:opacity-80 transition-all`}
            >
              View All
            </button>
          </div>

          <AnimatePresence>
            {isAddingFolder && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-4 bg-zinc-900/50 border border-cyan-500/20 rounded-2xl">
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Folder name..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddFolder()}
                    className="w-full bg-transparent border-none outline-none text-white placeholder-zinc-600 mb-3"
                  />
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setIsAddingFolder(false)}
                      className="px-3 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddFolder}
                      className={`px-3 py-1 bg-gradient-to-r ${themeColors} text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all`}
                    >
                      Create
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-4">
            {folders.map((folder, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setActiveTab(folder.type as any)}
                className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/30 rounded-2xl hover:bg-zinc-900/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                    {folder.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-200">{folder.name}</h3>
                    <p className="text-xs text-zinc-500">{folder.count} items</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full bg-zinc-800/30 flex items-center justify-center group-hover:bg-white/10 transition-colors`}>
                  <Plus size={16} className="text-zinc-500 group-hover:text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-6 flex justify-between items-center px-4 py-4 bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-zinc-800/50 shrink-0">
        <button 
          onClick={() => setActiveTab("vault")}
          className={`p-2 transition-colors ${activeTab === "vault" ? "text-white" : "text-zinc-500"}`}
        >
          <Folder size={24} />
        </button>
        <button 
          onClick={() => setActiveTab("photos")}
          className="p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <Plus size={24} />
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          className={`p-2 transition-colors ${activeTab === "settings" ? "text-white" : "text-zinc-500"}`}
        >
          <SettingsIcon size={24} />
        </button>
      </div>
    </div>
  );
}
