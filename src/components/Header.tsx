import React, { useState, useRef, useEffect } from 'react';
import { useRegimen } from '../context/RegimenContext';


export const Header: React.FC = () => {
  const { 
    regimenConfig, 
    highContrast, 
    setHighContrast, 
    setIsAdminOpen,
    activeTab,
    setActiveTab
  } = useRegimen();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="no-print" style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 30,
      backgroundColor: 'var(--md-sys-color-surface)',
      color: 'var(--md-sys-color-on-surface)',
      borderBottom: '1px solid var(--md-sys-color-outline)'
    }}>
      <md-elevation></md-elevation>
      
      {/* Main Header Brand & Title Bar */}
      <div className="layout-container flex-row justify-between items-center py-4">
        
        {/* Brand & Regimen info */}
        <div className="flex-row items-center gap-4">
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--md-sys-color-primary)',
            color: 'var(--md-sys-color-on-primary)'
          }}>
            <md-icon style={{ fontSize: '32px' }}>pill</md-icon>
          </div>
          <div>
            <h1 className="text-headline" style={{ margin: 0 }}>
              Chemo Calendar
            </h1>
            <p className="text-body-medium flex-row items-center gap-2" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
              <span>{regimenConfig.regimenName}</span>
              <span style={{
                backgroundColor: 'var(--md-sys-color-secondary-container)',
                color: 'var(--md-sys-color-on-secondary-container)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '12px'
              }}>
                {regimenConfig.cycleDurationDays}-Day Cycle
              </span>
            </p>
          </div>
        </div>

        {/* Right side: Regimen Schedule Stats & Settings Entry Point */}
        <div className="flex-row items-center gap-4">
          
          <div className="flex-col items-center justify-center hidden sm:flex" style={{
            border: '1px solid var(--md-sys-color-outline)',
            borderRadius: '12px',
            padding: '8px 16px',
            textAlign: 'right'
          }}>
            <div className="text-label-large">
              Started: {regimenConfig.cycleStartDate}
            </div>
            <div className="text-body-small" style={{ color: 'var(--md-sys-color-primary)' }}>
              {regimenConfig.totalCycles} Total Cycles ({regimenConfig.cycleDurationDays * regimenConfig.totalCycles} Days)
            </div>
          </div>

          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <md-outlined-button onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
              <md-icon slot="icon">settings</md-icon>
              Settings
            </md-outlined-button>

            {/* Settings Dropdown Flyout */}
            {isSettingsOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '8px',
                  width: '320px',
                  backgroundColor: 'var(--md-sys-color-surface-container)',
                  borderRadius: '24px',
                  padding: '24px',
                  zIndex: 50,
                  border: '1px solid var(--md-sys-color-outline)'
                }}
              >
                <md-elevation></md-elevation>
                
                {/* Flyout Header */}
                <div className="flex-row items-center justify-between mb-4 pb-2" style={{ borderBottom: '1px solid var(--md-sys-color-outline)' }}>
                  <div className="flex-row items-center gap-2">
                    <md-icon>settings</md-icon>
                    <h2 className="text-title-medium" style={{ margin: 0 }}>
                      Settings & Accessibility
                    </h2>
                  </div>
                  <md-icon-button onClick={() => setIsSettingsOpen(false)}>
                    <md-icon>close</md-icon>
                  </md-icon-button>
                </div>

                {/* Control 2: High Contrast Toggle */}
                <div className="mb-4">
                  <md-filled-tonal-button 
                    onClick={() => setHighContrast(!highContrast)} 
                    style={{ width: '100%', '--md-filled-tonal-button-container-color': highContrast ? 'var(--md-sys-color-tertiary)' : undefined, '--md-filled-tonal-button-label-text-color': highContrast ? 'var(--md-sys-color-on-tertiary)' : undefined, '--md-filled-tonal-button-icon-color': highContrast ? 'var(--md-sys-color-on-tertiary)' : undefined } as React.CSSProperties}
                  >
                    <md-icon slot="icon">{highContrast ? 'light_mode' : 'dark_mode'}</md-icon>
                    High Contrast Mode ({highContrast ? 'ON' : 'OFF'})
                  </md-filled-tonal-button>
                </div>

                <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="mb-2">
                    <md-filled-button
                      onClick={() => {
                        setActiveTab('print');
                        setIsSettingsOpen(false);
                      }}
                      style={{ 
                        width: '100%', 
                        '--md-filled-button-container-color': 'var(--md-sys-color-success-container)', 
                        '--md-filled-button-label-text-color': 'var(--md-sys-color-on-success-container)', 
                        '--md-filled-button-icon-color': 'var(--md-sys-color-on-success-container)',
                        '--md-filled-button-hover-label-text-color': 'var(--md-sys-color-on-success-container)',
                        '--md-filled-button-hover-icon-color': 'var(--md-sys-color-on-success-container)',
                        '--md-filled-button-pressed-label-text-color': 'var(--md-sys-color-on-success-container)',
                        '--md-filled-button-pressed-icon-color': 'var(--md-sys-color-on-success-container)',
                        '--md-filled-button-focus-label-text-color': 'var(--md-sys-color-on-success-container)',
                        '--md-filled-button-focus-icon-color': 'var(--md-sys-color-on-success-container)'
                      } as React.CSSProperties}
                    >
                      <md-icon slot="icon">print</md-icon>
                      Print Fridge Schedule
                    </md-filled-button>
                  </div>
                  <div>
                    <md-filled-button
                      onClick={() => {
                        setIsAdminOpen(true);
                        setIsSettingsOpen(false);
                      }}
                      style={{ 
                        width: '100%', 
                        '--md-filled-button-container-color': 'var(--md-sys-color-error)', 
                        '--md-filled-button-label-text-color': 'var(--md-sys-color-on-error)', 
                        '--md-filled-button-icon-color': 'var(--md-sys-color-on-error)',
                        '--md-filled-button-hover-label-text-color': 'var(--md-sys-color-on-error)',
                        '--md-filled-button-hover-icon-color': 'var(--md-sys-color-on-error)',
                        '--md-filled-button-pressed-label-text-color': 'var(--md-sys-color-on-error)',
                        '--md-filled-button-pressed-icon-color': 'var(--md-sys-color-on-error)',
                        '--md-filled-button-focus-label-text-color': 'var(--md-sys-color-on-error)',
                        '--md-filled-button-focus-icon-color': 'var(--md-sys-color-on-error)'
                      } as React.CSSProperties}
                    >
                      <md-icon slot="icon">admin_panel_settings</md-icon>
                      Caregiver Admin Portal
                    </md-filled-button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation using Material Tabs */}
      <div style={{ backgroundColor: 'var(--md-sys-color-surface)' }}>
        <div className="layout-container">
          <md-tabs aria-label="Main Navigation">
            <md-primary-tab 
              active={activeTab === 'today' ? true : undefined}
              onClick={() => setActiveTab('today')}
            >
              <md-icon slot="icon">check_circle</md-icon>
              Today's Schedule
            </md-primary-tab>
            
            <md-primary-tab 
              active={activeTab === 'table' ? true : undefined}
              onClick={() => setActiveTab('table')}
            >
              <md-icon slot="icon">table_chart</md-icon>
              Day Table View
            </md-primary-tab>
            

            
            <md-primary-tab 
              active={activeTab === 'monthly' ? true : undefined}
              onClick={() => setActiveTab('monthly')}
            >
              <md-icon slot="icon">date_range</md-icon>
              Monthly Calendar
            </md-primary-tab>
            
            <md-primary-tab 
              active={activeTab === 'medications' ? true : undefined}
              onClick={() => setActiveTab('medications')}
            >
              <md-icon slot="icon">menu_book</md-icon>
              Medication Guide
            </md-primary-tab>
          </md-tabs>
        </div>
      </div>
    </header>
  );
};
