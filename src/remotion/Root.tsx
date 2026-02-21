import React from 'react';
import { Composition } from 'remotion';
import { BlackholeGalaxy } from './BlackholeGalaxy';
import { CandleGlow } from './CandleGlow';
import CandleSmoke from './CandleSmoke';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BlackholeGalaxy"
        component={BlackholeGalaxy}
        durationInFrames={300}
        fps={30}
        width={260}
        height={260}
      />
      <Composition
        id="CandleGlow"
        component={CandleGlow}
        durationInFrames={300}
        fps={30}
        width={400}
        height={400}
      />
      <Composition
        id="CandleSmoke"
        component={CandleSmoke}
        durationInFrames={90}
        fps={30}
        width={120}
        height={120}
      />
    </>
  );
};
