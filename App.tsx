
import React from 'react';
import { Timer, Flower } from 'lucide-react';
import MushroomTimer from './components/MushroomTimer';

export default function App() {
  const timers = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-[#f1f9e8] font-sans pb-24 selection:bg-[#76d02a] selection:text-white">
      {/* Decorative Background Gradient */}
      <div className="fixed top-0 left-0 w-full h-80 bg-gradient-to-b from-[#d9f2c1] to-transparent pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-4 pt-16">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <div className="inline-flex p-4 bg-white rounded-[2rem] shadow-2xl shadow-green-900/10 mb-6 transform -rotate-3 border-2 border-[#76d02a]/10">
            <Timer size={48} strokeWidth={2.5} className="text-[#76d02a]" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#2e5210] tracking-tight mb-2 drop-shadow-sm">
            Pikmin Bloom
          </h1>
          <p className="text-[#76d02a] font-extrabold text-sm uppercase tracking-[0.2em]">
            蘑菇戰鬥倒數助手
          </p>
        </header>

        {/* Information/Instruction Card */}
        <div className="bg-white/90 backdrop-blur-md border-2 border-[#76d02a]/20 p-6 rounded-[2.5rem] mb-10 flex gap-5 items-center shadow-xl shadow-green-900/5">
          <div className="p-3 bg-[#76d02a]/10 rounded-2xl flex-shrink-0">
            <Flower className="text-[#76d02a]" size={28} />
          </div>
          <div className="text-[#417417]">
            <p className="font-black text-lg mb-1 tracking-wide">戰鬥提醒說明</p>
            <p className="text-sm font-semibold opacity-80 leading-relaxed">
              • 點擊名稱即可修改 • 20秒 中音提示 • 10秒 雙高音提示 • 按下 +5m 快速增加時間
            </p>
          </div>
        </div>

        {/* Timers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {timers.map(num => (
            <MushroomTimer key={num} id={num} />
          ))}
        </div>

        {/* Footer Branding */}
        <footer className="mt-24 text-center">
          <div className="flex justify-center gap-4 mb-6 opacity-30">
             <Flower size={20} className="text-[#76d02a]" />
             <Flower size={20} className="text-[#76d02a]" />
             <Flower size={20} className="text-[#76d02a]" />
          </div>
          <div className="space-y-1">
            <p className="text-[#76d02a]/70 text-[11px] font-black tracking-[0.25em] uppercase">
              Designed for Pikmin Bloom Explorers
            </p>
            <p className="text-[#417417]/40 text-[10px] font-bold">
              v1.2 • 3D 質感 & Web Audio API
            </p>
          </div>
        </footer>
      </div>

      {/* Persistent Call-to-Action / Status Bar (optional visual element) */}
      <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full border border-[#76d02a]/20 shadow-lg text-[10px] font-black text-[#76d02a] tracking-widest uppercase">
          Happy Exploring!
        </div>
      </div>
    </div>
  );
}
