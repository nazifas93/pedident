import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FaBrain, FaChartBar, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { analyzeDentalChart, type DentalAnalysis } from "@/lib/dental-analysis";
import type { ToothData } from "@/hooks/use-dental-charting";
import type { Patient } from "@shared/schema";

interface DentalAnalysisDialogProps {
  patient: Patient | null;
  toothStates: Record<string, ToothData>;
}

export default function DentalAnalysisDialog({ patient, toothStates }: DentalAnalysisDialogProps) {
  if (!patient) return null;

  const analysis = analyzeDentalChart(toothStates);

  const getDMFTSeverity = (dmft: number): { color: string; label: string } => {
    if (dmft === 0) return { color: "bg-green-100 text-green-800", label: "Excellent" };
    if (dmft <= 2) return { color: "bg-yellow-100 text-yellow-800", label: "Low" };
    if (dmft <= 4) return { color: "bg-orange-100 text-orange-800", label: "Moderate" };
    return { color: "bg-red-100 text-red-800", label: "High" };
  };

  const dmftSeverity = getDMFTSeverity(analysis.dmft.total);

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
        </DialogHeader>

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
                    <div className="font-medium text-red-600">{analysis.dmft.decayed}</div>
                    <div className="text-slate-600">Decayed</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-600">{analysis.dmft.missing}</div>
                    <div className="text-slate-600">Missing</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-600">{analysis.dmft.filled}</div>
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
                    <div className="font-medium text-red-600">{analysis.dmfs.decayed}</div>
                    <div className="text-slate-600">D-Surfaces</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-600">{analysis.dmfs.missing}</div>
                    <div className="text-slate-600">M-Surfaces</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-600">{analysis.dmfs.filled}</div>
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
                <span className="font-semibold">{analysis.summary.totalTeethCharted}/32</span>
              </div>
              <div className="flex justify-between">
                <span>Sound Teeth:</span>
                <span className="font-semibold text-green-600">{analysis.summary.soundTeeth}</span>
              </div>
              <div className="flex justify-between">
                <span>Affected Teeth:</span>
                <span className="font-semibold text-red-600">{analysis.summary.affectedTeeth}</span>
              </div>
              <div className="flex justify-between">
                <span>Completion:</span>
                <span className="font-semibold">{analysis.summary.completionPercentage.toFixed(1)}%</span>
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
                    <span className="text-sm text-slate-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> This AI analysis is for clinical reference only. 
            Professional clinical judgment should always be applied in treatment planning and diagnosis.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}