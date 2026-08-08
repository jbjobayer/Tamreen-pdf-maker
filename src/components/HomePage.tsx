import React from 'react';
import {
  Sparkles,
  PlusCircle,
  FileText,
  Camera,
  BookOpen,
  GraduationCap,
  CheckSquare,
  ClipboardList,
  Mic,
  Book,
  ArrowRight,
  Layers,
  Wand2,
  Download,
} from 'lucide-react';

interface HomePageProps {
  onOpenCreateModal: (category?: string) => void;
  onOpenCameraOCR: () => void;
  onSelectSampleDoc: (category: string) => void;
}

export interface NeumorphicTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenCreateModal,
  onOpenCameraOCR,
  onSelectSampleDoc,
}) => {
  const neumorphicTools: NeumorphicTool[] = [
    {
      id: 'pdf_maker',
      title: 'পিডিএফ পাবলিকেশন মেকার',
      description: 'যেকোনো বিষয়বস্তু দিয়ে দ্রুত পাবলিকেশন মানের সুন্দর A4 পিডিএফ বই ও হ্যান্ডআউট তৈরি করুন।',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      badge: 'A4 পিডিএফ',
    },
    {
      id: 'camera_ocr',
      title: 'ছবি স্ক্যান ও ওসিআর (Image to Text)',
      description: 'বইয়ের পাতা বা হাতে লেখা নোটের ছবি তুলে মুহূর্তেই স্ক্যান ও বাংলায় টেক্সট রূপান্তর করুন।',
      icon: <Camera className="w-6 h-6 text-emerald-600" />,
      badge: 'ক্যামেরা স্ক্যান',
    },
    {
      id: 'study_notes',
      title: 'স্মার্ট লেকচার ও চ্যাপ্টার নোটস',
      description: 'অধ্যায়ভিত্তিক সারসংক্ষেপ, পয়েন্টভিত্তিক মূলভাব ও বুলেট পয়েন্ট দিয়ে সাজানো নোট।',
      icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
      badge: 'নোট বুক',
    },
    {
      id: 'university_answer',
      title: 'বিশ্ববিদ্যালয় ১০ মার্কস মডেল উত্তর',
      description: 'অনার্স ও মাস্টার্স পরীক্ষার প্রশ্নোত্তরের আন্তর্জাতিক স্ট্যান্ডার্ড ১০ মার্কসের কাঠামো।',
      icon: <GraduationCap className="w-6 h-6 text-purple-600" />,
      badge: 'পরীক্ষার উত্তর',
    },
    {
      id: 'mcq_bank',
      title: 'এমসিকিউ প্রশ্ন ব্যাংক ও ব্যাখ্যা',
      description: 'সঠিক উত্তর, চার অপশন ও বিস্তারিত ব্যাক্যাসহ প্রস্তুতকৃত বহুনির্বাচনী প্রশ্নমালা।',
      icon: <CheckSquare className="w-6 h-6 text-teal-600" />,
      badge: 'প্রশ্ন ব্যাংক',
    },
    {
      id: 'islamic_manuscript',
      title: 'ইসলামিক তাফসির ও পাণ্ডুলিপি',
      description: 'কুরআন-হাদিসের সুন্দর আরবি ফন্ট, তরজমা ও বিস্তারিত তাফসির সংবলিত লেআউট।',
      icon: <Book className="w-6 h-6 text-amber-600" />,
      badge: 'ইসলামিক পাঠ',
    },
    {
      id: 'assignment_cover',
      title: 'অ্যাসাইনমেন্ট ও কভার পেজ',
      description: 'বিশ্ববিদ্যালয় ও কলেজের সুন্দর প্রফেশনাল কভার পেজ, সূচিপত্র ও উপস্থাপনা।',
      icon: <ClipboardList className="w-6 h-6 text-rose-600" />,
      badge: 'অ্যাসাইনমেন্ট',
    },
    {
      id: 'voice_to_pdf',
      title: 'ভয়েস দিয়ে পিডিএফ নোট',
      description: 'মুখে বলে বাংলায় নোট তৈরি করুন এবং সরাসরি প্রিন্টযোগ্য এ৪ ডকুমেন্টে সেভ করুন।',
      icon: <Mic className="w-6 h-6 text-sky-600" />,
      badge: 'ভয়েস ইনপুট',
    },
  ];

  return (
    <div className="space-y-8 pb-20 font-bengali">
      {/* Hero Banner with Main Button "আমি কী বানাবো" */}
      <div className="neu-flat p-6 sm:p-10 rounded-3xl relative overflow-hidden text-slate-800">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neu-button text-xs font-bold text-blue-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>বাংলা এআই পাবলিকেশন স্টুডিও</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            সহজেই তৈরি করুন প্রফেশনাল <span className="text-blue-700">A4 পিডিএফ ও হ্যান্ডআউট</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            আপনার বিষয়বস্তু বা প্রশ্ন লিখুন। আমাদের স্মার্ট এআই বাংলা নটো সেরিফ ফন্টে সুন্দরভাবে এ৪ কভার পেজ, সূচিপত্র ও পয়েন্টসহ পিডিএফ বানিয়ে দেবে।
          </p>

          {/* MAIN PROMINENT BUTTON: "আমি কী বানাবো" */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenCreateModal()}
              className="neu-primary-btn px-6 py-3.5 rounded-2xl font-black text-base flex items-center gap-2.5 min-h-[52px] active:scale-95 touch-manipulation cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-amber-300" />
              <span>আমি কী বানাবো</span>
            </button>

            <button
              onClick={onOpenCameraOCR}
              className="neu-button px-5 py-3.5 rounded-2xl text-slate-800 font-bold text-sm flex items-center gap-2 min-h-[52px] active:scale-95 touch-manipulation cursor-pointer"
            >
              <Camera className="w-5 h-5 text-emerald-600" />
              <span>ছবি স্ক্যান করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Neumorphic AI Tools Grid Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-blue-600" />
            <span>নিউমর্ফিক এআই টুলস (Neumorphic Tools)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            যেকোনো অপশনে ক্লিক করে আপনার পছন্দমতো ডক্যুমেন্ট তৈরি শুরু করুন
          </p>
        </div>

        <button
          onClick={() => onOpenCreateModal()}
          className="neu-button px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-700 flex items-center gap-1 hidden sm:flex"
        >
          <span>নতুন সব টুলস</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Neumorphic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {neumorphicTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => {
              if (tool.id === 'camera_ocr') {
                onOpenCameraOCR();
              } else {
                onOpenCreateModal(tool.id);
              }
            }}
            className="neu-card p-5 rounded-3xl transition-all duration-200 cursor-pointer hover:-translate-y-1 active:scale-98 flex items-start justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="neu-button p-3.5 rounded-2xl shrink-0 group-hover:scale-105 transition">
                {tool.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition">
                    {tool.title}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md neu-button text-slate-600">
                    {tool.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="neu-button p-2.5 rounded-xl shrink-0 text-slate-400 group-hover:text-blue-600 transition">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Sample Document Preview Launcher */}
      <div className="neu-flat p-6 rounded-3xl space-y-3">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>তৈরিকৃত নমুনা এ৪ পিডিএফ ডক্যুমেন্টসমূহ</span>
        </h3>
        <p className="text-xs text-slate-600">
          নিচের ডেমো ফাইলসমূহে ক্লিক করে সরাসরি বাংলা নটো সেরিফ ফন্টে এ৪ পেপার আউটপুট দেখে নিন:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => onSelectSampleDoc('study_notes')}
            className="neu-button px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-blue-700 transition"
          >
            📘 ইন্টার দ্বিতীয় বর্ষ অর্থনীতি নোট
          </button>
          <button
            onClick={() => onSelectSampleDoc('university_answer')}
            className="neu-button px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-blue-700 transition"
          >
            🎓 ঢাকা বিশ্ববিদ্যালয় অনার্স প্রশ্নোত্তর
          </button>
          <button
            onClick={() => onSelectSampleDoc('islamic_book')}
            className="neu-button px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-blue-700 transition"
          >
            🕌 সুরা আল-কাহফ তাফসির ও সারসংক্ষেপ
          </button>
        </div>
      </div>
    </div>
  );
};
