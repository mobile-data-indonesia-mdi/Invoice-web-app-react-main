import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadPdf(bodyRef, invoice_number, onDownloading) {
  if (!bodyRef.current) return;

  onDownloading(true);

  const canvas = await html2canvas(bodyRef.current, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`invoice_${invoice_number}.pdf`);

  onDownloading(false);
}