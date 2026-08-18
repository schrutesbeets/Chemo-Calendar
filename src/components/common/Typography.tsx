import React from 'react';
import type {
  HeadingLevel,
  HeadingVariant,
  TypographySize,
  FontWeight,
  TextColor
} from '../../styles/tokens';
import clsx from 'clsx';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  variant?: HeadingVariant;
  color?: TextColor;
  align?: 'left' | 'center' | 'right';
  className?: string;
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  variant,
  color = 'default',
  align = 'left',
  className,
  children,
  ...props
}) => {
  const visualVariant = variant || (`h${level}` as HeadingVariant);
  const Component = `h${level}` as React.ElementType;

  return (
    <Component
      {...props}
      className={clsx(
        'ds-heading',
        `ds-${visualVariant}`,
        `ds-text-color-${color}`,
        {
          'text-center': align === 'center',
          'text-right': align === 'right'
        },
        className
      )}
    >
      {children}
    </Component>
  );
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'label' | 'strong' | 'em';
  size?: TypographySize;
  weight?: FontWeight;
  color?: TextColor;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  size = 'base',
  weight = 'regular',
  color = 'default',
  italic = false,
  align = 'left',
  className,
  children,
  ...props
}) => {
  return (
    <Component
      {...props}
      className={clsx(
        'ds-text',
        `ds-text-size-${size}`,
        `ds-font-${weight}`,
        `ds-text-color-${color}`,
        {
          'italic': italic,
          'text-center': align === 'center',
          'text-right': align === 'right'
        },
        className
      )}
    >
      {children}
    </Component>
  );
};

export interface CaptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children: React.ReactNode;
}

export const Caption: React.FC<CaptionProps> = ({ className, children, ...props }) => (
  <p className={clsx('ds-caption', className)} {...props}>
    {children}
  </p>
);

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children: React.ReactNode;
}

export const Code: React.FC<CodeProps> = ({ className, children, ...props }) => (
  <code className={clsx('ds-code', className)} {...props}>
    {children}
  </code>
);

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'label' | 'caption';
  level?: HeadingLevel;
  size?: TypographySize;
  weight?: FontWeight;
  color?: TextColor;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  level,
  size,
  weight = 'regular',
  color = 'default',
  italic = false,
  align = 'left',
  className,
  children,
  ...props
}) => {
  if (variant === 'h1' || variant === 'h2' || variant === 'h3' || variant === 'h4') {
    const lvl = level || (parseInt(variant.replace('h', ''), 10) as HeadingLevel);
    return (
      <Heading level={lvl} variant={variant} color={color} align={align} className={className} {...props}>
        {children}
      </Heading>
    );
  }
  if (variant === 'caption') {
    return (
      <Caption className={className} {...props}>
        {children}
      </Caption>
    );
  }
  if (variant === 'label') {
    return (
      <Text
        as="span"
        size={size || 'sm'}
        weight={weight}
        color={color}
        italic={italic}
        align={align}
        className={className}
        {...props}
      >
        {children}
      </Text>
    );
  }
  return (
    <Text
      size={size || 'base'}
      weight={weight}
      color={color}
      italic={italic}
      align={align}
      className={className}
      {...props}
    >
      {children}
    </Text>
  );
};

