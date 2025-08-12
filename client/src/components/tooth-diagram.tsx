import { cn } from "@/lib/utils";

interface ToothDiagramProps {
  toothNumber: string;
  isActive: boolean;
  toothState?: { state: string; surfaces?: Record<string, string> };
  selectedSurfaces: string[];
  onToothClick: (toothNumber: string) => void;
  onSurfaceClick: (toothNumber: string, surface: string) => void;
  isLarge?: boolean;
  chartingMode: 'Basic' | 'Surface Detail';
}

export default function ToothDiagram({
  toothNumber,
  isActive,
  toothState,
  selectedSurfaces,
  onToothClick,
  onSurfaceClick,
  isLarge = false,
  chartingMode
}: ToothDiagramProps) {
  
  const getToothStateClass = (state?: string) => {
    switch (state) {
      case 'sound':
        return 'tooth-sound';
      case 'missing':
        return 'tooth-missing';
      case 'carious':
        return 'tooth-carious';
      case 'prosthesis':
        return 'tooth-prosthesis';
      default:
        return 'bg-white';
    }
  };

  const getSurfaceClass = (surface: string) => {
    if (selectedSurfaces.includes(surface)) {
      return 'surface-selected';
    }
    if (toothState?.surfaces?.[surface]) {
      return getToothStateClass(toothState.surfaces[surface]);
    }
    return 'bg-white';
  };

  const handleToothClick = () => {
    onToothClick(toothNumber);
  };

  const handleSurfaceClick = (surface: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (chartingMode === 'Surface Detail') {
      onSurfaceClick(toothNumber, surface);
    }
  };

  const size = isLarge ? 'w-12 h-16' : 'w-10 h-14';
  const surfaceSize = isLarge ? 'w-3 h-3' : 'w-2 h-2';
  const centerSize = isLarge ? 'w-4 h-6' : 'w-3 h-5';

  return (
    <div className="tooth-container" data-testid={`tooth-${toothNumber}`}>
      <div className="text-xs text-center text-slate-500 mb-1">{toothNumber}</div>
      <div
        className={cn(
          "tooth-diagram border-2 border-slate-300 rounded-lg relative cursor-pointer hover:border-medical-blue transition-colors duration-200",
          size,
          getToothStateClass(toothState?.state),
          isActive && "active-tooth"
        )}
        onClick={handleToothClick}
        data-testid={`tooth-diagram-${toothNumber}`}
      >
        {/* Occlusal surface */}
        <div
          className={cn(
            "absolute top-0 left-1/2 transform -translate-x-1/2 border border-slate-400 rounded-t tooth-surface",
            surfaceSize,
            getSurfaceClass('occlusal')
          )}
          onClick={(e) => handleSurfaceClick('occlusal', e)}
          title="Occlusal"
          data-testid={`surface-occlusal-${toothNumber}`}
        />
        
        {/* Mesial surface */}
        <div
          className={cn(
            "absolute top-1/2 left-0 transform -translate-y-1/2 border border-slate-400 tooth-surface",
            surfaceSize,
            getSurfaceClass('mesial')
          )}
          onClick={(e) => handleSurfaceClick('mesial', e)}
          title="Mesial"
          data-testid={`surface-mesial-${toothNumber}`}
        />
        
        {/* Distal surface */}
        <div
          className={cn(
            "absolute top-1/2 right-0 transform -translate-y-1/2 border border-slate-400 tooth-surface",
            surfaceSize,
            getSurfaceClass('distal')
          )}
          onClick={(e) => handleSurfaceClick('distal', e)}
          title="Distal"
          data-testid={`surface-distal-${toothNumber}`}
        />
        
        {/* Lingual surface */}
        <div
          className={cn(
            "absolute bottom-1 left-1/2 transform -translate-x-1/2 border border-slate-400 tooth-surface",
            surfaceSize,
            getSurfaceClass('lingual')
          )}
          onClick={(e) => handleSurfaceClick('lingual', e)}
          title="Lingual"
          data-testid={`surface-lingual-${toothNumber}`}
        />
        
        {/* Buccal surface (center) */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-slate-400 tooth-surface",
            centerSize,
            getSurfaceClass('buccal')
          )}
          onClick={(e) => handleSurfaceClick('buccal', e)}
          title="Buccal"
          data-testid={`surface-buccal-${toothNumber}`}
        />
      </div>
    </div>
  );
}
