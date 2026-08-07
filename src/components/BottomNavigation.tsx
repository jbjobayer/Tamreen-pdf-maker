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
    <nav className="no-print fixed bottom-0 left-0 right-0 z-50 px-4 py-2 bg-[#eaf0f8] border-t border-slate-200/80 font-bengali shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition min-w-[64px] ${
            activeTab === 'home' ? 'neu-pressed text-blue-700 font-extrabold' : 'neu-button text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">হোম</span>
        </button>

        {/* Center Prominent Button "আমি কী বানাবো" */}
        <button
          onClick={onOpenCreateModal}
          className="flex flex-col items-center justify-center -mt-6 group"
        >
          <div className="w-14 h-14 rounded-2xl neu-primary-btn flex items-center justify-center shadow-lg active:scale-95 transition">
            <PlusCircle className="w-8 h-8 text-amber-300" />
          </div>
          <span className="text-[11px] font-black text-blue-800 mt-1">
            আমি কী বানাবো
          </span>
        </button>

        {/* My PDFs Library */}
        <button
          onClick={() => setActiveTab('mypdfs')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition min-w-[64px] ${
            activeTab === 'mypdfs' ? 'neu-pressed text-blue-700 font-extrabold' : 'neu-button text-slate-600'
          }`}
        >
          <Folder className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">আমার পিডিএফ</span>
        </button>
      </div>
    </nav>
  );
};
