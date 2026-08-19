import React, { useState } from 'react';
import {
  Palette,
  Type,
  MousePointerClick,
  Sparkles,
  Droplets,
  Syringe,
  Pill,
  CalendarCheck,
  CalendarDays,
  BookOpen,
  Rows3,
  Printer,
  Settings,
  ShieldCheck,
  SunMoon,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  HeartHandshake,
  Lock,
  KeyRound,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Copy,
  Save,
  Plus,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertTriangle,
  Layers,
  Sliders,
  Check
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import {
  Button,
  Card,
  Heading,
  Text,
  Caption,
  Code,
  Stack,
  Grid,
  Box,
  Badge,
  Tag,
  Callout,
  AccessibleCheckbox,
  AccessibleSwitch,
  AccessibleSlider,
  DialogModal,
  AppLogo
} from '../common';


export const DesignSystemView: React.FC = () => {
  const { settings, toggleHighContrast, setFontScale, setIsSettingsOpen } = useSettings();
  const [testCheckbox, setTestCheckbox] = useState(true);
  const [testSwitch, setTestSwitch] = useState(true);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const colors = [
    {
      name: 'Primary',
      token: '--md-sys-color-primary',
      badgeColor: 'primary' as const,
      usage: 'Key navigation tabs, primary action buttons, active cycle indicators'
    },
    {
      name: 'Primary Container',
      token: '--md-sys-color-primary-container',
      badgeColor: 'primary' as const,
      usage: 'Active day cards, tonal button backgrounds, Bortezomib badges'
    },
    {
      name: 'Secondary',
      token: '--md-sys-color-secondary',
      badgeColor: 'secondary' as const,
      usage: 'Cyclophosphamide badges, secondary icons, subtitle elements'
    },
    {
      name: 'Secondary Container',
      token: '--md-sys-color-secondary-container',
      badgeColor: 'secondary' as const,
      usage: 'Cyclophosphamide medication pill containers, subtle tags'
    },
    {
      name: 'Tertiary (Amethyst / Steroid)',
      token: '--md-sys-color-tertiary',
      badgeColor: 'tertiary' as const,
      usage: 'Dexamethasone steroid badges, supportive care highlights'
    },
    {
      name: 'Tertiary Container',
      token: '--md-sys-color-tertiary-container',
      badgeColor: 'tertiary' as const,
      usage: 'Dexamethasone steroid container background and indicators'
    },
    {
      name: 'Success (Adherence Complete)',
      token: '--md-sys-color-success',
      badgeColor: 'success' as const,
      usage: 'Dose completion checkmarks, adherence progress indicators'
    },
    {
      name: 'Warning (Hydration Alert)',
      token: '--md-sys-color-warning',
      badgeColor: 'warning' as const,
      usage: 'High hydration banners, fluid logging reminders'
    },
    {
      name: 'Error (Urgent Oncology Alert)',
      token: '--md-sys-color-error',
      badgeColor: 'error' as const,
      usage: 'Fever thresholds, emergency oncology phone alerts, validation errors'
    },
    {
      name: 'Surface Dim',
      token: '--md-sys-color-surface-dim',
      badgeColor: 'none' as const,
      usage: 'Application canvas background in high-contrast and standard themes'
    },
    {
      name: 'Surface Bright',
      token: '--md-sys-color-surface-bright',
      badgeColor: 'none' as const,
      usage: 'Elevated patient cards, medication item containers, modal surfaces'
    },
    {
      name: 'Outline Variant',
      token: '--md-sys-color-outline-variant',
      badgeColor: 'none' as const,
      usage: 'Subtle component dividing borders, inactive day borders'
    }
  ];

  const icons = [
    { icon: <Pill size={22} />, name: 'Pill', usage: 'Oral medication badges (Cyclo)' },
    { icon: <Syringe size={22} />, name: 'Syringe', usage: 'Injected medication badges (Bortezomib)' },
    { icon: <Sparkles size={22} />, name: 'Sparkles', usage: 'Steroid / Dexamethasone badges' },
    { icon: <Droplets size={22} />, name: 'Droplets', usage: 'Hydration goal alerts and fluid tracker' },
    { icon: <CalendarDays size={22} />, name: 'CalendarDays', usage: '28-Day cycle grid view tab' },
    { icon: <CalendarCheck size={22} />, name: 'CalendarCheck', usage: 'Today schedule view tab' },
    { icon: <Rows3 size={22} />, name: 'Rows3', usage: 'Day List view tab' },
    { icon: <BookOpen size={22} />, name: 'BookOpen', usage: 'Medication Guide view tab' },
    { icon: <Printer size={22} />, name: 'Printer', usage: 'Printable fridge schedule trigger' },
    { icon: <SunMoon size={22} />, name: 'SunMoon', usage: 'WCAG AAA High-Contrast mode toggle' },
    { icon: <ZoomIn size={22} />, name: 'ZoomIn', usage: 'Text magnification increase' },
    { icon: <ZoomOut size={22} />, name: 'ZoomOut', usage: 'Text magnification decrease' },
    { icon: <Settings size={22} />, name: 'Settings', usage: 'Settings drawer modal trigger' },
    { icon: <ShieldCheck size={22} />, name: 'ShieldCheck', usage: 'Caregiver Admin Portal button' },
    { icon: <Lock size={22} />, name: 'Lock', usage: 'Caregiver PIN authentication avatar' },
    { icon: <KeyRound size={22} />, name: 'KeyRound', usage: 'PIN unlock action button' },
    { icon: <CheckCircle2 size={22} />, name: 'CheckCircle2', usage: 'Medication completed check indicator' },
    { icon: <HeartHandshake size={22} />, name: 'HeartHandshake', usage: 'Rest & Recovery Day icon' },
    { icon: <AlertTriangle size={22} />, name: 'AlertTriangle', usage: 'Critical oncology safety notices' },
    { icon: <RotateCcw size={22} />, name: 'RotateCcw', usage: 'Reset regimen / font scale' },
    { icon: <Save size={22} />, name: 'Save', usage: 'Save regimen configuration' },
    { icon: <Download size={22} />, name: 'Download', usage: 'Export JSON schema' },
    { icon: <Upload size={22} />, name: 'Upload', usage: 'Ingest / upload JSON schema' },
    { icon: <Trash2 size={22} />, name: 'Trash2', usage: 'Delete medication / clear history' },
    { icon: <Copy size={22} />, name: 'Copy', usage: 'Copy JSON schema to clipboard' },
    { icon: <Plus size={22} />, name: 'Plus', usage: 'Add new medication to schedule' },
    { icon: <ChevronLeft size={22} />, name: 'ChevronLeft', usage: 'Previous day / previous cycle navigation' },
    { icon: <ChevronRight size={22} />, name: 'ChevronRight', usage: 'Next day / next cycle navigation' },
    { icon: <Info size={22} />, name: 'Info', usage: 'Medication details expander' }
  ];

  return (
    <Stack direction="column" gap="5" fullWidth>
      {/* Page Header */}
      <Card variant="elevated" padding="md">
        <Stack direction="row" justify="between" align="center" wrap gap="3">
          <Stack direction="column" gap="1">
            <Badge label="Design System & Token Architecture" color="primary" />
            <Heading level={1} variant="h1">
              Digital Pillbox Design System
            </Heading>
            <Text size="sm" color="muted">
              Complete living catalog of Material Design 3 tokens, accessibility components, color roles, typography scales, touch ergonomics, and clinical iconography.
            </Text>
          </Stack>

          <Button
            variant={settings.highContrast ? 'filled' : 'outlined'}
            size="md"
            onPress={toggleHighContrast}
            leftIcon={<SunMoon size={18} />}
          >
            {settings.highContrast ? 'High Contrast: ON' : 'Toggle High Contrast'}
          </Button>
        </Stack>
      </Card>

      {/* ====================================================================
          SECTION 1: Color Palette & M3 Tokens
         ==================================================================== */}
      <Card variant="elevated" padding="md">
        <Stack direction="column" gap="4">
          <Stack direction="row" align="center" gap="2">
            <Palette size={24} color="var(--md-sys-color-primary)" />
            <Heading level={2} variant="h2">
              1. Color Roles & M3 Tokens
            </Heading>
          </Stack>
          <Text size="sm" color="muted">
            Tailored HSL-calibrated palette meeting WCAG AAA non-text and text contrast ratios.
          </Text>

          <Grid columns="repeat(auto-fill, minmax(260px, 1fr))" gap="3">
            {colors.map((c, i) => (
              <Card key={i} variant="outlined" padding="md" accentBorder={c.badgeColor}>
                <Stack direction="column" gap="1">
                  <Text size="base" weight="bold">{c.name}</Text>
                  <Code>{c.token}</Code>
                  <Caption>{c.usage}</Caption>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>

      {/* ====================================================================
          SECTION 2: Senior-Friendly Typography & Fluid Magnification
         ==================================================================== */}
      <Card variant="elevated" padding="md">
        <Stack direction="column" gap="4">
          <Stack direction="row" align="center" gap="2">
            <Type size={24} color="var(--md-sys-color-primary)" />
            <Heading level={2} variant="h2">
              2. Senior-Friendly Typography Hierarchy
            </Heading>
          </Stack>
          <Text size="sm" color="muted">
            Current Scale Factor: <strong>{Math.round(settings.fontScale * 100)}%</strong> (scales from 100% to 150%). Minimum 18px body and 24px headings.
          </Text>

          <Card variant="flat" padding="md">
            <Stack direction="column" gap="3">
              <Stack direction="column" gap="0_5">
                <Caption>Heading 1 (29px+ scaled):</Caption>
                <Heading level={1} variant="h1">Multiple Myeloma Regimen (MUM46)</Heading>
              </Stack>

              <Stack direction="column" gap="0_5">
                <Caption>Heading 2 (24px+ scaled):</Caption>
                <Heading level={2} variant="h2">Sunday, August 16, 2026</Heading>
                <Text size="sm" color="muted">Cycle 1 of 4 • Day 1 of 28</Text>
              </Stack>

              <Stack direction="column" gap="0_5">
                <Caption>Heading 3 (20px+ scaled):</Caption>
                <Heading level={3} variant="h3">Medications Scheduled for Today</Heading>
              </Stack>

              <Stack direction="column" gap="0_5">
                <Caption>Body Text (Minimum 18px scaled, line-height 1.5):</Caption>
                <Text size="base">
                  Drink 8 to 12 cups (2-3 Liters) of fluids throughout the day. Take Dexamethasone with food in the morning to protect stomach lining.
                </Text>
              </Stack>

              <Stack direction="column" gap="0_5">
                <Caption>Monospace Code (Regimen JSON Schema):</Caption>
                <Code>{`{ "cycleDurationDays": 28, "cycleStartDate": "2026-08-16" }`}</Code>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Card>

      {/* ====================================================================
          SECTION 3: Buttons & Interactive Action Primitives
         ==================================================================== */}
      <Card variant="elevated" padding="md">
        <Stack direction="column" gap="4">
          <Stack direction="row" align="center" gap="2">
            <MousePointerClick size={24} color="var(--md-sys-color-primary)" />
            <Heading level={2} variant="h2">
              3. Buttons & Interactive Primitives
            </Heading>
          </Stack>
          <Text size="sm" color="muted">
            All buttons enforce minimum 48px touch targets, smooth pill borders, and tactile active states.
          </Text>

          <Stack direction="column" gap="3">
            <Stack direction="column" gap="2">
              <Text size="sm" weight="bold">Standard Button Variants:</Text>
              <Stack direction="row" gap="3" wrap align="center">
                <Button variant="filled" size="md" leftIcon={<Check size={18} />}>
                  Filled Primary
                </Button>
                <Button variant="filled-tonal" size="md" leftIcon={<Sparkles size={18} />}>
                  Filled Tonal
                </Button>
                <Button variant="outlined" size="md" leftIcon={<Printer size={18} />}>
                  Outlined Button
                </Button>
                <Button variant="text" size="md" leftIcon={<Settings size={18} />}>
                  Text / Ghost Button
                </Button>
                <Button variant="filled" size="lg" leftIcon={<Printer size={22} />}>
                  Large Action (58px)
                </Button>
                <Button variant="filled" size="md" isDisabled>
                  Disabled Button
                </Button>
              </Stack>
            </Stack>

            <Stack direction="column" gap="2">
              <Text size="sm" weight="bold">Navigation & Cycle Controls:</Text>
              <Stack direction="row" gap="2" wrap align="center">
                <Button variant="filled" size="md" className="cycle-pill-btn">
                  <Stack direction="column" align="center" gap="0">
                    <Text size="sm" weight="bold" color="inherit">Aug 16 – Sep 12</Text>
                    <Caption>Cycle 1 (Active)</Caption>
                  </Stack>
                </Button>
                <Button variant="outlined" size="md" className="cycle-pill-btn">
                  <Stack direction="column" align="center" gap="0">
                    <Text size="sm" weight="bold" color="inherit">Sep 13 – Oct 10</Text>
                    <Caption>Cycle 2</Caption>
                  </Stack>
                </Button>
                <Button variant="outlined" size="md" leftIcon={<ChevronLeft size={18} />}>
                  Prev Day
                </Button>
                <Button variant="outlined" size="md" rightIcon={<ChevronRight size={18} />}>
                  Next Day
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Card>

      {/* ====================================================================
          SECTION 4: Form Controls & React Aria Primitives
         ==================================================================== */}
      <Card variant="elevated" padding="md">
        <Stack direction="column" gap="4">
          <Stack direction="row" align="center" gap="2">
            <Sliders size={24} color="var(--md-sys-color-primary)" />
            <Heading level={2} variant="h2">
              4. Form Controls (React Aria Components)
            </Heading>
          </Stack>

          <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="4">
            {/* Tactile Checkboxes */}
            <Card variant="flat" padding="md">
              <Stack direction="column" gap="3">
                <Text size="sm" weight="bold">Senior Tactile Checkboxes (34px box):</Text>
                <AccessibleCheckbox
                  isSelected={testCheckbox}
                  onChange={setTestCheckbox}
                  label="Bortezomib (Injection)"
                  subLabel="Administered at clinic nurse station"
                />
                <AccessibleCheckbox
                  isSelected={!testCheckbox}
                  onChange={() => setTestCheckbox(!testCheckbox)}
                  label="Cyclophosphamide (Oral Pill)"
                  subLabel="Take with 8-12 cups of water"
                />
              </Stack>
            </Card>

            {/* Accessible Switch */}
            <Card variant="flat" padding="md">
              <Stack direction="column" gap="3">
                <Text size="sm" weight="bold">Accessible Switch Toggle:</Text>
                <AccessibleSwitch
                  isSelected={testSwitch}
                  onChange={setTestSwitch}
                  label="Live High-Contrast Mode"
                  description="Mutates CSS custom properties for WCAG AAA"
                />
              </Stack>
            </Card>

            {/* Accessible Slider */}
            <Card variant="flat" padding="md">
              <Stack direction="column" gap="3">
                <Text size="sm" weight="bold">Accessible Slider (Live App Scaling):</Text>
                <AccessibleSlider
                  label="Text Magnification Slider"
                  value={settings.fontScale}
                  onChange={setFontScale}
                  minValue={1.0}
                  maxValue={1.5}
                  step={0.05}
                  helperText="Fluidly scales all typography and UI elements across the entire app"
                />
              </Stack>
            </Card>
          </Grid>
        </Stack>
      </Card>

      {/* ====================================================================
          SECTION 5: Badges & Route Tags
         ==================================================================== */}
      <Card variant="elevated" padding="md">
        <Stack direction="column" gap="4">
          <Stack direction="row" align="center" gap="2">
            <Sparkles size={24} color="var(--md-sys-color-primary)" />
            <Heading level={2} variant="h2">
              5. Medication Badges & Route Tags
            </Heading>
          </Stack>
          <Stack direction="row" gap="3" wrap align="center">
            <Badge label="Bortezomib (Shot under skin)" color="primary" iconType="injection" />
            <Badge label="Cyclophosphamide (Take by mouth)" color="tertiary" iconType="pill" />
            <Badge label="Dexamethasone (Pill)" color="warning" iconType="pill" />
            <Badge label="Completed / Taken" color="success" iconType="check" />
            <Badge label="High Hydration Day" color="warning" iconType="alert" />
            <Tag label="URGENT (24/7 Triage)" color="error" iconType="alert" />
            <Tag label="Clinic Visit" color="primary" iconType="none" />
          </Stack>
        </Stack>
      </Card>

      {/* ====================================================================
          SECTION 6: Clinical Cards & Alert Banners
         ==================================================================== */}
      <Card variant="elevated" padding="md">
        <Stack direction="column" gap="4">
          <Stack direction="row" align="center" gap="2">
            <Layers size={24} color="var(--md-sys-color-primary)" />
            <Heading level={2} variant="h2">
              6. Clinical Cards & Alert Banners
            </Heading>
          </Stack>

          <Stack direction="column" gap="3">
            {/* Clinic Appointment Banner */}
            <Callout
              variant="primary"
              icon={<Syringe size={28} />}
              title="Clinic Appointment Banner"
            >
              <Text size="sm">
                Visual indicator for days requiring an in-clinic injection from a healthcare provider.
              </Text>
            </Callout>

            {/* Hydration Alert Banner */}
            <Callout
              variant="warning"
              icon={<Droplets size={26} />}
              title="Hydration Goal Banner (8-12 Cups Target)"
              action={
                <Stack direction="row" align="center" gap="2">
                  <Button variant="outlined" size="sm">-</Button>
                  <Text size="sm" weight="extrabold" color="primary">6 / 10 Cups</Text>
                  <Button variant="filled" size="sm">+</Button>
                </Stack>
              }
            >
              <Text size="sm">
                Active on Cyclophosphamide chemotherapy days to protect bladder health.
              </Text>
            </Callout>

            {/* Rest & Recovery Card */}
            <Callout
              variant="rest"
              icon={<HeartHandshake size={32} color="var(--md-sys-color-primary)" />}
              title="Rest & Recovery Day Card"
            >
              <Text size="sm" color="muted">
                Displayed when no chemotherapy medications are scheduled for the active date.
              </Text>
            </Callout>
          </Stack>
        </Stack>
      </Card>

      {/* ====================================================================
          SECTION 7: Complete Iconography Library
         ==================================================================== */}
      <Card variant="elevated" padding="md">
        <Stack direction="column" gap="4">
          <Stack direction="row" align="center" gap="2">
            <Sparkles size={24} color="var(--md-sys-color-primary)" />
            <Heading level={2} variant="h2">
              7. Complete Clinical & UI Icon Library ({icons.length} Icons)
            </Heading>
          </Stack>

          <Grid columns="repeat(auto-fill, minmax(220px, 1fr))" gap="3">
            {icons.map((item, idx) => (
              <Card key={idx} variant="flat" padding="sm">
                <Stack direction="row" align="center" gap="3">
                  <Box color="primary">
                    {item.icon}
                  </Box>
                  <Stack direction="column" gap="0">
                    <Text size="sm" weight="bold">{item.name}</Text>
                    <Caption>{item.usage}</Caption>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>

      {/* ====================================================================
          SECTION 8: Modals & Dialog Demonstration
         ==================================================================== */}
      <Card variant="elevated" padding="md">
        <Stack direction="column" gap="4">
          <Stack direction="row" align="center" gap="2">
            <Layers size={24} color="var(--md-sys-color-primary)" />
            <Heading level={2} variant="h2">
              8. Modals, Drawers & Focus Trapping
            </Heading>
          </Stack>
          <Text size="sm" color="muted">
            React Aria Component modal overlays with light dismiss, background dimming, escape key handling, and autofocus trapping.
          </Text>

          <Stack direction="row" gap="3" wrap>
            <Button variant="filled" size="md" onPress={() => setIsDemoModalOpen(true)}>
              Open Test Dialog Modal
            </Button>
            <Button variant="outlined" size="md" onPress={() => setIsSettingsOpen(true)}>
              Open Settings Drawer
            </Button>
          </Stack>

          {/* Test Dialog */}
          <DialogModal
            isOpen={isDemoModalOpen}
            onOpenChange={setIsDemoModalOpen}
            title="Component Showcase Modal"
            subtitle="React Aria Dialog with WCAG AAA accessibility"
            footer={
              <Stack direction="row" justify="end" fullWidth>
                <Button variant="filled" size="md" onPress={() => setIsDemoModalOpen(false)}>
                  Close Dialog
                </Button>
              </Stack>
            }
          >
            <Text size="base">
              This modal demonstrates the accessible Dialog container, background backdrop blur, escape key dismissal, and keyboard focus trap.
            </Text>
          </DialogModal>
        </Stack>
      </Card>

      {/* ====================================================================
          SECTION 9: Brand Identity & App Logo Primitives
         ==================================================================== */}
      <Card variant="elevated" padding="md">
        <Stack direction="column" gap="4">
          <Stack direction="row" align="center" gap="3">
            <AppLogo size="sm" ariaHidden />
            <Heading level={2} variant="h2">
              9. Brand Identity & App Logo Primitives
            </Heading>
          </Stack>
          <Text size="sm" color="muted">
            The Digital Pillbox official SVG logo component, matching brand vectors with full tokenized color roles, squircle/circle/symbol variants, responsive scaling, and WCAG AAA high-contrast adaptation.
          </Text>

          {/* Size Scale */}
          <Stack direction="column" gap="2">
            <Heading level={4} variant="h4">Logo Size Scale</Heading>
            <Card variant="flat" padding="md">
              <Stack direction="row" align="center" gap="5" wrap>
                <Stack direction="column" align="center" gap="1">
                  <AppLogo size="xs" />
                  <Caption>xs (24px)</Caption>
                </Stack>
                <Stack direction="column" align="center" gap="1">
                  <AppLogo size="sm" />
                  <Caption>sm (32px)</Caption>
                </Stack>
                <Stack direction="column" align="center" gap="1">
                  <AppLogo size="md" />
                  <Caption>md (40px)</Caption>
                </Stack>
                <Stack direction="column" align="center" gap="1">
                  <AppLogo size="lg" />
                  <Caption>lg (48px)</Caption>
                </Stack>
                <Stack direction="column" align="center" gap="1">
                  <AppLogo size="xl" />
                  <Caption>xl (64px)</Caption>
                </Stack>
              </Stack>
            </Card>
          </Stack>

          {/* Variants */}
          <Stack direction="column" gap="2">
            <Heading level={4} variant="h4">Logo Variants</Heading>
            <Grid columns="repeat(auto-fit, minmax(220px, 1fr))" gap="3">
              <Card variant="outlined" padding="md">
                <Stack direction="column" align="center" gap="2">
                  <AppLogo variant="squircle" size="xl" />
                  <Text size="sm" weight="bold">Squircle (App Icon)</Text>
                  <Caption>Default app launcher & favicon</Caption>
                </Stack>
              </Card>

              <Card variant="outlined" padding="md">
                <Stack direction="column" align="center" gap="2">
                  <AppLogo variant="circle" size="xl" />
                  <Text size="sm" weight="bold">Circular Badge</Text>
                  <Caption>Circular profile & contact badges</Caption>
                </Stack>
              </Card>

              <Card variant="outlined" padding="md">
                <Stack direction="column" align="center" gap="2">
                  <AppLogo variant="symbol" size="xl" />
                  <Text size="sm" weight="bold">Transparent Symbol</Text>
                  <Caption>For colored headers & overlays</Caption>
                </Stack>
              </Card>

              <Card variant="outlined" padding="md">
                <Stack direction="column" align="center" gap="2">
                  <AppLogo variant="badge" size="lg" />
                  <Text size="sm" weight="bold">Brand Lockup</Text>
                  <Caption>App header & marketing titles</Caption>
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

