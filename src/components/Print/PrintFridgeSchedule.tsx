import React from 'react';
import { useRegimen } from '../../context/RegimenContext';
import { useSettings } from '../../context/SettingsContext';
import { getDateForCycleAndDay, formatShortDate, formatMedicationRoutine } from '../../utils/dateUtils';
import { AlertTriangle, Syringe, Pill, Sparkles, Droplets, Sun, Moon } from 'lucide-react';
import type { Medication } from '../../types/regimen';
import clsx from 'clsx';

const getMedicationIcon = (med: Medication, size: number = 14) => {
  const lowerId = med.id.toLowerCase();
  const lowerRoute = med.route ? med.route.toLowerCase() : '';

  if (
    med.isClinicOnly ||
    lowerId.includes('bortezomib') ||
    lowerRoute.includes('injection') ||
    lowerRoute.includes('shot') ||
    lowerRoute.includes('clinic')
  ) {
    return <Syringe size={size} strokeWidth={2.5} aria-hidden="true" />;
  }

  if (
    lowerId.includes('dexa') ||
    lowerId.includes('dexamethasone') ||
    med.badgeColor === 'warning'
  ) {
    return <Sparkles size={size} strokeWidth={2.5} aria-hidden="true" />;
  }

  return <Pill size={size} strokeWidth={2.5} aria-hidden="true" />;
};

