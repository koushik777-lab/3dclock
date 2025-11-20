import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Bell, BellOff, Edit2, Check } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import gsap from 'gsap';
import Alarm3D from './Alarm3D';

const Alarm = ({ alarms, addAlarm, toggleAlarm, deleteAlarm, editAlarm }) => {
    const [newAlarmTime, setNewAlarmTime] = useState('');
    const [newAlarmName, setNewAlarmName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editTime, setEditTime] = useState('');

    // GSAP Refs
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const listRef = useRef(null);

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

    const handleAddAlarm = () => {
        if (newAlarmTime) {
            addAlarm(newAlarmTime, newAlarmName);
            setNewAlarmTime('');
            setNewAlarmName('');

            // GSAP Success Animation
            gsap.fromTo(formRef.current,
                { borderColor: '#00ff88', boxShadow: '0 0 20px #00ff88' },
                { borderColor: 'transparent', boxShadow: 'none', duration: 0.5 }
            );
        }
    };

    const startEditing = (alarm) => {
        setEditingId(alarm.id);
        setEditName(alarm.name);
        setEditTime(alarm.time);
    };

    const saveEdit = (id) => {
        editAlarm(id, editName, editTime);
        setEditingId(null);
    };

    const formatTo12Hour = (timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') return 'Invalid Time';
        try {
            const [hours, minutes] = timeStr.split(':');
            if (!hours || !minutes) return 'Invalid Time';
            let h = parseInt(hours, 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12;
            return `${h}:${minutes} ${ampm}`;
        } catch (e) {
            return 'Error';
        }
    };

    return (
        <div ref={containerRef} className="alarm-container" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>

            {/* 3D Viewport */}
            <div className="stagger-entry" style={{ width: '100%', height: 'clamp(200px, 30vh, 300px)', position: 'relative', marginBottom: '1rem' }}>
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Alarm3D alarms={alarms} />
                    <Environment preset="city" />
                    <OrbitControls enableZoom={false} enablePan={false} />
                </Canvas>
            </div>

            <div ref={formRef} className="stagger-entry glass-panel" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', padding: 'clamp(1rem, 3vw, 1.5rem)', width: '100%', maxWidth: '500px', border: '1px solid transparent', flexWrap: 'wrap' }}>
                <input
                    type="time"
                    value={newAlarmTime}
                    onChange={(e) => setNewAlarmTime(e.target.value)}
                    className="neon-input"
                    style={{ flex: '1 1 120px', fontSize: 'clamp(1rem, 3vw, 1.2rem)', minWidth: '120px' }}
                />
                <input
                    type="text"
                    placeholder="Label"
                    value={newAlarmName}
                    onChange={(e) => setNewAlarmName(e.target.value)}
                    className="neon-input"
                    style={{ flex: '1 1 120px', minWidth: '120px' }}
                />
                <button onClick={handleAddAlarm} className="btn-neon" style={{ minWidth: '80px', flex: '0 0 auto' }}>
                    <Plus size={20} /> Add
                </button>
            </div>

            <div ref={listRef} className="alarm-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '500px', flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                <AnimatePresence mode="popLayout">
                    {alarms.map((alarm) => (
                        <motion.div
                            key={alarm.id}
                            layout
                            initial={{ opacity: 0, x: -50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="alarm-item glass-panel"
                            style={{
                                padding: '1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: alarm.active ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                borderLeft: alarm.active ? '3px solid var(--neon-green)' : '3px solid transparent'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                {editingId === alarm.id ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input
                                            type="time"
                                            value={editTime}
                                            onChange={(e) => setEditTime(e.target.value)}
                                            className="neon-input"
                                            style={{ padding: '0.25rem', fontSize: '1.2rem', width: '100%' }}
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="neon-input"
                                                style={{ padding: '0.25rem', fontSize: '0.9rem', flex: 1 }}
                                                autoFocus
                                            />
                                            <button onClick={() => saveEdit(alarm.id)} className="btn-icon" style={{ color: 'var(--neon-green)' }}>
                                                <Check size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="neon-text-green" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold', opacity: alarm.active ? 1 : 0.5 }}>
                                            {formatTo12Hour(alarm.time)}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>{alarm.name}</span>
                                            <button onClick={() => startEditing(alarm)} className="btn-icon" style={{ opacity: 0.5 }}>
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button
                                    onClick={() => toggleAlarm(alarm.id)}
                                    className={`btn-icon ${alarm.active ? 'active' : ''}`}
                                    style={{
                                        color: alarm.active ? 'var(--neon-green)' : 'rgba(255,255,255,0.3)',
                                        transform: alarm.active ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {alarm.active ? <Bell size={24} /> : <BellOff size={24} />}
                                </button>
                                <button
                                    onClick={() => deleteAlarm(alarm.id)}
                                    className="btn-icon"
                                    style={{ color: '#ff4444', opacity: 0.7 }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {alarms.length === 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginTop: '2rem' }}
                    >
                        No alarms set
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default Alarm;
