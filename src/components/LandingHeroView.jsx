import React, { useState } from 'react';
import { ArrowRight, Plane, ShieldCheck, Database, Scale, Cpu, Sparkles, Compass, Radio, Activity } from 'lucide-react';
import { soundEngine } from '../sound/avionicsAudio';

export default function LandingHeroView({ onEnterCockpit, onSelectView }) {
  const [hoveredBadge, setHoveredBadge] = useState(null);

  return (
    <div style={{
      minHeight: '86vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '24px',
      border: '1px solid rgba(56, 189, 248, 0.22)',
      background: '#01040a',
      padding: '36px 32px 24px',
      boxShadow: '0 30px 80px -20px rgba(0,0,0,0.95), inset 0 0 100px rgba(0,242,254,0.04)'
    }}>
      
      {/* Top Meta Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(0, 242, 254, 0.15)',
            border: '1px solid var(--neon-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.35)'
          }}>
            <Plane size={16} color="var(--neon-cyan)" />
          </div>
          <span style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: '#fff'
          }}>
            AEROPROOF // EFB
          </span>
        </div>

        {/* Center Pill Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(6, 16, 32, 0.85)',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          padding: '6px 16px',
          borderRadius: '9999px',
          boxShadow: '0 0 25px rgba(0, 242, 254, 0.2)'
        }}>
          <Sparkles size={13} color="var(--neon-cyan)" />
          <span style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'var(--neon-cyan)'
          }}>
            SANITY CONTEXT MCP • STATUTORY AIRWORTHINESS ENGINE
          </span>
        </div>

        <div style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span>SYSTEM DISPATCH READY</span>
        </div>
      </div>

      {/* Central 3D Aircraft & Volumetric HUD Stage */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px 0',
        minHeight: '440px'
      }}>
        
        {/* Concentric Rotating HUD Rings behind jet */}
        <div style={{
          position: 'absolute',
          width: '540px',
          height: '540px',
          pointerEvents: 'none',
          opacity: 0.6,
          zIndex: 1
        }}>
          <svg className="rotate-ring-forward" viewBox="0 0 500 500" style={{ width: '100%', height: '100%' }}>
            <circle cx="250" cy="250" r="230" fill="none" stroke="rgba(0, 242, 254, 0.2)" strokeWidth="1.5" strokeDasharray="6 14" />
            <circle cx="250" cy="250" r="180" fill="none" stroke="rgba(0, 242, 254, 0.15)" strokeWidth="1" strokeDasharray="40 25 10 25" />
          </svg>
          <svg className="rotate-ring-reverse" viewBox="0 0 500 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <circle cx="250" cy="250" r="205" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.5" strokeDasharray="80 60" />
            <circle cx="250" cy="250" r="140" fill="none" stroke="rgba(0, 242, 254, 0.12)" strokeWidth="1" strokeDasharray="4 8" />
          </svg>
        </div>

        {/* 3D Photorealistic Boeing 737 Aircraft Render */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '840px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'transform 0.4s ease'
        }}>
          <img
            src="/assets/3d/hero_jet_clean.png"
            alt="Boeing 737-800 3D Model"
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 35px rgba(0, 242, 254, 0.35)) contrast(1.1) brightness(1.05)'
            }}
          />

          {/* Interactive Glowing Telemetry Pins over the Jet */}
          {/* Pin 1: Cockpit Avionics */}
          <div
            onClick={() => {
              soundEngine.playSwitchClick();
              onSelectView ? onSelectView('cockpit') : onEnterCockpit();
            }}
            title="Click to inspect Cockpit Avionics & ADIRU"
            style={{
              position: 'absolute',
              top: '46%',
              left: '18%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 4,
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.08)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
          >
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--neon-cyan)',
              boxShadow: '0 0 14px var(--neon-cyan), 0 0 28px var(--neon-cyan)'
            }} />
            <div style={{
              background: 'rgba(0, 0, 0, 0.85)',
              border: '1px solid rgba(0, 242, 254, 0.5)',
              borderRadius: '6px',
              padding: '4px 8px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.9)'
            }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', fontWeight: 700 }}>
                AVIONICS BAY // RVSM OK
              </div>
              <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ATA 34 DUAL ADIRU ↗
              </div>
            </div>
          </div>

          {/* Pin 2: CFM56 Turbofan Engine */}
          <div
            onClick={() => {
              soundEngine.playSwitchClick();
              onSelectView ? onSelectView('systems') : onEnterCockpit();
            }}
            title="Click to inspect CFM56 Turbofan in Systems Visualizer"
            style={{
              position: 'absolute',
              bottom: '22%',
              left: '52%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 4,
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.08)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
          >
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 14px #10b981, 0 0 28px #10b981'
            }} />
            <div style={{
              background: 'rgba(0, 0, 0, 0.85)',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              borderRadius: '6px',
              padding: '4px 8px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.9)'
            }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 700 }}>
                TURBOFAN CFM56-7B
              </div>
              <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ATA 21 / 24 BUS ONLINE ↗
              </div>
            </div>
          </div>

          {/* Pin 3: Wingtip & Fuel Tanks */}
          <div
            onClick={() => {
              soundEngine.playSwitchClick();
              onSelectView ? onSelectView('systems') : onEnterCockpit();
            }}
            title="Click to inspect Fuel & Wing Systems"
            style={{
              position: 'absolute',
              bottom: '26%',
              right: '8%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 4,
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.08)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
          >
            <div style={{
              background: 'rgba(0, 0, 0, 0.85)',
              border: '1px solid rgba(0, 242, 254, 0.5)',
              borderRadius: '6px',
              padding: '4px 8px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.9)',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', fontWeight: 700 }}>
                BLENDED WINGLET
              </div>
              <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                FUEL JETTISON / AUTO ↗
              </div>
            </div>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--neon-cyan)',
              boxShadow: '0 0 14px var(--neon-cyan), 0 0 28px var(--neon-cyan)'
            }} />
          </div>
        </div>

        {/* Hero Title & Call to Action overlay */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          marginTop: '-15px'
        }}>
          {/* Massive Neon Title */}
          <h1 style={{
            fontFamily: 'var(--font-hud)',
            fontSize: 'clamp(54px, 7.5vw, 92px)',
            fontWeight: 900,
            letterSpacing: '0.08em',
            lineHeight: '1',
            marginBottom: '32px',
            color: '#10b981',
            textShadow: '0 0 35px rgba(16, 185, 129, 0.8), 0 0 75px rgba(16, 185, 129, 0.4), 0 0 120px rgba(0, 242, 254, 0.3)'
          }}>
            DISPATCH READY
          </h1>

          {/* Big Neon Pill Button: ENTER COCKPIT -> */}
          <div>
            <button
              onClick={() => {
                soundEngine.playSwitchClick();
                onEnterCockpit();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                fontFamily: 'var(--font-hud)',
                fontSize: '18px',
                fontWeight: 800,
                letterSpacing: '0.14em',
                color: '#00f2fe',
                background: 'rgba(0, 242, 254, 0.12)',
                border: '2px solid #00f2fe',
                borderRadius: '9999px',
                padding: '16px 48px',
                cursor: 'pointer',
                boxShadow: '0 0 40px rgba(0, 242, 254, 0.5), inset 0 0 25px rgba(0, 242, 254, 0.25)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 60px rgba(0, 242, 254, 0.8), inset 0 0 35px rgba(0, 242, 254, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 242, 254, 0.5), inset 0 0 25px rgba(0, 242, 254, 0.25)';
              }}
            >
              <span>ENTER COCKPIT</span>
              <ArrowRight size={22} />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Feature Badges Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        paddingTop: '18px',
        borderTop: '1px solid rgba(56, 189, 248, 0.14)',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plane size={15} color="var(--neon-cyan)" />
          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>AEROPROOF v2.6.4 // FLIGHT DISPATCH</span>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <span style={{ color: '#94a3b8' }}>14 CFR § 121.628 COMPLIANT</span>
          <span style={{ color: '#94a3b8' }}>FAA MMEL VS AD ARBITRATION</span>
          <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>SANITY CONTEXT LAKE ACTIVE</span>
        </div>
      </div>

    </div>
  );
}
