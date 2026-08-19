import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export interface StickyHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  top?: string | number;
  zIndex?: number | string;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  top = '0',
  zIndex = 10,
  fullWidth = true,
  className,
  children,
  style,
  ...props
}) => {
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const checkStuck = () => {
      const rect = sentinel.getBoundingClientRect();
      const topThreshold = typeof top === 'number' ? top : parseFloat(top) || 0;
      setIsStuck(rect.top < topThreshold);
    };

    const observer = new IntersectionObserver(
      () => {
        checkStuck();
      },
      {
        threshold: [0, 1],
        rootMargin: '0px 0px 0px 0px'
      }
    );

    observer.observe(sentinel);
    window.addEventListener('scroll', checkStuck, { passive: true });
    window.addEventListener('resize', checkStuck, { passive: true });

    // Initial check
    checkStuck();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkStuck);
      window.removeEventListener('resize', checkStuck);
    };
  }, [top]);

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const updateHeight = () => {
      const height = headerEl.offsetHeight;
      document.documentElement.style.setProperty('--main-sticky-header-height', `${height}px`);
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(headerEl);
    updateHeight();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const dynamicStyle: React.CSSProperties = {
    position: 'sticky',
    top: typeof top === 'number' ? `${top}px` : top,
    zIndex,
    width: fullWidth ? '100%' : undefined,
    ...style
  };

  return (
    <>
      <div
        ref={sentinelRef}
        className="ds-sticky-sentinel"
        aria-hidden="true"
      />
      <div
        {...props}
        ref={headerRef}
        data-stuck={isStuck ? 'true' : undefined}
        className={clsx(
          'ds-sticky-header',
          {
            'is-stuck': isStuck,
            'ds-sticky-header--full': fullWidth
          },
          className
        )}
        style={dynamicStyle}
      >
        {children}
      </div>
    </>
  );
};
