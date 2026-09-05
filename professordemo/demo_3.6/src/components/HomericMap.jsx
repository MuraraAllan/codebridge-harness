import React from 'react';
import { Anchor, Shield, Navigation } from 'lucide-react';

export default function HomericMap({ contingents, selectedContingent, onSelectContingent }) {
  return (
    <div className="relative w-full h-[480px] bg-[#1e293b] rounded-xl overflow-hidden border border-amber-900/40 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0284c7]/20 opacity-90" />
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 stroke-amber-500/30" strokeWidth="0.5">
        <line x1="0" y1="25%" x2="100%" y2="25%" strokeDasharray="4 4" />
        <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="4 4" />
        <line x1="0" y1="75%" x2="100%" y2="75%" strokeDasharray="4 4" />
        <line x1="33%" y1="0" x2="33%" y2="100%" strokeDasharray="4 4" />
        <line x1="66%" y1="0" x2="66%" y2="100%" strokeDasharray="4 4" />
      </svg>

      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-amber-500/30 p-3 rounded-lg text-amber-100 backdrop-blur-md">
        <h3 className="font-serif font-bold text-amber-400 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-amber-400" /> Map of Homeric Greece (Iliad Book II)
        </h3>
        <p className="text-xs text-slate-300">Select any contingent marker to inspect fleet size & 3D vessel</p>
      </div>

      {contingents.map((item) => {
        const isSelected = selectedContingent?.id === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectContingent(item)}
            style={{ left: `${item.coordinates.mapX}%`, top: `${item.coordinates.mapY}%` }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 focus:outline-none"
          >
            <div className="relative flex items-center justify-center">
              {isSelected && (
                <span className="absolute w-8 h-8 rounded-full bg-amber-400 opacity-75 animate-ping" />
              )}
              
              <div 
                style={{ backgroundColor: item.color }}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg border-2 ${
                  isSelected ? 'border-amber-300 scale-125 ring-4 ring-amber-400/30' : 'border-slate-900 hover:scale-110'
                }`}
              >
                <Anchor className="w-3.5 h-3.5" />
              </div>

              <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                <div className="bg-slate-900/95 border border-amber-500/40 text-amber-200 text-xs py-1 px-2.5 rounded shadow-xl whitespace-nowrap font-serif">
                  <span className="font-bold text-amber-400">{item.name}</span> ({item.ships} ships)
                </div>
              </div>
            </div>
          </button>
        );
      })}

      <div className="absolute top-[30%] right-[18%] flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-red-900/80 border-2 border-red-500 flex items-center justify-center text-red-200 animate-pulse">
          <Shield className="w-4 h-4" />
        </div>
        <span className="text-xs font-serif font-bold text-red-400 bg-slate-900/80 px-2 py-0.5 rounded mt-1 border border-red-800">
          TROY (Ilium)
        </span>
      </div>
    </div>
  );
}
