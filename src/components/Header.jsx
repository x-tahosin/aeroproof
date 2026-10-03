import React, { useState, useEffect } from 'react';
import { Plane, Volume2, VolumeX, Database, ShieldCheck, Terminal, Award } from 'lucide-react';
import { soundEngine } from '../sound/avionicsAudio';

export default function Header({
  aircraft,
  onSelectAircraft,
  aircraftList,
  onOpenSanityModal,
  onOpenTranscriptModal
}) {
  const [zuluTime, setZuluTime] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setZuluTime(`${hours}:${mins}:${secs}Z`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) soundEngine.playSwitchClick();
  };

  return (
    <header className="cockpit-card mb-6 p-4 border-b border-cyan-500/20" style={{ background: 'linear-gradient(180deg, rgba(8,17,35,0.95) 0%, rgba(4,10,22,0.9) 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand / Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0,242,254,0.15) 0%, rgba(2,132,199,0.3) 100%)',
            border: '1px solid var(--hud-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0,242,254,0.25)'
          }}>
            <Plane size={24} color="#00f2fe" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="font-hud" style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '0.08em', color: '#fff' }}>
                AERO<span style={{ color: 'var(--hud-cyan)' }}>PROOF</span>
              </h1>
              <span className="badge-cat-c font-mono" style={{ fontSize: '10px', padding: '1px 6px', letterSpacing: '0.05em' }}>
                EFB DISPATCH v2.6
              </span>
              <span style={{
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.35)',
                color: '#34d399',
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)'
              }}>
                14 CFR § 121.628 COMPLIANT
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Aviation Minimum Equipment List (MEL) & Airworthiness Directives Dispatch Cockpit
            </p>
          </div>
        </div>

        {/* Aircraft Type Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(3,7,18,0.7)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          {aircraftList.map(ac => (
            <button
              key={ac._id}
              onClick={() => {
                soundEngine.playSwitchClick();
                onSelectAircraft(ac);
              }}
              className={`btn-avionics ${aircraft._id === ac._id ? 'active' : ''}`}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              <Plane size={14} />
              <span>{ac.icaoCode}</span>
              <span style={{ opacity: 0.6, fontSize: '10px' }}>({ac.model.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        {/* Telemetry & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Zulu Time Clock */}
          <div style={{
            background: 'rgba(3,7,18,0.85)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} className="pulse-indicator" />
            <span className="font-mono glow-cyan" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--hud-cyan)' }}>
              {zuluTime}
            </span>
          </div>

          {/* Sanity Context MCP status */}
          <button
            onClick={() => {
              soundEngine.playSwitchClick();
              onOpenSanityModal();
            }}
            className="btn-avionics"
            style={{ fontSize: '11px', padding: '6px 12px' }}
            title="Inspect Sanity Project ID & Knowledge Base"
          >
            <Database size={14} color="#00f2fe" />
            <span className="font-mono">SANITY MCP: ACTIVE</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="btn-avionics"
            style={{ padding: '6px 10px' }}
            title={isMuted ? 'Unmute Avionics Sounds' : 'Mute Cockpit Chimes'}
          >
            {isMuted ? <VolumeX size={15} color="#ef4444" /> : <Volume2 size={15} color="#38bdf8" />}
          </button>
        </div>

      </div>
    </header>
  );
}
