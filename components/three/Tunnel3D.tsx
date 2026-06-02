'use client';

import React from 'react';
import { DoubleSide } from 'three';

export default function Tunnel3D() {
  return (
    <group>
      {/* 1. Outer Tunnel Structure (Cylinder) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 30, 32, 10, true]} />
        <meshStandardMaterial
          color="#0a0f1d"
          roughness={0.9}
          metalness={0.2}
          side={DoubleSide}
        />
      </mesh>

      {/* 2. Wireframe accent rings (Tunnel framework) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[2.48, 2.48, 30, 8, 15, true]} />
        <meshStandardMaterial
          color="#10b981"
          opacity={0.06}
          transparent
          wireframe
        />
      </mesh>

      {/* 3. Glowing volumetric exit archway ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -14.9]}>
        <ringGeometry args={[2.4, 2.5, 32]} />
        <meshBasicMaterial color="#10b981" opacity={0.6} transparent />
      </mesh>

      {/* 4. Ambient tunnel point lights */}
      <pointLight position={[0, 1.5, 5]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[0, 1.5, -5]} intensity={0.5} color="#10b981" />
    </group>
  );
}
