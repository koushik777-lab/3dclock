import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Globe, Timer, Watch, Bell } from 'lucide-react';
import './styles.css';

import Clock3D from './Clock3D';
import WorldClock from './WorldClock';
import Stopwatch from './Stopwatch';
import TimerComp from './Timer';
import Alarm from './Alarm';
import ErrorBoundary from './ErrorBoundary';


export const MainInterface = () => {
    const [activeTab, setActiveTab] = useState('clock');
    const [alarms, setAlarms] = useState([]);
    const [triggeredAlarm, setTriggeredAlarm] = useState(null);

    useEffect(() => {
        const savedAlarms = localStorage.getItem('alarms');
        if (savedAlarms) {
            try {
                const parsed = JSON.parse(savedAlarms);
                if (Array.isArray(parsed)) {
                    setAlarms(parsed);
                } else {
                    console.error("Loaded alarms is not an array", parsed);
                    setAlarms([]);
                }
            } catch (e) {
                console.error("Failed to parse alarms", e);
                setAlarms([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('alarms', JSON.stringify(alarms));
    }, [alarms]);

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    const audioCtxRef = useRef(null);
    const oscillatorRef = useRef(null);
    const gainNodeRef = useRef(null);

    const playAlarmSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            if (!audioCtxRef.current) {
                audioCtxRef.current = new AudioContext();
            }
            const ctx = audioCtxRef.current;

            // Stop previous sound if any
            if (oscillatorRef.current) {
                oscillatorRef.current.stop();
                oscillatorRef.current.disconnect();
            }

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'square';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            // Modulate frequency for a "ringing" effect
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

            // Volume Ramp: Start low (1%) and ramp to 100% over 100 seconds
            gain.gain.setValueAtTime(0.01, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 100);

            osc.start();

            // Store refs to stop later
            oscillatorRef.current = osc;
            gainNodeRef.current = gain;

        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    const stopAlarmSound = () => {
        if (oscillatorRef.current) {
            try {
                oscillatorRef.current.stop();
                oscillatorRef.current.disconnect();
            } catch (e) {
                console.warn("Error stopping oscillator", e);
            }
            oscillatorRef.current = null;
        }
        if (gainNodeRef.current) {
            gainNodeRef.current.disconnect();
            gainNodeRef.current = null;
        }
    };

    const alarmsRef = useRef(alarms);
    useEffect(() => {
        alarmsRef.current = alarms;
    }, [alarms]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            let triggered = null;
            let shouldUpdate = false;

            const updatedAlarms = alarmsRef.current.map(alarm => {
                if (alarm.time === currentTime && alarm.active && !alarm.triggered) {
                    triggered = alarm;
                    shouldUpdate = true;
                    return { ...alarm, triggered: true, active: false };
                }
                return alarm;
            });

            if (shouldUpdate) {
                setAlarms(updatedAlarms);
            }

            if (triggered) {
                setTriggeredAlarm(triggered);
                playAlarmSound();
                if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
                    new Notification('Alarm Triggered!', {
                        body: `${triggered.name} is ringing!`,
                        icon: '/vite.svg'
                    });
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const addAlarm = (time, name) => {
        setAlarms([...alarms, {
            id: Date.now(),
            time,
            name: name || 'Alarm',
            active: true,
            triggered: false
        }]);
    };

    const toggleAlarm = (id) => {
        setAlarms(alarms.map(alarm =>
            alarm.id === id ? { ...alarm, active: !alarm.active, triggered: false } : alarm
        ));
    };

    const deleteAlarm = (id) => {
        setAlarms(alarms.filter(alarm => alarm.id !== id));
    };

    const editAlarm = (id, newName, newTime) => {
        setAlarms(alarms.map(alarm =>
            alarm.id === id ? { ...alarm, name: newName, time: newTime } : alarm
        ));
    };

    const dismissAlarm = () => {
        setTriggeredAlarm(null);
        stopAlarmSound();
    };

    const tabs = [
        { id: 'clock', label: 'Clock', icon: Clock },
        { id: 'world', label: 'World', icon: Globe },
        { id: 'stopwatch', label: 'Stopwatch', icon: Watch },
        { id: 'timer', label: 'Timer', icon: Timer },
        { id: 'alarm', label: 'Alarm', icon: Bell },
    ];



    return (
        <div className="clock-container">
            {triggeredAlarm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200
                }}>
                    <motion.div
                        className="glass-panel"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ textAlign: 'center', padding: 'clamp(1.5rem, 5vw, 3rem)', maxWidth: '90vw', margin: '0 1rem' }}
                    >
                        <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                        >
                            <Bell size={64} color="var(--neon-green)" />
                        </motion.div>
                        <h2 className="neon-text-green" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', margin: '1rem 0' }}>
                            {(() => {
                                const [hours, minutes] = triggeredAlarm.time.split(':');
                                let h = parseInt(hours, 10);
                                const ampm = h >= 12 ? 'PM' : 'AM';
                                h = h % 12;
                                h = h ? h : 12;
                                return `${h}:${minutes} ${ampm}`;
                            })()}
                        </h2>
                        <p className="neon-text-yellow" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>{triggeredAlarm.name}</p>
                        <button className="btn-neon" onClick={dismissAlarm} style={{ marginTop: '2rem', fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>Dismiss</button>
                    </motion.div>
                </div>
            )}

            <nav className="nav-tabs">
                {tabs.map((tab) => (
                    <motion.div
                        key={tab.id}
                        className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <tab.icon size={18} />
                            {tab.label}
                        </span>
                    </motion.div>
                ))}
            </nav>

            <main className="content-area">
                <AnimatePresence mode="wait">
                    {activeTab === 'clock' && (
                        <motion.div
                            key="clock"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Clock3D />
                        </motion.div>
                    )}
                    {activeTab === 'world' && (
                        <motion.div
                            key="world"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <WorldClock />
                        </motion.div>
                    )}
                    {activeTab === 'stopwatch' && (
                        <motion.div
                            key="stopwatch"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Stopwatch />
                        </motion.div>
                    )}
                    {activeTab === 'timer' && (
                        <motion.div
                            key="timer"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <TimerComp />
                        </motion.div>
                    )}
                    {activeTab === 'alarm' && (
                        <motion.div
                            key="alarm"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <ErrorBoundary>
                                <Alarm
                                    alarms={Array.isArray(alarms) ? alarms : []}
                                    addAlarm={addAlarm}
                                    toggleAlarm={toggleAlarm}
                                    deleteAlarm={deleteAlarm}
                                    editAlarm={editAlarm}
                                />
                            </ErrorBoundary>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};