export const PrintFridgeSchedule: React.FC = () => {
  const { regimen, getCalendarDaysForCycle } = useRegimen();
  const { settings } = useSettings();

  const cycleNum = settings.activeCycle || 1;
  const days = getCalendarDaysForCycle(cycleNum);

  const startDate = getDateForCycleAndDay(
    regimen.cycleStartDate,
    regimen.cycleDurationDays,
    cycleNum,
    1
  );
  const endDate = getDateForCycleAndDay(
    regimen.cycleStartDate,
    regimen.cycleDurationDays,
    cycleNum,
    regimen.cycleDurationDays
  );

  const contacts = regimen.contacts || [];

  return (
    <div
      className={clsx('print-schedule-container print-only', {
        'print-page-landscape': settings.printLayout === 'letter-landscape',
        'print-page-tabloid': settings.printLayout === 'tabloid-landscape'
      })}
    >
      {/* Print Document Header */}
      <div className="print-header">
        <div>
          <h1 className="print-title">REFRIGERATOR MEDICATION SCHEDULE</h1>
          <div className="print-date-range">
            {formatShortDate(startDate)} – {formatShortDate(endDate)}
          </div>
          <p className="print-subtitle">
            {regimen.regimenName} • Cycle {cycleNum} of {regimen.totalCycles}
          </p>
        </div>
        <div className="print-header-meta">
          <div className="print-schedule-type">
            {regimen.cycleDurationDays}-Day Calendar Schedule
          </div>
        </div>
      </div>

      {/* Patient & Care Team Contact Box */}
      <div className="print-meta-grid">
        <div className="print-meta-item">
          <strong>Patient:</strong> {regimen.patientName || 'Eleanor Vance'}
        </div>
        <div className="print-meta-item">
          <strong>Physician:</strong> {regimen.physicianName || 'Dr. Sarah Jenkins, MD'}
        </div>
        <div className="print-meta-item">
          <strong>Clinic Phone:</strong> {regimen.clinicPhone || '(555) 234-5678'}
        </div>
      </div>

      {/* Plain-Language Medication Legend */}
      <div className="print-legend">
        <div className="print-legend-title">Medication Instructions & Routes</div>
        <div className="print-legend-grid">
          {regimen.medications.map((med) => (
            <div key={med.id} className="print-legend-card">
              <div className="print-legend-card-title">
                {getMedicationIcon(med, 14)}
                <span>{med.patientFriendlyName || med.name || 'Medication'}</span>
              </div>
              <div className="print-legend-card-route">Route: {med.route}</div>
              <div className="print-legend-card-instructions">
                <strong>When:</strong> {formatMedicationRoutine(med, regimen.cycleDurationDays)} • {med.instructions}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 28-Day Monthly Grid for Refrigerator */}
      <div className="print-calendar-grid">
        {Array.from({ length: 7 }, (_, colIdx) => {
          const sampleDate = getDateForCycleAndDay(
            regimen.cycleStartDate,
            regimen.cycleDurationDays,
            1,
            colIdx + 1
          );
          const shortDay = sampleDate.toLocaleDateString('en-US', { weekday: 'short' });
          return `${shortDay} • Day ${colIdx + 1}`;
        }).map((header, i) => (
          <div key={i} className="print-grid-header">
            {header}
          </div>
        ))}

        {days.map((day) => (
          <div
            key={day.cycleDay}
            className={clsx('print-day-cell', { 'rest-day': day.isRestDay })}
          >
            <div className="print-day-top">
              <span className="print-day-date">{formatShortDate(day.date)}</span>
              <span className="print-day-number">Day {day.cycleDay}</span>
            </div>

            <div className="print-day-body">
              {day.isRestDay ? (
                <div className="print-rest-day-text">
                  Rest Day
                </div>
              ) : (
                (() => {
                  const morningMeds = day.medications.filter(
                    (m) => !m.timeOfDay || m.timeOfDay === 'morning' || m.timeOfDay === 'split' || m.timeOfDay === 'anytime'
                  );
                  const eveningMeds = day.medications.filter(
                    (m) => m.timeOfDay === 'evening' || m.timeOfDay === 'split'
                  );

                  return (
                    <div className="print-day-slots">
                      {morningMeds.length > 0 && (
                        <div className={clsx('print-time-slot print-slot-morning', { 'has-divider': eveningMeds.length > 0 })}>
                          <div className="print-slot-header">
                            <Sun size={9} aria-hidden="true" />
                            <span>MORNING / AM</span>
                          </div>
                          {morningMeds.map((med) => (
                            <div key={`${med.id}-am`} className="print-med-item">
                              <span className="print-check-circle" />
                              {getMedicationIcon(med, 11)}
                              <span>{med.patientFriendlyName || med.name || 'Medication'}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {eveningMeds.length > 0 && (
                        <div className="print-time-slot print-slot-evening">
                          <div className="print-slot-header">
                            <Moon size={9} aria-hidden="true" />
                            <span>NIGHT / PM</span>
                          </div>
                          {eveningMeds.map((med) => (
                            <div key={`${med.id}-pm`} className="print-med-item">
                              <span className="print-check-circle" />
                              {getMedicationIcon(med, 11)}
                              <span>{med.patientFriendlyName || med.name || 'Medication'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()
              )}

              {day.requiresHydrationAlert && (
                <div className="print-hydration-alert">
                  <Droplets size={12} aria-hidden="true" />
                  <span>Drink 8-12 cups</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Emergency & Nurse Triage Directory Section */}
      {contacts.length > 0 && (
        <div className="print-directory-section">
          <div className="print-directory-title">
            Emergency & Nurse Triage Care Directory
          </div>
          <div className="print-directory-grid">
            {contacts.slice(0, 6).map((c) => (
              <div key={c.id} className="print-directory-item">
                <div className="print-directory-name">{c.name}</div>
                <div className="print-directory-phone">{c.phone}</div>
                <div className="print-directory-role">{c.role} ({c.hours})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Hydration & Safety Notice */}
      <div className="print-safety-notice">
        <div className="print-safety-title">
          <AlertTriangle size={16} />
          <span>Important Safety & Hydration Instructions</span>
        </div>
        <p className="print-safety-body">
          • <strong>Hydration:</strong> Drink 8 to 12 cups (2-3 Liters) of water/fluids on Cyclophosphamide days (Days 1, 8, 15, 22).<br />
          • <strong>Steroid Timing:</strong> Take Dexamethasone in the morning with breakfast to protect your stomach.<br />
          • <strong>Emergency Alert:</strong> Call clinic immediately if fever exceeds 100.4°F (38°C) or if experiencing severe numbness/tingling.
        </p>
      </div>

      {/* Emergency Contacts Footer */}
      <div className="print-emergency-footer">
        <div>
          <strong>Urgent / After-Hours Oncology Line:</strong> {regimen.emergencyPhone || '(555) 911-0000'}
        </div>
        <div className="print-nurse-line">
          <strong>Visiting Nurse / Home Health:</strong> ______________________
        </div>
      </div>
    </div>
  );
};
