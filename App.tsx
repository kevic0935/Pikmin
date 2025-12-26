
import React, { useState, useEffect } from 'react';
import { Timer, Flower, Moon, Sun, TreePine, Snowflake, Gift, Plus } from 'lucide-react';
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

  const handleAddTeam = () => {
    setTimerIds([...timerIds, nextId]);
    setNextId(nextId + 1);
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const getBgColor = () => {
    if (theme === 'dark') return 'bg-[#0a1205]';
    if (theme === 'christmas') return 'bg-[#fdf2f2]';
    return 'bg-[#f1f9e8]';
  };

  const getGradient = () => {
    if (theme === 'dark') return 'from-[#162a0c] opacity-60';
    if (theme === 'christmas') return 'from-[#fee2e2] opacity-100';
    return 'from-[#d9f2c1] opacity-100';
  };

  const getTitleColor = () => {
    if (theme === 'dark') return 'text-[#d9f2c1]';
    if (theme === 'christmas') return 'text-[#BB2528]';
    return 'text-[#2e5210]';
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans pb-24 selection:bg-[#76d02a] selection:text-white ${getBgColor()}`}>
      
      {/* Theme Selection Group - Top Right */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        {/* Christmas Theme Button (Left) */}
        <button
          onClick={() => setTheme('christmas')}
          className={`p-3 rounded-2xl flex items-center justify-center transition-all btn-3d shadow-lg 
            ${theme === 'christmas'
              ? 'bg-[#BB2528] text-white shadow-[0_4px_0_0_#7f1d1d] border border-white/20'
              : (theme === 'dark' 
                  ? 'bg-[#162a0c] text-[#76d02a]/40 shadow-[0_4px_0_0_#050a02] border border-[#76d02a]/10 hover:text-[#76d02a]' 
                  : 'bg-white text-gray-300 shadow-[0_4px_0_0_#e2e8f0] border border-gray-100 hover:text-[#BB2528]')
            }`}
          aria-label="Christmas theme"
        >
          <TreePine size={24} strokeWidth={2.5} />
        </button>

        {/* Light/Dark Toggle Button (Right) */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`p-3 rounded-2xl flex items-center justify-center transition-all btn-3d shadow-lg 
            ${theme === 'dark' 
              ? 'bg-[#162a0c] text-[#76d02a] shadow-[0_4px_0_0_#050a02] border border-[#76d02a]/20' 
              : (theme === 'christmas'
                  ? 'bg-white text-gray-300 shadow-[0_4px_0_0_#e2e8f0] border border-gray-100 hover:text-[#76d02a]'
                  : 'bg-white text-[#76d02a] shadow-[0_4px_0_0_#e2e8f0] border border-[#76d02a]/10')
            }`}
          aria-label="Toggle Light/Dark mode"
        >
          {theme === 'dark' ? <Sun size={24} strokeWidth={2.5} /> : <Moon size={24} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Decorative Background Gradient */}
      <div className={`fixed top-0 left-0 w-full h-80 pointer-events-none transition-all duration-700 bg-gradient-to-b to-transparent ${getGradient()}`} />
      
      {/* Floating Snowflakes for Christmas */}
      {theme === 'christmas' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
          <Snowflake className="absolute top-10 left-[10%] animate-bounce text-[#BB2528]" size={20} />
          <Snowflake className="absolute top-40 left-[80%] animate-pulse text-[#165B33]" size={30} />
          <Snowflake className="absolute top-80 left-[30%] animate-bounce text-[#BB2528]" size={15} />
        </div>
      )}

      <div className="relative max-w-4xl mx-auto px-4 pt-16">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <div className={`inline-flex p-4 rounded-[2rem] shadow-2xl mb-6 transform -rotate-3 border-2 transition-all duration-500
            ${theme === 'dark' 
              ? 'bg-[#162a0c] border-[#76d02a]/30 shadow-black/40' 
              : theme === 'christmas'
              ? 'bg-white border-[#BB2528]/30 shadow-red-900/10'
              : 'bg-white border-[#76d02a]/10 shadow-green-900/10'
            }`}>
            {theme === 'christmas' ? (
              <TreePine size={48} strokeWidth={2.5} className="text-[#165B33]" />
            ) : (
              <Timer size={48} strokeWidth={2.5} className="text-[#76d02a]" />
            )}
          </div>
          <h1 className={`text-4xl font-extrabold tracking-tight mb-2 drop-shadow-sm transition-colors duration-500 ${getTitleColor()}`}>
            Pikmin Bloom
          </h1>
          <p className={`${theme === 'christmas' ? 'text-[#165B33]' : 'text-[#76d02a]'} font-extrabold text-sm uppercase tracking-[0.2em]`}>
            {theme === 'christmas' ? '聖誕節限定版 🎄' : '蘑菇戰鬥倒數助手'}
          </p>
        </header>

        {/* Information/Instruction Card */}
        <div className={`backdrop-blur-md border-2 p-6 rounded-[2.5rem] mb-10 flex gap-5 items-center shadow-xl transition-all duration-500
          ${theme === 'dark' 
            ? 'bg-[#162a0c]/90 border-[#76d02a]/30 shadow-black/20 text-[#d9f2c1]' 
            : theme === 'christmas'
            ? 'bg-white/90 border-[#BB2528]/20 shadow-red-900/5 text-[#7f1d1d]'
            : 'bg-white/90 border-[#76d02a]/20 shadow-green-900/5 text-[#417417]'
          }`}>
          <div className={`p-3 rounded-2xl flex-shrink-0 ${theme === 'christmas' ? 'bg-[#BB2528]/10' : 'bg-[#76d02a]/10'}`}>
            {theme === 'christmas' ? <Gift className="text-[#BB2528]" size={28} /> : <Flower className="text-[#76d02a]" size={28} />}
          </div>
          <div>
            <p className={`font-black text-lg mb-1 tracking-wide ${theme === 'christmas' ? 'text-[#BB2528]' : (theme === 'dark' ? 'text-[#76d02a]' : '')}`}>
              {theme === 'christmas' ? '聖誕活動提醒' : '戰鬥提醒說明'}
            </p>
            <p className="text-sm font-semibold opacity-80 leading-relaxed">
              • 點擊名稱即可修改 • 20秒 中音提示 • 10秒 雙高音提示 • 按下 +5m 快速增加時間
            </p>
          </div>
        </div>

        {/* Timers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          {timerIds.map(id => (
            <MushroomTimer key={id} id={id} theme={theme} />
          ))}
        </div>

        {/* Add Team Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleAddTeam}
            className={`px-10 py-5 rounded-full font-black text-xl btn-3d flex items-center gap-3 transition-all duration-500 shadow-xl
              ${theme === 'christmas'
                ? 'bg-[#165B33] text-white shadow-[0_6px_0_0_#064e3b] hover:bg-[#1b7a44]'
                : (theme === 'dark'
                    ? 'bg-[#76d02a] text-[#162a0c] shadow-[0_6px_0_0_#417417] hover:bg-[#86e03a]'
                    : 'bg-[#76d02a] text-white shadow-[0_6px_0_0_#417417] hover:bg-[#86e03a]')
              }`}
          >
            <Plus size={28} strokeWidth={4} />
            新增隊伍
          </button>
        </div>

        {/* Footer Branding */}
        <footer className="mt-24 text-center">
          <div className="flex justify-center gap-4 mb-6 opacity-30">
             {theme === 'christmas' ? (
               <>
                <TreePine size={20} className="text-[#165B33]" />
                <Snowflake size={20} className="text-[#BB2528]" />
                <TreePine size={20} className="text-[#165B33]" />
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
            <p className={`${theme === 'christmas' ? 'text-[#BB2528]/70' : 'text-[#76d02a]/70'} text-[11px] font-black tracking-[0.25em] uppercase`}>
              Designed for Pikmin Bloom Explorers
            </p>
            <p className={`text-[10px] font-bold transition-colors duration-500 ${theme === 'dark' ? 'text-[#76d02a]/40' : (theme === 'christmas' ? 'text-[#BB2528]/40' : 'text-[#417417]/40')}`}>
              v1.9 • 動態新增隊伍 & Quick Start
            </p>
          </div>
        </footer>
      </div>

      {/* Persistent Status Bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center pointer-events-none">
        <div className={`backdrop-blur-md px-6 py-2 rounded-full border shadow-lg text-[10px] font-black tracking-widest uppercase transition-all duration-500
          ${theme === 'dark' 
            ? 'bg-[#162a0c]/90 border-[#76d02a]/30 text-[#76d02a]' 
            : theme === 'christmas'
            ? 'bg-[#BB2528]/90 border-[#BB2528]/20 text-white'
            : 'bg-white/90 border-[#76d02a]/20 text-[#76d02a]'
          }`}>
          {theme === 'christmas' ? 'Merry Christmas!' : 'Happy Exploring!'}
        </div>
      </div>
    </div>
  );
}
