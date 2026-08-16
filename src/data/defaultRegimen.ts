import type { RegimenConfig } from '../types/regimen';

export const DEFAULT_MUM46_REGIMEN: RegimenConfig = {
  cycleDurationDays: 28,
  cycleStartDate: "2026-08-17",
  totalCycles: 4,
  regimenName: "Multiple Myeloma Regimen (MUM46)",
  patientName: "Eleanor Vance (80 y/o)",
  physicianName: "Dr. Sarah Jenkins, MD (Oncology)",
  clinicPhone: "(555) 234-5678",
  emergencyPhone: "(555) 911-0000 or 911",
  specialInstructions: [
    "Stay well hydrated: Drink 8 to 12 cups (2-3 Liters) of fluids, especially on Cyclophosphamide days.",
    "Take Dexamethasone in the morning with food or breakfast to avoid stomach discomfort and sleep disruption.",
    "Notify the care team immediately if you develop a fever of 100.4°F (38°C) or higher, or experience severe numbness/tingling."
  ],
  medications: [
    {
      id: "bortezomib",
      patientFriendlyName: "Bortezomib (Injection)",
      route: "Clinic visit (Shot under the skin)",
      dose: "1.3 mg/m²",
      days: [1, 4, 8, 11],
      instructions: "Given by clinic nurse. Allow rest.",
      badgeColor: "primary",
      guide: {
        purpose: "Targeted therapy to treat multiple myeloma.",
        howToTake: "Administered by a healthcare provider at the clinic.",
        keyPrecautions: "Report any tingling or numbness in hands or feet immediately."
      }
    },
    {
      id: "cyclophosphamide",
      patientFriendlyName: "Cyclophosphamide (Pill)",
      route: "Take by mouth",
      dose: "300 mg/m²",
      days: [1, 8, 15, 22],
      instructions: "Take as directed with plenty of water.",
      badgeColor: "tertiary",
      guide: {
        purpose: "Chemotherapy pill to slow cell growth.",
        howToTake: "Swallow whole with plenty of fluids, ideally in the morning.",
        keyPrecautions: "Drink 8-12 cups of water throughout the day to protect bladder health."
      }
    },
    {
      id: "dexamethasone",
      patientFriendlyName: "Dexamethasone (Pill)",
      route: "Take by mouth",
      dose: "40 mg",
      days: [1, 2, 3, 4, 9, 10, 11, 12, 17, 18, 19, 20],
      instructions: "Take daily in the morning with food.",
      badgeColor: "warning",
      guide: {
        purpose: "Steroid that enhances the effectiveness of chemotherapy.",
        howToTake: "Take in the morning with food or milk to prevent stomach irritation.",
        keyPrecautions: "May cause mild restlessness or increased appetite."
      }
    }
  ]
};
