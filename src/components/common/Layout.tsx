import React from 'react';
import type { SpacingToken, ColorTokenKey } from '../../styles/tokens';
import { getSpacingVar, COLOR_TOKENS } from '../../styles/tokens';
import clsx from 'clsx';

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  direction?: 'row' | 'column';
  gap?: SpacingToken;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

const alignMap: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline'
};

const justifyMap: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly'
};

export const Stack: React.FC<StackProps> = ({
  as: Component = 'div',
  direction = 'column',
  gap = '4',
  align,
  justify,
  wrap = false,
  fullWidth = false,
  className,
  children,
  style,
  ...props
}) => {
  const dynamicStyle: React.CSSProperties = { ...style };
  if (gap) dynamicStyle.gap = getSpacingVar(gap);
  if (align) dynamicStyle.alignItems = alignMap[align];
  if (justify) dynamicStyle.justifyContent = justifyMap[justify];

  return (
    <Component
      {...props}
      style={dynamicStyle}
      className={clsx(
        'ds-stack',
        direction === 'row' ? 'ds-stack-row' : 'ds-stack-col',
        {
          'ds-stack-wrap': wrap,
          'ds-stack-full': fullWidth
        },
        className
      )}
    >
      {children}
    </Component>
  );
};

export interface GridProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  columns?: number | string;
  gap?: SpacingToken;
  rowGap?: SpacingToken;
  columnGap?: SpacingToken;
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({
  as: Component = 'div',
  columns = 1,
  gap = '4',
  rowGap,
  columnGap,
  align,
  className,
  children,
  style,
  ...props
}) => {
  const gridTemplateColumns =
    typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns;

  const dynamicStyle: React.CSSProperties = {
    gridTemplateColumns,
    ...style
  };
  if (gap) dynamicStyle.gap = getSpacingVar(gap);
  if (rowGap) dynamicStyle.rowGap = getSpacingVar(rowGap);
  if (columnGap) dynamicStyle.columnGap = getSpacingVar(columnGap);
  if (align) dynamicStyle.alignItems = alignMap[align];

  return (
    <Component
      {...props}
      style={dynamicStyle}
      className={clsx('ds-grid', className)}
    >
      {children}
    </Component>
  );
};

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  padding?: SpacingToken;
  paddingX?: SpacingToken;
  paddingY?: SpacingToken;
  margin?: SpacingToken | 'auto';
  marginX?: SpacingToken | 'auto';
  marginY?: SpacingToken | 'auto';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
  backgroundColor?: ColorTokenKey;
  borderRadius?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'full';
  borderColor?: ColorTokenKey;
  position?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  zIndex?: number | string;
  width?: string;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

const maxWidthMap: Record<string, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  full: '100%'
};

export const Box: React.FC<BoxProps> = ({
  as: Component = 'div',
  padding,
  paddingX,
  paddingY,
  margin,
  marginX,
  marginY,
  maxWidth,
  backgroundColor,
  borderRadius,
  borderColor,
  position,
  top,
  bottom,
  left,
  right,
  zIndex,
  width,
  fullWidth,
  className,
  children,
  style,
  ...props
}) => {
  const dynamicStyle: React.CSSProperties = { ...style };

  if (padding) {
    dynamicStyle.padding = getSpacingVar(padding);
  }
  if (paddingX) {
    dynamicStyle.paddingLeft = getSpacingVar(paddingX);
    dynamicStyle.paddingRight = getSpacingVar(paddingX);
  }
  if (paddingY) {
    dynamicStyle.paddingTop = getSpacingVar(paddingY);
    dynamicStyle.paddingBottom = getSpacingVar(paddingY);
  }

  if (margin) {
    dynamicStyle.margin = margin === 'auto' ? 'auto' : getSpacingVar(margin);
  }
  if (marginX) {
    const val = marginX === 'auto' ? 'auto' : getSpacingVar(marginX);
    dynamicStyle.marginLeft = val;
    dynamicStyle.marginRight = val;
  }
  if (marginY) {
    const val = marginY === 'auto' ? 'auto' : getSpacingVar(marginY);
    dynamicStyle.marginTop = val;
    dynamicStyle.marginBottom = val;
  }

  if (maxWidth) {
    dynamicStyle.maxWidth = maxWidthMap[maxWidth] || maxWidth;
  }
  if (backgroundColor) {
    dynamicStyle.backgroundColor = COLOR_TOKENS[backgroundColor];
  }
  if (borderRadius) {
    dynamicStyle.borderRadius = `var(--md-shape-corner-${borderRadius})`;
  }
  if (borderColor) {
    dynamicStyle.borderColor = COLOR_TOKENS[borderColor];
    dynamicStyle.borderWidth = 'var(--app-border-width)';
    dynamicStyle.borderStyle = 'solid';
  }

  if (position) {
    dynamicStyle.position = position;
  }
  if (top !== undefined) {
    dynamicStyle.top = typeof top === 'number' ? `${top}px` : top;
  }
  if (bottom !== undefined) {
    dynamicStyle.bottom = typeof bottom === 'number' ? `${bottom}px` : bottom;
  }
  if (left !== undefined) {
    dynamicStyle.left = typeof left === 'number' ? `${left}px` : left;
  }
  if (right !== undefined) {
    dynamicStyle.right = typeof right === 'number' ? `${right}px` : right;
  }
  if (zIndex !== undefined) {
    dynamicStyle.zIndex = zIndex;
  }
  if (width) {
    dynamicStyle.width = width;
  }
  if (fullWidth) {
    dynamicStyle.width = '100%';
  }

  return (
    <Component
      {...props}
      style={dynamicStyle}
      className={clsx('ds-box', className)}
    >
      {children}
    </Component>
  );
};
