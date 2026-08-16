# Chemo Calendar — Design System Specification & Architecture

This document defines the formal **Design System Contract** for the Chemo Calendar application, including token definitions, typography hierarchies, primitive component APIs, and composition patterns.

---

## 1. Architecture Overview

The Chemo Calendar UI is structured in 3 strictly separated layers:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Token Layer (tokens.css, high-contrast.css, tokens.ts)  │
│    Colors, Spacing, Typography Scale, Elevation, Radii      │
├─────────────────────────────────────────────────────────────┤
│ 2. Primitive Layer (/src/components/common/)                │
│    Button, Card, TextField, Heading, Text, Stack, Grid     │
├─────────────────────────────────────────────────────────────┤
│ 3. Feature Views (/src/components/PatientViews, Admin, etc) │
│    Strictly compose primitives. ZERO inline styles or raw   │
│    HTML buttons/inputs allowed.                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Design Token System

### 2.1 Material Design 3 Color Roles
Tokens are defined in `src/styles/tokens.css` and dynamically inverted in `src/styles/high-contrast.css`.

| Token | Semantic Meaning | Standard Value | High Contrast (AAA) |
| :--- | :--- | :--- | :--- |
| `--md-sys-color-primary` | Primary actions, key tabs, active cycle | `#00658b` | `#000000` |
| `--md-sys-color-on-primary` | Text on primary color | `#ffffff` | `#ffffff` |
| `--md-sys-color-primary-container` | Active day card, tonal button, Bortezomib tag | `#c6e7ff` | `#ffffff` |
| `--md-sys-color-on-primary-container` | Text on primary container | `#001e2e` | `#000000` |
| `--md-sys-color-secondary` | Secondary actions, Cyclophosphamide badges | `#486175` | `#000000` |
| `--md-sys-color-secondary-container`| Subtle containers, pill backgrounds | `#cde5fb` | `#ffffff` |
| `--md-sys-color-tertiary` | Steroid / Dexamethasone badges | `#6b5778` | `#000000` |
| `--md-sys-color-tertiary-container` | Dexamethasone highlight containers | `#f3daff` | `#ffffff` |
| `--md-sys-color-error` | Critical clinical warnings, fever alerts | `#ba1a1a` | `#8b0000` |
| `--md-sys-color-error-container` | Urgent banner backgrounds | `#ffdad6` | `#ffffff` |
| `--md-sys-color-warning` | Hydration goals, amber precautions | `#9a5400` | `#7a3e00` |
| `--md-sys-color-warning-container` | Hydration alert containers | `#ffddb8` | `#ffffff` |
| `--md-sys-color-success` | Completed medication doses, adherence done | `#0e6c38` | `#004d20` |
| `--md-sys-color-success-container` | Adherence completion backgrounds | `#baf2cd` | `#ffffff` |
| `--md-sys-color-surface` | Page background | `#f7f9fe` | `#ffffff` |
| `--md-sys-color-surface-container` | Standard card surface | `#ebeef3` | `#ffffff` |
| `--md-sys-color-surface-container-low` | Sub-card surface | `#f1f4f9` | `#ffffff` |
| `--md-sys-color-surface-container-high`| Header ribbon, table headers | `#e5e8ee` | `#ffffff` |
| `--md-sys-color-on-surface` | Default body and heading text | `#171c20` | `#000000` |
| `--md-sys-color-on-surface-variant` | Muted descriptions, secondary labels | `#41474d` | `#000000` |
| `--md-sys-color-outline` | Form control borders, active outlines | `#71787e` | `#000000` |
| `--md-sys-color-outline-variant` | Card dividers, subtle borders | `#c1c7cf` | `#000000` |

### 2.2 Spacing Scale (4px Base Grid)
Spacing tokens are used in `Stack`, `Grid`, `Box`, and `Card` components:

| Token | CSS Variable | Pixel Equivalent | Typical Usage |
| :--- | :--- | :--- | :--- |
| `0` | `--space-0` | `0px` | Reset |
| `0_5` | `--space-0_5` | `2px` | Micro gaps, badge inner padding |
| `1` | `--space-1` | `4px` | Tight icon-to-text spacing |
| `1_5` | `--space-1_5` | `6px` | Compact tag padding, button gaps |
| `2` | `--space-2` | `8px` | Small gaps between inline items |
| `2_5` | `--space-2_5` | `10px` | Intermediate gap |
| `3` | `--space-3` | `12px` | Standard compact spacing |
| `4` | `--space-4` | `16px` | Standard grid / form gap, card padding (sm) |
| `5` | `--space-5` | `20px` | Section gap, standard card padding (md) |
| `6` | `--space-6` | `24px` | Card padding (lg), modal spacing |
| `8` | `--space-8` | `32px` | Page section separators |
| `10` | `--space-10` | `40px` | Hero sections |
| `12` | `--space-12` | `48px` | View footer margins |
| `16` | `--space-16` | `64px` | Outer page bottom padding |

### 2.3 Typography Scale
Typography respects the dynamic `--app-type-scale` variable for accessibility zoom (100% to 150%).

