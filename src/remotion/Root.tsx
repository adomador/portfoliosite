import React from 'react';
import { Composition } from 'remotion';
import { BlackholeGalaxy } from './BlackholeGalaxy';
import { Labyrinth3D } from './Labyrinth3D';

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
        id="Labyrinth3D"
        component={Labyrinth3D}
        durationInFrames={300}
        fps={30}
        width={320}
        height={320}
      />
    </>
  );
};
