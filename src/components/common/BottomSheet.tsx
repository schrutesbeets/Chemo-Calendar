import React from 'react';
import { Modal, Dialog, Heading } from 'react-aria-components';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { IconButton } from './IconButton';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  isDismissable?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  className,
  isDismissable = true
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      isDismissable={isDismissable}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget && isDismissable) {
          onClose();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && isDismissable) {
          onClose();
        }
      }}
      className="bottom-sheet-backdrop"
    >
      <Dialog
        aria-label={title}
        className={clsx('bottom-sheet-container', className)}
      >
        {() => (
          <>
            {/* Accessible Drag-Handle Indicator */}
            <div className="bottom-sheet-handle" aria-hidden="true" />

            {/* Bottom Sheet Header */}
            <div className="bottom-sheet-header">
              <div className="bottom-sheet-header-text">
                <Heading slot="title" className="bottom-sheet-title">
                  {title}
                </Heading>
                {subtitle && (
                  <p className="bottom-sheet-subtitle">
                    {subtitle}
                  </p>
                )}
              </div>
              <IconButton
                icon={<X size={22} />}
                aria-label="Close sheet"
                variant="text"
                size="md"
                onPress={onClose}
                className="bottom-sheet-close-btn"
              />
            </div>

            {/* Scrollable Body */}
            <div className="bottom-sheet-body">
              {children}
            </div>

            {/* Bottom Sheet Footer */}
            {footer && (
              <div className="bottom-sheet-footer">
                {footer}
              </div>
            )}
          </>
        )}
      </Dialog>
    </Modal>
  );
};
