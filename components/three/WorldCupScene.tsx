'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tunnel3D from './Tunnel3D';
import { WebGLTrophy, WebGLFootball } from './Trophy3D';

// Register GSAP ScrollTrigger on the client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function SceneContent() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // High-performance mutable ref to store scroll progress driven by GSAP ScrollTrigger
  const scrollState = useRef({ progress: 0 });

  useEffect(() => {
    // Bind ScrollTrigger to the document body to scrub the animation progress from 0 to 1
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollState.current.progress = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  useFrame(() => {
    const scrollProgress = scrollState.current.progress;

    // 1. Camera scroll interpolation path
    // Phase 1: Inside the tunnel (0 to 0.4) -> Z moves from 14 to -13.
    // Phase 2: Exit tunnel into arena (0.4 to 0.6) -> Z moves from -13 to 5, Y rises from 0 to 1.2.
    // Phase 3: Showcase stage (0.6 to 1.0) -> Z stays at 5, Y drifts down from 1.2 to 0.8.
    let targetZ = 14;
    let targetY = 0;
    let targetX = 0;

    if (scrollProgress <= 0.4) {
      const t = scrollProgress / 0.4;
      targetZ = THREE.MathUtils.lerp(14, -13, t);
      targetY = 0;
    } else if (scrollProgress <= 0.6) {
      const t = (scrollProgress - 0.4) / 0.2;
      targetZ = THREE.MathUtils.lerp(-13, 5, t);
      targetY = THREE.MathUtils.lerp(0, 1.2, t);
    } else {
      const t = (scrollProgress - 0.6) / 0.4;
      targetZ = 5;
      targetY = 1.2 - t * 0.4;
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

  // Calculate items visibility relative to scroll progression (from the mutable ref)
  const currentProgress = typeof window !== 'undefined' ? scrollState.current.progress : 0;
  
  // We check scrollState.current.progress inside frame rendering to toggle visibility
  // To avoid React stale closures, we can let useFrame handle updates or force states inside frame loop
  const tunnelRef = useRef<THREE.Group>(null);
  const trophyRef = useRef<THREE.Group>(null);
  const footballRef = useRef<THREE.Group>(null);
  const pitchRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const progress = scrollState.current.progress;

    if (tunnelRef.current) {
      tunnelRef.current.visible = progress < 0.5;
    }
    if (trophyRef.current) {
      trophyRef.current.visible = progress >= 0.35 && progress <= 0.82;
    }
    if (footballRef.current) {
      footballRef.current.visible = progress >= 0.70;
    }
    if (pitchRef.current) {
      pitchRef.current.visible = progress >= 0.38;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 14]} fov={60} />

      {/* Volumetric ambient fog simulating cold stadium air */}
      <fog attach="fog" args={['#020617', 2, 35]} />

      {/* Global Lighting System (increased intensity for physical lighting) */}
      <ambientLight intensity={0.5} />
      
      <directionalLight
        position={[5, 10, 5]}
        intensity={3.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Stadium floodlight spotlight pointing to the center trophy */}
      <spotLight
        position={[0, 10, -2]}
        angle={0.6}
        penumbra={0.8}
        intensity={45}
        color="#10b981"
        castShadow
        decay={1}
      />

      {/* Blue fill front light to bring out gold surfaces and panel gaps */}
      <spotLight
        position={[0, 4, 8]}
        angle={0.8}
        penumbra={0.5}
        intensity={20}
        color="#3b82f6"
        decay={1}
      />

      {/* Star particles floating around the stadium */}
      <Stars radius={100} depth={50} count={1500} factor={4} saturation={0.5} fade speed={1} />

      {/* 3D Meshes group */}
      <group ref={tunnelRef}>
        <Tunnel3D />
      </group>

      <group ref={trophyRef} position={[0, 0.4, 0]} visible={false}>
        <WebGLTrophy scrollProgress={currentProgress} />
      </group>

      <group ref={footballRef} position={[0, 0, 0]} visible={false}>
        <WebGLFootball scrollProgress={currentProgress} />
      </group>

      {/* Pitch floor and grids representing host stadium field markings */}
      <group ref={pitchRef} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.0, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#022c22" roughness={0.9} metalness={0.1} />
        </mesh>
        <gridHelper args={[60, 30, '#10b981', '#064e3b']} position={[0, -1.99, 0]} />
      </group>
    </>
  );
}

export default function WorldCupScene() {
  return (
    <div className="w-full h-full">
      {/* Set alpha: true to let CSS background radial gradients bleed through */}
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <SceneContent />
      </Canvas>
    </div>
  );
}
