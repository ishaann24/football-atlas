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
          color="#0f172a"
          roughness={0.8}
          metalness={0.3}
          side={DoubleSide}
        />
      </mesh>

      {/* 2. Wireframe accent rings (Tunnel framework) - Uses basic material for neon glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[2.48, 2.48, 30, 8, 15, true]} />
        <meshBasicMaterial
          color="#10b981"
          opacity={0.25}
          transparent
          wireframe
        />
      </mesh>

      {/* 3. Glowing portal guide rings along the tunnel length */}
      {[-12, -8, -4, 0, 4, 8, 12].map((zVal) => (
        <mesh key={zVal} rotation={[0, 0, 0]} position={[0, 0, zVal]}>
          <ringGeometry args={[2.46, 2.48, 64]} />
          <meshBasicMaterial
            color="#10b981"
            opacity={0.4}
            transparent
            side={DoubleSide}
          />
        </mesh>
      ))}

      {/* 4. Glowing exit archway ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -14.9]}>
        <ringGeometry args={[2.4, 2.5, 32]} />
        <meshBasicMaterial color="#10b981" opacity={0.8} transparent />
      </mesh>

      {/* 5. Ambient tunnel point lights (higher intensity for physical lighting support) */}
      <pointLight position={[0, 1.5, 8]} intensity={35} decay={1.2} distance={20} color="#3b82f6" />
      <pointLight position={[0, 1.5, -8]} intensity={35} decay={1.2} distance={20} color="#10b981" />
    </group>
  );
}
