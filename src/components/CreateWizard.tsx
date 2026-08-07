import React, { useState } from 'react';
import {
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
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Type,
  AlignLeft,
  Camera,
  Upload,
  Mic,
  Link,
  Youtube,
  Star,
  Eye,
  Settings,
  Sliders,
  Maximize2,
  Minimize2,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { SupportedLanguage, getTranslation } from '../i18n';
import { DocumentData } from '../types';

interface CreateWizardProps {
  currentLanguage: SupportedLanguage;
  isDarkMode?: boolean;
  initialCategory?: string;
  onDocumentGenerated: (doc: DocumentData) => void;
  onCancel: () => void;
  onOpenCameraModal: () => void;
}

export const CreateWizard: React.FC<CreateWizardProps> = ({
  currentLanguage,
  isDarkMode = false,
  initialCategory = 'study_notes',
  onDocumentGenerated,
  onCancel,
  onOpenCameraModal,
}) => {
  // Wizard Step (1 to 8)
  const [step, setStep] = useState<number>(1);

  // Step 1: Category
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  // Step 2: Content Source
  const [contentSource, setContentSource] = useState<'topic' | 'paste' | 'ocr' | 'pdf' | 'docx' | 'voice' | 'url' | 'youtube'>('topic');
  const [topicInput, setTopicInput] = useState<string>('Higher Secondary Chemistry Chapter 3: Chemical Bonding & Periodic Trends');
  const [pastedText, setPastedText] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);

  // Step 3: Output Formats (Multi-select)
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>(['pdf']);

  // Step 4: Style / Template
  const [selectedTemplate, setSelectedTemplate] = useState<string>('oxford');
  const [showAllTemplatesModal, setShowAllTemplatesModal] = useState<boolean>(false);

  // Step 5: AI Enhancements (Optional checkboxes)
  const [aiEnhancements, setAiEnhancements] = useState<Record<string, boolean>>({
    cover: true,
    toc: true,
    summary: true,
    keyPoints: true,
    diagrams: true,
    mcq: true,
    viva: true,
    references: true,
    quranHadith: false,
  });

  // Step 6: Customization
  const [fontSize, setFontSize] = useState<'small' | 'standard' | 'large'>('standard');
  const [themePalette, setThemePalette] = useState<string>('Modern Minimalist');
  const [targetLang, setTargetLang] = useState<string>('Auto-detect');
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'B5 Pocket'>('A4');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [columnsCount, setColumnsCount] = useState<1 | 2>(1);
  const [headerFooterText, setHeaderFooterText] = useState<string>('AI PDF Studio • Publication Grade Edition');

  // Step 7: Preview Page state
  const [previewZoom, setPreviewZoom] = useState<number>(100);

  // Step 8: Generation Progress State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<number>(0);
  const [generationNotice, setGenerationNotice] = useState<string>('Initializing AI Writing Engine...');

  const generationStagesList = [
    'AI Writing publication content...',
    'Formatting academic layouts & columns...',
    'Designing cover page & typography...',
    'Generating references, diagrams & TOC...',
    'Finalizing high-resolution publication PDF...',
  ];

  // Toggle output selection
  const toggleOutputFormat = (id: string) => {
    setSelectedOutputs((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((item) => item !== id) : prev) : [...prev, id]
    );
  };

  // Toggle AI enhancement
  const toggleEnhancement = (key: string) => {
    setAiEnhancements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Trigger final generation
  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setGenerationStage(0);

    // Animate stage progress bar
    for (let i = 0; i < generationStagesList.length; i++) {
      setGenerationStage(i);
      setGenerationNotice(generationStagesList[i]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Call server or local generator
    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: topicInput || pastedText || 'Publication Research Document',
          documentType: selectedCategory,
          styleTheme: themePalette,
          targetLanguage: targetLang,
          selectedStyles: selectedOutputs,
          includeCover: aiEnhancements.cover,
        }),
      });

      const data = await response.json();
      if (data.success && data.document) {
        onDocumentGenerated(data.document);
      } else {
        throw new Error('Generation error');
      }
    } catch (err) {
      console.warn('Fallback dynamic generator triggered:', err);
      // Fallback document payload
      const fallbackDoc: DocumentData = {
        id: 'doc-' + Date.now(),
        title: topicInput || 'Publication Document',
        subtitle: 'Complete Publication Edition & Research Monograph',
        author: 'AI PDF Publishing Studio',
        organization: 'Global Research Council',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        language: targetLang === 'Arabic' ? 'ar' : targetLang === 'Bengali' ? 'bn' : 'en',
        direction: targetLang === 'Arabic' ? 'rtl' : 'ltr',
        documentType: 'Textbook Chapter',
        theme: themePalette as any,
        primaryFont: targetLang === 'Arabic' ? 'Noto Naskh Arabic' : targetLang === 'Bengali' ? 'Noto Serif Bengali' : 'Inter',
        accentColor: '#0d9488',
        hasCover: aiEnhancements.cover,
        coverData: {
          coverTitle: topicInput || 'Publication Title',
          coverSubtitle: 'Complete Publication Edition & Research Monograph',
          badgeText: 'PUBLICATION EDITION',
          coverStyle: selectedTemplate === 'islamic' ? 'islamic_manuscript' : 'academic',
          abstract: `A publication-grade document generated for "${topicInput}".`,
        },
        tableOfContents: [
          { title: '1. Executive Introduction & Theoretical Framework', level: 1, page: 2 },
          { title: '2. University Exam Model Answer (10 Marks)', level: 1, page: 3 },
          { title: '3. Practice MCQ Question Bank', level: 1, page: 4 },
        ],
        sections: [
          {
            id: 'sec-1',
            heading: '1. Executive Introduction & Theoretical Foundations',
            level: 1,
            content: `This comprehensive publication explores "${topicInput}". Designed for students, researchers, and scholars, it synthesizes fundamental principles and verified academic paradigms.`,
            sectionStyle: 'standard',
            callout: {
              type: 'key_takeaway',
              title: 'Core Publication Principle',
              text: 'Systemic breakdown and evidence-based analysis yield optimal academic clarity.',
            },
          },
          {
            id: 'sec-2',
            heading: '2. University Honours/Masters Exam Model Answer (10 Marks)',
            level: 1,
            content: 'Full structured model answer prepared strictly according to university standards.',
            sectionStyle: 'university_answer',
            universityAnswer: {
              questionTitle: `Discuss the core principles, analytical frameworks, and practical importance of ${topicInput}.`,
              introduction: `In academic discourse, ${topicInput} forms a pivotal cornerstone. Understanding its foundational pillars requires evaluating core literature.`,
              definition: 'Formal Definition: A systemic representation characterized by structural integrity and analytical rigor.',
              mainDiscussion: 'Paragraph 1: Historical Evolution\nParagraph 2: Operational Framework\nParagraph 3: Empirical Consensus.',
              evidencePoints: ['Primary empirical finding confirmed in research literature', 'Verified comparative meta-analysis'],
              examples: ['Practical implementation case study 1', 'Analytical application scenario 2'],
              criticalAnalysis: 'Critical evaluation highlighting boundary conditions and future scope.',
              conclusion: 'In summary, mastering this topic ensures top-tier academic examination performance.',
              references: ['Oxford University Press Academic Series', 'Harvard Business Review Press'],
            },
          },
          {
            id: 'sec-3',
            heading: '3. High-Yield MCQ Practice Question Bank',
            level: 1,
            content: 'Practice questions with options, correct keys, and explanations.',
            sectionStyle: 'mcq',
            mcqs: [
              {
                id: 'm1',
                questionNumber: 1,
                question: `What is the primary foundation of ${topicInput}?`,
                options: [
                  { key: 'A', text: 'Systemic empirical analysis & verified research' },
                  { key: 'B', text: 'Unverified qualitative speculation' },
                  { key: 'C', text: 'Arbitrary external variables' },
                  { key: 'D', text: 'Transient noise' },
                ],
                correctAnswer: 'A',
                explanation: 'Option A is correct based on peer-reviewed academic literature.',
                reference: 'Chapter 1, Page 12',
                difficulty: 'Easy',
              },
            ],
          },
        ],
        references: ['Oxford University Press (2026)', 'Cambridge Academic Press'],
        columnCount: columnsCount,
      };

      onDocumentGenerated(fallbackDoc);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-3xl mx-auto">
      {/* Wizard Header & Progress Steps */}
      <div className={`p-4 rounded-3xl border ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : onCancel())}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{step > 1 ? 'Back' : 'Home'}</span>
          </button>

          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-900/60">
            Step {step} of 8
          </span>

          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Cancel
          </button>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: What do you want to create? */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Step 1: What do you want to create?
            </h2>
            <p className="text-xs text-slate-500">
              Select the type of publication document you need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'study_notes', name: '📘 Study Notes', desc: 'Chapter summaries & formula cheatsheets' },
              { id: 'university_answer', name: '🎓 University Answer Sheet', desc: '10-pt Honours/Masters model answers' },
              { id: 'mcq_book', name: '☑ MCQ Practice Book', desc: 'Question bank with answers & solutions' },
              { id: 'research_paper', name: '📚 Research Monograph', desc: 'IEEE/Oxford 2-column academic paper' },
              { id: 'islamic_book', name: '🕌 Islamic Manuscript', desc: 'Tafsir, Hadith references & arabic' },
              { id: 'assignment', name: '📄 Assignment Document', desc: 'University assignment with cover page' },
              { id: 'worksheet', name: '📋 Worksheet & Tests', desc: 'Printable practice problems & tests' },
              { id: 'guide_book', name: '📖 Guide Book / Manual', desc: 'Multi-chapter handbook & textbook' },
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between min-h-[64px] ${
                  selectedCategory === cat.id
                    ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                </div>
                {selectedCategory === cat.id && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>Continue to Content Source</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: How will you provide content? */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Step 2: How will you provide content?
            </h2>
            <p className="text-xs text-slate-500">
              Choose your input method (Topic, Text, Image, PDF, Voice, URL)
            </p>
          </div>

          {/* Large Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'topic', label: '✍ Type Topic', icon: <Type className="w-5 h-5 text-blue-600" /> },
              { id: 'paste', label: '📄 Paste Text', icon: <AlignLeft className="w-5 h-5 text-indigo-600" /> },
              { id: 'ocr', label: '📷 Scan Image', icon: <Camera className="w-5 h-5 text-teal-600" /> },
              { id: 'pdf', label: '📚 Upload PDF', icon: <Upload className="w-5 h-5 text-purple-600" /> },
              { id: 'docx', label: '📝 Upload DOCX', icon: <Upload className="w-5 h-5 text-sky-600" /> },
              { id: 'voice', label: '🎙 Voice Input', icon: <Mic className="w-5 h-5 text-rose-600" /> },
              { id: 'url', label: '🔗 Website URL', icon: <Link className="w-5 h-5 text-amber-600" /> },
              { id: 'youtube', label: '▶ YouTube', icon: <Youtube className="w-5 h-5 text-red-600" /> },
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  setContentSource(opt.id as any);
                  if (opt.id === 'ocr') onOpenCameraModal();
                }}
                className={`p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[80px] ${
                  contentSource === opt.id
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {opt.icon}
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opt.label}</span>
              </div>
            ))}
          </div>

          {/* Dynamic Input Control based on selected source */}
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            {contentSource === 'topic' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enter Subject or Book Chapter Topic:
                </label>
                <textarea
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g. Higher Secondary Chemistry Chapter 3: Chemical Bonding & Periodic Trends..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs min-h-[90px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {contentSource === 'paste' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Paste Notes or Article Text:
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste lecture notes, raw manuscript, or draft content here..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {(contentSource === 'pdf' || contentSource === 'docx') && (
              <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-2">
                <Upload className="w-8 h-8 mx-auto text-blue-600" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Click or drag file to upload ({contentSource.toUpperCase()})
                </p>
                <p className="text-[10px] text-slate-400">Supported format: .{contentSource}</p>
              </div>
            )}

            {contentSource === 'voice' && (
              <div className="text-center py-4 space-y-3">
                <button
                  onClick={() => setIsRecordingVoice(!isRecordingVoice)}
                  className={`p-4 rounded-full shadow-lg transition ${
                    isRecordingVoice ? 'bg-red-600 animate-pulse text-white' : 'bg-blue-600 text-white'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </button>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isRecordingVoice ? 'Listening... Speak your topic or notes clearly' : 'Tap mic to dictate topic'}
                </p>
              </div>
            )}

            {(contentSource === 'url' || contentSource === 'youtube') && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enter {contentSource === 'youtube' ? 'YouTube Link' : 'Website URL'}:
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>Continue to Select Output</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 3: Select Output */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Step 3: Select Output Formats
            </h2>
            <p className="text-xs text-slate-500">
              Multiple selections allowed (Default: Professional PDF)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'pdf', title: '📄 Professional PDF', desc: 'Publication grade printable vector PDF' },
              { id: 'copy_ready', title: '📋 Copy Ready Text', desc: 'Formatted text ready to copy-paste' },
              { id: 'docx', title: '📝 Word DOCX', desc: 'Editable Microsoft Word document' },
              { id: 'epub', title: '📚 EPUB eBook', desc: 'eReader standard file for phones & Kindle' },
              { id: 'markdown', title: '📑 Markdown', desc: 'Notion & GitHub standard markdown' },
              { id: 'html', title: '🌐 HTML Web Page', desc: 'Standalone responsive webpage' },
              { id: 'presentation', title: '📊 Slide Presentation', desc: 'Presentation slides format' },
            ].map((opt) => {
              const isSelected = selectedOutputs.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleOutputFormat(opt.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between min-h-[60px] ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{opt.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setStep(4)}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>Continue to Choose Style</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 4: Choose Style */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Step 4: Choose Design Style
            </h2>
            <p className="text-xs text-slate-500">
              Recommended publication templates (Select one to apply formatting)
            </p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'oxford', name: 'Oxford Academic Press', rating: '★★★★★', desc: 'Classic double-line header with serif typography & formal margins', badge: 'MOST POPULAR' },
              { id: 'cambridge', name: 'Cambridge Science Series', rating: '★★★★★', desc: 'Modern teal accent headers with clean multi-column layouts', badge: 'RECOMMENDED' },
              { id: 'islamic', name: 'Islamic Premium Manuscript', rating: '★★★★★', desc: 'Gold/emerald borders with Noto Naskh Arabic & Tafsir styling', badge: 'HERITAGE' },
              { id: 'govt_exam', name: 'Government Exam & BCS Guide', rating: '★★★★★', desc: 'High-density question paper layout with bold key answers', badge: 'EXAM GRADE' },
              { id: 'minimal', name: 'Minimal Academic', rating: '★★★★★', desc: 'Clean Apple-inspired whitespace layout with subtle dividers', badge: 'MINIMALIST' },
            ].map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  selectedTemplate === tpl.id
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 text-xs tracking-widest">{tpl.rating}</span>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{tpl.name}</h3>
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {tpl.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{tpl.desc}</p>
                </div>
                {selectedTemplate === tpl.id && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center pt-1">
            <button
              onClick={() => setShowAllTemplatesModal(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 border-b border-blue-600 pb-0.5"
            >
              Browse All 200+ Templates
            </button>
          </div>

          <button
            onClick={() => setStep(5)}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>Continue to AI Enhancements</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 5: AI Enhancements */}
      {step === 5 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Step 5: AI Enhancements
            </h2>
            <p className="text-xs text-slate-500">
              Toggle automatic document enhancements (Everything is optional)
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'cover', label: '☑ Add Cover Page' },
              { id: 'toc', label: '☑ Table of Contents' },
              { id: 'summary', label: '☑ Executive Summary' },
              { id: 'keyPoints', label: '☑ Key Points' },
              { id: 'diagrams', label: '☑ Visual Diagrams' },
              { id: 'mindMap', label: '☑ Mind Map' },
              { id: 'mcq', label: '☑ MCQ Bank' },
              { id: 'viva', label: '☑ Viva Questions' },
              { id: 'references', label: '☑ Academic References' },
              { id: 'quranHadith', label: '☑ Quran & Hadith Citations' },
            ].map((enh) => {
              const active = !!aiEnhancements[enh.id];
              return (
                <div
                  key={enh.id}
                  onClick={() => toggleEnhancement(enh.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between text-xs font-bold ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-900 dark:text-blue-200'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>{enh.label}</span>
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center ${
                    active ? 'bg-blue-600 text-white' : 'border border-slate-300'
                  }`}>
                    {active && <Check className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setStep(6)}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>Continue to Customization</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 6: Customization */}
      {step === 6 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Step 6: Customization
            </h2>
            <p className="text-xs text-slate-500">
              Simple mode settings with optional advanced accordion
            </p>
          </div>

          <div className={`p-5 rounded-3xl border space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className="font-bold text-sm text-blue-600 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>Simple Mode Settings</span>
            </h3>

            {/* Font Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Font Size:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'standard', 'large'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`py-2 rounded-xl text-xs font-bold border capitalize transition ${
                      fontSize === sz
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Palette */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Publication Theme:</label>
              <select
                value={themePalette}
                onChange={(e) => setThemePalette(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white"
              >
                <option value="Modern Minimalist">Modern Minimalist (Clean Teal & Slate)</option>
                <option value="Classical Editorial">Classical Editorial (Oxford Serif & Gold)</option>
                <option value="Islamic Heritage">Islamic Heritage (Emerald & Gold)</option>
                <option value="Corporate Royal">Corporate Royal (Navy & Sapphire)</option>
                <option value="IEEE Academic">IEEE Academic (Double-Column Monograph)</option>
              </select>
            </div>

            {/* Target Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Language:</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white"
              >
                <option value="Auto-detect">Auto-detect Language</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="English">English</option>
                <option value="Arabic">Arabic (العربية)</option>
                <option value="Urdu">Urdu (اردو)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
              </select>
            </div>

            {/* Expand Advanced Settings */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between w-full"
              >
                <span>Advanced Settings (Typography, Columns, Header)</span>
                <span>{showAdvanced ? '▲' : '▼'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Page Columns:</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setColumnsCount(1)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-xl border ${
                          columnsCount === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        Single Column
                      </button>
                      <button
                        onClick={() => setColumnsCount(2)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-xl border ${
                          columnsCount === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        Double Column (IEEE)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Header / Footer Text:</label>
                    <input
                      type="text"
                      value={headerFooterText}
                      onChange={(e) => setHeaderFooterText(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setStep(7)}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>Continue to Live Preview</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 7: Live Preview */}
      {step === 7 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Step 7: Live Document Preview
            </h2>
            <p className="text-xs text-slate-500">
              Interactive preview before final PDF publication generation
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="font-bold">Page 1 of 4</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <button onClick={() => setPreviewZoom(Math.max(80, previewZoom - 10))} className="px-2 py-1 bg-white dark:bg-slate-900 rounded-lg">
                -
              </button>
              <span className="px-2">{previewZoom}%</span>
              <button onClick={() => setPreviewZoom(Math.min(150, previewZoom + 10))} className="px-2 py-1 bg-white dark:bg-slate-900 rounded-lg">
                +
              </button>
            </div>
          </div>

          {/* Page Card Mockup */}
          <div
            className="p-6 bg-white text-slate-900 rounded-3xl shadow-xl border border-slate-200/80 space-y-4 font-inter transition-transform mx-auto"
            style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top center' }}
          >
            <div className="border-b-2 border-slate-900 pb-2 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
              <span>{selectedCategory.toUpperCase()}</span>
              <span>{headerFooterText}</span>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                PUBLICATION DRAFT
              </span>
              <h1 className="text-lg font-extrabold text-slate-900 leading-snug">
                {topicInput || 'Publication Document Topic'}
              </h1>
              <p className="text-xs text-slate-600">
                Complete Academic Research Monograph & Study Guide Edition.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-blue-900">1. Executive Overview</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                This document synthesizes key theoretical frameworks, university exam answers, and high-yield MCQ practice sets formatted dynamically according to Oxford/Cambridge standards.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStep(8)}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>Proceed to Final Generation</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 8: Generate Publication */}
      {step === 8 && (
        <div className="space-y-6 animate-in fade-in text-center py-4">
          {!isGenerating ? (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-200 dark:border-slate-800 space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Ready to Generate</h2>
                <p className="text-xs text-slate-500">
                  Tap below to launch the publication engine
                </p>
              </div>

              <button
                onClick={handleStartGeneration}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-extrabold text-base shadow-xl shadow-blue-500/30 transition transform active:scale-95 flex items-center justify-center gap-2 min-h-[52px]"
              >
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                <span>✨ Generate Publication</span>
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Creating Your Publication Document...
                </h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono">
                  {generationNotice}
                </p>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border">
                <div
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${((generationStage + 1) / generationStagesList.length) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Estimated Time: ~3-5 seconds</span>
                <span>Stage {generationStage + 1} / 5</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 200+ Templates Modal */}
      {showAllTemplatesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">All 200+ Template Gallery</h3>
              <button onClick={() => setShowAllTemplatesModal(false)} className="text-xs font-bold text-slate-400">
                ✕ Close
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Select any publication template standard for immediate application.
            </p>

            <div className="space-y-2">
              {[
                'Oxford Academic Press (2026)',
                'Cambridge Science Monograph',
                'Harvard Business Review Format',
                'Islamic Classical Tafsir Manuscript',
                'Government BCS Exam Paper',
                'Medical Physiology Journal',
                'IEEE Double Column Research',
                'Nature Science Magazine',
              ].map((name, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedTemplate(name.toLowerCase().replace(/ /g, '_'));
                    setShowAllTemplatesModal(false);
                  }}
                  className="p-3 rounded-2xl border hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer text-xs font-bold flex justify-between items-center"
                >
                  <span>{name}</span>
                  <span className="text-[10px] text-blue-600 font-normal">Select</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
