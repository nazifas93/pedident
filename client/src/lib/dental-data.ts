// FDI Notation sequences for dental charting

// Deciduous teeth sequence (clockwise starting from upper right)
export const deciduousSequence = [
  '55', '54', '53', '52', '51', // Upper right to center
  '61', '62', '63', '64', '65', // Upper center to left
  '75', '74', '73', '72', '71', // Lower left to center
  '81', '82', '83', '84', '85'  // Lower center to right
];

// Permanent teeth sequence (clockwise starting from upper right)
export const permanentSequence = [
  '18', '17', '16', '15', '14', '13', '12', '11', // Upper right to center
  '21', '22', '23', '24', '25', '26', '27', '28', // Upper center to left
  '38', '37', '36', '35', '34', '33', '32', '31', // Lower left to center
  '41', '42', '43', '44', '45', '46', '47', '48'  // Lower center to right
];

// Organized by quadrants for display
export const deciduousTeeth = {
  upper: ['55', '54', '53', '52', '51', '61', '62', '63', '64', '65'],
  lower: ['85', '84', '83', '82', '81', '71', '72', '73', '74', '75']
};

export const permanentTeeth = {
  upper: ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'],
  lower: ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38']
};

// Tooth surfaces
export const toothSurfaces = ['mesial', 'distal', 'occlusal', 'lingual', 'buccal'] as const;

// Tooth states
export const toothStates = ['sound', 'missing', 'carious', 'prosthesis'] as const;

export type ToothSurface = typeof toothSurfaces[number];
export type ToothState = typeof toothStates[number];
