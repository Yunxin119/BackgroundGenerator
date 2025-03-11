import React from 'react';

const ColorPicker = ({ color, label, onChange, onRemove, canRemove }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/10 hover:bg-white/30 transition-all">
      <label className="font-medium text-sm text-stone-500 w-20">{label}</label>
      <div className="relative flex-shrink-0">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 rounded-lg cursor-pointer opacity-0 absolute inset-0 z-10"
        />
        <div 
          className="h-10 w-10 rounded-lg border border-white/20" 
          style={{ backgroundColor: color }}
        />
      </div>
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-gray-600 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
      />
      {canRemove && (
        <button
          onClick={onRemove}
          className="p-2.5 bg-white/10 rounded-xl hover:bg-red-500/30 text-gray-600/70 hover:text-gray-600 transition-all"
          title="移除颜色"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ColorPicker;