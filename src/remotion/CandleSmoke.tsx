import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

/**
 * Smoke effect when candle is blown out – rises and dissipates.
 * Plays once, does not loop.
 */
const CandleSmoke: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Puff 1: 0–90% of duration
  const p1Progress = interpolate(
    frame,
    [0, durationInFrames * 0.9],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );
  const p1Y = interpolate(p1Progress, [0, 1], [0, -80]);
  const p1Scale = interpolate(p1Progress, [0, 0.3, 1], [0.5, 1.2, 2]);
  const p1Opacity = interpolate(p1Progress, [0, 0.2, 0.6, 1], [0, 0.5, 0.3, 0]);

  // Puff 2: delayed
  const p2Progress = interpolate(
    frame,
    [8, durationInFrames * 0.85],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );
  const p2Y = interpolate(p2Progress, [0, 1], [0, -70]);
  const p2Scale = interpolate(p2Progress, [0, 0.3, 1], [0.5, 1.1, 1.8]);
  const p2Opacity = interpolate(p2Progress, [0, 0.2, 0.6, 1], [0, 0.45, 0.28, 0]);

  // Puff 3: later
  const p3Progress = interpolate(
    frame,
    [16, durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );
  const p3Y = interpolate(p3Progress, [0, 1], [0, -60]);
  const p3Scale = interpolate(p3Progress, [0, 0.3, 1], [0.5, 1, 1.6]);
  const p3Opacity = interpolate(p3Progress, [0, 0.2, 0.6, 1], [0, 0.4, 0.25, 0]);

  const puffStyle = (y: number, scale: number, opacity: number) => ({
    position: 'absolute' as const,
    left: '50%',
    bottom: 10,
    width: 36,
    height: 36,
    marginLeft: -18,
    borderRadius: '50%',
    background: `radial-gradient(
      ellipse 80% 100% at 50% 100%,
      rgba(90, 85, 80, 0.55) 0%,
      rgba(70, 65, 60, 0.3) 45%,
      rgba(50, 48, 45, 0.1) 75%,
      transparent 100%
    )`,
    filter: 'blur(10px)',
    transform: `translateY(${y}px) scale(${scale})`,
    opacity,
  });

  return (
    <AbsoluteFill
      style={{
        background: 'transparent',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <div style={puffStyle(p1Y, p1Scale, p1Opacity)} />
      <div style={puffStyle(p2Y, p2Scale, p2Opacity)} />
      <div style={puffStyle(p3Y, p3Scale, p3Opacity)} />
    </AbsoluteFill>
  );
};

export default CandleSmoke;
