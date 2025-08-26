import { useState } from "react";
import PatientSetup from "@/components/patient-setup";
import Odontogram from "@/components/odontogram";
import ControlPanel from "@/components/control-panel";
import { useDentalCharting } from "@/hooks/use-dental-charting";
import { FaTooth, FaCog } from "react-icons/fa";
import type { Patient } from "@shared/schema";
import MyLogo from "../assets/setaring.png";


export default function Home() {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [isCharting, setIsCharting] = useState(false);
  
  const {
    currentTooth,
    chartingMode,
    progress,
    totalTeeth,
    toothStates,
    selectedSurfaces,
    handleKeyPress,
    setToothState,
    goToTooth,
    skipToPermanent,
    finishCharting,
    exportToPDF,
    toggleSurfaceMode,
    selectSurface,
    confirmSurfaces,
  } = useDentalCharting();

  const handleStartCharting = (patient: Patient) => {
    setCurrentPatient(patient);
    setIsCharting(true);
  };

  const handleFinishCharting = () => {
    if (currentPatient) {
      finishCharting();
      exportToPDF(currentPatient, toothStates);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="main-app">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src={MyLogo} alt="My Logo" className="w-8 h-8" />
                <h1 className="text-xl font-semibold text-slate-900" data-testid="app-title">
                  Pedident Dental Charting System
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600" data-testid="current-user">
                Dr. Sarah Johnson
              </span>
              <button className="text-slate-400 hover:text-slate-600" data-testid="settings-button">
                <FaCog />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!isCharting ? (
          <PatientSetup onStartCharting={handleStartCharting} />
        ) : (
          <div 
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            onKeyDown={handleKeyPress}
            tabIndex={0}
            data-testid="charting-interface"
          >
            {/* Main Odontogram */}
            <div className="lg:col-span-3">
              <Odontogram
                currentTooth={currentTooth}
                toothStates={toothStates}
                selectedSurfaces={selectedSurfaces}
                onToothClick={goToTooth}
                onSurfaceClick={selectSurface}
                chartingMode={chartingMode}
              />
            </div>
            
            {/* Control Panel */}
            <div>
              <ControlPanel
                currentTooth={currentTooth}
                chartingMode={chartingMode}
                progress={progress}
                totalTeeth={totalTeeth}
                selectedSurfaces={selectedSurfaces}
                onSkipToPermanent={skipToPermanent}
                onFinishCharting={handleFinishCharting}
                onToggleSurfaceMode={toggleSurfaceMode}
                onConfirmSurfaces={confirmSurfaces}
                patient={currentPatient}
                toothStates={toothStates}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
