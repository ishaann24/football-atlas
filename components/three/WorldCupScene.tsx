'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import Tunnel3D from './Tunnel3D';
import { WebGLTrophy, WebGLFootball } from './Trophy3D';

interface SceneContentProps {
  scrollProgress: number;
}

function SceneContent({ scrollProgress }: { scrollProgress: number }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state) => {
    // 1. Camera scroll interpolation path
    // Scene 1 & 2: Inside the tunnel (scrollProgress 0 to 0.4). Camera moves from Z=15 to Z=-10.
    // Scene 3: Exit tunnel into arena (scrollProgress 0.4 to 0.6). Z goes from -10 to -2.
    // Scene 4 & 5: Fixed view, floating elements (scrollProgress 0.6 to 1). Camera stays around Z=5.
    let targetZ = 15;
    let targetY = 0;
    let targetX = 0;

    if (scrollProgress <= 0.4) {
      // Tunnel passage
      const t = scrollProgress / 0.4;
      targetZ = THREE.MathUtils.lerp(14, -13, t);
      targetY = 0;
    } else if (scrollProgress <= 0.6) {
      // Exit tunnel transition
      const t = (scrollProgress - 0.4) / 0.2;
      targetZ = THREE.MathUtils.lerp(-13, 5, t);
      targetY = THREE.MathUtils.lerp(0, 1.2, t);
    } else {
      // Showcase stage
      const t = (scrollProgress - 0.6) / 0.4;
      targetZ = 5;
      targetY = 1.2 - t * 0.4; // subtle drift down
    }

    if (cameraRef.current) {
      cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 0.1);
      cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetY, 0.1);
      cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, targetX, 0.1);

      // Camera lookAt target shifts based on scroll phase
      const lookAtZ = scrollProgress < 0.4 ? -20 : 0;
      const lookAtTarget = new THREE.Vector3(0, 0.2, lookAtZ);
      cameraRef.current.lookAt(lookAtTarget);
    }
  });

  // Calculate items transparency/visibility relative to scroll progression
  // Tunnel is visible in first phase (0 to 0.5)
  const tunnelVisible = scrollProgress < 0.5;
  // Trophy is visible in second phase (0.4 to 0.8)
  const trophyVisible = scrollProgress >= 0.38 && scrollProgress <= 0.82;
  // Football is visible in last phase (0.75 to 1.0)
  const footballVisible = scrollProgress >= 0.72;

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 14]} fov={60} />

      {/* Volumetric ambient fog simulating cold stadium air */}
      <fog attach="fog" args={['#020617', 2, 35]} />

      {/* Global Lighting System */}
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      {/* Stadium floodlight spotlight pointing to the center trophy */}
      <spotLight
        position={[0, 8, -5]}
        angle={0.4}
        penumbra={1}
        intensity={3}
        color="#10b981"
        castShadow
      />

      {/* Star particles floating around the stadium */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} fade speed={1} />

      {/* 3D Meshes group */}
      {tunnelVisible && <Tunnel3D />}

      {trophyVisible && (
        <group position={[0, 0.4, 0]}>
          <WebGLTrophy scrollProgress={scrollProgress} />
        </group>
      )}

      {footballVisible && (
        <group position={[0, 0, 0]}>
          <WebGLFootball scrollProgress={scrollProgress} />
        </group>
      )}
    </>
  );
}

export default function WorldCupScene({ scrollProgress }: SceneContentProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows gl={{ antialias: true, alpha: false }}>
        <SceneContent scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
