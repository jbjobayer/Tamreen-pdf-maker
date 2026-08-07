import React, { useState } from 'react';
import { Header } from './components/Header';
import { StudioCanvas } from './components/StudioCanvas';
import { InputPanel } from './components/InputPanel';
import { TemplateGallery } from './components/TemplateGallery';
import { AIAssistantModal } from './components/AIAssistantModal';
import { CameraScannerModal } from './components/CameraScannerModal';
import { sampleDocuments } from './data/sampleDocuments';
import { DocumentData, OCRResult } from './types';
import { generateDownloadablePDF, triggerPrintDialog } from './components/PDFExporter';
import { Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'input' | 'templates' | 'presets'>('studio');
  const [currentDoc, setCurrentDoc] = useState<DocumentData>(sampleDocuments[0]);

  // Modals state
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(undefined);
  const [activeSectionText, setActiveSectionText] = useState<string>('');
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);

  // Status & Export loading
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleDocumentGenerated = (newDoc: DocumentData) => {
    setCurrentDoc(newDoc);
    setActiveTab('studio');
  };

  const handleOpenAICopilot = (sectionId?: string, currentText?: string) => {
    setActiveSectionId(sectionId);
    setActiveSectionText(currentText || '');
    setAiModalOpen(true);
  };

  const handleApplyAIResult = (resultText: string, actionType: string) => {
    if (activeSectionId) {
      setCurrentDoc((prev) => ({
        ...prev,
        sections: prev.sections.map((sec) =>
          sec.id === activeSectionId ? { ...sec, content: resultText } : sec
        ),
      }));
    } else {
      // Append as new section or update summary
      setCurrentDoc((prev) => ({
        ...prev,
        sections: [
          ...prev.sections,
          {
            id: 'sec-' + Date.now(),
            heading: `AI ${actionType.replace('_', ' ').toUpperCase()} Section`,
            level: 1,
            content: resultText,
          },
        ],
      }));
    }
  };

  const handleOCRComplete = (ocrData: OCRResult) => {
    // Convert OCR extracted text into a new section or document update
    setCurrentDoc((prev) => ({
      ...prev,
      title: ocrData.title || prev.title,
      sections: [
        ...prev.sections,
        {
          id: 'sec-ocr-' + Date.now(),
          heading: ocrData.title ? `OCR: ${ocrData.title}` : 'Scanned Notebook / Page Content',
          level: 1,
          content: ocrData.extractedText,
        },
      ],
    }));
    setActiveTab('studio');
  };

  const handleExportPDF = async () => {
    setExportNotice('Generating high-resolution publication PDF...');
    try {
      await generateDownloadablePDF(currentDoc.title);
    } catch (err) {
      console.error(err);
    } finally {
      setExportNotice(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-inter">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportPDF={handleExportPDF}
        onPrintPreview={triggerPrintDialog}
        onOpenAICopilot={() => handleOpenAICopilot()}
        documentTitle={currentDoc.title}
        isGenerating={isGenerating}
      />

      {/* Export / Toast Notification */}
      {exportNotice && (
        <div className="fixed top-16 right-4 z-50 bg-teal-900 border border-teal-500 text-teal-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-teal-300 animate-spin" />
          <span className="text-xs font-semibold">{exportNotice}</span>
        </div>
      )}

      {/* Main Body Container */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'studio' && (
          <StudioCanvas
            document={currentDoc}
            setDocument={setCurrentDoc}
            onOpenAIAssistantForSection={handleOpenAICopilot}
          />
        )}

        {activeTab === 'input' && (
          <InputPanel
            onDocumentGenerated={handleDocumentGenerated}
            onOpenCameraModal={() => setCameraModalOpen(true)}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        )}

        {activeTab === 'templates' && (
          <TemplateGallery
            onSelectTemplate={(doc) => {
              setCurrentDoc(doc);
              setActiveTab('studio');
            }}
          />
        )}

        {activeTab === 'presets' && (
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="font-playfair text-3xl font-bold text-white">Preset Publication Library</h2>
              <p className="text-xs text-slate-400">
                Click any preset to immediately view and edit in Adobe InDesign Studio mode.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setCurrentDoc(doc);
                    setActiveTab('studio');
                  }}
                  className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-teal-500/50 transition cursor-pointer space-y-3 shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono uppercase bg-slate-950 px-2.5 py-1 rounded-full text-teal-300 border border-slate-800">
                      {doc.documentType}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {doc.language === 'ar' ? 'Arabic (RTL)' : doc.language === 'bn' ? 'Bengali' : 'English'}
                    </span>
                  </div>

                  <h3 className="font-playfair font-bold text-lg text-white">{doc.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{doc.subtitle}</p>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>Author: {doc.author}</span>
                    <span className="text-teal-400 font-semibold flex items-center gap-1">
                      <span>Open Canvas</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* AI Copilot Modal */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        sectionId={activeSectionId}
        initialText={activeSectionText}
        onApplyResult={handleApplyAIResult}
      />

      {/* Camera OCR Modal */}
      <CameraScannerModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onOCRComplete={handleOCRComplete}
      />
    </div>
  );
}
