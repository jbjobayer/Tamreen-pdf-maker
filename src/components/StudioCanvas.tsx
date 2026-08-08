import React, { useState, useEffect, useRef } from 'react';
import {
  Type as TypeIcon,
  Columns,
  Sparkles,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Quote,
  Check,
  Download,
  Printer,
  Eye,
  Edit3,
  Sliders,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ArrowUpDown,
  Palette,
  Layers,
  BookOpen,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { DocumentData, DocumentSection, LayoutSettings, CustomizationSettings } from '../types';
import { TemplateGalleryModal } from './TemplateGalleryModal';
import { PremiumTemplate } from '../data/templateLibrary';
import { SmartLayoutEngine, SmartLayoutConfig } from './SmartLayoutEngine';
import { FormattedContent } from './FormattedContent';
import { generateDownloadablePDF, triggerPrintDialog } from './PDFExporter';

export interface DocumentStylePreset {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  description: string;
  badge: string;
  primaryFont: string;
  headingFont: string;
  fontSize: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  accentColor: string;
  headingColor: string;
  bodyColor: string;
  marginSize: 'compact' | 'normal' | 'wide';
  columnCount: 1 | 2;
  coverStyle?: 'minimalist' | 'ornate' | 'corporate' | 'academic' | 'islamic_manuscript' | 'hardcover';
  headerText?: string;
  footerText?: string;
}

export const DOCUMENT_STYLE_PRESETS: DocumentStylePreset[] = [
  {
    id: 'modern_academic',
    name: 'Modern Academic',
    nameBn: 'আধুনিক একাডেমিক',
    category: 'ACADEMIC',
    description: 'বিশ্ববিদ্যালয় ও গবেষণা সাময়িকীর জন্য মানসম্মত লেআউট ও ক্লাসিক টাইপোগ্রাফি',
    badge: 'OXFORD NAVY',
    primaryFont: 'Noto Serif Bengali',
    headingFont: 'Cinzel',
    fontSize: 14,
    lineHeight: 1.6,
    textAlign: 'justify',
    accentColor: '#1e40af',
    headingColor: '#172554',
    bodyColor: '#1e293b',
    marginSize: 'normal',
    columnCount: 1,
    coverStyle: 'academic',
    headerText: 'তামরীন একাডেমিক পাবলিকেশন',
    footerText: 'Academic Research Edition',
  },
  {
    id: 'simple_memo',
    name: 'Simple Memo',
    nameBn: 'সহজ মেমো / সারসংক্ষেপ',
    category: 'NOTE',
    description: 'অফিসিয়াল নির্দেশিকা, নীতি ও সংক্ষিপ্ত নোটিশের জন্য পরিষ্কার সানস-সেরিফ',
    badge: 'SLATE CLEAN',
    primaryFont: 'Hind Siliguri',
    headingFont: 'Hind Siliguri',
    fontSize: 12,
    lineHeight: 1.45,
    textAlign: 'left',
    accentColor: '#0f172a',
    headingColor: '#020617',
    bodyColor: '#334155',
    marginSize: 'compact',
    columnCount: 1,
    coverStyle: 'minimalist',
    headerText: 'অফিসিয়াল স্মারকপত্র',
    footerText: 'CONFIDENTIAL MEMO',
  },
  {
    id: 'islamic_manuscript',
    name: 'Islamic Manuscript',
    nameBn: 'ইসলামিক ম্যানুস্ক্রিপ্ট / কিতাব',
    category: 'ISLAMIC',
    description: 'হাদিস, তাফসির ও আরবি-বাংলা রাজকীয় ধ্রুপদী কিতাবের মার্জিত অলঙ্কৃত স্টাইল',
    badge: 'EMERALD & GOLD',
    primaryFont: 'Noto Naskh Arabic',
    headingFont: 'Tiro Bangla',
    fontSize: 16,
    lineHeight: 1.8,
    textAlign: 'justify',
    accentColor: '#065f46',
    headingColor: '#064e3b',
    bodyColor: '#0f172a',
    marginSize: 'wide',
    columnCount: 1,
    coverStyle: 'islamic_manuscript',
    headerText: 'আত্তামরীন ইসলামিক পাবলিকেশন',
    footerText: 'دار التمرين للطباعة والنشر',
  },
  {
    id: 'classic_book',
    name: 'Classic Book',
    nameBn: 'ক্লাসিক বুক / গ্রন্থ',
    category: 'BOOK',
    description: 'স্মারকগ্রন্থ, সাহিত্য ও প্রাতিষ্ঠানিক পুস্তকের জন্য প্লেফেয়ার টাইপোগ্রাফি',
    badge: 'WARM PARCHMENT',
    primaryFont: 'Playfair Display',
    headingFont: 'Playfair Display',
    fontSize: 13,
    lineHeight: 1.7,
    textAlign: 'justify',
    accentColor: '#78350f',
    headingColor: '#451a03',
    bodyColor: '#1c1917',
    marginSize: 'normal',
    columnCount: 1,
    coverStyle: 'hardcover',
    headerText: 'গ্রন্থ প্রকাশনা সিরিজ',
    footerText: 'Classic Library Edition',
  },
  {
    id: 'corporate_report',
    name: 'Corporate Report',
    nameBn: 'করপোরেট বিজনেস রিপোর্ট',
    category: 'BUSINESS',
    description: 'বাৎসরিক প্রতিবেদন, বাজার বিশ্লেষণ ও প্রফেশনাল তথ্যের দ্বৈত কলাম লেআউট',
    badge: 'CORPORATE BLUE',
    primaryFont: 'Hind Siliguri',
    headingFont: 'Cinzel',
    fontSize: 11.5,
    lineHeight: 1.5,
    textAlign: 'justify',
    accentColor: '#2563eb',
    headingColor: '#1e3a8a',
    bodyColor: '#1e293b',
    marginSize: 'compact',
    columnCount: 2,
    coverStyle: 'corporate',
    headerText: 'বার্ষিক করপোরেট প্রতিবেদন',
    footerText: 'Executive Summary Report',
  },
  {
    id: 'minimalist_handout',
    name: 'Minimalist Handout',
    nameBn: 'হ্যান্ডআউট / লেকচার শিট',
    category: 'MINIMAL',
    description: 'ক্লাস নোট, প্রশ্নপত্র ও শিক্ষার্থীদের স্টাডি গাইডের জন্য লাইট কমপ্যাক্ট ফরম্যাট',
    badge: 'MONOCHROME',
    primaryFont: 'Hind Siliguri',
    headingFont: 'Hind Siliguri',
    fontSize: 11,
    lineHeight: 1.4,
    textAlign: 'left',
    accentColor: '#374151',
    headingColor: '#111827',
    bodyColor: '#1f2937',
    marginSize: 'compact',
    columnCount: 1,
    coverStyle: 'minimalist',
    headerText: 'ক্লাস নোট ও লেকচার শিট',
    footerText: 'Student Handout Edition',
  },
];

interface StudioCanvasProps {
  document: DocumentData;
  setDocument: React.Dispatch<React.SetStateAction<DocumentData>>;
  onOpenAIAssistantForSection: (sectionId: string, currentText: string) => void;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  document,
  setDocument,
  onOpenAIAssistantForSection,
}) => {
  // Mode state: 'paper' (Word A4 Preview), 'edit' (Text Editor), 'settings' (Tools)
  const [viewMode, setViewMode] = useState<'paper' | 'edit' | 'settings'>('paper');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [activeStylePresetId, setActiveStylePresetId] = useState<string>('modern_academic');
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState<boolean>(false);

  // Auto-Scale Logic for Mobile Screen Fit
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState<number>(1);
  const [userZoom, setUserZoom] = useState<number | null>(null); // null means auto-fit

  // Smart Layout Engine Config State
  const [smartLayoutConfig, setSmartLayoutConfig] = useState<SmartLayoutConfig>({
    paradigm: 'academic',
    gridTemplate: 'equal_2col',
    gridGap: 20,
    cardStyle: 'bordered',
    fluidHeroSection: true,
    columnCount: document.columnCount || 1,
  });

  // Layout settings
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    pageFormat: document.pageFormat || 'A4',
    orientation: 'portrait',
    columnCount: document.columnCount || 1,
    primaryFont: document.primaryFont || 'Noto Serif Bengali',
    headingFont: document.primaryFont || 'Noto Serif Bengali',
    fontSize: 15,
    lineHeight: 1.6,
    textAlign: 'justify',
    accentColor: document.accentColor || '#2563eb',
    hasHeaderFooter: true,
    headerText: document.headerText || 'তামরীন একাডেমিক পাবলিকেশন',
    footerText: document.footerText || 'A4 Publication Grade Edition',
    marginSize: 'normal',
    titleFontSize: 30,
    chapterFontSize: 22,
    headingFontSize: 18,
    subHeadingFontSize: 16,
    bodyFontSize: 12,
    footnoteFontSize: 9,
    fontFamily: document.primaryFont || 'Noto Serif Bengali',
    bodyColor: '#1e293b',
    headingColor: '#0f172a',
    backgroundColor: '#ffffff',
    pageSize: 'A4',
    margins: 'normal',
    paragraphSpacing: 1.2,
    columns: document.columnCount || 1,
    pageNumberStyle: 'simple',
    showWatermark: true,
    watermarkText: 'At-Tamreen Academy',
    watermarkOpacity: 0.08,
  });

  const isRTL = document.direction === 'rtl' || document.language === 'ar';

  // Calculate Auto Scale on window resize or view change
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const targetWidth = 794; // A4 width @ 96 DPI
        if (containerWidth < targetWidth + 24) {
          const scale = Math.max(0.32, (containerWidth - 24) / targetWidth);
          setAutoScale(scale);
        } else {
          setAutoScale(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const currentScale = userZoom !== null ? userZoom : autoScale;

  // Font Helper Class
  const getFontFamilyClass = (fontName: string) => {
    switch (fontName) {
      case 'Noto Serif Bengali':
      case 'Tiro Bangla':
        return 'font-bengali-serif';
      case 'Hind Siliguri':
        return 'font-bengali-sans';
      case 'Playfair Display':
        return 'font-playfair';
      case 'Cinzel':
        return 'font-cinzel';
      case 'Noto Naskh Arabic':
        return 'font-arabic';
      case 'Space Mono':
        return 'font-mono-custom';
      default:
        return 'font-bengali';
    }
  };

  const handleSmartLayoutChange = (newConfig: SmartLayoutConfig) => {
    setSmartLayoutConfig(newConfig);
    if (newConfig.columnCount !== layoutSettings.columnCount) {
      setLayoutSettings((prev) => ({
        ...prev,
        columnCount: newConfig.columnCount,
      }));
    }
  };

  const handleApplyTemplate = (
    template: PremiumTemplate,
    updatedCustomization: CustomizationSettings,
    updatedDocPartial: Partial<DocumentData>
  ) => {
    setLayoutSettings((prev) => ({
      ...prev,
      primaryFont: updatedCustomization.fontFamily,
      accentColor: updatedCustomization.accentColor,
      columnCount: updatedCustomization.columns as any,
      headerText: updatedCustomization.headerText,
      footerText: updatedCustomization.footerText,
      marginSize: updatedCustomization.margins as any,
    }));

    setDocument((prev) => ({
      ...prev,
      ...updatedDocPartial,
      primaryFont: updatedCustomization.fontFamily,
      accentColor: updatedCustomization.accentColor,
      columnCount: updatedCustomization.columns as any,
      headerText: updatedCustomization.headerText,
      footerText: updatedCustomization.footerText,
    }));
  };

  const applyDocumentStylePreset = (preset: DocumentStylePreset) => {
    setActiveStylePresetId(preset.id);

    setLayoutSettings((prev) => ({
      ...prev,
      primaryFont: preset.primaryFont,
      headingFont: preset.headingFont,
      fontFamily: preset.primaryFont,
      headingFontFamily: preset.headingFont,
      fontSize: preset.fontSize,
      lineHeight: preset.lineHeight,
      textAlign: preset.textAlign,
      accentColor: preset.accentColor,
      headingColor: preset.headingColor,
      bodyColor: preset.bodyColor,
      marginSize: preset.marginSize,
      columnCount: preset.columnCount,
      columns: preset.columnCount,
      headerText: preset.headerText || prev.headerText,
      footerText: preset.footerText || prev.footerText,
    }));

    setDocument((prev) => ({
      ...prev,
      primaryFont: preset.primaryFont,
      accentColor: preset.accentColor,
      columnCount: preset.columnCount,
      headerText: preset.headerText || prev.headerText,
      footerText: preset.footerText || prev.footerText,
      coverData: prev.coverData
        ? {
            ...prev.coverData,
            coverStyle: preset.coverStyle || prev.coverData.coverStyle,
          }
        : prev.coverData,
    }));

    setIsStyleMenuOpen(false);
  };

  // Section Handlers
  const handleUpdateSectionHeading = (id: string, heading: string) => {
    setDocument((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => (sec.id === id ? { ...sec, heading } : sec)),
    }));
  };

  const handleUpdateSectionContent = (id: string, content: string) => {
    setDocument((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => (sec.id === id ? { ...sec, content } : sec)),
    }));
  };

  const handleAddSection = () => {
    const newSec: DocumentSection = {
      id: 'sec-' + Date.now(),
      heading: 'নতুন অধ্যায় / অনুচ্ছেদ',
      level: 1,
      content: 'এখানে আপনার অনুচ্ছেদের বিস্তারিত পয়েন্ট ও বিশ্লেষণ লিখুন...',
    };
    setDocument((prev) => ({
      ...prev,
      sections: [...prev.sections, newSec],
    }));
  };

  const handleDeleteSection = (id: string) => {
    setDocument((prev) => ({
      ...prev,
      sections: prev.sections.filter((sec) => sec.id !== id),
    }));
  };

  const handleMoveSection = (index: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= document.sections.length) return;

    const updated = [...document.sections];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setDocument((prev) => ({ ...prev, sections: updated }));
  };

  const handleDownloadPDFClick = async () => {
    setIsExporting(true);
    try {
      await generateDownloadablePDF(document.title);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // Page Count calculation for scaled container height
  const totalPages = (document.hasCover ? 1 : 0) + (document.tableOfContents && document.tableOfContents.length > 0 ? 1 : 0) + 1;
  const unscaledPageHeight = 1123; // 297mm @ 96dpi
  const pageGap = 40;
  const totalUnscaledHeight = totalPages * unscaledPageHeight + (totalPages - 1) * pageGap;
  const scaledContainerHeight = Math.ceil(totalUnscaledHeight * currentScale);

  return (
    <div className="flex flex-col min-h-screen neu-bg text-slate-800 dark:text-slate-100">
      {/* ----------------- NEUMORPHIC TOP TOOLBAR ----------------- */}
      <div className="no-print sticky top-0 z-30 neu-flat p-2.5 sm:p-4 rounded-b-3xl border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto flex flex-col gap-3">
          {/* Row 1: Mode Switcher & Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Neumorphic Mode Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-pressed">
              <button
                onClick={() => setViewMode('paper')}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 touch-manipulation ${
                  viewMode === 'paper'
                    ? 'neu-button text-blue-600 dark:text-blue-400 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4 text-amber-500" />
                <span>A4 পেপার ভিউ</span>
              </button>

              <button
                onClick={() => setViewMode('edit')}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 touch-manipulation ${
                  viewMode === 'edit'
                    ? 'neu-button text-blue-600 dark:text-blue-400 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Edit3 className="w-4 h-4 text-blue-500" />
                <span>টেক্সট এডিটর</span>
              </button>

              <button
                onClick={() => setViewMode('settings')}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 touch-manipulation ${
                  viewMode === 'settings'
                    ? 'neu-button text-blue-600 dark:text-blue-400 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4 text-purple-500" />
                <span className="hidden sm:inline">লেআউট ও ডিজাইন</span>
                <span className="sm:hidden">ডিজাইন</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Document Styles Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition neu-button ${
                    isStyleMenuOpen
                      ? 'text-blue-600 dark:text-blue-400 font-black border-blue-400/50 neu-pressed'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                  title="ডকুমেন্ট স্টাইল ও টেমপ্লেট নির্বাচন করুন"
                >
                  <Palette className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="font-extrabold hidden sm:inline">ডকুমেন্ট স্টাইল</span>
                  <span className="font-extrabold sm:hidden">স্টাইল</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isStyleMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Popover */}
                {isStyleMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsStyleMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 neu-card p-3 rounded-3xl z-50 shadow-2xl space-y-2 border border-slate-200/80 dark:border-slate-800/80 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600" />
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            ডকুমেন্ট স্টাইল প্রি-সেট (Document Styles)
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          {DOCUMENT_STYLE_PRESETS.length} টি স্টাইল
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {DOCUMENT_STYLE_PRESETS.map((preset) => {
                          const isActive = activeStylePresetId === preset.id;
                          return (
                            <button
                              key={preset.id}
                              onClick={() => applyDocumentStylePreset(preset)}
                              className={`w-full text-left p-3 rounded-2xl transition flex items-start justify-between gap-3 ${
                                isActive
                                  ? 'neu-pressed border border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/30'
                                  : 'neu-flat hover:bg-slate-100 dark:hover:bg-slate-800/50'
                              }`}
                            >
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: preset.accentColor }}
                                  />
                                  <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                                    {preset.nameBn}
                                  </span>
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                                    {preset.badge}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-snug">
                                  {preset.description}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                  <span>ফন্ট: {preset.primaryFont}</span>
                                  <span>•</span>
                                  <span>সাইজ: {preset.fontSize}pt</span>
                                </div>
                              </div>
                              {isActive && (
                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold neu-button text-purple-700 dark:text-purple-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>টেমপ্লেট গ্যালারি</span>
              </button>

              <button
                onClick={handleDownloadPDFClick}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black neu-primary-btn active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'তৈরি হচ্ছে...' : 'ডাউনলোড পিডিএফ'}</span>
              </button>

              <button
                onClick={triggerPrintDialog}
                className="p-2.5 rounded-2xl neu-button text-slate-700 dark:text-slate-200 flex items-center justify-center min-w-[40px]"
                title="প্রিন্ট করুন"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Row 2: Text Formatting Toolbar Strip (Text Alignment, Font Size, Line Spacing) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
            {/* Font Family Selector */}
            <div className="flex items-center gap-1.5 neu-pressed px-3 py-1.5 rounded-2xl">
              <TypeIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <select
                value={layoutSettings.primaryFont}
                onChange={(e) => {
                  const f = e.target.value;
                  setLayoutSettings((prev) => ({ ...prev, primaryFont: f }));
                  setDocument((prev) => ({ ...prev, primaryFont: f }));
                }}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="Noto Serif Bengali">নোটো সেফিপ (Noto Serif)</option>
                <option value="Hind Siliguri">হিন্দ শিলিগুড়ি (Hind Siliguri)</option>
                <option value="Tiro Bangla">তিরো বাংলা (Tiro Bangla)</option>
                <option value="Playfair Display">প্লেফেয়ার (Playfair Display)</option>
              </select>
            </div>

            {/* Font Size Control */}
            <div className="flex items-center gap-1.5 neu-pressed px-2.5 py-1 rounded-2xl">
              <span className="text-[11px] font-extrabold text-slate-500">ফন্ট সাইজ:</span>
              <button
                onClick={() =>
                  setLayoutSettings((prev) => ({ ...prev, fontSize: Math.max(10, prev.fontSize - 1) }))
                }
                className="w-6 h-6 rounded-lg neu-button flex items-center justify-center font-black text-slate-700 dark:text-slate-200 active:scale-95"
                title="সাইজ কমান"
              >
                -
              </button>
              <select
                value={layoutSettings.fontSize}
                onChange={(e) =>
                  setLayoutSettings((prev) => ({ ...prev, fontSize: Number(e.target.value) }))
                }
                className="bg-transparent font-extrabold text-blue-600 dark:text-blue-400 focus:outline-none cursor-pointer text-center text-xs"
              >
                {[10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28].map((size) => (
                  <option key={size} value={size}>
                    {size} pt
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  setLayoutSettings((prev) => ({ ...prev, fontSize: Math.min(32, prev.fontSize + 1) }))
                }
                className="w-6 h-6 rounded-lg neu-button flex items-center justify-center font-black text-slate-700 dark:text-slate-200 active:scale-95"
                title="সাইজ বাড়ান"
              >
                +
              </button>
            </div>

            {/* Text Alignment Controls */}
            <div className="flex items-center gap-1 neu-pressed p-1 rounded-2xl">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 px-1.5 hidden sm:inline">
                অ্যালাইনমেন্ট:
              </span>
              <button
                onClick={() => setLayoutSettings((prev) => ({ ...prev, textAlign: 'left' }))}
                className={`p-1.5 rounded-xl transition ${
                  layoutSettings.textAlign === 'left'
                    ? 'neu-button text-blue-600 dark:text-blue-400 font-black'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="বামে অ্যালাইন করুন (Left Align)"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutSettings((prev) => ({ ...prev, textAlign: 'center' }))}
                className={`p-1.5 rounded-xl transition ${
                  layoutSettings.textAlign === 'center'
                    ? 'neu-button text-blue-600 dark:text-blue-400 font-black'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="মাঝে অ্যালাইন করুন (Center Align)"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutSettings((prev) => ({ ...prev, textAlign: 'right' }))}
                className={`p-1.5 rounded-xl transition ${
                  layoutSettings.textAlign === 'right'
                    ? 'neu-button text-blue-600 dark:text-blue-400 font-black'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="ডানে অ্যালাইন করুন (Right Align)"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutSettings((prev) => ({ ...prev, textAlign: 'justify' }))}
                className={`p-1.5 rounded-xl transition ${
                  layoutSettings.textAlign === 'justify' || !layoutSettings.textAlign
                    ? 'neu-button text-blue-600 dark:text-blue-400 font-black'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="সমান / জাস্টিফাই অ্যালাইন করুন (Justify)"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>

            {/* Line Spacing / Line Height Control */}
            <div className="flex items-center gap-1.5 neu-pressed px-2.5 py-1 rounded-2xl">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-[11px] font-extrabold text-slate-500 hidden sm:inline">লাইন স্পেস:</span>
              <select
                value={layoutSettings.lineHeight}
                onChange={(e) =>
                  setLayoutSettings((prev) => ({ ...prev, lineHeight: Number(e.target.value) }))
                }
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value={1.2}>১.২ (টাইট)</option>
                <option value={1.4}>১.৪ (কমপ্যাক্ট)</option>
                <option value={1.6}>১.৬ (ডিফল্ট)</option>
                <option value={1.8}>১.৮ (খোলামেলা)</option>
                <option value={2.0}>২.০ (দ্বিগুণ)</option>
              </select>
            </div>

            {/* Column Layout Switcher */}
            <div className="flex items-center gap-1 neu-pressed p-1 rounded-2xl">
              <button
                onClick={() => setLayoutSettings((prev) => ({ ...prev, columnCount: 1 }))}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                  layoutSettings.columnCount === 1 ? 'neu-button text-blue-600 font-extrabold' : 'text-slate-500'
                }`}
              >
                ১ কলাম
              </button>
              <button
                onClick={() => setLayoutSettings((prev) => ({ ...prev, columnCount: 2 }))}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                  layoutSettings.columnCount === 2 ? 'neu-button text-blue-600 font-extrabold' : 'text-slate-500'
                }`}
              >
                ২ কলাম (IEEE)
              </button>
            </div>

            {/* Scale / Zoom Control for Mobile Screen Fit */}
            <div className="flex items-center gap-1 neu-pressed p-1 rounded-2xl ml-auto">
              <button
                onClick={() => setUserZoom(null)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                  userZoom === null ? 'neu-button text-blue-600 font-extrabold' : 'text-slate-500'
                }`}
                title="স্ক্রিনে সম্পূর্ণ পেপার ফিট করুন"
              >
                ফিট ({(autoScale * 100).toFixed(0)}%)
              </button>
              <button
                onClick={() => setUserZoom(0.85)}
                className={`px-2 py-1 rounded-xl text-[11px] font-bold transition ${
                  userZoom === 0.85 ? 'neu-button text-blue-600 font-extrabold' : 'text-slate-500'
                }`}
              >
                ৮৫%
              </button>
              <button
                onClick={() => setUserZoom(1.0)}
                className={`px-2 py-1 rounded-xl text-[11px] font-bold transition ${
                  userZoom === 1.0 ? 'neu-button text-blue-600 font-extrabold' : 'text-slate-500'
                }`}
              >
                ১০০%
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- MAIN DOCUMENT STAGE ----------------- */}
      <div className="flex-1 p-2 sm:p-6 overflow-y-auto flex flex-col items-center">
        {/* VIEW 1: A4 WORD PAPER VIEW (MOBILE SCALED) */}
        {viewMode === 'paper' && (
          <div className="w-full flex flex-col items-center gap-6 py-2">
            {/* Neumorphic Document Info Card */}
            <div className="no-print w-full max-w-2xl neu-card p-4 rounded-3xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {document.documentType || 'A4 PUBLICATION'} • A4 WORD PAPER CANVAS
                </span>
                <h2 className="font-black text-slate-900 dark:text-white text-sm sm:text-base line-clamp-1">
                  {document.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDFClick}
                  disabled={isExporting}
                  className="px-3.5 py-1.5 rounded-xl neu-primary-btn text-xs font-black flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'তৈরি হচ্ছে...' : 'ডাউনলোড'}</span>
                </button>
              </div>
            </div>

            {/* Dynamic Scaled Container Wrapper - 100% Mobile Screen Fit without cutoff */}
            <div ref={containerRef} className="w-full flex justify-center items-center overflow-x-hidden py-2">
              <div
                style={{
                  width: `${794 * currentScale}px`,
                  height: `${scaledContainerHeight}px`,
                  position: 'relative',
                }}
                className="transition-all duration-200"
              >
                <div
                  style={{
                    width: '794px',
                    transform: `scale(${currentScale})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                  className="flex flex-col gap-10 items-center"
                >
                  {/* ----------------- PAGE 1: COVER PAGE ----------------- */}
                  {document.hasCover && (
                    <div
                      id="pdf-cover-page"
                      className={`pdf-page-container a4-paper ${getFontFamilyClass(layoutSettings.primaryFont)} p-10 md:p-16 flex flex-col justify-between overflow-hidden relative border border-slate-300 rounded-sm`}
                      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    >
                      {/* Light Watermark Overlay */}
                      {layoutSettings.showWatermark && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden">
                          <div
                            className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-widest text-center transform -rotate-30 uppercase select-none font-sans"
                            style={{
                              color: '#1e293b',
                              opacity: layoutSettings.watermarkOpacity ?? 0.08,
                            }}
                          >
                            {layoutSettings.watermarkText || 'At-Tamreen Academy'}
                          </div>
                        </div>
                      )}

                      {/* Decorative Header Border */}
                      <div
                        className="absolute top-0 left-0 right-0 h-3.5"
                        style={{ backgroundColor: layoutSettings.accentColor }}
                      />

                      {/* Top Publisher Brand */}
                      <div className="flex items-center justify-between border-b border-slate-200 pb-6 pt-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-md"
                            style={{ backgroundColor: layoutSettings.accentColor }}
                          >
                            {document.title.charAt(0) || 'P'}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs uppercase tracking-widest text-slate-900">
                              {document.organization || 'তামরীন এআই পাবলিকেশন স্টুডিও'}
                            </h4>
                            <p className="text-[11px] text-slate-500">{document.date}</p>
                          </div>
                        </div>

                        <span
                          className="text-[10px] font-black tracking-widest px-3 py-1 rounded-full text-white uppercase"
                          style={{ backgroundColor: layoutSettings.accentColor }}
                        >
                          {document.coverData?.badgeText || 'PUBLICATION GRADE EDITION'}
                        </span>
                      </div>

                      {/* Cover Center Content */}
                      <div className="my-10 space-y-6">
                        <h1
                          className="font-extrabold text-3xl md:text-5xl leading-snug tracking-tight"
                          style={{ color: layoutSettings.accentColor }}
                        >
                          {document.coverData?.coverTitle || document.title}
                        </h1>

                        {(document.coverData?.coverSubtitle || document.subtitle) && (
                          <p className="text-lg md:text-xl text-slate-600 font-serif italic max-w-2xl leading-relaxed">
                            {document.coverData?.coverSubtitle || document.subtitle}
                          </p>
                        )}

                        <div
                          className="w-20 h-1.5 rounded-full my-6"
                          style={{ backgroundColor: layoutSettings.accentColor }}
                        />

                        {/* Abstract / Overview Callout Box */}
                        <div
                          className="p-6 bg-slate-50/90 border-l-4 rounded-r-2xl my-6 shadow-sm"
                          style={{ borderColor: layoutSettings.accentColor }}
                        >
                          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 block mb-1">
                            সারসংক্ষেপ ও ভূমিকা (Executive Overview)
                          </span>
                          <p className="text-sm text-slate-700 leading-relaxed italic">
                            {document.coverData?.abstract ||
                              'এই ডকুমেন্টে বিস্তারিত তত্ত্বীয় আলোচনা, পরীক্ষাভিত্তিক প্রশ্নোত্তর ও আন্তর্জাতিক মানদণ্ডের সাইটেশন সুবিন্যস্তভাবে সাজানো হয়েছে।'}
                          </p>
                        </div>
                      </div>

                      {/* Cover Footer */}
                      <div className="border-t border-slate-200 pt-6 flex items-end justify-between text-xs text-slate-600">
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{document.author || 'তামরীন এআই পাবলিশার'}</p>
                          <p className="text-slate-500">{document.organization || 'জাতীয় শিক্ষাক্রম ও গবেষণা বোর্ড'}</p>
                        </div>
                        <div className="text-right font-mono text-[11px]">
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-800 font-bold">
                            A4 PRINT FORMAT
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ----------------- PAGE 2: TABLE OF CONTENTS ----------------- */}
                  {document.tableOfContents && document.tableOfContents.length > 0 && (
                    <div
                      className={`pdf-page-container a4-paper ${getFontFamilyClass(layoutSettings.primaryFont)} p-10 md:p-16 flex flex-col justify-between relative border border-slate-300 rounded-sm overflow-hidden`}
                      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    >
                      {/* Light Watermark Overlay */}
                      {layoutSettings.showWatermark && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden">
                          <div
                            className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-widest text-center transform -rotate-30 uppercase select-none font-sans"
                            style={{
                              color: '#1e293b',
                              opacity: layoutSettings.watermarkOpacity ?? 0.08,
                            }}
                          >
                            {layoutSettings.watermarkText || 'At-Tamreen Academy'}
                          </div>
                        </div>
                      )}

                      {/* Header */}
                      <div className="border-b border-slate-200 pb-3 flex justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        <span>{layoutSettings.headerText}</span>
                        <span>পৃষ্ঠা ২</span>
                      </div>

                      {/* TOC Body */}
                      <div className="my-8 flex-1 space-y-6">
                        <div className="border-b-2 border-slate-900 pb-3">
                          <h2
                            className="font-extrabold text-2xl tracking-tight"
                            style={{ color: layoutSettings.accentColor }}
                          >
                            সূচিপত্র ও বিষয়সূচি (Table of Contents)
                          </h2>
                        </div>

                        <div className="space-y-4">
                          {document.tableOfContents.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-baseline justify-between gap-4 border-b border-dotted border-slate-300 pb-2.5"
                            >
                              <span className="font-bold text-sm text-slate-800">{item.title}</span>
                              <span className="font-mono text-xs text-slate-500">পৃষ্ঠা {item.page}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-slate-200 pt-3 flex justify-between text-[11px] font-mono text-slate-400 uppercase">
                        <span>{layoutSettings.footerText}</span>
                        <span>তামরীন অফিশিয়াল এডিশন</span>
                      </div>
                    </div>
                  )}

                  {/* ----------------- PAGE 3+: CONTENT BODY (A4 CANVAS) ----------------- */}
                  <div
                    className={`pdf-page-container a4-paper ${getFontFamilyClass(layoutSettings.primaryFont)} p-10 md:p-16 flex flex-col justify-between relative border border-slate-300 rounded-sm overflow-hidden`}
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                  >
                    {/* Light Watermark Overlay */}
                    {layoutSettings.showWatermark && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden">
                        <div
                          className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-widest text-center transform -rotate-30 uppercase select-none font-sans"
                          style={{
                            color: '#1e293b',
                            opacity: layoutSettings.watermarkOpacity ?? 0.08,
                          }}
                        >
                          {layoutSettings.watermarkText || 'At-Tamreen Academy'}
                        </div>
                      </div>
                    )}

                    {/* Running Header */}
                    <div className="border-b border-slate-200 pb-3 flex justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      <span>{document.title}</span>
                      <span>A4 PAPER CANVAS</span>
                    </div>

                    {/* Body Content Sections */}
                    <div
                      className={`my-8 flex-1 space-y-8 ${
                        layoutSettings.columnCount === 2 ? 'columns-1 md:columns-2 gap-8' : 'space-y-8'
                      }`}
                    >
                      {document.sections.map((sec) => (
                        <div
                          key={sec.id}
                          className="break-inside-avoid space-y-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm relative group"
                        >
                          {/* Section Heading */}
                          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                            <h2
                              className="font-extrabold text-xl md:text-2xl tracking-tight leading-snug"
                              style={{ color: layoutSettings.accentColor }}
                            >
                              {sec.heading}
                            </h2>
                            <button
                              onClick={() => onOpenAIAssistantForSection(sec.id, sec.content)}
                              className="no-print opacity-80 hover:opacity-100 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold flex items-center gap-1 transition"
                            >
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              <span>এআই এডিট</span>
                            </button>
                          </div>

                          {/* Formatted Content Rendering */}
                          <div
                            style={{
                              fontSize: `${layoutSettings.fontSize}px`,
                              lineHeight: layoutSettings.lineHeight,
                              textAlign: layoutSettings.textAlign || 'justify',
                            }}
                          >
                            <FormattedContent
                              content={sec.content}
                              accentColor={layoutSettings.accentColor}
                            />
                          </div>

                          {/* Callout Box */}
                          {sec.callout && (
                            <div
                              className="p-4 rounded-xl bg-slate-50 border-l-4 my-4 shadow-sm"
                              style={{ borderColor: layoutSettings.accentColor }}
                            >
                              {sec.callout.title && (
                                <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                                  <Quote className="w-3.5 h-3.5 text-blue-600" />
                                  <span>{sec.callout.title}</span>
                                </div>
                              )}
                              <p className="text-xs text-slate-800 leading-relaxed font-serif italic">
                                {sec.callout.text}
                              </p>
                            </div>
                          )}

                          {/* MCQ Questions Rendering */}
                          {sec.mcqs && sec.mcqs.length > 0 && (
                            <div className="my-6 space-y-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-700 flex items-center gap-2">
                                  <Check className="w-4 h-4 text-emerald-600" />
                                  <span>বহুনির্বাচনী প্রশ্ন ব্যাংক ({sec.mcqs.length}টি প্রশ্ন)</span>
                                </span>
                              </div>

                              <div className="space-y-4">
                                {sec.mcqs.map((q, qIdx) => (
                                  <div key={q.id || qIdx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-sm">
                                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                                      <span className="text-blue-600 font-extrabold mr-1.5">
                                        প্রশ্ন {q.questionNumber || qIdx + 1}.
                                      </span>
                                      {q.question}
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                      {q.options.map((opt) => {
                                        const isCorrect = opt.key === q.correctAnswer;
                                        return (
                                          <div
                                            key={opt.key}
                                            className={`p-2.5 rounded-lg border flex items-start gap-2.5 transition ${
                                              isCorrect
                                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                                                : 'bg-slate-50 border-slate-200 text-slate-700'
                                            }`}
                                          >
                                            <span
                                              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                                isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                              }`}
                                            >
                                              {opt.key}
                                            </span>
                                            <span className="text-xs pt-0.5">{opt.text}</span>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {q.explanation && (
                                      <div className="mt-2 p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-xs space-y-1">
                                        <span className="font-bold text-blue-900 text-[11px] uppercase tracking-wider block">
                                          উত্তরের ব্যাখ্যা:
                                        </span>
                                        <p className="text-blue-950 leading-relaxed text-[11px]">{q.explanation}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Document References */}
                      {document.references && document.references.length > 0 && (
                        <div className="pt-6 border-t-2 border-slate-200 space-y-2">
                          <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                            রেফারেন্স ও তথ্যসূত্র (References)
                          </h4>
                          <ol className="list-decimal pl-5 text-xs text-slate-600 space-y-1">
                            {document.references.map((ref, rIdx) => (
                              <li key={rIdx}>{ref}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 pt-3 flex justify-between text-[11px] font-mono text-slate-400 uppercase">
                      <span>{layoutSettings.footerText}</span>
                      <span>পৃষ্ঠা ৩</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TEXT EDITOR MODE (NEUMORPHIC STYLE) */}
        {viewMode === 'edit' && (
          <div className="w-full max-w-4xl space-y-6 py-4 animate-in fade-in">
            <div className="neu-card p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>ডকুমেন্ট শিরোনাম ও অধ্যায় সম্পাদনা</span>
                </h3>
                <button
                  onClick={handleAddSection}
                  className="px-4 py-2.5 neu-primary-btn text-xs font-black rounded-2xl flex items-center gap-1.5 min-h-[40px] touch-manipulation"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন অধ্যায়</span>
                </button>
              </div>

              {/* Title input */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  ডকুমেন্ট শিরোনাম:
                </label>
                <input
                  type="text"
                  value={document.title}
                  onChange={(e) => setDocument((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3.5 rounded-2xl neu-input font-black text-base text-slate-900 dark:text-white min-h-[48px]"
                />
              </div>

              {/* Section list inputs */}
              <div className="space-y-6 pt-2">
                {document.sections.map((sec, idx) => (
                  <div key={sec.id} className="p-5 rounded-2xl neu-flat space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-xs text-blue-600 dark:text-blue-400 font-mono">
                        অধ্যায় {idx + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleMoveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 neu-button rounded-xl text-slate-600 dark:text-slate-300 disabled:opacity-30"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(idx, 'down')}
                          disabled={idx === document.sections.length - 1}
                          className="p-1.5 neu-button rounded-xl text-slate-600 dark:text-slate-300 disabled:opacity-30"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(sec.id)}
                          className="p-1.5 neu-button rounded-xl text-rose-600 hover:text-rose-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400">হেডিং:</label>
                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) => handleUpdateSectionHeading(sec.id, e.target.value)}
                        className="w-full p-3 rounded-xl neu-input font-bold text-sm text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400">লেখা / মূল বিষয়বস্তু:</label>
                      <textarea
                        rows={6}
                        value={sec.content}
                        onChange={(e) => handleUpdateSectionContent(sec.id, e.target.value)}
                        style={{
                          fontSize: `${Math.max(12, layoutSettings.fontSize - 1)}px`,
                          lineHeight: layoutSettings.lineHeight,
                          textAlign: layoutSettings.textAlign === 'justify' ? 'left' : layoutSettings.textAlign || 'left',
                        }}
                        className="w-full p-3.5 rounded-xl neu-input text-slate-800 dark:text-slate-200 leading-relaxed font-bengali resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: LAYOUT & TOOLS MODE (NEUMORPHIC STYLE) */}
        {viewMode === 'settings' && (
          <div className="w-full max-w-4xl space-y-6 py-4 animate-in fade-in">
            {/* Predefined Document Styles Card */}
            <div className="neu-card p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      ডকুমেন্ট স্টাইল ও টেমপ্লেট গ্যালারি (Document Styles)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      এক ক্লিকে আপনার ডকুমেন্টের ফন্ট ফ্যামিলি, হেডিং, লাইন স্পেসিং ও কালার স্কিম পরিবর্তন করুন।
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DOCUMENT_STYLE_PRESETS.map((preset) => {
                  const isActive = activeStylePresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => applyDocumentStylePreset(preset)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between space-y-3 relative group ${
                        isActive
                          ? 'neu-pressed border-2 border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 shadow-md'
                          : 'neu-flat hover:translate-y-[-2px]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold text-white"
                            style={{ backgroundColor: preset.accentColor }}
                          >
                            {preset.badge}
                          </span>
                          {isActive && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> সক্রিয়
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {preset.nameBn}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            {preset.name}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {preset.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600 dark:text-slate-300">
                          ফন্ট: {preset.primaryFont}
                        </span>
                        <button
                          type="button"
                          className={`px-3 py-1 rounded-xl text-xs font-black transition ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'neu-button text-slate-700 dark:text-slate-200 group-hover:text-blue-600'
                          }`}
                        >
                          {isActive ? 'সক্রিয় স্টাইল' : 'স্টাইল প্রয়োগ'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Watermark & Export Page Settings Card */}
            <div className="neu-card p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      পিডিএফ ওয়াটারমার্ক ও পেজ ব্র্যান্ডিং (PDF Watermark Settings)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      এক্সপোর্ট করা পিডিএফ পেজে 'At-Tamreen Academy' লাইট ওয়াটারমার্ক যোগ বা কাস্টমাইজ করুন।
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Watermark Toggle */}
                <div className="flex items-center justify-between p-4.5 rounded-2xl neu-flat">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                      পিডিএফ ওয়াটারমার্ক চালু (Enable Watermark)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      পিডিএফের পেছনে হালকা ওয়াটারমার্ক ব্র্যান্ডিং দেখাবে
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                    <input
                      type="checkbox"
                      checked={layoutSettings.showWatermark}
                      onChange={(e) =>
                        setLayoutSettings((prev) => ({ ...prev, showWatermark: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Watermark Text Input */}
                <div className="space-y-1.5 p-4.5 rounded-2xl neu-flat">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    ওয়াটারমার্ক টেক্সট (Watermark Text):
                  </label>
                  <input
                    type="text"
                    disabled={!layoutSettings.showWatermark}
                    value={layoutSettings.watermarkText}
                    onChange={(e) =>
                      setLayoutSettings((prev) => ({ ...prev, watermarkText: e.target.value }))
                    }
                    className="w-full p-2.5 rounded-xl neu-input font-bold text-xs text-slate-900 dark:text-white disabled:opacity-40"
                    placeholder="At-Tamreen Academy"
                  />
                </div>
              </div>

              {/* Watermark Opacity Presets */}
              {layoutSettings.showWatermark && (
                <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    ওয়াটারমার্ক গাঢ়তা (Watermark Opacity):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setLayoutSettings((prev) => ({ ...prev, watermarkOpacity: 0.05 }))}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        layoutSettings.watermarkOpacity === 0.05
                          ? 'neu-button text-blue-600 dark:text-blue-400 font-black'
                          : 'neu-flat text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      খুবই হালকা (5%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutSettings((prev) => ({ ...prev, watermarkOpacity: 0.08 }))}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        layoutSettings.watermarkOpacity === 0.08
                          ? 'neu-button text-blue-600 dark:text-blue-400 font-black'
                          : 'neu-flat text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      স্ট্যান্ডার্ড (8% - ডিফল্ট)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutSettings((prev) => ({ ...prev, watermarkOpacity: 0.14 }))}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        layoutSettings.watermarkOpacity === 0.14
                          ? 'neu-button text-blue-600 dark:text-blue-400 font-black'
                          : 'neu-flat text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      স্পষ্ট (14%)
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="neu-card p-6 sm:p-8 rounded-3xl space-y-6">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>স্মার্ট লেআউট ও ডিজাইন অপশন</span>
              </h3>

              <SmartLayoutEngine
                config={smartLayoutConfig}
                onChangeConfig={handleSmartLayoutChange}
                isOpen={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Mobile Action Dock */}
      <div className="no-print sm:hidden fixed bottom-16 left-3 right-3 z-40 p-2.5 neu-card rounded-2xl backdrop-blur-md flex items-center justify-around gap-2">
        <button
          onClick={() => setViewMode(viewMode === 'paper' ? 'edit' : 'paper')}
          className="flex-1 py-2 px-3 neu-button rounded-xl text-xs font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5"
        >
          {viewMode === 'paper' ? <Edit3 className="w-4 h-4 text-blue-500" /> : <Eye className="w-4 h-4 text-amber-500" />}
          <span>{viewMode === 'paper' ? 'এডিটর' : 'পেপার ভিউ'}</span>
        </button>

        <button
          onClick={handleDownloadPDFClick}
          disabled={isExporting}
          className="flex-1 py-2 px-3 neu-primary-btn rounded-xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? '...' : 'ডাউনলোড'}</span>
        </button>

        <button
          onClick={() => setUserZoom(userZoom === null ? 1.0 : null)}
          className="p-2 neu-button rounded-xl text-slate-700 dark:text-slate-200 flex items-center justify-center"
          title="জুম টগল"
        >
          <Maximize2 className="w-4 h-4 text-blue-600" />
        </button>
      </div>

      {/* Template Marketplace Modal */}
      {isTemplateModalOpen && (
        <TemplateGalleryModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onSelectTemplate={handleApplyTemplate}
          currentCustomization={{
            templateId: 'modern_minimalist',
            fontFamily: layoutSettings.primaryFont,
            fontSize: layoutSettings.fontSize,
            lineHeight: layoutSettings.lineHeight,
            accentColor: layoutSettings.accentColor,
            headerText: layoutSettings.headerText,
            footerText: layoutSettings.footerText,
            hasCoverPage: document.hasCover,
            coverStyle: 'academic',
            hasTableOfContents: true,
            columns: layoutSettings.columnCount,
            margins: 'normal',
            pageSize: 'A4',
          }}
        />
      )}
    </div>
  );
};
