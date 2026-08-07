import React, { useState } from 'react';
import {
  Zap,
  Bot,
  MessageSquare,
  Sliders,
  Sparkles,
  FileText,
  Upload,
  Camera,
  Link as LinkIcon,
  Youtube,
  Mic,
  Globe,
  Check,
  BookOpen,
  GraduationCap,
  CheckSquare,
  Book,
  ClipboardList,
  FileSpreadsheet,
  BookMarked,
  BarChart3,
  Layers,
  ChevronRight,
  Eye,
  Plus,
  Trash2,
  Send,
  Paperclip,
  CheckCircle2,
  FileDown,
  Layout,
  Type,
  Palette,
  AlignLeft,
  Maximize2,
  Minimize2,
  Award,
} from 'lucide-react';
import { SupportedLanguage, getTranslation } from '../i18n';
import { DocumentData } from '../types';
import { CreateWizard } from './CreateWizard';
import { sampleDocuments } from '../data/sampleDocuments';

export type CreationMode = 'quick' | 'assistant' | 'chat' | 'manual';

interface CreationHubProps {
  currentLanguage: SupportedLanguage;
  isDarkMode?: boolean;
  initialMode?: CreationMode;
  initialCategory?: string;
  onDocumentGenerated: (doc: DocumentData) => void;
  onCancel: () => void;
  onOpenCameraModal: () => void;
}

