import React, { useState } from 'react';
import {
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
  FileText,
  Sliders,
  Check,
  Globe,
  ImageIcon,
} from 'lucide-react';
import { DocumentData, DocumentSection, LayoutSettings, LanguageCode } from '../types';

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
  const [activeTab, setActiveTab] = useState<'layout' | 'typography' | 'cover' | 'sections'>('layout');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Layout settings
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    pageFormat: document.pageFormat || 'A4',
    orientation: 'portrait',
    columnCount: document.columnCount || 1,
    primaryFont: document.primaryFont || 'Inter',
    headingFont: document.primaryFont || 'Inter',
    fontSize: 15,
    lineHeight: 1.6,
    accentColor: document.accentColor || '#0d9488',
    hasHeaderFooter: true,
    headerText: document.headerText || 'ACADEMIC PUBLICATION',
    footerText: document.footerText || 'AI PDF Studio Edition',
    marginSize: 'normal',
  });

  // Font Helper Class
  const getFontFamilyClass = (fontName: string) => {
    switch (fontName) {
      case 'Playfair Display':
        return 'font-playfair';
      case 'Cinzel':
        return 'font-cinzel';
      case 'Noto Serif Bengali':
        return 'font-bengali';
      case 'Noto Naskh Arabic':
        return 'font-arabic';
      case 'Space Mono':
        return 'font-mono-custom';
      default:
        return 'font-inter';
    }
  };

  const isRTL = document.direction === 'rtl' || document.language === 'ar';

  // Section Management
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
      heading: 'New Publication Section',
      level: 1,
      content: 'Write or generate new academic content for this section...',
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

  // Toggle Language / Direction
  const toggleDirection = () => {
    const nextDir = isRTL ? 'ltr' : 'rtl';
    const nextLang: LanguageCode = nextDir === 'rtl' ? 'ar' : 'en';
    const nextFont = nextDir === 'rtl' ? 'Noto Naskh Arabic' : 'Inter';

    setDocument((prev) => ({
      ...prev,
      direction: nextDir,
      language: nextLang,
      primaryFont: nextFont,
    }));
    setLayoutSettings((prev) => ({ ...prev, primaryFont: nextFont }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-65px)] bg-slate-950 text-slate-100">
      {/* Left InDesign Studio Sidebar */}
      <div
        className={`no-print bg-slate-900/90 border-r border-slate-800 transition-all duration-300 flex flex-col shrink-0 ${
          sidebarOpen ? 'w-full lg:w-80' : 'w-full lg:w-16'
        }`}
      >
        {/* Sidebar Header & Toggle */}
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span className="font-playfair font-semibold text-sm text-white">
                InDesign Studio Tools
              </span>
            </div>
          ) : (
            <Sliders className="w-5 h-5 text-teal-400 mx-auto" />
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition hidden lg:flex"
            title="Toggle Studio Toolbar"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
            {/* Tool Category Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-medium">
              <button
                onClick={() => setActiveTab('layout')}
                className={`py-1.5 rounded transition ${
                  activeTab === 'layout' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Layout
              </button>
              <button
                onClick={() => setActiveTab('typography')}
                className={`py-1.5 rounded transition ${
                  activeTab === 'typography' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Type
              </button>
              <button
                onClick={() => setActiveTab('cover')}
                className={`py-1.5 rounded transition ${
                  activeTab === 'cover' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cover
              </button>
              <button
                onClick={() => setActiveTab('sections')}
                className={`py-1.5 rounded transition ${
                  activeTab === 'sections' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pages
              </button>
            </div>

            {/* TAB 1: Layout & Columns */}
            {activeTab === 'layout' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-400 font-semibold block">Columns Layout</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((cols) => (
                      <button
                        key={cols}
                        onClick={() =>
                          setLayoutSettings((prev) => ({
                            ...prev,
                            columnCount: cols as 1 | 2 | 3,
                          }))
                        }
                        className={`p-2.5 rounded-lg border text-center font-mono font-medium transition ${
                          layoutSettings.columnCount === cols
                            ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {cols} Col
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-semibold block">Accent Color</label>
                  <div className="flex items-center gap-2">
                    {['#0d9488', '#047857', '#1e40af', '#9f1239', '#b45309', '#334155'].map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setLayoutSettings((prev) => ({ ...prev, accentColor: color }))
                        }
                        className={`w-7 h-7 rounded-full border-2 transition ${
                          layoutSettings.accentColor === color
                            ? 'border-white scale-110 shadow-lg'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-slate-400 font-semibold block">Text Direction (RTL / LTR)</label>
                  <button
                    onClick={toggleDirection}
                    className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isRTL ? 'Right-to-Left (Arabic)' : 'Left-to-Right (English/Bangla)'}</span>
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">
                      {isRTL ? 'RTL' : 'LTR'}
                    </span>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-semibold block">Running Header Text</label>
                  <input
                    type="text"
                    value={layoutSettings.headerText}
                    onChange={(e) =>
                      setLayoutSettings((prev) => ({ ...prev, headerText: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-semibold block">Running Footer Text</label>
                  <input
                    type="text"
                    value={layoutSettings.footerText}
                    onChange={(e) =>
                      setLayoutSettings((prev) => ({ ...prev, footerText: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Typography */}
            {activeTab === 'typography' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-400 font-semibold block">Primary Font Family</label>
                  <select
                    value={layoutSettings.primaryFont}
                    onChange={(e) => {
                      const f = e.target.value;
                      setLayoutSettings((prev) => ({ ...prev, primaryFont: f }));
                      setDocument((prev) => ({ ...prev, primaryFont: f }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Inter">Inter (Sans-Serif Clean)</option>
                    <option value="Playfair Display">Playfair Display (Serif Editorial)</option>
                    <option value="Cinzel">Cinzel (Classical Academic)</option>
                    <option value="Noto Serif Bengali">Noto Serif Bengali (বাংলা)</option>
                    <option value="Noto Naskh Arabic">Noto Naskh Arabic (العربية)</option>
                    <option value="Space Mono">Space Mono (Technical / Code)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <label className="font-semibold">Base Font Size</label>
                    <span className="font-mono text-teal-300">{layoutSettings.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={20}
                    step={1}
                    value={layoutSettings.fontSize}
                    onChange={(e) =>
                      setLayoutSettings((prev) => ({
                        ...prev,
                        fontSize: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-teal-400"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <label className="font-semibold">Line Spacing</label>
                    <span className="font-mono text-teal-300">{layoutSettings.lineHeight}</span>
                  </div>
                  <input
                    type="range"
                    min={1.2}
                    max={2.2}
                    step={0.1}
                    value={layoutSettings.lineHeight}
                    onChange={(e) =>
                      setLayoutSettings((prev) => ({
                        ...prev,
                        lineHeight: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-teal-400"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Cover Page Customizer */}
            {activeTab === 'cover' && (
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                  <input
                    type="checkbox"
                    checked={document.hasCover}
                    onChange={(e) =>
                      setDocument((prev) => ({ ...prev, hasCover: e.target.checked }))
                    }
                    className="rounded text-indigo-500"
                  />
                  <span>Enable Cover Page</span>
                </label>

                {document.hasCover && (
                  <>
                    <div className="space-y-2">
                      <label className="text-slate-400 font-semibold block">Cover Title</label>
                      <input
                        type="text"
                        value={document.coverData?.coverTitle || document.title}
                        onChange={(e) =>
                          setDocument((prev) => ({
                            ...prev,
                            coverData: {
                              ...(prev.coverData || { coverStyle: 'academic', coverTitle: '' }),
                              coverTitle: e.target.value,
                            },
                          }))
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 font-semibold block">Cover Style</label>
                      <select
                        value={document.coverData?.coverStyle || 'academic'}
                        onChange={(e) =>
                          setDocument((prev) => ({
                            ...prev,
                            coverData: {
                              ...(prev.coverData || { coverTitle: prev.title, coverStyle: 'academic' }),
                              coverStyle: e.target.value as any,
                            },
                          }))
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                      >
                        <option value="minimalist">Modern Minimalist</option>
                        <option value="academic">Academic Monograph</option>
                        <option value="islamic_manuscript">Islamic Manuscript Ornate</option>
                        <option value="corporate">Corporate Royal Blue</option>
                        <option value="ornate">Editorial Gold & Crimson</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 font-semibold block">Publisher Badge</label>
                      <input
                        type="text"
                        value={document.coverData?.badgeText || 'PEER REVIEWED EDITION'}
                        onChange={(e) =>
                          setDocument((prev) => ({
                            ...prev,
                            coverData: {
                              ...(prev.coverData || { coverTitle: prev.title, coverStyle: 'academic' }),
                              badgeText: e.target.value,
                            },
                          }))
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 4: Section Reordering */}
            {activeTab === 'sections' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Document Sections</span>
                  <button
                    onClick={handleAddSection}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-[11px] font-semibold text-white flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {document.sections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-2"
                    >
                      <span className="truncate text-slate-300 font-medium text-[11px]">
                        {idx + 1}. {sec.heading || 'Untitled Section'}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleMoveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-30"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(idx, 'down')}
                          disabled={idx === document.sections.length - 1}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-30"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(sec.id)}
                          className="p-1 hover:bg-rose-950/50 rounded text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Studio View (InDesign Page Stage) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950/80 flex flex-col items-center gap-8">
        {/* Document Header Banner */}
        <div className="no-print w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-slate-300">
              {document.documentType} • {layoutSettings.columnCount} Column • {layoutSettings.primaryFont}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Target Direction:</span>
            <span className="font-mono text-amber-300 uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
              {isRTL ? 'RTL (Arabic)' : 'LTR'}
            </span>
          </div>
        </div>

        {/* ----------------- PAGE 1: COVER PAGE ----------------- */}
        {document.hasCover && (
          <div
            id="pdf-cover-page"
            className={`pdf-page-container pdf-page-shadow w-full max-w-[794px] min-h-[1123px] bg-white text-slate-900 p-12 md:p-16 rounded-lg relative flex flex-col justify-between overflow-hidden transition-all ${getFontFamilyClass(
              layoutSettings.primaryFont
            )}`}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            {/* Background Accent Graphics */}
            <div
              className="absolute top-0 right-0 w-80 h-80 opacity-15 pointer-events-none rounded-bl-full"
              style={{ backgroundColor: layoutSettings.accentColor }}
            />
            <div
              className="absolute bottom-0 left-0 w-80 h-80 opacity-10 pointer-events-none rounded-tr-full"
              style={{ backgroundColor: layoutSettings.accentColor }}
            />

            {/* Top Badge & Publisher Info */}
            <div className="relative z-10 flex items-center justify-between border-b border-slate-200 pb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold font-serif text-lg"
                  style={{ backgroundColor: layoutSettings.accentColor }}
                >
                  {document.title.charAt(0) || 'P'}
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700">
                    {document.organization || 'ACADEMIC PUBLISHING STUDIO'}
                  </h4>
                  <p className="text-[10px] text-slate-500">{document.date}</p>
                </div>
              </div>

              <span
                className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full text-white uppercase font-semibold"
                style={{ backgroundColor: layoutSettings.accentColor }}
              >
                {document.coverData?.badgeText || 'PUBLICATION EDITION'}
              </span>
            </div>

            {/* Center Title & Subtitle */}
            <div className="relative z-10 my-12 space-y-6">
              <h1
                className="font-bold text-4xl md:text-5xl tracking-tight leading-tight text-slate-900"
                style={{ color: layoutSettings.accentColor }}
              >
                {document.coverData?.coverTitle || document.title}
              </h1>

              {(document.coverData?.coverSubtitle || document.subtitle) && (
                <p className="text-lg md:text-xl text-slate-600 font-serif italic max-w-2xl leading-relaxed">
                  {document.coverData?.coverSubtitle || document.subtitle}
                </p>
              )}

              {/* Decorative Frame Line */}
              <div
                className="w-24 h-1.5 rounded-full my-6"
                style={{ backgroundColor: layoutSettings.accentColor }}
              />

              {/* Optional Hero Image */}
              {document.coverData?.heroImageUrl && (
                <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 my-6 shadow-sm">
                  <img
                    src={document.coverData.heroImageUrl}
                    alt="Cover Art"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Abstract */}
              {document.coverData?.abstract && (
                <div className="p-6 bg-slate-50 border-l-4 rounded-r-xl my-6" style={{ borderColor: layoutSettings.accentColor }}>
                  <span className="text-xs uppercase tracking-widest font-bold text-slate-500 block mb-1">
                    Executive Abstract
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    {document.coverData.abstract}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Author Credentials */}
            <div className="relative z-10 border-t border-slate-200 pt-6 flex items-end justify-between text-xs text-slate-600">
              <div>
                <p className="font-bold text-slate-900 text-sm">{document.author}</p>
                <p className="text-slate-500 text-xs">{document.organization}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase text-slate-400">
                  FORMAT: {document.documentType.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- PAGE 2: TABLE OF CONTENTS & ABSTRACT ----------------- */}
        {document.tableOfContents && document.tableOfContents.length > 0 && (
          <div
            className={`pdf-page-container pdf-page-shadow w-full max-w-[794px] min-h-[1123px] bg-white text-slate-900 p-12 md:p-16 rounded-lg relative flex flex-col justify-between transition-all ${getFontFamilyClass(
              layoutSettings.primaryFont
            )}`}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            {/* Running Header */}
            <div className="border-b border-slate-200 pb-3 flex justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              <span>{layoutSettings.headerText}</span>
              <span>PAGE 2</span>
            </div>

            {/* TOC Body */}
            <div className="my-8 flex-1 space-y-8">
              <div className="border-b-2 border-slate-900 pb-3">
                <h2
                  className="font-bold text-2xl tracking-tight"
                  style={{ color: layoutSettings.accentColor }}
                >
                  {isRTL ? 'فهرست المحتويات' : 'Table of Contents & Overview'}
                </h2>
              </div>

              <div className="space-y-4">
                {document.tableOfContents.map((item, idx) => (
                  <div key={idx} className="flex items-baseline justify-between gap-4 border-b border-dotted border-slate-300 pb-2">
                    <span className="font-semibold text-sm text-slate-800">{item.title}</span>
                    <span className="font-mono text-xs text-slate-500">{item.page}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Running Footer */}
            <div className="border-t border-slate-200 pt-3 flex justify-between text-[10px] font-mono text-slate-400 uppercase">
              <span>{layoutSettings.footerText}</span>
              <span>CONFIDENTIAL EDITION</span>
            </div>
          </div>
        )}

        {/* ----------------- PAGE 3+: CONTENT SECTIONS ----------------- */}
        <div
          className={`pdf-page-container pdf-page-shadow w-full max-w-[794px] min-h-[1123px] bg-white text-slate-900 p-12 md:p-16 rounded-lg relative flex flex-col justify-between transition-all ${getFontFamilyClass(
            layoutSettings.primaryFont
          )}`}
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          {/* Running Header */}
          <div className="border-b border-slate-200 pb-3 flex justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            <span>{document.title}</span>
            <span>PUBLICATION CANVAS</span>
          </div>

          {/* Sections Body with Multi-Column option */}
          <div
            className={`my-8 flex-1 space-y-8 ${
              layoutSettings.columnCount === 2
                ? 'columns-1 md:columns-2 gap-8'
                : layoutSettings.columnCount === 3
                ? 'columns-1 md:columns-3 gap-6'
                : ''
            }`}
          >
            {document.sections.map((sec, idx) => (
              <div
                key={sec.id}
                className="break-inside-avoid space-y-4 mb-8 group relative p-3 rounded-xl hover:bg-slate-50/80 transition border border-transparent hover:border-slate-200"
              >
                {/* AI Floating Actions for this section */}
                <div className="no-print absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-slate-900 text-white p-1 rounded-lg shadow-lg text-[10px] z-20">
                  <button
                    onClick={() => onOpenAIAssistantForSection(sec.id, sec.content)}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-teal-300" />
                    <span>AI Polish</span>
                  </button>
                </div>

                {/* Section Title */}
                <input
                  type="text"
                  value={sec.heading}
                  onChange={(e) => handleUpdateSectionHeading(sec.id, e.target.value)}
                  className="font-bold text-xl md:text-2xl tracking-tight text-slate-900 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:outline-none"
                  style={{ color: layoutSettings.accentColor }}
                />

                {/* Section Content Area */}
                <textarea
                  rows={Math.max(4, Math.ceil(sec.content.length / 90))}
                  value={sec.content}
                  onChange={(e) => handleUpdateSectionContent(sec.id, e.target.value)}
                  className="w-full bg-transparent text-slate-800 leading-relaxed border border-transparent hover:border-slate-200 focus:border-teal-500 focus:outline-none rounded p-1 resize-y"
                  style={{
                    fontSize: `${layoutSettings.fontSize}px`,
                    lineHeight: layoutSettings.lineHeight,
                  }}
                />

                {/* Callout Box Rendering */}
                {sec.callout && (
                  <div
                    className="p-5 rounded-xl bg-slate-50 border-l-4 my-4 shadow-sm"
                    style={{ borderColor: layoutSettings.accentColor }}
                  >
                    {sec.callout.title && (
                      <div className="flex items-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                        <Quote className="w-3.5 h-3.5 text-teal-600" />
                        <span>{sec.callout.title}</span>
                      </div>
                    )}
                    <p className="text-xs text-slate-800 leading-relaxed font-serif italic">
                      {sec.callout.text}
                    </p>
                  </div>
                )}

                {/* --- OUTPUT STYLE ENGINE: MCQ BANK RENDERING --- */}
                {sec.mcqs && sec.mcqs.length > 0 && (
                  <div className="my-6 space-y-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-700 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Multiple Choice Practice Bank ({sec.mcqs.length} Questions)</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        EXAM STANDARD
                      </span>
                    </div>

                    <div className="space-y-4">
                      {sec.mcqs.map((q, qIdx) => (
                        <div key={q.id || qIdx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-sm">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm text-slate-900 leading-snug">
                              <span className="text-indigo-600 font-bold mr-1">Q{q.questionNumber || qIdx + 1}.</span>
                              {q.question}
                            </h4>
                            {q.difficulty && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                                {q.difficulty}
                              </span>
                            )}
                          </div>

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt) => {
                              const isCorrect = opt.key === q.correctAnswer;
                              return (
                                <div
                                  key={opt.key}
                                  className={`p-2.5 rounded-lg border flex items-start gap-2.5 transition ${
                                    isCorrect
                                      ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 font-medium'
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

                          {/* Explanation Box */}
                          {q.explanation && (
                            <div className="mt-2 p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg text-xs space-y-1">
                              <span className="font-bold text-indigo-900 text-[11px] uppercase tracking-wider block">
                                Answer Explanation:
                              </span>
                              <p className="text-indigo-950 leading-relaxed text-[11px]">{q.explanation}</p>
                              {q.reference && (
                                <span className="text-[10px] text-indigo-600 font-mono block pt-1">
                                  Reference: {q.reference}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- OUTPUT STYLE ENGINE: UNIVERSITY ANSWER SHEET RENDERING --- */}
                {sec.universityAnswer && (
                  <div className="my-6 p-6 rounded-2xl bg-white border-2 border-indigo-900/20 space-y-5 shadow-sm">
                    {/* Question Header */}
                    <div className="p-4 bg-indigo-950 text-white rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-mono text-indigo-300 tracking-widest block">
                        HONOURS & MASTERS EXAMINATION MODEL RESPONSE
                      </span>
                      <h3 className="text-base font-bold font-playfair leading-snug">
                        {sec.universityAnswer.questionTitle}
                      </h3>
                    </div>

                    {/* 1. Introduction */}
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">
                        1. Introduction & Contextual Framework
                      </h4>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {sec.universityAnswer.introduction}
                      </p>
                    </div>

                    {/* 2. Formal Definition */}
                    <div className="p-3.5 bg-indigo-50/60 border-l-4 border-indigo-600 rounded-r-lg space-y-1">
                      <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                        2. Core Academic Definition
                      </span>
                      <p className="text-xs text-indigo-950 font-serif italic leading-relaxed">
                        {sec.universityAnswer.definition}
                      </p>
                    </div>

                    {/* 3. Main Discussion */}
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">
                        3. Comprehensive Discussion & Analytical Breakdown
                      </h4>
                      <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                        {sec.universityAnswer.mainDiscussion}
                      </p>
                    </div>

                    {/* 4. Evidence Points */}
                    {sec.universityAnswer.evidencePoints && sec.universityAnswer.evidencePoints.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-900">
                          4. Scholarly Evidence & Primary Sources
                        </h4>
                        <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-800 pl-1">
                          {sec.universityAnswer.evidencePoints.map((ev, eIdx) => (
                            <li key={eIdx} className="leading-relaxed">
                              {ev}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 5. Critical Analysis & Conclusion */}
                    {sec.universityAnswer.criticalAnalysis && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                          5. Critical Evaluation & Synthesis
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed italic">
                          {sec.universityAnswer.criticalAnalysis}
                        </p>
                      </div>
                    )}

                    <div className="space-y-1 pt-2 border-t border-slate-200">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                        Conclusion:
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {sec.universityAnswer.conclusion}
                      </p>
                    </div>
                  </div>
                )}

                {/* --- OUTPUT STYLE ENGINE: ISLAMIC CONTENT RENDERING --- */}
                {sec.islamicContent && (
                  <div className="my-6 p-6 rounded-2xl bg-emerald-950/5 border border-emerald-800/30 space-y-5">
                    {/* Bismillah Header */}
                    <div className="text-center py-2">
                      <span className="font-arabic text-2xl text-emerald-800 font-bold">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                      </span>
                    </div>

                    {/* Arabic Verse / Hadith Block */}
                    {sec.islamicContent.arabicText && (
                      <div className="p-5 bg-white border-2 border-emerald-700/30 rounded-xl shadow-sm text-right space-y-2">
                        <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-widest block text-left">
                          ARABIC TEXT (المتن العربي)
                        </span>
                        <p className="font-arabic text-xl md:text-2xl text-slate-900 leading-loose">
                          {sec.islamicContent.arabicText}
                        </p>
                      </div>
                    )}

                    {/* Transliteration */}
                    {sec.islamicContent.transliteration && (
                      <div className="text-xs text-slate-600 font-serif italic px-1">
                        <span className="font-semibold text-emerald-900">Transliteration: </span>
                        {sec.islamicContent.transliteration}
                      </div>
                    )}

                    {/* Translation */}
                    {sec.islamicContent.translation && (
                      <div className="p-4 bg-emerald-50/80 border-l-4 border-emerald-600 rounded-r-xl space-y-1">
                        <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                          Translation & Meaning:
                        </span>
                        <p className="text-xs text-emerald-950 leading-relaxed">
                          {sec.islamicContent.translation}
                        </p>
                      </div>
                    )}

                    {/* Scholarly Commentary (Tafsir / Sharh) */}
                    {sec.islamicContent.explanation && (
                      <div className="space-y-1 text-xs text-slate-800 leading-relaxed">
                        <span className="font-bold text-emerald-900 uppercase tracking-wider block">
                          Scholarly Tafsir & Commentary (التفسير والبيان):
                        </span>
                        <p className="whitespace-pre-line">{sec.islamicContent.explanation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Data Table Rendering */}
                {sec.table && (
                  <div className="my-4 overflow-x-auto border border-slate-200 rounded-lg">
                    {sec.table.title && (
                      <div className="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b border-slate-200">
                        {sec.table.title}
                      </div>
                    )}
                    <table className="w-full text-xs text-left text-slate-800">
                      <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
                        <tr>
                          {sec.table.headers.map((h, i) => (
                            <th key={i} className="px-3 py-2 border-r border-slate-200 last:border-0">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sec.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3 py-2 border-r border-slate-100 last:border-0">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Diagram / Figure Card Rendering */}
                {sec.figure && (
                  <div className="my-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <ImageIcon className="w-4 h-4 text-teal-600" />
                      <span>{sec.figure.title}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {sec.figure.items.map((item, fIdx) => (
                        <div key={fIdx} className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-900 block mb-0.5">{item.label}</span>
                          <span className="text-slate-600 text-[11px] leading-tight">{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* References & Footnotes Section */}
          {document.references && document.references.length > 0 && (
            <div className="border-t border-slate-300 pt-4 mt-6 text-xs text-slate-600 space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-800">
                Citations & Scholarly References
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
                {document.references.map((ref, rIdx) => (
                  <li key={rIdx}>{ref}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Running Footer */}
          <div className="border-t border-slate-200 pt-3 mt-6 flex justify-between text-[10px] font-mono text-slate-400 uppercase">
            <span>{document.organization || 'AI PDF STUDIO'}</span>
            <span>PAGE 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
