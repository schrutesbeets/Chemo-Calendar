import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { DialogModal, Button, Stack } from '../common';
import { DesignSystemView } from './DesignSystemView';

export const DesignSystemModal: React.FC = () => {
  const { isDesignSystemOpen, setIsDesignSystemOpen } = useSettings();

  return (
    <DialogModal
      isOpen={isDesignSystemOpen}
      onOpenChange={setIsDesignSystemOpen}
      title="Design System & Component Library"
      subtitle="Material Design 3 tokens, accessible senior-friendly components, and clinical UI guidelines."
      size="wide"
      footer={
        <Stack direction="row" justify="end" fullWidth>
          <Button
            variant="filled"
            size="md"
            onPress={() => setIsDesignSystemOpen(false)}
          >
            Close Design System
          </Button>
        </Stack>
      }
    >
      <DesignSystemView />
    </DialogModal>
  );
};
