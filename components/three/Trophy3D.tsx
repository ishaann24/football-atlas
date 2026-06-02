'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D WebGL rotating golden trophy model
export function WebGLTrophy({ scrollProgress }: { scrollProgress: number }) {
  const trophyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!trophyRef.current) return;

    // Slow rotation
    trophyRef.current.rotation.y = state.clock.getElapsedTime() * 0.4 + scrollProgress * Math.PI * 2;

    // Parallax mouse tilt
    const mouseX = state.pointer.x * 0.3;
    const mouseY = state.pointer.y * 0.3;
    trophyRef.current.rotation.x = THREE.MathUtils.lerp(trophyRef.current.rotation.x, mouseY, 0.1);
    trophyRef.current.rotation.z = THREE.MathUtils.lerp(trophyRef.current.rotation.z, -mouseX, 0.1);
  });

  return (
    <group ref={trophyRef} position={[0, -0.5, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* 1. Base Plate of the Trophy (Cylinder) */}
      <mesh position={[0, -1.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 1.1, 0.4, 32]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 2. Malachite Green Rings (Base Bands) */}
      <mesh position={[0, -1.5, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.9, 0.15, 32]} />
        <meshStandardMaterial color="#065f46" roughness={0.6} />
      </mesh>
      <mesh position={[0, -1.3, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.85, 0.15, 32]} />
        <meshStandardMaterial color="#065f46" roughness={0.6} />
      </mesh>

      {/* 3. Gold Stem/Column (Cone) */}
      <mesh position={[0, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.7, 1.0, 32]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 4. Two Supporting Ribbons/Wings (Torus) */}
      <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <torusGeometry args={[0.5, 0.15, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <torusGeometry args={[0.5, 0.15, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.05} />
      </mesh>

      {/* 5. Globe Sphere at the top */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial color="#fef08a" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.76, 32, 32]} />
        <meshPhysicalMaterial
          color="#fde047"
          roughness={0}
          metalness={0.9}
          transmission={0.6}
          thickness={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// 3D WebGL rolling football/soccer ball
export function WebGLFootball({ scrollProgress }: { scrollProgress: number }) {
  const ballRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ballRef.current) return;
    // Roll forward based on scroll progress
    ballRef.current.rotation.x = scrollProgress * Math.PI * 4;
    // Continuous subtle y rotation
    ballRef.current.rotation.y = scrollProgress * Math.PI * 1.5;
  });

  return (
    <mesh ref={ballRef} castShadow receiveShadow scale={[1.2, 1.2, 1.2]}>
      {/* Dynamic sphere mapping a wireframe representing panel gaps */}
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        color="#ffffff"
        roughness={0.3}
        metalness={0.1}
        wireframe
      />
      {/* Core solid inner ball */}
      <mesh scale={[0.98, 0.98, 0.98]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </mesh>
  );
}
