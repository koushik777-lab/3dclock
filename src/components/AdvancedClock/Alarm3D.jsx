import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { Html } from '@react-three/drei';

const Alarm3D = ({ alarms }) => {
    const group = useRef();
    const [rotation, setRotation] = useState([0, 0, 0]);

    const bind = useDrag(({ offset: [x, y] }) => {
        setRotation([y / 100, x / 100, 0]);
    });

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.x = rotation[0];
            group.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.1; // Slow rotation
        }
    });

    const activeAlarmsCount = alarms.filter(a => a.active).length;

    return (
        <group ref={group} {...bind()} dispose={null}>
            {/* Bell Body */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.5, 1.5, 2, 32]} />
                <meshStandardMaterial
                    color="#00ff88"
                    metalness={0.6}
                    roughness={0.2}
                />
            </mesh>

            {/* Bell Top */}
            <mesh position={[0, 1.5, 0]}>
                <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#00ff88" metalness={0.6} roughness={0.2} />
            </mesh>

            {/* Clapper */}
            <mesh position={[0, -0.5, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Handle */}
            <mesh position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.3, 0.05, 16, 32, Math.PI]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Floating Indicators for Active Alarms */}
            {[...Array(activeAlarmsCount)].map((_, i) => (
                <mesh
                    key={i}
                    position={[
                        Math.sin(i * (Math.PI * 2 / activeAlarmsCount)) * 2,
                        Math.cos(i * (Math.PI * 2 / activeAlarmsCount)) * 2,
                        0
                    ]}
                >
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
                </mesh>
            ))}

            <Html position={[0, -2, 0]} center>
                <div style={{
                    color: '#00ff88',
                    fontFamily: 'monospace',
                    background: 'rgba(0,0,0,0.5)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap'
                }}>
                    {activeAlarmsCount} Active
                </div>
            </Html>
        </group>
    );
};

export default Alarm3D;
