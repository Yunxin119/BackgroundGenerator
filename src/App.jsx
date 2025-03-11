import React, { useState, useEffect, useRef } from 'react';
import ColorPicker from './components/ColorPicker';
import EffectsPanel from './components/EffectsPanel';
import ExportPanel from './components/ExportPanel';
import PresetCard from './components/PresetCard';

// 主应用组件
const App = () => {
  // 预设模板
  const presets = [
    {
      id: 'random',
      name: '随机弥散',
      type: 'random',
      colors: ['#ff7e5f', '#feb47b', '#7ee8fa', '#80ff72'],
      preview: 'radial-gradient(ellipse at 30% 30%, #ff7e5f 0%, transparent 70%), radial-gradient(ellipse at 70% 20%, #feb47b 0%, transparent 70%), radial-gradient(ellipse at 20% 70%, #7ee8fa 0%, transparent 70%), radial-gradient(ellipse at 80% 80%, #80ff72 0%, transparent 70%)'
    },
    {
      id: 'radial',
      name: '圆形弥散',
      type: 'radial',
      colors: ['#9796f0', '#fbc7d4'],
      preview: 'radial-gradient(circle at center, #9796f0 0%, #fbc7d4 100%)'
    },
    {
      id: 'linear-down',
      name: '向下渐变',
      type: 'linear',
      direction: 'to bottom',
      colors: ['#00c6ff', '#0072ff'],
      preview: 'linear-gradient(to bottom, #00c6ff 0%, #0072ff 100%)'
    },
    {
      id: 'linear-right',
      name: '向右渐变',
      type: 'linear',
      direction: 'to right',
      colors: ['#f953c6', '#b91d73'],
      preview: 'linear-gradient(to right, #f953c6 0%, #b91d73 100%)'
    },
    {
      id: 'diagonal',
      name: '对角渐变',
      type: 'linear',
      direction: 'to bottom right',
      colors: ['#8a2387', '#e94057', '#f27121'],
      preview: 'linear-gradient(to bottom right, #8a2387 0%, #e94057 50%, #f27121 100%)'
    },
    {
      id: 'mesh',
      name: '网格弥散',
      type: 'mesh',
      colors: ['#fc466b', '#3f5efb'],
      preview: 'conic-gradient(from 45deg, #fc466b, #3f5efb, #fc466b)'
    },
    // 新增预设
    {
      id: 'neon-glow',
      name: '霓虹发光',
      type: 'neon',
      colors: ['#ff00ff', '#00ffff'],
      preview: 'radial-gradient(circle at center, rgba(255,0,255,0.8) 0%, rgba(0,255,255,0.4) 50%, transparent 70%)'
    },
    {
      id: 'aurora',
      name: '极光',
      type: 'aurora',
      colors: ['#00ff99', '#00ccff', '#9900ff'],
      preview: 'linear-gradient(180deg, transparent 0%, rgba(0,255,153,0.5) 20%, rgba(0,204,255,0.5) 40%, rgba(153,0,255,0.5) 60%, transparent 100%)'
    }
  ];

  // 状态钩子
  const [activePreset, setActivePreset] = useState(presets[0]);
  const [colors, setColors] = useState(activePreset.colors);
  const [blurLevel, setBlurLevel] = useState(80);
  const [opacityLevel, setOpacityLevel] = useState(70);
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });
  const [filename, setFilename] = useState('diffuse-background');
  const [customType, setCustomType] = useState(activePreset.type);
  const [customDirection, setCustomDirection] = useState(activePreset.direction || 'to bottom');
  const [animationEnabled, setAnimationEnabled] = useState(false);
  
  const canvasRef = useRef(null);
  const [previewStyle, setPreviewStyle] = useState({});
  
  // 当预设变更时更新颜色和类型
  useEffect(() => {
    setColors([...activePreset.colors]);
    setCustomType(activePreset.type);
    if (activePreset.direction) {
      setCustomDirection(activePreset.direction);
    }
  }, [activePreset]);

  // 更新预览样式
  useEffect(() => {
    updatePreview();
  }, [colors, blurLevel, opacityLevel, customType, customDirection, animationEnabled]);
  
  // 根据不同类型生成预览的CSS
  const generateBackgroundCSS = () => {
    const opacity = Math.round(opacityLevel * 2.55).toString(16).padStart(2, '0');
    
    switch(customType) {
      case 'random':
        // 随机弥散效果
        return colors.map((color, index) => {
          const x = 20 + (index % 2) * 60;
          const y = 20 + Math.floor(index / 2) * 60;
          return `radial-gradient(ellipse at ${x}% ${y}%, ${color}${opacity} 0%, transparent 70%)`;
        }).join(', ');
        
      case 'radial':
        // 圆形弥散效果
        if (colors.length === 1) {
          return `radial-gradient(circle at center, ${colors[0]}${opacity} 0%, transparent 100%)`;
        } else {
          return `radial-gradient(circle at center, ${colors.map((color, index) => 
            `${color}${opacity} ${index * (100 / (colors.length - 1))}%`
          ).join(', ')})`;
        }
        
      case 'linear':
        // 线性渐变效果
        return `linear-gradient(${customDirection}, ${colors.map((color, index) => 
          `${color}${opacity} ${index * (100 / (colors.length - 1))}%`
        ).join(', ')})`;
      
      case 'neon':
        // 霓虹发光效果
        if (colors.length === 1) {
          const brighterColor = adjustColorBrightness(colors[0], 30);
          return `
            radial-gradient(circle at center, ${colors[0]}${opacity} 0%, ${brighterColor}${Math.round(parseInt(opacity, 16) * 0.5).toString(16).padStart(2, '0')} 50%, transparent 70%),
            radial-gradient(circle at 30% 30%, ${colors[0]}${Math.round(parseInt(opacity, 16) * 0.3).toString(16).padStart(2, '0')} 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, ${brighterColor}${Math.round(parseInt(opacity, 16) * 0.3).toString(16).padStart(2, '0')} 0%, transparent 50%)
          `;
        } else {
          return `
            radial-gradient(circle at center, ${colors[0]}${opacity} 0%, ${colors[1]}${Math.round(parseInt(opacity, 16) * 0.5).toString(16).padStart(2, '0')} 50%, transparent 70%),
            radial-gradient(circle at 30% 30%, ${colors[0]}${Math.round(parseInt(opacity, 16) * 0.3).toString(16).padStart(2, '0')} 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, ${colors[1]}${Math.round(parseInt(opacity, 16) * 0.3).toString(16).padStart(2, '0')} 0%, transparent 50%)
          `;
        }
        
      case 'aurora':
        // 极光效果
        const colorStops = colors.map((color, index) => 
          `${color}${opacity} ${20 + index * (60 / (colors.length - 1 || 1))}%`
        ).join(', ');
        
        const animation = animationEnabled ? 'animation: aurora 15s ease infinite' : '';
        
        return {
          background: `linear-gradient(180deg, transparent 0%, ${colorStops}, transparent 100%)`,
          backgroundSize: '400% 400%',
          style: animation
        };
        
      case 'mesh':
        // 网格弥散效果
        if (colors.length === 1) {
          return `conic-gradient(from 45deg, ${colors[0]}${opacity}, ${adjustColorBrightness(colors[0], 30)}${opacity}, ${colors[0]}${opacity})`;
        } else if (colors.length === 2) {
          return `conic-gradient(from 45deg, ${colors[0]}${opacity}, ${colors[1]}${opacity}, ${colors[0]}${opacity})`;
        } else {
          return `conic-gradient(from 45deg, ${colors.map((color, index) => 
            `${color}${opacity} ${index * (360 / colors.length)}deg`
          ).join(', ')}, ${colors[0]}${opacity} 360deg)`;
        }
        
      default:
        return colors.map((color, index) => {
          const x = 20 + (index % 2) * 60;
          const y = 20 + Math.floor(index / 2) * 60;
          return `radial-gradient(ellipse at ${x}% ${y}%, ${color}${opacity} 0%, transparent 70%)`;
        }).join(', ');
    }
  };
  
  // 辅助函数: 调整颜色亮度
  const adjustColorBrightness = (color, percent) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const adjustValue = (value) => {
      const newValue = value + (value * (percent / 100));
      return Math.min(255, Math.max(0, Math.round(newValue)));
    };
    
    return `#${adjustValue(r).toString(16).padStart(2, '0')}${adjustValue(g).toString(16).padStart(2, '0')}${adjustValue(b).toString(16).padStart(2, '0')}`;
  };
  
  // 更新预览
  const updatePreview = () => {
    const bgCss = generateBackgroundCSS();
    
    if (typeof bgCss === 'object') {
      setPreviewStyle({
        background: bgCss.background,
        backgroundSize: bgCss.backgroundSize || '100% 100%',
        filter: `blur(${blurLevel / 10}px)`,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        ...(bgCss.style ? { animation: 'aurora 15s ease infinite' } : {})
      });
    } else {
      setPreviewStyle({
        background: bgCss,
        filter: `blur(${blurLevel / 10}px)`,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      });
    }
  };
  
  // 生成背景
  const generateBackground = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    // 清除canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 创建离屏canvas来渲染背景
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offCtx = offscreenCanvas.getContext('2d');
    
    // 根据类型绘制背景
    switch(customType) {
      case 'random':
        // 随机弥散效果
        colors.forEach((color, index) => {
          const x = canvas.width * (0.2 + (index % 2) * 0.6);
          const y = canvas.height * (0.2 + Math.floor(index / 2) * 0.6);
          const width = canvas.width * 0.6;
          const height = canvas.height * 0.6;
          drawBlob(offCtx, color, x, y, width, height, opacityLevel / 100);
        });
        break;
        
      case 'radial':
        // 圆形弥散效果
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.max(canvas.width, canvas.height);
        
        const gradient = offCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        colors.forEach((color, index) => {
          gradient.addColorStop(index / (colors.length - 1 || 1), color);
        });
        
        offCtx.globalAlpha = opacityLevel / 100;
        offCtx.fillStyle = gradient;
        offCtx.fillRect(0, 0, canvas.width, canvas.height);
        break;
        
      case 'linear':
        // 线性渐变效果
        let x0, y0, x1, y1;
        
        switch(customDirection) {
          case 'to right':
            x0 = 0; y0 = 0; x1 = canvas.width; y1 = 0;
            break;
          case 'to left':
            x0 = canvas.width; y0 = 0; x1 = 0; y1 = 0;
            break;
          case 'to bottom':
            x0 = 0; y0 = 0; x1 = 0; y1 = canvas.height;
            break;
          case 'to top':
            x0 = 0; y0 = canvas.height; x1 = 0; y1 = 0;
            break;
          case 'to bottom right':
            x0 = 0; y0 = 0; x1 = canvas.width; y1 = canvas.height;
            break;
          case 'to bottom left':
            x0 = canvas.width; y0 = 0; x1 = 0; y1 = canvas.height;
            break;
          case 'to top right':
            x0 = 0; y0 = canvas.height; x1 = canvas.width; y1 = 0;
            break;
          case 'to top left':
            x0 = canvas.width; y0 = canvas.height; x1 = 0; y1 = 0;
            break;
          default:
            x0 = 0; y0 = 0; x1 = 0; y1 = canvas.height;
        }
        
        const linearGradient = offCtx.createLinearGradient(x0, y0, x1, y1);
        colors.forEach((color, index) => {
          linearGradient.addColorStop(index / (colors.length - 1 || 1), color);
        });
        
        offCtx.globalAlpha = opacityLevel / 100;
        offCtx.fillStyle = linearGradient;
        offCtx.fillRect(0, 0, canvas.width, canvas.height);
        break;
      
      case 'neon':
        // 霓虹发光效果
        const neonCenterX = canvas.width / 2;
        const neonCenterY = canvas.height / 2;
        const neonRadius = Math.max(canvas.width, canvas.height) / 2;
        
        // 主发光区域
        const neonGradient = offCtx.createRadialGradient(
          neonCenterX, neonCenterY, 0,
          neonCenterX, neonCenterY, neonRadius
        );
        
        if (colors.length === 1) {
          const brighterColor = adjustColorBrightness(colors[0], 30);
          neonGradient.addColorStop(0, colors[0]);
          neonGradient.addColorStop(0.5, brighterColor);
          neonGradient.addColorStop(1, 'transparent');
        } else {
          neonGradient.addColorStop(0, colors[0]);
          neonGradient.addColorStop(0.5, colors[1]);
          neonGradient.addColorStop(1, 'transparent');
        }
        
        offCtx.globalAlpha = opacityLevel / 100;
        offCtx.fillStyle = neonGradient;
        offCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 添加额外的辉光
        const addGlow = (x, y, color, size) => {
          const glowGradient = offCtx.createRadialGradient(
            x, y, 0, x, y, size
          );
          glowGradient.addColorStop(0, color);
          glowGradient.addColorStop(1, 'transparent');
          
          offCtx.globalAlpha = opacityLevel / 200;
          offCtx.fillStyle = glowGradient;
          offCtx.fillRect(0, 0, canvas.width, canvas.height);
        };
        
        if (colors.length === 1) {
          addGlow(canvas.width * 0.3, canvas.height * 0.3, colors[0], neonRadius * 0.7);
          addGlow(canvas.width * 0.7, canvas.height * 0.7, adjustColorBrightness(colors[0], 30), neonRadius * 0.7);
        } else {
          addGlow(canvas.width * 0.3, canvas.height * 0.3, colors[0], neonRadius * 0.7);
          addGlow(canvas.width * 0.7, canvas.height * 0.7, colors[1], neonRadius * 0.7);
        }
        break;
        
      case 'aurora':
        // 极光效果
        const height = canvas.height;
        const width = canvas.width;
        
        // 创建渐变
        const auroraGradient = offCtx.createLinearGradient(0, 0, 0, height);
        auroraGradient.addColorStop(0, 'transparent');
        colors.forEach((color, index) => {
          auroraGradient.addColorStop(0.2 + index * (0.6 / (colors.length - 1 || 1)), color);
        });
        auroraGradient.addColorStop(1, 'transparent');
        
        offCtx.globalAlpha = opacityLevel / 100;
        offCtx.fillStyle = auroraGradient;
        
        // 绘制波浪形状
        offCtx.beginPath();
        offCtx.moveTo(0, 0);
        
        const auroraWaves = 3;
        const auroraAmplitude = height * 0.1;
        
        for (let x = 0; x <= width; x += 10) {
          const y = height / 2 + Math.sin(x / width * Math.PI * auroraWaves) * auroraAmplitude;
          offCtx.lineTo(x, y);
        }
        
        offCtx.lineTo(width, 0);
        offCtx.closePath();
        offCtx.fill();
        
        // 添加更多波浪层
        for (let i = 1; i <= 3; i++) {
          offCtx.globalAlpha = opacityLevel / 200;
          offCtx.beginPath();
          offCtx.moveTo(0, height);
          
          for (let x = 0; x <= width; x += 10) {
            const y = height / 2 + Math.sin((x / width * Math.PI * auroraWaves) + i) * auroraAmplitude;
            offCtx.lineTo(x, y);
          }
          
          offCtx.lineTo(width, height);
          offCtx.closePath();
          offCtx.fill();
        }
        break;
        
      case 'mesh':
        // 网格弥散效果 (使用多次渐变模拟)
        const meshColors = [...colors];
        if (meshColors.length === 1) {
          meshColors.push(adjustColorBrightness(meshColors[0], 30));
        }
        
        // 水平渐变
        const hGradient = offCtx.createLinearGradient(0, 0, canvas.width, 0);
        meshColors.forEach((color, index) => {
          hGradient.addColorStop(index / (meshColors.length - 1), color);
        });
        
        offCtx.globalAlpha = opacityLevel / 200;
        offCtx.fillStyle = hGradient;
        offCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 垂直渐变
        const vGradient = offCtx.createLinearGradient(0, 0, 0, canvas.height);
        [...meshColors].reverse().forEach((color, index) => {
          vGradient.addColorStop(index / (meshColors.length - 1), color);
        });
        
        offCtx.globalAlpha = opacityLevel / 200;
        offCtx.fillStyle = vGradient;
        offCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 对角渐变
        const dGradient = offCtx.createLinearGradient(0, 0, canvas.width, canvas.height);
        meshColors.forEach((color, index) => {
          dGradient.addColorStop(index / (meshColors.length - 1), color);
        });
        
        offCtx.globalAlpha = opacityLevel / 200;
        offCtx.fillStyle = dGradient;
        offCtx.fillRect(0, 0, canvas.width, canvas.height);
        break;
    }
    
    // 将离屏canvas内容复制到主canvas
    ctx.drawImage(offscreenCanvas, 0, 0);
    
    // 应用模糊效果
    if (blurLevel > 0) {
      // 由于原生的canvas blur在某些浏览器支持有限
      // 我们通过多次绘制重叠的半透明图层来模拟模糊效果
      const iterations = Math.min(Math.floor(blurLevel / 20), 5);
      for (let i = 0; i < iterations; i++) {
        ctx.filter = `blur(${blurLevel / 5}px)`;
        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = 0.3;
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }
  };
  
  // 绘制单个blob
  const drawBlob = (ctx, color, x, y, width, height, opacity) => {
    const gradient = ctx.createRadialGradient(x, y, 10, x, y, Math.max(width, height) / 2);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, `${color}00`); // 透明
    
    ctx.globalAlpha = opacity;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };
  
  // 处理颜色变更
  const handleColorChange = (index, value) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };
  
  // 添加颜色
  const addColor = () => {
    // 添加一个新颜色，默认为最后一个颜色的调整版本
    const lastColor = colors[colors.length - 1] || '#ffffff';
    setColors([...colors, adjustColorBrightness(lastColor, -20)]);
  };
  
  // 移除颜色
  const removeColor = (index) => {
    if (colors.length > 1) {
      const newColors = [...colors];
      newColors.splice(index, 1);
      setColors(newColors);
    }
  };
  
  // 下载处理
  const handleDownload = () => {
    generateBackground();
    const canvas = canvasRef.current;
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  
  return (
  <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#ff7e5f]/50 via-[#feb47b]/30 to-[#cae5c7]/60 relative overflow-hidden">
      {/* 随机弥散的酸性颜色背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-300/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#feb47b]/40 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-[#ff7e5f]/30 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-2/3 right-1/3 w-60 h-60 bg-[#ff7e5f]/20 rounded-full filter blur-3xl animate-blob animation-delay-3000"></div>
        <div className="absolute top-1/4 left-1/2 w-48 h-48  bg-[#7ee8fa]/50 rounded-full filter blur-3xl animate-blob animation-delay-5000"></div>
        
        {/* 网格线 */}
        <div className="absolute inset-0 bg-grid-lines opacity-5"></div>
      </div>
        {/* Animated background shapes for modern feel */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-500/20 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 -right-10 w-60 h-60 bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-10 left-1/3 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-cyan-500/30 rounded-full filter blur-3xl animate-pulse"></div>
          
          {/* Grid lines for cyber aesthetic */}
          <div className="absolute inset-0 bg-grid-lines opacity-5"></div>
        </div>
        
        <header className="relative z-10 py-6 backdrop-blur-lg bg-white/5 border-b border-white/10">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold text-transparent text-stone-500 text-center mb-2">配色弥散背景生成器</h1>
            <p className="text-stone-600/60 text-center max-w-2xl mx-auto">选择预设类型，调整颜色和效果，生成并下载未来感十足的弥散背景</p>
          </div>
        </header>
        
        <main className="flex flex-col p-6 gap-6 flex-1 relative z-10 container mx-auto">
          {/* 预设选择区域 */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-xl font-medium mb-6 text-gray-600/90 flex items-center">
              <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full mr-3"></span>
              选择弥散类型
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {presets.map(preset => (
                <PresetCard 
                  key={preset.id}
                  preset={preset}
                  onClick={setActivePreset}
                  isActive={activePreset.id === preset.id}
                />
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-6 w-full md:w-1/3">
              {/* 颜色选择面板 */}
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-gray-600/90 flex items-center">
                    <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-green-400 to-teal-500 rounded-full mr-3"></span>
                    颜色选择
                  </h2>
                  <button 
                    onClick={addColor}
                    className="px-4 py-2 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl text-gray-600 text-sm font-medium shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all flex items-center gap-2"
                    title="添加颜色"
                  >
                    <span className="text-lg">+</span> 添加颜色
                  </button>
                </div>
                
                <div className="space-y-4">
                  {colors.map((color, index) => (
                    <ColorPicker
                      key={index}
                      color={color}
                      label={`颜色 ${index + 1}`}
                      onChange={(value) => handleColorChange(index, value)}
                      onRemove={() => removeColor(index)}
                      canRemove={colors.length > 1}
                    />
                  ))}
                </div>
              </div>
              
              {/* 弥散类型自定义 */}
              {customType === 'linear' && (
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                  <h2 className="text-xl font-medium mb-6 text-gray-600/90 flex items-center">
                    <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mr-3"></span>
                    渐变方向
                  </h2>
                  <select
                    value={customDirection}
                    onChange={(e) => setCustomDirection(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 backdrop-blur-sm appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' opacity='0.5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '3rem'
                    }}
                  >
                    <option value="to right">向右</option>
                    <option value="to left">向左</option>
                    <option value="to bottom">向下</option>
                    <option value="to top">向上</option>
                    <option value="to bottom right">右下对角</option>
                    <option value="to bottom left">左下对角</option>
                    <option value="to top right">右上对角</option>
                    <option value="to top left">左上对角</option>
                  </select>
                </div>
              )}
              
              {/* 特殊效果选项 */}
              {(customType === 'aurora' || customType === 'neon') && (
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                  <h2 className="text-xl font-medium mb-6 text-gray-600/90 flex items-center">
                    <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-indigo-400 to-violet-500 rounded-full mr-3"></span>
                    特殊效果
                  </h2>
                  
                  <div className="flex items-center space-x-3">
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={animationEnabled}
                        onChange={() => setAnimationEnabled(!animationEnabled)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/80 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-400 peer-checked:to-purple-500"></div>
                      <span className="ms-3 text-sm font-medium text-gray-600/80">启用动画效果</span>
                    </label>
                  </div>
                  
                  {customType === 'neon' && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-gray-600/70 text-sm mb-2">霓虹效果的最佳效果需要较高的模糊度和透明度</p>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => {setBlurLevel(85); setOpacityLevel(70);}}
                          className="px-3 py-1.5 bg-white/10 rounded-lg text-gray-600/80 text-xs hover:bg-white/20 transition-colors"
                        >
                          应用推荐设置
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* 效果设置 */}
              <EffectsPanel 
                blurLevel={blurLevel}
                opacityLevel={opacityLevel}
                onBlurChange={setBlurLevel}
                onOpacityChange={setOpacityLevel}
              />
              
              {/* 导出设置 */}
              <ExportPanel 
                canvasSize={canvasSize}
                filename={filename}
                onSizeChange={setCanvasSize}
                onFilenameChange={setFilename}
                onDownload={handleDownload}
              />
              
              {/* 创意提示 */}
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                <h2 className="text-xl font-medium mb-4 text-gray-600/90 flex items-center">
                  <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-purple-400 to-fuchsia-500 rounded-full mr-3"></span>
                  创意提示
                </h2>
                <div className="text-gray-600/70 text-sm space-y-2">
                  <p>• 对于霓虹效果，尝试使用对比强烈的颜色</p>
                  <p>• 极光效果搭配深蓝和青绿效果最佳</p>
                  <p>• 网格弥散使用3种以上颜色可以创造复杂纹理</p>
                  <p>• 对角渐变适合用作演示文稿背景</p>
                  <p>• 提高模糊度可以创造更柔和的过渡效果</p>
                </div>
              </div>
            </div>
            
            {/* 预览区域 */}
            <div className="flex-1 rounded-2xl overflow-hidden relative bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
              {/* 棋盘格背景模拟透明效果 */}
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              
              {/* 实际预览 */}
              <div style={previewStyle}></div>
              
              {/* 预览标签 */}
              <div className="absolute bottom-4 right-4 text-sm text-gray-600 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                预览
              </div>
              
              {/* 尺寸指示器 */}
              <div className="absolute top-4 left-4 text-xs text-gray-600/70 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 font-mono">
                {canvasSize.width} × {canvasSize.height}
              </div>
              
              {/* 类型标签 */}
              <div className="absolute top-4 right-4 text-xs bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                  {customType === 'random' && '随机弥散'}
                  {customType === 'radial' && '圆形弥散'}
                  {customType === 'linear' && '线性渐变'}
                  {customType === 'mesh' && '网格弥散'}
                  {customType === 'neon' && '霓虹发光'}
                  {customType === 'aurora' && '极光效果'}
                </span>
              </div>
              
              {/* 当前颜色指示器 */}
              <div className="absolute bottom-16 right-4 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10">
                {colors.map((color, index) => (
                  <div 
                    key={index} 
                    className="h-4 w-4 rounded-full border border-white/30" 
                    style={{ backgroundColor: color }}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        
        <footer className="py-4 px-6 text-center text-gray-600/40 text-sm backdrop-blur-md bg-white/5 border-t border-white/10 relative z-10">
          背景弥散生成器 &copy; {new Date().getFullYear()}
        </footer>
        
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        
        <style jsx global>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          
          @keyframes aurora {
            0% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }
          
          @keyframes pulse-glow {
            0% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(123, 213, 255, 0.3); }
            50% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(123, 213, 255, 0.5); }
            100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(123, 213, 255, 0.3); }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          .animate-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }
          
          .bg-grid-lines {
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
          }
          
          .bg-grid-pattern {
            background-image: 
              linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%), 
              linear-gradient(-45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.05) 75%), 
              linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.05) 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          }
          
          /* 自定义滚动条样式 */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
          
          /* 颜色输入样式覆盖 */
          input[type="color"]::-webkit-color-swatch-wrapper {
            padding: 0;
          }

          input[type="color"]::-webkit-color-swatch {
            border: none;
            border-radius: 8px;
          }
        `}</style>
    </div>
  );
};

export default App;
