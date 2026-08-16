import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { useSettings } from '../../context/SettingsContext';
import {
  Button,
  DialogModal,
  Stack,
  Callout,
  Text
} from '../common';

export const PinAuthModal: React.FC = () => {
  const { isPinAuthModalOpen, setIsPinAuthModalOpen, verifyAndOpenAdmin } = useSettings();
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = verifyAndOpenAdmin(pinInput);
    if (!success) {
      setError(true);
      setPinInput('');
    } else {
      setError(false);
      setPinInput('');
    }
  };

  const handleDigitClick = (digit: string) => {
    if (pinInput.length < 6) {
      setPinInput((prev) => prev + digit);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <DialogModal
      isOpen={isPinAuthModalOpen}
      onOpenChange={setIsPinAuthModalOpen}
      title="Caregiver Authentication"
      subtitle="Enter your 4-digit caregiver PIN to access regimen management."
      footer={
        <Stack direction="row" justify="between" align="center" fullWidth>
          <Button
            variant="outlined"
            size="md"
            onPress={() => {
              setIsPinAuthModalOpen(false);
              setPinInput('');
              setError(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            size="md"
            onPress={() => handleVerify()}
            isDisabled={pinInput.length < 4}
            leftIcon={<KeyRound size={18} />}
          >
            Unlock Portal
          </Button>
        </Stack>
      }
    >
      <Stack direction="column" align="center" gap="5" fullWidth>
        <div className="pin-auth-avatar">
          <Lock size={32} />
        </div>

        {/* PIN Display circles */}
        <div className="pin-dots-row">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pinInput.length > idx;
            return (
              <div
                key={idx}
                className={clsx('pin-dot', {
                  'pin-dot-filled': isFilled
                })}
              />
            );
          })}
        </div>

        {error && (
          <Callout variant="error" icon={<AlertCircle size={18} />}>
            <Text size="sm" weight="bold">
              Incorrect PIN. (Default demo PIN is 1234)
            </Text>
          </Callout>
        )}

        {/* Accessible Numeric Keypad */}
        <div className="pin-keypad-grid">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((item) => (
            <Button
              key={item}
              variant="outlined"
              size="lg"
              onPress={() => {
                if (item === 'C') {
                  setPinInput('');
                  setError(false);
                } else if (item === '⌫') {
                  handleBackspace();
                } else {
                  handleDigitClick(item);
                }
              }}
              aria-label={item === 'C' ? 'Clear PIN' : item === '⌫' ? 'Backspace' : `Digit ${item}`}
              className="pin-keypad-btn"
            >
              {item}
            </Button>
          ))}
        </div>
      </Stack>
    </DialogModal>
  );
};
