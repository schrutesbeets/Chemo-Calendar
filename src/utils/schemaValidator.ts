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
    errors.push('`cycleStartDate` must be a valid ISO date string formatted as "YYYY-MM-DD" (e.g. "2026-08-16").');
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

      if (med.routine !== undefined) {
        if (!med.routine || typeof med.routine !== 'object') {
          errors.push(`${medLabel}: \`routine\` must be an object.`);
        } else {
          if (!['cycle_days', 'days_of_week', 'days_of_month', 'daily'].includes(med.routine.type)) {
            errors.push(`${medLabel}: \`routine.type\` must be one of 'cycle_days', 'days_of_week', 'days_of_month', 'daily'.`);
          }
          if (med.routine.cycleDays !== undefined) {
            if (!Array.isArray(med.routine.cycleDays) || med.routine.cycleDays.some((d) => typeof d !== 'number' || d <= 0)) {
              errors.push(`${medLabel}: \`routine.cycleDays\` must be an array of positive integers.`);
            }
          }
          if (med.routine.daysOfWeek !== undefined) {
            if (!Array.isArray(med.routine.daysOfWeek) || med.routine.daysOfWeek.some((d) => typeof d !== 'number' || d < 0 || d > 6)) {
              errors.push(`${medLabel}: \`routine.daysOfWeek\` must be an array of integers 0 to 6 (0=Sun, 6=Sat).`);
            }
          }
          if (med.routine.daysOfMonth !== undefined) {
            if (!Array.isArray(med.routine.daysOfMonth) || med.routine.daysOfMonth.some((d) => typeof d !== 'number' || d < 1 || d > 31)) {
              errors.push(`${medLabel}: \`routine.daysOfMonth\` must be an array of integers 1 to 31.`);
            }
          }
        }
      }

      if (!med.instructions || typeof med.instructions !== 'string') {
        errors.push(`${medLabel}: Missing or invalid \`instructions\`.`);
      }

      if (med.dose !== undefined && typeof med.dose !== 'string') {
        errors.push(`${medLabel}: \`dose\` must be a string (e.g. "1.3 mg/m²").`);
      }

      if (
        med.timeOfDay !== undefined &&
        !['morning', 'evening', 'split', 'anytime'].includes(med.timeOfDay)
      ) {
        errors.push(
          `${medLabel}: \`timeOfDay\` must be one of 'morning', 'evening', 'split', 'anytime'.`
        );
      }

      if (med.isClinicOnly !== undefined && typeof med.isClinicOnly !== 'boolean') {
        errors.push(`${medLabel}: \`isClinicOnly\` must be a boolean.`);
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

  if (obj.contacts !== undefined) {
    if (!Array.isArray(obj.contacts)) {
      errors.push('`contacts` must be an array of contact objects.');
    } else {
      obj.contacts.forEach((contact, index) => {
        const contactLabel = contact?.name || contact?.id || `Contact #${index + 1}`;
        if (!contact || typeof contact !== 'object') {
          errors.push(`${contactLabel}: Must be a valid contact object.`);
          return;
        }

        if (!contact.id || typeof contact.id !== 'string') {
          errors.push(`${contactLabel}: Missing or invalid \`id\` string.`);
        }

        if (!contact.name || typeof contact.name !== 'string') {
          errors.push(`${contactLabel}: Missing or invalid \`name\` string.`);
        }

        if (!contact.role || typeof contact.role !== 'string') {
          errors.push(`${contactLabel}: Missing or invalid \`role\` string.`);
        }

        if (!contact.phone || typeof contact.phone !== 'string') {
          errors.push(`${contactLabel}: Missing or invalid \`phone\` string.`);
        }

        if (!contact.hours || typeof contact.hours !== 'string') {
          errors.push(`${contactLabel}: Missing or invalid \`hours\` string.`);
        }

        if (
          contact.category !== undefined &&
          !['urgent', 'clinic', 'pharmacy', 'support'].includes(contact.category)
        ) {
          errors.push(
            `${contactLabel}: \`category\` must be one of 'urgent', 'clinic', 'pharmacy', 'support'.`
          );
        }

        if (
          contact.badgeColor !== undefined &&
          !['primary', 'secondary', 'tertiary', 'warning', 'error', 'success'].includes(contact.badgeColor)
        ) {
          errors.push(
            `${contactLabel}: \`badgeColor\` must be one of 'primary', 'secondary', 'tertiary', 'warning', 'error', 'success'.`
          );
        }

        if (contact.description !== undefined && typeof contact.description !== 'string') {
          errors.push(`${contactLabel}: \`description\` must be a string.`);
        }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
