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
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [topicTitle, setTopicTitle] = useState<string>('');
  const [topicDescription, setTopicDescription] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('তামরীন স্টুডিও');
  const [institution, setInstitution] = useState<string>('জাতীয় বিশ্ববিদ্যালয় / স্কুল-কলেজ');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories = [
    {
      id: 'pdf_maker',
      name: 'পিডিএফ হ্যান্ডআউট / বই',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      desc: 'অধ্যায়ভিত্তিক আলোচনা ও পয়েন্ট',
    },
    {
      id: 'study_notes',
      name: 'স্মার্ট লেকচার নোটস',
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      desc: 'সংক্ষিপ্ত সারসংক্ষেপ ও বুলেট পয়েন্ট',
    },
    {
      id: 'university_answer',
      name: 'বিশ্ববিদ্যালয় ১০ মার্কস মডেল উত্তর',
      icon: <GraduationCap className="w-5 h-5 text-purple-600" />,
      desc: 'ভূমিকা, মূল বক্তব্য ও উপসংহার',
    },
    {
      id: 'mcq_bank',
      name: 'এমসিকিউ প্রশ্ন ব্যাংক',
      icon: <CheckSquare className="w-5 h-5 text-teal-600" />,
      desc: '৪টি অপশন ও উত্তরের ব্যাখ্যা',
    },
    {
      id: 'islamic_manuscript',
      name: 'ইসলামিক পাণ্ডুলিপি ও তাফসির',
      icon: <Book className="w-5 h-5 text-amber-600" />,
      desc: 'আরবি আয়াত, তরজমা ও তাফসির',
    },
    {
      id: 'assignment_cover',
      name: 'অ্যাসাইনমেন্ট ও কভার পেজ',
      icon: <ClipboardList className="w-5 h-5 text-rose-600" />,
      desc: 'কভার পেজ, সূচিপত্র ও উপস্থাপনা',
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const finalTitle = topicTitle.trim() || 'বাংলাদেশের ইতিহাস ও সমাজ ব্যবস্থা';
      const detail = topicDescription.trim() || 'উক্ত বিষয়ে বিস্তারিত আলোচনা, পয়েন্টভিত্তিক বিশ্লেষণ এবং পরীক্ষার জন্য গুরুত্বপূর্ণ তথ্য সংবলিত হ্যান্ডআউট।';

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
        hasCover: true,
        coverData: {
          coverTitle: finalTitle,
          coverSubtitle: detail,
          badgeText: 'A4 PUBLICATION EDITION',
          coverStyle: 'academic',
          abstract: `এই ডক্যুমেন্টটিতে ${finalTitle} সম্পর্কিত গুরুত্বপূর্ণ তথ্যসমূহ সুন্দরভাবে বাংলা নটো সেরিফ ফন্টে সাজানো হয়েছে।`,
        },
        tableOfContents: [
          { level: 1, page: 1, title: 'অধ্যায় ১: ভূমিকা ও প্রাথমিক ধারণা' },
          { level: 1, page: 2, title: 'অধ্যায় ২: মূল বিষয়বস্তু ও পয়েন্টভিত্তিক এনালাইসিস' },
          { level: 1, page: 3, title: 'অধ্যায় ৩: বহুনির্বাচনী প্রশ্ন ও সংক্ষিপ্ত উত্তর' },
          { level: 1, page: 4, title: 'অধ্যায় ৪: উপসংহার ও প্রয়োজনীয় নির্দেশিকা' },
        ],
        sections: [
          {
            id: 'sec-1',
            heading: 'অধ্যায় ১: ভূমিকা ও প্রাথমিক ধারণা',
            level: 1,
            content: `**${finalTitle}** বিষয়ে সম্যক ধারণা অর্জন আধুনিক শিক্ষার অত্যন্ত গুরুত্বপূর্ণ একটি অংশ।\n\n* **১. প্রেক্ষাপট ও মূল উদ্দেশ্য:** শিক্ষার মানোন্নয়ন ও শিক্ষার্থীদের সুবিধার্থে বিষয়টি পয়েন্ট আকারে উপস্থাপিত করা হয়েছে।\n* **২. প্রয়োজনীয়তা:** সঠিক তথ্য বিশ্লেষণ ও পরীক্ষার প্রস্তুতিকে সহজ করতে এই হ্যান্ডআউট তৈরি করা হয়েছে।\n\n> "শিক্ষা হলো এমন এক শক্তিশালী হাতিয়ার যা বিশ্বকে পরিবর্তন করতে ব্যবহার করা যায়।"`,
            callout: {
              type: 'scholarly_note',
              title: 'বিশেষ দ্রষ্টব্য',
              text: 'এই অনুচ্ছেদটি এআই প্রযুক্তির মাধ্যমে স্বয়ংক্রিয়ভাবে প্রফেশনাল এ৪ প্রিন্টিং ফরম্যাটে রূপান্তর করা হয়েছে।',
            },
          },
          {
            id: 'sec-2',
            heading: 'অধ্যায় ২: মূল বিষয়বস্তু ও প্রশ্ন বিশ্লেষণ',
            level: 1,
            content: `${detail}\n\n### গুরুত্বপূর্ণ পয়েন্টসমূহ:\n১. বিষয়বস্তুর সঠিক মূল্যায়ন ও তথ্যসূত্র নির্বাচন।\n২. সহজ ও বোধগম্য ভাষায় পয়েন্ট উপস্থাপন।\n৩. পরীক্ষার খাতায় ১০ নম্বর প্রশ্নের আদর্শ উত্তর প্রদান।\n\n**বিশ্লেষণ:** বিস্তারিত অধ্যয়ন ও নিয়মিত অনুশীলনের মাধ্যমে যেকোনো বিষয়ের ওপর পূর্ণ দক্ষতা অর্জন করা সম্ভব।`,
            mcqs: [
              {
                id: 'q1',
                questionNumber: 1,
                question: 'উক্ত আলোচনার মূল উদ্দেশ্য কী?',
                options: [
                  { key: 'ক', text: 'সহজে এ৪ পিডিএফ ফাইল তৈরি করা' },
                  { key: 'খ', text: 'ইংরেজি ভাষা শেখা' },
                  { key: 'গ', text: 'কম্পিউটার হার্ডওয়্যার কেনা' },
                  { key: 'ঘ', text: 'উপরে কোনোটিই নয়' },
                ],
                correctAnswer: 'ক',
                explanation: 'তামরীন এআই স্টুডিও মূলত বাংলা ভাষায় খুব সহজে নিখুঁত এ৪ ডক্যুমেন্ট ও পিডিএফ তৈরির জন্য ডিজাইন করা হয়েছে।',
              },
              {
                id: 'q2',
                questionNumber: 2,
                question: 'কোন ফন্টটি তামরীন এআই স্টুডিওতে ডিফল্ট বাংলা ফন্ট হিসেবে ব্যবহৃত হয়?',
                options: [
                  { key: 'ক', text: 'টাইম নিউ রোমান (Times New Roman)' },
                  { key: 'খ', text: 'নটো সেরিফ বাংলা (Noto Serif Bengali)' },
                  { key: 'গ', text: 'আরিয়াল (Arial)' },
                  { key: 'ঘ', text: 'ইন্টার (Inter)' },
                ],
                correctAnswer: 'খ',
                explanation: 'নটো সেরিফ বাংলা ফন্টটি বই ও প্রফেশনাল প্রকাশনার জন্য আন্তর্জাতিকভাবে স্বীকৃত।',
              },
            ],
          },
          {
            id: 'sec-3',
            heading: 'অধ্যায় ৩: সারসংক্ষেপ ও উপসংহার',
            level: 1,
            content: `সার্বিকভাবে বিবেচনা করলে, **${finalTitle}** বিষয়টি অত্যন্ত সময়োপযোগী ও তাৎপর্যপূর্ণ। নিচে প্রদত্ত তথ্যসূত্রসমূহ থেকে বিস্তারিত অধ্যয়ন করা যেতে পারে।\n\n১. জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) গবেষণা বুলেটিন।\n২. ঢাকা বিশ্ববিদ্যালয় বাংলা রিসার্চ জার্নাল (২০২৪)।`,
          },
        ],
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
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 font-bengali animate-in fade-in">
      <div className="neu-flat w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto border border-white/80">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 neu-button p-2 rounded-2xl text-slate-500 hover:text-slate-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-button text-xs font-bold text-blue-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>আমি কী বানাবো (Creation Wizard)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            আপনি কী তৈরি করতে চান নির্বাচন করুন
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            বিষয়বস্তুর নাম লিখলেই এআই সুন্দর বাংলা নটো সেরিফ ফন্টে এ৪ পিডিএফ রেডি করে দেবে।
          </p>
        </div>

        {/* Category Selector Grid */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
            ১. ক্যাটাগরি বাছুন:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'neu-pressed border-2 border-blue-600 text-blue-900'
                      : 'neu-button text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white shadow-sm shrink-0">
                      {cat.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs leading-snug">{cat.name}</h4>
                      <p className="text-[11px] text-slate-500">{cat.desc}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 font-bold" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
              ২. বিষয়বস্তু বা টপিকের নাম লিখুন:
            </label>
            <input
              type="text"
              placeholder="যেমন: বাংলাদেশের মুক্তিযুদ্ধ ও ইতিহাস / রসায়ন ২য় অধ্যায় নোট"
              value={topicTitle}
              onChange={(e) => setTopicTitle(e.target.value)}
              className="neu-input w-full p-3.5 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
              ৩. অতিরিক্ত বিবরণ / প্রশ্নের বিস্তারিত (ঐচ্ছিক):
            </label>
            <textarea
              rows={3}
              placeholder="যেমন: অনুচ্ছেদ ১ এ ভূমিকা থাকবে, অনুচ্ছেদ ২ এ পয়েন্টভিত্তিক প্রশ্ন ও উত্তর থাকবে..."
              value={topicDescription}
              onChange={(e) => setTopicDescription(e.target.value)}
              className="neu-input w-full p-3 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">লেখক / লেখকের নাম:</label>
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
        </div>

        {/* Generate CTA Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="neu-primary-btn w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl active:scale-98 transition touch-manipulation cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Wand2 className="w-5 h-5 animate-spin text-amber-300" />
                <span>এআই পিডিএফ জেনারেট হচ্ছে...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                <span>এআই দিয়ে এখনই পিডিএফ বানান</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
