import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Stars, Ring } from '@react-three/drei';
import * as THREE from 'three';

const Tick = ({ rotation, size, color }) => (
    <mesh rotation={[0, 0, rotation]} position={[0, 0, 0]}>
        <boxGeometry args={[0.1, size, 0.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
);

const Hand = ({ rotation, length, width, color, z }) => (
    <mesh rotation={[0, 0, -rotation]} position={[0, 0, z]}>
        <boxGeometry args={[width, length, 0.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        {/* Pivot point adjustment */}
        <group position={[0, length / 2, 0]} />
    </mesh>
);

const ClockFace = React.memo(() => {
    const [time, setTime] = useState(new Date());
    const hoursRef = useRef();
    const minutesRef = useRef();
    const secondsRef = useRef();
    const groupRef = useRef();

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(t / 5) * 0.2;
            groupRef.current.rotation.x = Math.cos(t / 5) * 0.2;
        }

        const h = time.getHours() % 12;
        const m = time.getMinutes();
        const s = time.getSeconds();

        // Calculate angles (in radians)
        // 12 hours = 360 deg = 2PI rad
        // Hour hand moves slightly with minutes
        const hAngle = (h + m / 60) * (Math.PI / 6);
        const mAngle = m * (Math.PI / 30);
        const sAngle = s * (Math.PI / 30);

        if (hoursRef.current) hoursRef.current.rotation.z = -hAngle;
        if (minutesRef.current) minutesRef.current.rotation.z = -mAngle;
        if (secondsRef.current) secondsRef.current.rotation.z = -sAngle;
    });

    return (
        <group ref={groupRef}>
            {/* Outer Ring */}
            <Ring args={[3.8, 4, 64]} material-color="#39ff14" material-emissive="#39ff14" material-emissiveIntensity={0.5} />

            {/* Hour Markers */}
            {[...Array(12)].map((_, i) => (
                <group key={i} rotation={[0, 0, i * (Math.PI / 6)]}>
                    <mesh position={[0, 3.2, 0]}>
                        <boxGeometry args={[0.2, 0.6, 0.1]} />
                        <meshStandardMaterial color="#fff01f" emissive="#fff01f" emissiveIntensity={2} />
                    </mesh>
                </group>
            ))}

            {/* Minute Markers */}
            {[...Array(60)].map((_, i) => {
                if (i % 5 === 0) return null;
                return (
                    <group key={i} rotation={[0, 0, i * (Math.PI / 30)]}>
                        <mesh position={[0, 3.4, 0]}>
                            <boxGeometry args={[0.05, 0.2, 0.05]} />
                            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={1} />
                        </mesh>
                    </group>
                );
            })}

            {/* Hands */}
            {/* Hour Hand */}
            <group ref={hoursRef}>
                <mesh position={[0, 1, 0.1]}>
                    <boxGeometry args={[0.3, 2, 0.1]} />
                    <meshStandardMaterial color="#fff01f" emissive="#fff01f" emissiveIntensity={1} />
                </mesh>
            </group>

            {/* Minute Hand */}
            <group ref={minutesRef}>
                <mesh position={[0, 1.5, 0.2]}>
                    <boxGeometry args={[0.2, 3, 0.1]} />
                    <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={1} />
                </mesh>
            </group>

            {/* Second Hand */}
            <group ref={secondsRef}>
                <mesh position={[0, 1.8, 0.3]}>
                    <boxGeometry args={[0.05, 3.6, 0.05]} />
                    <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={2} />
                </mesh>
            </group>

            {/* Center Cap */}
            <mesh position={[0, 0, 0.4]}>
                <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
                <meshStandardMaterial color="#fff" emissive="#fff" />
            </mesh>

            {/* Digital Time Display in 3D */}
            <Text
                position={[0, -1.5, 0.1]}
                fontSize={0.5}
                color="#39ff14"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
            >
                {time.toLocaleTimeString()}
            </Text>
        </group>
    );
});

const Clock3D = React.memo(() => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ClockFace />
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    );
});

export default Clock3D;
