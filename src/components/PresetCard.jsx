import React from 'react';

const PresetCard = ({ preset, onClick, isActive }) => {
  return (
    <div
      className={`relative cursor-pointer rounded-xl overflow-hidden h-24 backdrop-blur-md transition-all transform hover:scale-105 ${
        isActive 
          ? 'ring-2 ring-offset-4 ring-offset-transparent ring-white shadow-lg shadow-white/20' 
          : 'border border-white/10 shadow-sm hover:shadow-md'
      }`}
      onClick={() => onClick(preset)}
    >
      <div 
        className="absolute inset-0" 
        style={{ background: preset.preview }}
      ></div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
      
      {/* Acid effect border */}
      <div className={`absolute inset-0 ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 pointer-events-none`}>
        <div className="absolute inset-0 border-2 border-white/70 rounded-xl animate-pulse"></div>
      </div>
      
      {/* Modern neon glow */}
      <div className={`absolute inset-0 ${isActive ? 'opacity-60' : 'opacity-0'} transition-opacity duration-300 pointer-events-none mix-blend-overlay`}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/50 via-purple-500/50 to-pink-500/50 blur-sm"></div>
      </div>
      
      {/* Title badge */}
      <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-center bg-black/30 backdrop-blur-md border-t border-white/10">
        <span className="text-white text-xs font-medium tracking-wider uppercase">{preset.name}</span>
      </div>
    </div>
  );
};

export default PresetCard;