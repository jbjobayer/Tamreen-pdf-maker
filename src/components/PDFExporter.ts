import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Converts unsupported CSS oklch() color expressions to hex or rgb format
 * so that html2canvas can parse styles without throwing errors.
 */
function convertOklchToRgb(cssText: string): string {
  if (!cssText || !cssText.includes('oklch')) return cssText;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  return cssText.replace(/oklch\([^)]+\)/gi, (match) => {
    if (ctx) {
      try {
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillStyle = match;
        const converted = ctx.fillStyle;
        if (converted && converted !== 'rgba(0, 0, 0, 0)' && !converted.includes('oklch')) {
          return converted;
        }
      } catch (e) {
        // Fallback
      }
    }
    return '#2563eb'; // Fallback blue accent
  });
}

function sanitizeDocumentStyles(clonedDoc: Document) {
  // 1. Sanitize all <style> elements
  const styleTags = clonedDoc.querySelectorAll('style');
  styleTags.forEach((styleEl) => {
    if (styleEl.textContent && styleEl.textContent.includes('oklch')) {
      styleEl.textContent = convertOklchToRgb(styleEl.textContent);
    }
  });

  // 2. Sanitize styleSheets rules directly if accessible
  try {
    const styleSheets = Array.from(clonedDoc.styleSheets);
    styleSheets.forEach((sheet) => {
      try {
        const cssRules = sheet.cssRules;
        if (!cssRules) return;
        for (let i = 0; i < cssRules.length; i++) {
          const rule = cssRules[i];
          if (rule.cssText && rule.cssText.includes('oklch')) {
            const newText = convertOklchToRgb(rule.cssText);
            sheet.deleteRule(i);
            sheet.insertRule(newText, i);
          }
        }
      } catch (e) {
        // Ignore cross-origin / restriction errors
      }
    });
  } catch (e) {
    // Ignore stylesheet access errors
  }

  // 3. Sanitize inline element styles
  const allElements = clonedDoc.querySelectorAll('*');
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.style && htmlEl.style.cssText && htmlEl.style.cssText.includes('oklch')) {
      htmlEl.style.cssText = convertOklchToRgb(htmlEl.style.cssText);
    }
  });
}

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
      alert('পিডিএফ এরিয়া সনাক্ত করা যায়নি। প্রিন্ট উইন্ডো থেকে "Save as PDF" নির্বাচন করে ডাউনলোড করুন।');
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

      // Ensure fonts and images are ready & reset transform on clone
      const canvas = await html2canvas(pageElement, {
        scale: 2, // High DPI
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Clean up oklch colors in cloned CSS to prevent html2canvas parser crash
          sanitizeDocumentStyles(clonedDoc);

          const wrappers = clonedDoc.querySelectorAll('.a4-responsive-wrapper');
          wrappers.forEach((w) => {
            (w as HTMLElement).style.transform = 'none';
          });
          const paperEls = clonedDoc.querySelectorAll('.pdf-page-container, .a4-paper');
          paperEls.forEach((p) => {
            (p as HTMLElement).style.boxShadow = 'none';
          });
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(pageHeight, imgHeight));
    }

    // Clean title for PDF file saving
    const safeTitle = title
      .trim()
      .replace(/[/\\?%*:|"<>]/g, '_')
      .replace(/\s+/g, '_') || 'Tamreen_Publication';

    pdf.save(`${safeTitle}.pdf`);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    // Reliable fallback for mobile & desktop devices
    alert('সরাসরি রেন্ডারিং করতে সমস্যা হয়েছে। "Save as PDF" এর মাধ্যমে ডাউনলোড করতে প্রিন্ট উইন্ডো খোলা হচ্ছে।');
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


