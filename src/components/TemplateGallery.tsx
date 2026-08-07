import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Briefcase,
  FileText,
  Building,
  CheckCircle2,
  ArrowRight,
  Globe,
} from 'lucide-react';
import { sampleDocuments } from '../data/sampleDocuments';
import { DocumentData } from '../types';

interface TemplateGalleryProps {
  onSelectTemplate: (doc: DocumentData) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate }) => {
  const categories = [
    {
      title: 'Islamic Scholars & Universities',
      icon: BookOpen,
      desc: 'Ornate manuscripts with Quranic/Hadith typography, classical borders, and RTL Arabic support.',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      sampleIndex: 0,
    },
    {
      title: 'Teachers, Students & Researchers',
      icon: GraduationCap,
      desc: 'Double-column textbook chapters, biochemical reaction Z-schemes, equations, and references.',
      color: 'from-teal-500/20 to-indigo-500/20 border-teal-500/30',
      badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
      sampleIndex: 1,
    },
    {
      title: 'Corporate & Enterprise Executives',
      icon: Briefcase,
      desc: 'Board strategy reports, financial ROI tables, and multi-column executive summaries.',
      color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30',
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      sampleIndex: 2,
    },
    {
      title: 'Publishers & Literature Creators',
      icon: FileText,
      desc: 'Bengali/English literary essays, serif display typography, and cover art headers.',
      color: 'from-rose-500/20 to-amber-500/20 border-rose-500/30',
      badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      sampleIndex: 3,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Publication Presets & Industry Templates</span>
        </div>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white tracking-tight">
          Crafted for Scholars, Teachers, Universities & Publishers
        </h2>
        <p className="text-slate-400 text-sm">
          Select any publication template below to immediately open and edit in the AI Studio Canvas.
        </p>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => {
          const sampleDoc = sampleDocuments[cat.sampleIndex] || sampleDocuments[0];
          const IconComp = cat.icon;

          return (
            <div
              key={idx}
              className={`rounded-2xl border p-6 bg-gradient-to-br ${cat.color} backdrop-blur-sm space-y-5 flex flex-col justify-between hover:scale-[1.01] transition-all shadow-xl`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-white">
                    <IconComp className="w-6 h-6 text-teal-400" />
                  </div>
                  <span className={`text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full border ${cat.badgeColor}`}>
                    {sampleDoc.documentType.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="font-playfair font-bold text-xl text-white mb-1.5">{cat.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{cat.desc}</p>
                </div>

                {/* Document Card Preview */}
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{sampleDoc.language === 'ar' ? 'العربية (RTL)' : sampleDoc.language === 'bn' ? 'বাংলা (Bengali)' : 'English'}</span>
                    <span>{sampleDoc.columnCount} Column</span>
                  </div>
                  <h4 className="font-semibold text-sm text-teal-200 line-clamp-1">{sampleDoc.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{sampleDoc.subtitle}</p>
                </div>
              </div>

              <button
                onClick={() => onSelectTemplate(sampleDoc)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Load into Studio Canvas</span>
                <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
