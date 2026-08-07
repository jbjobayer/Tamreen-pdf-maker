import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Upload,
  Camera,
  Link,
  Youtube,
  Mic,
  BookOpen,
  Sliders,
  CheckCircle2,
  Globe,
  Palette,
  Layout,
  AlertCircle,
  Search,
  Layers,
  Check,
  X,
  Plus,
} from 'lucide-react';
import {
  InputMode,
  DocumentType,
  StyleTheme,
  LanguageCode,
  DocumentData,
} from '../types';
import { OUTPUT_STYLE_LIBRARY, CATEGORY_LIST } from '../data/outputStyles';

interface InputPanelProps {
  onDocumentGenerated: (doc: DocumentData) => void;
  onOpenCameraModal: () => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  onDocumentGenerated,
  onOpenCameraModal,
  isGenerating,
  setIsGenerating,
}) => {
  const [inputMode, setInputMode] = useState<InputMode>('topic');
  const [promptText, setPromptText] = useState<string>('');
  const [pastedText, setPastedText] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [fileExtract, setFileExtract] = useState<string>('');

  // Output Style Selection state
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['study_note', 'honours_answer', 'mcq_book']);
  const [styleCategoryFilter, setStyleCategoryFilter] = useState<string>('ALL');
  const [styleSearchQuery, setStyleSearchQuery] = useState<string>('');
  const [isStyleModalOpen, setIsStyleModalOpen] = useState<boolean>(false);

  // Publication Configuration
  const [documentType, setDocumentType] = useState<DocumentType>('Textbook Chapter');
  const [styleTheme, setStyleTheme] = useState<StyleTheme>('Modern Minimalist');
  const [targetLanguage, setTargetLanguage] = useState<string>('Auto-detect');
  const [includeCover, setIncludeCover] = useState<boolean>(true);
  const [includeTOC, setIncludeTOC] = useState<boolean>(true);
  const [includeCallouts, setIncludeCallouts] = useState<boolean>(true);
  const [includeFigures, setIncludeFigures] = useState<boolean>(true);
  const [includeReferences, setIncludeReferences] = useState<boolean>(true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filtered Output Styles
  const filteredOutputStyles = OUTPUT_STYLE_LIBRARY.filter((st) => {
    const matchesCat = styleCategoryFilter === 'ALL' || st.category === styleCategoryFilter;
    const matchesSearch =
      st.name.toLowerCase().includes(styleSearchQuery.toLowerCase()) ||
      st.description.toLowerCase().includes(styleSearchQuery.toLowerCase()) ||
      st.category.toLowerCase().includes(styleSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleStyleSelection = (styleId: string) => {
    if (selectedStyles.includes(styleId)) {
      if (selectedStyles.length === 1) return; // keep at least 1 selected
      setSelectedStyles(selectedStyles.filter((id) => id !== styleId));
    } else {
      setSelectedStyles([...selectedStyles, styleId]);
    }
  };

  const handleSelectPresetSuite = (presetType: 'university' | 'islamic' | 'mcq_bank' | 'research') => {
    if (presetType === 'university') {
      setSelectedStyles(['honours_answer', 'masters_answer', 'mcq_book', 'summary_note']);
      setDocumentType('University Answer Sheet');
      setStyleTheme('Modern Minimalist');
    } else if (presetType === 'islamic') {
      setSelectedStyles(['tafsir', 'hadith_explanation', 'fiqh_discussion', 'islamic_book']);
      setDocumentType('Islamic Manuscript');
      setStyleTheme('Islamic Heritage');
      setTargetLanguage('Arabic');
    } else if (presetType === 'mcq_bank') {
      setSelectedStyles(['mcq_book', 'mcq_explanation', 'creative_questions', 'quick_revision']);
      setDocumentType('MCQ Question Bank');
      setStyleTheme('Modern Minimalist');
    } else if (presetType === 'research') {
      setSelectedStyles(['research_paper', 'journal_paper', 'literature_review', 'summary_note']);
      setDocumentType('Academic Paper');
      setStyleTheme('IEEE Academic');
    }
  };

  // Suggested Topics
  const suggestedTopics = [
    { title: 'Al-Adlu wal-Insaf (Justice & Equity in Islam)', lang: 'Arabic / Multilingual', preset: 'islamic' as const },
    { title: 'Photosynthesis & Bioenergetics: Quantum Biophysics', lang: 'English', preset: 'research' as const },
    { title: 'Data Structures & Algorithmic Complexity 2026', lang: 'English', preset: 'mcq_bank' as const },
    { title: 'বাংলা সাহিত্য ও আধুনিক ডিজিটাল প্রকাশনা প্রযুক্তি', lang: 'Bengali', preset: 'university' as const },
    { title: 'Global AI Infrastructure & Corporate Strategy', lang: 'English', preset: 'research' as const },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileExtract(text || `Extracted raw document content from ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    let finalPrompt = '';

    if (inputMode === 'topic') {
      finalPrompt = promptText.trim();
    } else if (inputMode === 'text') {
      finalPrompt = pastedText.trim();
    } else if (inputMode === 'upload_doc' || inputMode === 'upload_image') {
      finalPrompt = `Extracted File Content from "${selectedFileName}":\n\n${fileExtract || promptText}`;
    } else if (inputMode === 'url' || inputMode === 'youtube') {
      finalPrompt = `URL Source: ${urlInput}\n\nKey Notes/Topic Context: ${promptText}`;
    } else if (inputMode === 'audio') {
      finalPrompt = `Audio Lecture Transcript:\n\n${pastedText || promptText}`;
    }

    if (!finalPrompt) {
      setErrorMsg('Please enter a topic, paste text, or upload a document to proceed.');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          inputMode,
          documentType,
          styleTheme,
          targetLanguage,
          selectedStyles,
          includeCover,
          includeTOC,
          includeCallouts,
          includeFigures,
          includeReferences,
        }),
      });

      const data = await response.json();
      if (data.success && data.document) {
        // Hydrate default fields if missing
        const generatedDoc: DocumentData = {
          id: 'doc-' + Date.now(),
          title: data.document.title || 'Publication Document',
          subtitle: data.document.subtitle || '',
          author: data.document.author || 'AI PDF Studio Editor',
          organization: data.document.organization || 'Global Publishing Studio',
          date: data.document.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          language: (data.document.language || (targetLanguage === 'Arabic' ? 'ar' : targetLanguage === 'Bengali' ? 'bn' : 'en')) as LanguageCode,
          direction: data.document.direction || (data.document.language === 'ar' || targetLanguage === 'Arabic' ? 'rtl' : 'ltr'),
          documentType: data.document.documentType || documentType,
          selectedStyles: data.document.selectedStyles || selectedStyles,
          theme: data.document.theme || styleTheme,
          primaryFont: data.document.primaryFont || (data.document.language === 'ar' ? 'Noto Naskh Arabic' : data.document.language === 'bn' ? 'Noto Serif Bengali' : 'Inter'),
          accentColor: data.document.accentColor || '#0d9488',
          hasCover: includeCover,
          coverData: data.document.coverData || {
            coverTitle: data.document.title || 'Publication Title',
            coverSubtitle: data.document.subtitle,
            badgeText: 'PUBLICATION EDITION',
            coverStyle: styleTheme === 'Islamic Heritage' ? 'islamic_manuscript' : styleTheme === 'Corporate Royal' ? 'corporate' : 'academic',
            abstract: data.document.coverData?.abstract || 'Publication quality AI generated monograph.',
          },
          tableOfContents: data.document.tableOfContents || [
            { title: '1. Introduction & Overview', level: 1, page: 2 },
            { title: '2. Core Principles & Analysis', level: 1, page: 3 },
          ],
          sections: data.document.sections || [],
          references: data.document.references || [],
          pageFormat: 'A4',
          columnCount: documentType === 'Academic Paper' || documentType === 'Corporate Report' ? 2 : 1,
          headerText: `${documentType.toUpperCase()} • PUBLICATION EDITION`,
          footerText: `AI PDF Studio • ${data.document.organization || 'Global Research Council'}`,
        };

        onDocumentGenerated(generatedDoc);
      } else {
        setErrorMsg(data.error || 'Document generation failed. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to connect to AI server. Please check your network or try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multi-Input Publishing Engine</span>
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white tracking-tight">
            Convert Any Topic or Source into Publication-Quality PDFs
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Upload notes, research papers, YouTube lectures, OCR camera scans, or simple topics. Our AI designs Adobe InDesign-grade layouts complete with covers, multi-column typography, callout boxes, and references.
          </p>
        </div>
      </div>

      {/* Input Mode Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
        <button
          onClick={() => setInputMode('topic')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition gap-2 ${
            inputMode === 'topic'
              ? 'bg-gradient-to-b from-indigo-600/30 to-slate-900 border-indigo-500 text-white shadow-lg'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5 text-teal-400" />
          <span>Topic / Subject</span>
        </button>

        <button
          onClick={() => setInputMode('text')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition gap-2 ${
            inputMode === 'text'
              ? 'bg-gradient-to-b from-indigo-600/30 to-slate-900 border-indigo-500 text-white shadow-lg'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <FileText className="w-5 h-5 text-indigo-400" />
          <span>Paste Text / MD</span>
        </button>

        <button
          onClick={() => setInputMode('upload_doc')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition gap-2 ${
            inputMode === 'upload_doc'
              ? 'bg-gradient-to-b from-indigo-600/30 to-slate-900 border-indigo-500 text-white shadow-lg'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <Upload className="w-5 h-5 text-emerald-400" />
          <span>Doc / PDF / PPT</span>
        </button>

        <button
          onClick={onOpenCameraModal}
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-amber-500/50 hover:text-amber-300 text-xs font-medium transition gap-2"
        >
          <Camera className="w-5 h-5 text-amber-400" />
          <span>Camera Scanner</span>
        </button>

        <button
          onClick={() => setInputMode('url')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition gap-2 ${
            inputMode === 'url' || inputMode === 'youtube'
              ? 'bg-gradient-to-b from-indigo-600/30 to-slate-900 border-indigo-500 text-white shadow-lg'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <Link className="w-5 h-5 text-cyan-400" />
          <span>Web URL / YouTube</span>
        </button>

        <button
          onClick={() => setInputMode('audio')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition gap-2 ${
            inputMode === 'audio'
              ? 'bg-gradient-to-b from-indigo-600/30 to-slate-900 border-indigo-500 text-white shadow-lg'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <Mic className="w-5 h-5 text-rose-400" />
          <span>Audio Lecture</span>
        </button>
      </div>

      {/* Main Input Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        {inputMode === 'topic' && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Enter Subject, Topic or Research Title
            </label>
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. Al-Adlu wal-Insaf (Justice & Equity in Islamic Law) or Photosynthesis & Quantum Biophysics..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />

            {/* Quick Topic Prompts */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-medium">Popular Publication Presets:</span>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPromptText(item.title);
                      setDocumentType(item.type);
                      if (item.title.includes('বাংলা')) setTargetLanguage('Bengali');
                      else if (item.title.includes('Al-Adlu')) setTargetLanguage('Arabic');
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3 h-3 text-teal-400" />
                    <span>{item.title}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded">
                      {item.lang}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {inputMode === 'text' && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Paste Text, Lecture Notes, or Markdown
            </label>
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your raw text, article draft, research findings, or markdown here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
            />
          </div>
        )}

        {inputMode === 'upload_doc' && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Upload Document File (PDF, DOCX, PPT, Markdown, TXT)
            </label>
            <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 text-center bg-slate-950/50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.ppt,.pptx,.txt,.md,.html"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-200">
                {selectedFileName ? selectedFileName : 'Click or Drag & Drop Document File Here'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF, DOCX, PPTX, Markdown, HTML, and Text files
              </p>
            </div>
            {selectedFileName && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>File loaded successfully! AI will parse headings, tables, and references.</span>
              </div>
            )}
          </div>
        )}

        {(inputMode === 'url' || inputMode === 'youtube') && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Website URL or YouTube Lecture Link
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Youtube className="w-4 h-4 text-red-400 absolute left-3 top-3.5" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://wikipedia.org/wiki/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Optional focus area or specific instructions for extracting this lecture/webpage..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {inputMode === 'audio' && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Audio Lecture & Speech Transcript
            </label>
            <textarea
              rows={5}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste speech-to-text audio transcript or lecture recordings text here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Output Style Engine Bar */}
        <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Output Style Engine ({selectedStyles.length} Selected)
              </span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
                Combine Multiple Styles in 1 Document
              </span>
            </div>
            <button
              onClick={() => setIsStyleModalOpen(true)}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 px-2.5 py-1 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Browse 60+ Styles</span>
            </button>
          </div>

          {/* Quick Preset Suites */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Preset Suites:</span>
            <button
              onClick={() => handleSelectPresetSuite('university')}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 hover:border-indigo-500 text-slate-200 transition text-[11px]"
            >
              🎓 Varsity Exam Suite
            </button>
            <button
              onClick={() => handleSelectPresetSuite('islamic')}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 hover:border-emerald-500 text-slate-200 transition text-[11px]"
            >
              🕌 Islamic Scholar Suite
            </button>
            <button
              onClick={() => handleSelectPresetSuite('mcq_bank')}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 hover:border-amber-500 text-slate-200 transition text-[11px]"
            >
              📝 Full MCQ Question Bank
            </button>
            <button
              onClick={() => handleSelectPresetSuite('research')}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-slate-200 transition text-[11px]"
            >
              🔬 Research Paper Suite
            </button>
          </div>

          {/* Active Selected Style Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedStyles.map((styleId) => {
              const styleDef = OUTPUT_STYLE_LIBRARY.find((st) => st.id === styleId);
              if (!styleDef) return null;
              return (
                <div
                  key={styleId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 text-indigo-200 border border-indigo-500/40 text-xs font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>{styleDef.name}</span>
                  <span className="text-[10px] text-indigo-400 font-mono">({styleDef.badge})</span>
                  <button
                    onClick={() => toggleStyleSelection(styleId)}
                    className="ml-1 text-indigo-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Configuration Toolbar */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Document Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-indigo-400" />
              <span>Document Type</span>
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Textbook Chapter">Textbook Chapter (2 Column)</option>
              <option value="Academic Paper">Academic Paper (IEEE / Oxford)</option>
              <option value="Islamic Manuscript">Islamic Scholarly Manuscript</option>
              <option value="Corporate Report">Corporate Report & Executive Brief</option>
              <option value="Magazine Newsletter">Magazine & Newsletter Edition</option>
              <option value="Executive Brief">Executive Summary Brief</option>
              <option value="Technical Manual">Technical Reference Manual</option>
            </select>
          </div>

          {/* Style Theme */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-teal-400" />
              <span>Publication Theme</span>
            </label>
            <select
              value={styleTheme}
              onChange={(e) => setStyleTheme(e.target.value as StyleTheme)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Modern Minimalist">Modern Minimalist (Clean Teal & Slate)</option>
              <option value="Classical Editorial">Classical Editorial (Playfair & Emerald)</option>
              <option value="Islamic Heritage">Islamic Heritage (Naskh Arabic & Forest Green)</option>
              <option value="Corporate Royal">Corporate Royal (Inter & Deep Blue)</option>
              <option value="IEEE Academic">IEEE Academic (Double Column IEEE Standard)</option>
              <option value="Serif Elegant">Serif Elegant (Bengali/English Serif)</option>
            </select>
          </div>

          {/* Target Language */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Language & Font Auto-Switch</span>
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Auto-detect">Auto-detect Language</option>
              <option value="English">English (Inter / Playfair)</option>
              <option value="Bengali">Bengali / বাংলা (Noto Serif Bengali)</option>
              <option value="Arabic">Arabic / العربية (Noto Naskh / RTL)</option>
            </select>
          </div>
        </div>

        {/* Feature Checkbox Toggles */}
        <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCover}
              onChange={(e) => setIncludeCover(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-0"
            />
            <span>Include Cover Page</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeTOC}
              onChange={(e) => setIncludeTOC(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-0"
            />
            <span>Table of Contents</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCallouts}
              onChange={(e) => setIncludeCallouts(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-0"
            />
            <span>Key Takeaways / Callout Boxes</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeFigures}
              onChange={(e) => setIncludeFigures(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-0"
            />
            <span>Diagram / Figure Blocks</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeReferences}
              onChange={(e) => setIncludeReferences(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-0"
            />
            <span>Citations & References</span>
          </label>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Generate CTA Button */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            disabled={isGenerating}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 via-indigo-600 to-emerald-500 hover:from-teal-400 hover:via-indigo-500 hover:to-emerald-400 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Designing Publication PDF with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>Generate Publication Document PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Style Catalog Modal */}
      {isStyleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Output Style Library</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white">
                  Select Output Styles for Your Publication
                </h3>
                <p className="text-xs text-slate-400">
                  Choose one or multiple styles. AI PDF Studio will format each section to match the selected layouts.
                </p>
              </div>
              <button
                onClick={() => setIsStyleModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Search and Filters */}
            <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/80">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={styleSearchQuery}
                  onChange={(e) => setStyleSearchQuery(e.target.value)}
                  placeholder="Search styles (e.g., MCQ, Honours Answer, Tafsir, Research Paper, Case Study)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setStyleCategoryFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    styleCategoryFilter === 'ALL'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  ALL STYLES ({OUTPUT_STYLE_LIBRARY.length})
                </button>
                {CATEGORY_LIST.map((cat) => {
                  const count = OUTPUT_STYLE_LIBRARY.filter((s) => s.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setStyleCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                        styleCategoryFilter === cat
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid of Styles */}
            <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredOutputStyles.map((style) => {
                const isSelected = selectedStyles.includes(style.id);
                return (
                  <div
                    key={style.id}
                    onClick={() => toggleStyleSelection(style.id)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider bg-teal-950/50 border border-teal-800/40 px-2 py-0.5 rounded">
                          {style.badge}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-400 text-white'
                              : 'border-slate-700 bg-slate-900 text-transparent group-hover:border-slate-500'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white font-playfair">{style.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {style.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Category: {style.category}</span>
                      <span className="text-indigo-400 font-mono">{style.defaultConfig.fontFamily}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {selectedStyles.length} style(s) selected for combined document generation.
              </span>
              <button
                onClick={() => setIsStyleModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg transition"
              >
                Done Selecting ({selectedStyles.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
