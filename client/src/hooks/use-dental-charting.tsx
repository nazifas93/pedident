import { useState, useCallback, useEffect } from "react";
import { deciduousSequence, permanentSequence } from "@/lib/dental-data";

export type ChartingMode = 'Basic' | 'Surface Detail';
export type ToothState = 'sound' | 'missing' | 'carious' | 'prosthesis';

export interface ToothData {
  state: ToothState;
  surfaces?: Record<string, ToothState>;
}

export function useDentalCharting() {
  const [currentTooth, setCurrentTooth] = useState<string>('55');
  const [chartingMode, setChartingMode] = useState<ChartingMode>('Basic');
  const [progress, setProgress] = useState<number>(1);
  const [totalTeeth] = useState<number>(52);
  const [toothStates, setToothStates] = useState<Record<string, ToothData>>({});
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [currentSequence, setCurrentSequence] = useState<'deciduous' | 'permanent'>('deciduous');

  const getToothIndex = (toothNumber: string): number => {
    if (currentSequence === 'deciduous') {
      return deciduousSequence.indexOf(toothNumber);
    } else {
      return permanentSequence.indexOf(toothNumber);
    }
  };

  const updateProgress = useCallback((toothNumber: string) => {
    if (deciduousSequence.includes(toothNumber)) {
      setProgress(deciduousSequence.indexOf(toothNumber) + 1);
      setCurrentSequence('deciduous');
    } else {
      setProgress(permanentSequence.indexOf(toothNumber) + 21);
      setCurrentSequence('permanent');
    }
  }, []);

  const setToothState = useCallback((toothNumber: string, state: ToothState, surfaces?: Record<string, ToothState>) => {
    setToothStates(prev => ({
      ...prev,
      [toothNumber]: {
        state,
        ...(surfaces && { surfaces })
      }
    }));
  }, []);

  const advanceToNextTooth = useCallback(() => {
    const sequence = currentSequence === 'deciduous' ? deciduousSequence : permanentSequence;
    const currentIndex = getToothIndex(currentTooth);
    
    if (currentIndex < sequence.length - 1) {
      const nextTooth = sequence[currentIndex + 1];
      setCurrentTooth(nextTooth);
      updateProgress(nextTooth);
    } else if (currentSequence === 'deciduous') {
      // Move to permanent teeth
      skipToPermanent();
    } else {
      // Charting complete
      finishCharting();
    }
  }, [currentTooth, currentSequence, updateProgress]);

  const goToPreviousTooth = useCallback(() => {
    const sequence = currentSequence === 'deciduous' ? deciduousSequence : permanentSequence;
    const currentIndex = getToothIndex(currentTooth);
    
    if (currentIndex > 0) {
      const prevTooth = sequence[currentIndex - 1];
      setCurrentTooth(prevTooth);
      updateProgress(prevTooth);
    }
  }, [currentTooth, currentSequence, updateProgress]);

  const goToNextTooth = useCallback(() => {
    advanceToNextTooth();
  }, [advanceToNextTooth]);

  const goToTooth = useCallback((toothNumber: string) => {
    setCurrentTooth(toothNumber);
    updateProgress(toothNumber);
  }, [updateProgress]);

  const skipToPermanent = useCallback(() => {
    const firstPermanent = permanentSequence[0];
    setCurrentTooth(firstPermanent);
    setCurrentSequence('permanent');
    setProgress(21);
  }, []);

  const finishCharting = useCallback(() => {
    console.log('Charting completed!', { toothStates, progress: `${progress}/${totalTeeth}` });
    // Additional completion logic can be added here
  }, [toothStates, progress, totalTeeth]);

  const exportToPDF = useCallback(async (patient: any, states: Record<string, ToothData>) => {
    // Import jsPDF dynamically to avoid SSR issues
    const { exportDentalChart } = await import("@/lib/pdf-export");
    await exportDentalChart(patient, states);
  }, []);

  const toggleSurfaceMode = useCallback(() => {
    setChartingMode(prev => prev === 'Basic' ? 'Surface Detail' : 'Basic');
    setSelectedSurfaces([]);
  }, []);

  const selectSurface = useCallback((toothNumber: string, surface: string) => {
    if (chartingMode === 'Surface Detail' && toothNumber === currentTooth) {
      setSelectedSurfaces(prev => 
        prev.includes(surface) 
          ? prev.filter(s => s !== surface)
          : [...prev, surface]
      );
    }
  }, [chartingMode, currentTooth]);

  const confirmSurfaces = useCallback(() => {
    if (selectedSurfaces.length > 0 && chartingMode === 'Surface Detail') {
      const surfaceStates: Record<string, ToothState> = {};
      selectedSurfaces.forEach(surface => {
        surfaceStates[surface] = 'carious'; // Default to carious for selected surfaces
      });
      
      setToothState(currentTooth, 'sound', surfaceStates);
      setSelectedSurfaces([]);
      advanceToNextTooth();
    }
  }, [selectedSurfaces, chartingMode, currentTooth, setToothState, advanceToNextTooth]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    const key = event.key;
    
    switch(key) {
      case '3': // Sound tooth
        setToothState(currentTooth, 'sound');
        advanceToNextTooth();
        break;
      case '4': // Missing tooth
        setToothState(currentTooth, 'missing');
        advanceToNextTooth();
        break;
      case '5': // Carious tooth
        setToothState(currentTooth, 'carious');
        advanceToNextTooth();
        break;
      case '-': // Prosthesis
        setToothState(currentTooth, 'prosthesis');
        advanceToNextTooth();
        break;
      case '6': // Previous tooth
        goToPreviousTooth();
        break;
      case '7': // Next tooth or confirm surfaces in detail mode
        if (chartingMode === 'Surface Detail') {
          if (selectedSurfaces.length > 0) {
            confirmSurfaces();
          }
          // Always toggle back to basic mode and advance
          setChartingMode('Basic');
          setSelectedSurfaces([]);
          advanceToNextTooth();
        } else {
          goToNextTooth();
        }
        break;
      case '1': // Skip to permanent or finish
        if (currentSequence === 'deciduous') {
          skipToPermanent();
        } else {
          finishCharting();
        }
        break;
      case '/': // Toggle surface detail mode only
        toggleSurfaceMode();
        break;
      case '8': // Mesial surface
        if (chartingMode === 'Surface Detail') {
          selectSurface(currentTooth, 'mesial');
        }
        break;
      case '9': // Distal surface
        if (chartingMode === 'Surface Detail') {
          selectSurface(currentTooth, 'distal');
        }
        break;
      case '0': // Buccal surface
        if (chartingMode === 'Surface Detail') {
          selectSurface(currentTooth, 'buccal');
        }
        break;
      case '.': // Lingual surface
        if (chartingMode === 'Surface Detail') {
          selectSurface(currentTooth, 'lingual');
        }
        break;
      case '+': // Occlusal surface
        if (chartingMode === 'Surface Detail') {
          selectSurface(currentTooth, 'occlusal');
        }
        break;
    }

    event.preventDefault();
  }, [currentTooth, chartingMode, currentSequence, setToothState, advanceToNextTooth, goToPreviousTooth, goToNextTooth, skipToPermanent, finishCharting, toggleSurfaceMode, selectSurface]);

  return {
    currentTooth,
    chartingMode,
    progress,
    totalTeeth,
    toothStates,
    selectedSurfaces,
    currentSequence,
    handleKeyPress,
    setToothState,
    advanceToNextTooth,
    goToPreviousTooth,
    goToNextTooth,
    goToTooth,
    skipToPermanent,
    finishCharting,
    exportToPDF,
    toggleSurfaceMode,
    selectSurface,
    confirmSurfaces,
  };
}
