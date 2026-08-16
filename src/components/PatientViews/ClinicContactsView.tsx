import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Clock,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  ShieldAlert,
  Building2,
  Pill,
  HeartPulse
} from 'lucide-react';
import {
  Button,
  Card,
  Heading,
  Text,
  Caption,
  Badge,
  Callout,
  TextField,
  Stack,
  Grid,
  DialogModal
} from '../common';

export interface ClinicContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  hours: string;
  category: 'urgent' | 'clinic' | 'pharmacy' | 'support';
  description?: string;
  badgeColor?: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'error' | 'success';
}

export const DEFAULT_CONTACTS: ClinicContact[] = [
  {
    id: 'contact_urgent_triage',
    name: '24/7 Oncology Nurse Triage Line',
    role: 'Urgent Care & After-Hours Symptom Management',
    phone: '(555) 911-0000',
    hours: '24 Hours / 7 Days a week',
    category: 'urgent',
    description: 'Call immediately for fever ≥ 100.4°F (38°C), severe chills, uncontrollable nausea, or new shortness of breath.',
    badgeColor: 'error'
  },
  {
    id: 'contact_primary_oncologist',
    name: 'Dr. Sarah Jenkins, MD',
    role: 'Attending Medical Oncologist',
    phone: '(555) 234-5678',
    hours: 'Mon – Fri, 8:00 AM – 5:00 PM',
    category: 'clinic',
    description: 'Lead physician overseeing multiple myeloma regimen MUM46, laboratory monitoring, and treatment changes.',
    badgeColor: 'primary'
  },
  {
    id: 'contact_nurse_coordinator',
    name: 'Rachel Adams, BSN, RN, OCN',
    role: 'Chemotherapy Nurse Navigator',
    phone: '(555) 234-5679',
    hours: 'Mon – Fri, 8:00 AM – 4:30 PM',
    category: 'clinic',
    description: 'Direct contact for treatment appointments, Bortezomib injection coordination, and side effect coaching.',
    badgeColor: 'primary'
  },
  {
    id: 'contact_infusion_center',
    name: 'Hope Pavilion Infusion Suite',
    role: 'Chemotherapy & Injection Treatment Clinic',
    phone: '(555) 234-5680',
    hours: 'Mon – Sat, 7:30 AM – 6:00 PM',
    category: 'clinic',
    description: 'Suite 300, 3rd Floor. Check-in desk for subcutaneous Bortezomib injections, blood draws, and hydration therapy.',
    badgeColor: 'secondary'
  },
  {
    id: 'contact_specialty_pharmacy',
    name: 'Oncology Specialty Pharmacy Desk',
    role: 'Oral Chemotherapy & Supportive Rx Fulfillment',
    phone: '(555) 789-0123',
    hours: 'Mon – Fri, 8:30 AM – 6:00 PM',
    category: 'pharmacy',
    description: 'Refill coordination for oral Cyclophosphamide, Dexamethasone, anti-nausea medications, and copay programs.',
    badgeColor: 'tertiary'
  },
  {
    id: 'contact_social_work',
    name: 'Patient & Family Supportive Services',
    role: 'Oncology Social Work & Ride Assistance',
    phone: '(555) 345-6789',
    hours: 'Mon – Fri, 9:00 AM – 4:00 PM',
    category: 'support',
    description: 'Assistance with transportation rides, emotional support resources, and home health nurse scheduling.',
    badgeColor: 'secondary'
  }
];

const STORAGE_KEY = 'm3_clinic_contacts';

