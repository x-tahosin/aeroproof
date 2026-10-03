import React from 'react';
import { Sliders, RefreshCw, AlertCircle, CheckCircle2, ShieldAlert, Plane, Menu, HelpCircle, Activity, Wind, Compass, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../sound/avionicsAudio';
import { getAssetUrl } from '../utils/assetUrl';

export default function WhatIfSimulatorView({
  aircraft,
  telemetry,
  onChangeTelemetry,
  selectedFailures,
  onToggleFailure,
  dispatchResult
}) {
  const isB738 = aircraft?._id === 'ac-b738';

  // Map failure items according to airframe
  const failureMapping = isB738 ? [
    { label: 'PACK 1 / AIR COND', id: 'mel-21-50-01', code: 'ATA 21', color: '#ef4444' },
    { label: 'IDG 1 ELEC GENERATOR', id: 'mel-24-11-01', code: 'ATA 24', color: '#f59e0b' },
    { label: 'AUTOBRAKE DECEL', id: 'mel-32-42-02', code: 'ATA 32', color: '#ef4444' },
    { label: 'TCAS II COMPUTER', id: 'mel-34-43-01', code: 'ATA 34', color: '#00f2fe' },
    { label: 'APU AUX GENERATOR', id: 'mel-49-11-01', code: 'ATA 49', color: '#f59e0b' }
  ] : [
    { label: 'PACK 1 AIR COND', id: 'mel-21-50-02', code: 'ATA 21', color: '#ef4444' },
    { label: 'ENGINE GEN 1', id: 'mel-24-11-02', code: 'ATA 24', color: '#f59e0b' },
    { label: 'TIRE PRESS TPIS', id: 'mel-32-45-01', code: 'ATA 32', color: '#f59e0b' },
    { label: 'ADIRU 1 CHANNEL', id: 'mel-34-12-01', code: 'ATA 34', color: '#ef4444' },
    { label: 'APU GEN CHANNEL', id: 'mel-49-11-02', code: 'ATA 49', color: '#f59e0b' }
  ];

  const isNoGo = dispatchResult?.verdict === 'STRICT_NO_GO';
  const isConditional = dispatchResult?.verdict === 'CONDITIONAL_GO';
  const isGo = dispatchResult?.verdict === 'LEGAL_GO';

  const riskColor = isNoGo ? '#ef4444' : isConditional ? '#f59e0b' : '#10b981';
  const riskStatus = isNoGo ? 'GROUNDED' : isConditional ? 'RESTRICTED' : 'NOMINAL';
  const riskLevel = isNoGo ? 'CRITICAL' : isConditional ? 'MODERATE' : 'LOW';
  const decisionText = isNoGo ? 'NO-GO' : isConditional ? 'CONDITIONAL' : 'GO';

  const aeroMetrics = dispatchResult?.aeroMetrics || {
    driftDownCeilingFL: isB738 ? 215 : 205,
    factoredLandingDistanceFt: 5250,
    etopsDiversionTimeMin: 180,
    catIIICapable: true
  };

  return (
    <div className="grok-card p-6" style={{ minHeight: '84vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(56,189,248,0.12)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            background: 'rgba(0,242,254,0.15)',
            border: '1px solid var(--neon-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Plane size={14} color="var(--neon-cyan)" />
          </div>
          <span style={{ fontFamily: 'var(--font-hud)', fontSize: '15px', fontWeight: 800, letterSpacing: '0.12em', color: '#fff' }}>
            A E R O P R O O F
          </span>
          <span style={{ fontSize: '10px', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', background: 'rgba(0,242,254,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
            {aircraft?.model || 'Boeing 737-800'}
          </span>
        </div>

        <div style={{
          fontFamily: 'var(--font-hud)',
          fontSize: '18px',
          fontWeight: 800,
          letterSpacing: '0.15em',
          color: '#fff'
        }}>
          WHAT-IF AERODYNAMIC & REGULATORY SIMULATOR
        </div>

        <div style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: riskColor,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: 700
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: riskColor, boxShadow: `0 0 8px ${riskColor}` }} />
          <span>{riskStatus} DISPATCH STATE</span>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '320px 1.4fr 340px',
        gap: '24px',
        alignItems: 'center',
        position: 'relative'
      }}>
        
        {/* Left Column: Glassmorphic Control Panel */}
        <div style={{
          background: 'rgba(5, 12, 26, 0.88)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '18px',
          padding: '22px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: '0 15px 40px -10px rgba(0,0,0,0.8)'
        }}>
          {/* Temperature Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>OUTSIDE AIR TEMP (OAT)</span>
              <span style={{ color: telemetry.oatTemperature >= 30 ? '#ef4444' : 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {telemetry.oatTemperature}°C {telemetry.oatTemperature >= 30 ? '(AD 2024-18-09 THRESHOLD)' : ''}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="45"
              value={telemetry.oatTemperature}
              onChange={(e) => onChangeTelemetry({ ...telemetry, oatTemperature: parseInt(e.target.value, 10) })}
            />
          </div>

          {/* Cruising Altitude Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>CRUISING ALTITUDE</span>
              <span style={{ color: telemetry.cruisingAltitude > 290 ? '#fcd34d' : 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
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

          {/* Runway Condition Category */}
          <div>
            <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
              RUNWAY SURFACE STATE (RCAM)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {['DRY', 'WET', 'CONTAMINATED'].map(rc => (
                <button
                  key={rc}
                  onClick={() => {
                    soundEngine.playSwitchClick();
                    onChangeTelemetry({ ...telemetry, runwayCondition: rc });
                  }}
                  style={{
                    padding: '6px 2px',
                    borderRadius: '8px',
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    border: telemetry.runwayCondition === rc ? '1.5px solid var(--neon-cyan)' : '1px solid rgba(56,189,248,0.14)',
                    background: telemetry.runwayCondition === rc ? 'rgba(0,242,254,0.18)' : 'rgba(2,6,16,0.6)',
                    color: telemetry.runwayCondition === rc ? '#fff' : 'var(--text-dim)',
                    cursor: 'pointer'
                  }}
                >
                  {rc}
                </button>
              ))}
            </div>
          </div>

          {/* Route Sector Type */}
          <div>
            <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
              ROUTE / AIRSPACE SECTOR
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[
                { label: 'DOMESTIC', etops: false, cat3: false },
                { label: 'MOUNTAINOUS', etops: false, cat3: true },
                { label: 'OCEANIC ETOPS', etops: true, cat3: false }
              ].map(rt => {
                const isActive = telemetry.isEtops === rt.etops && telemetry.isCatIII === rt.cat3;
                return (
                  <button
                    key={rt.label}
                    onClick={() => {
                      soundEngine.playSwitchClick();
                      onChangeTelemetry({ ...telemetry, isEtops: rt.etops, isCatIII: rt.cat3 });
                    }}
                    style={{
                      padding: '6px 2px',
                      borderRadius: '8px',
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      border: isActive ? '1.5px solid var(--neon-cyan)' : '1px solid rgba(56,189,248,0.14)',
                      background: isActive ? 'rgba(0,242,254,0.18)' : 'rgba(2,6,16,0.6)',
                      color: isActive ? '#fff' : 'var(--text-dim)',
                      cursor: 'pointer'
                    }}
                  >
                    {rt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle Switches for Real MEL System Failures */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(56,189,248,0.1)', paddingTop: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              INJECT ACTIVE AIRFRAME DEFECTS:
            </span>
            {failureMapping.map(t => {
              const isFailed = selectedFailures.includes(t.id);

              return (
                <div
                  key={t.id}
                  onClick={() => {
                    soundEngine.playSwitchClick();
                    onToggleFailure(t.id);
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: isFailed ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '3px 0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: isFailed ? t.color : 'var(--text-dim)', fontSize: '8px' }}>[{t.code}]</span>
                    <span>{t.label}</span>
                  </div>

                  {/* Pill Switch */}
                  <div style={{
                    width: '32px',
                    height: '16px',
                    borderRadius: '9999px',
                    background: isFailed ? (t.color === '#ef4444' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)') : 'rgba(10,20,38,0.8)',
                    border: `1px solid ${isFailed ? t.color : 'rgba(56,189,248,0.2)'}`,
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: isFailed ? t.color : 'var(--text-muted)',
                      position: 'absolute',
                      top: '2px',
                      left: isFailed ? '18px' : '3px',
                      transition: 'all 0.2s ease',
                      boxShadow: isFailed ? `0 0 8px ${t.color}` : 'none'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: 3D Aircraft with Dynamic Live Avionics Callouts */}
        <div style={{
          position: 'relative',
          height: '460px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'transparent'
        }}>
          {/* 3D Jet Cutout */}
          <img
            src={getAssetUrl('assets/3d/sim_jet_clean.png')}
            alt="3D Holographic Aircraft"
            style={{
              width: '100%',
              maxHeight: '410px',
              objectFit: 'contain',
              filter: `drop-shadow(0 0 35px ${isNoGo ? 'rgba(239,68,68,0.5)' : isConditional ? 'rgba(245,158,11,0.4)' : 'rgba(0, 242, 254, 0.4)'}) brightness(1.1) contrast(1.15)`,
            }}
          />

          {/* Callout 1: Active Primary Hazard Pin */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '36%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(2, 6, 16, 0.9)',
            border: `1px solid ${riskColor}`,
            borderRadius: '8px',
            padding: '6px 10px',
            backdropFilter: 'blur(8px)',
            boxShadow: `0 0 15px ${riskColor}40`,
            zIndex: 10
          }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-hud)', fontWeight: 800, color: riskColor }}>
              {isNoGo ? 'STATUTORY CONFLICT' : isConditional ? 'RELIEF ACTIVE' : 'AIRFRAME NOMINAL'}
            </div>
            <div style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
              {dispatchResult?.primaryClash ? dispatchResult.primaryClash.headline : 'All airworthiness limits observed'}
            </div>
          </div>

          {/* Callout 2: Computed Aeronautical Physics Telemetry */}
          <div style={{
            position: 'absolute',
            bottom: '18%',
            right: '20%',
            transform: 'translate(50%, 50%)',
            background: 'rgba(2, 6, 16, 0.92)',
            border: '1px solid var(--neon-cyan)',
            borderRadius: '10px',
            padding: '8px 12px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 20px rgba(0,242,254,0.25)',
            zIndex: 10
          }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-hud)', fontWeight: 800, color: 'var(--neon-cyan)', marginBottom: '4px' }}>
              AERONAUTICAL PERFORMANCE
            </div>
            <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#cbd5e1', lineHeight: '1.5' }}>
              • Drift-Down Ceiling: <strong style={{ color: '#fff' }}>FL{aeroMetrics.driftDownCeilingFL}</strong><br />
              • Required Runway: <strong style={{ color: aeroMetrics.factoredLandingDistanceFt > 7500 ? '#ef4444' : '#10b981' }}>{aeroMetrics.factoredLandingDistanceFt} ft</strong><br />
              • ETOPS Diversion: <strong style={{ color: aeroMetrics.etopsDiversionTimeMin < 120 ? '#ef4444' : '#10b981' }}>{aeroMetrics.etopsDiversionTimeMin} MIN</strong><br />
              • Approach Minimums: <strong style={{ color: aeroMetrics.catIIICapable ? '#10b981' : '#f59e0b' }}>{aeroMetrics.catIIICapable ? 'CAT III (50ft DH)' : 'DOWNGRADED CAT I'}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Massive Circular LIVE DECISION HUD Orb */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Top Arc Text */}
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-hud)',
            letterSpacing: '0.14em',
            color: riskColor,
            fontWeight: 800,
            marginBottom: '12px'
          }}>
            {isNoGo ? 'GROUNDING ENFORCED' : isConditional ? 'CONDITIONAL AUTHORIZED' : 'CLEARED FOR DEPARTURE'}
          </div>

          {/* Massive Circular Decision Orb */}
          <div style={{
            position: 'relative',
            width: '280px',
            height: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Outer Concentric Rotating Glowing Rings */}
            <svg
              className="rotate-ring-forward"
              viewBox="0 0 300 300"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              <circle
                cx="150"
                cy="150"
                r="135"
                fill="none"
                stroke={riskColor}
                strokeWidth="2.5"
                strokeDasharray="40 25 15 25"
                style={{ filter: `drop-shadow(0 0 12px ${riskColor})` }}
              />
              <circle
                cx="150"
                cy="150"
                r="120"
                fill="none"
                stroke={riskColor}
                strokeWidth="1.5"
                strokeDasharray="8 12"
                opacity="0.6"
              />
            </svg>

            {/* Inner Counter-Rotating Rings */}
            <svg
              className="rotate-ring-reverse"
              viewBox="0 0 300 300"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              <circle
                cx="150"
                cy="150"
                r="105"
                fill="none"
                stroke={riskColor}
                strokeWidth="3"
                strokeDasharray="90 50"
                style={{ filter: `drop-shadow(0 0 16px ${riskColor})` }}
              />
            </svg>

            {/* Volumetric Center Glowing Disc */}
            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${riskColor} 0%, rgba(2,6,16,0.85) 75%)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 45px ${riskColor}80, inset 0 0 30px rgba(255,255,255,0.2)`,
              border: `2px solid ${riskColor}`,
              zIndex: 10,
              textAlign: 'center',
              padding: '12px'
            }}>
              <div style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '26px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                lineHeight: '1.1',
                color: '#fff',
                textShadow: '0 0 20px #000, 0 0 10px #000'
              }}>
                {decisionText}
              </div>
              <div style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                color: '#fff',
                fontWeight: 700,
                marginTop: '4px',
                letterSpacing: '0.04em'
              }}>
                {isNoGo ? '14 CFR § 39.7 LOCK' : isConditional ? 'RELIEF GRANTED' : 'ALL CLEAR'}
              </div>
            </div>
          </div>

          {/* Bottom Flight Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '260px',
            marginTop: '16px',
            fontSize: '9px',
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)' }}>STATUS:</div>
              <div style={{ color: riskColor, fontWeight: 700 }}>{riskStatus}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)' }}>RISK LEVEL:</div>
              <div style={{ color: riskColor, fontWeight: 700 }}>{riskLevel}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)' }}>AUTHORIZED FL:</div>
              <div style={{ color: '#fff', fontWeight: 700 }}>
                {dispatchResult?.ceilingCapFL > 0 ? `FL${dispatchResult.ceilingCapFL}` : 'GROUNDED'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Real-Time Sanity Context MCP Simulation Pipeline Bar */}
      <div style={{
        marginTop: '16px',
        padding: '10px 16px',
        borderRadius: '10px',
        background: 'rgba(2, 6, 18, 0.85)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '10px',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} className="pulse-glow" />
          <span style={{ color: '#fff', fontWeight: 700 }}>SANITY CONTEXT MCP STREAM:</span>
          <span style={{ color: 'var(--neon-cyan)' }}>
            sanity_context_evaluate_contradictions({`failures: ${selectedFailures.length}, oat: ${telemetry.oatTemperature}°C, alt: FL${telemetry.cruisingAltitude}`})
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)' }}>
          <span>TRANSPORT: <strong style={{ color: '#10b981' }}>SSE / MCP v1.0</strong></span>
          <span>LATENCY: <strong style={{ color: 'var(--neon-cyan)' }}>14ms</strong></span>
          <span>GRAPH: <strong style={{ color: '#fff' }}>2-HOP DEREFERENCED</strong></span>
        </div>
      </div>

    </div>
  );
}
