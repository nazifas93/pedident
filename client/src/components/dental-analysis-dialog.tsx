import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FaBrain,
  FaChartBar,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import { analyzeDentalChart } from "@/lib/dental-analysis";
import type { ToothData } from "@/hooks/use-dental-charting";
import type { Patient } from "@shared/schema";

interface DentalAnalysisDialogProps {
  patient: Patient | null;
  toothStates: Record<string, ToothData>;
}

export default function DentalAnalysisDialog({
  patient,
  toothStates,
}: DentalAnalysisDialogProps) {
  if (!patient) return null;

  const analysis = analyzeDentalChart(toothStates);

  const getDMFTSeverity = (dmft: number): { color: string; label: string } => {
    if (dmft === 0)
      return { color: "bg-green-100 text-green-800", label: "Excellent" };
    if (dmft <= 2)
      return { color: "bg-yellow-100 text-yellow-800", label: "Low" };
    if (dmft <= 4)
      return { color: "bg-orange-100 text-orange-800", label: "Moderate" };
    return { color: "bg-red-100 text-red-800", label: "High" };
  };

  const dmftSeverity = getDMFTSeverity(analysis.dmft.total);

  // Ref for PDF export
  const reportRef = useRef<HTMLDivElement>(null);

  // PDF Export Function
  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    // --- Header (first page) ---
    pdf.setFontSize(14);
    pdf.text(`Dental Analysis Report`, pageWidth / 2, 15, { align: "center" });

    pdf.setFontSize(11);
    pdf.text(`Patient: ${patient?.name}`, margin, 25);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, 25, {
      align: "right",
    });

    // Convert analysis content into image
    const imgProps = (pdf as any).getImageProperties(imgData);
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 35; // push down below header

    // First page
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    // Extra pages if needed
    let pageNumber = 2;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin + 25;
      pdf.addPage();

      // Header for each new page
      pdf.setFontSize(11);
      pdf.text(`Patient: ${patient?.name}`, margin, 15);
      pdf.text(
        `Date: ${new Date().toLocaleDateString()}`,
        pageWidth - margin,
        15,
        { align: "right" }
      );

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);

      heightLeft -= pageHeight - margin * 2;
      pageNumber++;
    }

    pdf.save(`Dental-Analysis-${patient?.name}.pdf`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
          data-testid="button-ai-analysis"
        >
          <FaBrain className="mr-2" />
          AI Dental Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold text-slate-900">
            <FaBrain className="text-purple-600 mr-2" />
            AI Dental Analysis - {patient.name}
          </DialogTitle>
          <DialogDescription>
            Comprehensive clinical analysis including DMFT/DMFS calculations,
            pattern recognition, and treatment recommendations.
          </DialogDescription>
        </DialogHeader>

        {/* Wrap all report content for PDF */}
        <div ref={reportRef} className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DMFT/DMFS Indexes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FaChartBar className="text-blue-600 mr-2" />
                  Clinical Indexes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">DMFT Index</span>
                    <Badge className={dmftSeverity.color}>
                      {dmftSeverity.label} ({analysis.dmft.total})
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-red-600">
                        {analysis.dmft.decayed}
                      </div>
                      <div className="text-slate-600">Decayed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-600">
                        {analysis.dmft.missing}
                      </div>
                      <div className="text-slate-600">Missing</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-blue-600">
                        {analysis.dmft.filled}
                      </div>
                      <div className="text-slate-600">Filled</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">DMFS Index</span>
                    <span className="font-bold">{analysis.dmfs.total}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-red-600">
                        {analysis.dmfs.decayed}
                      </div>
                      <div className="text-slate-600">D-Surfaces</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-600">
                        {analysis.dmfs.missing}
                      </div>
                      <div className="text-slate-600">M-Surfaces</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-blue-600">
                        {analysis.dmfs.filled}
                      </div>
                      <div className="text-slate-600">F-Surfaces</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chart Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Teeth Charted:</span>
                  <span className="font-semibold">
                    {analysis.summary.totalTeethCharted}/32
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sound Teeth:</span>
                  <span className="font-semibold text-green-600">
                    {analysis.summary.soundTeeth}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Affected Teeth:</span>
                  <span className="font-semibold text-red-600">
                    {analysis.summary.affectedTeeth}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completion:</span>
                  <span className="font-semibold">
                    {analysis.summary.completionPercentage.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Patterns */}
            {analysis.patterns.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <FaExclamationTriangle className="text-orange-500 mr-2" />
                    Clinical Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.patterns.map((pattern, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-slate-700">{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FaCheckCircle className="text-green-600 mr-2" />
                  Treatment Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-slate-700">
                        {recommendation}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> This AI analysis is for clinical reference
              only. Professional clinical judgment should always be applied in
              treatment planning and diagnosis.
            </p>
          </div>
        </div>

        {/* Finish & Export button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleExportPDF}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Finish & Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
