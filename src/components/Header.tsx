import React, { useState } from 'react';
import {
  FileText,
  Globe,
  Settings,
  User,
  Check,
  Moon,
  Sun,
  Sparkles,
  Printer,
  Download,
  Wand2,
} from 'lucide-react';
import { LANGUAGE_OPTIONS, SupportedLanguage, getTranslation } from '../i18n';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onExportPDF: () => void;
  onPrintPreview: () => void;
  onOpenAICopilot: () => void;
  isGenerating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  onExportPDF,
  onPrintPreview,
  onOpenAICopilot,
  isGenerating = false,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const selectedLangObj = LANGUAGE_OPTIONS.find((l) => l.code === currentLanguage) || LANGUAGE_OPTIONS[1];

  return (
    <header className={`no-print sticky top-0 z-40 px-3 py-2.5 transition-colors border-b ${
      isDarkMode
        ? 'bg-slate-900/95 border-slate-800 text-slate-100'
        : 'bg-white/95 border-slate-200/80 text-slate-900 shadow-sm backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Top Left Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-teal-400 p-0.5 shadow-md shadow-blue-500/20 shrink-0">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
              isDarkMode ? 'bg-slate-950' : 'bg-white'
            }`}>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight font-inter text-slate-900 dark:text-white">
                Tamreen <span className="text-blue-600">AI PDF</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              ChatGPT + Canva + Notion + Apple Design
            </p>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick AI Copilot */}
          <button
            onClick={onOpenAICopilot}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition shadow-sm ${
              isDarkMode
                ? 'bg-blue-950/80 text-blue-200 border border-blue-800/60 hover:bg-blue-900'
                : 'bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>AI Copilot</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={onExportPDF}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition disabled:opacity-50 min-h-[40px]"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{getTranslation(currentLanguage, 'downloadPdf')}</span>
          </button>

          {/* 🌐 Language Selector Button */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition min-h-[40px] ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-100/80 border-slate-200/80 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline font-medium">{selectedLangObj.nativeName}</span>
              <span className="sm:hidden">{selectedLangObj.flag}</span>
            </button>

            {/* Language Dropdown Menu */}
            {langMenuOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border p-1.5 z-50 animate-in fade-in slide-in-from-top-2 ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Select Language / ভাষা সিলেক্ট করুন
                </div>
                <div className="max-h-64 overflow-y-auto py-1 space-y-0.5">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                        currentLanguage === lang.code
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({lang.name})</span>
                      </span>
                      {currentLanguage === lang.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings / Dark mode */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-2 rounded-xl text-xs border transition min-h-[40px] min-w-[40px] flex items-center justify-center ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100/80 border-slate-200/80 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {settingsOpen && (
              <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-xl border p-3 z-50 animate-in fade-in ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="text-xs font-bold pb-2 border-b border-slate-100 dark:border-slate-800">
                  Settings & Preferences
                </div>
                <div className="py-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Dark Mode</span>
                    <button
                      onClick={onToggleDarkMode}
                      className={`p-1.5 rounded-xl border transition flex items-center gap-1 text-xs ${
                        isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-amber-300'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                      <span className="text-[10px] font-bold">{isDarkMode ? 'Dark' : 'Light'}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
                    <span>AI Engine Status</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Online
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 p-0.5 shadow-sm shrink-0">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center font-bold text-xs ${
              isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-blue-700'
            }`}>
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
