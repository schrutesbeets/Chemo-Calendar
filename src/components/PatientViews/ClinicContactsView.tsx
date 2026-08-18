
import React from 'react';
import {
  PhoneCall,
  Clock,
  ShieldAlert,
  Building2,
  Pill,
  HeartPulse,
  Info
} from 'lucide-react';
import { useRegimen } from '../../context/RegimenContext';
import type { ClinicContact } from '../../types/regimen';
import {
  Button,
  Card,
  Heading,
  Text,
  Caption,
  Badge,
  Callout,
  Stack,
  Grid
} from '../common';

export const ClinicContactsView: React.FC = () => {
  const { regimen } = useRegimen();

  const contacts = regimen.contacts || [];

  const urgentContact = contacts.find((c) => c.category === 'urgent');
  const emergencyPhone = urgentContact?.phone || regimen.emergencyPhone;

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  const getCategoryIcon = (category?: ClinicContact['category']) => {
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
        </Stack>
      </Card>

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
              Add contact objects into the <code>"contacts"</code> field via the Caregiver Admin Portal (Raw JSON tab) to populate this directory.
            </Text>
          </Stack>
        </Card>
      ) : (
        <Grid columns="repeat(auto-fill, minmax(320px, 1fr))" gap="4">
          {contacts.map((contact) => {
            const category = contact.category || 'clinic';
            const badgeColor = contact.badgeColor || 'primary';

            return (
              <Card
                key={contact.id}
                variant="elevated"
                padding="md"
                accentBorder={badgeColor}
              >
                <Stack direction="column" gap="3">
                  {/* Contact Card Header */}
                  <Stack direction="column" gap="1" className="contact-card-header">
                    <Stack direction="row" justify="between" align="start" wrap gap="2">
                      <Stack direction="row" align="center" gap="2">
                        {getCategoryIcon(category)}
                        <Heading level={3} variant="h3">
                          {contact.name}
                        </Heading>
                      </Stack>
                      <Badge
                        label={category.toUpperCase()}
                        color={badgeColor}
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
    </Stack>
  );
};
