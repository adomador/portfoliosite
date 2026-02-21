import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

/**
 * Flickering radial candle light – plays behind the work (candle) button.
 * Abrupt, wind-blown flicker. Soft feathered edge (no bands).
 */
export const CandleGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // High-frequency phases for abrupt flicker (integers = seamless loop)
  const t = interpolate(frame, [0, durationInFrames], [0, Math.PI * 2], {
    extrapolateRight: 'loop',
    easing: Easing.linear,
  });
  const f1 = 7;
  const f2 = 11;
  const f3 = 17;
  const f4 = 13;

  // Quasi-random abrupt flicker: sum of incommensurate frequencies, clamped so it never goes dark
  const raw = Math.sin(t * f1) * 0.22 + Math.sin(t * f2) * 0.15 + Math.sin(t * f3) * 0.1 + Math.sin(t * f4) * 0.08;
  const flickerOpacity = Math.max(0.55, 0.75 + raw);
  const flickerScale = 1 + (Math.sin(t * f2) * 0.05 + Math.sin(t * f4) * 0.03);

  const op = flickerOpacity;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(
          ellipse 50% 50% at 50% 50%,
          rgba(255, 200, 120, ${0.2 * op}) 0%,
          rgba(200, 140, 70, ${0.09 * op}) 35%,
          rgba(120, 80, 40, ${0.025 * op}) 60%,
          transparent 85%
        )`,
        transform: `scale(${flickerScale})`,
        pointerEvents: 'none',
      }}
    />
  );
};
