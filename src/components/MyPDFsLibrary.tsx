import React from 'react';
import {
  Folder,
  FileText,
  Download,
  Printer,
  Share2,
  Trash2,
  ExternalLink,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { SupportedLanguage, getTranslation } from '../i18n';
import { DocumentData } from '../types';

interface MyPDFsLibraryProps {
  currentLanguage: SupportedLanguage;
  isDarkMode?: boolean;
  savedDocuments: DocumentData[];
  onSelectDocument: (doc: DocumentData) => void;
  onDeleteDocument: (docId: string) => void;
  onExportPDF: () => void;
  onPrintPreview: () => void;
  onStartCreate: () => void;
}

export const MyPDFsLibrary: React.FC<MyPDFsLibraryProps> = ({
  currentLanguage,
  isDarkMode = false,
  savedDocuments,
  onSelectDocument,
  onDeleteDocument,
  onExportPDF,
  onPrintPreview,
  onStartCreate,
}) => {
  return (
    <div className="space-y-5 pb-24 animate-in fade-in">
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-600" />
            <span>{getTranslation(currentLanguage, 'myPdfLibrary')}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {savedDocuments.length} publication documents generated & saved
          </p>
        </div>

        <button
          onClick={onStartCreate}
          className="px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition min-h-[40px]"
        >
          + Create New
        </button>
      </div>

      {/* Empty State or List */}
      {savedDocuments.length === 0 ? (
        <div className={`p-8 rounded-3xl border text-center space-y-3 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {getTranslation(currentLanguage, 'noDocsYet')}
          </p>
          <button
            onClick={onStartCreate}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md"
          >
            Create Your First PDF
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {savedDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className={`p-4 rounded-3xl border transition cursor-pointer flex flex-col sm:flex-row justify-between gap-4 shadow-sm hover:shadow-md ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 hover:border-blue-700/50'
                  : 'bg-white border-slate-200/80 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 p-0.5 shrink-0 shadow-sm">
                  <div className={`w-full h-full rounded-[14px] flex flex-col items-center justify-center p-1 text-center ${
                    isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-blue-700'
                  }`}>
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-[8px] font-bold font-mono uppercase mt-0.5">PDF</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {doc.documentType}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{doc.date}</span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{doc.subtitle || 'Publication Grade Edition'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDocument(doc);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition min-h-[36px]"
                >
                  Edit Canvas
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExportPDF();
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition min-h-[36px] min-w-[36px]"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDocument(doc.id);
                  }}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition min-h-[36px] min-w-[36px]"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
