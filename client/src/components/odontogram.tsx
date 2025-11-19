import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToothDiagram from "./tooth-diagram";
import { deciduousTeeth, permanentTeeth } from "@/lib/dental-data";
import { FaTeeth } from "react-icons/fa";
import DentalAnalysisDialog from "@/components/dental-analysis-dialog";
import { analyzeDentalChart } from "@/lib/dental-analysis";
import type { Patient } from "@shared/schema";
import type { ToothData } from "@/hooks/use-dental-charting";

interface OdontogramProps {
  currentTooth: string;
  toothStates: Record<string, ToothData>;
  selectedSurfaces: string[];
  onToothClick: (toothNumber: string) => void;
  onSurfaceClick: (toothNumber: string, surface: string) => void;
  chartingMode: 'Basic' | 'Surface Detail';
  patient: Patient; // Full patient type
}

export default function Odontogram({ 
  currentTooth, 
  toothStates, 
  selectedSurfaces,
  onToothClick, 
  onSurfaceClick,
  chartingMode,
  patient
}: OdontogramProps) {

  // AI analysis state
  const [openAnalysis, setOpenAnalysis] = useState(false);
  const [aiAnalysisText, setAiAnalysisText] = useState<string | null>(null);

  // Auto-generate AI analysis when all 32 teeth are charted
  useEffect(() => {
    const totalTeethCharted = Object.keys(toothStates).length;

    if (totalTeethCharted === 32) {
      const analysisResult = analyzeDentalChart(toothStates);

      const summaryText = `
Total Teeth Charted: ${analysisResult.summary.totalTeethCharted}/32
Sound Teeth: ${analysisResult.summary.soundTeeth}
Affected Teeth: ${analysisResult.summary.affectedTeeth}
DMFT Index: ${analysisResult.dmft.total} (Decayed: ${analysisResult.dmft.decayed}, Missing: ${analysisResult.dmft.missing}, Filled: ${analysisResult.dmft.filled})
Recommendations:
${analysisResult.recommendations.map(r => `- ${r}`).join("\n")}
      `;
      setAiAnalysisText(summaryText);
      setOpenAnalysis(true);
    }
  }, [toothStates]);

  // Function to render teeth rows
  const renderTeethRow = (teeth: string[], title: string, isLarge: boolean = false) => (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-slate-600 mb-3 text-center">{title}</h4>
      <div className="flex justify-center items-center space-x-2 flex-wrap">
        {teeth.map(toothNumber => (
          <ToothDiagram
            key={toothNumber}
            toothNumber={toothNumber}
            isActive={currentTooth === toothNumber}
            toothState={toothStates[toothNumber]}
            selectedSurfaces={currentTooth === toothNumber ? selectedSurfaces : []}
            onToothClick={onToothClick}
            onSurfaceClick={onSurfaceClick}
            isLarge={isLarge}
            chartingMode={chartingMode}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Card className="bg-white shadow-sm border border-slate-200" data-testid="odontogram-card">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="flex items-center text-lg font-semibold text-slate-900">
            <FaTeeth className="text-medical-blue mr-2" />
            Dental Chart - Odontogram
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* Deciduous Teeth */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-slate-700 mb-4 text-center" data-testid="deciduous-teeth-title">
              Deciduous Teeth (Baby Teeth)
            </h3>
            {renderTeethRow(deciduousTeeth.upper, "Upper Deciduous", true)}
            {renderTeethRow(deciduousTeeth.lower, "Lower Deciduous", true)}
          </div>

          {/* Permanent Teeth */}
          <div>
            <h3 className="text-md font-semibold text-slate-700 mb-4 text-center" data-testid="permanent-teeth-title">
              Permanent Teeth
            </h3>
            {renderTeethRow(permanentTeeth.upper, "Upper Permanent")}
            {renderTeethRow(permanentTeeth.lower, "Lower Permanent")}
          </div>

          {/* ===================================== */}
          {/* Inline AI Analysis Summary */}
          {/* ===================================== */}
          {aiAnalysisText && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-700 mb-2">
                AI Analysis Summary
              </h4>
              <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-line">
                {aiAnalysisText}
              </p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-8 flex justify-center">
            <div className="bg-slate-50 rounded-lg p-4" data-testid="legend">
              <h4 className="text-sm font-medium text-slate-700 mb-3 text-center">Legend</h4>
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white border border-slate-400 rounded"></div>
                  <span>Sound</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-carious-yellow border border-slate-400 rounded"></div>
                  <span>Carious</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-missing-gray border border-slate-400 rounded"></div>
                  <span>Missing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-prosthesis-blue border border-slate-400 rounded"></div>
                  <span>Prosthesis</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===================================== */}
      {/* AI Analysis Dialog */}
      {/* ===================================== */}
      <DentalAnalysisDialog
        patient={patient} // full Patient object
        toothStates={toothStates}
        open={openAnalysis}
        setOpen={setOpenAnalysis}
      />
    </>
  );
}
