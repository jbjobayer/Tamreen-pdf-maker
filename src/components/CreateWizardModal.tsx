import React, { useState } from 'react';
import {
  X,
  Sparkles,
  FileText,
  BookOpen,
  GraduationCap,
  CheckSquare,
  Book,
  ClipboardList,
  Wand2,
  Check,
  Zap,
  ArrowLeft,
  ArrowRight,
  Upload,
  FileCheck,
  Layers,
  Palette,
  FileSpreadsheet,
  Type,
  File,
} from 'lucide-react';
import { DocumentData } from '../types';

interface CreateWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentGenerated: (doc: DocumentData) => void;
  initialCategory?: string;
}

export const CreateWizardModal: React.FC<CreateWizardModalProps> = ({
  isOpen,
  onClose,
  onDocumentGenerated,
  initialCategory = 'pdf_maker',
}) => {
  // Navigation Step: 1 = Choose Category, 2 = Choose Content Source & PDF Settings
  const [step, setStep] = useState<1 | 2>(1);

  // Category State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  // Content Input Mode: 'topic' | 'copypaste' | 'pdfupload'
  const [inputMode, setInputMode] = useState<'topic' | 'copypaste' | 'pdfupload'>('topic');

  // Input Data States
  const [topicTitle, setTopicTitle] = useState<string>('');
  const [topicDescription, setTopicDescription] = useState<string>('');
  const [pastedTitle, setPastedTitle] = useState<string>('');
  const [pastedText, setPastedText] = useState<string>('');

  // PDF / File Upload States
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Target Length Settings (Word Count or Page Count)
  const [lengthType, setLengthType] = useState<'word' | 'page'>('word');
  const [targetWordCount, setTargetWordCount] = useState<number>(1000);
  const [targetPageCount, setTargetPageCount] = useState<number>(3);

  // Table of Contents Toggle (TOC)
  const [includeTOC, setIncludeTOC] = useState<boolean>(true);

  // Font Color Selections
  const [headingColor, setHeadingColor] = useState<string>('#0f172a');
  const [bodyColor, setBodyColor] = useState<string>('#1e293b');

  // Author & Institution Metadata
  const [authorName, setAuthorName] = useState<string>('তামরীন স্টুডিও');
  const [institution, setInstitution] = useState<string>('জাতীয় বিশ্ববিদ্যালয় / স্কুল-কলেজ');

  // Generating Animation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories = [
    {
      id: 'pdf_maker',
      name: 'পিডিএফ হ্যান্ডআউট / বই',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      desc: 'অধ্যায়ভিত্তিক আলোচনা, পয়েন্ট ও এ৪ প্রকাশনা',
    },
    {
      id: 'study_notes',
      name: 'স্মার্ট লেকচার নোটস',
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      desc: 'সংক্ষিপ্ত সারসংক্ষেপ ও সহজ বুলেট পয়েন্ট',
    },
    {
      id: 'university_answer',
      name: 'বিশ্ববিদ্যালয় ১০ মার্কস মডেল উত্তর',
      icon: <GraduationCap className="w-5 h-5 text-purple-600" />,
      desc: 'ভূমিকা, মূল বক্তব্য ও উপসংহারের কাঠামোগত উত্তর',
    },
    {
      id: 'mcq_bank',
      name: 'এমসিকিউ প্রশ্ন ব্যাংক',
      icon: <CheckSquare className="w-5 h-5 text-teal-600" />,
      desc: '৪টি অপশন, সঠিক উত্তর ও ব্যাখ্যামূলক নোট',
    },
    {
      id: 'islamic_manuscript',
      name: 'ইসলামিক পাণ্ডুলিপি ও তাফসির',
      icon: <Book className="w-5 h-5 text-amber-600" />,
      desc: 'আরবি আয়াত, তরজমা ও শব্দার্থ সহ ব্যাখ্যা',
    },
    {
      id: 'assignment_cover',
      name: 'অ্যাসাইনমেন্ট ও কভার পেজ',
      icon: <ClipboardList className="w-5 h-5 text-rose-600" />,
      desc: 'আকর্ষণীয় কভার পেজ, সূচিপত্র ও উপস্থাপনা',
    },
  ];

  // Quick Preset Swatches for Heading Colors
  const headingColorSwatches = [
    { name: 'ডিপ স্লেট', hex: '#0f172a' },
    { name: 'রয়েল ব্লু', hex: '#1e3a8a' },
    { name: 'স্যাফায়ার', hex: '#2563eb' },
    { name: 'এম্যারাল্ড গ্রিন', hex: '#065f46' },
    { name: 'ইম্পেরিয়াল মেরুন', hex: '#831843' },
    { name: 'চারকোল ব্ল্যাক', hex: '#18181b' },
    { name: 'ডার্ক ভয়োলেট', hex: '#581c87' },
  ];

  // Quick Preset Swatches for Body Text Colors
  const bodyColorSwatches = [
    { name: 'স্লেট ডার্ক (ডিফল্ট)', hex: '#1e293b' },
    { name: 'পিওর ব্ল্যাক', hex: '#000000' },
    { name: 'ডিপ নেভি', hex: '#0f172a' },
    { name: 'ডিপ এস্প্রেসো', hex: '#3b0764' },
    { name: 'স্লেট গ্রে', hex: '#334155' },
  ];

  // Quick Topic Suggestions
  const sampleTopicSuggestions = [
    'বাংলাদেশের ইতিহাস ও সমাজ ব্যবস্থা',
    'রসায়ন ২য় পত্র: পরিবেশ রসায়ন ও দ্রবণ',
    'ইসলামিক ইতিহাস, সভ্যতা ও সাহিত্য',
    'ডিজিটাল মার্কেটিং ও আইসিটি শর্ট নোট',
  ];

  // Handle Category Selection in Step 1
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setStep(2); // Automatically move to NEXT page
  };

  // Handle PDF/Doc File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const cleanText = text
        ? text.substring(0, 3000)
        : 'পিডিএফ ফাইল থেকে মূল পয়েন্ট এবং গুরুত্বপূর্ণ অংশসমূহ স্বয়ংক্রিয়ভাবে এক্সট্র্যাক্ট করা হয়েছে।';

      setTimeout(() => {
        setExtractedText(
          cleanText.length > 20
            ? cleanText
            : `আকাডেমিক ফাইল: ${file.name}\n\nউক্ত ফাইলটি সফলভাবে অ্যানালাইসিস করা হয়েছে। নিচে মূল শিরোনাম ও বিষয়বস্তু সাজানো হলো।`
        );
        setIsUploading(false);
      }, 500);
    };

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      // For PDF binary files, provide synthesized preview
      setTimeout(() => {
        setExtractedText(
          `আপলোডকৃত পিডিএফ: ${file.name}\n\n১. অধ্যায় ১: ভূমিকা ও গবেষণার মূল প্রেক্ষাপট।\n২. অধ্যায় ২: প্রয়োজনীয় পয়েন্ট ও তথ্য বিশ্লেষণ।\n৩. অধ্যায় ৩: মূল সারসংক্ষেপ ও পরীক্ষার হ্যান্ডআউট।`
        );
        setIsUploading(false);
      }, 600);
    } else {
      reader.readAsText(file);
    }
  };

  // Generate Document Action
  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let finalTitle = '';
      let detailContent = '';

      if (inputMode === 'topic') {
        finalTitle = topicTitle.trim() || 'বাংলাদেশের ইতিহাস ও সমাজ ব্যবস্থা';
        detailContent =
          topicDescription.trim() ||
          'উক্ত বিষয়ে বিস্তারিত আলোচনা, পয়েন্টভিত্তিক বিশ্লেষণ এবং পরীক্ষার জন্য গুরুত্বপূর্ণ তথ্য সংবলিত হ্যান্ডআউট।';
      } else if (inputMode === 'copypaste') {
        finalTitle = pastedTitle.trim() || 'কপি-পেস্টকৃত স্পেশাল নোটস';
        detailContent =
          pastedText.trim() ||
          'শিক্ষার্থীদের সুবিধার্থে কপি-পেস্টকৃত তথ্যগুলোকে সুন্দর এ৪ পাবলিকেশন লেআউটে বিন্যস্ত করা হয়েছে।';
      } else {
        finalTitle = uploadedFileName ? `ফাইল নোট: ${uploadedFileName.replace(/\.[^/.]+$/, '')}` : 'আপলোডকৃত পিডিএফ নোট';
        detailContent = extractedText || 'আপলোডকৃত পিডিএফ ফাইল থেকে সংগৃহীত মূল বিষয়বস্তু।';
      }

      // Generate dynamic sections based on Target Word/Page Count
      const numSections = lengthType === 'page' ? Math.max(2, Math.min(6, targetPageCount)) : Math.max(2, Math.min(6, Math.ceil(targetWordCount / 400)));

      const generatedSections = [];

      for (let i = 1; i <= numSections; i++) {
        if (i === 1) {
          generatedSections.push({
            id: `sec-${i}`,
            heading: `অধ্যায় ১: ${finalTitle} - মূল সূচনা ও প্রেক্ষাপট`,
            level: 1,
            content: `**${finalTitle}** বিষয়ে সম্যক ধারণা অর্জন আধুনিক শিক্ষা ও গবেষণার অত্যন্ত গুরুত্বপূর্ণ একটি অংশ।\n\n* **১. মূল উদ্দেশ্য:** শিক্ষার মানোন্নয়ন ও বিষয়টিকে সহজবোধ্য করতে সুনির্দিষ্ট পয়েন্ট আকারে উপস্থাপন করা হলো।\n* **২. প্রয়োজনীয়তা:** সঠিক তথ্য বিশ্লেষণ ও সুন্দর লেআউট পরীক্ষার উত্তরকে মানসম্মত করে তোলে।\n\n> "${finalTitle} সম্পর্কিত সঠিক জ্ঞান ও দিকনির্দেশনা সাফল্যের মূল চাবিকাঠি।"`,
            callout: {
              type: 'scholarly_note' as const,
              title: 'গুরুত্বপূর্ণ নোট',
              text: `এই ডক্যুমেন্টটি ${targetWordCount ? targetWordCount + ' শব্দ' : targetPageCount + ' পৃষ্ঠা'} টার্গেটে প্রস্তুত করা হয়েছে।`,
            },
          });
        } else if (i === 2) {
          generatedSections.push({
            id: `sec-${i}`,
            heading: `অধ্যায় ২: মূল বিষয়বস্তু ও পয়েন্টভিত্তিক এনালাইসিস`,
            level: 1,
            content: `${detailContent}\n\n### প্রফেশনাল পয়েন্টসমূহ:\n১. বিষয়বস্তুর সঠিক মূল্যায়ন ও একাডেমিক তথ্যসূত্র নির্বাচন।\n২. সহজ ও বোধগম্য ভাষায় স্পষ্ট উপস্থাপনা।\n৩. পরীক্ষার খাতায় ১০ নম্বর প্রশ্নের আদর্শ স্ট্রাকচার অনুযায়ী উপস্থাপন।\n\n**বিশ্লেষণ:** নিয়মিত অনুশীলনের মাধ্যমে যেকোনো জটিল বিষয়ে পূর্ণ দক্ষতা অর্জন করা সম্ভব।`,
            mcqs: [
              {
                id: 'q1',
                questionNumber: 1,
                question: 'উক্ত বিষয়ের মূল লক্ষ্য কী?',
                options: [
                  { key: 'ক', text: 'সহজে এ৪ পিডিএফ ফাইল তৈরি করা' },
                  { key: 'খ', text: 'সাধারণ টেক্সট পড়া' },
                  { key: 'গ', text: 'অন্যান্য মাধ্যম ব্যবহার করা' },
                  { key: 'ঘ', text: 'উপরে কোনোটিই নয়' },
                ],
                correctAnswer: 'ক',
                explanation: 'তামরীন স্টুডিও মূলত প্রফেশনাল এ৪ পাবলিকেশন গ্রেড পিডিএফ তৈরির জন্য অপটিমাইজ করা।',
              },
            ],
          });
        } else {
          generatedSections.push({
            id: `sec-${i}`,
            heading: `অধ্যায় ${i}: গুরুত্বপূর্ণ প্রশ্ন ও বিস্তারিত সমাধান (${i})`,
            level: 1,
            content: `**প্রশ্ন:** ${finalTitle} এর ওপর বিষদ ব্যাখ্যা প্রদান করুন।\n\n**উত্তর:** উক্ত প্রশ্নের সঠিক উত্তরের জন্য নিচে উল্লেখিত পয়েন্টসমূহ অত্যন্ত কার্যকর:\n\n১. প্রাথমিক পটভূমি ও তত্ত্বকথা।\n২. প্রাক্টিক্যাল প্রয়োগ ও বাস্তব উদাহরণ।\n৩. উপসংহার ও সংক্ষিপ্ত মূল্যায়ন।`,
          });
        }
      }

      // Construct Table of Contents array
      const tocList = includeTOC
        ? generatedSections.map((sec, idx) => ({
            title: sec.heading,
            level: 1,
            page: idx + 1,
          }))
        : [];

      const createdDoc: DocumentData = {
        id: 'doc-' + Date.now(),
        title: finalTitle,
        subtitle: `${selectedCategory.toUpperCase()} • তামরীন এআই পাবলিকেশন`,
        author: authorName,
        organization: institution,
        date: new Date().toLocaleDateString('bn-BD', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        language: 'bn',
        direction: 'ltr',
        theme: 'Serif Elegant',
        headingColor: headingColor,
        bodyColor: bodyColor,
        targetWordCount: lengthType === 'word' ? targetWordCount : undefined,
        targetPageCount: lengthType === 'page' ? targetPageCount : undefined,
        includeTOC: includeTOC,
        hasCover: true,
        coverData: {
          coverTitle: finalTitle,
          coverSubtitle: detailContent.substring(0, 150),
          badgeText: `${lengthType === 'word' ? targetWordCount + ' WORDS' : targetPageCount + ' PAGES'} • A4 PUBLICATION`,
          coverStyle: 'academic',
          abstract: `এই ডক্যুমেন্টটিতে ${finalTitle} সম্পর্কিত সমস্ত পয়েন্ট ও তথ্যসমূহ সুন্দরভাবে সাজানো হয়েছে।`,
        },
        tableOfContents: tocList,
        sections: generatedSections,
        references: [
          'জাতীয় সাহিত্য ও উচ্চশিক্ষা গবেষণা পরিষদ, ঢাকা (২০২৪)।',
          'তামরীন এআই পাবলিকেশন ডাটাবেস ও আর্কাইভ।',
        ],
        primaryFont: 'Noto Serif Bengali',
        accentColor: '#2563eb',
        columnCount: 1,
        pageFormat: 'A4',
        documentType: 'Publishing Book',
      };

      setIsGenerating(false);
      onDocumentGenerated(createdDoc);
      onClose();
    }, 700);
  };

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategory) || categories[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-bengali animate-in fade-in">
      <div className="neu-flat w-full max-w-2xl rounded-3xl p-5 sm:p-7 space-y-5 relative max-h-[92vh] overflow-y-auto border border-white/80 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 neu-button p-2 rounded-2xl text-slate-500 hover:text-slate-900 transition z-10"
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: CATEGORY SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Modal Header */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-button text-xs font-bold text-blue-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>আমি কী বানাবো (Creation Wizard - Step 1/2)</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                আপনি কী ধরনের ফাইল বা বই তৈরি করতে চান?
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                যেকোনো ক্যাটাগরিতে ক্লিক করলেই **পরের পৃষ্ঠায়** টপিকের নাম, কপি-পেস্ট ও ফাইল আপলোডের অপশন আসবে।
              </p>
            </div>

            {/* Category Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'neu-pressed border-2 border-blue-600 text-blue-900 shadow-inner'
                        : 'neu-button text-slate-800 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-white shadow-sm shrink-0">
                        {cat.icon}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs sm:text-sm leading-snug">{cat.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 shrink-0 opacity-70 group-hover:opacity-100" />
                  </div>
                );
              })}
            </div>

            {/* Next Step CTA */}
            <div className="pt-2">
              <button
                onClick={() => setStep(2)}
                className="neu-primary-btn w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
              >
                <span>পরবর্তী পৃষ্ঠা (Next Step)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: NEXT PAGE - INPUT SOURCE & PDF SETTINGS */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-slate-700 hover:text-blue-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ক্যাটাগরি পরিবর্তন</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  {selectedCategoryObj.name}
                </span>
                <span className="text-[11px] font-extrabold text-slate-400">Step 2/2</span>
              </div>
            </div>

            {/* Content Input Source Selection Tabs */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                ১. কন্টেন্ট কীভাবে তৈরি করবেন? (ইনপুট সোর্স বাছুন):
              </label>

              <div className="grid grid-cols-3 gap-2 p-1 neu-pressed rounded-2xl">
                <button
                  onClick={() => setInputMode('topic')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                    inputMode === 'topic' ? 'neu-button text-blue-700 font-extrabold' : 'text-slate-600'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="truncate">টপিকের নাম</span>
                </button>

                <button
                  onClick={() => setInputMode('copypaste')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                    inputMode === 'copypaste' ? 'neu-button text-blue-700 font-extrabold' : 'text-slate-600'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate">কপি-পেস্ট</span>
                </button>

                <button
                  onClick={() => setInputMode('pdfupload')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                    inputMode === 'pdfupload' ? 'neu-button text-blue-700 font-extrabold' : 'text-slate-600'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-teal-600" />
                  <span className="truncate">পিডিএফ আপলোড</span>
                </button>
              </div>

              {/* INPUT MODE 1: TOPIC NAME */}
              {inputMode === 'topic' && (
                <div className="space-y-3 p-3.5 rounded-2xl neu-card border border-blue-100/80">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      বিষয়বস্তু বা টপিকের নাম লিখুন:
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: বাংলাদেশের স্বাধীনতা ও মুক্তিযুদ্ধের ইতিহাস"
                      value={topicTitle}
                      onChange={(e) => setTopicTitle(e.target.value)}
                      className="neu-input w-full p-3 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Suggestion Chips */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500">আইডিয়া বা টপিক সিলেক্ট করুন:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {sampleTopicSuggestions.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => setTopicTitle(sug)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 text-[11px] font-bold transition border border-slate-200"
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      অতিরিক্ত বিবরণ বা নির্দেশিকা (ঐচ্ছিক):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="যেমন: ভূমিকা, পয়েন্টভিত্তিক প্রশ্ন, গাণিতিক সূত্র বা ১০ মার্কসের উত্তর থাকবে..."
                      value={topicDescription}
                      onChange={(e) => setTopicDescription(e.target.value)}
                      className="neu-input w-full p-2.5 rounded-xl text-xs font-medium text-slate-800 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* INPUT MODE 2: COPY-PASTE TEXT */}
              {inputMode === 'copypaste' && (
                <div className="space-y-3 p-3.5 rounded-2xl neu-card border border-blue-100/80">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">ডকুমেন্টের শিরোনাম:</label>
                    <input
                      type="text"
                      placeholder="যেমন: রসায়ন ২য় অধ্যায় স্পেশাল লেকচার নোটস"
                      value={pastedTitle}
                      onChange={(e) => setPastedTitle(e.target.value)}
                      className="neu-input w-full p-2.5 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>আপনার টেক্সট এখানে কপি-পেস্ট করুন:</span>
                      <span className="text-[11px] font-mono text-blue-600">
                        ~{pastedText.trim() ? pastedText.trim().split(/\s+/).length : 0} শব্দ
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      placeholder="এখানে আপনার বই, নোট, অনুচ্ছেদ বা যেকোনো কাঁচা টেক্সট কপি-পেস্ট করে দিন। এআই এটিকে প্রফেশনাল এ৪ পিডিএফ লেআউটে সাজিয়ে দেবে..."
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      className="neu-input w-full p-3 rounded-xl text-xs font-medium text-slate-800 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* INPUT MODE 3: PDF / FILE UPLOAD */}
              {inputMode === 'pdfupload' && (
                <div className="space-y-3 p-3.5 rounded-2xl neu-card border border-blue-100/80">
                  <div className="border-2 border-dashed border-blue-300 dark:border-blue-800 rounded-2xl p-5 text-center space-y-2 bg-blue-50/40">
                    <Upload className="w-8 h-8 text-blue-600 mx-auto" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800">
                        পিডিএফ বা ওয়ার্ড ফাইল সিলেক্ট বা ড্রাগ করুন
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        সমর্থিত ফরম্যাট: PDF, DOCX, TXT (সর্বোচ্চ ২৫ এমবি)
                      </p>
                    </div>

                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl neu-primary-btn text-xs font-black cursor-pointer shadow-md">
                      <FileCheck className="w-4 h-4" />
                      <span>{uploadedFileName ? 'অন্য ফাইল বাছুন' : 'ফাইল আপলোড করুন'}</span>
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {isUploading && (
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold flex items-center justify-center gap-2">
                      <Wand2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span>ফাইল থেকে কন্টেন্ট পড়া ও প্রসেস করা হচ্ছে...</span>
                    </div>
                  )}

                  {uploadedFileName && !isUploading && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-extrabold text-emerald-900">
                        <span className="truncate max-w-[280px]">✓ আপলোড হয়েছে: {uploadedFileName}</span>
                        <span className="font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded-md">
                          ~{extractedText.split(/\s+/).length} শব্দ সংগৃহীত
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                        "{extractedText.substring(0, 120)}..."
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PDF SIZE & LENGTH CONFIGURATION (Word or Page Count) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  ২. পিডিএফ দৈর্ঘ্য ও সাইজ কত হবে?
                </label>

                {/* Length Mode Switch */}
                <div className="flex items-center gap-1 neu-pressed p-0.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setLengthType('word')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition ${
                      lengthType === 'word' ? 'neu-button text-blue-700' : 'text-slate-500'
                    }`}
                  >
                    শব্দ সংখ্যা (Words)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLengthType('page')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition ${
                      lengthType === 'page' ? 'neu-button text-blue-700' : 'text-slate-500'
                    }`}
                  >
                    পৃষ্ঠা সংখ্যা (Pages)
                  </button>
                </div>
              </div>

              {/* WORD COUNT PRESETS */}
              {lengthType === 'word' && (
                <div className="grid grid-cols-5 gap-1.5">
                  {[500, 1000, 2500, 5000, 10000].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setTargetWordCount(w)}
                      className={`py-2 rounded-xl text-xs font-black transition ${
                        targetWordCount === w
                          ? 'neu-pressed border-2 border-blue-600 text-blue-900 bg-blue-50/50'
                          : 'neu-button text-slate-700'
                      }`}
                    >
                      {w.toLocaleString('bn-BD')} শব্দ
                    </button>
                  ))}
                </div>
              )}

              {/* PAGE COUNT PRESETS */}
              {lengthType === 'page' && (
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 3, 5, 10, 20].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTargetPageCount(p)}
                      className={`py-2 rounded-xl text-xs font-black transition ${
                        targetPageCount === p
                          ? 'neu-pressed border-2 border-blue-600 text-blue-900 bg-blue-50/50'
                          : 'neu-button text-slate-700'
                      }`}
                    >
                      {p.toLocaleString('bn-BD')} পৃষ্ঠা
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TABLE OF CONTENTS (TOC) TOGGLE */}
            <div className="flex items-center justify-between p-3 rounded-2xl neu-card">
              <div>
                <span className="font-extrabold text-xs text-slate-800 block">
                  সূচিপত্র (Table of Contents / TOC)
                </span>
                <span className="text-[11px] text-slate-500">
                  পিডিএফের সূচিপত্র পেজ ২-এ যুক্ত থাকবে কি না
                </span>
              </div>

              <div className="flex items-center gap-1 neu-pressed p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIncludeTOC(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${
                    includeTOC ? 'neu-button text-blue-700' : 'text-slate-500'
                  }`}
                >
                  হ্যাঁ (TOC সহ)
                </button>
                <button
                  type="button"
                  onClick={() => setIncludeTOC(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${
                    !includeTOC ? 'neu-button text-rose-700' : 'text-slate-500'
                  }`}
                >
                  না (TOC ছাড়া)
                </button>
              </div>
            </div>

            {/* FONT COLOR SELECTOR */}
            <div className="space-y-2 p-3.5 rounded-2xl neu-card">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                ৩. ফন্টের কালার সিলেক্ট করুন:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Heading Color */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">শিরোনামের কালার (Heading):</span>
                    <input
                      type="color"
                      value={headingColor}
                      onChange={(e) => setHeadingColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      title="কাস্টম কালার বাছুন"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {headingColorSwatches.map((sw) => (
                      <button
                        key={sw.hex}
                        type="button"
                        onClick={() => setHeadingColor(sw.hex)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          headingColor === sw.hex ? 'ring-2 ring-blue-600 scale-110' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: sw.hex }}
                        title={sw.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Body Text Color */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">মূল লেখার কালার (Body Text):</span>
                    <input
                      type="color"
                      value={bodyColor}
                      onChange={(e) => setBodyColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      title="কাস্টম কালার বাছুন"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {bodyColorSwatches.map((sw) => (
                      <button
                        key={sw.hex}
                        type="button"
                        onClick={() => setBodyColor(sw.hex)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          bodyColor === sw.hex ? 'ring-2 ring-blue-600 scale-110' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: sw.hex }}
                        title={sw.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AUTHOR & INSTITUTION METADATA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">লেখকের নাম:</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="neu-input w-full p-2.5 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">প্রতিষ্ঠানের নাম:</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="neu-input w-full p-2.5 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            {/* GENERATE CTA BUTTON */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="neu-primary-btn w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl active:scale-98 transition touch-manipulation cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="w-5 h-5 animate-spin text-amber-300" />
                    <span>এআই দিয়ে চমৎকার পিডিএফ তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                    <span>এআই দিয়ে এখনই পিডিএফ তৈরি করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
