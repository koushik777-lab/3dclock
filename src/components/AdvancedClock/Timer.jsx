import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import gsap from 'gsap';
import Timer3D from './Timer3D';

const Timer = () => {
    const [inputHours, setInputHours] = useState(0);
    const [inputMinutes, setInputMinutes] = useState(0);
    const [inputSeconds, setInputSeconds] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const intervalRef = useRef(null);

    // GSAP Refs
    const containerRef = useRef(null);
    const controlsRef = useRef(null);

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

    useEffect(() => {
        if (isRunning && remainingTime > 0) {
            intervalRef.current = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 1000) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        setIsFinished(true);

                        // GSAP Finish Animation
                        gsap.to(".timer-finish-anim", {
                            scale: 1.2,
                            duration: 0.5,
                            yoyo: true,
                            repeat: -1,
                            ease: "power1.inOut"
                        });

                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, remainingTime]);

    const startTimer = () => {
        if (remainingTime === 0 && !isFinished) {
            const totalMs = (inputHours * 3600 + inputMinutes * 60 + inputSeconds) * 1000;
            if (totalMs > 0) {
                setRemainingTime(totalMs);
                setTotalTime(totalMs);
                setIsRunning(true);
                setIsFinished(false);

                // GSAP Start Pulse
                gsap.to(controlsRef.current, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 });
            }
        } else if (remainingTime > 0) {
            setIsRunning(true);
        }
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setIsFinished(false);
        setRemainingTime(0);
        setTotalTime(0);
        setInputHours(0);
        setInputMinutes(0);
        setInputSeconds(0);

        // GSAP Shake on Reset
        gsap.to(containerRef.current, { x: [-5, 5, -5, 5, 0], duration: 0.3 });
    };

    const formatTime = (ms) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return {
            h: hours.toString().padStart(2, '0'),
            m: minutes.toString().padStart(2, '0'),
            s: seconds.toString().padStart(2, '0'),
        };
    };

    const timeObj = formatTime(remainingTime);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>

            {isFinished ? (
                <div className="timer-finish-anim" style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem' }}>
                    <Bell size={80} color="var(--neon-yellow)" style={{ marginBottom: '1rem' }} />
                    <h2 className="neon-text-yellow" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '2rem' }}>Time's Up!</h2>
                    <button className="btn-neon" onClick={resetTimer} style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)', padding: '1rem 2rem' }}>Dismiss</button>
                </div>
            ) : (
                <>
                    {/* 3D Viewport */}
                    <div className="stagger-entry" style={{ width: '100%', height: 'clamp(250px, 40vh, 400px)', position: 'relative' }}>
                        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} />
                            <Timer3D remainingTime={remainingTime} totalTime={totalTime} isRunning={isRunning} />
                            <Environment preset="city" />
                            <OrbitControls enableZoom={false} enablePan={false} />
                        </Canvas>
                    </div>

                    {remainingTime === 0 && !isRunning ? (
                        <div className="stagger-entry glass-panel" style={{ padding: 'clamp(1rem, 3vw, 2rem)', display: 'flex', gap: 'clamp(0.5rem, 2vw, 1rem)', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <input
                                    type="number" min="0" value={inputHours}
                                    onChange={(e) => setInputHours(parseInt(e.target.value) || 0)}
                                    className="neon-input"
                                    style={{ width: 'clamp(50px, 15vw, 60px)', textAlign: 'center', fontSize: 'clamp(1.5rem, 5vw, 2rem)', padding: '0.5rem' }}
                                />
                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>HRS</span>
                            </div>
                            <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'white', paddingBottom: '1.5rem' }}>:</span>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <input
                                    type="number" min="0" max="59" value={inputMinutes}
                                    onChange={(e) => setInputMinutes(parseInt(e.target.value) || 0)}
                                    className="neon-input"
                                    style={{ width: 'clamp(50px, 15vw, 60px)', textAlign: 'center', fontSize: 'clamp(1.5rem, 5vw, 2rem)', padding: '0.5rem' }}
                                />
                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>MIN</span>
                            </div>
                            <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'white', paddingBottom: '1.5rem' }}>:</span>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <input
                                    type="number" min="0" max="59" value={inputSeconds}
                                    onChange={(e) => setInputSeconds(parseInt(e.target.value) || 0)}
                                    className="neon-input"
                                    style={{ width: 'clamp(50px, 15vw, 60px)', textAlign: 'center', fontSize: 'clamp(1.5rem, 5vw, 2rem)', padding: '0.5rem' }}
                                />
                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>SEC</span>
                            </div>
                        </div>
                    ) : (
                        <div className="stagger-entry glass-panel" style={{ padding: '1rem 2rem', marginBottom: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--neon-yellow)' }}>
                                {timeObj.h}:{timeObj.m}:{timeObj.s}
                            </div>
                        </div>
                    )}

                    <div ref={controlsRef} className="stagger-entry" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {!isRunning && remainingTime === 0 ? (
                            <button className="btn-neon" onClick={startTimer} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(1rem, 3vw, 1.2rem)', padding: '0.8rem 1.5rem' }}>
                                <Play size={24} /> Start Timer
                            </button>
                        ) : (
                            <>
                                <button className="btn-neon" onClick={isRunning ? pauseTimer : startTimer} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto' }}>
                                    {isRunning ? <Pause size={20} /> : <Play size={20} />}
                                    {isRunning ? 'Pause' : 'Resume'}
                                </button>
                                <button className="btn-neon" onClick={resetTimer} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#ff0055', color: '#ff0055', flex: '1 1 auto' }}>
                                    <RotateCcw size={20} /> Reset
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Timer;
