import { jsPDF } from "jspdf";
import type { Patient } from "@shared/schema";
import type { ToothData } from "@/hooks/use-dental-charting";

export async function exportDentalChart(patient: Patient, toothStates: Record<string, ToothData>) {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Set up fonts and colors
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  
  // Header
  pdf.text('Pedident Dental Charting System', 20, 20);
  
  // Patient Information (left side)
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  const patientInfo = [
    `Patient Name: ${patient.name}`,
    `IC Number: ${patient.icNumber}`,
    `Location: ${patient.location}`,
    `Dentist:`,
    `Date: ${new Date().toLocaleDateString()}`
  ];
  
  patientInfo.forEach((info, index) => {
    pdf.text(info, 20, 40 + (index * 8));
  });

  // Legend (right side)
  drawLegend(pdf, 150, 35);

  // Chart Title (centered)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('DENTAL CHART', 130, 90);
  
  // Deciduous Teeth Section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Deciduous Teeth (Baby Teeth)', 20, 110);
  
  // Upper Deciduous
  pdf.setFontSize(10);
  pdf.text('Upper Deciduous', 20, 120);
  drawToothRow(pdf, ['55', '54', '53', '52', '51', '61', '62', '63', '64', '65'], toothStates, 30, 128);
  
  // Lower Deciduous
  pdf.text('Lower Deciduous', 20, 145);
  drawToothRow(pdf, ['85', '84', '83', '82', '81', '71', '72', '73', '74', '75'], toothStates, 30, 153);
  
  // Permanent Teeth Section
  pdf.setFontSize(12);
  pdf.text('Permanent Teeth', 20, 175);
  
  // Upper Permanent
  pdf.setFontSize(10);
  pdf.text('Upper Permanent', 20, 185);
  drawToothRow(pdf, ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'], toothStates, 30, 193);
  
  // Lower Permanent
  pdf.text('Lower Permanent', 20, 210);
  drawToothRow(pdf, ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'], toothStates, 30, 218);

  // Summary
  const summary = generateSummary(toothStates);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('Chart Summary:', 150, 140);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  summary.forEach((line, index) => {
    pdf.text(line, 150, 150 + (index * 5));
  });

  // Save the PDF
  const filename = `${patient.icNumber}_${patient.name.replace(/\s+/g, '_')}.pdf`;
  pdf.save(filename);
}

function drawToothRow(pdf: jsPDF, teeth: string[], toothStates: Record<string, ToothData>, startX: number, startY: number) {
  teeth.forEach((toothNumber, index) => {
    const x = startX + (index * 15);
    const y = startY;
    
    // Draw tooth number
    pdf.setFontSize(8);
    pdf.text(toothNumber, x + 3, y - 2);
    
    // Draw tooth box
    const state = toothStates[toothNumber];
    const color = getStateColor(state?.state);
    
    pdf.setFillColor(color.r, color.g, color.b);
    pdf.rect(x, y, 10, 12, 'FD');
    
    // Draw surfaces if detailed
    if (state?.surfaces) {
      drawToothSurfaces(pdf, x, y, state.surfaces);
    }
  });
}

function drawToothSurfaces(pdf: jsPDF, x: number, y: number, surfaces: Record<string, string>) {
  const surfacePositions = {
    occlusal: { x: x + 4, y: y + 1, w: 2, h: 2 },
    mesial: { x: x + 1, y: y + 5, w: 2, h: 2 },
    distal: { x: x + 7, y: y + 5, w: 2, h: 2 },
    lingual: { x: x + 4, y: y + 9, w: 2, h: 2 },
    buccal: { x: x + 3.5, y: y + 4, w: 3, h: 4 }
  };

  Object.entries(surfaces).forEach(([surface, state]) => {
    const pos = surfacePositions[surface as keyof typeof surfacePositions];
    if (pos) {
      const color = getStateColor(state);
      pdf.setFillColor(color.r, color.g, color.b);
      pdf.rect(pos.x, pos.y, pos.w, pos.h, 'F');
    }
  });
}

function getStateColor(state?: string) {
  switch (state) {
    case 'sound':
      return { r: 255, g: 255, b: 255 }; // White
    case 'missing':
      return { r: 107, g: 114, b: 128 }; // Gray
    case 'carious':
      return { r: 245, g: 158, b: 11 }; // Yellow
    case 'prosthesis':
      return { r: 59, g: 130, b: 246 }; // Blue
    default:
      return { r: 255, g: 255, b: 255 }; // White (default)
  }
}

function drawLegend(pdf: jsPDF, x: number, y: number) {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text('Legend:', x, y);
  
  const legendItems = [
    { label: 'Sound', state: 'sound' },
    { label: 'Missing', state: 'missing' },
    { label: 'Carious', state: 'carious' },
    { label: 'Prosthesis', state: 'prosthesis' }
  ];
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  legendItems.forEach((item, index) => {
    const itemY = y + 10 + (index * 12);
    const color = getStateColor(item.state);
    
    // Draw colored box
    pdf.setFillColor(color.r, color.g, color.b);
    pdf.setDrawColor(0, 0, 0);
    pdf.rect(x, itemY, 8, 6, 'FD');
    
    // Draw label
    pdf.text(item.label, x + 12, itemY + 4);
  });
}

function generateSummary(toothStates: Record<string, ToothData>): string[] {
  const counts = {
    sound: 0,
    missing: 0,
    carious: 0,
    prosthesis: 0,
    total: Object.keys(toothStates).length
  };
  
  Object.values(toothStates).forEach(tooth => {
    if (tooth.state) {
      counts[tooth.state as keyof typeof counts]++;
    }
  });
  
  return [
    `Total teeth charted: ${counts.total}`,
    `Sound teeth: ${counts.sound}`,
    `Missing teeth: ${counts.missing}`,
    `Carious teeth: ${counts.carious}`,
    `Prosthetic teeth: ${counts.prosthesis}`,
    `Completion: ${((counts.total / 52) * 100).toFixed(1)}%`
  ];
}
