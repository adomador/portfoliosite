import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

/**
 * 3D Labyrinth – system of thought, Dante Divine Comedy vibe.
 * Top-down perspective with concentric paths, dark depth, amber glow at center.
 */
export const Labyrinth3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const rings = 7; // concentric paths

  // Slow rotation for depth – full loop
  const rotation = interpolate(
    frame,
    [0, durationInFrames],
    [0, 360],
    { extrapolateRight: 'loop', easing: Easing.linear }
  );

  // Subtle breathing pulse at center (divine light)
  const pulsePhase = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 2],
    { extrapolateRight: 'loop', easing: Easing.linear }
  );
  const pulseOpacity = 0.4 + Math.sin(pulsePhase) * 0.12;
  const pulseScale = 1 + Math.sin(pulsePhase) * 0.04;

  // Parallax for inner rings
  const ringPhase = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 2 * 4],
    { extrapolateRight: 'loop', easing: Easing.linear }
  );
  const ringTilt = Math.sin(ringPhase) * 3;

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse 120% 120% at 50% 50%, #0d0a08 0%, #050403 50%, #000000 100%)',
        overflow: 'hidden',
        perspective: '800px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Atmospheric haze – infernal/paradisiacal */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(
            ellipse 100% 80% at 50% 50%,
            rgba(80, 45, 25, 0.15) 0%,
            rgba(40, 22, 10, 0.08) 40%,
            transparent 70%
          )`,
          transform: `rotate(${rotation * 0.05}deg)`,
        }}
      />

      {/* 3D container – look down at the labyrinth */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          transform: `rotateX(62deg) rotateZ(${rotation * 0.15}deg)`,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 220,
            height: 220,
            transformStyle: 'preserve-3d',
            transform: `rotateZ(${-rotation * 0.15}deg)`,
          }}
        >
          {/* Concentric labyrinth rings – path grooves */}
          {Array.from({ length: rings }).map((_, i) => {
            const radius = 25 + (i / rings) * 85;
            const gapAngle = 40 + (i % 3) * 25; // gap in degrees for “path”
            const strokeWidth = Math.max(4, 12 - i * 1.2);
            const nextRadius = i < rings - 1 ? 25 + ((i + 1) / rings) * 85 : radius + 5;
            const ringWidth = nextRadius - radius;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: radius * 2,
                  height: radius * 2,
                  marginLeft: -radius,
                  marginTop: -radius,
                  borderRadius: '50%',
                  border: `${strokeWidth}px solid rgba(60, 45, 35, 0.7)`,
                  boxShadow: `
                    inset 0 0 ${ringWidth * 2}px rgba(0, 0, 0, 0.6),
                    0 0 ${strokeWidth}px rgba(120, 80, 50, 0.15)
                  `,
                  transform: `translateZ(${-i * 4}px) rotate(${ringTilt * (i % 2 === 0 ? 1 : -1)}deg)`,
                  background: 'transparent',
                }}
              />
            );
          })}

          {/* Center – divine light (Dante’s end of the journey) */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 28,
              height: 28,
              marginLeft: -14,
              marginTop: -14,
              borderRadius: '50%',
              background: `radial-gradient(
                circle at 30% 30%,
                rgba(255, 200, 120, 0.9) 0%,
                rgba(220, 150, 60, 0.6) 40%,
                rgba(160, 90, 30, 0.3) 70%,
                transparent 100%
              )`,
              opacity: pulseOpacity,
              transform: `translateZ(10px) scale(${pulseScale})`,
              boxShadow: `
                0 0 25px rgba(255, 180, 80, 0.5),
                0 0 50px rgba(200, 120, 40, 0.25),
                inset 0 0 15px rgba(255, 220, 150, 0.4)
              `,
            }}
          />

          {/* Inner path ring highlight */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 50,
              height: 50,
              marginLeft: -25,
              marginTop: -25,
              borderRadius: '50%',
              border: '1px solid rgba(200, 150, 80, 0.25)',
              transform: 'translateZ(2px)',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8)',
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Dust / faint particles – floating thought */}
      <AbsoluteFill
        style={{
          transform: `rotate(${rotation}deg)`,
          opacity: 0.5,
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2 + (frame * 0.2) % (Math.PI * 2);
          const r = 70 + (i % 4) * 25;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                width: 2,
                height: 2,
                borderRadius: '50%',
                background: 'rgba(255, 220, 180, 0.35)',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 6px rgba(255, 200, 120, 0.3)',
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
