import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Invoice, Client } from '../types';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateInvoicePDF = (invoice: Invoice, client: Client) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Add company logo/name
  doc.setFontSize(24);
  doc.setTextColor(66, 135, 245); // Blue color
  doc.text('Blueprint Studios', 20, 20);

  // Add invoice details
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Invoice #: ${invoice.number}`, 20, 40);
  doc.text(`Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 20, 47);
  doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 54);

  // Add client details
  doc.setFontSize(12);
  doc.text('Bill To:', 20, 70);
  doc.text(client.name, 20, 77);
  if (client.billingAddress) {
    doc.text(client.billingAddress.street, 20, 84);
    doc.text(`${client.billingAddress.city}, ${client.billingAddress.state} ${client.billingAddress.zip}`, 20, 91);
    doc.text(client.billingAddress.country, 20, 98);
  }
  if (client.billingEmail) {
    doc.text(client.billingEmail, 20, 105);
  }

  // Add invoice items
  const tableColumn = ['Description', 'Quantity', 'Rate', 'Amount'];
  const tableRows = invoice.items.map(item => [
    item.description,
    item.quantity.toString(),
    `$${item.rate.toFixed(2)}`,
    `$${item.amount.toFixed(2)}`
  ]);

  doc.autoTable({
    startY: 120,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [66, 135, 245],
      textColor: 255,
      fontSize: 12
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    }
  });

  // Add totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.text('Subtotal:', 120, finalY);
  doc.text(`$${invoice.subtotal.toFixed(2)}`, pageWidth - 30, finalY, { align: 'right' });
  
  doc.text('Tax:', 120, finalY + 7);
  doc.text(`$${invoice.tax.toFixed(2)}`, pageWidth - 30, finalY + 7, { align: 'right' });
  
  doc.setFontSize(14);
  doc.text('Total:', 120, finalY + 17);
  doc.text(`$${invoice.total.toFixed(2)}`, pageWidth - 30, finalY + 17, { align: 'right' });

  // Add notes and terms
  if (invoice.notes) {
    doc.setFontSize(12);
    doc.text('Notes:', 20, finalY + 35);
    doc.setFontSize(10);
    doc.text(invoice.notes, 20, finalY + 42);
  }

  if (invoice.terms) {
    doc.setFontSize(12);
    doc.text('Terms:', 20, finalY + 60);
    doc.setFontSize(10);
    doc.text(invoice.terms, 20, finalY + 67);
  }

  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(128);
  doc.text('Thank you for your business!', pageWidth / 2, doc.internal.pageSize.height - 20, { align: 'center' });

  return doc;
};

export const downloadInvoicePDF = (invoice: Invoice, client: Client) => {
  const doc = generateInvoicePDF(invoice, client);
  doc.save(`invoice-${invoice.number}.pdf`);
};

export const getInvoicePDFBlob = async (invoice: Invoice, client: Client): Promise<Blob> => {
  const doc = generateInvoicePDF(invoice, client);
  return doc.output('blob');
};
