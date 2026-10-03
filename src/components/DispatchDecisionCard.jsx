import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, ArrowUpRight, CheckCircle2, FileSignature, Lock } from 'lucide-react';
import { soundEngine } from '../sound/avionicsAudio';

export default function DispatchDecisionCard({
  dispatchResult,
  onOpenSignoffModal
}) {
  if (!dispatchResult) return null;

  const {
    verdict,
    statusTitle,
    subText,
    ceilingCapFL,
    color,
    requiredOps,
    requiredMaint,
    confidence
  } = dispatchResult;

  const isGo = verdict === 'LEGAL_GO';
  const isNoGo = verdict === 'STRICT_NO_GO';
  const isConditional = verdict === 'CONDITIONAL_GO';

  const handleSignoffClick = () => {
    soundEngine.playSwitchClick();
    onOpenSignoffModal();
  };

  return (
    <div
      className="cockpit-card p-5"
      style={{
        border: `1.5px solid ${color}`,
        background: `radial-gradient(circle at top right, ${color}12 0%, rgba(6,13,26,0.95) 75%)`,
        boxShadow: `0 0 30px ${color}20`,
        position: 'relative'
      }}
    >
      {/* Top Tag & Confidence */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isGo && <ShieldCheck size={20} color="#10b981" />}
          {isNoGo && <ShieldAlert size={20} color="#ef4444" />}
          {isConditional && <AlertTriangle size={20} color="#f59e0b" />}
          <span className="font-hud" style={{ fontSize: '13px', letterSpacing: '0.1em', color }}>
            DISPATCH CLEARANCE STATUS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
            EVALUATION CONFIDENCE:
          </span>
          <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--hud-cyan)' }}>
            {confidence}%
          </span>
        </div>
      </div>

      {/* Main Massive Status Banner */}
      <div style={{
        background: `${color}15`,
        border: `1px solid ${color}40`,
        borderRadius: '10px',
        padding: '16px 20px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2
            className="font-hud"
            style={{
              fontSize: '24px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color,
              lineHeight: '1.2'
            }}
          >
            {statusTitle}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '4px', opacity: 0.9 }}>
            {subText}
          </p>
        </div>

        {/* Ceiling Cap Gauge */}
        <div style={{
          background: 'rgba(3,7,18,0.7)',
          border: '1px solid var(--border-subtle)',
          padding: '8px 16px',
          borderRadius: '8px',
          textAlign: 'right'
        }}>
          <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            AIRWORTHINESS CEILING
          </span>
          <span className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: isNoGo ? '#ef4444' : 'var(--hud-cyan)' }}>
            {ceilingCapFL > 0 ? `FL${ceilingCapFL}` : 'GROUNDED'}
          </span>
          {ceilingCapFL > 0 && (
            <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ({ceilingCapFL * 100} ft MSL)
            </span>
          )}
        </div>
      </div>

      {/* Required Operational & Maintenance Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
        
        {/* Operational Procedures (O) */}
        <div style={{ background: 'rgba(3,7,18,0.5)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span style={{ background: 'rgba(245,158,11,0.2)', color: '#fcd34d', fontSize: '10px', padding: '2px 6px', borderRadius: '3px', fontFamily: 'var(--font-mono)' }}>
              (O) PROCEDURES
            </span>
            <span className="font-hud" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              FLIGHT CREW ACTION ITEMS ({requiredOps.length})
            </span>
          </div>
          {requiredOps.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              Standard operating procedures apply. No non-normal checklists required.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {requiredOps.map((op, idx) => (
                <li key={idx} style={{ fontSize: '11px', color: '#f1f5f9', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ color: '#f59e0b', marginTop: '2px' }}>•</span>
                  <span>{op}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Maintenance Placarding (M) */}
        <div style={{ background: 'rgba(3,7,18,0.5)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span style={{ background: 'rgba(14,165,233,0.2)', color: '#7dd3fc', fontSize: '10px', padding: '2px 6px', borderRadius: '3px', fontFamily: 'var(--font-mono)' }}>
              (M) PLACARDS
            </span>
            <span className="font-hud" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              A&P MECHANIC CERTIFICATIONS ({requiredMaint.length})
            </span>
          </div>
          {requiredMaint.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              No physical circuit breaker collaring or deferral logbook entries needed.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {requiredMaint.map((maint, idx) => (
                <li key={idx} style={{ fontSize: '11px', color: '#f1f5f9', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ color: '#38bdf8', marginTop: '2px' }}>•</span>
                  <span>{maint}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* PIC & Dispatcher Dual-Signoff Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          14 CFR § 121.663 DISPATCH RELEASE AUTH
        </span>
        <button
          onClick={handleSignoffClick}
          className="btn-primary-action"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <FileSignature size={16} />
          <span>CAPTAIN (PIC) & DISPATCHER DUAL SIGN-OFF</span>
        </button>
      </div>
    </div>
  );
}
