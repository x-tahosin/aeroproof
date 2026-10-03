import React, { useState, useEffect } from 'react';
import { Plane, Compass, ShieldCheck, Database, Volume2, VolumeX, Layers, Activity, Sliders, Cpu, Wifi } from 'lucide-react';
import { soundEngine } from '../sound/avionicsAudio';

export default function Navbar({
  activeView,
  onSelectView,
  onOpenSanityModal
}) {
  const [utcTime, setUtcTime] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${mins} UTC`);
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

  const navItems = [
    { id: 'hero', label: 'Overview', icon: Plane },
    { id: 'cockpit', label: 'Cockpit', icon: Compass },
    { id: 'systems', label: 'Systems', icon: Layers },
    { id: 'auditor', label: 'Auditor', icon: ShieldCheck },
    { id: 'simulator', label: 'Simulator', icon: Sliders },
    { id: 'trace', label: 'Agent Trace', icon: Cpu }
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: '12px',
      zIndex: 100,
      marginBottom: '24px',
      background: 'rgba(4, 9, 20, 0.75)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(56, 189, 248, 0.18)',
      borderRadius: '16px',
      padding: '10px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.8)'
    }}>
      {/* Brand Logo */}
      <div
        onClick={() => {
          soundEngine.playSwitchClick();
          onSelectView('hero');
        }}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(0,242,254,0.2) 0%, rgba(2,132,199,0.3) 100%)',
          border: '1px solid rgba(0,242,254,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(0,242,254,0.3)'
        }}>
          <Plane size={20} color="#00f2fe" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#fff'
            }}>
              AERO<span style={{ color: 'var(--neon-cyan)' }}>PROOF</span>
            </span>
          </div>
          <span style={{
            fontSize: '9px',
            letterSpacing: '0.1em',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            display: 'block'
          }}>
            FLIGHT SYSTEMS
          </span>
        </div>
      </div>

      {/* Navigation Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'rgba(2, 6, 15, 0.6)',
        padding: '4px',
        borderRadius: '9999px',
        border: '1px solid rgba(56, 189, 248, 0.12)'
      }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                soundEngine.playSwitchClick();
                onSelectView(item.id);
              }}
              className={`grok-btn ${isActive ? 'active' : ''}`}
              style={{
                padding: '6px 14px',
                fontSize: '12px'
              }}
            >
              <Icon size={13} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Telemetry & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* UTC Time Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(2, 6, 16, 0.7)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(56, 189, 248, 0.14)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981'
          }} />
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{utcTime}</span>
          <span style={{ color: '#10b981', fontSize: '9px', fontWeight: 700 }}>CONNECTED</span>
          <Wifi size={12} color="#10b981" />
        </div>

        {/* Sanity Context MCP status */}
        <button
          onClick={() => {
            soundEngine.playSwitchClick();
            onOpenSanityModal();
          }}
          className="grok-btn"
          style={{ padding: '6px 12px', fontSize: '11px' }}
          title="Inspect Sanity Project ID & Knowledge Base"
        >
          <Database size={13} color="var(--neon-cyan)" />
          <span className="font-mono">SANITY MCP</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={handleToggleSound}
          className="grok-btn"
          style={{ padding: '6px 10px' }}
          title={isMuted ? 'Unmute Cockpit Audio' : 'Mute Cockpit Audio'}
        >
          {isMuted ? <VolumeX size={15} color="#ef4444" /> : <Volume2 size={15} color="var(--neon-cyan)" />}
        </button>
      </div>
    </nav>
  );
}
