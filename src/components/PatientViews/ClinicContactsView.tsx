import React, { useState } from 'react';
import {
  PhoneCall,
  Clock,
  ShieldAlert,
  Building2,
  Pill,
  HeartPulse,
  Info,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useRegimen } from '../../context/RegimenContext';
import type { ClinicContact, BadgeColor } from '../../types/regimen';
import {
  Button,
  Card,
  Heading,
  Text,
  Caption,
  Tag,
  Callout,
  Stack,
  Grid,
  DialogModal,
  TextField,
  StickyHeader
} from '../common';

const CATEGORY_OPTIONS: { value: ClinicContact['category']; label: string }[] = [
  { value: 'clinic', label: 'Clinic / Physician' },
  { value: 'urgent', label: 'Urgent Triage (24/7)' },
  { value: 'pharmacy', label: 'Specialty Pharmacy' },
  { value: 'support', label: 'Support / Social Work' }
];

const COLOR_OPTIONS: { value: BadgeColor; label: string }[] = [
  { value: 'primary', label: 'Primary (Blue)' },
  { value: 'secondary', label: 'Secondary (Slate)' },
  { value: 'tertiary', label: 'Tertiary (Purple)' },
  { value: 'warning', label: 'Warning (Amber)' },
  { value: 'error', label: 'Error (Red)' },
  { value: 'success', label: 'Success (Green)' }
];

