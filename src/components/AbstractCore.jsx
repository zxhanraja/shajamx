import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Icosahedron } from '@react-three/drei';

export default function AbstractCore() {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Icosahedron ref={meshRef} args={[2, 0]} position={[0, 0, -2]}>
        <meshStandardMaterial color="#c8ff00" wireframe />
      </Icosahedron>
    </Float>
  );
}
