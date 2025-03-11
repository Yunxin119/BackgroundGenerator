import React from 'react';

const ExportPanel = ({ canvasSize, filename, onSizeChange, onFilenameChange, onDownload }) => {
  return (
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15 transition-all">
      <h2 className="text-xl font-medium mb-6 text-gray-600/90 flex items-center">
        <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-pink-400 to-red-500 rounded-full mr-3"></span>
        导出设置
      </h2>
      
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-gray-600/80 text-sm font-medium">宽度</label>
            <div className="relative">
              <input
                type="number"
                value={canvasSize.width}
                onChange={(e) => onSizeChange({...canvasSize, width: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600/50 text-sm">px</span>
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-gray-600/80 text-sm font-medium">高度</label>
            <div className="relative">
              <input
                type="number"
                value={canvasSize.height}
                onChange={(e) => onSizeChange({...canvasSize, height: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600/50 text-sm">px</span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block mb-2 text-gray-600/80 text-sm font-medium">文件名</label>
          <input
            type="text"
            value={filename}
            onChange={(e) => onFilenameChange(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/10"
          />
        </div>
        
        <button
          onClick={onDownload}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium tracking-wide hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-700/30 mt-3 relative overflow-hidden group"
        >
          <span className="relative z-10">生成并下载</span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-300 bg-[radial-gradient(circle,_white_20%,_transparent_70%)]"></div>
        </button>
      </div>
    </div>
  );
};

export default ExportPanel;