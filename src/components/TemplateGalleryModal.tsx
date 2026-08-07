import React, { useState } from 'react';
import {
  X,
  Search,
  Sparkles,
  Check,
  Palette,
  Type,
  BookOpen,
  Layout,
  Sliders,
  Eye,
  Star,
} from 'lucide-react';
import {
  PREMIUM_TEMPLATE_CATALOG,
  COLOR_THEME_LIBRARY,
  TYPOGRAPHY_PRESETS,
  TEMPLATE_CATEGORY_LIST,
  TemplateCategory,
  PremiumTemplate,
} from '../data/templateLibrary';
import { DocumentData, CustomizationSettings } from '../types';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentData;
  customization: CustomizationSettings;
  onApplyTemplate: (
    template: PremiumTemplate,
    updatedCustomization: CustomizationSettings,
    updatedDoc: Partial<DocumentData>
  ) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  document,
  customization,
  onApplyTemplate,
}) => {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PremiumTemplate>(
    PREMIUM_TEMPLATE_CATALOG[0]
  );
  const [activeTab, setActiveTab] = useState<'TEMPLATES' | 'THEMES' | 'TYPOGRAPHY'>('TEMPLATES');

  if (!isOpen) return null;

  // Filter templates
  const filteredTemplates = PREMIUM_TEMPLATE_CATALOG.filter((tpl) => {
    const matchesCat = activeCategory === 'ALL' || tpl.category === activeCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectTemplate = (template: PremiumTemplate) => {
    setSelectedTemplate(template);

    // Find theme & typography
    const theme = COLOR_THEME_LIBRARY.find((t) => t.id === template.config.colorThemeId) || COLOR_THEME_LIBRARY[0];
    const typo = TYPOGRAPHY_PRESETS.find((p) => p.id === template.config.typographyPresetId) || TYPOGRAPHY_PRESETS[0];

    const updatedCustomization: CustomizationSettings = {
      ...customization,
      fontFamily: typo.fontFamily,
      headingFontFamily: typo.headingFontFamily,
      titleFontSize: typo.titleFontSize,
      chapterFontSize: typo.chapterFontSize,
      headingFontSize: typo.headingFontSize,
      bodyFontSize: typo.bodyFontSize,
      lineHeight: typo.lineHeight,
      paragraphSpacing: typo.paragraphSpacing,
      accentColor: theme.accentColor,
      headingColor: theme.headingColor,
      bodyColor: theme.bodyColor,
      backgroundColor: theme.backgroundColor,
      margins: (template.config.margins as any) || customization.margins,
      columns: (template.config.columns as any) || customization.columns,
      headerText: template.config.headerText || customization.headerText,
      footerText: template.config.footerText || customization.footerText,
    };

    const updatedDoc: Partial<DocumentData> = {
      theme: (template.name as any) || document.theme,
      primaryFont: typo.fontFamily,
      accentColor: theme.accentColor,
      headerText: template.config.headerText || document.headerText,
      footerText: template.config.footerText || document.footerText,
      coverData: document.coverData
        ? {
            ...document.coverData,
            coverStyle: template.config.coverStyle || document.coverData.coverStyle,
          }
        : undefined,
    };

    onApplyTemplate(template, updatedCustomization, updatedDoc);
  };

  const handleApplyColorTheme = (themeId: string) => {
    const theme = COLOR_THEME_LIBRARY.find((t) => t.id === themeId);
    if (!theme) return;

    const updatedCustomization: CustomizationSettings = {
      ...customization,
      accentColor: theme.accentColor,
      headingColor: theme.headingColor,
      bodyColor: theme.bodyColor,
      backgroundColor: theme.backgroundColor,
    };

    const updatedDoc: Partial<DocumentData> = {
      accentColor: theme.accentColor,
    };

    onApplyTemplate(selectedTemplate, updatedCustomization, updatedDoc);
  };

  const handleApplyTypography = (typoId: string) => {
    const typo = TYPOGRAPHY_PRESETS.find((p) => p.id === typoId);
    if (!typo) return;

    const updatedCustomization: CustomizationSettings = {
      ...customization,
      fontFamily: typo.fontFamily,
      headingFontFamily: typo.headingFontFamily,
      titleFontSize: typo.titleFontSize,
      chapterFontSize: typo.chapterFontSize,
      headingFontSize: typo.headingFontSize,
      bodyFontSize: typo.bodyFontSize,
      lineHeight: typo.lineHeight,
      paragraphSpacing: typo.paragraphSpacing,
    };

    const updatedDoc: Partial<DocumentData> = {
      primaryFont: typo.fontFamily,
    };

    onApplyTemplate(selectedTemplate, updatedCustomization, updatedDoc);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-white flex items-center gap-2">
                Premium Template Marketplace
                <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                  50+ PUBLISHING TEMPLATES
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Transform your document in 1-click with Oxford, Cambridge, Islamic Manuscript, Hardcover & Magazine layouts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 py-2.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('TEMPLATES')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'TEMPLATES'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Publication Templates</span>
            </button>

            <button
              onClick={() => setActiveTab('THEMES')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'THEMES'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Color Themes (10)</span>
            </button>

            <button
              onClick={() => setActiveTab('TYPOGRAPHY')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'TYPOGRAPHY'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Typography Presets</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Active: <span className="text-teal-400 font-semibold">{selectedTemplate.name}</span>
          </div>
        </div>

        {/* TAB 1: TEMPLATES CATALOG */}
        {activeTab === 'TEMPLATES' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search and Category Filters */}
            <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950/40">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates (e.g., Oxford, Islamic Gold, Hardcover, Cambridge, BCG Report)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActiveCategory('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    activeCategory === 'ALL'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                        activeCategory === cat
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Grid */}
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((tpl) => {
                const isSelected = selectedTemplate.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-4 relative group ${
                      isSelected
                        ? 'bg-indigo-950/50 border-indigo-500 shadow-xl shadow-indigo-950/60 text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    {/* Header preview gradient badge */}
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

                      {/* Visual Mini Banner */}
                      <div
                        className={`h-20 rounded-xl bg-gradient-to-br ${tpl.previewGradient} border border-white/10 p-3 flex flex-col justify-end shadow-inner relative overflow-hidden`}
                      >
                        <div className="absolute top-2 right-2 text-[10px] font-mono text-white/50 uppercase">
                          {tpl.config.coverStyle}
                        </div>
                        <h4 className="text-sm font-bold text-white font-playfair drop-shadow-sm">
                          {tpl.name}
                        </h4>
                        <span className="text-[10px] text-slate-300 font-mono">
                          Category: {tpl.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>

                    {/* Bottom Specs & Action */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 text-slate-400 font-mono">
                        <span>{tpl.config.columns} Col</span>
                        <span>•</span>
                        <span>{tpl.config.margins} Margin</span>
                      </div>

                      <button
                        className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1 transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-300 group-hover:bg-indigo-900 group-hover:text-indigo-200'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{isSelected ? 'Applied' : 'Apply Layout'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: COLOR THEMES */}
        {activeTab === 'THEMES' && (
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COLOR_THEME_LIBRARY.map((theme) => {
              const isActive = customization.accentColor === theme.accentColor;
              return (
                <div
                  key={theme.id}
                  onClick={() => handleApplyColorTheme(theme.id)}
                  className={`p-5 rounded-2xl border transition cursor-pointer space-y-4 ${
                    isActive
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider bg-indigo-950/60 border border-indigo-800/50 px-2 py-0.5 rounded">
                      {theme.badge}
                    </span>
                    {isActive && (
                      <span className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Active Theme
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white">{theme.name}</h4>

                  {/* Color Swatch Bar */}
                  <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <div
                      className="h-8 rounded-lg flex items-center justify-center text-[10px] font-mono text-white font-bold shadow"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      Accent
                    </div>
                    <div
                      className="h-8 rounded-lg flex items-center justify-center text-[10px] font-mono text-white font-bold shadow"
                      style={{ backgroundColor: theme.headingColor }}
                    >
                      Header
                    </div>
                    <div
                      className="h-8 rounded-lg flex items-center justify-center text-[10px] font-mono text-white font-bold shadow"
                      style={{ backgroundColor: theme.bodyColor }}
                    >
                      Body
                    </div>
                    <div
                      className="h-8 rounded-lg flex items-center justify-center text-[10px] font-mono text-slate-700 font-bold shadow border"
                      style={{ backgroundColor: theme.cardBgColor, borderColor: theme.borderColor }}
                    >
                      Card
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    Automatically recolors headings, callout boxes, tables, dividers, header, and footer.
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: TYPOGRAPHY PRESETS */}
        {activeTab === 'TYPOGRAPHY' && (
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {TYPOGRAPHY_PRESETS.map((typo) => {
              const isActive = customization.fontFamily === typo.fontFamily;
              return (
                <div
                  key={typo.id}
                  onClick={() => handleApplyTypography(typo.id)}
                  className={`p-5 rounded-2xl border transition cursor-pointer space-y-3 ${
                    isActive
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{typo.name}</h4>
                    {isActive && (
                      <span className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Active Typography
                      </span>
                    )}
                  </div>

                  {/* Typography Spec Box */}
                  <div className="p-4 bg-white text-slate-900 rounded-xl space-y-2 shadow-sm border border-slate-200">
                    <h5
                      className="text-lg font-bold border-b border-slate-200 pb-1"
                      style={{ fontFamily: typo.headingFontFamily }}
                    >
                      Publication Title ({typo.headingFontFamily})
                    </h5>
                    <p className="text-xs leading-relaxed" style={{ fontFamily: typo.fontFamily }}>
                      The quick brown fox jumps over the lazy dog. Publication quality academic layout with {typo.bodyFontSize}pt body font size and {typo.lineHeight} line height.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Title: {typo.titleFontSize}pt</span>
                    <span>Body: {typo.bodyFontSize}pt</span>
                    <span>Line Height: {typo.lineHeight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Selected Template: <strong className="text-white">{selectedTemplate.name}</strong> ({selectedTemplate.category})
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition"
          >
            Apply & Close Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
