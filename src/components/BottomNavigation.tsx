import React from 'react';
import { Home, PlusCircle, LayoutGrid, Folder } from 'lucide-react';

export type MainTab = 'home' | 'create' | 'templates' | 'mypdfs';

interface BottomNavigationProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  onOpenCreateModal: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
}) => {
  return (
    <nav className="no-print fixed bottom-0 left-0 right-0 z-50 px-4 py-2.5 bg-[#eaf0f8] dark:bg-[#eaf0f8] border-t border-slate-200/90 font-bengali shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto flex items-center justify-around gap-2">
        {/* Button 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all min-w-[80px] ${
            activeTab === 'home'
              ? 'neu-pressed text-blue-700 font-extrabold'
              : 'neu-button text-slate-700 hover:text-blue-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-bold mt-1">হোম</span>
        </button>

        {/* Button 2: Center "আমি কী বানাবো" */}
        <button
          onClick={onOpenCreateModal}
          className="flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all neu-button text-blue-800 font-extrabold hover:text-blue-900 min-w-[110px] group"
        >
          <div className="flex items-center gap-1.5">
            <PlusCircle className="w-5 h-5 text-blue-600 fill-blue-100 group-hover:scale-110 transition-transform" />
            <span className="text-[12px] font-black text-blue-700">আমি কী বানাবো</span>
          </div>
        </button>

        {/* Button 3: My PDFs */}
        <button
          onClick={() => setActiveTab('mypdfs')}
          className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all min-w-[80px] ${
            activeTab === 'mypdfs'
              ? 'neu-pressed text-blue-700 font-extrabold'
              : 'neu-button text-slate-700 hover:text-blue-600'
          }`}
        >
          <Folder className="w-5 h-5" />
          <span className="text-[11px] font-bold mt-1">আমার পিডিএফ</span>
        </button>
      </div>
    </nav>
  );
};
