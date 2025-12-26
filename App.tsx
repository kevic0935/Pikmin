
import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Flower, Moon, Sun, TreePine, Snowflake, Gift, Plus, Sparkles, Trash2 } from 'lucide-react';
import MushroomTimer from './components/MushroomTimer.tsx';

export type ThemeType = 'light' | 'dark' | 'christmas';

export default function App() {
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as ThemeType;
      return saved || 'light';
    }
    return 'light';
  });

  const [timerIds, setTimerIds] = useState<number[]>([1, 2]);
  const [nextId, setNextId] = useState(3);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);

  const handleAddTeam = () => {
    setTimerIds([...timerIds, nextId]);
    setNextId(nextId + 1);
  };

  const handleDeleteTeam = useCallback((id: number) => {
    setTimerIds(prev => prev.filter(tid => tid !== id));
  }, []);

  const handleReorder = (sourceId: number, targetId: number) => {
    if (sourceId === targetId) return;
    setTimerIds(prev => {
      const newOrder = [...prev];
      const sourceIndex = newOrder.indexOf(sourceId);
      const targetIndex = newOrder.indexOf(targetId);
      newOrder.splice(sourceIndex, 1);
      newOrder.splice(targetIndex, 0, sourceId);
      return newOrder;
    });
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const getBgColor = () => {
    if (theme === 'dark') return 'bg-[#020617]';
    if (theme === 'christmas') return 'bg-[#fdf2f2]';
    return 'bg-[#f1f9e8]';
  };

  const getGradient = () => {
    if (theme === 'dark') return 'from-[#0f172a] via-[#1e1b4b] to-transparent opacity-80';
    if (theme === 'christmas') return 'from-[#fee2e2] opacity-100';
    return 'from-[#d9f2c1] opacity-100';
  };

  const getTitleColor = () => {
    if (theme === 'dark') return 'text-[#22d3ee] drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]';
    if (theme === 'christmas') return 'text-[#BB2528]';
    return 'text-[#2e5210]';
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 font-sans pb-48 selection:bg-[#22d3ee] selection:text-white ${getBgColor()}`}>
      
      {/* Theme Selection Group */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <button
          onClick={() => setTheme('christmas')}
          className={`p-3 rounded-2xl flex items-center justify-center transition-all btn-3d shadow-lg 
            ${theme === 'christmas'
              ? 'bg-[#BB2528] text-white shadow-[0_4px_0_0_#7f1d1d] border border-white/20'
              : (theme === 'dark' 
                  ? 'bg-[#1e293b] text-cyan-400/40 shadow-[0_4px_0_0_#020617] border border-cyan-500/10 hover:text-cyan-400' 
                  : 'bg-white text-gray-300 shadow-[0_4px_0_0_#e2e8f0] border border-gray-100 hover:text-[#BB2528]')
            }`}
        >
          <TreePine size={24} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`p-3 rounded-2xl flex items-center justify-center transition-all btn-3d shadow-lg 
            ${theme === 'dark' 
              ? 'bg-[#0f172a] text-[#22d3ee] shadow-[0_4px_0_0_#020617] border border-cyan-500/30 shadow-cyan-500/10' 
              : (theme === 'christmas'
                  ? 'bg-white text-gray-300 shadow-[0_4px_0_0_#e2e8f0] border border-gray-100 hover:text-[#76d02a]'
                  : 'bg-white text-[#76d02a] shadow-[0_4px_0_0_#e2e8f0] border border-[#76d02a]/10')
            }`}
        >
          {theme === 'dark' ? <Sparkles size={24} strokeWidth={2.5} /> : <Moon size={24} strokeWidth={2.5} />}
        </button>
      </div>

      <div className={`fixed top-0 left-0 w-full h-[500px] pointer-events-none transition-all duration-1000 bg-gradient-to-b ${getGradient()}`} />
      
      <div className="relative max-w-4xl mx-auto px-4 pt-16">
        <header className="mb-12 text-center">
          <div className={`inline-flex p-4 rounded-[2.5rem] shadow-2xl mb-6 transform -rotate-3 border-2 transition-all duration-700
            ${theme === 'dark' 
              ? 'bg-[#0f172a]/80 border-cyan-500/40 shadow-cyan-900/40 backdrop-blur-xl' 
              : theme === 'christmas'
              ? 'bg-white border-[#BB2528]/30 shadow-red-900/10'
              : 'bg-white border-[#76d02a]/10 shadow-green-900/10'
            }`}>
            {theme === 'christmas' ? (
              <TreePine size={48} strokeWidth={2.5} className="text-[#165B33]" />
            ) : theme === 'dark' ? (
              <Sparkles size={48} strokeWidth={2.5} className="text-[#22d3ee]" />
            ) : (
              <Timer size={48} strokeWidth={2.5} className="text-[#76d02a]" />
            )}
          </div>
          <h1 className={`text-5xl font-extrabold tracking-tight mb-2 transition-all duration-700 ${getTitleColor()}`}>
            Pikmin Bloom
          </h1>
          <p className={`${theme === 'christmas' ? 'text-[#165B33]' : theme === 'dark' ? 'text-cyan-400/60' : 'text-[#76d02a]'} font-extrabold text-sm uppercase tracking-[0.3em]`}>
            {theme === 'christmas' ? '聖誕節限定版 🎄' : theme === 'dark' ? '阿凡達幻彩版 ✨' : '蘑菇戰鬥倒數助手'}
          </p>
        </header>

        {/* Timers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          {timerIds.map(id => (
            <MushroomTimer 
              key={id} 
              id={id} 
              theme={theme}
              onDragStart={(e) => {
                setDraggedId(id);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragEnd={() => {
                setDraggedId(null);
                setIsOverTrash(false);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (draggedId !== null && draggedId !== id) {
                  handleReorder(draggedId, id);
                }
              }}
              isDragging={draggedId === id}
            />
          ))}
        </div>

        {/* Add Team Button */}
        <div className="flex justify-center mb-10">
          <button
            onClick={handleAddTeam}
            className={`px-10 py-5 rounded-full font-black text-xl btn-3d flex items-center gap-3 transition-all duration-700 shadow-xl
              ${theme === 'christmas'
                ? 'bg-[#165B33] text-white shadow-[0_6px_0_0_#064e3b] hover:bg-[#1b7a44]'
                : (theme === 'dark'
                    ? 'bg-[#0ea5e9] text-white shadow-[0_6px_0_0_#0369a1] hover:bg-[#38bdf8] border border-white/10'
                    : 'bg-[#76d02a] text-white shadow-[0_6px_0_0_#417417] hover:bg-[#86e03a]')
              }`}
          >
            <Plus size={28} strokeWidth={4} />
            新增隊伍
          </button>
        </div>

        {/* Information/Instruction Card */}
        <div className={`backdrop-blur-xl border-2 p-6 rounded-[2.5rem] mb-12 flex gap-5 items-center shadow-2xl transition-all duration-700
          ${theme === 'dark' 
            ? 'bg-[#1e293b]/40 border-cyan-500/20 shadow-cyan-900/20 text-cyan-50' 
            : theme === 'christmas'
            ? 'bg-white/90 border-[#BB2528]/20 shadow-red-900/5 text-[#7f1d1d]'
            : 'bg-white/90 border-[#76d02a]/20 shadow-green-900/5 text-[#417417]'
          }`}>
          <div className={`p-3 rounded-2xl flex-shrink-0 transition-colors duration-700 ${theme === 'christmas' ? 'bg-[#BB2528]/10' : theme === 'dark' ? 'bg-cyan-400/10' : 'bg-[#76d02a]/10'}`}>
            {theme === 'christmas' ? <Gift className="text-[#BB2528]" size={28} /> : theme === 'dark' ? <Sparkles className="text-cyan-400" size={28} /> : <Flower className="text-[#76d02a]" size={28} />}
          </div>
          <div>
            <p className={`font-black text-lg mb-1 tracking-wide transition-colors duration-700 ${theme === 'christmas' ? 'text-[#BB2528]' : theme === 'dark' ? 'text-cyan-300' : 'text-[#417417]'}`}>
              {theme === 'christmas' ? '聖誕活動提醒' : theme === 'dark' ? '幻彩模式提醒' : '戰鬥提醒說明'}
            </p>
            <p className="text-sm font-semibold opacity-70 leading-relaxed">
              • 音效提示：1分鐘 (長音) / 30秒 (雙音) / 10秒 (緊急三音) • 長按卡片可拖曳順序 • 拖曳至底部垃圾桶刪除
            </p>
          </div>
        </div>

        <footer className="mt-12 text-center pb-24">
          <div className="flex justify-center gap-4 mb-6 opacity-30 transition-all duration-700">
             {theme === 'christmas' ? (
               <>
                <TreePine size={20} className="text-[#165B33]" />
                <Snowflake size={20} className="text-[#BB2528]" />
                <TreePine size={20} className="text-[#165B33]" />
               </>
             ) : theme === 'dark' ? (
               <>
                <Sparkles size={20} className="text-cyan-400" />
                <Sparkles size={20} className="text-indigo-400" />
                <Sparkles size={20} className="text-cyan-400" />
               </>
             ) : (
               <>
                <Flower size={20} className="text-[#76d02a]" />
                <Flower size={20} className="text-[#76d02a]" />
                <Flower size={20} className="text-[#76d02a]" />
               </>
             )}
          </div>
          <div className="space-y-1">
            <p className={`${theme === 'christmas' ? 'text-[#BB2528]/70' : theme === 'dark' ? 'text-cyan-400/50' : 'text-[#76d02a]/70'} text-[11px] font-black tracking-[0.25em] uppercase transition-colors duration-700`}>
              Designed for Pikmin Bloom Explorers
            </p>
            <p className={`text-[10px] font-bold transition-colors duration-700 opacity-40 ${theme === 'dark' ? 'text-cyan-400' : (theme === 'christmas' ? 'text-[#BB2528]' : 'text-[#417417]')}`}>
              v2.3 • Multi-Alert Audio Update
            </p>
          </div>
        </footer>
      </div>

      {/* Trash Zone */}
      <div 
        className={`fixed bottom-0 left-0 w-full transition-all duration-500 z-[60] flex items-center justify-center
          ${draggedId !== null ? 'translate-y-0 h-40 opacity-100' : 'translate-y-full h-0 opacity-0'}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsOverTrash(true);
        }}
        onDragLeave={() => setIsOverTrash(false)}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedId !== null) {
            handleDeleteTeam(draggedId);
          }
          setDraggedId(null);
          setIsOverTrash(false);
        }}
      >
        <div className={`
          flex flex-col items-center gap-3 p-8 rounded-t-[3rem] transition-all duration-300 w-full max-w-lg
          ${isOverTrash 
            ? 'bg-red-600/90 text-white scale-110 shadow-[0_-20px_50px_rgba(220,38,38,0.5)]' 
            : 'bg-red-500/20 text-red-500 backdrop-blur-xl border-t border-red-500/30'
          }
        `}>
          <div className={`p-4 rounded-full transition-all ${isOverTrash ? 'bg-white/20 scale-125 rotate-12' : 'bg-red-500/10 animate-bounce'}`}>
            <Trash2 size={48} strokeWidth={2.5} />
          </div>
          <span className="font-black text-sm tracking-widest uppercase">
            {isOverTrash ? '放開以刪除隊伍' : '拖曳到此處刪除'}
          </span>
        </div>
      </div>

      <div className={`fixed bottom-0 left-0 w-full p-4 flex justify-center pointer-events-none transition-transform duration-500 ${draggedId !== null ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className={`backdrop-blur-xl px-8 py-3 rounded-full border shadow-2xl text-[10px] font-black tracking-widest uppercase transition-all duration-700
          ${theme === 'dark' 
            ? 'bg-[#0f172a]/90 border-cyan-500/30 text-[#22d3ee] shadow-cyan-500/10' 
            : theme === 'christmas'
            ? 'bg-[#BB2528]/90 border-[#BB2528]/20 text-white'
            : 'bg-white/90 border-[#76d02a]/20 text-[#76d02a]'
          }`}>
          {theme === 'christmas' ? 'Merry Christmas!' : theme === 'dark' ? 'Bioluminescence Active' : 'Happy Exploring!'}
        </div>
      </div>
    </div>
  );
}
