import React, { useState } from 'react';
import { Plane, Menu, Shield, Snowflake, Zap, Fan, Disc, Radio, Sliders, Activity, Droplets, Target, AlertTriangle, CheckCircle2, Wind } from 'lucide-react';
import { soundEngine } from '../sound/avionicsAudio';
import { getAssetUrl } from '../utils/assetUrl';

export default function SystemsVisualizerView({
  aircraft,
  selectedFailures,
  onToggleFailure,
  melItems,
  dispatchResult
}) {
  const [selectedAta, setSelectedAta] = useState(21);
  const isB738 = aircraft?._id === 'ac-b738';

  const ataList = [
    { chapter: 21, code: '21', title: 'CABIN COND.', dot: '#00f2fe', failureId: isB738 ? 'mel-21-50-01' : 'mel-21-50-02' },
    { chapter: 24, code: '24', title: 'ELECTRICAL', dot: '#00f2fe', failureId: isB738 ? 'mel-24-11-01' : 'mel-24-11-02' },
    { chapter: 49, code: '49', title: 'APU', dot: '#f59e0b', failureId: isB738 ? 'mel-49-11-01' : 'mel-49-11-02' },
    { chapter: 32, code: '32', title: 'LANDING GEAR', dot: '#ef4444', failureId: isB738 ? 'mel-32-42-02' : 'mel-32-45-01' },
    { chapter: 34, code: '34', title: 'NAVIGATION / TCAS', dot: '#00f2fe', failureId: isB738 ? 'mel-34-43-01' : 'mel-34-12-01' },
    { chapter: 36, code: '36', title: 'PNEUMATICS', dot: '#00f2fe', failureId: 'mel-36-11-01' },
    { chapter: 28, code: '28', title: 'FUEL SYSTEM', dot: '#f59e0b', failureId: 'mel-28-21-01' },
    { chapter: 27, code: '27', title: 'FLIGHT CONTROLS', dot: '#10b981', failureId: 'mel-27-51-01' }
  ];

  const currentAta = ataList.find(a => a.chapter === selectedAta) || ataList[0];
  const isAtaFailed = currentAta.failureId && selectedFailures.includes(currentAta.failureId);
  const activeMelDoc = melItems?.find(m => m._id === currentAta.failureId);

  // Hotspots mapped to coordinates on the 3D X-Ray jet
  const hotspots = [
    { ata: 34, label: 'AVIONICS BAY', top: '48%', left: '22%', failureId: currentAta.chapter === 34 ? currentAta.failureId : (isB738 ? 'mel-34-43-01' : 'mel-34-12-01') },
    { ata: 21, label: 'BLEED AIR / PACK', top: '56%', left: '44%', failureId: isB738 ? 'mel-21-50-01' : 'mel-21-50-02' },
    { ata: 24, label: 'TURBOFAN IDG', top: '64%', left: '76%', failureId: isB738 ? 'mel-24-11-01' : 'mel-24-11-02' },
    { ata: 32, label: 'HYDRAULIC GEAR', top: '74%', left: '50%', failureId: isB738 ? 'mel-32-42-02' : 'mel-32-45-01' },
    { ata: 49, label: 'APU TAIL CONE', top: '30%', left: '82%', failureId: isB738 ? 'mel-49-11-01' : 'mel-49-11-02' },
    { ata: 28, label: 'MAIN WING TANKS', top: '60%', left: '60%', failureId: 'mel-28-21-01' }
  ];

  return (
    <div className="grok-card p-6" style={{ minHeight: '82vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(56,189,248,0.12)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plane size={18} color="var(--neon-cyan)" />
          <span style={{ fontFamily: 'var(--font-hud)', fontSize: '16px', fontWeight: 800, letterSpacing: '0.15em', color: '#fff' }}>
            AEROPROOF // SYSTEMS ARCHITECTURE
          </span>
          <span style={{ fontSize: '10px', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', background: 'rgba(0,242,254,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
            {aircraft?.model || 'Boeing 737-800'}
          </span>
        </div>
        <div style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--neon-cyan)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0,242,254,0.08)',
          padding: '4px 12px',
          borderRadius: '9999px',
          border: '1px solid rgba(0,242,254,0.25)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-cyan)', boxShadow: '0 0 8px var(--neon-cyan)' }} />
          <span>HOLOGRAPHIC X-RAY TELEMETRY • LIVE</span>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '250px 1fr 320px',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        
        {/* Left Floating Sidebar: ATA List */}
        <div style={{
          background: 'rgba(5, 12, 26, 0.88)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(56, 189, 248, 0.18)',
          borderRadius: '16px',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(56,189,248,0.1)' }}>
            <Menu size={15} color="var(--neon-cyan)" />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              ATA CHAPTERS ({ataList.length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
            {ataList.map(item => {
              const isSelected = selectedAta === item.chapter;
              const isFailed = item.failureId && selectedFailures.includes(item.failureId);

              return (
                <div
                  key={item.chapter}
                  onClick={() => {
                    soundEngine.playSwitchClick();
                    setSelectedAta(item.chapter);
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(0, 242, 254, 0.14)' : isFailed ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                    border: isSelected ? '1px solid var(--neon-cyan)' : isFailed ? '1px solid #ef4444' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isFailed ? '#ef4444' : item.dot,
                      boxShadow: isFailed ? '0 0 8px #ef4444' : `0 0 6px ${item.dot}`
                    }} />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: isFailed ? '#fca5a5' : isSelected ? '#fff' : 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      ATA {item.code}
                    </span>
                  </div>
                  <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: isFailed ? '#ef4444' : isSelected ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(56,189,248,0.1)', textAlign: 'center', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            CLICK TO AUDIT SUBSYSTEM
          </div>
        </div>

        {/* Center: Glowing Photorealistic 3D X-Ray Aircraft with Interactive Nodes */}
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#01040a',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          boxShadow: 'inset 0 0 60px rgba(0, 242, 254, 0.08)'
        }}>
          {/* 3D X-Ray Aircraft Image */}
          <img
            src={getAssetUrl('assets/3d/xray_jet_clean.png')}
            alt="Aircraft X-Ray Schematics"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 30px rgba(0, 242, 254, 0.45)) contrast(1.15) brightness(1.1)',
            }}
          />

          {/* Radar Sweep Animation Lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 242, 254, 0.04) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none'
          }} />

          {/* Interactive Pulsing Hotspots on the 3D Jet */}
          {hotspots.map(spot => {
            const isSelected = selectedAta === spot.ata;
            const isFailed = spot.failureId && selectedFailures.includes(spot.failureId);
            const color = isFailed ? '#ef4444' : isSelected ? 'var(--neon-cyan)' : '#38bdf8';

            return (
              <div
                key={spot.ata}
                onClick={() => {
                  soundEngine.playSwitchClick();
                  setSelectedAta(spot.ata);
                }}
                style={{
                  position: 'absolute',
                  top: spot.top,
                  left: spot.left,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 5,
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Glowing Concentric Target Ring */}
                <div style={{
                  position: 'relative',
                  width: isSelected ? '28px' : '20px',
                  height: isSelected ? '28px' : '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: `1.5px dashed ${color}`,
                    animation: 'ringSpin 8s linear infinite',
                    boxShadow: `0 0 12px ${color}`
                  }} />
                  <div style={{
                    width: isSelected ? '8px' : '6px',
                    height: isSelected ? '8px' : '6px',
                    borderRadius: '50%',
                    background: color,
                    boxShadow: `0 0 10px ${color}`
                  }} />
                </div>

                {/* Floating Tag */}
                <div style={{
                  background: 'rgba(2, 6, 16, 0.92)',
                  border: `1px solid ${color}`,
                  borderRadius: '6px',
                  padding: '2px 6px',
                  marginTop: '4px',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', fontWeight: 700, color }}>
                    ATA {spot.ata} // {spot.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Floating Sidebar: ATA Detail Card */}
        <div style={{
          background: 'rgba(5, 12, 26, 0.88)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(56, 189, 248, 0.18)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '14px'
        }}>
          <div>
            {/* Header icon */}
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: isAtaFailed ? 'rgba(239,68,68,0.15)' : 'rgba(0,242,254,0.1)',
                border: isAtaFailed ? '1.5px solid #ef4444' : '1.5px solid var(--neon-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                boxShadow: isAtaFailed ? '0 0 20px rgba(239,68,68,0.35)' : '0 0 20px rgba(0,242,254,0.25)'
              }}>
                {selectedAta === 21 && <Snowflake size={22} color={isAtaFailed ? '#ef4444' : 'var(--neon-cyan)'} />}
                {selectedAta === 24 && <Zap size={22} color={isAtaFailed ? '#ef4444' : 'var(--neon-cyan)'} />}
                {selectedAta === 49 && <Fan size={22} color={isAtaFailed ? '#ef4444' : '#f59e0b'} />}
                {selectedAta === 32 && <Disc size={22} color={isAtaFailed ? '#ef4444' : '#ef4444'} />}
                {selectedAta === 34 && <Radio size={22} color={isAtaFailed ? '#ef4444' : 'var(--neon-cyan)'} />}
                {selectedAta === 36 && <Wind size={22} color={isAtaFailed ? '#ef4444' : 'var(--neon-cyan)'} />}
                {selectedAta === 28 && <Droplets size={22} color={isAtaFailed ? '#ef4444' : '#f59e0b'} />}
                {selectedAta === 27 && <Target size={22} color={isAtaFailed ? '#ef4444' : '#10b981'} />}
              </div>
              <h4 style={{ fontFamily: 'var(--font-hud)', fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '0.06em' }}>
                ATA {selectedAta} // {currentAta.title}
              </h4>
              <span style={{ fontSize: '10px', color: isAtaFailed ? '#ef4444' : '#10b981', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {isAtaFailed ? 'FAULT INJECTED // INOPERATIVE' : 'SYSTEM OPERATIONAL // NOMINAL'}
              </span>
            </div>

            {/* Fault Toggle Button */}
            {currentAta.failureId && (
              <button
                onClick={() => {
                  soundEngine.playSwitchClick();
                  onToggleFailure(currentAta.failureId);
                }}
                style={{
                  width: '100%',
                  padding: '9px',
                  borderRadius: '8px',
                  border: isAtaFailed ? '1px solid #ef4444' : '1px solid rgba(56,189,248,0.3)',
                  background: isAtaFailed ? 'rgba(239,68,68,0.2)' : 'rgba(0,242,254,0.1)',
                  color: isAtaFailed ? '#fca5a5' : 'var(--neon-cyan)',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {isAtaFailed ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                <span>{isAtaFailed ? 'RESOLVE / RESTORE SYSTEM' : 'INJECT MEL DEFECT'}</span>
              </button>
            )}

            {/* Subsystem checklist from real Sanity MEL item */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(56,189,248,0.1)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                <span style={{ color: 'var(--text-muted)' }}>MEL ITEM CODE:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', fontWeight: 700 }}>
                  {activeMelDoc?.itemCode || '21-50-01'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                <span style={{ color: 'var(--text-muted)' }}>REPAIR INTERVAL:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#f59e0b', fontWeight: 700 }}>
                  CAT {activeMelDoc?.repairCategory || 'C'} ({activeMelDoc?.repairIntervalDays || '10 Days'})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                <span style={{ color: 'var(--text-muted)' }}>SERVICEABLE REQUIRED:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 700 }}>
                  {activeMelDoc ? `${activeMelDoc.requiredQty} / ${activeMelDoc.installedQty} INSTALLED` : '1 / 2 SERVICEABLE'}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: '1.4', marginTop: '4px', fontStyle: 'italic' }}>
                "{activeMelDoc?.dispatchConditions || 'Standard flight ops briefing mandated.'}"
              </div>
            </div>
          </div>

          {/* Real-time System Status Waveform */}
          <div style={{ borderTop: '1px solid rgba(56,189,248,0.1)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={12} color="var(--neon-cyan)" />
                <span>TELEMETRY BUS WAVEFORM</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', color: isAtaFailed ? '#ef4444' : '#10b981' }}>
                {isAtaFailed ? 'ERR 404 DEGRADED' : '400 Hz SYNCHRONIZED'}
              </span>
            </div>
            <svg viewBox="0 0 200 36" fill="none" style={{ width: '100%', height: '36px' }}>
              <path
                d={isAtaFailed 
                  ? "M 0 18 L 40 18 L 45 4 L 55 32 L 65 18 L 120 18 L 125 6 L 135 30 L 145 18 L 200 18"
                  : "M 0 18 Q 25 2, 50 18 T 100 18 T 150 18 T 200 18"}
                stroke={isAtaFailed ? '#ef4444' : 'var(--neon-cyan)'}
                strokeWidth="1.8"
                fill="none"
              />
            </svg>
          </div>
        </div>

      </div>

    </div>
  );
}