export const CreationHub: React.FC<CreationHubProps> = ({
  currentLanguage,
  isDarkMode = false,
  initialMode = 'quick',
  initialCategory = 'study_notes',
  onDocumentGenerated,
  onCancel,
  onOpenCameraModal,
}) => {
  // Current active mode (default is Quick Create)
  const [activeMode, setActiveMode] = useState<CreationMode>(initialMode);

  // ---------------------------------------------------------------------------
  // ⚡ QUICK CREATE STATE
  // ---------------------------------------------------------------------------
  const [quickPrompt, setQuickPrompt] = useState<string>('');
  const [quickLanguage, setQuickLanguage] = useState<string>('Auto Detect');
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; type: string }>>([]);
  const [urlInput, setUrlInput] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [quickGenerating, setQuickGenerating] = useState<boolean>(false);
  const [quickGenNotice, setQuickGenNotice] = useState<string>('');

  const isBn = currentLanguage === 'bn';

  const quickExamplePrompts = isBn
    ? [
        'আল-আদল ওয়াল ইনসাফ বিষয়ের উপর একটি পূর্ণাঙ্গ ইসলামিক বই তৈরি করুন।',
        'আপলোডকৃত পিডিএফ থেকে ব্যাখ্যাসহ বহুনির্বাচনী প্রশ্ন ব্যাংক তৈরি করুন।',
        'বিশ্ববিদ্যালয় অনার্স পরীক্ষার জন্য রেফারেন্স ও ডায়াগ্রাম সহ ১০ নম্বরের উত্তর তৈরি করুন।',
        'ম্যাক্রোইকোনমিক্স বিষয়ের উপর বিশ্ববিদ্যালয় অ্যাসাইনমেন্ট তৈরি করুন।',
        'ছবি স্ক্যান করে আন্তর্জাতিক মানদণ্ডের পাবলিকেশন পিডিএফে রূপান্তর করুন।',
        'অক্সফোর্ড ডাবল-কলাম ফরম্যাটে গবেষণা পত্র ও মনোগ্রাফ তৈরি করুন।',
      ]
    : [
        'Create a complete Islamic book on Al Adlu wal Insaf.',
        'Generate MCQ from uploaded PDF with answer explanations.',
        'Create Honours answer with references & model diagram.',
        'Generate University Assignment on Macroeconomics.',
        'Convert uploaded image into publication grade PDF.',
        'Generate Research Paper in double-column Oxford format.',
      ];

  // ---------------------------------------------------------------------------
  // 💬 AI CHAT STATE
  // ---------------------------------------------------------------------------
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      sender: 'user' | 'ai';
      text: string;
      docPreview?: DocumentData;
      timestamp: string;
    }>
  >([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Hello! I am your AI Publication Studio Assistant. Tell me naturally what book, exam answer, or document you want to create today. You can attach PDFs, images, URLs, or voice notes!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInputText, setChatInputText] = useState<string>('');
  const [chatIsTyping, setChatIsTyping] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // 🛠 MANUAL STUDIO STATE
  // ---------------------------------------------------------------------------
  const [studioDocTitle, setStudioDocTitle] = useState<string>('Higher Secondary Chemistry Chapter 3');
  const [studioSubtitle, setStudioSubtitle] = useState<string>('Periodic Trends & Chemical Bonding');
  const [studioDocType, setStudioDocType] = useState<string>('Textbook Chapter');
  const [studioTheme, setStudioTheme] = useState<string>('Modern Minimalist');
  const [studioFontSize, setStudioFontSize] = useState<string>('standard');
  const [studioColumns, setStudioColumns] = useState<1 | 2>(1);
  const [studioMargins, setStudioMargins] = useState<string>('normal');
  const [studioCover, setStudioCover] = useState<boolean>(true);
  const [studioToc, setStudioToc] = useState<boolean>(true);
  const [studioWatermark, setStudioWatermark] = useState<string>('');
  const [studioHeader, setStudioHeader] = useState<string>('Tamreen AI Publication Edition');
  const [studioSections, setStudioSections] = useState<
    Array<{ id: string; heading: string; content: string }>
  >([
    {
      id: 's1',
      heading: '1. Introduction & Historical Context',
      content:
        'Periodic trends are specific patterns in the properties of chemical elements that are revealed in the periodic table of elements. Major periodic trends include electronegativity, ionization energy, electron affinity, atomic radius, melting point, and metallic character.',
    },
    {
      id: 's2',
      heading: '2. Core Principles & Mathematical Models',
      content:
        'Ionization energy refers to the minimum amount of energy required to remove an electron from a gaseous atom or ion. It generally increases across a period from left to right due to increasing effective nuclear charge.',
    },
  ]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleQuickGenerate = async () => {
    if (!quickPrompt.trim() && attachedFiles.length === 0) {
      alert('Please enter a description or upload a file for Quick Create.');
      return;
    }

    setQuickGenerating(true);
    setQuickGenNotice(isBn ? 'এআই অনুরোধ বিশ্লেষণ করছে ও টেমপ্লেট নির্বাচন করছে...' : 'AI analyzing request & deciding optimal template...');

    await new Promise((res) => setTimeout(res, 800));
    setQuickGenNotice(isBn ? 'লেআউট ও টাইপোগ্রাফি বিন্যাস করা হচ্ছে...' : 'Synthesizing publication layout & typography...');
    await new Promise((res) => setTimeout(res, 800));
    setQuickGenNotice(isBn ? 'পিডিএফ রেন্ডারিং চূড়ান্ত করা হচ্ছে...' : 'Finalizing PDF rendering...');
    await new Promise((res) => setTimeout(res, 600));

    // Construct Document
    const generatedDoc: DocumentData = {
      id: 'doc-' + Date.now(),
      title: quickPrompt.slice(0, 45) || (isBn ? 'এআই কুইক জেনারেটেড পাবলিকেশন' : 'AI Quick Generated Document'),
      subtitle: isBn ? `পাবলিকেশন সংস্করণ • তামরীন এআই • ${new Date().toLocaleDateString('bn-BD')}` : `Publication Edition • ${quickLanguage} • ${new Date().toLocaleDateString()}`,
      author: isBn ? 'তামরীন এআই পাবলিশার' : 'Tamreen AI Publisher',
      date: new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      language: isBn ? 'bn' : 'en',
      direction: 'ltr',
      theme: 'Modern Minimalist',
      primaryFont: 'Noto Sans Bengali',
      accentColor: '#2563EB',
      hasCover: true,
      documentType: quickPrompt.toLowerCase().includes('islamic') || quickPrompt.includes('ইসলামিক')
        ? 'Islamic Manuscript'
        : quickPrompt.toLowerCase().includes('mcq') || quickPrompt.includes('প্রশ্ন')
        ? 'MCQ Question Bank'
        : quickPrompt.toLowerCase().includes('honours') || quickPrompt.includes('অনার্স')
        ? 'University Answer Sheet'
        : 'Textbook Chapter',
      sections: [
        {
          id: 'sec-q1',
          heading: isBn ? '১. বিষয়বস্তুর বিস্তৃত আলোচনা ও মূল তত্ত্ব' : '1. Comprehensive Subject Overview',
          level: 1,
          content: isBn
            ? `এই পাবলিকেশন ফাইলটি এআই দ্বারা স্বয়ংক্রিয়ভাবে সাজানো হয়েছে: "${quickPrompt}"। এতে রয়েছে সুবিন্যস্ত উপশিরোনাম, গভীর তথ্যভিত্তিক ব্যাখ্যা এবং আন্তর্জাতিক মানদণ্ডের সাইটেশন।`
            : `This publication document was synthesized automatically by AI for: "${quickPrompt}". It integrates structured headings, clear analytical explanations, and reference callouts.`,
          callout: {
            type: 'key_takeaway',
            title: isBn ? 'মূল একাডেমিক নীতি' : 'Key Academic Principle',
            text: isBn ? 'পয়েন্টভিত্তিক গঠনমূলক আলোচনা ও সঠিক রেফারেন্স ব্যবহারে উত্তরপত্রের মান বহুগুণ বৃদ্ধি পায়।' : 'Systematic study and concise note structures improve retention rates by up to 64% during final review examinations.',
          },
        },
        {
          id: 'sec-q2',
          heading: isBn ? '২. গুরুত্বপূর্ণ পরীক্ষা ভিত্তিক প্রশ্ন ও মডেল উত্তর' : '2. High-Yield Examination Questions & Model Answers',
          level: 1,
          content: isBn
            ? 'প্রশ্ন ১: সংশ্লিষ্ট বিষয়বস্তুর মূল প্রক্রিয়া ও গুরুত্ব ব্যাখ্যা করুন।\n\nউত্তর: এই বিষয়টি ৩টি প্রধান স্তম্ভের উপর নির্ভরশীল: (ক) কাঠামোগত সামঞ্জস্য, (খ) গাণিতিক ও তথ্যভিত্তিক ভারসাম্য, এবং (গ) বাস্তবে এর সঠিক প্রয়োগ।'
            : 'Q1: Explain the fundamental mechanisms governing this topic.\n\nAnswer: The mechanism relies on three core tenets: (a) Structural symmetry, (b) Quantitative balance, and (c) Contextual application in problem solving.',
        },
      ],
      references: isBn
        ? [
            'অক্সফোর্ড ইউনিভার্সিটি একাডেমি প্রেস, ২০২৬ এডিশন, অধ্যায় ৪।',
            'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড গবেষণা মোনোগ্রাফ খণ্ড ১২।',
          ]
        : [
            'Oxford University Academic Press, 2026 Edition, Chapter 4.',
            'National Education Curriculum & Research Monograph Vol. 12.',
          ],
    };

    setQuickGenerating(false);
    onDocumentGenerated(generatedDoc);
  };

  const handleSendChatMessage = async () => {
    if (!chatInputText.trim()) return;

    const userMsg = chatInputText;
    const userMsgId = 'msg-' + Date.now();
    setChatMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: userMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInputText('');
    setChatIsTyping(true);

    await new Promise((res) => setTimeout(res, 1200));

    // Simulated AI Document Creation inside Chat
    const sampleDocPayload: DocumentData = {
      ...sampleDocuments[0],
      id: 'chat-doc-' + Date.now(),
      title: userMsg.slice(0, 40) || 'AI Chat Publication',
    };

    setChatMessages((prev) => [
      ...prev,
      {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: `I have constructed a publication-grade draft based on: "${userMsg}". I selected the Oxford Academic template with structured sections, model answers, and citations.`,
        docPreview: sampleDocPayload,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatIsTyping(false);
  };

  const handleFileUploadMock = (fileType: string) => {
    const fileName = `Sample_${fileType.toUpperCase()}_Document.${fileType === 'image' ? 'png' : fileType}`;
    setAttachedFiles((prev) => [...prev, { name: fileName, type: fileType }]);
  };

  const handleManualStudioGenerate = () => {
    const manualDoc: DocumentData = {
      id: 'doc-studio-' + Date.now(),
      title: studioDocTitle,
      subtitle: studioSubtitle,
      author: 'Studio Author',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      language: 'en',
      direction: 'ltr',
      theme: (studioTheme as any) || 'Modern Minimalist',
      primaryFont: 'Inter',
      accentColor: '#2563EB',
      hasCover: studioCover,
      documentType: (studioDocType as any) || 'Textbook Chapter',
      columnCount: studioColumns,
      sections: studioSections.map((sec) => ({
        id: sec.id,
        heading: sec.heading,
        level: 1,
        content: sec.content,
      })),
    };
    onDocumentGenerated(manualDoc);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in max-w-4xl mx-auto">
      {/* ----------------------------------------------------------------- */}
      {/* TOP CREATION MODES CARDS MENU                                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>AI Publication Creation Hub</span>
          </h2>
          <button
            onClick={onCancel}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Cancel
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose your preferred creation workflow to build publication-grade PDFs in seconds.
        </p>
      </div>

      {/* 4 Large Mode Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Quick Create */}
        <div
          onClick={() => setActiveMode('quick')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer transform active:scale-98 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md ${
            activeMode === 'quick'
              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-600 ring-2 ring-blue-500/50'
              : isDarkMode
              ? 'bg-slate-900 border-slate-800 hover:border-blue-700/60 text-slate-100'
              : 'bg-white border-slate-200/80 hover:border-blue-300 text-slate-900'
          }`}
        >
          <div className="space-y-2">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                activeMode === 'quick' ? 'bg-white/20' : 'bg-gradient-to-tr from-blue-600 to-indigo-500'
              }`}
            >
              <Zap className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm">⚡ Quick Create</h3>
                {activeMode === 'quick' && (
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                    Active
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  activeMode === 'quick' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Just tell AI what you want.
              </p>
            </div>

            <div
              className={`p-2 rounded-xl text-[10px] font-mono italic ${
                activeMode === 'quick' ? 'bg-black/20 text-blue-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              "Create a Honours answer with MCQ and PDF."
            </div>
          </div>

          <button
            className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 min-h-[38px] ${
              activeMode === 'quick'
                ? 'bg-white text-blue-700 shadow'
                : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white'
            }`}
          >
            <span>Start Quick Create</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: AI Assistant */}
        <div
          onClick={() => setActiveMode('assistant')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer transform active:scale-98 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md ${
            activeMode === 'assistant'
              ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-purple-600 ring-2 ring-purple-500/50'
              : isDarkMode
              ? 'bg-slate-900 border-slate-800 hover:border-purple-700/60 text-slate-100'
              : 'bg-white border-slate-200/80 hover:border-purple-300 text-slate-900'
          }`}
        >
          <div className="space-y-2">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                activeMode === 'assistant' ? 'bg-white/20' : 'bg-gradient-to-tr from-purple-600 to-pink-500'
              }`}
            >
              <Bot className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm">🤖 AI Assistant</h3>
                {activeMode === 'assistant' && (
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                    Active
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  activeMode === 'assistant' ? 'text-purple-100' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                AI will guide you step by step. Best for beginners.
              </p>
            </div>
          </div>

          <button
            className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 min-h-[38px] ${
              activeMode === 'assistant'
                ? 'bg-white text-purple-700 shadow'
                : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-600 hover:text-white'
            }`}
          >
            <span>Start Assistant</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: AI Chat */}
        <div
          onClick={() => setActiveMode('chat')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer transform active:scale-98 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md ${
            activeMode === 'chat'
              ? 'bg-gradient-to-br from-teal-600 to-emerald-600 text-white border-teal-600 ring-2 ring-teal-500/50'
              : isDarkMode
              ? 'bg-slate-900 border-slate-800 hover:border-teal-700/60 text-slate-100'
              : 'bg-white border-slate-200/80 hover:border-teal-300 text-slate-900'
          }`}
        >
          <div className="space-y-2">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                activeMode === 'chat' ? 'bg-white/20' : 'bg-gradient-to-tr from-teal-600 to-emerald-500'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm">💬 AI Chat</h3>
                {activeMode === 'chat' && (
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                    Active
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  activeMode === 'chat' ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Talk naturally with AI.
              </p>
            </div>

            <div
              className={`p-2 rounded-xl text-[10px] font-mono italic ${
                activeMode === 'chat' ? 'bg-black/20 text-teal-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              "Create a complete book on Al Adlu wal Insaf."
            </div>
          </div>

          <button
            className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 min-h-[38px] ${
              activeMode === 'chat'
                ? 'bg-white text-teal-700 shadow'
                : 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-600 hover:text-white'
            }`}
          >
            <span>Open Chat</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Manual Studio */}
        <div
          onClick={() => setActiveMode('manual')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer transform active:scale-98 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md ${
            activeMode === 'manual'
              ? 'bg-gradient-to-br from-slate-800 to-slate-950 text-white border-slate-800 ring-2 ring-slate-700'
              : isDarkMode
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-100'
              : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900'
          }`}
        >
          <div className="space-y-2">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                activeMode === 'manual' ? 'bg-white/20' : 'bg-gradient-to-tr from-slate-700 to-slate-900'
              }`}
            >
              <Sliders className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm">🛠 Manual Studio</h3>
                {activeMode === 'manual' && (
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                    Active
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  activeMode === 'manual' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Advanced editor with complete control.
              </p>
            </div>
          </div>

          <button
            className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 min-h-[38px] ${
              activeMode === 'manual'
                ? 'bg-white text-slate-900 shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span>Open Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* MODE SPECIFIC VIEWS                                               */}
      {/* ----------------------------------------------------------------- */}

      {/* MODE 1: ⚡ QUICK CREATE */}
      {activeMode === 'quick' && (
        <div
          className={`p-6 rounded-3xl border space-y-5 animate-in fade-in ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Quick Create — Tell AI What You Want
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Zero Extra Steps
            </span>
          </div>

          {/* Large Main Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              <span>What would you like to create today?</span>
              <span className="text-slate-400 font-normal">AI builds layout & cover automatically</span>
            </label>
            <textarea
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="What would you like to create today? (e.g. Create Honours answer with MCQ and PDF, or Islamic Tafsir book on Al Adlu wal Insaf)"
              className={`w-full p-4 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px] leading-relaxed resize-y ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Example Quick Prompt Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Try Prompt Examples:</span>
            <div className="flex flex-wrap gap-2">
              {quickExamplePrompts.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuickPrompt(ex)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition text-left"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Attachment Buttons Bar */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Attach Source Content (Optional):
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              <button
                onClick={() => handleFileUploadMock('pdf')}
                className="p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 hover:border-blue-500 transition text-xs font-bold text-slate-700 dark:text-slate-300 min-h-[64px]"
              >
                <FileText className="w-4 h-4 text-rose-500" />
                <span className="text-[10px]">📄 PDF</span>
              </button>

              <button
                onClick={() => handleFileUploadMock('image')}
                className="p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 hover:border-blue-500 transition text-xs font-bold text-slate-700 dark:text-slate-300 min-h-[64px]"
              >
                <Upload className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px]">📷 Image</span>
              </button>

              <button
                onClick={() => handleFileUploadMock('docx')}
                className="p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 hover:border-blue-500 transition text-xs font-bold text-slate-700 dark:text-slate-300 min-h-[64px]"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-[10px]">📝 DOCX</span>
              </button>

              <button
                onClick={() => handleFileUploadMock('ppt')}
                className="p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 hover:border-blue-500 transition text-xs font-bold text-slate-700 dark:text-slate-300 min-h-[64px]"
              >
                <BarChart3 className="w-4 h-4 text-amber-500" />
                <span className="text-[10px]">📊 PPT</span>
              </button>

              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition text-xs font-bold min-h-[64px] ${
                  isRecording ? 'bg-rose-50 border-rose-500 text-rose-600 animate-pulse' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Mic className="w-4 h-4 text-purple-500" />
                <span className="text-[10px]">{isRecording ? 'Recording...' : '🎤 Audio'}</span>
              </button>

              <button
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 hover:border-blue-500 transition text-xs font-bold text-slate-700 dark:text-slate-300 min-h-[64px]"
              >
                <LinkIcon className="w-4 h-4 text-teal-500" />
                <span className="text-[10px]">🔗 Website</span>
              </button>

              <button
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 hover:border-blue-500 transition text-xs font-bold text-slate-700 dark:text-slate-300 min-h-[64px]"
              >
                <Youtube className="w-4 h-4 text-rose-600" />
                <span className="text-[10px]">▶ YouTube</span>
              </button>

              <button
                onClick={onOpenCameraModal}
                className="p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 hover:border-blue-500 transition text-xs font-bold text-slate-700 dark:text-slate-300 min-h-[64px]"
              >
                <Camera className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px]">📷 Camera</span>
              </button>
            </div>

            {/* URL Input Box if toggled */}
            {showUrlInput && (
              <div className="pt-2 animate-in fade-in">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste Website URL or YouTube video link..."
                  className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Attached files list */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {attachedFiles.map((file, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold border border-blue-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{file.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Target Language:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {['Auto Detect', 'Bangla', 'English', 'Arabic', 'Hindi', 'Urdu'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setQuickLanguage(lang)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    quickLanguage === lang
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Main Action Generate Button */}
          <div className="pt-3">
            <button
              onClick={handleQuickGenerate}
              disabled={quickGenerating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-extrabold text-base shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 min-h-[54px] disabled:opacity-60"
            >
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
              <span>{quickGenerating ? quickGenNotice : '✨ Generate Publication PDF'}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: 🤖 AI ASSISTANT WIZARD */}
      {activeMode === 'assistant' && (
        <CreateWizard
          currentLanguage={currentLanguage}
          isDarkMode={isDarkMode}
          initialCategory={initialCategory}
          onDocumentGenerated={onDocumentGenerated}
          onCancel={onCancel}
          onOpenCameraModal={onOpenCameraModal}
        />
      )}

      {/* MODE 3: 💬 AI CHAT MODE */}
      {activeMode === 'chat' && (
        <div
          className={`p-4 sm:p-6 rounded-3xl border space-y-4 animate-in fade-in flex flex-col h-[620px] ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-bold shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Tamreen AI Conversational Publisher
                </h3>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                  Online • Natural Language PDF Studio
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] space-y-2 p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : isDarkMode
                      ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                      : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200/80'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Embedded PDF Preview Card if AI generated one */}
                  {msg.docPreview && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900 space-y-2 text-slate-900 dark:text-white shadow-sm mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                          {msg.docPreview.documentType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Publication Ready</span>
                      </div>
                      <h4 className="font-extrabold text-xs">{msg.docPreview.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{msg.docPreview.subtitle}</p>

                      <button
                        onClick={() => onDocumentGenerated(msg.docPreview!)}
                        className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>✨ Open & Generate PDF</span>
                      </button>
                    </div>
                  )}

                  <div
                    className={`text-[9px] font-mono opacity-70 text-right ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {chatIsTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-400 italic">
                <Bot className="w-4 h-4 animate-bounce text-teal-500" />
                <span>AI is writing publication document...</span>
              </div>
            )}
          </div>

          {/* Quick Chat Triggers */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              'Create a complete book on Al Adlu wal Insaf',
              'Generate Honours answer with MCQ and PDF',
              'Oxford style research paper on Physics',
            ].map((promptText, i) => (
              <button
                key={i}
                onClick={() => {
                  setChatInputText(promptText);
                }}
                className="px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 hover:text-teal-600 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleFileUploadMock('pdf')}
              className="p-2.5 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 shrink-0"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCameraModal}
              className="p-2.5 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 shrink-0"
              title="Camera Scan"
            >
              <Camera className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="Ask AI to create any book, answer, or document..."
              className={`flex-1 px-4 py-3 rounded-2xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[46px] ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />

            <button
              onClick={handleSendChatMessage}
              disabled={!chatInputText.trim()}
              className="px-4 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition disabled:opacity-40 min-h-[46px] flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 4: 🛠 MANUAL STUDIO */}
      {activeMode === 'manual' && (
        <div
          className={`p-6 rounded-3xl border space-y-5 animate-in fade-in ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Manual Publication Studio — Full Granular Control
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              Pro Designer
            </span>
          </div>

          {/* Document Meta Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Document Title</label>
              <input
                type="text"
                value={studioDocTitle}
                onChange={(e) => setStudioDocTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subtitle / Edition</label>
              <input
                type="text"
                value={studioSubtitle}
                onChange={(e) => setStudioSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>

          {/* Control Settings Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Document Category</label>
              <select
                value={studioDocType}
                onChange={(e) => setStudioDocType(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-xs font-semibold"
              >
                <option value="Textbook Chapter">Textbook Chapter</option>
                <option value="University Answer Sheet">University Answer</option>
                <option value="MCQ Practice Book">MCQ Book</option>
                <option value="Islamic Manuscript">Islamic Manuscript</option>
                <option value="Research Paper">Research Monograph</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Style Palette</label>
              <select
                value={studioTheme}
                onChange={(e) => setStudioTheme(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-xs font-semibold"
              >
                <option value="Modern Minimalist">Modern Minimalist</option>
                <option value="Oxford Classic">Oxford Classic</option>
                <option value="Islamic Heritage">Islamic Heritage</option>
                <option value="Cambridge Teal">Cambridge Teal</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Column Layout</label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setStudioColumns(1)}
                  className={`p-2 rounded-xl text-xs font-bold border ${
                    studioColumns === 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  1 Col
                </button>
                <button
                  onClick={() => setStudioColumns(2)}
                  className={`p-2 rounded-xl text-xs font-bold border ${
                    studioColumns === 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  2 Col
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Page Margins</label>
              <select
                value={studioMargins}
                onChange={(e) => setStudioMargins(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-xs font-semibold"
              >
                <option value="normal">Normal (0.75in)</option>
                <option value="compact">Compact (0.5in)</option>
                <option value="wide">Wide Formal (1in)</option>
              </select>
            </div>
          </div>

          {/* Checkboxes Options */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={studioCover}
                onChange={(e) => setStudioCover(e.target.checked)}
                className="rounded text-slate-900 focus:ring-slate-500"
              />
              <span>Generate Cover Page</span>
            </label>

            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={studioToc}
                onChange={(e) => setStudioToc(e.target.checked)}
                className="rounded text-slate-900 focus:ring-slate-500"
              />
              <span>Include Table of Contents</span>
            </label>
          </div>

          {/* Sections Editor */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Document Sections ({studioSections.length})
              </span>
              <button
                onClick={() =>
                  setStudioSections([
                    ...studioSections,
                    {
                      id: 's-' + Date.now(),
                      heading: `${studioSections.length + 1}. New Chapter Heading`,
                      content: 'Enter section publication content...',
                    },
                  ])
                }
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {studioSections.map((sec, idx) => (
                <div key={sec.id} className="p-3 rounded-2xl border bg-slate-50 dark:bg-slate-950 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={sec.heading}
                      onChange={(e) => {
                        const updated = [...studioSections];
                        updated[idx].heading = e.target.value;
                        setStudioSections(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border text-xs font-bold"
                    />
                    {studioSections.length > 1 && (
                      <button
                        onClick={() => setStudioSections(studioSections.filter((s) => s.id !== sec.id))}
                        className="text-rose-500 p-1 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={sec.content}
                    onChange={(e) => {
                      const updated = [...studioSections];
                      updated[idx].content = e.target.value;
                      setStudioSections(updated);
                    }}
                    rows={2}
                    className="w-full p-2.5 rounded-lg border text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Build Button */}
          <div className="pt-2">
            <button
              onClick={handleManualStudioGenerate}
              className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-sm hover:opacity-90 transition shadow-md flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Sliders className="w-4 h-4" />
              <span>Open Manual Studio Canvas</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
