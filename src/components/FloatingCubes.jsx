import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, Box } from '@react-three/drei';

export default function FloatingCubes() {
  const group = useRef();
  
  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={group}>
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={3}>
          <Box args={[0.5, 0.5, 0.5]} position={[(Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4]}>
            <meshStandardMaterial 
              color="#ff3cac"
              transparent={true}
              opacity={0.3}
              roughness={0.1}
              metalness={0.8}
            />
          </Box>
        </Float>
      ))}
      <Environment preset="night" />
    </group>
  );
}
