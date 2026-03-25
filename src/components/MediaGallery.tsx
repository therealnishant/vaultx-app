import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Plus, Image as ImageIcon, Video, Trash2, ExternalLink, Play, X } from "lucide-react";
import { get, set } from "idb-keyval";

interface MediaItem {
  id: string;
  type: "photo" | "video";
  file: File;
  url?: string;
  name: string;
  date: string;
}

interface MediaGalleryProps {
  type: "photo" | "video";
  onBack: () => void;
  isPremiumUser: boolean;
  currentCount: number;
  limit: number;
  onShowPremium: () => void;
}

export default function MediaGallery({ 
  type, 
  onBack, 
  isPremiumUser, 
  currentCount, 
  limit, 
  onShowPremium 
}: MediaGalleryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<Set<string>>(new Set());

  const createSafeUrl = (file: File) => {
    const url = URL.createObjectURL(file);
    urlsRef.current.add(url);
    return url;
  };

  const revokeAllUrls = () => {
    urlsRef.current.forEach(url => URL.revokeObjectURL(url));
    urlsRef.current.clear();
  };

  // Load items from IndexedDB on mount
  useEffect(() => {
    const loadItems = async () => {
      try {
        const key = `vaultx_media_${type}`;
        const savedItems = await get<MediaItem[]>(key);
        if (savedItems) {
          const itemsWithUrls = savedItems.map(item => ({
            ...item,
            url: createSafeUrl(item.file)
          }));
          setItems(itemsWithUrls);
        }
      } catch (error) {
        console.error("Failed to load media:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();

    return () => revokeAllUrls();
  }, [type]);

  // Save items to IndexedDB whenever they change
  const saveItems = async (newItems: MediaItem[]) => {
    try {
      const key = `vaultx_media_${type}`;
      const itemsToSave = newItems.map(({ url, ...rest }) => rest);
      await set(key, itemsToSave);
    } catch (error) {
      console.error("Failed to save media:", error);
    }
  };

  const handleAddMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (currentCount + files.length > limit) {
      setError(`Storage limit reached! ${isPremiumUser ? "500" : "50"} files max. Upgrade for more.`);
      if (!isPremiumUser) {
        setTimeout(() => onShowPremium(), 2000);
      }
      return;
    }

    const newItems: MediaItem[] = Array.from(files).map((file: File) => {
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: type,
        file: file,
        url: createSafeUrl(file),
        name: file.name,
        date: new Date().toLocaleDateString(),
      };
    });

    const updatedItems = [...newItems, ...items];
    setItems(updatedItems);
    await saveItems(updatedItems);
  };

  const handleDelete = async (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    if (itemToDelete?.url) {
      URL.revokeObjectURL(itemToDelete.url);
      urlsRef.current.delete(itemToDelete.url);
    }
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    await saveItems(updatedItems);
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-6 relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 mt-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-zinc-400" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight capitalize">{type}s</h1>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          <Plus size={24} />
        </button>
      </header>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium flex justify-between items-center"
          >
            {error}
            <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/10 rounded-lg">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept={type === "photo" ? "image/*" : "video/*"}
        multiple
        onChange={handleAddMedia}
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
          <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 text-zinc-700">
            {type === "photo" ? <ImageIcon size={40} /> : <Video size={40} />}
          </div>
          <h3 className="text-xl font-bold mb-2">No {type}s yet</h3>
          <p className="text-zinc-500 text-sm max-w-[200px]">
            Tap the + button to add your first private {type}.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4 pb-10">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setSelectedItem(item)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer"
                >
                  {item.type === "photo" ? (
                    <img 
                      src={item.url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                      <Play size={32} className="text-cyan-500" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
                      <ExternalLink size={20} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[10px] text-white/70 truncate px-1">
                      {item.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Fullscreen Preview */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <header className="flex items-center justify-between p-6 bg-gradient-to-b from-black/90 to-transparent shrink-0">
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 transition-colors border border-zinc-800"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleDelete(selectedItem.id)}
                  className="p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors border border-red-500/20"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </header>

            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
              {selectedItem.type === "photo" ? (
                <motion.img 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  src={selectedItem.url} 
                  alt={selectedItem.name} 
                  className="max-w-full max-h-full object-contain rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <video 
                  src={selectedItem.url} 
                  controls 
                  autoPlay
                  className="max-w-full max-h-full rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                />
              )}
            </div>

            <footer className="p-8 text-center bg-gradient-to-t from-black/90 to-transparent shrink-0">
              <h3 className="font-bold text-lg text-white mb-1 truncate max-w-xs mx-auto">{selectedItem.name}</h3>
              <p className="text-zinc-500 text-sm">{selectedItem.date}</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
