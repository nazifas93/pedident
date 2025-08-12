import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaArrowRight, FaFilePdf, FaCheck } from "react-icons/fa";
import type { Patient } from "@shared/schema";

interface ControlPanelProps {
  currentTooth: string;
  chartingMode: 'Basic' | 'Surface Detail';
  progress: number;
  totalTeeth: number;
  selectedSurfaces: string[];
  onSkipToPermanent: () => void;
  onFinishCharting: () => void;
  onToggleSurfaceMode: () => void;
  onConfirmSurfaces: () => void;
  patient: Patient | null;
}

export default function ControlPanel({
  currentTooth,
  chartingMode,
  progress,
  totalTeeth,
  selectedSurfaces,
  onSkipToPermanent,
  onFinishCharting,
  onToggleSurfaceMode,
  onConfirmSurfaces,
  patient
}: ControlPanelProps) {
  
  const surfaces = ['mesial', 'distal', 'buccal', 'lingual', 'occlusal'];

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-md font-semibold text-slate-900">Current Status</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Active Tooth:</span>
              <span className="text-sm font-medium text-medical-blue" data-testid="current-tooth-display">
                {currentTooth}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Mode:</span>
              <span className="text-sm font-medium text-slate-700" data-testid="charting-mode-display">
                {chartingMode}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Progress:</span>
              <span className="text-sm font-medium text-slate-700" data-testid="progress-display">
                {progress}/{totalTeeth}
              </span>
            </div>
            {patient && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Patient:</span>
                <span className="text-sm font-medium text-slate-700" data-testid="patient-name-display">
                  {patient.name}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Foot Pedal Controls */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-md font-semibold text-slate-900">Foot Pedal Controls</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded p-2">
                <div className="font-medium text-slate-700">3</div>
                <div className="text-xs text-slate-600">Sound tooth</div>
              </div>
              <div className="bg-slate-50 rounded p-2">
                <div className="font-medium text-slate-700">4</div>
                <div className="text-xs text-slate-600">Missing tooth</div>
              </div>
              <div className="bg-slate-50 rounded p-2">
                <div className="font-medium text-slate-700">5</div>
                <div className="text-xs text-slate-600">Carious tooth</div>
              </div>
              <div className="bg-slate-50 rounded p-2">
                <div className="font-medium text-slate-700">-</div>
                <div className="text-xs text-slate-600">Prosthesis</div>
              </div>
              <div className="bg-slate-50 rounded p-2">
                <div className="font-medium text-slate-700">6</div>
                <div className="text-xs text-slate-600">Previous tooth</div>
              </div>
              <div className="bg-slate-50 rounded p-2">
                <div className="font-medium text-slate-700">7</div>
                <div className="text-xs text-slate-600">Next tooth</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-500 mb-2">Advanced Controls</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>8 - Mesial</div>
                <div>9 - Distal</div>
                <div>0 - Buccal</div>
                <div>. - Lingual</div>
                <div>+ - Occlusal</div>
                <div>/ - Detail mode</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-md font-semibold text-slate-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <Button
            onClick={onSkipToPermanent}
            className="w-full bg-medical-blue text-white hover:bg-blue-700 transition-colors duration-200"
            data-testid="button-skip-permanent"
          >
            <FaArrowRight className="mr-2" />
            Skip to Permanent
          </Button>
          <Button
            onClick={onToggleSurfaceMode}
            className="w-full bg-slate-500 text-white hover:bg-slate-600 transition-colors duration-200"
            data-testid="button-toggle-surface-mode"
          >
            Toggle Surface Mode
          </Button>
          <Button
            onClick={onFinishCharting}
            className="w-full bg-healthy-green text-white hover:bg-green-700 transition-colors duration-200"
            data-testid="button-finish-charting"
          >
            <FaCheck className="mr-2" />
            Finish & Export PDF
          </Button>
        </CardContent>
      </Card>

      {/* Surface Selection (Advanced Mode) */}
      {chartingMode === 'Surface Detail' && (
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-md font-semibold text-slate-900">Surface Selection</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <div className="text-sm text-slate-600">
                Select surfaces for tooth <span className="font-medium">{currentTooth}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {surfaces.map(surface => (
                <Button
                  key={surface}
                  variant="outline"
                  size="sm"
                  className={`${selectedSurfaces.includes(surface) ? 'bg-carious-yellow' : 'bg-slate-100'} hover:bg-carious-yellow border border-slate-300 transition-colors duration-200`}
                  data-testid={`button-surface-${surface}`}
                >
                  {surface.charAt(0).toUpperCase() + surface.slice(1)}
                </Button>
              ))}
            </div>
            <div className="mt-3">
              <Button
                onClick={onConfirmSurfaces}
                className="w-full bg-medical-blue text-white hover:bg-blue-700 transition-colors duration-200"
                data-testid="button-confirm-surfaces"
              >
                Confirm Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
