import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { Contact } from './ContactService';
import type { Group } from '../context/AppContext';

export const PdfExportService = {
  exportToPdf: (contacts: Contact[], groups: Group[], title: string) => {
    const doc = new jsPDF();

    // Set Header
    doc.setFontSize(22);
    doc.setTextColor(128, 0, 0); // Royal Maroon
    doc.text(title, 105, 20, { align: 'center' });

    let yOffset = 40;

    groups.forEach(group => {
      const groupContacts = contacts.filter(c => c.groupId === group.id);
      if (groupContacts.length === 0) return;

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(group.name, 14, yOffset);
      yOffset += 5;

      const tableData = groupContacts.map(c => [c.name, c.tel.join(', ')]);
      
      (doc as any).autoTable({
        startY: yOffset,
        head: [['Name', 'Phone Number']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [128, 0, 0] },
        margin: { left: 14, right: 14 },
      });

      yOffset = (doc as any).lastAutoTable.finalY + 15;

      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
    });

    doc.save('wedding-invite-list.pdf');
  }
};
