import React, { useState } from 'react';
import { Sparkles, Wand2, Globe, BookOpen, Layers, Check, X, AlertCircle } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId?: string;
  initialText?: string;
  onApplyResult: (resultText: string, actionType: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  initialText = '',
  onApplyResult,
}) => {
  const [inputText, setInputText] = useState<string>(initialText);
  const [action, setAction] = useState<string>('academic_rewrite');
  const [targetLang, setTargetLang] = useState<string>('Bengali');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteAI = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          action,
          targetLang,
        }),
      });

      const data = await response.json();
      if (data.success && data.resultText) {
        setResultText(data.resultText);
      } else {
        setErrorMsg(data.error || 'AI enhancement failed.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to connect to AI server.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white shadow-md">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-playfair font-bold text-lg text-white">AI Studio Copilot</h3>
            <p className="text-xs text-slate-400">Transform, polish, translate, or expand document content</p>
          </div>
        </div>

        {/* Action Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => setAction('academic_rewrite')}
            className={`p-2.5 rounded-xl border text-left transition ${
              action === 'academic_rewrite'
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-1 text-teal-400" />
            <span className="font-semibold block">Academic Polish</span>
            <span className="text-[10px] text-slate-500">Elevate prose quality</span>
          </button>

          <button
            onClick={() => setAction('translate')}
            className={`p-2.5 rounded-xl border text-left transition ${
              action === 'translate'
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 mb-1 text-amber-400" />
            <span className="font-semibold block">Translate</span>
            <span className="text-[10px] text-slate-500">Arabic / Bengali / English</span>
          </button>

          <button
            onClick={() => setAction('islamic_citations')}
            className={`p-2.5 rounded-xl border text-left transition ${
              action === 'islamic_citations'
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-1 text-emerald-400" />
            <span className="font-semibold block">Islamic Citations</span>
            <span className="text-[10px] text-slate-500">Add Quranic/Scholarly quotes</span>
          </button>

          <button
            onClick={() => setAction('summarize_takeaways')}
            className={`p-2.5 rounded-xl border text-left transition ${
              action === 'summarize_takeaways'
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 mb-1 text-cyan-400" />
            <span className="font-semibold block">Key Takeaways</span>
            <span className="text-[10px] text-slate-500">Generate executive summary</span>
          </button>

          <button
            onClick={() => setAction('expand')}
            className={`p-2.5 rounded-xl border text-left transition ${
              action === 'expand'
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-4 h-4 mb-1 text-rose-400" />
            <span className="font-semibold block">Expand Content</span>
            <span className="text-[10px] text-slate-500">Add deeper analysis & examples</span>
          </button>
        </div>

        {action === 'translate' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Target Language:</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none"
            >
              <option value="Arabic">Arabic (العربية)</option>
              <option value="Bengali">Bengali (বাংলা)</option>
              <option value="English">English</option>
              <option value="French">French</option>
            </select>
          </div>
        )}

        {/* Input Text Area */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-medium">Content Context</label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter or select text to enhance..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Output Area */}
        {resultText && (
          <div className="space-y-2 p-4 bg-slate-950 border border-teal-500/30 rounded-xl">
            <div className="flex items-center justify-between text-xs text-teal-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Enhancement Result:</span>
              </span>
              <button
                onClick={() => {
                  onApplyResult(resultText, action);
                  onClose();
                }}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply to Document</span>
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-serif italic max-h-48 overflow-y-auto">
              {resultText}
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleExecuteAI}
            disabled={isProcessing}
            className="px-5 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI Action</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
