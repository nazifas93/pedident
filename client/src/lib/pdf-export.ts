<<<<<<< HEAD
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
=======
import jsPDF from "jspdf";
import type { Patient } from "@shared/schema";
import type { ToothData } from "@/hooks/use-dental-charting";
import { analyzeDentalChart } from "@/lib/dental-analysis"; // ✅ make sure this exists

export async function exportDentalChart(
  patient: Patient,
  toothStates: Record<string, ToothData>,
  logoBase64?: string
) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // =====================
  // LOGO + HEADER
  // =====================
  if (logoBase64) {
    pdf.addImage(logoBase64, "PNG", 20, 10, 15, 15);
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Pedident Dental Charting System", 105, 20, { align: "center" });
  pdf.setLineWidth(0.5);
  pdf.line(20, 25, 190, 25);

  // =====================
  // PATIENT INFO
  // =====================
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  const patientInfo = [
    `Patient Name : ${patient.name}`,
    `IC Number    : ${patient.icNumber}`,
    `Location     : ${patient.location || "-"}`,
    `Dentist      : ${patient.dentist || "-"}`,
    `Date         : ${new Date().toLocaleDateString()}`,
  ];
  pdf.rect(20, 30, 85, 40);
  patientInfo.forEach((info, index) => {
    pdf.text(info, 25, 40 + index * 7);
  });

  // =====================
  // LEGEND
  // =====================
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Legend:", 120, 35);

  const legendItems = [
    { label: "Sound", state: "sound" },
    { label: "Missing", state: "missing" },
    { label: "Carious", state: "carious" },
    { label: "Prosthesis", state: "prosthesis" },
  ];
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  legendItems.forEach((item, index) => {
    const itemY = 45 + index * 10;
    const color = getStateColor(item.state);
    pdf.setFillColor(color.r, color.g, color.b);
    pdf.setDrawColor(0, 0, 0);
    pdf.rect(120, itemY, 6, 5, "FD");
    pdf.text(item.label, 130, itemY + 4);
  });

  // =====================
  // SUMMARY
  // =====================
  const summary = generateSummary(toothStates);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Chart Summary:", 160, 35);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  summary.forEach((line, index) => {
    pdf.text(line, 160, 45 + index * 6);
  });

  // =====================
  // DENTAL CHART
  // =====================
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("DENTAL CHART", 105, 90, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text("Deciduous Teeth (Baby Teeth)", 20, 100);
  pdf.setFontSize(9);
  pdf.text("Upper Deciduous", 20, 108);
  drawToothRow(pdf, ["55","54","53","52","51","61","62","63","64","65"], toothStates, 35, 114, 7, 8);
  pdf.text("Lower Deciduous", 20, 128);
  drawToothRow(pdf, ["85","84","83","82","81","71","72","73","74","75"], toothStates, 35, 134, 7, 8);

  pdf.setFontSize(11);
  pdf.text("Permanent Teeth", 20, 155);
  pdf.setFontSize(9);
  pdf.text("Upper Permanent", 20, 163);
  drawToothRow(pdf, ["18","17","16","15","14","13","12","11","21","22","23","24","25","26","27","28"], toothStates, 35, 169, 7, 8);
  pdf.text("Lower Permanent", 20, 183);
  drawToothRow(pdf, ["48","47","46","45","44","43","42","41","31","32","33","34","35","36","37","38"], toothStates, 35, 189, 7, 8);

  // =====================
  // PAGE 2 - AI ANALYSIS
  // =====================
  pdf.addPage();

  const analysis = analyzeDentalChart(toothStates);
  let lines: string[] = [];

  lines.push(`DMFT Index: D=${analysis.dmft.decayed}, M=${analysis.dmft.missing}, F=${analysis.dmft.filled}, Total=${analysis.dmft.total}`);
  lines.push(`DMFS Index: D=${analysis.dmfs.decayed}, M=${analysis.dmfs.missing}, F=${analysis.dmfs.filled}, Total=${analysis.dmfs.total}`);
  lines.push(`Total Teeth Charted: ${analysis.summary.totalTeethCharted}`);
  lines.push(`Sound Teeth: ${analysis.summary.soundTeeth}`);
  lines.push(`Affected Teeth: ${analysis.summary.affectedTeeth}`);
  lines.push(`Completion: ${analysis.summary.completionPercentage.toFixed(1)}%`);

  if (analysis.patterns.length > 0) {
    lines.push("Patterns:");
    analysis.patterns.forEach((p) => lines.push(`- ${p}`));
  }

  if (analysis.recommendations.length > 0) {
    lines.push("Recommendations:");
    analysis.recommendations.forEach((r) => lines.push(`- ${r}`));
  }

  const startY = 30;
  const lineHeight = 7;

  // shaded background for AI Analysis
  pdf.setFillColor(240, 240, 240);
  pdf.setDrawColor(0, 0, 200);
  const boxHeight = lines.length * lineHeight + 20;
  pdf.rect(15, startY - 15, 180, boxHeight, "FD");

  // title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 128);
  pdf.text("AI Dental Analysis", 105, startY, { align: "center" });

  // content
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  lines.forEach((line, i) => {
    pdf.text(line, 25, startY + 10 + i * lineHeight);
  });

  // =====================
  // SAVE PDF
  // =====================
  const filename = `${patient.icNumber}_${patient.name.replace(/\s+/g, "_")}.pdf`;
  pdf.save(filename);

  // =====================
  // HELPERS
  // =====================
  function drawToothRow(
    pdf: jsPDF,
    teeth: string[],
    toothStates: Record<string, ToothData>,
    startX: number,
    startY: number,
    boxW: number,
    boxH: number
  ) {
    teeth.forEach((toothNumber, index) => {
      const x = startX + index * (boxW + 3);
      const y = startY;
      pdf.setFontSize(7);
      pdf.text(toothNumber, x + 1, y - 2);
      const state = toothStates[toothNumber];
      const color = getStateColor(state?.state);
      pdf.setFillColor(color.r, color.g, color.b);
      pdf.setDrawColor(0, 0, 0);
      pdf.rect(x, y, boxW, boxH, "FD");
    });
  }

  function getStateColor(state?: string) {
    switch (state) {
      case "sound": return { r: 255, g: 255, b: 255 };
      case "missing": return { r: 107, g: 114, b: 128 };
      case "carious": return { r: 245, g: 158, b: 11 };
      case "prosthesis": return { r: 59, g: 130, b: 246 };
      default: return { r: 255, g: 255, b: 255 };
    }
  }

  function generateSummary(toothStates: Record<string, ToothData>): string[] {
    const counts = { sound: 0, missing: 0, carious: 0, prosthesis: 0, total: Object.keys(toothStates).length };
    Object.values(toothStates).forEach((tooth) => {
      if (tooth.state) counts[tooth.state as keyof typeof counts]++;
    });
    const cariousPct = ((counts.carious / (counts.total || 1)) * 100).toFixed(1);
    let riskLevel = "Low";
    if (+cariousPct >= 20) riskLevel = "High";
    else if (+cariousPct >= 10) riskLevel = "Medium";
    return [
      `Total teeth charted: ${counts.total}`,
      `Sound teeth: ${counts.sound}`,
      `Missing teeth: ${counts.missing}`,
      `Carious teeth: ${counts.carious} (${cariousPct}%)`,
      `Prosthetic teeth: ${counts.prosthesis}`,
      `Completion: ${((counts.total / 52) * 100).toFixed(1)}%`,
      `Risk Level: ${riskLevel}`,
    ];
  }
>>>>>>> cffb21f (my commit)
}
