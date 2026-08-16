import React from 'react';
import { useRegimen } from '../context/RegimenContext';

export const MedicationGuide: React.FC = () => {
  const { regimenConfig } = useRegimen();

  return (
    <div className="layout-container py-6 flex-col gap-6" style={{ maxWidth: '1000px' }}>
      
      {/* Header Banner */}
      <md-elevated-card style={{ padding: '24px' }}>
        <div className="flex-row items-center gap-4">
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)' }}>
            <md-icon style={{ fontSize: '32px' }}>menu_book</md-icon>
          </div>
          <div>
            <h2 className="text-headline" style={{ margin: 0, fontWeight: 900 }}>
              Medication Reference Guide
            </h2>
            <p className="text-body-large" style={{ margin: 0, marginTop: '4px', fontWeight: 'bold', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Understanding your chemotherapy drugs, administration routes, and safety tips.
            </p>
          </div>
        </div>
      </md-elevated-card>

      {/* Drug Cards */}
      <div className="flex-col gap-6">
        {regimenConfig.medications.map(med => {
          const isInjection = med.route.toLowerCase().includes('injection') || med.route.toLowerCase().includes('shot');
          const medColor = med.badgeColor || 'primary';

          return (
            <md-outlined-card
              key={med.id}
              style={{ padding: '24px', borderColor: `var(--md-sys-color-${medColor})`, borderWidth: '2px' }}
            >
              {/* Top Title & Route */}
              <div className="flex-row items-center justify-between gap-4 pb-4 mb-4" style={{ borderBottom: '1px solid var(--md-sys-color-outline)' }}>
                <div className="flex-row items-center gap-4">
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `var(--md-sys-color-${medColor}-container)`, color: `var(--md-sys-color-on-${medColor}-container)` }}>
                    <md-icon style={{ fontSize: '32px' }}>{isInjection ? 'vaccines' : 'pill'}</md-icon>
                  </div>
                  <div>
                    <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', backgroundColor: `var(--md-sys-color-${medColor})`, color: `var(--md-sys-color-on-${medColor})` }}>
                      {med.route}
                    </span>
                    <h3 className="text-display" style={{ margin: 0, marginTop: '8px', fontSize: '32px', lineHeight: '40px', fontWeight: 900 }}>
                      {med.patientFriendlyName}
                    </h3>
                    <p className="text-title-medium" style={{ margin: 0, marginTop: '4px', fontWeight: 'bold', color: 'var(--md-sys-color-on-surface-variant)' }}>
                      Clinical Name: {med.clinicalName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule Days & Administration */}
              <div className="grid grid-cols-1 sm-grid-cols-2 gap-6">
                
                {/* Active Cycle Days */}
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container)', border: '1px solid var(--md-sys-color-outline)', borderRadius: '16px', padding: '20px' }}>
                  <h4 className="text-title-large flex-row items-center gap-2" style={{ margin: 0, fontWeight: 900 }}>
                    <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>verified_user</md-icon>
                    <span>Scheduled Cycle Days ({med.days.length} doses)</span>
                  </h4>
                  <div className="flex-row flex-wrap gap-2 mt-4">
                    {med.days.map(d => (
                      <span
                        key={d}
                        style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 900 }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <p className="text-body-small mt-3" style={{ margin: 0, fontWeight: 'bold', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Days correspond to each 28-day chemotherapy cycle.
                  </p>
                </div>

                {/* Instructions */}
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container)', border: '1px solid var(--md-sys-color-outline)', borderRadius: '16px', padding: '20px' }}>
                  <h4 className="text-title-large flex-row items-center gap-2" style={{ margin: 0, fontWeight: 900 }}>
                    <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>info</md-icon>
                    <span>Administration Instructions</span>
                  </h4>
                  <p className="text-body-large mt-4" style={{ margin: 0, fontWeight: 'bold' }}>
                    {med.instructions}
                  </p>
                </div>

              </div>

              {/* Side Effects & Precautions */}
              {med.sideEffects && med.sideEffects.length > 0 && (
                <div className="mt-6" style={{ backgroundColor: 'var(--md-sys-color-error-container)', border: '2px solid var(--md-sys-color-error)', borderRadius: '16px', padding: '20px', color: 'var(--md-sys-color-on-error-container)' }}>
                  <h4 className="text-title-large flex-row items-center gap-2" style={{ margin: 0, fontWeight: 900 }}>
                    <md-icon style={{ color: 'var(--md-sys-color-error)' }}>warning</md-icon>
                    <span>Side Effect Precautions & Tips</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm-grid-cols-3 gap-3 mt-4" style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                    {med.sideEffects.map((effect, idx) => (
                      <li
                        key={idx}
                        style={{ backgroundColor: 'var(--md-sys-color-surface)', border: '1px solid var(--md-sys-color-outline)', borderRadius: '12px', padding: '12px', fontSize: '14px', fontWeight: 'bold', color: 'var(--md-sys-color-on-surface)' }}
                      >
                        &bull; {effect}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </md-outlined-card>
          );
        })}
      </div>

    </div>
  );
};
