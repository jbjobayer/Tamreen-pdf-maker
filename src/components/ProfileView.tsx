import React from 'react';
import {
  User,
  Shield,
  Globe,
  Moon,
  Sun,
  FileText,
  Award,
  Zap,
  Sparkles,
  Check,
  Settings,
} from 'lucide-react';
import { LANGUAGE_OPTIONS, SupportedLanguage, getTranslation } from '../i18n';

interface ProfileViewProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isDarkMode?: boolean;
  onToggleDarkMode: () => void;
  totalPdfsCount: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentLanguage,
  onLanguageChange,
  isDarkMode = false,
  onToggleDarkMode,
  totalPdfsCount,
}) => {
  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-2xl mx-auto">
      {/* Profile Card */}
      <div className={`p-6 rounded-3xl border flex items-center gap-4 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
      }`}>
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-0.5 shadow-md shrink-0">
          <div className={`w-full h-full rounded-[22px] flex items-center justify-center ${
            isDarkMode ? 'bg-slate-950' : 'bg-white'
          }`}>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Tamreen Scholar
            </h2>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              PRO EDITION
            </span>
          </div>
          <p className="text-xs text-slate-500">jobayerofficial1@gmail.com</p>
          <p className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Publication Engine Connected</span>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`p-4 rounded-2xl border text-center space-y-1 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <FileText className="w-5 h-5 text-blue-600 mx-auto" />
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">{totalPdfsCount}</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold">PDFs Created</p>
        </div>

        <div className={`p-4 rounded-2xl border text-center space-y-1 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <Award className="w-5 h-5 text-purple-600 mx-auto" />
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">200+</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold">Templates</p>
        </div>

        <div className={`p-4 rounded-2xl border text-center space-y-1 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <Zap className="w-5 h-5 text-amber-500 mx-auto" />
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">Gemini 2.5</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold">AI Engine</p>
        </div>
      </div>

      {/* Preferences Settings */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-600" />
          <span>App Preferences</span>
        </h3>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Interface Theme</span>
          <button
            onClick={onToggleDarkMode}
            className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-300' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            <span>{isDarkMode ? 'Dark Theme' : 'Light Theme'}</span>
          </button>
        </div>

        {/* Language Selection */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">App Interface Language</span>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGE_OPTIONS.slice(0, 6).map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                  currentLanguage === lang.code
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </span>
                {currentLanguage === lang.code && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
