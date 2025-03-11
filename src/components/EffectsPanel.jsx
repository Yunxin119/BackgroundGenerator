import React from 'react';

const EffectsPanel = ({ blurLevel, opacityLevel, onBlurChange, onOpacityChange }) => {
  return (
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15 transition-all">
      <h2 className="text-xl font-medium mb-6 text-gray-600/90 flex items-center">
        <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-3"></span>
        效果设置
      </h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-gray-600/80 text-sm font-medium">模糊度</label>
            <span className="text-gray-600/90 bg-white/10 px-2 py-0.5 rounded-md text-sm font-mono">{blurLevel}%</span>
          </div>
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
              style={{ width: `${blurLevel}%` }}
            ></div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={blurLevel}
            onChange={(e) => onBlurChange(parseInt(e.target.value))}
            className="w-full h-2 absolute opacity-0 cursor-pointer -mt-2"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-gray-600/80 text-sm font-medium">透明度</label>
            <span className="text-gray-600/90 bg-white/10 px-2 py-0.5 rounded-md text-sm font-mono">{opacityLevel}%</span>
          </div>
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full" 
              style={{ width: `${opacityLevel}%` }}
            ></div>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={opacityLevel}
            onChange={(e) => onOpacityChange(parseInt(e.target.value))}
            className="w-full h-2 absolute opacity-0 cursor-pointer -mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default EffectsPanel;