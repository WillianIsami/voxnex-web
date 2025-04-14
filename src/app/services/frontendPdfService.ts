import { jsPDF } from 'jspdf';

export default class FrontendPdfService {
  generatePdf(data: any): jsPDF {
    const doc = new jsPDF();
    
    doc.setFontSize(25);
    doc.text('Your Document Title', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Customer: ${data.customerName}`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    
    return doc;
  }
  
  downloadPdf(data: any, filename: string = 'document.pdf'): void {
    const doc = this.generatePdf(data);
    doc.save(filename);
  }
  
  async getPdfBlob(data: any): Promise<Blob> {
    const doc = this.generatePdf(data);
    return doc.output('blob');
  }
  
  getPdfDataUrl(data: any): string {
    const doc = this.generatePdf(data);
    return doc.output('dataurlstring');
  }
}