import React from 'react';
import {
  FileText,
  Sparkles,
  Printer,
  Download,
  Layout,
  BookOpen,
  Camera,
  Layers,
  Wand2,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'input' | 'templates' | 'presets';
  setActiveTab: (tab: 'studio' | 'input' | 'templates' | 'presets') => void;
  onExportPDF: () => void;
  onPrintPreview: () => void;
  onOpenAICopilot: () => void;
  documentTitle?: string;
  isGenerating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExportPDF,
  onPrintPreview,
  onOpenAICopilot,
  documentTitle = 'Untitled Publication',
  isGenerating = false,
}) => {
  return (
    <header className="no-print bg-slate-900/95 border-b border-slate-800 backdrop-blur sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-playfair font-bold text-lg text-white tracking-tight">
                AI PDF Studio
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                Publication Grade
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Adobe InDesign + Canva + Notion + Gemini AI
            </p>
          </div>
        </div>

        {/* Center Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs font-medium">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Studio Canvas</span>
          </button>

          <button
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'input'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Creator Input</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'templates'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'presets'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Showcase Presets</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAICopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-indigo-950 text-indigo-200 border border-indigo-700/50 hover:bg-indigo-900 transition shadow-sm"
            title="AI Studio Assistant"
          >
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          <button
            onClick={onPrintPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
            title="High Fidelity Print View"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={onExportPDF}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold shadow-lg shadow-teal-500/20 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
