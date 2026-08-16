import React from 'react';
import { Modal, Dialog, Heading } from 'react-aria-components';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { IconButton } from './IconButton';

export interface DialogModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'normal' | 'wide' | 'fullscreen';
  isDismissable?: boolean;
}

export const DialogModal: React.FC<DialogModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  subtitle,
  children,
  footer,
  size = 'normal',
  isDismissable = true
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      className="dialog-backdrop"
    >
      <Dialog
        aria-label={title}
        className={clsx('dialog-modal', {
          'dialog-modal-wide': size === 'wide' || size === 'fullscreen'
        })}
      >
        {({ close }) => (
          <>
            <div className="dialog-header">
              <div className="dialog-header-text">
                <Heading slot="title" className="h2 dialog-title">
                  {title}
                </Heading>
                {subtitle && (
                  <p className="text-sm dialog-subtitle">
                    {subtitle}
                  </p>
                )}
              </div>
              <IconButton
                icon={<X size={24} />}
                aria-label="Close dialog"
                variant="text"
                size="md"
                onPress={close}
                className="dialog-close-btn"
              />
            </div>

            <div className="dialog-body">{children}</div>

            {footer && <div className="dialog-footer">{footer}</div>}
          </>
        )}
      </Dialog>
    </Modal>
  );
};