export const ClinicContactsView: React.FC = () => {
  const { regimen, addContact } = useRegimen();

  // Add Contact Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('Mon – Fri, 8:00 AM – 5:00 PM');
  const [category, setCategory] = useState<ClinicContact['category']>('clinic');
  const [badgeColor, setBadgeColor] = useState<BadgeColor>('primary');
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const contacts = regimen.contacts || [];

  const urgentContact = contacts.find((c) => c.category === 'urgent');
  const emergencyPhone = urgentContact?.phone || regimen.emergencyPhone;

  const handleCall = (phoneNum: string) => {
    window.location.href = `tel:${phoneNum.replace(/[^0-9+]/g, '')}`;
  };

  const handleOpenAddModal = () => {
    setName('');
    setRole('');
    setPhone('');
    setHours('Mon – Fri, 8:00 AM – 5:00 PM');
    setCategory('clinic');
    setBadgeColor('primary');
    setDescription('');
    setFormErrors([]);
    setIsAddModalOpen(true);
  };

  const handleSaveContact = () => {
    const errors: string[] = [];
    if (!name.trim()) errors.push('Contact name is required.');
    if (!role.trim()) errors.push('Role / title is required.');
    if (!phone.trim()) errors.push('Telephone number is required.');
    if (!hours.trim()) errors.push('Hours of operation are required.');

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const newContact: ClinicContact = {
      id: `contact_${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
      hours: hours.trim(),
      category,
      badgeColor,
      description: description.trim() || undefined
    };

    const res = addContact(newContact);
    if (res.isValid) {
      setIsAddModalOpen(false);
    } else {
      setFormErrors(res.errors);
    }
  };

  const getCategoryIcon = (cat?: ClinicContact['category']) => {
    switch (cat) {
      case 'urgent':
        return <HeartPulse size={20} />;
      case 'pharmacy':
        return <Pill size={20} />;
      default:
        return <Building2 size={20} />;
    }
  };

  return (
    <Stack direction="column" gap="4" fullWidth>
      {/* Sticky Header Banner */}
      <StickyHeader top="0" zIndex="10" fullWidth>
        <Card variant="elevated" padding="md">
          <Stack direction="row" justify="between" align="center" wrap gap="3">
            <Stack direction="column" gap="1">
              <Heading level={2} variant="h2">
                Clinic & Nurse Care Team Contacts
              </Heading>
              <Text size="sm" color="muted">
                Direct telephone numbers, hours of operation, and urgent triage lines for your care team.
              </Text>
            </Stack>
            <Button
              variant="filled"
              size="md"
              onPress={handleOpenAddModal}
              aria-label="Add new care team contact"
              leftIcon={<Plus size={18} />}
            >
              Add Contact
            </Button>
          </Stack>
        </Card>
      </StickyHeader>

      {/* 24/7 Triage Notice Callout */}
      {emergencyPhone && (
        <Callout
          variant="error"
          icon={<ShieldAlert size={26} />}
          title="🚨 24/7 Urgent Oncology Symptom Triage Hotline"
        >
          <Stack direction="column" gap="1_5">
            <Text size="sm">
              If you develop a fever of <strong>100.4°F (38°C) or higher</strong>, uncontrolled vomiting, severe chills, or chest tightness, call the 24/7 Oncology Nurse Triage Line immediately:
            </Text>
            <Stack direction="row" align="center" gap="3" wrap>
              <Button
                variant="filled"
                size="lg"
                onPress={() => handleCall(emergencyPhone)}
                leftIcon={<PhoneCall size={20} />}
              >
                Call 24/7 Triage: {emergencyPhone}
              </Button>
              <Text size="xs" color="error" weight="bold">
                Always available • Day, Night & Weekends
              </Text>
            </Stack>
          </Stack>
        </Callout>
      )}

      {/* Contacts Grid or Empty State */}
      {contacts.length === 0 ? (
        <Card variant="outlined" padding="lg">
          <Stack direction="column" align="center" justify="center" gap="2">
            <Info size={32} color="var(--md-sys-color-primary)" />
            <Heading level={3} variant="h3">
              No Care Team Contacts Defined in JSON
            </Heading>
            <Text size="sm" color="muted">
              The active regimen JSON schema does not currently contain any entries in the <code>contacts</code> array.
            </Text>
            <Text size="xs" color="muted">
              Click "Add Contact" above or add contact objects via the Caregiver Admin Portal to populate this directory.
            </Text>
          </Stack>
        </Card>
      ) : (
        <Grid columns="repeat(auto-fill, minmax(320px, 1fr))" gap="4">
          {contacts.map((contact) => {
            const cat = contact.category || 'clinic';
            const bColor = contact.badgeColor || 'primary';

            return (
              <Card
                key={contact.id}
                variant="elevated"
                padding="md"
                accentBorder={bColor}
              >
                <Stack direction="column" gap="3">
                  {/* Contact Card Header: Tag placed above title on upper left */}
                  <Stack direction="column" gap="1_5" className="contact-card-header">
                    <Tag
                      label={cat.toUpperCase()}
                      color={bColor}
                      size="sm"
                    />
                    <Stack direction="row" align="center" gap="2">
                      {getCategoryIcon(cat)}
                      <Heading level={3} variant="h3">
                        {contact.name}
                      </Heading>
                    </Stack>
                    <Text size="sm" weight="semibold" color="muted">
                      {contact.role}
                    </Text>
                  </Stack>

                  {/* Contact Body */}
                  <Stack direction="column" gap="2">
                    <Stack direction="row" align="center" gap="2">
                      <Clock size={16} color="var(--md-sys-color-on-surface-variant)" />
                      <Caption>
                        {contact.hours}
                      </Caption>
                    </Stack>

                    {contact.description && (
                      <Text size="xs" color="muted">
                        {contact.description}
                      </Text>
                    )}
                  </Stack>

                  {/* Contact Action Footer */}
                  <Stack direction="row" justify="start" align="center" wrap gap="2">
                    <Button
                      variant="filled"
                      size="md"
                      onPress={() => handleCall(contact.phone)}
                      leftIcon={<PhoneCall size={18} />}
                      aria-label={`Call ${contact.name} at ${contact.phone}`}
                    >
                      {contact.phone}
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </Grid>
      )}

      {/* Add Care Team Contact Accessible Dialog Modal */}
      <DialogModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Add Care Team Contact"
        subtitle="Add a clinical provider, triage line, pharmacy, or support service to your directory."
        size="normal"
        footer={
          <Stack direction="row" justify="end" align="center" gap="3" fullWidth>
            <Button
              variant="outlined"
              size="md"
              onPress={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              size="md"
              onPress={handleSaveContact}
              leftIcon={<Plus size={18} />}
            >
              Add Contact
            </Button>
          </Stack>
        }
      >
        <Stack direction="column" gap="4" fullWidth>
          {formErrors.length > 0 && (
            <Callout variant="error" icon={<AlertCircle size={20} />} title="Please check the form:">
              <Stack direction="column" gap="1">
                {formErrors.map((err, i) => (
                  <Text key={i} size="sm" color="error">
                    • {err}
                  </Text>
                ))}
              </Stack>
            </Callout>
          )}

          <TextField
            label="Contact / Provider Name"
            placeholder="e.g. Dr. Sarah Jenkins, MD"
            value={name}
            onChange={setName}
            isRequired
          />

          <TextField
            label="Role or Title"
            placeholder="e.g. Attending Medical Oncologist"
            value={role}
            onChange={setRole}
            isRequired
          />

          <Grid columns="repeat(auto-fit, minmax(200px, 1fr))" gap="3">
            <TextField
              label="Telephone Number"
              placeholder="e.g. (555) 234-5678"
              value={phone}
              onChange={setPhone}
              isRequired
            />
            <TextField
              label="Hours of Operation"
              placeholder="e.g. Mon – Fri, 8:00 AM – 5:00 PM"
              value={hours}
              onChange={setHours}
              isRequired
            />
          </Grid>

          {/* Category Choice Buttons */}
          <Stack direction="column" gap="1_5">
            <Text size="sm" weight="bold">
              Contact Category:
            </Text>
            <Stack direction="row" gap="2" wrap align="center">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = category === cat.value;
                return (
                  <Button
                    key={cat.value}
                    variant={isSelected ? 'filled' : 'outlined'}
                    size="sm"
                    onPress={() => setCategory(cat.value)}
                    aria-label={`Select ${cat.label} category`}
                  >
                    {cat.label}
                  </Button>
                );
              })}
            </Stack>
          </Stack>

          {/* Badge Color Selection */}
          <Stack direction="column" gap="1_5">
            <Text size="sm" weight="bold">
              Card Accent Badge Color:
            </Text>
            <Stack direction="row" gap="2" wrap align="center">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = badgeColor === c.value;
                return (
                  <Button
                    key={c.value}
                    variant={isSelected ? 'filled' : 'outlined'}
                    size="sm"
                    onPress={() => setBadgeColor(c.value)}
                    aria-label={`Select ${c.label} color`}
                  >
                    {c.label}
                  </Button>
                );
              })}
            </Stack>
          </Stack>

          <TextField
            label="Description & Instructions (Optional)"
            placeholder="e.g. Call for routine appointment scheduling and lab monitoring."
            value={description}
            onChange={setDescription}
            multiline
            rows={2}
          />
        </Stack>
      </DialogModal>
    </Stack>
  );
};
