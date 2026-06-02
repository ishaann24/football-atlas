'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // 1. Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 2. Instantiate Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard fast-out/slow-in easing
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // 3. Connect Lenis scroll events to ScrollTrigger updates
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // 4. Synchronize GSAP ticker with Lenis raf loop
    function raf(time: number) {
      lenis.raf(time * 1000);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Expose lenis globally for scroll triggers or timelines to bind to
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      // Clean up all ScrollTriggers when unmounting
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
