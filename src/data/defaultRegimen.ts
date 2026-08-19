import type { RegimenConfig } from '../types/regimen';

export const DEFAULT_MUM46_REGIMEN: RegimenConfig = {
  cycleDurationDays: 28,
  cycleStartDate: "2026-08-16",
  totalCycles: 4,
  regimenName: "Multiple Myeloma Regimen (MUM46)",
  patientName: "Eleanor Vance (80 y/o)",
  physicianName: "Dr. Sarah Jenkins, MD (Oncology)",
  clinicPhone: "(555) 234-5678",
  emergencyPhone: "(555) 911-0000 or 911",
  specialInstructions: [
    "Stay well hydrated: Drink 8 to 12 cups (2-3 Liters) of fluids, especially on Cyclophosphamide days.",
    "Take Dexamethasone morning and evening doses with food/meals as scheduled to avoid stomach irritation and sleep disruption.",
    "Notify the care team immediately if you develop a fever of 100.4°F (38°C) or higher, or experience severe numbness/tingling."
  ],
  medications: [
    {
      id: "bortezomib",
      patientFriendlyName: "Bortezomib (Injection)",
      route: "Clinic visit (Shot under the skin)",
      dose: "1.3 mg/m²",
      days: [1, 4, 8, 11],
      instructions: "Given by clinic nurse in the morning. Allow rest.",
      badgeColor: "primary",
      timeOfDay: "morning",
      guide: {
        purpose: "Targeted therapy to treat multiple myeloma.",
        howToTake: "Administered by a healthcare provider at the clinic during morning appointment.",
        keyPrecautions: "Report any tingling or numbness in hands or feet immediately."
      }
    },
    {
      id: "cyclophosphamide",
      patientFriendlyName: "Cyclophosphamide (Pill)",
      route: "Take by mouth",
      dose: "300 mg/m²",
      days: [1, 8, 15, 22],
      instructions: "Take in the morning as directed with plenty of water.",
      badgeColor: "tertiary",
      timeOfDay: "morning",
      guide: {
        purpose: "Chemotherapy pill to slow cell growth.",
        howToTake: "Swallow whole with plenty of fluids, in the morning with breakfast.",
        keyPrecautions: "Drink 8-12 cups of water throughout the day to protect bladder health."
      }
    },
    {
      id: "dexamethasone_am",
      patientFriendlyName: "Dexamethasone — Morning (Pill)",
      route: "Take by mouth",
      dose: "20 mg",
      days: [1, 2, 3, 4, 9, 10, 11, 12, 17, 18, 19, 20],
      instructions: "Take 20 mg in the morning with breakfast.",
      badgeColor: "warning",
      timeOfDay: "morning",
      guide: {
        purpose: "Steroid that enhances the effectiveness of chemotherapy.",
        howToTake: "Take 20 mg in the morning with food or milk to prevent stomach irritation.",
        keyPrecautions: "May cause mild restlessness or increased appetite. Take with food."
      }
    },
    {
      id: "dexamethasone_pm",
      patientFriendlyName: "Dexamethasone — Evening (Pill)",
      route: "Take by mouth",
      dose: "20 mg",
      days: [1, 2, 3, 4, 9, 10, 11, 12, 17, 18, 19, 20],
      instructions: "Take 20 mg in the evening with dinner.",
      badgeColor: "warning",
      timeOfDay: "evening",
      guide: {
        purpose: "Steroid that enhances the effectiveness of chemotherapy.",
        howToTake: "Take 20 mg in the evening with dinner or a light snack.",
        keyPrecautions: "Take with food to prevent stomach discomfort."
      }
    }
  ],
  contacts: [
    {
      id: "contact_urgent_triage",
      name: "24/7 Oncology Nurse Triage Line",
      role: "Urgent Care & After-Hours Symptom Management",
      phone: "(555) 911-0000",
      hours: "24 Hours / 7 Days a week",
      category: "urgent",
      description: "Call immediately for fever ≥ 100.4°F (38°C), severe chills, uncontrollable nausea, or new shortness of breath.",
      badgeColor: "error"
    },
    {
      id: "contact_primary_oncologist",
      name: "Dr. Sarah Jenkins, MD",
      role: "Attending Medical Oncologist",
      phone: "(555) 234-5678",
      hours: "Mon – Fri, 8:00 AM – 5:00 PM",
      category: "clinic",
      description: "Lead physician overseeing multiple myeloma regimen MUM46, laboratory monitoring, and treatment changes.",
      badgeColor: "primary"
    },
    {
      id: "contact_nurse_coordinator",
      name: "Rachel Adams, BSN, RN, OCN",
      role: "Chemotherapy Nurse Navigator",
      phone: "(555) 234-5679",
      hours: "Mon – Fri, 8:00 AM – 4:30 PM",
      category: "clinic",
      description: "Direct contact for treatment appointments, Bortezomib injection coordination, and side effect coaching.",
      badgeColor: "primary"
    },
    {
      id: "contact_infusion_center",
      name: "Hope Pavilion Infusion Suite",
      role: "Chemotherapy & Injection Treatment Clinic",
      phone: "(555) 234-5680",
      hours: "Mon – Sat, 7:30 AM – 6:00 PM",
      category: "clinic",
      description: "Suite 300, 3rd Floor. Check-in desk for subcutaneous Bortezomib injections, blood draws, and hydration therapy.",
      badgeColor: "secondary"
    },
    {
      id: "contact_specialty_pharmacy",
      name: "Oncology Specialty Pharmacy Desk",
      role: "Oral Chemotherapy & Supportive Rx Fulfillment",
      phone: "(555) 789-0123",
      hours: "Mon – Fri, 8:30 AM – 6:00 PM",
      category: "pharmacy",
      description: "Refill coordination for oral Cyclophosphamide, Dexamethasone, anti-nausea medications, and copay programs.",
      badgeColor: "tertiary"
    },
    {
      id: "contact_social_work",
      name: "Patient & Family Supportive Services",
      role: "Oncology Social Work & Ride Assistance",
      phone: "(555) 345-6789",
      hours: "Mon – Fri, 9:00 AM – 4:00 PM",
      category: "support",
      description: "Assistance with transportation rides, emotional support resources, and home health nurse scheduling.",
      badgeColor: "secondary"
    }
  ]
};
