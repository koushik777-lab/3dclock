import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import gsap from 'gsap';
import Stopwatch3D from './Stopwatch3D';

const Stopwatch = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [laps, setLaps] = useState([]);
    const startTimeRef = useRef(null);
    const requestRef = useRef(null);

    // GSAP Refs
    const containerRef = useRef(null);
    const controlsRef = useRef(null);
    const lapsRef = useRef(null);

    useEffect(() => {
        // Entry Animation
        const ctx = gsap.context(() => {
            gsap.from(".stagger-entry", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const animate = (time) => {
        if (startTimeRef.current !== null) {
            setElapsedTime(time - startTimeRef.current);
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    const startStopwatch = () => {
        if (!isRunning) {
            setIsRunning(true);
            startTimeRef.current = performance.now() - elapsedTime;
            requestRef.current = requestAnimationFrame(animate);

            // GSAP Pulse Animation on Start
            gsap.to(controlsRef.current, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 });
        } else {
            setIsRunning(false);
            cancelAnimationFrame(requestRef.current);
        }
    };

    const resetStopwatch = () => {
        setIsRunning(false);
        cancelAnimationFrame(requestRef.current);
        setElapsedTime(0);
        setLaps([]);
        startTimeRef.current = null;

        // GSAP Shake on Reset
        gsap.to(containerRef.current, { x: [-5, 5, -5, 5, 0], duration: 0.3 });
    };

    const addLap = () => {
        if (isRunning) {
            setLaps([...laps, elapsedTime]);

            // GSAP Flash effect
            gsap.fromTo(".lap-flash", { opacity: 0.5 }, { opacity: 0, duration: 0.3 });
        }
    };

    const formatTime = (ms) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor(ms % 1000);

        return {
            h: hours.toString().padStart(2, '0'),
            m: minutes.toString().padStart(2, '0'),
            s: seconds.toString().padStart(2, '0'),
            ms: milliseconds.toString().padStart(3, '0')
        };
    };

    const timeObj = formatTime(elapsedTime);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>

            {/* 3D Viewport */}
            <div className="stagger-entry" style={{ width: '100%', height: 'clamp(250px, 40vh, 400px)', position: 'relative' }}>
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Stopwatch3D isRunning={isRunning} elapsedTime={elapsedTime} />
                    <Environment preset="city" />
                    <OrbitControls enableZoom={false} enablePan={false} />
                </Canvas>
            </div>

            {/* Digital Display */}
            <div className="stagger-entry glass-panel" style={{ padding: '1rem 2rem', marginBottom: '2rem', textAlign: 'center', backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 8vw, 3rem)', fontFamily: 'monospace', fontWeight: 'bold', display: 'flex', gap: '0.5rem', color: '#fff', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <span className="neon-text-green">{timeObj.h}</span>:
                    <span className="neon-text-green">{timeObj.m}</span>:
                    <span className="neon-text-green">{timeObj.s}</span>
                    <span style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)', alignSelf: 'flex-end', color: 'var(--neon-yellow)', marginBottom: '0.5rem' }}>.{timeObj.ms}</span>
                </div>
            </div>

            {/* Controls */}
            <div ref={controlsRef} className="stagger-entry" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    className="btn-neon"
                    onClick={startStopwatch}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '100px', justifyContent: 'center', flex: '1 1 auto' }}
                >
                    {isRunning ? <Pause size={20} /> : <Play size={20} />}
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                    className="btn-neon yellow"
                    onClick={addLap}
                    disabled={!isRunning}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isRunning ? 1 : 0.5, flex: '1 1 auto' }}
                >
                    <Flag size={20} /> Lap
                </button>
                <button
                    className="btn-neon"
                    onClick={resetStopwatch}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#ff0055', color: '#ff0055', flex: '1 1 auto' }}
                >
                    <RotateCcw size={20} /> Reset
                </button>
            </div>

            {/* Laps */}
            <div ref={lapsRef} className="stagger-entry" style={{ width: '100%', maxWidth: '400px', flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div className="lap-flash" style={{ position: 'absolute', inset: 0, background: 'white', pointerEvents: 'none', opacity: 0 }} />
                <AnimatePresence mode="popLayout">
                    {laps.map((lapTime, index) => {
                        const lapObj = formatTime(lapTime);
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="glass-panel"
                                style={{
                                    padding: '0.8rem 1.2rem',
                                    marginBottom: '0.8rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderLeft: '3px solid var(--neon-yellow)'
                                }}
                            >
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Lap {String(index + 1).padStart(2, '0')}</span>
                                <span className="neon-text-yellow" style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>
                                    {lapObj.h}:{lapObj.m}:{lapObj.s}.{lapObj.ms}
                                </span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Stopwatch;
