import type { RegimenConfig, Medication } from '../types/regimen';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateRegimenSchema(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Input is not a valid JSON object.'] };
  }

  const obj = data as Partial<RegimenConfig>;

  if (typeof obj.cycleDurationDays !== 'number' || obj.cycleDurationDays <= 0) {
    errors.push('`cycleDurationDays` must be a positive number (e.g. 28).');
  }

  if (typeof obj.cycleStartDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(obj.cycleStartDate)) {
    errors.push('`cycleStartDate` must be a valid ISO date string formatted as "YYYY-MM-DD" (e.g. "2026-08-17").');
  }

  if (typeof obj.totalCycles !== 'number' || obj.totalCycles <= 0) {
    errors.push('`totalCycles` must be a positive number (e.g. 4).');
  }

  if (typeof obj.regimenName !== 'string' || obj.regimenName.trim().length === 0) {
    errors.push('`regimenName` must be a non-empty string.');
  }

  if (!Array.isArray(obj.specialInstructions)) {
    errors.push('`specialInstructions` must be an array of strings.');
  }

  if (!Array.isArray(obj.medications) || obj.medications.length === 0) {
    errors.push('`medications` must be a non-empty array of medication objects.');
  } else {
    obj.medications.forEach((med: Partial<Medication>, index: number) => {
      const medLabel = med.patientFriendlyName || med.id || `Medication #${index + 1}`;

      if (!med.id || typeof med.id !== 'string') {
        errors.push(`${medLabel}: Missing or invalid \`id\` string.`);
      }

      if (!med.patientFriendlyName || typeof med.patientFriendlyName !== 'string') {
        errors.push(`${medLabel}: Missing or invalid \`patientFriendlyName\`.`);
      }

      if (!med.route || typeof med.route !== 'string') {
        errors.push(`${medLabel}: Missing or invalid \`route\`.`);
      }

      if (!Array.isArray(med.days) || med.days.some((d) => typeof d !== 'number' || d <= 0)) {
        errors.push(`${medLabel}: \`days\` must be an array of positive day numbers (e.g. [1, 4, 8, 11]).`);
      }

      if (!med.instructions || typeof med.instructions !== 'string') {
        errors.push(`${medLabel}: Missing or invalid \`instructions\`.`);
      }

      if (med.dose !== undefined && typeof med.dose !== 'string') {
        errors.push(`${medLabel}: \`dose\` must be a string (e.g. "1.3 mg/m²").`);
      }

      if (!med.guide || typeof med.guide !== 'object') {
        errors.push(`${medLabel}: Missing \`guide\` object with purpose, howToTake, and keyPrecautions.`);
      } else {
        if (!med.guide.purpose) errors.push(`${medLabel}: Guide missing \`purpose\`.`);
        if (!med.guide.howToTake) errors.push(`${medLabel}: Guide missing \`howToTake\`.`);
        if (!med.guide.keyPrecautions) errors.push(`${medLabel}: Guide missing \`keyPrecautions\`.`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
