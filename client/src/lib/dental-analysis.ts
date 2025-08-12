import type { ToothData } from "@/hooks/use-dental-charting";

export interface DentalAnalysis {
  dmft: {
    decayed: number;
    missing: number;
    filled: number;
    total: number;
  };
  dmfs: {
    decayed: number;
    missing: number;
    filled: number;
    total: number;
  };
  summary: {
    totalTeethCharted: number;
    soundTeeth: number;
    affectedTeeth: number;
    completionPercentage: number;
  };
  patterns: string[];
  recommendations: string[];
}

export function analyzeDentalChart(toothStates: Record<string, ToothData>): DentalAnalysis {
  let dmftDecayed = 0;
  let dmftMissing = 0;
  let dmftFilled = 0;
  
  let dmfsDecayed = 0;
  let dmfsMissing = 0;
  let dmfsFilled = 0;
  
  let soundTeeth = 0;
  let totalCharted = Object.keys(toothStates).length;
  
  // Patterns tracking
  let anteriorDecay = 0;
  let posteriorDecay = 0;
  let anteriorMissing = 0;
  let posteriorMissing = 0;
  let upperDecay = 0;
  let lowerDecay = 0;
  
  // Analyze each tooth
  Object.entries(toothStates).forEach(([toothNumber, toothData]) => {
    const isAnterior = isAnteriorTooth(toothNumber);
    const isUpper = isUpperTooth(toothNumber);
    
    // DMFT Analysis
    switch (toothData.state) {
      case 'carious':
        dmftDecayed++;
        if (isAnterior) anteriorDecay++;
        else posteriorDecay++;
        if (isUpper) upperDecay++;
        else lowerDecay++;
        break;
      case 'missing':
        dmftMissing++;
        if (isAnterior) anteriorMissing++;
        else posteriorMissing++;
        break;
      case 'prosthesis':
        dmftFilled++;
        break;
      case 'sound':
        soundTeeth++;
        break;
    }
    
    // DMFS Analysis (surfaces)
    if (toothData.surfaces) {
      Object.values(toothData.surfaces).forEach(surfaceState => {
        switch (surfaceState) {
          case 'carious':
            dmfsDecayed++;
            break;
          case 'prosthesis':
            dmfsFilled++;
            break;
        }
      });
    } else if (toothData.state === 'missing') {
      // Missing tooth = 5 missing surfaces
      dmfsMissing += 5;
    } else if (toothData.state === 'carious') {
      // Whole tooth carious = 5 carious surfaces if no surface detail
      dmfsDecayed += 5;
    } else if (toothData.state === 'prosthesis') {
      // Whole tooth prosthesis = 5 filled surfaces
      dmfsFilled += 5;
    }
  });
  
  const dmftTotal = dmftDecayed + dmftMissing + dmftFilled;
  const dmfsTotal = dmfsDecayed + dmfsMissing + dmfsFilled;
  
  // Generate patterns
  const patterns: string[] = [];
  
  if (posteriorDecay > anteriorDecay && posteriorDecay > 2) {
    patterns.push("High caries activity in posterior teeth (molars/premolars)");
  }
  
  if (anteriorDecay > 2) {
    patterns.push("Concerning anterior tooth decay - may indicate poor oral hygiene or dietary habits");
  }
  
  if (anteriorMissing > 0) {
    patterns.push("Early tooth loss in anterior region - aesthetic and functional concerns");
  }
  
  if (upperDecay > lowerDecay && upperDecay > 3) {
    patterns.push("Higher decay prevalence in upper arch");
  } else if (lowerDecay > upperDecay && lowerDecay > 3) {
    patterns.push("Higher decay prevalence in lower arch");
  }
  
  if (dmftTotal / Math.max(totalCharted, 1) > 0.6) {
    patterns.push("High overall caries experience - comprehensive treatment needed");
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (dmftDecayed > 0) {
    recommendations.push(`Immediate restorative treatment needed for ${dmftDecayed} decayed teeth`);
  }
  
  if (dmftMissing > 2) {
    recommendations.push("Consider prosthodontic consultation for missing teeth replacement");
  }
  
  if (posteriorDecay > 2) {
    recommendations.push("Apply sealants to unaffected posterior teeth");
  }
  
  if (dmftTotal > 4) {
    recommendations.push("Implement intensive fluoride therapy protocol");
    recommendations.push("Comprehensive oral hygiene education and dietary counseling");
  }
  
  if (anteriorDecay > 0) {
    recommendations.push("Aesthetic restorative options for anterior teeth");
  }
  
  recommendations.push("Regular recall appointments every 3-6 months");
  recommendations.push("Professional prophylaxis and periodontal assessment");
  
  if (totalCharted < 28) {
    recommendations.push("Complete comprehensive oral examination for uncharted teeth");
  }
  
  return {
    dmft: {
      decayed: dmftDecayed,
      missing: dmftMissing,
      filled: dmftFilled,
      total: dmftTotal
    },
    dmfs: {
      decayed: dmfsDecayed,
      missing: dmfsMissing,
      filled: dmfsFilled,
      total: dmfsTotal
    },
    summary: {
      totalTeethCharted: totalCharted,
      soundTeeth: soundTeeth,
      affectedTeeth: dmftTotal,
      completionPercentage: (totalCharted / 32) * 100
    },
    patterns,
    recommendations
  };
}

function isAnteriorTooth(toothNumber: string): boolean {
  const num = parseInt(toothNumber);
  if (num >= 11 && num <= 13) return true; // Upper anterior
  if (num >= 21 && num <= 23) return true; // Upper anterior
  if (num >= 31 && num <= 33) return true; // Lower anterior
  if (num >= 41 && num <= 43) return true; // Lower anterior
  if (num >= 51 && num <= 53) return true; // Deciduous upper anterior
  if (num >= 61 && num <= 63) return true; // Deciduous upper anterior
  if (num >= 71 && num <= 73) return true; // Deciduous lower anterior
  if (num >= 81 && num <= 83) return true; // Deciduous lower anterior
  return false;
}

function isUpperTooth(toothNumber: string): boolean {
  const num = parseInt(toothNumber);
  return (num >= 11 && num <= 18) || (num >= 21 && num <= 28) || 
         (num >= 51 && num <= 55) || (num >= 61 && num <= 65);
}