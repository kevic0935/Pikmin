
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, Plus, BellRing, Volume2, VolumeX, Edit2, Gift, Snowflake, Zap } from 'lucide-react';
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

  // Unified behavior for all teams
  const handleQuickStart = () => {
    setTimeLeft(300); // 5 minutes (300 seconds)
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
    if (timeLeft === 0 && !isRunning) {
        if (theme === 'dark') return 'bg-[#162a0c] border-[#76d02a]/10 shadow-black/40';
        if (theme === 'christmas') return 'bg-white border-[#BB2528]/20 shadow-red-900/5';
        return 'bg-white border-transparent shadow-green-900/5';
    }
    if (timeLeft <= 10 && timeLeft > 0) return 'bg-red-50 dark:bg-red-950/30 border-red-300 animate-pulse ring-4 ring-red-200 dark:ring-red-900/40';
    if (timeLeft <= 20 && timeLeft > 0) return 'bg-orange-50 dark:bg-orange-950/20 border-orange-300 ring-4 ring-orange-100 dark:ring-orange-900/20';
    
    if (theme === 'dark') return 'bg-[#162a0c] border-[#76d02a]/10 shadow-black/40';
    if (theme === 'christmas') return 'bg-white border-[#BB2528]/10 shadow-xl shadow-red-900/5';
    return 'bg-white border-transparent shadow-xl shadow-green-900/5';
  };

  const getTeamLabelColor = () => {
    if (theme === 'dark') return 'text-[#d9f2c1]';
    if (theme === 'christmas') return 'text-[#BB2528]';
    return 'text-[#417417]';
  };

  return (
    <div className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 ${getCardStyle()} ${isRunning ? 'scale-[1.02]' : 'scale-100'}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 flex-1 mr-2">
          <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center text-white font-black shadow-[0_4px_0_0] transition-all duration-500
            ${theme === 'christmas' ? 'bg-[#BB2528] shadow-[#7f1d1d]' : 'bg-[#76d02a] shadow-[#417417]'}`}>
            {theme === 'christmas' ? <Snowflake size={18} /> : id}
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
            <Edit2 size={14} className={`absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 pointer-events-none ${theme === 'christmas' ? 'text-[#BB2528]' : 'text-[#76d02a]'}`} />
          </div>
        </div>
        
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className={`p-2 rounded-full transition-all ${isMuted ? 'text-gray-400 bg-gray-100 dark:bg-[#233b15]' : (theme === 'christmas' ? 'text-[#BB2528] bg-red-50' : 'text-[#76d02a] bg-green-50 dark:bg-[#233b15]/50')} active:scale-90`}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {!isRunning && timeLeft === 0 ? (
        <div className={`text-center py-6 flex flex-col items-center justify-center gap-2 opacity-50`}>
           <Zap className={`${theme === 'christmas' ? 'text-[#BB2528]' : 'text-[#76d02a]'}`} size={32} />
           <p className={`text-sm font-black ${theme === 'christmas' ? 'text-[#BB2528]' : 'text-[#417417]'}`}>點擊下方按鈕開始 5min 計時</p>
        </div>
      ) : (
        <div className="text-center py-6">
          <span className={`text-5xl md:text-6xl font-mono font-black tracking-tight transition-colors duration-500 
            ${timeLeft <= 20 ? 'text-red-500' : (theme === 'dark' || theme === 'christmas' ? (theme === 'christmas' ? 'text-[#BB2528]' : 'text-[#d9f2c1]') : 'text-[#2e5210]')}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {!isRunning && timeLeft === 0 ? (
          <button 
            onClick={handleQuickStart}
            className={`w-full text-white py-4 rounded-full font-black text-lg btn-3d transition-all duration-500 flex items-center justify-center gap-2
              ${theme === 'christmas' ? 'bg-[#BB2528] hover:bg-[#d42c2c] shadow-[0_6px_0_0_#7f1d1d]' : 'bg-[#76d02a] hover:bg-[#86e03a] shadow-[0_6px_0_0_#417417]'}`}
          >
            <Play size={20} fill="white" /> 5min 計時
          </button>
        ) : (
          <div className="grid grid-cols-12 gap-3">
            <button 
              onClick={toggleTimer}
              className={`col-span-6 py-4 rounded-full font-black text-sm text-white flex items-center justify-center gap-2 btn-3d transition-all 
                ${isRunning 
                  ? (theme === 'christmas' ? 'bg-orange-600 hover:bg-orange-500 shadow-[0_6px_0_0_#9a3412]' : 'bg-amber-500 hover:bg-amber-400 shadow-[0_6px_0_0_#b45309]') 
                  : (theme === 'christmas' ? 'bg-[#BB2528] hover:bg-[#d42c2c] shadow-[0_6px_0_0_#7f1d1d]' : 'bg-[#76d02a] hover:bg-[#86e03a] shadow-[0_6px_0_0_#417417]')
                }`}
            >
              {isRunning ? <Square size={18} fill="white" /> : <Play size={18} fill="white" />}
              {isRunning ? '暫停' : '繼續'}
            </button>
            <button 
              onClick={addFiveMinutes}
              className={`col-span-4 text-white py-4 rounded-full font-black text-sm btn-3d flex items-center justify-center gap-1 transition-all
                ${theme === 'christmas' ? 'bg-[#165B33] hover:bg-[#1b7a44] shadow-[0_6px_0_0_#064e3b]' : 'bg-[#3da9fc] hover:bg-[#5dbbff] shadow-[0_6px_0_0_#1b75b8]'}`}
            >
              <Plus size={18} strokeWidth={3} /> 5m
            </button>
            <button 
              onClick={resetTimer}
              className={`col-span-2 py-4 rounded-full font-black btn-3d flex items-center justify-center transition-colors duration-500 
                ${theme === 'dark' ? 'bg-[#233b15] text-[#76d02a] shadow-[0_6px_0_0_#050a02]' : (theme === 'christmas' ? 'bg-red-100 text-[#BB2528] shadow-[0_6px_0_0_#fecaca]' : 'bg-gray-200 text-gray-500 shadow-[0_6px_0_0_#9ca3af]')}`}
            >
              <RotateCcw size={18} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
      
      {timeLeft <= 20 && timeLeft > 0 && (
        <div className="mt-4 text-center">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black border animate-bounce shadow-sm transition-all duration-500
              ${theme === 'dark' ? 'bg-[#162a0c]/80 text-red-400 border-red-900/50' : (theme === 'christmas' ? 'bg-[#BB2528]/10 text-[#BB2528] border-[#BB2528]/20' : 'bg-white/70 text-red-600 border-red-200')}`}>
              {theme === 'christmas' ? <Gift size={14} /> : <BellRing size={14} />} 準備出發！
            </span>
        </div>
      )}
    </div>
  );
};

export default MushroomTimer;
