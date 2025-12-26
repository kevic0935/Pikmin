
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, Plus, BellRing, Volume2, VolumeX, Edit2, Snowflake, Zap, Sparkles } from 'lucide-react';
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
    const baseClasses = "relative p-4 rounded-[2rem] border-2 transition-all duration-500 backdrop-blur-md overflow-hidden cursor-grab active:cursor-grabbing";
    const scaleClass = isDragging ? 'scale-95 opacity-50 grayscale rotate-1' : (isRunning ? 'scale-[1.01]' : 'scale-100');

    if (timeLeft === 0 && !isRunning) {
        if (theme === 'dark') return `${baseClasses} bg-[#1e293b]/30 border-cyan-500/20 shadow-cyan-900/10 ${scaleClass}`;
        if (theme === 'christmas') return `${baseClasses} bg-white border-[#BB2528]/20 shadow-red-900/5 ${scaleClass}`;
        return `${baseClasses} bg-white border-[#76d02a]/10 shadow-green-900/5 ${scaleClass}`;
    }

    if (timeLeft <= 10 && timeLeft > 0) {
        return `${baseClasses} bg-red-500/10 border-red-500 animate-pulse ring-4 ring-red-500/20 ${scaleClass}`;
    }
    if (timeLeft <= 20 && timeLeft > 0) {
        return `${baseClasses} bg-orange-500/10 border-orange-400 ring-4 ring-orange-500/20 ${scaleClass}`;
    }
    
    if (theme === 'dark') return `${baseClasses} bg-[#0f172a]/60 border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.1)] ${scaleClass}`;
    if (theme === 'christmas') return `${baseClasses} bg-white border-[#BB2528]/10 shadow-red-900/5 ${scaleClass}`;
    return `${baseClasses} bg-white border-[#76d02a]/20 shadow-green-900/5 ${scaleClass}`;
  };

  const getTeamLabelColor = () => {
    if (theme === 'dark') return 'text-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]';
    if (theme === 'christmas') return 'text-[#BB2528]';
    return 'text-[#2e5210]';
  };

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      className={getCardStyle()}
    >
      {/* Top Header Row - More Compact */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-white font-black shadow-[0_3px_0_0] transition-all duration-700
            ${theme === 'christmas' ? 'bg-[#BB2528] shadow-[#7f1d1d]' : theme === 'dark' ? 'bg-cyan-500 shadow-[#0369a1] border border-white/20' : 'bg-[#76d02a] shadow-[#417417]'}`}>
            {theme === 'christmas' ? <Snowflake size={14} /> : theme === 'dark' ? <Sparkles size={14} /> : id}
          </div>
          
          <div className="relative flex-1 min-w-0 group">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Allow typing without dragging
              className={`w-full bg-transparent border-b-2 border-transparent hover:border-current/30 focus:border-current focus:outline-none text-lg font-black py-0.5 px-1 transition-all truncate
                ${getTeamLabelColor()}`}
              placeholder="輸入隊伍名稱..."
            />
            <Edit2 size={10} className={`absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 pointer-events-none transition-all ${theme === 'christmas' ? 'text-[#BB2528]' : theme === 'dark' ? 'text-cyan-400' : 'text-[#76d02a]'}`} />
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} 
          className={`p-2 rounded-xl transition-all duration-500 active:scale-90 shadow-sm shrink-0
            ${isMuted 
              ? 'text-gray-400 bg-gray-100 dark:bg-slate-800' 
              : (theme === 'christmas' ? 'text-[#BB2528] bg-red-50' : theme === 'dark' ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/20' : 'text-[#76d02a] bg-green-50')
            }`}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {!isRunning && timeLeft === 0 ? (
        <div className={`text-center py-4 flex flex-col items-center justify-center gap-2 transition-opacity duration-700 ${theme === 'dark' ? 'opacity-20' : 'opacity-30'}`}>
           {theme === 'dark' ? <Sparkles className="text-cyan-400" size={32} /> : <Zap className={`${theme === 'christmas' ? 'text-[#BB2528]' : 'text-[#76d02a]'}`} size={32} />}
           <p className={`text-[9px] font-black tracking-[0.2em] uppercase ${theme === 'christmas' ? 'text-[#BB2528]' : theme === 'dark' ? 'text-cyan-300' : 'text-[#417417]'}`}>Ready</p>
        </div>
      ) : (
        <div className="text-center py-3">
          <span className={`text-5xl font-mono font-black tracking-tighter transition-all duration-700 
            ${timeLeft <= 20 ? 'text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]' : (theme === 'dark' ? 'text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]' : theme === 'christmas' ? 'text-[#BB2528]' : 'text-[#2e5210]')}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2.5 mt-1">
        {!isRunning && timeLeft === 0 ? (
          <button 
            onClick={(e) => { e.stopPropagation(); handleQuickStart(); }}
            className={`w-full text-white py-3 rounded-2xl font-black text-base btn-3d transition-all duration-500 flex items-center justify-center gap-2 shadow-md
              ${theme === 'christmas' ? 'bg-[#BB2528] hover:bg-[#d42c2c] shadow-[0_4px_0_0_#7f1d1d]' : theme === 'dark' ? 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_4px_0_0_#0891b2] border border-white/10' : 'bg-[#76d02a] hover:bg-[#86e03a] shadow-[0_4px_0_0_#417417]'}`}
          >
            <Play size={18} fill="white" /> 5min 計時
          </button>
        ) : (
          <div className="grid grid-cols-12 gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleTimer(); }}
              className={`col-span-6 py-3 rounded-xl font-black text-xs text-white flex items-center justify-center gap-1.5 btn-3d transition-all duration-500 shadow-sm
                ${isRunning 
                  ? (theme === 'christmas' ? 'bg-orange-600 hover:bg-orange-500 shadow-[0_3px_0_0_#9a3412]' : theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_3px_0_0_#312e81]' : 'bg-amber-500 hover:bg-amber-400 shadow-[0_3px_0_0_#b45309]') 
                  : (theme === 'christmas' ? 'bg-[#BB2528] hover:bg-[#d42c2c] shadow-[0_3px_0_0_#7f1d1d]' : theme === 'dark' ? 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_3px_0_0_#0891b2]' : 'bg-[#76d02a] hover:bg-[#86e03a] shadow-[0_3px_0_0_#417417]')
                }`}
            >
              {isRunning ? <Square size={14} fill="white" /> : <Play size={14} fill="white" />}
              {isRunning ? '暫停' : '繼續'}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); addFiveMinutes(); }}
              className={`col-span-4 text-white py-3 rounded-xl font-black text-xs btn-3d flex items-center justify-center gap-1 transition-all duration-500 shadow-sm
                ${theme === 'christmas' ? 'bg-[#165B33] hover:bg-[#1b7a44] shadow-[0_3px_0_0_#064e3b]' : theme === 'dark' ? 'bg-purple-600 hover:bg-purple-500 shadow-[0_3px_0_0_#4c1d95]' : 'bg-[#3da9fc] hover:bg-[#5dbbff] shadow-[0_3px_0_0_#1b75b8]'}`}
            >
              <Plus size={14} strokeWidth={3} /> 5m
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); resetTimer(); }}
              className={`col-span-2 py-3 rounded-xl font-black btn-3d flex items-center justify-center transition-all duration-500 shadow-sm
                ${theme === 'dark' ? 'bg-slate-800 text-cyan-400 shadow-[0_3px_0_0_#020617] border border-cyan-500/10' : (theme === 'christmas' ? 'bg-red-100 text-[#BB2528] shadow-[0_3px_0_0_#fecaca]' : 'bg-gray-100 text-gray-500 shadow-[0_3px_0_0_#9ca3af]')}`}
            >
              <RotateCcw size={14} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
      
      {timeLeft <= 20 && timeLeft > 0 && (
        <div className="mt-3 text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border animate-bounce shadow-lg transition-all duration-700
              ${theme === 'dark' ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400/50 shadow-cyan-500/30' : theme === 'christmas' ? 'bg-[#BB2528]/10 text-[#BB2528] border-[#BB2528]/20' : 'bg-white/70 text-red-600 border-red-200'}`}>
              <BellRing size={10} className={theme === 'dark' ? 'text-cyan-400' : ''} /> GO!
            </span>
        </div>
      )}
    </div>
  );
};

export default MushroomTimer;
