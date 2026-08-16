import React from 'react';
import {
  Slider as AriaSlider,
  SliderTrack,
  SliderThumb,
  SliderOutput,
  Label
} from 'react-aria-components';
import type { SliderProps as AriaSliderProps } from 'react-aria-components';

interface AccessibleSliderProps extends AriaSliderProps<number> {
  label: string;
  formatValue?: (value: number) => string;
  helperText?: string;
}

export const AccessibleSlider: React.FC<AccessibleSliderProps> = ({
  label,
  formatValue = (val) => `${Math.round(val * 100)}%`,
  helperText,
  ...props
}) => {
  return (
    <AriaSlider {...props} className="react-aria-Slider">
      <div className="slider-header">
        <Label className="slider-label">{label}</Label>
        <SliderOutput className="slider-output">
          {({ state }) => formatValue(state.values[0])}
        </SliderOutput>
      </div>

      <SliderTrack className="slider-track">
        {({ state }) => {
          const percent = Math.min(100, Math.max(0, state.getThumbPercent(0) * 100));
          return (
            <>
              <div className="slider-fill" style={{ width: `${percent}%` }} />
              <SliderThumb className="slider-thumb" aria-label={label} />
            </>
          );
        }}
      </SliderTrack>

      {helperText && (
        <span className="slider-helper-text">
          {helperText}
        </span>
      )}
    </AriaSlider>
  );
};
