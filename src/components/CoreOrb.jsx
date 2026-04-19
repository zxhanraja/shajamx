import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';

export default function CoreOrb() {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 16, 16]} scale={1.8}>
        <MeshDistortMaterial
          color="#c8ff00"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.3}
          metalness={0.7}
          wireframe={false}
        />
      </Sphere>
    </Float>
  );
}
