import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, TorusKnot, MeshWobbleMaterial } from '@react-three/drei';

export default function BackgroundKnot() {
  const meshRef = useRef();
  
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <TorusKnot ref={meshRef} args={[3, 0.4, 64, 16]} position={[0, 0, -2]}>
        <MeshWobbleMaterial color="#00e5ff" factor={1} speed={2} wireframe opacity={0.3} transparent />
      </TorusKnot>
    </Float>
  );
}
