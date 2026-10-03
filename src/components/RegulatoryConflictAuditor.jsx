import React from 'react';
import { GitCompare, ExternalLink, AlertOctagon, CheckCircle2, Scale, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegulatoryConflictAuditor({ clashes }) {
  const hasClashes = clashes && clashes.length > 0;

  return (
    <div className="cockpit-card p-5 mb-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scale size={18} color="var(--hud-cyan)" />
          <h3 className="font-hud" style={{ fontSize: '15px', letterSpacing: '0.08em', color: '#fff' }}>
            REGULATORY CONTRADICTION ARBITRATION MATRIX
          </h3>
        </div>
        <span className="font-mono" style={{
          fontSize: '11px',
          color: hasClashes ? '#ef4444' : '#10b981',
          background: hasClashes ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
          border: `1px solid ${hasClashes ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
          padding: '2px 8px',
          borderRadius: '4px'
        }}>
          {hasClashes ? `${clashes.length} STATUTORY CONFLICT(S) ACTIVE` : 'DIRECTIVES FULLY HARMONIZED'}
        </span>
      </div>

      {!hasClashes ? (
        <div style={{
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <ShieldCheck size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
          <h4 className="font-hud" style={{ fontSize: '15px', color: '#10b981', marginBottom: '4px' }}>
            ZERO REGULATORY CONTRADICTIONS DETECTED
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.5' }}>
            Sanity Context MCP evaluated active deferrals against FAA Master MEL, Carrier Operations Specifications (C055, B043), and published Airworthiness Directives. All operating limits are mutually compatible under current flight telemetry.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {clashes.map((clash, idx) => {
            const isFatal = clash.dispatchVerdict === 'NO_GO';

            return (
              <div
                key={idx}
                style={{
                  background: isFatal ? 'rgba(239, 68, 68, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                  border: isFatal ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Clash Headline & Trigger Condition */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span className="font-mono" style={{ fontSize: '10px', color: isFatal ? '#fca5a5' : '#fcd34d', fontWeight: 700 }}>
                      RULE ID: {clash.ruleId}
                    </span>
                    <h4 className="font-hud" style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                      {clash.headline}
                    </h4>
                  </div>
                  <div style={{
                    background: 'rgba(3,7,18,0.85)',
                    border: '1px solid var(--border-subtle)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--hud-cyan)'
                  }}>
                    TRIGGER: <strong>{clash.triggerCondition}</strong>
                  </div>
                </div>

                {/* SIDE-BY-SIDE CONTRADICTION COMPARISON */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '12px',
                  position: 'relative'
                }}>
                  {/* Left Column: Baseline MMEL Allowance */}
                  <div style={{
                    background: 'rgba(3,7,18,0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="font-hud" style={{ fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                        BASELINE DOCUMENT (ALLOWANCE)
                      </span>
                      <span className="badge-cat-c font-mono" style={{ fontSize: '9px' }}>OVERRULED</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                      {clash.baselineSource}
                    </div>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                      "{clash.baselineClaim}"
                    </p>
                  </div>

                  {/* Right Column: Overriding Airworthiness Directive / OpsSpec */}
                  <div style={{
                    background: isFatal ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    border: isFatal ? '1px solid rgba(239, 68, 68, 0.45)' : '1px solid rgba(245, 158, 11, 0.45)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="font-hud" style={{ fontSize: '11px', color: isFatal ? '#fca5a5' : '#fcd34d', letterSpacing: '0.05em' }}>
                        OVERRIDING MANDATE (PROHIBITION)
                      </span>
                      <span style={{
                        background: isFatal ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)',
                        border: `1px solid ${isFatal ? '#ef4444' : '#f59e0b'}`,
                        color: '#fff',
                        fontSize: '9px',
                        padding: '1px 6px',
                        borderRadius: '3px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700
                      }}>
                        AUTHORITATIVE WINNER
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                      {clash.overridingSource}
                    </div>
                    <p style={{ fontSize: '12px', color: '#f1f5f9', lineHeight: '1.4' }}>
                      "{clash.overridingClaim}"
                    </p>
                  </div>
                </div>

                {/* The Legal Ruling & Precedence Rationale */}
                <div style={{
                  background: 'rgba(3,7,18,0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Scale size={15} color="var(--hud-cyan)" />
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      <strong style={{ color: '#fff' }}>STATUTORY PRECEDENCE BASIS: </strong>
                      {clash.legalBasis}
                    </span>
                  </div>

                  <div style={{
                    background: isFatal ? '#ef4444' : '#f59e0b',
                    color: '#000',
                    fontFamily: 'var(--font-hud)',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    padding: '4px 10px',
                    borderRadius: '4px'
                  }}>
                    {isFatal ? 'FLIGHT GROUNDED (NO-GO)' : 'RESTRICTED DISPATCH ONLY'}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
