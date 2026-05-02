import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
// import type { Contact } from './ContactService';
// import type { Group } from '../context/AppContext';

export const PdfExportService = {
  exportToPdf: async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found for PDF export');
      return;
    }

    try {
      // Temporarily show the element if it's hidden, or ensure it's rendered
      const originalStyle = element.style.display;
      element.style.display = 'block';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '0';
      element.style.width = '800px'; // Standard width for PDF

      const canvas = await html2canvas(element, {
        scale: 1.5, // Balanced quality and file size
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800
      });

      // Restore original style
      element.style.display = originalStyle;
      element.style.position = '';
      element.style.left = '';
      element.style.top = '';
      element.style.width = '';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = (pdf as any).getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Handle multi-page if needed
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF with html2canvas:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }
};
