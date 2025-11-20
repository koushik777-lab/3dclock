import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Globe } from 'lucide-react';
import { toZonedTime, format } from 'date-fns-tz';
import WorldBackground3D from './WorldBackground3D';

const defaultCities = [
    { name: 'Kolkata', zone: 'Asia/Kolkata' },
    { name: 'London', zone: 'Europe/London' },
    { name: 'Sydney', zone: 'Australia/Sydney' },
    { name: 'New York', zone: 'America/New_York' },
];

const WorldClock = () => {
    const [cities, setCities] = useState(defaultCities);
    const [time, setTime] = useState(new Date());
    const [newCity, setNewCity] = useState('');
    const [newZone, setNewZone] = useState('');
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const addCity = () => {
        if (newCity && newZone) {
            setCities([...cities, { name: newCity, zone: newZone }]);
            setNewCity('');
            setNewZone('');
            setShowAdd(false);
        }
    };

    const removeCity = (index) => {
        setCities(cities.filter((_, i) => i !== index));
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <WorldBackground3D />

            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '800px',
                padding: '2rem',
                position: 'relative',
                zIndex: 1,
                margin: '0 auto',
                marginTop: '2rem',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 className="neon-text-green" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe /> World Clock
                    </h2>
                    <button onClick={() => setShowAdd(!showAdd)} className="btn-neon">
                        {showAdd ? 'Cancel' : 'Add City'}
                    </button>
                </div>

                {showAdd && (
                    <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', background: 'rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                placeholder="City Name"
                                value={newCity}
                                onChange={(e) => setNewCity(e.target.value)}
                                className="neon-input"
                                style={{ flex: 1 }}
                            />
                            <input
                                type="text"
                                placeholder="Timezone (e.g., Asia/Tokyo)"
                                value={newZone}
                                onChange={(e) => setNewZone(e.target.value)}
                                className="neon-input"
                                style={{ flex: 1 }}
                            />
                        </div>
                        <button onClick={addCity} className="btn-neon" style={{ width: '100%' }}>
                            Add
                        </button>
                    </div>
                )}

                <div className="cities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {cities.map((city, index) => {
                        const cityTime = toZonedTime(time, city.zone);
                        return (
                            <div key={index} className="city-card glass-panel" style={{ padding: '1.5rem', position: 'relative', background: 'rgba(20, 20, 20, 0.7)' }}>
                                <button
                                    onClick={() => removeCity(index)}
                                    className="btn-icon"
                                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: '#ff4444', opacity: 0.7 }}
                                >
                                    <Trash2 size={16} />
                                </button>
                                <h3 className="neon-text-yellow" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{city.name}</h3>
                                <div className="neon-text-green" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                    {format(cityTime, 'HH:mm', { timeZone: city.zone })}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                    {format(cityTime, 'EEE, MMM d', { timeZone: city.zone })}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                    {city.zone}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WorldClock;
