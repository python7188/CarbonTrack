// ============================================================
// InteractiveGlobe — 3D Emission-Reactive Globe
// React Three Fiber Canvas with a distortable sphere.
// Distortion and color react to CO₂ emission levels.
// Default export so it can be used with React.lazy().
// ============================================================

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';
import { useRef, useMemo } from 'react';

// ── Props ──────────────────────────────────────────────────

interface InteractiveGlobeProps {
  co2Level?: number;
}

interface EarthNodeProps {
  co2Level: number;
}

// ── Earth Node (inner 3D component) ────────────────────────

function EarthNode({ co2Level }: EarthNodeProps) {
  const meshRef = useRef<Mesh>(null);

  // Determine distortion level and color based on CO₂ level
  const { distort, color } = useMemo(() => {
    if (co2Level < 300) {
      return { distort: 0.1, color: '#2EEA8B' }; // calm green
    }
    if (co2Level <= 600) {
      return { distort: 0.25, color: '#FBBF24' }; // warning yellow
    }
    return { distort: 0.4, color: '#FB7185' }; // danger red
  }, [co2Level]);

  // Animation: continuous Y rotation + subtle X oscillation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.8, 64, 64]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={2}
        roughness={0.4}
        metalness={0.1}
        emissive={color}
        emissiveIntensity={0.15}
      />
    </Sphere>
  );
}

// ── Globe Container ────────────────────────────────────────

function InteractiveGlobe({ co2Level = 432 }: InteractiveGlobeProps) {
  return (
    <div
      role="img"
      aria-label={`Interactive 3D globe showing emission level of ${co2Level} kg CO₂e. ${
        co2Level < 300
          ? 'Green indicates low emissions.'
          : co2Level <= 600
            ? 'Yellow indicates moderate emissions.'
            : 'Red indicates high emissions.'
      }`}
      className="relative min-h-[300px] w-full lg:min-h-[400px]"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />

        {/* Earth Sphere */}
        <EarthNode co2Level={co2Level} />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Emission Level Badge */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
        <div
          className={`rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-md ${
            co2Level < 300
              ? 'bg-green-500/20 text-green-300'
              : co2Level <= 600
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'bg-red-500/20 text-red-300'
          }`}
        >
          {co2Level} kg CO₂e
        </div>
      </div>
    </div>
  );
}

export default InteractiveGlobe;
