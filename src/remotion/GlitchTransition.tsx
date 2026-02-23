import React from 'react'
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  random,
} from 'remotion'

const NUM_SLICES = 24

/**
 * System glitch transition: pixellated static, RGB split, chaotic flicker.
 * Plays once as a transition effect.
 */
export const GlitchTransition: React.FC = () => {
  const frame = useCurrentFrame()
  const { width, height, durationInFrames } = useVideoConfig()

  // Overall intensity: immediate full chaos, ramps down to black
  const intensity = interpolate(
    frame,
    [0, 2, durationInFrames * 0.7, durationInFrames - 1, durationInFrames],
    [1, 1, 1, 0.5, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // RGB split offset – chaotic, frame-dependent
  const seed = frame * 17
  const rOffset = (random(seed) - 0.5) * 24 * intensity
  const gOffset = (random(seed + 1) - 0.5) * 18 * intensity
  const bOffset = (random(seed + 2) - 0.5) * 28 * intensity

  // Pixelation block size – varies erratically
  const blockSeed = frame * 7
  const blockSize = Math.floor(interpolate(random(blockSeed), [0, 1], [4, 20])) * intensity + 2

  // Bright flicker flashes
  const flash = random(seed + 100) > 0.92 ? 1 : 0
  const flashOpacity = flash * intensity * 0.3

  // Horizontal slice offsets – CRT glitch
  const slices = Array.from({ length: NUM_SLICES }, (_, i) => {
    const y = (i / NUM_SLICES) * height
    const sliceSeed = frame * 31 + i * 11
    const offsetX = (random(sliceSeed) - 0.5) * 60 * intensity
    return { y, offsetX }
  })

  // Static noise – sparse pixellated grid
  const noiseGridSize = 14
  const noiseCells: Array<{ left: number; top: number; size: number; opacity: number }> = []
  const maxRows = Math.min(80, Math.ceil(height / noiseGridSize) + 4)
  const maxCols = Math.min(120, Math.ceil(width / noiseGridSize) + 4)
  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxCols; col++) {
      const n = random(frame * 137 + row * 53 + col * 97)
      if (n > 0.75) {
        noiseCells.push({
          left: col * noiseGridSize - 10,
          top: row * noiseGridSize - 10,
          size: noiseGridSize + 4,
          opacity: n * intensity * 0.5,
        })
      }
    }
  }

  return (
    <AbsoluteFill
      style={{
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* RGB split layers */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, 
            rgba(255,0,0,0.15) 0%, 
            transparent 20%, 
            transparent 80%, 
            rgba(255,0,0,0.12) 100%)`,
          transform: `translateX(${rOffset}px)`,
          mixBlendMode: 'screen',
          opacity: intensity,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            rgba(0,255,0,0.12) 30%, 
            rgba(0,255,0,0.15) 70%, 
            transparent 100%)`,
          transform: `translateX(${gOffset}px)`,
          mixBlendMode: 'screen',
          opacity: intensity,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, 
            rgba(0,0,255,0.12) 0%, 
            transparent 50%, 
            rgba(0,0,255,0.15) 100%)`,
          transform: `translateX(${bOffset}px)`,
          mixBlendMode: 'screen',
          opacity: intensity,
        }}
      />

      {/* Horizontal slice displacement – drawn as offset rectangles */}
      {slices.map(({ y, offsetX }, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            top: y,
            width: '100%',
            height: height / NUM_SLICES + 4,
            background: `linear-gradient(180deg, 
              rgba(255,255,255,${0.03 * intensity}) 0%, 
              rgba(100,100,255,${0.02 * intensity}) 50%,
              rgba(255,100,100,${0.03 * intensity}) 100%)`,
            transform: `translateX(${offsetX}px)`,
            mixBlendMode: 'screen',
          }}
        />
      ))}

      {/* Pixellated static noise */}
      {noiseCells.map((cell, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: cell.left,
            top: cell.top,
            width: cell.size,
            height: cell.size,
            background: `rgb(${random(i + frame) * 255},${random(i + frame + 100) * 255},${random(i + frame + 200) * 255})`,
            opacity: cell.opacity,
          }}
        />
      ))}

      {/* Random white flash */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            background: '#fff',
            opacity: flashOpacity,
          }}
        />
      )}

      {/* Scanlines */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(0,0,0,${0.15 * intensity}) 2px,
            rgba(0,0,0,${0.15 * intensity}) 4px
          )`,
          pointerEvents: 'none',
        }}
      />

      {/* Vignette / edge darkening for CRT feel */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(
            ellipse 80% 80% at 50% 50%,
            transparent 50%,
            rgba(0,0,0,0.4) 100%
          )`,
          opacity: intensity * 0.8,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}
