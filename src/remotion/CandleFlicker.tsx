import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

export const CandleFlicker: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Seamless loop: only the flame moves (wind-blown flicker)
  const phase1 = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 2],
    { extrapolateRight: 'loop', easing: Easing.linear }
  );
  const phase2 = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 2 * 1.3],
    { extrapolateRight: 'loop', easing: Easing.linear }
  );
  const phase3 = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 2 * 0.7],
    { extrapolateRight: 'loop', easing: Easing.linear }
  );
  const phase4 = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 2 * 1.7],
    { extrapolateRight: 'loop', easing: Easing.linear }
  );

  // Flame only: wind-blown flicker — tilt, sway, stretch/squash, brightness
  const flameTilt = Math.sin(phase1) * 8 + Math.sin(phase2 * 0.7) * 4;
  const flameSwayX = Math.sin(phase2) * 3.5 + Math.cos(phase3) * 2;
  const flameSwayY = Math.cos(phase1) * 2.5 + Math.sin(phase3 * 0.8) * 1.5;
  const flameScaleX = 1 + Math.sin(phase1 * 1.2) * 0.12 + Math.cos(phase4) * 0.06;
  const flameScaleY = 1 + Math.cos(phase2) * 0.15 + Math.sin(phase4 * 0.9) * 0.08;
  const flameOpacity = 0.88 + Math.sin(phase1 * 1.3) * 0.12;

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="64"
        height="80"
        viewBox="0 0 64 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        {/* Candle base + wax: static */}
        <ellipse cx="32" cy="72" rx="14" ry="4" fill="#8B7355" />
        <path d="M22 72 L26 48 L38 48 L42 72 Z" fill="#A08060" stroke="#6B5344" strokeWidth="1" />
        <rect x="27" y="28" width="10" height="22" rx="2" fill="#F5F0E8" />
        <ellipse cx="32" cy="28" rx="5" ry="2" fill="#E8E0D5" />
        {/* Flame: wind-blown flicker only (pivot at flame base 32,28) */}
        <g
          transform={`translate(${32 + flameSwayX}, ${28 + flameSwayY}) rotate(${flameTilt}) scale(${flameScaleX}, ${flameScaleY}) translate(-32, -28)`}
          style={{ opacity: flameOpacity }}
        >
          <path d="M32 8 C36 20 34 26 32 28 C30 26 28 20 32 8 Z" fill="#FFE066" />
          <path d="M32 10 C35 18 33 24 32 26 C29 24 29 18 32 10 Z" fill="#FFAA00" />
          <path d="M32 14 C33 20 32 23 32 24 C31 23 31 20 32 14 Z" fill="#FF6600" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
