import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Points, PointMaterial, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random particles
const particlesCount = 2000;
const defaultPositions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount; i++) {
  const r = 2.5 + Math.random() * 0.5;
  const theta = 2 * Math.PI * Math.random();
  const phi = Math.acos(2 * Math.random() - 1);
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  defaultPositions[i * 3] = x;
  defaultPositions[i * 3 + 1] = y;
  defaultPositions[i * 3 + 2] = z;
}

export const WebGLGlobe = () => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#00E559" />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#FF5C00" />
      
      {/* Inner Core */}
      <Sphere args={[2, 64, 64]}>
        <MeshDistortMaterial 
          color="#09090b" 
          attach="material" 
          distort={0.4} 
          speed={1.5} 
          roughness={0.2} 
          metalness={0.8}
        />
      </Sphere>

      {/* Wireframe Shield */}
      <Sphere args={[2.2, 32, 32]}>
        <meshBasicMaterial color="#00E559" wireframe transparent opacity={0.15} />
      </Sphere>

      {/* Orbiting Data Particles */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={defaultPositions}
            itemSize={3}
            args={[defaultPositions, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};
