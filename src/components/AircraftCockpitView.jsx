import React from 'react';
import { Plane, AlertOctagon, CheckCircle2, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../sound/avionicsAudio';

export default function AircraftCockpitView({
  aircraft,
  selectedFailures,
  melItems,
  onToggleFailure,
  dispatchResult
}) {
  // Check which zones have active failures
  const hasAtaFailure = (ataChapter) => {
    return selectedFailures.some(fId => {
      const item = melItems.find(m => m._id === fId);
      return item && item.itemCode.startsWith(String(ataChapter));
    });
  };

  const hasPackFailure = hasAtaFailure(21);
  const hasElecFailure = hasAtaFailure(24);
  const hasGearFailure = hasAtaFailure(32);
  const hasNavFailure = hasAtaFailure(34);
  const hasBleedFailure = hasAtaFailure(36);
  const hasApuFailure = hasAtaFailure(49);

  const getNodeColor = (hasFail) => {
    if (!hasFail) return '#10b981'; // Green nominal
    if (dispatchResult?.verdict === 'STRICT_NO_GO') return '#ef4444'; // Red fatal
    return '#f59e0b'; // Amber conditional
  };

  return (
    <div className="cockpit-card p-4" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plane size={16} color="var(--hud-cyan)" />
          <span className="font-hud" style={{ fontSize: '13px', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            AIRFRAME SUBSYSTEM TOPOLOGY ({aircraft.icaoCode})
          </span>
        </div>
        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--hud-cyan)' }}>
          {selectedFailures.length} DEFERRED DEFECTS
        </span>
      </div>

      {/* SVG Aircraft Schematic Container */}
      <div style={{
        flex: 1,
        minHeight: '340px',
        position: 'relative',
        background: 'radial-gradient(circle at center, rgba(6,182,212,0.04) 0%, rgba(3,7,18,0.7) 70%)',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Subtle grid lines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(56,189,248,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none'
        }} />

        <svg viewBox="0 0 400 460" style={{ width: '100%', maxHeight: '340px' }} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Radar Sweep Ring */}
          <circle cx="200" cy="230" r="160" stroke="rgba(56,189,248,0.12)" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="200" cy="230" r="90" stroke="rgba(56,189,248,0.1)" strokeWidth="1" />

          {/* Aircraft Silhouette (Top-down Wireframe) */}
          <path
            d="M200 40 
               L208 80 L208 170 
               L360 260 L360 280 
               L208 240 L208 360 
               L260 410 L260 425 
               L200 415 
               L140 425 L140 410 
               L192 360 L192 240 
               L40 280 L40 260 
               L192 170 L192 80 Z"
            fill="rgba(8, 20, 42, 0.6)"
            stroke="rgba(56, 189, 248, 0.35)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Centerline & Wing Spars */}
          <line x1="200" y1="40" x2="200" y2="420" stroke="rgba(56,189,248,0.2)" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="80" y1="250" x2="320" y2="250" stroke="rgba(56,189,248,0.15)" strokeWidth="1" />

          {/* Engines */}
          <rect x="110" y="210" width="22" height="52" rx="6" fill="rgba(6,182,212,0.15)" stroke={getNodeColor(hasBleedFailure || hasElecFailure)} strokeWidth="1.5" />
          <rect x="268" y="210" width="22" height="52" rx="6" fill="rgba(6,182,212,0.15)" stroke={getNodeColor(hasBleedFailure || hasElecFailure)} strokeWidth="1.5" />

          {/* --- INTERACTIVE SUBSYSTEM NODES --- */}

          {/* 1. NOSE: ATA 34 Navigation & Surveillance */}
          <g style={{ cursor: 'pointer' }}>
            <circle cx="200" cy="65" r="14" fill={getNodeColor(hasNavFailure)} fillOpacity="0.25" stroke={getNodeColor(hasNavFailure)} strokeWidth="2" />
            <circle cx="200" cy="65" r="5" fill={getNodeColor(hasNavFailure)} />
            <text x="220" y="70" fill="#cbd5e1" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">ATA 34 (NAV/TCAS)</text>
          </g>

          {/* 2. WING ROOTS: ATA 21 Air Conditioning Packs */}
          <g style={{ cursor: 'pointer' }}>
            <circle cx="160" cy="195" r="13" fill={getNodeColor(hasPackFailure)} fillOpacity="0.25" stroke={getNodeColor(hasPackFailure)} strokeWidth="2" />
            <circle cx="160" cy="195" r="4.5" fill={getNodeColor(hasPackFailure)} />
            
            <circle cx="240" cy="195" r="13" fill={getNodeColor(hasPackFailure)} fillOpacity="0.25" stroke={getNodeColor(hasPackFailure)} strokeWidth="2" />
            <circle cx="240" cy="195" r="4.5" fill={getNodeColor(hasPackFailure)} />
            
            <text x="260" y="200" fill="#cbd5e1" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">ATA 21 (PACKS)</text>
          </g>

          {/* 3. ENGINES: ATA 24 Electrical IDGs & ATA 36 Bleed */}
          <g style={{ cursor: 'pointer' }}>
            <circle cx="121" cy="236" r="12" fill={getNodeColor(hasElecFailure || hasBleedFailure)} fillOpacity="0.25" stroke={getNodeColor(hasElecFailure || hasBleedFailure)} strokeWidth="2" />
            <circle cx="279" cy="236" r="12" fill={getNodeColor(hasElecFailure || hasBleedFailure)} fillOpacity="0.25" stroke={getNodeColor(hasElecFailure || hasBleedFailure)} strokeWidth="2" />
            <text x="30" y="240" fill="#cbd5e1" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">ATA 24/36 (IDG/BLEED)</text>
          </g>

          {/* 4. MAIN GEAR / CENTER: ATA 32 Landing Gear & Autobrake */}
          <g style={{ cursor: 'pointer' }}>
            <circle cx="200" cy="285" r="14" fill={getNodeColor(hasGearFailure)} fillOpacity="0.25" stroke={getNodeColor(hasGearFailure)} strokeWidth="2" />
            <circle cx="200" cy="285" r="5" fill={getNodeColor(hasGearFailure)} />
            <text x="220" y="290" fill="#cbd5e1" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">ATA 32 (GEAR/BRAKES)</text>
          </g>

          {/* 5. TAIL: ATA 49 APU Auxiliary Power Unit */}
          <g style={{ cursor: 'pointer' }}>
            <circle cx="200" cy="405" r="13" fill={getNodeColor(hasApuFailure)} fillOpacity="0.25" stroke={getNodeColor(hasApuFailure)} strokeWidth="2" />
            <circle cx="200" cy="405" r="4.5" fill={getNodeColor(hasApuFailure)} />
            <text x="220" y="410" fill="#cbd5e1" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">ATA 49 (APU)</text>
          </g>
        </svg>

        {/* Status Legend Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          display: 'flex',
          gap: '12px',
          background: 'rgba(3,7,18,0.85)',
          padding: '4px 10px',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span>NOMINAL</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            <span>MMEL DEFERRED</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            <span>AD OVERRULED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
