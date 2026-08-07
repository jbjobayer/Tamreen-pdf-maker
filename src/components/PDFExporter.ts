import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateDownloadablePDF(title: string = 'Tamreen_AI_PDF_Publication') {
  try {
    // Find all rendered A4 pages in document
    let pages = document.querySelectorAll('.pdf-page-container');

    // Fallback if user is on another screen: check if there is an active pdf paper
    if (!pages || pages.length === 0) {
      pages = document.querySelectorAll('.a4-paper');
    }

    if (!pages || pages.length === 0) {
      // Trigger print dialog as reliable fallback
      alert('পিডিএফ ডাউনলোড শুরু হচ্ছে... অনুগ্রহ করে প্রিন্ট ডায়ালগ থেকে "Save as PDF" নির্বাচন করুন।');
      window.print();
      return;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm

    for (let i = 0; i < pages.length; i++) {
      const pageElement = pages[i] as HTMLElement;

      // Ensure fonts and images are ready
      const canvas = await html2canvas(pageElement, {
        scale: 2, // 300 DPI high resolution output
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, // Fixed A4 pixel width
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(pageHeight, imgHeight));
    }

    // Clean title for PDF file saving, preserving Bengali/Unicode or fallback
    const safeTitle = title
      .trim()
      .replace(/[/\\?%*:|"<>]/g, '_')
      .replace(/\s+/g, '_') || 'Tamreen_Publication';

    pdf.save(`${safeTitle}.pdf`);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    // Reliable fallback for mobile devices
    alert('সরাসরি রেন্ডারিং করতে সমস্যা হয়েছে। "Save as PDF" মাধ্যমে ডাউনলোড করতে প্রিন্ট উইন্ডো খোলা হচ্ছে।');
    window.print();
  }
}

export function triggerPrintDialog() {
  window.print();
}

export function exportAsDocxOrText(title: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeTitle = title.trim().replace(/[/\\?%*:|"<>]/g, '_') || 'document';
  link.download = `${safeTitle}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

