import React from 'react';
import {
  FileText,
  Moon,
  Sun,
  Download,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onExportPDF: () => void;
  onOpenCreateModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onExportPDF,
  onOpenCreateModal,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-[#eaf0f8] border-b border-slate-200/80 px-4 py-3 font-bengali shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* App Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center text-blue-600 shrink-0">
            <FileText className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl text-blue-900 tracking-tight">
                তামরীন <span className="text-blue-600">এআই স্টুডিও</span>
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-600 text-white uppercase tracking-wider">
                A4 PDF
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-bold hidden sm:block">
              বাংলা এআই পাবলিকেশন ও ডক্যুমেন্ট মেকার
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Main Action Button "আমি কী বানাবো" */}
          <button
            onClick={onOpenCreateModal}
            className="neu-primary-btn px-4 py-2 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 min-h-[42px] touch-manipulation active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>আমি কী বানাবো</span>
          </button>

          {/* Quick PDF Export */}
          <button
            onClick={onExportPDF}
            className="neu-button px-3.5 py-2 rounded-2xl text-slate-800 font-extrabold text-xs flex items-center gap-1.5 min-h-[42px] touch-manipulation"
            title="পিডিএফ ডাউনলোড করুন"
          >
            <Download className="w-4 h-4 text-blue-700" />
            <span className="hidden md:inline">পিডিএফ ডাউনলোড</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="neu-button p-2.5 rounded-2xl text-slate-700 min-h-[42px] min-w-[42px] flex items-center justify-center"
            title="থিম পরিবর্তন"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
