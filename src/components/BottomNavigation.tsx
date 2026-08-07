import React from 'react';
import { Home, PlusCircle, LayoutGrid, Folder, User } from 'lucide-react';
import { SupportedLanguage, getTranslation } from '../i18n';

export type MainTab = 'home' | 'create' | 'templates' | 'mypdfs' | 'profile';

interface BottomNavigationProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  currentLanguage: SupportedLanguage;
  isDarkMode?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  setActiveTab,
  currentLanguage,
  isDarkMode = false,
}) => {
  const navItems: { id: MainTab; labelKey: string; icon: React.ReactNode; isPlus?: boolean }[] = [
    {
      id: 'home',
      labelKey: 'tabHome',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'create',
      labelKey: 'tabCreate',
      icon: <PlusCircle className="w-6 h-6 text-white" />,
      isPlus: true,
    },
    {
      id: 'templates',
      labelKey: 'tabTemplates',
      icon: <LayoutGrid className="w-5 h-5" />,
    },
    {
      id: 'mypdfs',
      labelKey: 'tabMyPDFs',
      icon: <Folder className="w-5 h-5" />,
    },
    {
      id: 'profile',
      labelKey: 'tabProfile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className={`no-print fixed bottom-0 left-0 right-0 z-50 px-4 py-2 border-t transition-colors ${
      isDarkMode
        ? 'bg-slate-900/95 border-slate-800 text-slate-200'
        : 'bg-white/95 border-slate-200/80 text-slate-800 shadow-lg backdrop-blur-lg'
    }`}>
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const label = getTranslation(currentLanguage, item.labelKey);

          if (item.isPlus) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-active:scale-95 transition transform">
                  <PlusCircle className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition min-w-[56px] min-h-[48px] ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${isActive ? 'bg-blue-50 dark:bg-blue-950/50' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
