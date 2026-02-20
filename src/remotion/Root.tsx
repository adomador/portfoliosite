import React from 'react';
import { Composition } from 'remotion';
import { BlackholeGalaxy } from './BlackholeGalaxy';

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
    </>
  );
};
