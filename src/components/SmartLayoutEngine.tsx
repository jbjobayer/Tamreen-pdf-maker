import React from 'react';
import {
  LayoutGrid,
  Columns,
  Sparkles,
  Layers,
  Sliders,
  Check,
  Zap,
  AlignLeft,
  Maximize2,
  Box,
  Layout,
  Minimize2,
} from 'lucide-react';

export type LayoutParadigm = 'academic' | 'grid' | 'fluid';
export type GridTemplateType = 'equal_2col' | 'equal_3col' | 'bento_hero' | 'asymmetric_left' | 'asymmetric_right';
export type CardStyleType = 'bordered' | 'paper_card' | 'minimal' | 'elevated_shadow';

export interface SmartLayoutConfig {
  paradigm: LayoutParadigm;
  gridTemplate: GridTemplateType;
  gridGap: number; // in px (8 to 32)
  cardStyle: CardStyleType;
  fluidHeroSection: boolean;
  columnCount: 1 | 2 | 3;
}

interface SmartLayoutEngineProps {
  config: SmartLayoutConfig;
  onChangeConfig: (newConfig: SmartLayoutConfig) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const SmartLayoutEngine: React.FC<SmartLayoutEngineProps> = ({
  config,
  onChangeConfig,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleParadigmChange = (paradigm: LayoutParadigm) => {
    let newColumnCount: 1 | 2 | 3 = config.columnCount;
    if (paradigm === 'academic') newColumnCount = 2;
    else if (paradigm === 'grid') newColumnCount = 2;
    else if (paradigm === 'fluid') newColumnCount = 1;

    onChangeConfig({
      ...config,
      paradigm,
      columnCount: newColumnCount,
    });
  };

  const handleApplyPreset = (presetKey: string) => {
    switch (presetKey) {
      case 'oxford_academic':
        onChangeConfig({
          paradigm: 'academic',
          gridTemplate: 'equal_2col',
          gridGap: 24,
          cardStyle: 'bordered',
          fluidHeroSection: false,
          columnCount: 2,
        });
        break;
      case 'bento_grid':
        onChangeConfig({
          paradigm: 'grid',
          gridTemplate: 'bento_hero',
          gridGap: 16,
          cardStyle: 'paper_card',
          fluidHeroSection: true,
          columnCount: 2,
        });
        break;
      case 'fluid_editorial':
        onChangeConfig({
          paradigm: 'fluid',
          gridTemplate: 'equal_2col',
          gridGap: 20,
          cardStyle: 'elevated_shadow',
          fluidHeroSection: true,
          columnCount: 1,
        });
        break;
      case 'ieee_double':
        onChangeConfig({
          paradigm: 'academic',
          gridTemplate: 'equal_2col',
          gridGap: 16,
          cardStyle: 'minimal',
          fluidHeroSection: false,
          columnCount: 2,
        });
        break;
      case 'triple_grid':
        onChangeConfig({
          paradigm: 'grid',
          gridTemplate: 'equal_3col',
          gridGap: 12,
          cardStyle: 'paper_card',
          fluidHeroSection: false,
          columnCount: 3,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-2xl text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white shadow">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-playfair font-bold text-sm text-white flex items-center gap-2">
              Smart Layout Engine
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                REAL-TIME CSS GRID & FLEX
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Switch page structure paradigms with real-time CSS grid/flex rendering on the PDF preview stage.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Layout Presets Bar */}
      <div className="space-y-2">
        <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider block">
          ⚡ 1-Click Smart Layout Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleApplyPreset('oxford_academic')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-200 transition text-[11px] flex items-center gap-1.5"
          >
            <Columns className="w-3.5 h-3.5 text-indigo-400" />
            <span>Oxford 2-Col Academic</span>
          </button>
          <button
            onClick={() => handleApplyPreset('bento_grid')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-teal-500 text-slate-200 transition text-[11px] flex items-center gap-1.5"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-teal-400" />
            <span>Bento Box Feature Grid</span>
          </button>
          <button
            onClick={() => handleApplyPreset('fluid_editorial')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-200 transition text-[11px] flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fluid Editorial Magazine</span>
          </button>
          <button
            onClick={() => handleApplyPreset('ieee_double')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-200 transition text-[11px] flex items-center gap-1.5"
          >
            <AlignLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>IEEE Monograph</span>
          </button>
          <button
            onClick={() => handleApplyPreset('triple_grid')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500 text-slate-200 transition text-[11px] flex items-center gap-1.5"
          >
            <Box className="w-3.5 h-3.5 text-purple-400" />
            <span>3-Column Grid</span>
          </button>
        </div>
      </div>

      {/* Main Paradigm Selector */}
      <div className="space-y-2">
        <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider block">
          Select Page Structure Paradigm:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Paradigm 1: Academic Structured */}
          <div
            onClick={() => handleParadigmChange('academic')}
            className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 relative ${
              config.paradigm === 'academic'
                ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <Columns className="w-4 h-4 text-indigo-400" />
                Academic Structured
              </span>
              {config.paradigm === 'academic' && (
                <Check className="w-4 h-4 text-teal-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Formal 1 or 2-column textbook monograph flow with running headers, drop-caps, and gutter columns.
            </p>
          </div>

          {/* Paradigm 2: Grid-Based Bento */}
          <div
            onClick={() => handleParadigmChange('grid')}
            className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 relative ${
              config.paradigm === 'grid'
                ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4 text-teal-400" />
                Grid-Based Bento
              </span>
              {config.paradigm === 'grid' && (
                <Check className="w-4 h-4 text-teal-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Modern CSS grid card layout with Bento box feature headers, side-by-side matrices, and cards.
            </p>
          </div>

          {/* Paradigm 3: Free-Form / Fluid */}
          <div
            onClick={() => handleParadigmChange('fluid')}
            className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 relative ${
              config.paradigm === 'fluid'
                ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Free-Form Fluid
              </span>
              {config.paradigm === 'fluid' && (
                <Check className="w-4 h-4 text-teal-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dynamic flexbox magazine flow with hero banners, pull quotes, floating callouts, and staggered media.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Settings Options */}
      {config.paradigm === 'grid' && (
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
          <span className="text-slate-300 font-bold text-xs block">
            📐 CSS Grid Matrix Options:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Grid Template Type */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-[11px] font-medium block">
                Grid Template Architecture:
              </label>
              <select
                value={config.gridTemplate}
                onChange={(e) =>
                  onChangeConfig({ ...config, gridTemplate: e.target.value as GridTemplateType })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="equal_2col">Equal 2-Column Cards (1fr 1fr)</option>
                <option value="equal_3col">Equal 3-Column Compact Cards (1fr 1fr 1fr)</option>
                <option value="bento_hero">Bento Box (Hero Card 100% Width + Grid)</option>
                <option value="asymmetric_left">Asymmetric Left Weight (2fr 1fr)</option>
                <option value="asymmetric_right">Asymmetric Right Weight (1fr 2fr)</option>
              </select>
            </div>

            {/* Grid Gap Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <label className="text-slate-400 font-medium">Grid Cell Gap:</label>
                <span className="text-indigo-400 font-mono font-bold">{config.gridGap}px</span>
              </div>
              <input
                type="range"
                min={8}
                max={32}
                step={4}
                value={config.gridGap}
                onChange={(e) =>
                  onChangeConfig({ ...config, gridGap: parseInt(e.target.value) })
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Academic Options */}
      {config.paradigm === 'academic' && (
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
          <span className="text-slate-300 font-bold text-xs block">
            🏛️ Academic Column & Margins:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400 text-[11px] font-medium block">
                Column Flow:
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map((cols) => (
                  <button
                    key={cols}
                    onClick={() =>
                      onChangeConfig({ ...config, columnCount: cols as 1 | 2 | 3 })
                    }
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                      config.columnCount === cols
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cols} Col
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 text-[11px] font-medium block">
                Section Card Framing:
              </label>
              <select
                value={config.cardStyle}
                onChange={(e) =>
                  onChangeConfig({ ...config, cardStyle: e.target.value as CardStyleType })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="minimal">Minimal Clean Line</option>
                <option value="bordered">Classical Subtle Border</option>
                <option value="paper_card">Parchment Paper Card</option>
                <option value="elevated_shadow">Elevated Monograph Shadow</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Fluid Options */}
      {config.paradigm === 'fluid' && (
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-bold text-xs block">
              🎨 Fluid Magazine Options:
            </span>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.fluidHeroSection}
                onChange={(e) =>
                  onChangeConfig({ ...config, fluidHeroSection: e.target.checked })
                }
                className="rounded accent-indigo-500"
              />
              <span>Enable Hero Banner Section</span>
            </label>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Fluid paradigm dynamically rearranges sections with staggered pull-quotes, wide media breaks, and flowing flex wraps.
          </p>
        </div>
      )}
    </div>
  );
};
