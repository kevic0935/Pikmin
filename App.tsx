
import React, { useState, useEffect } from 'react';
import { Timer, Flower, Moon, Sun, TreePine, Snowflake, Gift, Plus, Sparkles } from 'lucide-react';
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
    if (theme === 'dark') return 'bg-[#020617]'; // Deep Space Blue
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
    <div className={`min-h-screen transition-colors duration-700 font-sans pb-24 selection:bg-[#22d3ee] selection:text-white ${getBgColor()}`}>
      
      {/* Theme Selection Group - Top Right */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        {/* Christmas Theme Button */}
        <button
          onClick={() => setTheme('christmas')}
          className={`p-3 rounded-2xl flex items-center justify-center transition-all btn-3d shadow-lg 
            ${theme === 'christmas'
              ? 'bg-[#BB2528] text-white shadow-[0_4px_0_0_#7f1d1d] border border-white/20'
              : (theme === 'dark' 
                  ? 'bg-[#1e293b] text-cyan-400/40 shadow-[0_4px_0_0_#020617] border border-cyan-500/10 hover:text-cyan-400' 
                  : 'bg-white text-gray-300 shadow-[0_4px_0_0_#e2e8f0] border border-gray-100 hover:text-[#BB2528]')
            }`}
          aria-label="Christmas theme"
        >
          <TreePine size={24} strokeWidth={2.5} />
        </button>

        {/* Light/Dark Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`p-3 rounded-2xl flex items-center justify-center transition-all btn-3d shadow-lg 
            ${theme === 'dark' 
              ? 'bg-[#0f172a] text-[#22d3ee] shadow-[0_4px_0_0_#020617] border border-cyan-500/30 shadow-cyan-500/10' 
              : (theme === 'christmas'
                  ? 'bg-white text-gray-300 shadow-[0_4px_0_0_#e2e8f0] border border-gray-100 hover:text-[#76d02a]'
                  : 'bg-white text-[#76d02a] shadow-[0_4px_0_0_#e2e8f0] border border-[#76d02a]/10')
            }`}
          aria-label="Toggle Avatar Dark mode"
        >
          {theme === 'dark' ? <Sparkles size={24} strokeWidth={2.5} /> : <Moon size={24} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Decorative Background Gradient */}
      <div className={`fixed top-0 left-0 w-full h-[500px] pointer-events-none transition-all duration-1000 bg-gradient-to-b ${getGradient()}`} />
      
      {/* Bioluminescent floating particles for Dark theme */}
      {theme === 'dark' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-cyan-400 rounded-full blur-[2px] animate-pulse" />
          <div className="absolute top-[60%] left-[80%] w-3 h-3 bg-indigo-400 rounded-full blur-[3px] animate-bounce" style={{ animationDuration: '4s' }} />
          <div className="absolute top-[40%] left-[40%] w-1.5 h-1.5 bg-purple-400 rounded-full blur-[1px] animate-pulse" style={{ animationDuration: '3s' }} />
        </div>
      )}

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

        {/* Information/Instruction Card */}
        <div className={`backdrop-blur-xl border-2 p-6 rounded-[2.5rem] mb-10 flex gap-5 items-center shadow-2xl transition-all duration-700
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

        {/* Footer Branding */}
        <footer className="mt-24 text-center">
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
            <p className={`text-[10px] font-bold transition-colors duration-700 ${theme === 'dark' ? 'text-cyan-400/20' : (theme === 'christmas' ? 'text-[#BB2528]/40' : 'text-[#417417]/40')}`}>
              v2.0 • 暗色阿凡達幻彩版 & 動態隊伍
            </p>
          </div>
        </footer>
      </div>

      {/* Persistent Status Bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center pointer-events-none">
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
