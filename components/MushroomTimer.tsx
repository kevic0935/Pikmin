
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, Plus, BellRing, Volume2, VolumeX, Edit2, Snowflake, Zap, Sparkles, Timer } from 'lucide-react';
import { playSound } from '../utils/audio.ts';
import { ThemeType } from '../App.tsx';

interface MushroomTimerProps {
  id: number;
  theme?: ThemeType;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

const MushroomTimer: React.FC<MushroomTimerProps> = ({ 
  id, 
  theme = 'light', 
  onDragStart, 
  onDragEnd, 
  onDragOver,
  isDragging = false 
}) => {
  const [teamName, setTeamName] = useState(`一起打蘑菇 ${id}`);
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleQuickStart = () => {
    setTimeLeft(300); // 5 minutes
    setIsRunning(true);
    if (!isMuted) playSound('start');
  };

  const addFiveMinutes = () => {
    setTimeLeft(prev => prev + 300);
  };

  const toggleTimer = () => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
      if (!isMuted) playSound('start');
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
            if (next === 60) playSound('warning60');
            if (next === 30) playSound('warning30');
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
    const baseClasses = "relative p-6 rounded-[2.5rem] transition-all duration-500 overflow-hidden cursor-grab active:cursor-grabbing border";
    const scaleClass = isDragging ? 'scale-95 opacity-50 grayscale rotate-1' : 'scale-100';

    if (timeLeft === 0 && !isRunning) {
        if (theme === 'dark') return `${baseClasses} bg-slate-900 border-slate-800 shadow-xl ${scaleClass}`;
        if (theme === 'christmas') return `${baseClasses} bg-white border-red-50 shadow-sm ${scaleClass}`;
        return `${baseClasses} bg-white border-slate-100 shadow-sm hover:shadow-md ${scaleClass}`;
    }

    if (timeLeft <= 10 && timeLeft > 0) {
        return `${baseClasses} bg-red-600/5 border-red-500/30 animate-pulse ring-2 ring-red-500/10 ${scaleClass}`;
    }
    if (timeLeft <= 30 && timeLeft > 0) {
        return `${baseClasses} bg-amber-600/5 border-amber-500/30 ${scaleClass}`;
    }
    
    if (theme === 'dark') return `${baseClasses} bg-slate-900 border-cyan-500/20 shadow-2xl ${scaleClass}`;
    if (theme === 'christmas') return `${baseClasses} bg-white border-red-100 shadow-md ${scaleClass}`;
    return `${baseClasses} bg-white border-green-50 shadow-lg ${scaleClass}`;
  };

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      className={getCardStyle()}
    >
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center text-white font-bold transition-all duration-700
            ${theme === 'christmas' ? 'bg-[#BB2528]' : theme === 'dark' ? 'bg-cyan-600 border border-cyan-400/20' : 'bg-slate-900'}`}>
            {theme === 'christmas' ? <Snowflake size={16} /> : theme === 'dark' ? <Sparkles size={16} /> : <Timer size={16} />}
          </div>
          
          <div className="relative flex-1 min-w-0 group">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onClick={(e) => e.stopPropagation()} 
              className={`w-full bg-transparent border-b-2 border-transparent hover:border-current/10 focus:border-current focus:outline-none text-lg font-black py-0.5 px-0 transition-all truncate
                ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
              placeholder="Team Name..."
            />
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} 
          className={`p-2.5 rounded-xl transition-all duration-500 active:scale-95 shrink-0
            ${isMuted 
              ? 'text-slate-400 bg-slate-100 dark:bg-slate-800' 
              : (theme === 'christmas' ? 'text-[#BB2528] bg-red-50' : theme === 'dark' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-900 bg-slate-50')
            }`}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {!isRunning && timeLeft === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center gap-4">
           <div className={`p-4 rounded-3xl transition-all duration-700 ${theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-50 text-slate-200'}`}>
              {theme === 'dark' ? <Sparkles size={40} /> : <Zap size={40} />}
           </div>
           <p className={`text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Squad Standby</p>
        </div>
      ) : (
        <div className="text-center py-6">
          <span className={`text-6xl font-mono font-black tracking-tighter transition-all duration-700 
            ${timeLeft <= 10 ? 'text-red-500' : (theme === 'dark' ? 'text-cyan-400' : theme === 'christmas' ? 'text-[#BB2528]' : 'text-slate-900')}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-4">
        {!isRunning && timeLeft === 0 ? (
          <button 
            onClick={(e) => { e.stopPropagation(); handleQuickStart(); }}
            className={`w-full text-white py-4 rounded-2xl font-bold text-base transition-all duration-500 flex items-center justify-center gap-3 shadow-sm active:scale-95
              ${theme === 'christmas' ? 'bg-[#BB2528] hover:bg-[#d42c2c]' : theme === 'dark' ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-slate-900 hover:bg-slate-800'}`}
          >
            <Play size={18} fill="white" /> 5min
          </button>
        ) : (
          <div className="grid grid-cols-12 gap-3">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleTimer(); }}
              className={`col-span-6 py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2.5 transition-all duration-500 active:scale-95
                ${isRunning 
                  ? (theme === 'christmas' ? 'bg-amber-600 hover:bg-amber-500' : theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 text-slate-900 hover:bg-slate-300') 
                  : (theme === 'christmas' ? 'bg-[#BB2528] hover:bg-[#d42c2c]' : theme === 'dark' ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-slate-900 hover:bg-slate-800')
                }`}
            >
              {isRunning ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); addFiveMinutes(); }}
              className={`col-span-4 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all duration-500 active:scale-95
                ${theme === 'christmas' ? 'bg-green-700 hover:bg-green-600' : theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-blue-600 hover:bg-blue-500'}`}
            >
              <Plus size={16} strokeWidth={3} /> 5m
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); resetTimer(); }}
              className={`col-span-2 py-4 rounded-2xl font-bold flex items-center justify-center transition-all duration-500 active:scale-95
                ${theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
            >
              <RotateCcw size={16} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
      
      {timeLeft <= 10 && timeLeft > 0 && (
        <div className="mt-4 text-center">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black border animate-bounce transition-all duration-700
              ${theme === 'dark' ? 'bg-cyan-500 text-white border-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)]' : theme === 'christmas' ? 'bg-[#BB2528] text-white border-transparent' : 'bg-red-600 text-white border-transparent'}`}>
              <BellRing size={12} /> DEPLOY NOW!
            </span>
        </div>
      )}
    </div>
  );
};

export default MushroomTimer;
