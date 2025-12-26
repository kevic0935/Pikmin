
import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Flower, Moon, TreePine, Snowflake, Gift, Plus, Sparkles, Trash2, HelpCircle, Clock, BookOpen, Target } from 'lucide-react';
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
    if (theme === 'dark') return 'bg-[#0a0f1d]';
    if (theme === 'christmas') return 'bg-[#fff5f5]';
    return 'bg-[#fcfdfa]';
  };

  const getGradient = () => {
    if (theme === 'dark') return 'from-[#1e293b]/20 via-transparent to-transparent';
    if (theme === 'christmas') return 'from-[#fee2e2]/30 via-transparent to-transparent';
    return 'from-[#76d02a]/5 via-transparent to-transparent';
  };

  const getSubtitle = () => {
    switch(theme) {
      case 'dark': return '星際阿凡達幻彩模式 ✨';
      case 'christmas': return '溫馨聖誕期間限定版 🎄';
      default: return '專業蘑菇戰鬥倒數助手 🌸';
    }
  };

  const getSubtitlePrefix = () => {
    switch(theme) {
      case 'dark': return 'Interstellar Mode';
      case 'christmas': return 'Holiday Special';
      default: return 'Standard Edition';
    }
  };

  const getSubtitleColor = () => {
    if (theme === 'dark') return 'text-cyan-400/60';
    if (theme === 'christmas') return 'text-red-600/60';
    return 'text-slate-400';
  };

  const getTitleColor = () => {
    if (theme === 'dark') return 'text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]';
    if (theme === 'christmas') return 'text-[#BB2528]';
    return 'text-slate-800';
  };

  return (
    <div className={`min-h-screen transition-all duration-700 font-sans selection:bg-[#76d02a] selection:text-white pb-12 ${getBgColor()}`}>
      
      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5 shadow-sm">
        <div className="flex items-center gap-2">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[#76d02a]/10 text-[#76d02a]'}`}>
             <Timer size={18} strokeWidth={2.5} />
           </div>
           <h1 className={`text-sm font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Pikmin Bloom 蘑菇殺手助手</h1>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl">
          <button onClick={() => setTheme('light')} className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'bg-white shadow-sm text-[#76d02a]' : 'text-slate-400 hover:text-slate-600'}`} aria-label="切換亮色模式"><Flower size={16} /></button>
          <button onClick={() => setTheme('dark')} className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-700 shadow-sm text-cyan-400' : 'text-slate-400 hover:text-slate-600'}`} aria-label="切換深色模式"><Moon size={16} /></button>
          <button onClick={() => setTheme('christmas')} className={`p-2 rounded-lg transition-all ${theme === 'christmas' ? 'bg-white shadow-sm text-red-600' : 'text-slate-400 hover:text-slate-600'}`} aria-label="切換聖誕模式"><TreePine size={16} /></button>
        </div>
      </nav>

      {/* Hero Background */}
      <div className={`fixed top-0 left-0 w-full h-[600px] pointer-events-none transition-all duration-1000 bg-gradient-to-b ${getGradient()}`} />
      
      <main className="relative max-w-5xl mx-auto px-6 pt-24">
        {/* Header Section */}
        <header className="mb-16 border-b border-slate-200 dark:border-slate-800 pb-10 transition-all duration-700 flex flex-col items-center">
          <div className="text-center space-y-2">
            <p className={`text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-700 ${getSubtitleColor()}`}>
              {getSubtitlePrefix()}
            </p>
            <h2 className={`text-2xl md:text-3xl font-black transition-all duration-700 tracking-tight ${getTitleColor()}`}>
              {getSubtitle()}
            </h2>
            <div className={`h-1 w-12 mx-auto rounded-full mt-4 transition-all duration-700 
              ${theme === 'dark' ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : theme === 'christmas' ? 'bg-red-500' : 'bg-[#76d02a]'}`} 
            />
          </div>
        </header>

        {/* Timers Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-16" aria-label="計時器列表">
          {timerIds.map(id => (
            <MushroomTimer 
              key={id} 
              id={id} 
              theme={theme}
              onDragStart={(e) => { setDraggedId(id); e.dataTransfer.effectAllowed = 'move'; }}
              onDragEnd={() => { setDraggedId(null); setIsOverTrash(false); }}
              onDragOver={(e) => { e.preventDefault(); if (draggedId !== null && draggedId !== id) handleReorder(draggedId, id); }}
              isDragging={draggedId === id}
            />
          ))}
        </section>

        {/* SEO / GEO / AEO Content Layer (Knowledge Base) */}
        <section className="space-y-8 mb-20">
          {/* Quick Info Card */}
          <div className={`border p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center transition-all duration-700
            ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800 text-slate-300' : theme === 'christmas' ? 'bg-white border-red-50 text-slate-700' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
            <div className={`p-4 rounded-2xl flex-shrink-0 transition-all ${theme === 'christmas' ? 'bg-red-50 text-red-600' : theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-green-50 text-green-600'}`}>
              <HelpCircle size={32} />
            </div>
            <div>
              <h3 className={`font-bold text-xl mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>使用小撇步</h3>
              <p className="text-sm font-medium opacity-80 leading-relaxed max-w-2xl">
                系統將於倒數 <span className="font-bold underline">1:00</span>、<span className="font-bold underline">0:30</span> 及 <span className="font-bold underline">0:10</span> 發出音效提醒。您可以長按並拖移卡片來調整順序，或將其拉到底部區域刪除。點擊隊伍名稱即可隨時自訂標題。
              </p>
            </div>
          </div>

          {/* GEO Optimized Content Section */}
          <article className={`grid grid-cols-1 md:grid-cols-2 gap-8 p-10 rounded-[3rem] border transition-all duration-700
            ${theme === 'dark' ? 'bg-slate-900/20 border-slate-800/50' : 'bg-white border-slate-100'}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#76d02a]">
                <Target size={20} />
                <h4 className="font-black text-lg uppercase tracking-wider">關於 Pikmin Bloom 蘑菇挑戰</h4>
              </div>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                在 <strong>Pikmin Bloom</strong> 中，<strong>蘑菇挑戰</strong> 是獲得獎勵與花蜜的重要途徑。由於蘑菇戰鬥通常需要數小時甚至數天，專業玩家會使用「<strong>蘑菇殺手倒數計時器</strong>」來精確預測戰鬥結束時間，確保第一時間重新派隊，最大化戰鬥效率。
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-500">
                <BookOpen size={20} />
                <h4 className="font-black text-lg uppercase tracking-wider">倒數計時器的核心優勢</h4>
              </div>
              <ul className={`text-sm space-y-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                <li>• <strong>精準提醒：</strong>在蘑菇即將擊破前發出 3 段音效告警。</li>
                <li>• <strong>多組管理：</strong>同時追蹤多個不同地點的<strong>蘑菇挑戰</strong>進度。</li>
                <li>• <strong>效率優化：</strong>無縫銜接下一場戰鬥，成為名副其實的蘑菇殺手。</li>
              </ul>
            </div>
          </article>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center pb-12 border-t border-slate-200 dark:border-slate-800 pt-12">
          <div className="flex justify-center gap-6 mb-8 opacity-40 transition-all">
             {theme === 'christmas' ? (
               <><TreePine size={18} className="text-[#BB2528]" /><Snowflake size={18} className="text-blue-300" /><Gift size={18} className="text-[#BB2528]" /></>
             ) : theme === 'dark' ? (
               <><Sparkles size={18} className="text-cyan-400" /><Moon size={18} className="text-indigo-400" /><Sparkles size={18} className="text-cyan-400" /></>
             ) : (
               <><Flower size={18} className="text-[#76d02a]" /><Timer size={18} className="text-[#76d02a]" /><Flower size={18} className="text-[#76d02a]" /></>
             )}
          </div>
          <div className="space-y-2">
            <p className={`${theme === 'christmas' ? 'text-red-900/60' : theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} text-[10px] font-bold tracking-[0.4em] uppercase`}>
              Est. 2025 • Bloom Labs • 皮克敏玩家社群工具
            </p>
            <p className={`text-[12px] font-bold ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>
              Version 2.0 • 蘑菇挑戰專用助手
            </p>
          </div>
        </footer>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={handleAddTeam}
        aria-label="新增蘑菇隊伍"
        className={`fixed bottom-8 right-8 z-[70] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90 hover:scale-110 group
          bg-white border border-slate-100 text-[#76d02a]
          shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_rgba(118,208,42,0.3)]
          ${draggedId !== null ? 'translate-y-32 opacity-0' : 'translate-y-0 opacity-100'}
        `}
      >
        <Clock size={32} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-300" />
        <Plus size={14} strokeWidth={4} className="absolute top-3 right-3 bg-white p-0.5 rounded-full border-2 border-[#76d02a] translate-x-1 -translate-y-1" />
      </button>

      {/* Trash Zone */}
      <div 
        className={`fixed bottom-0 left-0 w-full transition-all duration-500 z-[60] flex items-center justify-center
          ${draggedId !== null ? 'translate-y-0 h-48 opacity-100' : 'translate-y-full h-0 opacity-0'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsOverTrash(true); }}
        onDragLeave={() => setIsOverTrash(false)}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedId !== null) handleDeleteTeam(draggedId);
          setDraggedId(null);
          setIsOverTrash(false);
        }}
      >
        <div className={`
          flex flex-col items-center gap-4 p-10 rounded-t-[4rem] transition-all duration-300 w-full max-w-2xl
          ${isOverTrash 
            ? 'bg-red-600 text-white scale-105 shadow-2xl' 
            : 'bg-slate-900/90 text-slate-400 backdrop-blur-2xl border-t border-white/10'
          }
        `}>
          <div className={`p-5 rounded-full transition-all ${isOverTrash ? 'bg-white/20 scale-110' : 'bg-slate-800'}`}>
            <Trash2 size={40} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xs tracking-[0.3em] uppercase">
            {isOverTrash ? '放開以刪除' : '將隊伍拖移至此處刪除'}
          </span>
        </div>
      </div>

      {/* Floating Badge */}
      <div className={`fixed bottom-6 left-6 p-1 flex justify-center pointer-events-none transition-all duration-500 ${draggedId !== null ? 'opacity-0' : 'opacity-100'}`}>
        <div className={`backdrop-blur-xl px-5 py-2 rounded-full border shadow-sm text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-700
          ${theme === 'dark' 
            ? 'bg-slate-900/90 border-slate-800 text-cyan-400' 
            : theme === 'christmas'
            ? 'bg-white border-red-50 text-red-600'
            : 'bg-white border-slate-100 text-slate-400'
          }`}>
          {theme === 'christmas' ? 'Pikmin Bloom Expert' : theme === 'dark' ? 'Mushroom Slayer Mode' : 'Blooming Daily'}
        </div>
      </div>
    </div>
  );
}
