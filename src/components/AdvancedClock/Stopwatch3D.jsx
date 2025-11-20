import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, a } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import { Text, Html } from '@react-three/drei';

const Stopwatch3D = ({ isRunning, elapsedTime }) => {
    const group = useRef();
    const [rotation, setRotation] = useState([0, 0, 0]);

    // Drag interaction
    const bind = useDrag(({ offset: [x, y] }) => {
        setRotation([y / 100, x / 100, 0]);
    });

    // Animation for the second hand
    const secondHandRef = useRef();
    useFrame(() => {
        if (secondHandRef.current) {
            const seconds = (elapsedTime % 60000) / 1000;
            secondHandRef.current.rotation.z = -seconds * (Math.PI * 2) / 60;
        }
        if (group.current) {
            group.current.rotation.x = rotation[0];
            group.current.rotation.y = rotation[1];
        }
    });

    return (
        <group ref={group} {...bind()} dispose={null}>
            {/* Watch Body */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[2.2, 2.2, 0.5, 64]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Watch Face */}
            <mesh position={[0, 0, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[2, 64]} />
                <meshStandardMaterial color="#000000" />
            </mesh>

            {/* Rim */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.2, 0.1, 16, 100]} />
                <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
            </mesh>

            {/* Markers */}
            {[...Array(12)].map((_, i) => (
                <mesh
                    key={i}
                    position={[
                        Math.sin((i * Math.PI) / 6) * 1.8,
                        Math.cos((i * Math.PI) / 6) * 1.8,
                        0.27
                    ]}
                    rotation={[0, 0, -(i * Math.PI) / 6]}
                >
                    <boxGeometry args={[0.1, 0.3, 0.05]} />
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
                </mesh>
            ))}

            {/* Hands */}
            <group position={[0, 0, 0.3]}>
                {/* Second Hand */}
                <mesh ref={secondHandRef} position={[0, 0, 0.05]}>
                    <boxGeometry args={[0.05, 1.8, 0.02]} />
                    <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={0.8} />
                </mesh>

                {/* Center Cap */}
                <mesh position={[0, 0, 0.06]}>
                    <cylinderGeometry args={[0.1, 0.1, 0.1, 32]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
            </group>

            {/* Digital Display embedded in 3D */}
            <Html position={[0, -1, 0.3]} transform occlude center>
                <div style={{
                    fontFamily: 'monospace',
                    color: '#00ff88',
                    fontSize: '24px',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #00ff88',
                    pointerEvents: 'none'
                }}>
                    {(elapsedTime / 1000).toFixed(2)}s
                </div>
            </Html>
        </group>
    );
};

export default Stopwatch3D;
