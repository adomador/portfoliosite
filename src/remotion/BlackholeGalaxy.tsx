import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

export const BlackholeGalaxy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Slow, elegant rotation - Jony Ive minimalism
  const rotation = interpolate(
    frame,
    [0, durationInFrames],
    [0, 360],
    {
      extrapolateRight: 'wrap',
      easing: Easing.linear,
    }
  );

  // Subtle pulsing at the center - Dante's infernal depth
  // Use sine wave for perfectly smooth, seamless looping
  const pulsePhase = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 2],
    {
      extrapolateRight: 'wrap',
      easing: Easing.linear,
    }
  );
  const pulseScale = 1 + Math.sin(pulsePhase) * 0.025; // Smooth pulse from 1 to 1.05 and back

  // Particle rotation speeds - use interpolation for seamless loops
  // Each completes a multiple of 360deg within durationInFrames
  const particleRot1 = interpolate(
    frame,
    [0, durationInFrames],
    [0, 360 * 3], // 3 full rotations
    {
      extrapolateRight: 'wrap',
      easing: Easing.linear,
    }
  );
  
  const particleRot2 = interpolate(
    frame,
    [0, durationInFrames],
    [0, -360 * 2], // 2 full rotations (negative)
    {
      extrapolateRight: 'wrap',
      easing: Easing.linear,
    }
  );
  
  const particleRot3 = interpolate(
    frame,
    [0, durationInFrames],
    [0, 360 * 1.5], // 1.5 full rotations
    {
      extrapolateRight: 'wrap',
      easing: Easing.linear,
    }
  );

  // 3D depth animation - subtle tilt for perspective
  const depthTilt = interpolate(
    frame,
    [0, durationInFrames],
    [0, 360],
    {
      extrapolateRight: 'wrap',
      easing: Easing.linear,
    }
  );

  // Parallax depth offsets - use interpolation for seamless sine waves
  const depthOffset1 = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 2 * 15], // 15 complete cycles
    {
      extrapolateRight: 'wrap',
      easing: Easing.linear,
    }
  );
  const depthOffset1Value = Math.sin(depthOffset1) * 5;

  const depthOffset2 = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 2 * 21], // 21 complete cycles
    {
      extrapolateRight: 'wrap',
      easing: Easing.linear,
    }
  );
  const depthOffset2Value = Math.sin(depthOffset2) * 8;

  const depthOffset3 = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 2 * 9], // 9 complete cycles
    {
      extrapolateRight: 'wrap',
      easing: Easing.linear,
    }
  );
  const depthOffset3Value = Math.sin(depthOffset3) * 3;

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at center, #0a0908 0%, #000000 100%)',
        overflow: 'hidden',
        perspective: '600px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Outer atmospheric glow - more visible */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(
            ellipse 120% 100% at 50% 50%,
            rgba(40, 35, 30, 0.6) 0%,
            rgba(25, 20, 15, 0.4) 40%,
            rgba(10, 9, 8, 0.2) 60%,
            transparent 80%
          )`,
          transform: `rotate(${rotation * 0.1}deg)`,
        }}
      />

      {/* Outer particle layer - more particles, brighter, 3D depth */}
      <AbsoluteFill
        style={{
          transform: `rotate(${particleRot2}deg) rotateY(${depthTilt * 0.1}deg)`,
          opacity: 0.7,
          transformStyle: 'preserve-3d',
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const radius = 90 + (i % 4) * 12;
          const zDepth = (i % 3 - 1) * 15; // Vary depth
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const scale = 1 + (zDepth / 100); // Scale based on depth
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.4)',
                transform: `translate3d(${x}px, ${y}px, ${zDepth + depthOffset1Value}px) scale(${scale})`,
                boxShadow: `0 0 ${6 * scale}px rgba(255, 255, 255, 0.5), 0 0 ${12 * scale}px rgba(255, 255, 255, 0.3)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Middle particle layer - swirling cosmic dust, 3D depth */}
      <AbsoluteFill
        style={{
          transform: `rotate(${particleRot1}deg) rotateY(${depthTilt * 0.15}deg)`,
          opacity: 0.8,
          transformStyle: 'preserve-3d',
        }}
      >
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const radius = 60 + (i % 3) * 12;
          const zDepth = (i % 2) * 10 - 5; // Vary depth
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const scale = 1 + (zDepth / 80);
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 2.5,
                height: 2.5,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.5)',
                transform: `translate3d(${x}px, ${y}px, ${zDepth + depthOffset2Value}px) scale(${scale})`,
                boxShadow: `0 0 ${5 * scale}px rgba(255, 255, 255, 0.6), 0 0 ${10 * scale}px rgba(255, 255, 255, 0.3)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Inner particle layer - closer to center */}
      <AbsoluteFill
        style={{
          transform: `rotate(${particleRot3 * 0.5}deg)`,
          opacity: 0.9,
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 35 + (i % 2) * 8;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 2,
                height: 2,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.6)',
                transform: `translate(${x}px, ${y}px)`,
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.7), 0 0 8px rgba(255, 255, 255, 0.4)',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Event horizon - Dante's dark depth with 3D form */}
      <AbsoluteFill
        style={{
          transform: `rotate(${rotation}deg) rotateX(${Math.sin((depthTilt * Math.PI) / 180 * 0.02) * 8}deg) rotateY(${Math.cos((depthTilt * Math.PI) / 180 * 0.02) * 8}deg) scale(${pulseScale})`,
          transformOrigin: 'center',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Outer ring - 3D depth, volumetric */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 180,
            height: 180,
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            background: `radial-gradient(
              circle at 50% 50%,
              rgba(255, 255, 255, 0.05) 0%,
              transparent 60%
            )`,
            transform: 'translate3d(-50%, -50%, -20px)',
            boxShadow: 
              'inset 0 0 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 255, 255, 0.1)',
          }}
        />
        
        {/* Outer ring highlight - top edge for 3D */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 180,
            height: 180,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            transform: 'translate3d(-50%, -50%, -18px)',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)',
          }}
        />

        {/* Middle ring - 3D depth */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            background: `radial-gradient(
              circle at 50% 50%,
              rgba(255, 255, 255, 0.08) 0%,
              transparent 50%
            )`,
            transform: 'translate3d(-50%, -50%, -10px)',
            boxShadow: 
              'inset 0 0 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 255, 255, 0.08)',
          }}
        />

        {/* Middle ring highlight */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            transform: 'translate3d(-50%, -50%, -8px)',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)',
          }}
        />

        {/* Inner ring - 3D depth */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 85,
            height: 85,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: `radial-gradient(
              circle at 50% 50%,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 40%
            )`,
            transform: 'translate3d(-50%, -50%, -5px)',
            boxShadow: 'inset 0 0 25px rgba(0, 0, 0, 0.95)',
          }}
        />

        {/* Core - 3D sphere with volumetric shading */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `radial-gradient(
              ellipse 80% 60% at 30% 25%,
              rgba(255, 255, 255, 0.3) 0%,
              rgba(200, 200, 200, 0.2) 15%,
              rgba(120, 120, 120, 0.15) 30%,
              rgba(50, 50, 50, 0.1) 50%,
              rgba(30, 28, 26, 0.95) 70%,
              rgba(0, 0, 0, 1) 100%
            )`,
            transform: 'translate3d(-50%, -50%, 0px)',
            boxShadow: `
              0 0 30px rgba(0, 0, 0, 0.9),
              0 0 15px rgba(255, 255, 255, 0.05),
              inset -10px -10px 30px rgba(0, 0, 0, 0.95),
              inset 10px 10px 20px rgba(255, 255, 255, 0.03)
            `,
          }}
        />

        {/* Core highlight - top edge for 3D sphere effect */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: `radial-gradient(
              ellipse 100% 80% at 50% 30%,
              rgba(255, 255, 255, 0.2) 0%,
              transparent 60%
            )`,
            transform: 'translate3d(-50%, -50%, 2px)',
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>

      {/* Accretion disk - 3D tilted swirl */}
      <AbsoluteFill
        style={{
          transform: `rotate(${particleRot3}deg) rotateX(${Math.sin((depthTilt * Math.PI) / 180 * 0.03) * 12}deg)`,
          opacity: 0.5,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: `radial-gradient(
              ellipse 100% 60% at 50% 50%,
              rgba(255, 255, 255, 0.08) 0%,
              transparent 70%
            )`,
            transform: 'translate3d(-50%, -50%, -15px)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
