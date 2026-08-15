import type { RegimenConfig } from '../types/regimen';

export const DEFAULT_REGIMEN: RegimenConfig = {
  cycleDurationDays: 28,
  cycleStartDate: '2026-08-17',
  totalCycles: 4,
  regimenName: 'Multiple Myeloma Regimen (MUM46)',
  specialInstructions: [
    'Stay well hydrated: Drink 8 to 12 cups (2-3 Liters) of fluids, especially on Cyclophosphamide days.'
  ],
  medications: [
    {
      id: 'bortezomib',
      clinicalName: 'Bortezomib 1.3 mg/m²',
      patientFriendlyName: 'Bortezomib (Injection)',
      route: 'Clinic visit (Shot under the skin)',
      days: [1, 4, 8, 11],
      instructions: 'Given by clinic nurse. Allow recommended rest days between doses.',
      badgeColor: 'primary',
      sideEffects: [
        'Nerve tingling or numbness in fingers/toes (neuropathy)',
        'Fatigue or mild nausea',
        'Low blood counts'
      ]
    },
    {
      id: 'cyclophosphamide',
      clinicalName: 'CycloPHOSPHamide 300 mg/m²',
      patientFriendlyName: 'Cyclophosphamide (Pill)',
      route: 'Take by mouth',
      days: [1, 8, 15, 22],
      instructions: 'Take as directed with plenty of water.',
      badgeColor: 'secondary',
      sideEffects: [
        'Bladder irritation (drink 8-12 cups of water)',
        'Mild nausea',
        'Decreased appetite'
      ]
    },
    {
      id: 'dexamethasone',
      clinicalName: 'DexAMETHasone 40 mg',
      patientFriendlyName: 'Dexamethasone (Pill)',
      route: 'Take by mouth',
      days: [1, 2, 3, 4, 9, 10, 11, 12, 17, 18, 19, 20],
      instructions: 'Take daily in the morning with food.',
      badgeColor: 'tertiary',
      sideEffects: [
        'Increased energy or trouble sleeping (insomnia)',
        'Increased appetite or blood sugar',
        'Stomach irritation (take with food)'
      ]
    }
  ]
};
