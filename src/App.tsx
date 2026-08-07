import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNavigation, MainTab } from './components/BottomNavigation';
import { HomePage } from './components/HomePage';
import { CreateWizard } from './components/CreateWizard';
import { TemplateMarketplace } from './components/TemplateMarketplace';
import { MyPDFsLibrary } from './components/MyPDFsLibrary';
import { ProfileView } from './components/ProfileView';
import { StudioCanvas } from './components/StudioCanvas';
import { AIAssistantModal } from './components/AIAssistantModal';
import { CameraScannerModal } from './components/CameraScannerModal';
import { sampleDocuments } from './data/sampleDocuments';
import { DocumentData, OCRResult } from './types';
import { generateDownloadablePDF, triggerPrintDialog } from './components/PDFExporter';
import { SupportedLanguage, LANGUAGE_OPTIONS } from './i18n';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function App() {
  // Main Tab Navigation
  const [mainTab, setMainTab] = useState<MainTab>('home');

  // Active Canvas Mode (whether viewing/editing a specific PDF canvas)
  const [isViewingCanvas, setIsViewingCanvas] = useState<boolean>(false);

  // Language & Theme state
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Documents State
  const [savedDocuments, setSavedDocuments] = useState<DocumentData[]>(sampleDocuments);
  const [currentDoc, setCurrentDoc] = useState<DocumentData>(sampleDocuments[0]);

  // Wizard Category Pre-selection
  const [wizardInitialCategory, setWizardInitialCategory] = useState<string>('study_notes');

  // Modals state
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(undefined);
  const [activeSectionText, setActiveSectionText] = useState<string>('');
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);

  // Export Loading Notification
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Direction (LTR vs RTL) based on language
  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === currentLanguage);
  const textDirection = currentLangObj?.dir || 'ltr';

  const handleDocumentGenerated = (newDoc: DocumentData) => {
    setSavedDocuments((prev) => [newDoc, ...prev]);
    setCurrentDoc(newDoc);
    setIsViewingCanvas(true);
  };

  const handleStartCreateWithCategory = (category?: string) => {
    if (category) setWizardInitialCategory(category);
    setMainTab('create');
    setIsViewingCanvas(false);
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
            heading: `AI ${actionType.replace('_', ' ').toUpperCase()} Section`,
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
      title: ocrData.title || prev.title,
      sections: [
        ...prev.sections,
        {
          id: 'sec-ocr-' + Date.now(),
          heading: ocrData.title ? `OCR: ${ocrData.title}` : 'Scanned Document Content',
          level: 1,
          content: ocrData.extractedText,
        },
      ],
    }));
    setIsViewingCanvas(true);
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

  const handleDeleteDocument = (docId: string) => {
    setSavedDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  return (
    <div
      dir={textDirection}
      className={`min-h-screen flex flex-col font-inter transition-colors duration-200 ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100'
          : 'bg-[#F8FAFC] text-slate-800'
      }`}
    >
      {/* Top App Bar */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onExportPDF={handleExportPDF}
        onPrintPreview={triggerPrintDialog}
        onOpenAICopilot={() => handleOpenAICopilot()}
      />

      {/* Export / Toast Notification */}
      {exportNotice && (
        <div className="fixed top-16 right-4 z-50 bg-teal-900 border border-teal-500 text-teal-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-teal-300 animate-spin" />
          <span className="text-xs font-semibold">{exportNotice}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4">
        {/* If user is in Canvas View Mode */}
        {isViewingCanvas ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between no-print bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <button
                onClick={() => setIsViewingCanvas(false)}
                className="flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 p-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to App Dashboard</span>
              </button>
              <span className="text-xs font-bold text-slate-500 truncate max-w-[200px]">
                {currentDoc.title}
              </span>
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
                currentLanguage={currentLanguage}
                isDarkMode={isDarkMode}
                onStartCreate={handleStartCreateWithCategory}
                onBrowseTemplates={() => setMainTab('templates')}
              />
            )}

            {mainTab === 'create' && (
              <CreateWizard
                currentLanguage={currentLanguage}
                isDarkMode={isDarkMode}
                initialCategory={wizardInitialCategory}
                onDocumentGenerated={handleDocumentGenerated}
                onCancel={() => setMainTab('home')}
                onOpenCameraModal={() => setCameraModalOpen(true)}
              />
            )}

            {mainTab === 'templates' && (
              <TemplateMarketplace
                currentLanguage={currentLanguage}
                isDarkMode={isDarkMode}
                onSelectTemplateDoc={(doc) => {
                  setCurrentDoc(doc);
                  setIsViewingCanvas(true);
                }}
              />
            )}

            {mainTab === 'mypdfs' && (
              <MyPDFsLibrary
                currentLanguage={currentLanguage}
                isDarkMode={isDarkMode}
                savedDocuments={savedDocuments}
                onSelectDocument={(doc) => {
                  setCurrentDoc(doc);
                  setIsViewingCanvas(true);
                }}
                onDeleteDocument={handleDeleteDocument}
                onExportPDF={handleExportPDF}
                onPrintPreview={triggerPrintDialog}
                onStartCreate={() => setMainTab('create')}
              />
            )}

            {mainTab === 'profile' && (
              <ProfileView
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                totalPdfsCount={savedDocuments.length}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavigation
        activeTab={mainTab}
        setActiveTab={(tab) => {
          setMainTab(tab);
          setIsViewingCanvas(false);
        }}
        currentLanguage={currentLanguage}
        isDarkMode={isDarkMode}
      />

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
