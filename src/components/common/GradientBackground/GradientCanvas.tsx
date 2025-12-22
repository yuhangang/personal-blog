'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import GradientMesh from './GradientMesh';

interface GradientCanvasProps {
  colors?: [string, string, string, string];
  opacity?: number;
  className?: string;
}

export default function GradientCanvas({ colors, opacity, className }: GradientCanvasProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <GradientMesh colors={colors} opacity={opacity} />
        </Suspense>
      </Canvas>
    </div>
  );
}
