import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNavigation, MainTab } from './components/BottomNavigation';
import { HomePage } from './components/HomePage';
import { CreateWizardModal } from './components/CreateWizardModal';
import { MyPDFsLibrary } from './components/MyPDFsLibrary';
import { StudioCanvas } from './components/StudioCanvas';
import { AIAssistantModal } from './components/AIAssistantModal';
import { CameraScannerModal } from './components/CameraScannerModal';
import { sampleDocuments } from './data/sampleDocuments';
import { DocumentData, OCRResult } from './types';
import { generateDownloadablePDF, triggerPrintDialog } from './components/PDFExporter';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function App() {
  // Main Navigation Tab
  const [mainTab, setMainTab] = useState<MainTab>('home');

  // Canvas Mode (when viewing/editing a specific PDF document)
  const [isViewingCanvas, setIsViewingCanvas] = useState<boolean>(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Saved Documents
  const [savedDocuments, setSavedDocuments] = useState<DocumentData[]>(sampleDocuments);
  const [currentDoc, setCurrentDoc] = useState<DocumentData>(sampleDocuments[3] || sampleDocuments[0]);

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [wizardCategory, setWizardCategory] = useState<string>('pdf_maker');
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(undefined);
  const [activeSectionText, setActiveSectionText] = useState<string>('');
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);

  // Export Toast Notification
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleOpenCreateModal = (category?: string) => {
    if (category) setWizardCategory(category);
    setCreateModalOpen(true);
  };

  const handleDocumentGenerated = (newDoc: DocumentData) => {
    setSavedDocuments((prev) => [newDoc, ...prev]);
    setCurrentDoc(newDoc);
    setIsViewingCanvas(true);
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
      setCurrentDoc((prev) => ({
        ...prev,
        sections: [
          ...prev.sections,
          {
            id: 'sec-' + Date.now(),
            heading: `এআই অনুচ্ছেদ (${actionType})`,
            level: 1,
            content: resultText,
          },
        ],
      }));
    }
  };

  const handleOCRComplete = (ocrData: OCRResult) => {
    setCurrentDoc((prev) => ({
      ...prev,
      title: ocrData.title || 'ক্যামেরা স্ক্যানকৃত পিডিএফ ডক্যুমেন্ট',
      sections: [
        ...prev.sections,
        {
          id: 'sec-ocr-' + Date.now(),
          heading: ocrData.title ? `স্ক্যান: ${ocrData.title}` : 'ক্যামেরা থেকে গৃহীত টেক্সট',
          level: 1,
          content: ocrData.extractedText,
        },
      ],
    }));
    setIsViewingCanvas(true);
  };

  const handleExportPDF = async () => {
    if (!isViewingCanvas) {
      setIsViewingCanvas(true);
    }
    setExportNotice('পাবলিকেশন মানের বাংলা A4 পিডিএফ ডাউনলোডের জন্য প্রস্তুত করা হচ্ছে...');
    try {
      await new Promise((res) => setTimeout(res, 400));
      await generateDownloadablePDF(currentDoc.title);
    } catch (err) {
      console.error(err);
    } finally {
      setExportNotice(null);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    setSavedDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleSelectSampleDoc = (category: string) => {
    const foundDoc = savedDocuments.find((d) => d.language === 'bn') || sampleDocuments[3];
    if (foundDoc) {
      setCurrentDoc(foundDoc);
      setIsViewingCanvas(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-bengali bg-[#eaf0f8] text-slate-800 antialiased selection:bg-blue-500/30">
      {/* Top Header Bar */}
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onExportPDF={handleExportPDF}
        onOpenCreateModal={() => handleOpenCreateModal()}
      />

      {/* Export / Toast Notification */}
      {exportNotice && (
        <div className="fixed top-16 right-4 z-50 bg-blue-900 border border-blue-400 text-blue-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span className="text-xs font-extrabold">{exportNotice}</span>
        </div>
      )}

      {/* Main App Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-5">
        {isViewingCanvas ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between no-print neu-flat p-3 rounded-2xl border border-white/80">
              <button
                onClick={() => setIsViewingCanvas(false)}
                className="flex items-center gap-1.5 text-xs font-black text-blue-700 neu-button px-3 py-1.5 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>হোমে ফিরে যান</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 hidden sm:inline">ডক্যুমেন্ট:</span>
                <span className="text-xs font-black text-blue-900 neu-pressed px-3 py-1 rounded-xl truncate max-w-[220px] sm:max-w-[320px]">
                  {currentDoc.title || 'শিরোনামহীন ডক্যুমেন্ট'}
                </span>
              </div>
            </div>

            <StudioCanvas
              document={currentDoc}
              setDocument={setCurrentDoc}
              onOpenAIAssistantForSection={handleOpenAICopilot}
            />
          </div>
        ) : (
          <>
            {mainTab === 'home' && (
              <HomePage
                onOpenCreateModal={handleOpenCreateModal}
                onOpenCameraOCR={() => setCameraModalOpen(true)}
                onSelectSampleDoc={handleSelectSampleDoc}
              />
            )}

            {mainTab === 'mypdfs' && (
              <MyPDFsLibrary
                currentLanguage="bn"
                isDarkMode={isDarkMode}
                savedDocuments={savedDocuments}
                onSelectDocument={(doc) => {
                  setCurrentDoc(doc);
                  setIsViewingCanvas(true);
                }}
                onDeleteDocument={handleDeleteDocument}
                onExportPDF={handleExportPDF}
                onPrintPreview={triggerPrintDialog}
                onStartCreate={() => handleOpenCreateModal()}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={mainTab}
        setActiveTab={(tab) => {
          setMainTab(tab);
          setIsViewingCanvas(false);
        }}
        onOpenCreateModal={() => handleOpenCreateModal()}
      />

      {/* "আমি কী বানাবো" Creation Wizard Modal */}
      <CreateWizardModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        initialCategory={wizardCategory}
        onDocumentGenerated={handleDocumentGenerated}
      />

      {/* AI Assistant Copilot Modal */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        sectionId={activeSectionId}
        initialText={activeSectionText}
        onApplyResult={handleApplyAIResult}
      />

      {/* Camera OCR Scanner Modal */}
      <CameraScannerModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onOCRComplete={handleOCRComplete}
      />
    </div>
  );
}
