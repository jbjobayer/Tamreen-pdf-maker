import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, CheckCircle2, X, AlertCircle, Sparkles, Upload } from 'lucide-react';
import { OCRResult } from '../types';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOCRComplete: (ocrData: OCRResult) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onOCRComplete,
}) => {
  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const startCamera = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Camera access unavailable. You can upload a photo of the notebook or page instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunOCR = async () => {
    if (!capturedImage) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ocr-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: capturedImage,
          mimeType: 'image/jpeg',
        }),
      });

      const data = await response.json();
      if (data.success && data.ocrResult) {
        onOCRComplete(data.ocrResult);
        onClose();
      } else {
        setErrorMsg(data.error || 'OCR processing failed.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to process image OCR.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-playfair font-bold text-lg text-white">Camera Page & Notebook Scanner</h3>
            <p className="text-xs text-slate-400">OCR & Document Structure Extraction with Gemini AI</p>
          </div>
        </div>

        {/* Camera View / Image Preview Box */}
        <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {!capturedImage && !streamActive && (
            <div className="text-center p-6 space-y-3">
              <Camera className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Scan printed pages, notebooks, textbooks, or handwritten documents
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Camera Live Scan</span>
                </button>
                <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer flex items-center gap-1.5 border border-slate-700">
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span>Upload Page Image</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* Live Video Feed */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${streamActive ? 'block' : 'hidden'}`}
            playsInline
            muted
          />

          {/* Captured Image Preview */}
          {capturedImage && (
            <img src={capturedImage} alt="Captured Page" className="w-full h-full object-contain" />
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          {streamActive && (
            <button
              onClick={capturePhoto}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Photo Frame</span>
            </button>
          )}

          {capturedImage && !streamActive && (
            <div className="w-full flex gap-2">
              <button
                onClick={() => setCapturedImage(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake / Choose Another</span>
              </button>

              <button
                onClick={handleRunOCR}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Extracting Text & OCR...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-200" />
                    <span>Process OCR & Structure Page</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
