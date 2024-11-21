import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from '../types';

export const generateInvoicePDF = (invoice: Invoice): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Company Info
  doc.setFontSize(20);
  doc.text('Blueprint Studios', margin, 20);
  doc.setFontSize(10);
  doc.text('123 Design Street', margin, 30);
  doc.text('San Francisco, CA 94105', margin, 35);
  doc.text('United States', margin, 40);
  doc.text('contact@blueprintstudios.tech', margin, 45);

  // Invoice Details
  doc.setFontSize(16);
  doc.text('INVOICE', pageWidth - margin - 40, 20);
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - margin - 40, 30);
  doc.text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, pageWidth - margin - 40, 35);
  doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, pageWidth - margin - 40, 40);

  // Client Info
  if (invoice.client) {
    doc.setFontSize(12);
    doc.text('Bill To:', margin, 60);
    doc.setFontSize(10);
    doc.text(invoice.client.name, margin, 70);
    if (invoice.client.billingAddress) {
      doc.text(invoice.client.billingAddress.street, margin, 75);
      doc.text(`${invoice.client.billingAddress.city}, ${invoice.client.billingAddress.state} ${invoice.client.billingAddress.zip}`, margin, 80);
      doc.text(invoice.client.billingAddress.country, margin, 85);
    }
    if (invoice.client.billingEmail) {
      doc.text(`Email: ${invoice.client.billingEmail}`, margin, 90);
    }
  }

  // Items Table
  const tableData = invoice.items.map(item => [
    item.description,
    item.quantity.toString(),
    `$${item.rate.toFixed(2)}`,
    `$${item.amount.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 100,
    head: [['Description', 'Quantity', 'Rate', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [66, 133, 244],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' }
    }
  });

  // Summary
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(10);
  doc.text('Subtotal:', pageWidth - margin - 80, finalY + 20);
  doc.text(`$${invoice.subtotal.toFixed(2)}`, pageWidth - margin - 20, finalY + 20, { align: 'right' });
  
  doc.text('Tax:', pageWidth - margin - 80, finalY + 30);
  doc.text(`$${invoice.tax.toFixed(2)}`, pageWidth - margin - 20, finalY + 30, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', pageWidth - margin - 80, finalY + 40);
  doc.text(`$${invoice.total.toFixed(2)}`, pageWidth - margin - 20, finalY + 40, { align: 'right' });

  // Notes
  if (invoice.notes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Notes:', margin, finalY + 60);
    doc.text(invoice.notes, margin, finalY + 70);
  }

  // Terms
  if (invoice.terms) {
    doc.setFontSize(10);
    doc.text('Terms & Conditions:', margin, finalY + 90);
    doc.text(invoice.terms, margin, finalY + 100);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text(`Invoice #${invoice.invoiceNumber} - Generated on ${new Date().toLocaleDateString()}`, margin, doc.internal.pageSize.height - 10);

  return doc;
};

export const downloadInvoicePDF = (invoice: Invoice): void => {
  const doc = generateInvoicePDF(invoice);
  const fileName = `invoice-${invoice.invoiceNumber}.pdf`;
  doc.save(fileName);
};