| Token | Variable | Base Size | Min Line-Height | Default Weight | Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `xs` | `--text-xs` | `12px` (`0.75rem`) | `1.3` | `600` | Footnotes, badge text |
| `sm` | `--text-sm` | `14px` (`0.875rem`) | `1.4` | `500` | Descriptions, captions |
| `base` | `--text-base` | `16px` (`1.0rem`) | `1.5` | `400` | Secondary body text |
| `md` | `--text-md` | `18px` (`1.125rem`) | `1.5` | `500` | Primary senior body base |
| `lg` | `--text-lg` | `20px` (`1.25rem`) | `1.35` | `700` | Heading Level 4 / Subsections |
| `xl` | `--text-xl` | `24px` (`1.5rem`) | `1.3` | `700` | Heading Level 3 / Card Titles |
| `2xl` | `--text-2xl` | `30px` (`1.875rem`) | `1.25` | `800` | Heading Level 2 / Page Subtitles |
| `3xl` | `--text-3xl` | `36px` (`2.25rem`) | `1.2` | `800` | Heading Level 1 / Main Titles |

### 2.4 Elevation & Border Radius
- **Shadows**: `--md-sys-elevation-1` through `--md-sys-elevation-4` (disabled in high-contrast mode for crisp solid outlines).
- **Radii**: `--md-shape-corner-xs` (`4px`), `--md-shape-corner-s` (`8px`), `--md-shape-corner-m` (`12px`), `--md-shape-corner-l` (`16px`), `--md-shape-corner-xl` (`24px`), `--md-shape-corner-full` (`9999px`).

---

## 3. Primitive Components & API Reference

All primitives are exported from `src/components/common`:

### 3.1 `Button` & `IconButton`
Wraps `react-aria-components` `<AriaButton>` with built-in touch target compliance and keyboard navigation.

```tsx
<Button
  variant="filled" // 'filled' | 'filled-tonal' | 'outlined' | 'text' | 'danger'
  size="md"        // 'sm' (40px) | 'md' (48px) | 'lg' (54px)
  leftIcon={<Printer size={18} />}
  onPress={() => printSchedule()}
>
  Print Fridge Schedule
</Button>

<IconButton
  icon={<Settings size={20} />}
  aria-label="Open Settings Panel"
  variant="text"
  size="md"
  onPress={() => openSettings()}
/>
```

### 3.2 `Card` (Compound Component)
Provides consistent surface colors, borders, elevation, and semantic slot structuring. Supports first-class selection states (`selected?: boolean`) for selectable choice cards without layout shifts.

```tsx
// Standard Structured Card
<Card variant="elevated" padding="md" accentBorder="primary">
  <Card.Header>
    <Stack direction="row" justify="between" align="center">
      <Heading level={2} variant="h2">Medication Guide</Heading>
      <Badge label="Active Regimen" color="primary" />
    </Stack>
  </Card.Header>
  <Card.Body>
    <Text size="md">Review daily instructions and precautions.</Text>
  </Card.Body>
  <Card.Footer>
    <Button variant="filled-tonal">Read Aloud</Button>
  </Card.Footer>
</Card>

// Selectable Interactive Choice Card
<Card variant="interactive" padding="md" selected={isSelected} role="radio" aria-checked={isSelected}>
  <Stack direction="column" gap="1">
    <Heading level={4} variant="h4">Option Title</Heading>
    <Text size="xs" color="muted">Option description...</Text>
  </Stack>
  {isSelected && (
    <div className="ds-card-selection-indicator" aria-hidden="true">
      <Check size={18} strokeWidth={3} />
    </div>
  )}
</Card>
```

### 3.3 `TextField` / `Input`
Wraps `react-aria-components` form primitives with label, helper, and error state slots.

```tsx
<TextField
  label="Patient Friendly Name"
  placeholder="e.g. Bortezomib (Velcade)"
  helperText="Common clinical name displayed on patient schedules"
  value={name}
  onChange={setName}
  isRequired
/>
```

### 3.4 `Typography` (`Heading`, `Text`, `Caption`)
Renders token-scaled typography without inline margin or font overrides.

```tsx
<Heading level={1} variant="h1">Cycle 1 of 4</Heading>
<Text size="md" weight="bold" color="primary">Bortezomib Injection</Text>
<Caption>Scheduled on Days 1, 4, 8, 11</Caption>
```

### 3.5 Layout Primitives (`Stack`, `Grid`, `Box`)
Eliminates ad-hoc flexbox and grid wrappers.

```tsx
// Horizontal Flex with spacing
<Stack direction="row" gap="4" align="center" justify="between" wrap>
  <Heading level={3}>Quick Actions</Heading>
  <Button variant="outlined">Cancel</Button>
</Stack>

// Responsive Grid
<Grid columns="repeat(auto-fill, minmax(240px, 1fr))" gap="4">
  {medications.map(med => <MedicationCard key={med.id} med={med} />)}
</Grid>
```

---

## 4. Contract Rules & Anti-Patterns

### ❌ Anti-Pattern: Inline Styles & Raw Elements
```tsx
// BAD - Violates Design System Contract
<div style={{ display: 'flex', gap: '12px', padding: '20px', backgroundColor: '#e3f2fd' }}>
  <button
    type="button"
    onClick={handleClick}
    style={{ minHeight: '40px', padding: '6px 14px', borderRadius: '8px', border: '1px solid #0288d1' }}
  >
    Submit
  </button>
</div>
```

### ✅ Pattern: Pure Composition using Primitives
```tsx
// GOOD - Adheres to Design System Contract
<Box padding="5" backgroundColor="primaryContainer">
  <Stack direction="row" gap="3" align="center">
    <Button variant="filled" size="md" onPress={handleClick}>
      Submit
    </Button>
  </Stack>
</Box>
```
