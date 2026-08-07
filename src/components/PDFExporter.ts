import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateDownloadablePDF(title: string = 'publication_document') {
  const pages = document.querySelectorAll('.pdf-page-container');
  if (!pages || pages.length === 0) {
    alert('No document pages found to export.');
    return;
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210; // A4 width in mm

  for (let i = 0; i < pages.length; i++) {
    const pageElement = pages[i] as HTMLElement;

    // Capture DOM element using html2canvas
    const canvas = await html2canvas(pageElement, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(297, imgHeight));
  }

  const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/gi, '_');
  pdf.save(`${sanitizedTitle}_ai_pdf_studio.pdf`);
}

export function triggerPrintDialog() {
  window.print();
}
