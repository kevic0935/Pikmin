
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, Plus, BellRing, Volume2, VolumeX, Edit2, Snowflake, Zap, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio.ts';
import { ThemeType } from '../App.tsx';

interface MushroomTimerProps {
  id: number;
  theme?: ThemeType;
}

const MushroomTimer: React.FC<MushroomTimerProps> = ({ id, theme = 'light' }) => {
  const [teamName, setTeamName] = useState(`蘑菇隊伍 ${id}`);
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleQuickStart = () => {
    setTimeLeft(300); // 5 minutes
    setIsRunning(true);
  };

  const addFiveMinutes = () => {
    setTimeLeft(prev => prev + 300);
  };

  const toggleTimer = () => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1;
          
          if (!isMuted) {
            if (next === 20) playSound('warning20');
            if (next === 10) playSound('warning10');
          }
          
          if (next <= 0) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return next;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, isMuted]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getCardStyle = () => {
    const baseClasses = "p-6 rounded-[2.5rem] border-2 transition-all duration-700 backdrop-blur-md";
    const scaleClass = isRunning ? 'scale-[1.02]' : 'scale-100';

    if (timeLeft === 0 && !isRunning) {
        if (theme === 'dark') return `${baseClasses} bg-[#1e293b]/40 border-cyan-500/20 shadow-cyan-900/10 ${scaleClass}`;
        if (theme === 'christmas') return `${baseClasses} bg-white border-[#BB2528]/20 shadow-red-900/5 ${scaleClass}`;
        return `${baseClasses} bg-white border-transparent shadow-green-900/5 ${scaleClass}`;
    }

    if (timeLeft <= 10 && timeLeft > 0) {
        return `${baseClasses} bg-red-500/10 border-red-500 animate-pulse ring-4 ring-red-500/20 ${scaleClass}`;
    }
    if (timeLeft <= 20 && timeLeft > 0) {
        return `${baseClasses} bg-orange-500/10 border-orange-400 ring-4 ring-orange-500/20 ${scaleClass}`;
    }
    
    if (theme === 'dark') return `${baseClasses} bg-[#0f172a]/60 border-cyan-500/40 shadow-cyan-500/10 ${scaleClass}`;
    if (theme === 'christmas') return `${baseClasses} bg-white border-[#BB2528]/10 shadow-red-900/5 ${scaleClass}`;
    return `${baseClasses} bg-white border-transparent shadow-green-900/5 ${scaleClass}`;
  };

  const getTeamLabelColor = () => {
    if (theme === 'dark') return 'text-cyan-200 drop-shadow-[0_0_8px_rgba(165,243,252,0.3)]';
    if (theme === 'christmas') return 'text-[#BB2528]';
    return 'text-[#417417]';
  };

  return (
    <div className={getCardStyle()}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 flex-1 mr-2">
          <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-white font-black shadow-[0_4px_0_0] transition-all duration-700
            ${theme === 'christmas' ? 'bg-[#BB2528] shadow-[#7f1d1d]' : theme === 'dark' ? 'bg-[#0ea5e9] shadow-[#0369a1] border border-white/20' : 'bg-[#76d02a] shadow-[#417417]'}`}>
            {theme === 'christmas' ? <Snowflake size={20} /> : theme === 'dark' ? <Sparkles size={20} /> : id}
          </div>
          <div className="relative flex-1 group">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className={`w-full bg-transparent border-b-2 border-transparent hover:border-current focus:border-current focus:outline-none text-xl font-black py-0.5 px-1 transition-all
                ${getTeamLabelColor()}`}
              placeholder="輸入隊伍名稱..."
            />
            <Edit2 size={14} className={`absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 pointer-events-none transition-all ${theme === 'christmas' ? 'text-[#BB2528]' : theme === 'dark' ? 'text-cyan-400' : 'text-[#76d02a]'}`} />
          </div>
        </div>
        
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className={`p-2.5 rounded-full transition-all duration-500 ${isMuted ? 'text-gray-400 bg-gray-100 dark:bg-slate-800' : (theme === 'christmas' ? 'text-[#BB2528] bg-red-50' : theme === 'dark' ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-500/20' : 'text-[#76d02a] bg-green-50')} active:scale-90`}
        >
          {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>
      </div>

      {!isRunning && timeLeft === 0 ? (
        <div className={`text-center py-8 flex flex-col items-center justify-center gap-3 transition-opacity duration-700 ${theme === 'dark' ? 'opacity-30' : 'opacity-40'}`}>
           {theme === 'dark' ? <Sparkles className="text-cyan-400" size={40} /> : <Zap className={`${theme === 'christmas' ? 'text-[#BB2528]' : 'text-[#76d02a]'}`} size={40} />}
           <p className={`text-sm font-black tracking-widest ${theme === 'christmas' ? 'text-[#BB2528]' : theme === 'dark' ? 'text-cyan-300' : 'text-[#417417]'}`}>點擊下方按鈕開始倒數</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <span className={`text-6xl font-mono font-black tracking-tighter transition-all duration-700 
            ${timeLeft <= 20 ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : (theme === 'dark' ? 'text-cyan-100 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]' : theme === 'christmas' ? 'text-[#BB2528]' : 'text-[#2e5210]')}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {!isRunning && timeLeft === 0 ? (
          <button 
            onClick={handleQuickStart}
            className={`w-full text-white py-5 rounded-full font-black text-xl btn-3d transition-all duration-700 flex items-center justify-center gap-3
              ${theme === 'christmas' ? 'bg-[#BB2528] hover:bg-[#d42c2c] shadow-[0_6px_0_0_#7f1d1d]' : theme === 'dark' ? 'bg-[#0ea5e9] hover:bg-[#38bdf8] shadow-[0_6px_0_0_#0369a1] border border-white/10' : 'bg-[#76d02a] hover:bg-[#86e03a] shadow-[0_6px_0_0_#417417]'}`}
          >
            <Play size={24} fill="white" /> 5min 計時
          </button>
        ) : (
          <div className="grid grid-cols-12 gap-3">
            <button 
              onClick={toggleTimer}
              className={`col-span-6 py-4 rounded-full font-black text-sm text-white flex items-center justify-center gap-2 btn-3d transition-all duration-500 
                ${isRunning 
                  ? (theme === 'christmas' ? 'bg-orange-600 hover:bg-orange-500 shadow-[0_6px_0_0_#9a3412]' : theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_6px_0_0_#312e81]' : 'bg-amber-500 hover:bg-amber-400 shadow-[0_6px_0_0_#b45309]') 
                  : (theme === 'christmas' ? 'bg-[#BB2528] hover:bg-[#d42c2c] shadow-[0_6px_0_0_#7f1d1d]' : theme === 'dark' ? 'bg-[#0ea5e9] hover:bg-[#38bdf8] shadow-[0_6px_0_0_#0369a1]' : 'bg-[#76d02a] hover:bg-[#86e03a] shadow-[0_6px_0_0_#417417]')
                }`}
            >
              {isRunning ? <Square size={18} fill="white" /> : <Play size={18} fill="white" />}
              {isRunning ? '暫停' : '繼續'}
            </button>
            <button 
              onClick={addFiveMinutes}
              className={`col-span-4 text-white py-4 rounded-full font-black text-sm btn-3d flex items-center justify-center gap-1 transition-all duration-500
                ${theme === 'christmas' ? 'bg-[#165B33] hover:bg-[#1b7a44] shadow-[0_6px_0_0_#064e3b]' : theme === 'dark' ? 'bg-purple-600 hover:bg-purple-500 shadow-[0_6px_0_0_#4c1d95]' : 'bg-[#3da9fc] hover:bg-[#5dbbff] shadow-[0_6px_0_0_#1b75b8]'}`}
            >
              <Plus size={18} strokeWidth={3} /> 5m
            </button>
            <button 
              onClick={resetTimer}
              className={`col-span-2 py-4 rounded-full font-black btn-3d flex items-center justify-center transition-all duration-500 
                ${theme === 'dark' ? 'bg-slate-800 text-cyan-400 shadow-[0_6px_0_0_#020617] border border-cyan-500/10' : (theme === 'christmas' ? 'bg-red-100 text-[#BB2528] shadow-[0_6px_0_0_#fecaca]' : 'bg-gray-200 text-gray-500 shadow-[0_6px_0_0_#9ca3af]')}`}
            >
              <RotateCcw size={18} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
      
      {timeLeft <= 20 && timeLeft > 0 && (
        <div className="mt-5 text-center">
            <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black border animate-bounce shadow-xl transition-all duration-700
              ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-500/20' : theme === 'christmas' ? 'bg-[#BB2528]/10 text-[#BB2528] border-[#BB2528]/20' : 'bg-white/70 text-red-600 border-red-200'}`}>
              <BellRing size={14} className={theme === 'dark' ? 'text-cyan-400' : ''} /> 準備出發！
            </span>
        </div>
      )}
    </div>
  );
};

export default MushroomTimer;
