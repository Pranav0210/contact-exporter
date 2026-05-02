import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Contact } from './ContactService';
import type { Group } from '../context/AppContext';

export const PdfExportService = {
  exportToPdf: (contacts: Contact[], groups: Group[], title: string) => {
    try {
      console.log('Generating PDF for:', title, contacts.length, 'contacts');
      const doc = new jsPDF();

      // Set Header
      doc.setFontSize(22);
      doc.setTextColor(128, 0, 0); // Royal Maroon
      doc.text(title, 105, 20, { align: 'center' });

      let yOffset = 40;

      groups.forEach(group => {
        const groupContacts = contacts.filter(c => c.groupId === group.id);
        if (groupContacts.length === 0) return;

        // Check if we need a new page before the group header
        if (yOffset > 270) {
          doc.addPage();
          yOffset = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(group.name === 'unassigned' ? 'Unassigned' : group.name, 14, yOffset);
        yOffset += 5;

        const tableData = groupContacts.map(c => [c.name, c.tel.join(', ')]);
        
        autoTable(doc, {
          startY: yOffset,
          head: [['Name', 'Phone Number']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [128, 0, 0] },
          margin: { left: 14, right: 14 },
        });

        yOffset = (doc as any).lastAutoTable.finalY + 15;
      });

      doc.save('wedding-invite-list.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Check console for details.');
    }
  }
};
