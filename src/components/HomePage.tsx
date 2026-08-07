import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  CheckSquare,
  FileText,
  Book,
  ClipboardList,
  FileSpreadsheet,
  BookMarked,
  BarChart3,
  Layers,
  Wand2,
  Zap,
} from 'lucide-react';
import { SupportedLanguage, getTranslation } from '../i18n';

interface HomePageProps {
  currentLanguage: SupportedLanguage;
  isDarkMode?: boolean;
  onStartCreate: (selectedCategory?: string) => void;
  onBrowseTemplates: () => void;
}

export interface CategoryCardData {
  id: string;
  titleKey: string;
  defaultTitle: string;
  description: string;
  icon: React.ReactNode;
  bgGradient: string;
  iconColor: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentLanguage,
  isDarkMode = false,
  onStartCreate,
  onBrowseTemplates,
}) => {
  const categories: CategoryCardData[] = [
    {
      id: 'study_notes',
      titleKey: 'catStudyNotes',
      defaultTitle: 'Study Notes',
      description: 'Structured chapter summaries, key takeaways & formula cheatsheets.',
      icon: <BookOpen className="w-6 h-6" />,
      bgGradient: 'from-blue-50 to-indigo-50/80 dark:from-slate-900 dark:to-blue-950/40',
      iconColor: 'text-blue-600 bg-blue-100 dark:bg-blue-900/50',
    },
    {
      id: 'university_answer',
      titleKey: 'catUniversityAnswer',
      defaultTitle: 'University Answer Sheet',
      description: '10-pt Honours & Masters standard exam model answers with references.',
      icon: <GraduationCap className="w-6 h-6" />,
      bgGradient: 'from-purple-50 to-indigo-50/80 dark:from-slate-900 dark:to-purple-950/40',
      iconColor: 'text-purple-600 bg-purple-100 dark:bg-purple-900/50',
    },
    {
      id: 'mcq_book',
      titleKey: 'catMCQBook',
      defaultTitle: 'MCQ Practice Book',
      description: 'High-yield question banks with options, correct keys & explanations.',
      icon: <CheckSquare className="w-6 h-6" />,
      bgGradient: 'from-emerald-50 to-teal-50/80 dark:from-slate-900 dark:to-emerald-950/40',
      iconColor: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50',
    },
    {
      id: 'research_paper',
      titleKey: 'catResearchPaper',
      defaultTitle: 'Research Monograph',
      description: 'Double-column IEEE & Oxford standard research layout with abstract.',
      icon: <FileText className="w-6 h-6" />,
      bgGradient: 'from-sky-50 to-blue-50/80 dark:from-slate-900 dark:to-sky-950/40',
      iconColor: 'text-sky-600 bg-sky-100 dark:bg-sky-900/50',
    },
    {
      id: 'islamic_book',
      titleKey: 'catIslamicBook',
      defaultTitle: 'Islamic Manuscript',
      description: 'Scholarly Tafsir, Hadith references, Quranic arabic & translations.',
      icon: <Book className="w-6 h-6" />,
      bgGradient: 'from-amber-50 to-orange-50/80 dark:from-slate-900 dark:to-amber-950/40',
      iconColor: 'text-amber-600 bg-amber-100 dark:bg-amber-900/50',
    },
    {
      id: 'assignment',
      titleKey: 'catAssignment',
      defaultTitle: 'Assignment Document',
      description: 'University & college assignment layout with cover page & TOC.',
      icon: <ClipboardList className="w-6 h-6" />,
      bgGradient: 'from-indigo-50 to-blue-50/80 dark:from-slate-900 dark:to-indigo-950/40',
      iconColor: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50',
    },
    {
      id: 'worksheet',
      titleKey: 'catWorksheet',
      defaultTitle: 'Worksheet & Exercises',
      description: 'Practice problems, classroom exercises & printable test sheets.',
      icon: <FileSpreadsheet className="w-6 h-6" />,
      bgGradient: 'from-teal-50 to-cyan-50/80 dark:from-slate-900 dark:to-teal-950/40',
      iconColor: 'text-teal-600 bg-teal-100 dark:bg-teal-900/50',
    },
    {
      id: 'guide_book',
      titleKey: 'catGuideBook',
      defaultTitle: 'Guide Book & Manual',
      description: 'Multi-chapter textbook, technical guide or pocket handbook.',
      icon: <BookMarked className="w-6 h-6" />,
      bgGradient: 'from-rose-50 to-pink-50/80 dark:from-slate-900 dark:to-rose-950/40',
      iconColor: 'text-rose-600 bg-rose-100 dark:bg-rose-900/50',
    },
    {
      id: 'report',
      titleKey: 'catReport',
      defaultTitle: 'Executive Report',
      description: 'Data reports, infographics, charts & executive summaries.',
      icon: <BarChart3 className="w-6 h-6" />,
      bgGradient: 'from-blue-50 to-slate-50/80 dark:from-slate-900 dark:to-slate-900',
      iconColor: 'text-blue-700 bg-blue-100 dark:bg-blue-900/50',
    },
    {
      id: 'more',
      titleKey: 'catMore',
      defaultTitle: 'More Categories',
      description: 'Custom document formats, EPUBs, Slide Presentations & more.',
      icon: <Layers className="w-6 h-6" />,
      bgGradient: 'from-violet-50 to-purple-50/80 dark:from-slate-900 dark:to-violet-950/40',
      iconColor: 'text-violet-600 bg-violet-100 dark:bg-violet-900/50',
    },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Hero Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-lg relative overflow-hidden transition-all ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-slate-800 text-white'
          : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 border-blue-500 text-white shadow-blue-500/10'
      }`}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Publication Engine V2.0</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-inter leading-tight">
            {getTranslation(currentLanguage, 'heroTitle')}
          </h1>

          <p className="text-sm text-blue-50/90 dark:text-slate-300 font-medium leading-relaxed">
            {getTranslation(currentLanguage, 'heroSubtitle')}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartCreate()}
              className="px-5 py-3 rounded-2xl bg-white text-blue-700 font-extrabold text-sm shadow-md hover:bg-blue-50 transition transform active:scale-95 flex items-center gap-2 min-h-[48px]"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{getTranslation(currentLanguage, 'createNewDoc')}</span>
            </button>

            <button
              onClick={onBrowseTemplates}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-sm border border-white/20 transition min-h-[48px]"
            >
              {getTranslation(currentLanguage, 'browseTemplates')}
            </button>
          </div>
        </div>
      </div>

      {/* Category Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Document Categories
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tap any category to launch step-by-step creation wizard
          </p>
        </div>
        <button
          onClick={() => onStartCreate()}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {categories.map((cat) => {
          const title = getTranslation(currentLanguage, cat.titleKey) || cat.defaultTitle;

          return (
            <div
              key={cat.id}
              onClick={() => onStartCreate(cat.id)}
              className={`p-4 rounded-3xl border transition-all transform active:scale-98 cursor-pointer flex items-center justify-between gap-3 shadow-sm hover:shadow-md ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 hover:border-blue-700/50'
                  : 'bg-white border-slate-200/80 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-3 rounded-2xl ${cat.iconColor} shrink-0`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Highlight Pill Banner */}
      <div className={`p-4 rounded-2xl border text-center space-y-1 ${
        isDarkMode
          ? 'bg-slate-900/60 border-slate-800 text-slate-300'
          : 'bg-blue-50/50 border-blue-100 text-slate-700'
      }`}>
        <p className="text-xs font-semibold flex items-center justify-center gap-1.5 text-blue-700 dark:text-blue-300">
          <Wand2 className="w-4 h-4 text-amber-500" />
          <span>Zero Learning Curve • Oxford & Cambridge Standard Formatting</span>
        </p>
      </div>
    </div>
  );
};