export const ClinicContactsView: React.FC = () => {
  const [contacts, setContacts] = useState<ClinicContact[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage parsing errors
    }
    return DEFAULT_CONTACTS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formHours, setFormHours] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBadgeColor, setFormBadgeColor] = useState<ClinicContact['badgeColor']>('primary');

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch {
      // ignore storage error
    }
  }, [contacts]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormName('');
    setFormRole('');
    setFormPhone('');
    setFormHours('Mon – Fri, 8:00 AM – 5:00 PM');
    setFormDescription('');
    setFormBadgeColor('primary');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact: ClinicContact) => {
    setEditingId(contact.id);
    setFormName(contact.name);
    setFormRole(contact.role);
    setFormPhone(contact.phone);
    setFormHours(contact.hours);
    setFormDescription(contact.description || '');
    setFormBadgeColor(contact.badgeColor || 'primary');
    setIsModalOpen(true);
  };

  const handleSaveContact = () => {
    if (!formName.trim() || !formPhone.trim()) {
      alert('Please provide both contact name and phone number.');
      return;
    }

    if (editingId) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: formName.trim(),
                role: formRole.trim(),
                phone: formPhone.trim(),
                hours: formHours.trim(),
                description: formDescription.trim(),
                badgeColor: formBadgeColor
              }
            : c
        )
      );
    } else {
      const newContact: ClinicContact = {
        id: `contact_${Date.now()}`,
        name: formName.trim(),
        role: formRole.trim() || 'Care Team Member',
        phone: formPhone.trim(),
        hours: formHours.trim() || 'Standard Hours',
        category: 'clinic',
        description: formDescription.trim(),
        badgeColor: formBadgeColor
      };
      setContacts((prev) => [...prev, newContact]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('Are you sure you want to remove this clinic contact?')) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset contact directory to default clinic and triage numbers?')) {
      setContacts(DEFAULT_CONTACTS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTACTS));
      } catch {
        // ignore
      }
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  const getCategoryIcon = (category: ClinicContact['category']) => {
    switch (category) {
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
      {/* Header Banner */}
      <Card variant="elevated" padding="md">
        <Stack direction="row" justify="between" align="center" wrap gap="3">
          <Stack direction="column" gap="1">
            <Badge label="Clinical Directory" color="primary" />
            <Heading level={2} variant="h2">
              Clinic & Nurse Care Team Contacts
            </Heading>
            <Text size="sm" color="muted">
              Direct telephone numbers, hours of operation, and urgent triage lines for your care team.
            </Text>
          </Stack>

          <Stack direction="row" gap="2" align="center" wrap>
            <Button
              variant="outlined"
              size="md"
              onPress={handleResetDefaults}
              leftIcon={<RotateCcw size={16} />}
            >
              Reset Defaults
            </Button>
            <Button
              variant="filled"
              size="md"
              onPress={handleOpenAdd}
              leftIcon={<Plus size={18} />}
            >
              Add Contact
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* 24/7 Triage Notice Callout */}
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
              onPress={() => handleCall('(555) 911-0000')}
              leftIcon={<PhoneCall size={20} />}
            >
              Call 24/7 Triage: (555) 911-0000
            </Button>
            <Text size="xs" color="error" weight="bold">
              Always available • Day, Night & Weekends
            </Text>
          </Stack>
        </Stack>
      </Callout>

      {/* Contacts Grid */}
      <Grid columns="repeat(auto-fill, minmax(320px, 1fr))" gap="4">
        {contacts.map((contact) => {
          return (
            <Card
              key={contact.id}
              variant="elevated"
              padding="md"
              accentBorder={contact.badgeColor || 'primary'}
            >
              <Stack direction="column" gap="3">
                {/* Contact Card Header */}
                <Stack direction="column" gap="1" className="contact-card-header">
                  <Stack direction="row" justify="between" align="start" wrap gap="2">
                    <Stack direction="row" align="center" gap="2">
                      {getCategoryIcon(contact.category)}
                      <Heading level={3} variant="h3">
                        {contact.name}
                      </Heading>
                    </Stack>
                    <Badge
                      label={contact.category.toUpperCase()}
                      color={contact.badgeColor || 'primary'}
                    />
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
                <Stack direction="row" justify="between" align="center" wrap gap="2">
                  <Button
                    variant="filled"
                    size="md"
                    onPress={() => handleCall(contact.phone)}
                    leftIcon={<PhoneCall size={18} />}
                    aria-label={`Call ${contact.name} at ${contact.phone}`}
                  >
                    {contact.phone}
                  </Button>

                  <Stack direction="row" gap="1" align="center">
                    <Button
                      variant="text"
                      size="sm"
                      onPress={() => handleOpenEdit(contact)}
                      aria-label={`Edit ${contact.name}`}
                      leftIcon={<Edit3 size={16} />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="text"
                      size="sm"
                      onPress={() => handleDeleteContact(contact.id)}
                      aria-label={`Delete ${contact.name}`}
                      leftIcon={<Trash2 size={16} color="var(--md-sys-color-error)" />}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          );
        })}
      </Grid>

      {/* Add / Edit Contact Modal */}
      <DialogModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingId ? 'Edit Care Team Contact' : 'Add New Care Team Contact'}
        subtitle="Manage phone numbers and hours for patient and caregiver quick dialing."
        footer={
          <Stack direction="row" justify="end" align="center" gap="3" fullWidth>
            <Button
              variant="outlined"
              size="md"
              onPress={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              size="md"
              onPress={handleSaveContact}
            >
              Save Contact
            </Button>
          </Stack>
        }
      >
        <Stack direction="column" gap="3">
          <TextField
            label="Contact Name / Facility"
            placeholder="e.g. Dr. Sarah Jenkins, MD"
            value={formName}
            onChange={setFormName}
            isRequired
          />

          <TextField
            label="Professional Role / Description"
            placeholder="e.g. Attending Medical Oncologist"
            value={formRole}
            onChange={setFormRole}
          />

          <TextField
            label="Phone Number"
            placeholder="e.g. (555) 234-5678"
            value={formPhone}
            onChange={setFormPhone}
            isRequired
          />

          <TextField
            label="Hours of Operation"
            placeholder="e.g. Mon – Fri, 8:00 AM – 5:00 PM"
            value={formHours}
            onChange={setFormHours}
          />

          <TextField
            label="Notes / Clinical Instructions"
            placeholder="e.g. Call for prescription renewals and lab appointment scheduling"
            value={formDescription}
            onChange={setFormDescription}
          />
        </Stack>
      </DialogModal>
    </Stack>
  );
};
