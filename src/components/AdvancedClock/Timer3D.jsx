import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const Timer3D = ({ remainingTime, totalTime, isRunning }) => {
    const group = useRef();
    const [rotation, setRotation] = useState([0, 0, 0]);

    const bind = useDrag(({ offset: [x, y] }) => {
        setRotation([y / 100, x / 100, 0]);
    });

    useFrame(() => {
        if (group.current) {
            group.current.rotation.x = rotation[0];
            group.current.rotation.y = rotation[1];
        }
    });

    const progress = totalTime > 0 ? remainingTime / totalTime : 0;
    const angle = progress * Math.PI * 2;

    return (
        <group ref={group} {...bind()} dispose={null}>
            {/* Base Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2, 0.2, 16, 100]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Progress Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2, 0.22, 16, 100, angle]} />
                <meshStandardMaterial
                    color="#ffff00"
                    emissive="#ffff00"
                    emissiveIntensity={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Center Orb */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshStandardMaterial
                    color="#111"
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Digital Display */}
            <Html position={[0, 0, 1.6]} transform occlude center>
                <div style={{
                    fontFamily: 'monospace',
                    color: '#ffff00',
                    fontSize: '48px',
                    textShadow: '0 0 10px #ffff00',
                    pointerEvents: 'none'
                }}>
                    {Math.ceil(remainingTime / 1000)}s
                </div>
            </Html>

            {/* Particles/Decorations */}
            {isRunning && [...Array(8)].map((_, i) => (
                <mesh
                    key={i}
                    position={[
                        Math.sin(Date.now() * 0.001 + i) * 2.5,
                        Math.cos(Date.now() * 0.001 + i) * 2.5,
                        Math.sin(Date.now() * 0.002 + i) * 0.5
                    ]}
                >
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshStandardMaterial color="#ffff00" emissive="#ffff00" />
                </mesh>
            ))}
        </group>
    );
};

export default Timer3D;
