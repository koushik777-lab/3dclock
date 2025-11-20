import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';

const Globe = () => {
    const meshRef = useRef();

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <mesh ref={meshRef} scale={[2.5, 2.5, 2.5]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
                color="#39ff14"
                wireframe
                transparent
                opacity={0.3}
                emissive="#39ff14"
                emissiveIntensity={0.5}
            />
        </mesh>
    );
};

const WorldBackground3D = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none' // Allow clicks to pass through to the UI
        }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                <Globe />
            </Canvas>
        </div>
    );
};

export default WorldBackground3D;
