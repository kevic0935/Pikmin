
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, Plus, BellRing, Volume2, VolumeX, Edit2 } from 'lucide-react';
import { playSound } from '../utils/audio';

interface MushroomTimerProps {
  id: number;
}

const MushroomTimer: React.FC<MushroomTimerProps> = ({ id }) => {
  const [teamName, setTeamName] = useState(`蘑菇隊伍 ${id}`);
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('0');
  const [seconds, setSeconds] = useState<string>('0');
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Fix for NodeJS namespace error: Use ReturnType<typeof setInterval>
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSetTime = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const total = h * 3600 + m * 60 + s;
    if (total > 0) {
      setTimeLeft(total);
    }
  };

  const addFiveMinutes = () => {
    const newTime = timeLeft + 300;
    setTimeLeft(newTime);
    // Sync inputs back just in case they are looking at them
    setHours(Math.floor(newTime / 3600).toString());
    setMinutes(Math.floor((newTime % 3600) / 60).toString());
    setSeconds((newTime % 60).toString());
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
    setHours('0');
    setMinutes('0');
    setSeconds('0');
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
    if (timeLeft === 0 && !isRunning) return 'bg-white border-transparent';
    if (timeLeft <= 10 && timeLeft > 0) return 'bg-red-50 border-red-300 animate-pulse ring-4 ring-red-200';
    if (timeLeft <= 20 && timeLeft > 0) return 'bg-orange-50 border-orange-300 ring-4 ring-orange-100';
    return 'bg-white border-transparent shadow-xl shadow-green-900/5';
  };

  return (
    <div className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 ${getCardStyle()} ${isRunning ? 'scale-[1.02]' : 'scale-100'}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 flex-1 mr-2">
          <div className="w-10 h-10 shrink-0 bg-[#76d02a] rounded-2xl flex items-center justify-center text-white font-black shadow-[0_4px_0_0_#417417]">
            {id}
          </div>
          <div className="relative flex-1 group">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-transparent border-b-2 border-transparent hover:border-[#76d02a]/30 focus:border-[#76d02a] focus:outline-none text-xl font-black text-[#417417] py-0.5 px-1 transition-all"
              placeholder="輸入隊伍名稱..."
            />
            <Edit2 size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#76d02a] opacity-0 group-hover:opacity-50 pointer-events-none" />
          </div>
        </div>
        
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className={`p-2 rounded-full transition-all ${isMuted ? 'text-gray-400 bg-gray-100' : 'text-[#76d02a] bg-green-50 active:scale-90'}`}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {!isRunning && timeLeft === 0 ? (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: '時', value: hours, setter: setHours },
            { label: '分', value: minutes, setter: setMinutes },
            { label: '秒', value: seconds, setter: setSeconds }
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-[1.5rem] border border-gray-100">
              <label className="block text-center text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">{item.label}</label>
              <input 
                type="number" 
                value={item.value} 
                onChange={(e) => item.setter(e.target.value)}
                className="w-full bg-transparent text-xl font-black text-center text-gray-700 outline-none"
                placeholder="0"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <span className={`text-5xl md:text-6xl font-mono font-black tracking-tight ${timeLeft <= 20 ? 'text-red-500' : 'text-[#2e5210]'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {!isRunning && timeLeft === 0 ? (
          <button 
            onClick={handleSetTime}
            className="w-full bg-[#76d02a] hover:bg-[#86e03a] text-white py-4 rounded-full font-black text-lg btn-3d shadow-[0_6px_0_0_#417417]"
          >
            設定時間
          </button>
        ) : (
          <div className="grid grid-cols-12 gap-3">
            <button 
              onClick={toggleTimer}
              className={`col-span-6 py-4 rounded-full font-black text-sm text-white flex items-center justify-center gap-2 btn-3d ${isRunning ? 'bg-amber-500 hover:bg-amber-400 shadow-[0_6px_0_0_#b45309]' : 'bg-[#76d02a] hover:bg-[#86e03a] shadow-[0_6px_0_0_#417417]'}`}
            >
              {isRunning ? <Square size={18} fill="white" /> : <Play size={18} fill="white" />}
              {isRunning ? '暫停' : '繼續'}
            </button>
            <button 
              onClick={addFiveMinutes}
              className="col-span-4 bg-[#3da9fc] hover:bg-[#5dbbff] text-white py-4 rounded-full font-black text-sm shadow-[0_6px_0_0_#1b75b8] btn-3d flex items-center justify-center gap-1"
            >
              <Plus size={18} strokeWidth={3} /> 5m
            </button>
            <button 
              onClick={resetTimer}
              className="col-span-2 bg-gray-200 hover:bg-gray-300 text-gray-500 py-4 rounded-full font-black shadow-[0_6px_0_0_#9ca3af] btn-3d flex items-center justify-center"
            >
              <RotateCcw size={18} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
      
      {timeLeft <= 20 && timeLeft > 0 && (
        <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 text-xs font-black text-red-600 border border-red-200 animate-bounce shadow-sm">
              <BellRing size={14} /> 準備出發！
            </span>
        </div>
      )}
    </div>
  );
};

export default MushroomTimer;
