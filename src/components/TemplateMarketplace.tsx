import React, { useState } from 'react';
import {
  Search,
  Star,
  Heart,
  Check,
  Zap,
  Sparkles,
  BookOpen,
  GraduationCap,
  FileText,
  Book,
  Award,
} from 'lucide-react';
import { SupportedLanguage, getTranslation } from '../i18n';
import { sampleDocuments } from '../data/sampleDocuments';
import { DocumentData } from '../types';

interface TemplateMarketplaceProps {
  currentLanguage: SupportedLanguage;
  isDarkMode?: boolean;
  onSelectTemplateDoc: (doc: DocumentData) => void;
}

export const TemplateMarketplace: React.FC<TemplateMarketplaceProps> = ({
  currentLanguage,
  isDarkMode = false,
  onSelectTemplateDoc,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryChip, setSelectedCategoryChip] = useState('ALL');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const categoryChips = ['ALL', 'ACADEMIC', 'UNIVERSITY EXAM', 'MCQ BOOK', 'ISLAMIC', 'RESEARCH'];

  const templatesList = [
    {
      id: 'tpl-oxford',
      name: 'Oxford Academic Press (2026)',
      category: 'ACADEMIC',
      badge: 'Popular',
      isPremium: false,
      rating: 4.9,
      downloads: '142k',
      previewGradient: 'from-blue-600 via-indigo-600 to-slate-800',
      description: 'Classic double-line header, formal margins & Oxford typography.',
      sampleDocIndex: 0,
    },
    {
      id: 'tpl-cambridge',
      name: 'Cambridge Science Series',
      category: 'RESEARCH',
      badge: 'Top Rated',
      isPremium: true,
      rating: 4.95,
      downloads: '98k',
      previewGradient: 'from-teal-600 via-emerald-600 to-slate-800',
      description: 'Teal accent headers with clean multi-column layouts & diagram callouts.',
      sampleDocIndex: 1,
    },
    {
      id: 'tpl-islamic',
      name: 'Islamic Classical Tafsir Manuscript',
      category: 'ISLAMIC',
      badge: 'Heritage',
      isPremium: false,
      rating: 5.0,
      downloads: '210k',
      previewGradient: 'from-amber-600 via-emerald-700 to-slate-900',
      description: 'Gold/emerald borders with Noto Naskh Arabic & verse references.',
      sampleDocIndex: 2,
    },
    {
      id: 'tpl-exam',
      name: 'Government Exam & BCS Guide',
      category: 'UNIVERSITY EXAM',
      badge: 'Popular',
      isPremium: false,
      rating: 4.88,
      downloads: '180k',
      previewGradient: 'from-purple-600 via-indigo-700 to-slate-900',
      description: 'High-density question paper layout with bold model answers.',
      sampleDocIndex: 3,
    },
    {
      id: 'tpl-mcq',
      name: 'High-Yield MCQ Question Bank',
      category: 'MCQ BOOK',
      badge: 'Free',
      isPremium: false,
      rating: 4.85,
      downloads: '85k',
      previewGradient: 'from-blue-500 via-sky-600 to-slate-800',
      description: '2-column MCQ grid with answer options & explanation callouts.',
      sampleDocIndex: 0,
    },
  ];

  const filteredTemplates = templatesList.filter((tpl) => {
    const matchesCategory = selectedCategoryChip === 'ALL' || tpl.category === selectedCategoryChip;
    const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in">
      {/* Header Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span>Template Marketplace (200+)</span>
        </h2>
        <p className="text-xs text-slate-500">
          Publication-ready document templates designed by academic editors
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates by topic, subject, style..."
          className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px] ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
          }`}
        />
      </div>

      {/* Category Chips Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categoryChips.map((chip) => {
          const isActive = selectedCategoryChip === chip;
          return (
            <button
              key={chip}
              onClick={() => setSelectedCategoryChip(chip)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition border shrink-0 min-h-[38px] ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTemplates.map((tpl) => {
          const isFav = !!favorites[tpl.id];
          const docToLoad = sampleDocuments[tpl.sampleDocIndex] || sampleDocuments[0];

          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplateDoc(docToLoad)}
              className={`rounded-3xl border overflow-hidden transition-all transform active:scale-98 cursor-pointer shadow-sm hover:shadow-lg flex flex-col justify-between ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 hover:border-blue-700/50'
                  : 'bg-white border-slate-200/80 hover:border-blue-300'
              }`}
            >
              {/* Thumbnail Header Gradient */}
              <div className={`h-28 bg-gradient-to-tr ${tpl.previewGradient} p-4 flex flex-col justify-between text-white relative`}>
                <div className="flex justify-between items-center z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20">
                    {tpl.badge}
                  </span>

                  <button
                    onClick={(e) => toggleFavorite(tpl.id, e)}
                    className="p-1.5 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 text-white transition"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="z-10 flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {tpl.rating}
                  </span>
                  <span className="text-[10px] opacity-80">{tpl.downloads} uses</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplateDoc(docToLoad);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 hover:text-white text-blue-700 dark:text-blue-300 font-bold text-xs transition flex items-center justify-center gap-1.5 border border-blue-200/60 dark:border-blue-800/60 min-h-[44px]"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Load Template</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
