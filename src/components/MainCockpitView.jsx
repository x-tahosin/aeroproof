import React from 'react';
import {
  Thermometer, Mountain, CloudRain, Compass, Eye, AlertTriangle, ShieldCheck, ShieldAlert,
  Snowflake, Fan, Target, Activity, Droplets, ArrowRight, Zap, RefreshCw, Layers
} from 'lucide-react';
import { soundEngine } from '../sound/avionicsAudio';
import { getAssetUrl } from '../utils/assetUrl';

import { INITIAL_AIRCRAFT_TYPES, INITIAL_MEL_ITEMS } from '../sanity/dataset/initialData';
import { sanityService } from '../sanity/client';

export default function MainCockpitView({
  aircraft,
  onSelectAircraft,
  telemetry,
  onChangeTelemetry,
  selectedFailures,
  onToggleFailure,
  dispatchResult,
  onOpenSignoffModal
}) {
  const [latestMcpLog, setLatestMcpLog] = React.useState(sanityService.getLatestToolCall());

  React.useEffect(() => {
    const unsub = sanityService.subscribeTrace((log) => {
      setLatestMcpLog(log);
    });
    return () => unsub();
  }, []);

  const isNoGo = dispatchResult?.verdict === 'STRICT_NO_GO';
  const isConditional = dispatchResult?.verdict === 'CONDITIONAL_GO';
  const isGo = dispatchResult?.verdict === 'LEGAL_GO';

  const statusColor = isNoGo ? '#ef4444' : isConditional ? '#f59e0b' : '#10b981';
  const statusLabel = isNoGo ? 'NO-GO' : isConditional ? 'CONDITIONAL' : 'DISPATCH';
  const statusSub = isNoGo ? 'SAFETY LIMITS EXCEEDED' : isConditional ? 'SYSTEMS NOMINAL WITH RELIEF' : 'ALL SYSTEMS NOMINAL';

  const isB738 = aircraft._id === 'ac-b738';

  // Map 6 quick selector buttons dynamically to current aircraft MEL items
  const quickSystems = isB738 ? [
    { id: 'mel-21-50-01', code: 'PACK 1 INOP', icon: Snowflake, dotColor: '#ef4444' },
    { id: 'mel-49-11-01', code: 'APU INOP', icon: Fan, dotColor: '#ef4444' },
    { id: 'mel-34-43-01', code: 'TCAS FAIL', icon: Target, dotColor: '#f59e0b' },
    { id: 'mel-24-11-01', code: 'IDG 1 DEGRADED', icon: Zap, dotColor: '#f59e0b' },
    { id: 'mel-32-42-02', code: 'AUTOBRAKE INOP', icon: Activity, dotColor: '#ef4444' },
    { id: 'mel-34-12-01', code: 'ADIRU 1 FAULT', icon: Droplets, dotColor: '#f59e0b' }
  ] : [
    { id: 'mel-21-50-02', code: 'PACK 1 INOP', icon: Snowflake, dotColor: '#ef4444' },
    { id: 'mel-49-11-02', code: 'APU GEN INOP', icon: Fan, dotColor: '#ef4444' },
    { id: 'mel-34-43-01', code: 'TCAS FAIL', icon: Target, dotColor: '#f59e0b' },
    { id: 'mel-24-11-02', code: 'GEN 1 FAULT', icon: Zap, dotColor: '#f59e0b' },
    { id: 'mel-32-45-01', code: 'TPIS DEFERRED', icon: Activity, dotColor: '#f59e0b' },
    { id: 'mel-34-12-01', code: 'ADIRU 1 FAULT', icon: Droplets, dotColor: '#ef4444' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ============================================================== */}
      {/* 2. MAIN DISPATCH COCKPIT — TOP SECTION (Status & Aircraft)    */}
      {/* ============================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(280px, 1fr) minmax(320px, 1fr)',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        
        {/* Left Card: 3D Aircraft Card with glowing callouts */}
        <div className="grok-card p-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              {/* Aircraft Selector Pills */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {INITIAL_AIRCRAFT_TYPES.map(ac => (
                  <button
                    key={ac._id}
                    onClick={() => {
                      soundEngine.playSwitchClick();
                      onSelectAircraft && onSelectAircraft(ac);
                    }}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      border: aircraft._id === ac._id ? '1px solid var(--neon-cyan)' : '1px solid rgba(56,189,248,0.15)',
                      background: aircraft._id === ac._id ? 'rgba(0,242,254,0.18)' : 'rgba(2,6,16,0.6)',
                      color: aircraft._id === ac._id ? '#fff' : 'var(--text-dim)',
                      cursor: 'pointer'
                    }}
                  >
                    {ac.icaoCode}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '10px', color: '#10b981', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {aircraft.model.toUpperCase()}
              </span>
            </div>

            {/* Photorealistic 3D Airliner Viewport with Glowing Dynamic Hotspots */}
            <div style={{
              position: 'relative',
              height: '190px',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#01040a',
              border: '1px solid rgba(56, 189, 248, 0.2)'
            }}>
              <img
                src={getAssetUrl('assets/3d/cockpit_jet_clean.png')}
                alt="Aircraft Avionics Telemetry"
                style={{
                  width: '94%',
                  height: '94%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 20px rgba(0,242,254,0.35)) contrast(1.1) brightness(1.05)',
                }}
              />

              {/* Scanline overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 242, 254, 0.06) 50%)',
                backgroundSize: '100% 4px',
                pointerEvents: 'none'
              }} />

              {/* Pin 1: Cockpit Avionics / ADIRU */}
              <div
                onClick={() => {
                  soundEngine.playSwitchClick();
                  onToggleFailure('mel-34-43-01');
                }}
                title="Click to toggle TCAS / Avionics failure"
                style={{
                  position: 'absolute',
                  top: '52%',
                  left: '16%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: selectedFailures.includes('mel-34-43-01') ? '#ef4444' : 'var(--neon-cyan)',
                  boxShadow: selectedFailures.includes('mel-34-43-01') ? '0 0 10px #ef4444' : '0 0 10px var(--neon-cyan)'
                }} />
                <span style={{
                  fontSize: '8px',
                  fontFamily: 'var(--font-mono)',
                  color: selectedFailures.includes('mel-34-43-01') ? '#ef4444' : 'var(--neon-cyan)',
                  background: 'rgba(2,6,16,0.85)',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  marginTop: '2px',
                  border: '1px solid rgba(56,189,248,0.2)'
                }}>
                  AVIONICS
                </span>
              </div>

              {/* Pin 2: Engine Turbofan & Pack */}
              <div
                onClick={() => {
                  soundEngine.playSwitchClick();
                  onToggleFailure(isB738 ? 'mel-21-50-01' : 'mel-21-50-02');
                }}
                title="Click to toggle Pack 1 Air Conditioning failure"
                style={{
                  position: 'absolute',
                  bottom: '24%',
                  left: '48%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: selectedFailures.includes(isB738 ? 'mel-21-50-01' : 'mel-21-50-02') || selectedFailures.includes(isB738 ? 'mel-24-11-01' : 'mel-24-11-02') ? '#ef4444' : '#10b981',
                  boxShadow: selectedFailures.includes(isB738 ? 'mel-21-50-01' : 'mel-21-50-02') || selectedFailures.includes(isB738 ? 'mel-24-11-01' : 'mel-24-11-02') ? '0 0 10px #ef4444' : '0 0 10px #10b981'
                }} />
                <span style={{
                  fontSize: '8px',
                  fontFamily: 'var(--font-mono)',
                  color: selectedFailures.includes(isB738 ? 'mel-21-50-01' : 'mel-21-50-02') || selectedFailures.includes(isB738 ? 'mel-24-11-01' : 'mel-24-11-02') ? '#ef4444' : '#10b981',
                  background: 'rgba(2,6,16,0.85)',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  marginTop: '2px',
                  border: '1px solid rgba(56,189,248,0.2)'
                }}>
                  ENG/PACK
                </span>
              </div>

              {/* Pin 3: APU Tail */}
              <div
                onClick={() => {
                  soundEngine.playSwitchClick();
                  onToggleFailure(isB738 ? 'mel-49-11-01' : 'mel-49-11-02');
                }}
                title="Click to toggle APU failure"
                style={{
                  position: 'absolute',
                  top: '32%',
                  right: '12%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: selectedFailures.includes(isB738 ? 'mel-49-11-01' : 'mel-49-11-02') ? '#ef4444' : '#10b981',
                  boxShadow: selectedFailures.includes(isB738 ? 'mel-49-11-01' : 'mel-49-11-02') ? '0 0 10px #ef4444' : '0 0 10px #10b981'
                }} />
                <span style={{
                  fontSize: '8px',
                  fontFamily: 'var(--font-mono)',
                  color: selectedFailures.includes(isB738 ? 'mel-49-11-01' : 'mel-49-11-02') ? '#ef4444' : '#10b981',
                  background: 'rgba(2,6,16,0.85)',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  marginTop: '2px',
                  border: '1px solid rgba(56,189,248,0.2)'
                }}>
                  APU
                </span>
              </div>
            </div>
          </div>

          {/* Subsystem status pills (Interactive Quick Toggles) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '10px' }}>
            <div
              onClick={() => {
                soundEngine.playSwitchClick();
                onToggleFailure(isB738 ? 'mel-21-50-01' : 'mel-21-50-02');
              }}
              title="Click to toggle Pack 1"
              style={{
                background: 'rgba(2,6,16,0.6)',
                border: selectedFailures.includes(isB738 ? 'mel-21-50-01' : 'mel-21-50-02') ? '1px solid #ef4444' : '1px solid rgba(56,189,248,0.15)',
                borderRadius: '8px',
                padding: '6px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>PACK 1</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: selectedFailures.includes(isB738 ? 'mel-21-50-01' : 'mel-21-50-02') ? '#ef4444' : '#10b981' }}>
                {selectedFailures.includes(isB738 ? 'mel-21-50-01' : 'mel-21-50-02') ? 'INOP' : 'NORMAL'}
              </div>
            </div>
            <div
              onClick={() => {
                soundEngine.playSwitchClick();
                onToggleFailure(isB738 ? 'mel-49-11-01' : 'mel-49-11-02');
              }}
              title="Click to toggle APU"
              style={{
                background: 'rgba(2,6,16,0.6)',
                border: selectedFailures.includes(isB738 ? 'mel-49-11-01' : 'mel-49-11-02') ? '1px solid #ef4444' : '1px solid rgba(56,189,248,0.15)',
                borderRadius: '8px',
                padding: '6px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>APU</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: selectedFailures.includes(isB738 ? 'mel-49-11-01' : 'mel-49-11-02') ? '#ef4444' : '#10b981' }}>
                {selectedFailures.includes(isB738 ? 'mel-49-11-01' : 'mel-49-11-02') ? 'INOP' : 'ONLINE'}
              </div>
            </div>
            <div
              onClick={() => {
                soundEngine.playSwitchClick();
                onToggleFailure(isB738 ? 'mel-24-11-01' : 'mel-24-11-02');
              }}
              title="Click to toggle Generator / IDG"
              style={{
                background: 'rgba(2,6,16,0.6)',
                border: selectedFailures.includes(isB738 ? 'mel-24-11-01' : 'mel-24-11-02') ? '1px solid #ef4444' : '1px solid rgba(56,189,248,0.15)',
                borderRadius: '8px',
                padding: '6px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>IDG BUS</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: selectedFailures.includes(isB738 ? 'mel-24-11-01' : 'mel-24-11-02') ? '#ef4444' : '#10b981' }}>
                {selectedFailures.includes(isB738 ? 'mel-24-11-01' : 'mel-24-11-02') ? 'DEGRADED' : 'STABLE'}
              </div>
            </div>
          </div>
        </div>

        {/* Center Card: Massive Glowing Circular Decision Ring */}
        <div className="grok-card p-5" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Animated Glowing Ring Container */}
          <div style={{
            position: 'relative',
            width: '230px',
            height: '230px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Outer Rotating Dotted Ring */}
            <svg
              className="rotate-ring-forward"
              viewBox="0 0 240 240"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              <circle
                cx="120"
                cy="120"
                r="105"
                fill="none"
                stroke={statusColor}
                strokeWidth="2"
                strokeDasharray="8 12"
                opacity="0.45"
              />
            </svg>

            {/* Inner Counter-Rotating Arc Ring */}
            <svg
              className="rotate-ring-reverse"
              viewBox="0 0 240 240"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              <circle
                cx="120"
                cy="120"
                r="90"
                fill="none"
                stroke={statusColor}
                strokeWidth="3"
                strokeDasharray="60 40"
                opacity="0.8"
                style={{ filter: `drop-shadow(0 0 10px ${statusColor})` }}
              />
            </svg>

            {/* Inner Content */}
            <div style={{ textAlign: 'center', zIndex: 10, padding: '10px' }}>
              <div style={{
                fontSize: '11px',
                fontFamily: 'var(--font-hud)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: statusColor,
                opacity: 0.9,
                marginBottom: '2px'
              }}>
                {statusLabel}
              </div>
              <div style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '44px',
                fontWeight: 900,
                letterSpacing: '0.04em',
                lineHeight: '1',
                color: '#fff',
                textShadow: `0 0 25px ${statusColor}`
              }}>
                {isNoGo ? 'NO-GO' : 'GO'}
              </div>
              <div style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                marginTop: '6px',
                maxWidth: '120px'
              }}>
                {statusSub}
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: LIVE INPUTS • REAL-TIME */}
        <div className="grok-card p-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingTop: '2px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', color: 'var(--neon-cyan)', letterSpacing: '0.08em', fontWeight: 700, lineHeight: 1.4 }}>
                LIVE INPUTS • REAL-TIME
              </span>
              <RefreshCw size={13} color="var(--neon-cyan)" style={{ cursor: 'pointer' }} />
            </div>

            {/* Temperature Slider & Live Graph */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TEMPERATURE</span>
                <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: telemetry.oatTemperature >= 30 ? '#ef4444' : 'var(--neon-cyan)' }}>
                  {telemetry.oatTemperature}°C
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="48"
                value={telemetry.oatTemperature}
                onChange={(e) => onChangeTelemetry({ ...telemetry, oatTemperature: parseInt(e.target.value, 10) })}
              />
            </div>

            {/* Cruising Altitude */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>CRUISING ALTITUDE</span>
                <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--neon-cyan)' }}>
                  FL{telemetry.cruisingAltitude} ({telemetry.cruisingAltitude * 100} ft)
                </span>
              </div>
              <input
                type="range"
                min="180"
                max="410"
                step="10"
                value={telemetry.cruisingAltitude}
                onChange={(e) => onChangeTelemetry({ ...telemetry, cruisingAltitude: parseInt(e.target.value, 10) })}
              />
            </div>

            {/* Runway Condition */}
            <div style={{ marginBottom: '12px' }}>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>RUNWAY CATEGORY</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['DRY', 'WET', 'CONTAMINATED'].map(rc => (
                  <button
                    key={rc}
                    onClick={() => {
                      soundEngine.playSwitchClick();
                      onChangeTelemetry({ ...telemetry, runwayCondition: rc });
                    }}
                    style={{
                      flex: 1,
                      padding: '5px',
                      borderRadius: '6px',
                      border: telemetry.runwayCondition === rc ? '1px solid var(--neon-cyan)' : '1px solid rgba(56,189,248,0.12)',
                      background: telemetry.runwayCondition === rc ? 'rgba(0,242,254,0.15)' : 'rgba(2,6,16,0.6)',
                      color: telemetry.runwayCondition === rc ? '#fff' : 'var(--text-dim)',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer'
                    }}
                  >
                    {rc}
                  </button>
                ))}
              </div>
            </div>

            {/* Route Type */}
            <div>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>ROUTE SECTOR</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { label: 'DOMESTIC', etops: false, cat3: false },
                  { label: 'MOUNTAINOUS', etops: false, cat3: true },
                  { label: 'OCEANIC ETOPS', etops: true, cat3: false }
                ].map(r => {
                  const isActive = telemetry.isEtops === r.etops && telemetry.isCatIII === r.cat3;
                  return (
                    <button
                      key={r.label}
                      onClick={() => {
                        soundEngine.playSwitchClick();
                        onChangeTelemetry({ ...telemetry, isEtops: r.etops, isCatIII: r.cat3 });
                      }}
                      style={{
                        flex: 1,
                        padding: '5px',
                        borderRadius: '6px',
                        border: isActive ? '1px solid var(--neon-cyan)' : '1px solid rgba(56,189,248,0.12)',
                        background: isActive ? 'rgba(0,242,254,0.15)' : 'rgba(2,6,16,0.6)',
                        color: isActive ? '#fff' : 'var(--text-dim)',
                        fontSize: '9px',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer'
                      }}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Top Section Footer Bar */}
      <div style={{
        background: 'rgba(3,7,18,0.7)',
        border: '1px solid rgba(56,189,248,0.12)',
        borderRadius: '10px',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)'
      }}>
        <div>EFB MODE: <span style={{ color: '#fff' }}>FLIGHT PREPARATION</span></div>
        <div>DATA SOURCE: <span style={{ color: '#10b981' }}>AIRCRAFT SYSTEMS (CONNECTED)</span></div>
        <div>VALIDATION: <span style={{ color: '#10b981' }}>AUTO (14 CFR § 121.628)</span></div>
        <div>LAST UPDATE: <span style={{ color: 'var(--neon-cyan)' }}>18:42:31 UTC</span></div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN DISPATCH COCKPIT — BOTTOM SECTION (Controls & Conflicts)*/}
      {/* ============================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(420px, 1.8fr) minmax(300px, 1fr)',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        
        {/* Left Side: Systems Integrity Selector & Active Conflicts Box */}
        <div className="grok-card p-5" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* SYSTEMS INTEGRITY SELECTOR //// */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', paddingTop: '2px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', letterSpacing: '0.1em', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                SYSTEMS INTEGRITY SELECTOR ////
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '8px'
            }}>
              {quickSystems.map(sys => {
                const Icon = sys.icon;
                const isFailed = selectedFailures.includes(sys.id);

                return (
                  <div
                    key={sys.id}
                    id={`quick-sys-${sys.id}`}
                    onClick={() => {
                      soundEngine.playSwitchClick();
                      onToggleFailure(sys.id);
                    }}
                    style={{
                      background: isFailed ? 'rgba(239, 68, 68, 0.2)' : 'rgba(5, 12, 24, 0.65)',
                      border: isFailed ? '1px solid #ef4444' : '1px solid rgba(56, 189, 248, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isFailed ? '#ef4444' : sys.dotColor,
                      boxShadow: isFailed ? '0 0 6px #ef4444' : 'none'
                    }} />
                    <Icon size={18} color={isFailed ? '#ef4444' : 'var(--neon-cyan)'} />
                    <span style={{
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: isFailed ? '#fff' : 'var(--text-secondary)',
                      textAlign: 'center'
                    }}>
                      {sys.code}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE CONFLICTS & STATUTORY ARBITRATION BOX */}
          <div style={{
            background: 'rgba(3, 7, 18, 0.8)',
            border: `1px solid ${dispatchResult?.clashes?.length > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(56, 189, 248, 0.15)'}`,
            borderRadius: '12px',
            padding: '14px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', letterSpacing: '0.1em', color: dispatchResult?.clashes?.length > 0 ? '#ef4444' : 'var(--neon-cyan)', fontWeight: 700 }}>
                • {dispatchResult?.clashes?.length > 0 ? 'STATUTORY CONTRADICTION AUDIT' : 'AIRWORTHINESS DIRECTIVE AUDIT'} •
              </span>
              <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {dispatchResult?.clashes?.length > 0 ? `${dispatchResult.clashes.length} LEGAL PRECLUSION(S) ACTIVE` : 'ALL SPECIFICATIONS MET'}
              </span>
            </div>

            {dispatchResult?.clashes?.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 50px 1fr',
                gap: '8px',
                alignItems: 'center'
              }}>
                {/* Constraints (Violations) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#fca5a5', textAlign: 'center', fontWeight: 700 }}>
                    MANDATORY FAA DIRECTIVE (RANK 1)
                  </span>
                  {dispatchResult.clashes.slice(0, 2).map((c, idx) => (
                    <div key={idx} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', padding: '6px 8px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#fca5a5', fontFamily: 'var(--font-hud)' }}>{c.overridingSource}</div>
                      <div style={{ fontSize: '9px', color: '#cbd5e1', lineHeight: '1.3' }}>{c.headline}</div>
                      <div style={{ fontSize: '8px', color: '#ef4444', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{c.triggerCondition}</div>
                    </div>
                  ))}
                </div>

                {/* Glowing Curved SVG Connectors */}
                <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 50 80" fill="none" style={{ width: '100%', height: '100%' }}>
                    <path d="M 5 20 C 25 20, 25 60, 45 60" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 5 60 C 25 60, 25 20, 45 20" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="25" cy="40" r="3" fill="#ef4444" />
                  </svg>
                </div>

                {/* Overruled MMEL */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#fcd34d', textAlign: 'center', fontWeight: 700 }}>
                    OVERRULED MMEL CLAUSE
                  </span>
                  {dispatchResult.clashes.slice(0, 2).map((c, idx) => (
                    <div key={idx} style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '6px 8px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#fcd34d', fontFamily: 'var(--font-hud)' }}>{c.baselineSource}</div>
                      <div style={{ fontSize: '9px', color: '#cbd5e1', lineHeight: '1.3' }}>{c.baselineClaim}</div>
                      <div style={{ fontSize: '8px', color: '#f59e0b', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>RELIEF VOID UNDER 14 CFR § 39.7</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedFailures.length > 0 ? (
              <div style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '11px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fcd34d', fontWeight: 700, fontFamily: 'var(--font-hud)' }}>
                    MMEL DEFERRAL RELIEF AUTHORIZED ({selectedFailures.length} ACTIVE)
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    NO STATUTORY AD CONFLICTS
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {dispatchResult?.requiredOps?.length > 0
                    ? dispatchResult.requiredOps.slice(0, 2).join(' • ')
                    : 'Dispatch permitted subject to crew operational briefing & placarding.'}
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '8px',
                padding: '12px 14px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{ color: '#10b981', fontWeight: 700, fontFamily: 'var(--font-hud)', fontSize: '12px' }}>
                  ALL PRIMARY SYSTEMS NOMINAL // AIRWORTHY
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  14 CFR § 121.628 Clean Dispatch Clearance • Zero Deferrals Recorded
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: DECISION AUTHORITY //// */}
        <div className="grok-card p-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', paddingTop: '2px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', letterSpacing: '0.1em', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                DECISION AUTHORITY ////
              </span>
            </div>

            {/* 3 Decision Authority Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Confirm Go */}
              <button
                onClick={onOpenSignoffModal}
                disabled={isNoGo}
                style={{
                  background: isGo ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.08)',
                  border: isGo ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: isNoGo ? 'not-allowed' : 'pointer',
                  opacity: isNoGo ? 0.4 : 1,
                  boxShadow: isGo ? '0 0 25px rgba(16, 185, 129, 0.4)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={20} color="#10b981" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: 'var(--font-hud)', fontSize: '15px', fontWeight: 800, color: '#10b981', lineHeight: 1.2 }}>
                      CONFIRM GO
                    </div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      ALL RISKS ACCEPTED
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} color="#10b981" />
              </button>

              {/* Conditional */}
              <button
                onClick={onOpenSignoffModal}
                disabled={isNoGo}
                style={{
                  background: isConditional ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.08)',
                  border: isConditional ? '2px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: isNoGo ? 'not-allowed' : 'pointer',
                  opacity: isNoGo ? 0.4 : 1,
                  boxShadow: isConditional ? '0 0 25px rgba(245, 158, 11, 0.4)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertTriangle size={20} color="#f59e0b" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: 'var(--font-hud)', fontSize: '15px', fontWeight: 800, color: '#f59e0b', lineHeight: 1.2 }}>
                      CONDITIONAL
                    </div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      PENDING MITIGATION
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} color="#f59e0b" />
              </button>

              {/* No-Go */}
              <button
                style={{
                  background: isNoGo ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.08)',
                  border: isNoGo ? '2px solid #ef4444' : '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'default',
                  boxShadow: isNoGo ? '0 0 30px rgba(239, 68, 68, 0.5)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldAlert size={20} color="#ef4444" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: 'var(--font-hud)', fontSize: '15px', fontWeight: 800, color: '#ef4444', lineHeight: 1.2 }}>
                      NO-GO
                    </div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      SAFETY LIMITS EXCEEDED
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} color="#ef4444" />
              </button>
            </div>
          </div>

          {/* Real-Time Sanity Context MCP Status Bar */}
          <div style={{
            background: 'rgba(2, 6, 18, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.22)',
            borderRadius: '8px',
            padding: '7px 12px',
            marginTop: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981'
              }} className="pulse-glow" />
              <span style={{ color: 'var(--neon-cyan)', fontWeight: 700 }}>
                {latestMcpLog ? `${latestMcpLog.tool}()` : 'sanity_context_evaluate_contradictions()'}
              </span>
            </div>
            <div>
              LATENCY: <strong style={{ color: '#10b981' }}>{latestMcpLog?.durationMs || 14}ms</strong>
            </div>
            <div>
              GRAPH: <strong style={{ color: 'var(--neon-cyan)' }}>GROQ 2-HOP</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
