import React, { useState } from 'react';
import {
  FileText,
  Type as TypeIcon,
  Columns,
  Palette,
  BookOpen,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  MoveUp,
  MoveDown,
  Quote,
  Table as TableIcon,
  AlignLeft,
  AlignRight,
  Sliders,
  Check,
  Globe,
  Download,
  Printer,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  LayoutGrid,
} from 'lucide-react';
import { DocumentData, DocumentSection, LayoutSettings, LanguageCode, CustomizationSettings } from '../types';
import { TemplateGalleryModal } from './TemplateGalleryModal';
import { PremiumTemplate } from '../data/templateLibrary';
import { SmartLayoutEngine, SmartLayoutConfig } from './SmartLayoutEngine';
import { FormattedContent } from './FormattedContent';
import { generateDownloadablePDF, triggerPrintDialog, exportAsDocxOrText } from './PDFExporter';

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
  const [activeTab, setActiveTab] = useState<'smart' | 'layout' | 'typography' | 'cover' | 'sections'>('smart');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(0.9); // Default mobile-friendly scale
  const [isExporting, setIsExporting] = useState<boolean>(false);

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
    accentColor: document.accentColor || '#2563eb',
    hasHeaderFooter: true,
    headerText: document.headerText || 'তামরীন একাডেমিক পাবলিকেশন',
    footerText: document.footerText || 'A4 Publication Grade Edition',
    marginSize: 'normal',
  });

  const isRTL = document.direction === 'rtl' || document.language === 'ar';
  const isBn = document.language === 'bn' || true; // Default Bengali experience

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

  return (
    <div className="flex flex-col min-h-screen bg-slate-200/80 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* ----------------- WORD RIBBON TOOLBAR ----------------- */}
      <div className="no-print sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm p-2 sm:p-3">
        <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
          {/* Top Row: Mode Toggles & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Mode Switcher Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('paper')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 min-h-[38px] touch-manipulation ${
                  viewMode === 'paper'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>ওয়ার্ড পেপার ভিউ</span>
              </button>
              <button
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 min-h-[38px] touch-manipulation ${
                  viewMode === 'edit'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>টেক্সট এডিটর</span>
              </button>
              <button
                onClick={() => setViewMode('settings')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 min-h-[38px] touch-manipulation ${
                  viewMode === 'settings'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>লেআউট টুলস</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 min-h-[40px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>টুল ও টেমপ্লেট গ্যালারি</span>
              </button>

              <button
                onClick={handleDownloadPDFClick}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition min-h-[40px] touch-manipulation active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'তৈরি হচ্ছে...' : 'ডাউনলোড পিডিএফ'}</span>
              </button>

              <button
                onClick={triggerPrintDialog}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="প্রিন্ট অথবা সেভ"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Ribbon: Formatting Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {/* Font Family Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <TypeIcon className="w-3.5 h-3.5 text-blue-600" />
              <select
                value={layoutSettings.primaryFont}
                onChange={(e) => {
                  const f = e.target.value;
                  setLayoutSettings((prev) => ({ ...prev, primaryFont: f }));
                  setDocument((prev) => ({ ...prev, primaryFont: f }));
                }}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="Noto Serif Bengali">নোটো সেফিপ (Noto Serif Bengali)</option>
                <option value="Hind Siliguri">হিন্দ শিলিগুড়ি (Hind Siliguri)</option>
                <option value="Tiro Bangla">তিরো বাংলা (Tiro Bangla)</option>
                <option value="Inter">ইন্টার (Inter Sans)</option>
                <option value="Playfair Display">প্লেফেয়ার (Playfair Display)</option>
              </select>
            </div>

            {/* Font Size Control */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 font-mono">
              <span className="text-[11px] font-bold text-slate-500">ফন্ট সাইজ:</span>
              <button
                onClick={() =>
                  setLayoutSettings((prev) => ({ ...prev, fontSize: Math.max(12, prev.fontSize - 1) }))
                }
                className="px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
              >
                -
              </button>
              <span className="font-bold text-blue-600 px-1">{layoutSettings.fontSize}pt</span>
              <button
                onClick={() =>
                  setLayoutSettings((prev) => ({ ...prev, fontSize: Math.min(24, prev.fontSize + 1) }))
                }
                className="px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
              >
                +
              </button>
            </div>

            {/* Column Layout Selector */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <Columns className="w-3.5 h-3.5 text-blue-600" />
              <button
                onClick={() => setLayoutSettings((prev) => ({ ...prev, columnCount: 1 }))}
                className={`px-2 py-0.5 rounded font-bold transition ${
                  layoutSettings.columnCount === 1 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                একক কলাম
              </button>
              <button
                onClick={() => setLayoutSettings((prev) => ({ ...prev, columnCount: 2 }))}
                className={`px-2 py-0.5 rounded font-bold transition ${
                  layoutSettings.columnCount === 2 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                দ্বৈত কলাম (IEEE)
              </button>
            </div>

            {/* Zoom / Scale factor for Mobile view */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 ml-auto">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => setZoomScale(0.65)}
                className={`px-2 py-0.5 rounded font-bold text-[11px] ${zoomScale === 0.65 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
              >
                মোবাইল ফিট
              </button>
              <button
                onClick={() => setZoomScale(0.85)}
                className={`px-2 py-0.5 rounded font-bold text-[11px] ${zoomScale === 0.85 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
              >
                ৮৫%
              </button>
              <button
                onClick={() => setZoomScale(1.0)}
                className={`px-2 py-0.5 rounded font-bold text-[11px] ${zoomScale === 1.0 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
              >
                ১০০%
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- MAIN DOCUMENT STAGE ----------------- */}
      <div className="flex-1 p-3 sm:p-6 overflow-y-auto flex flex-col items-center">
        {/* VIEW 1: WORD A4 PAPER VIEW */}
        {viewMode === 'paper' && (
          <div className="w-full flex flex-col items-center gap-8 py-4">
            {/* Document Title Banner */}
            <div className="no-print max-w-[794px] w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 font-mono">
                  {document.documentType} • A4 WORD PAPER CANVAS
                </span>
                <h2 className="font-extrabold text-blue-900 dark:text-blue-100 text-base sm:text-lg">
                  {document.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDFClick}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ডাউনলোড করুন</span>
                </button>
              </div>
            </div>

            {/* A4 Responsive Container with scale styling for Mobile */}
            <div
              className="a4-responsive-wrapper transition-all duration-300"
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'top center',
              }}
            >
              <div className="flex flex-col gap-10 items-center">
                {/* ----------------- PAGE 1: COVER PAGE ----------------- */}
                {document.hasCover && (
                  <div
                    id="pdf-cover-page"
                    className={`pdf-page-container a4-paper ${getFontFamilyClass(layoutSettings.primaryFont)} p-10 md:p-16 flex flex-col justify-between overflow-hidden relative`}
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                  >
                    {/* Decorative Header Border */}
                    <div
                      className="absolute top-0 left-0 right-0 h-3"
                      style={{ backgroundColor: layoutSettings.accentColor }}
                    />

                    {/* Top Publisher Brand */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-6 pt-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
                          style={{ backgroundColor: layoutSettings.accentColor }}
                        >
                          {document.title.charAt(0) || 'P'}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-widest text-slate-800">
                            {document.organization || 'তামরীন এআই পাবলিকেশন স্টুডিও'}
                          </h4>
                          <p className="text-[11px] text-slate-500">{document.date}</p>
                        </div>
                      </div>

                      <span
                        className="text-[10px] font-bold font-mono tracking-widest px-3 py-1 rounded-full text-white uppercase"
                        style={{ backgroundColor: layoutSettings.accentColor }}
                      >
                        {document.coverData?.badgeText || 'PUBLICATION GRADE EDITION'}
                      </span>
                    </div>

                    {/* Cover Center Content */}
                    <div className="my-12 space-y-6">
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
                        <p className="font-bold text-slate-900 text-sm">{document.author || 'তামরীন এআই পাবলিশার'}</p>
                        <p className="text-slate-500">{document.organization || 'জাতীয় শিক্ষাক্রম ও গবেষণা বোর্ড'}</p>
                      </div>
                      <div className="text-right font-mono text-[11px]">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold">
                          A4 PRINT FORMAT
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------- PAGE 2: TABLE OF CONTENTS & SUMMARY ----------------- */}
                {document.tableOfContents && document.tableOfContents.length > 0 && (
                  <div
                    className={`pdf-page-container a4-paper ${getFontFamilyClass(layoutSettings.primaryFont)} p-10 md:p-16 flex flex-col justify-between relative`}
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                  >
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

                {/* ----------------- PAGE 3+: CONTENT BODY (WORD A4 CANVAS) ----------------- */}
                <div
                  className={`pdf-page-container a4-paper ${getFontFamilyClass(layoutSettings.primaryFont)} p-10 md:p-16 flex flex-col justify-between relative`}
                  style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                >
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
                    {document.sections.map((sec, idx) => (
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

                        {/* Formatted Content Rendering (Converts Markdown stars & lists to styled HTML!) */}
                        <div
                          style={{
                            fontSize: `${layoutSettings.fontSize}px`,
                            lineHeight: layoutSettings.lineHeight,
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
        )}

        {/* VIEW 2: TEXT EDITOR MODE */}
        {viewMode === 'edit' && (
          <div className="w-full max-w-4xl space-y-6 py-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <span>ডকুমেন্ট শিরোনাম ও অধ্যায় সম্পাদনা</span>
                </h3>
                <button
                  onClick={handleAddSection}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 min-h-[40px] touch-manipulation"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন অধ্যায় যোগ করুন</span>
                </button>
              </div>

              {/* Title input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ডকুমেন্ট শিরোনাম:</label>
                <input
                  type="text"
                  value={document.title}
                  onChange={(e) => setDocument((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-extrabold text-base text-slate-900 dark:text-white min-h-[48px]"
                />
              </div>

              {/* Section list inputs */}
              <div className="space-y-6 pt-4">
                {document.sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-xs text-blue-600 font-mono">
                        অধ্যায় {idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 bg-white dark:bg-slate-800 rounded-lg text-slate-600 disabled:opacity-30"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(idx, 'down')}
                          disabled={idx === document.sections.length - 1}
                          className="p-1.5 bg-white dark:bg-slate-800 rounded-lg text-slate-600 disabled:opacity-30"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(sec.id)}
                          className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">হেডিং:</label>
                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) => handleUpdateSectionHeading(sec.id, e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">লেখা / মূল বিষয়বস্তু:</label>
                      <textarea
                        rows={6}
                        value={sec.content}
                        onChange={(e) => handleUpdateSectionContent(sec.id, e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-bengali resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: LAYOUT & TOOLS MODE */}
        {viewMode === 'settings' && (
          <div className="w-full max-w-4xl space-y-6 py-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b pb-3">
                <Sliders className="w-5 h-5 text-blue-600" />
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
