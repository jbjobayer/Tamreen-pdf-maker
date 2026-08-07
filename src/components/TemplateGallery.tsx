import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Briefcase,
  FileText,
  Building,
  CheckCircle2,
  ArrowRight,
  Globe,
  Search,
  Palette,
  Type,
  Layers,
  Star,
} from 'lucide-react';
import { sampleDocuments } from '../data/sampleDocuments';
import {
  PREMIUM_TEMPLATE_CATALOG,
  TEMPLATE_CATEGORY_LIST,
  TemplateCategory,
  COLOR_THEME_LIBRARY,
  TYPOGRAPHY_PRESETS,
  PremiumTemplate,
} from '../data/templateLibrary';
import { DocumentData } from '../types';

interface TemplateGalleryProps {
  onSelectTemplate: (doc: DocumentData) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate }) => {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter templates
  const filteredTemplates = PREMIUM_TEMPLATE_CATALOG.filter((tpl) => {
    const matchesCat = activeCategory === 'ALL' || tpl.category === activeCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleApplyTemplateToSample = (tpl: PremiumTemplate) => {
    // Determine base sample doc according to category or fallback
    let baseDoc = sampleDocuments[0];
    if (tpl.category === 'ISLAMIC') baseDoc = sampleDocuments[0];
    else if (tpl.category === 'ACADEMIC') baseDoc = sampleDocuments[1];
    else if (tpl.category === 'BUSINESS') baseDoc = sampleDocuments[2];
    else if (tpl.category === 'BOOK' || tpl.category === 'MAGAZINE') baseDoc = sampleDocuments[3];

    const theme = COLOR_THEME_LIBRARY.find((t) => t.id === tpl.config.colorThemeId) || COLOR_THEME_LIBRARY[0];
    const typo = TYPOGRAPHY_PRESETS.find((p) => p.id === tpl.config.typographyPresetId) || TYPOGRAPHY_PRESETS[0];

    const updatedDoc: DocumentData = {
      ...baseDoc,
      title: `${tpl.name} — ${baseDoc.title}`,
      documentType: tpl.name as any,
      theme: tpl.name as any,
      primaryFont: typo.fontFamily,
      accentColor: theme.accentColor,
      headerText: tpl.config.headerText || baseDoc.headerText,
      footerText: tpl.config.footerText || baseDoc.footerText,
      columnCount: (tpl.config.columns as any) || baseDoc.columnCount,
      coverData: baseDoc.coverData
        ? {
            ...baseDoc.coverData,
            coverStyle: tpl.config.coverStyle || baseDoc.coverData.coverStyle,
          }
        : undefined,
    };

    onSelectTemplate(updatedDoc);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Premium Publishing Template Marketplace</span>
        </div>
        <h2 className="font-playfair text-3xl md:text-5xl font-bold text-white tracking-tight">
          50+ Publication Grade Templates & Styles
        </h2>
        <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
          Designed for Oxford Scholars, Islamic Researchers, University Faculties, Corporate Executives, and Book Publishers.
          Instant 1-click preview and switch without AI regeneration.
        </p>
      </div>

      {/* Search Bar & Category Tabs */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search template marketplace (e.g., Oxford, Cambridge, Hardcover, Islamic Gold, BCG Report, Notion)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeCategory === 'ALL'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ALL CATEGORIES ({PREMIUM_TEMPLATE_CATALOG.length})
          </button>
          {TEMPLATE_CATEGORY_LIST.map((cat) => {
            const count = PREMIUM_TEMPLATE_CATALOG.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => handleApplyTemplateToSample(tpl)}
            className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-indigo-500/80 transition cursor-pointer flex flex-col justify-between space-y-4 shadow-xl group hover:scale-[1.01]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider bg-teal-950/60 border border-teal-800/50 px-2.5 py-0.5 rounded-full">
                  {tpl.badge}
                </span>
                {tpl.popular && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    POPULAR
                  </span>
                )}
              </div>

              {/* Banner Visual */}
              <div
                className={`h-24 rounded-xl bg-gradient-to-br ${tpl.previewGradient} border border-white/10 p-3.5 flex flex-col justify-end shadow-inner relative overflow-hidden`}
              >
                <div className="absolute top-2 right-2 text-[10px] font-mono text-white/50 uppercase">
                  {tpl.config.coverStyle}
                </div>
                <h3 className="font-playfair font-bold text-lg text-white drop-shadow">
                  {tpl.name}
                </h3>
                <span className="text-[10px] text-slate-300 font-mono">
                  Category: {tpl.category}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {tpl.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                {tpl.config.columns} Column • {tpl.config.margins} Margins
              </span>
              <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>Load Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

