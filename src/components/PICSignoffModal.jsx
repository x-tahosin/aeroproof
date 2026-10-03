import React, { useState } from 'react';
import { X, FileCheck, ShieldAlert, Award, CheckCircle, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../sound/avionicsAudio';

export default function PICSignoffModal({
  isOpen,
  onClose,
  aircraft,
  telemetry,
  dispatchResult,
  selectedFailures,
  melItems
}) {
  if (!isOpen) return null;

  const [picSigned, setPicSigned] = useState(false);
  const [dispatcherSigned, setDispatcherSigned] = useState(false);
  const [releaseIssued, setReleaseIssued] = useState(false);

  const isNoGo = dispatchResult?.verdict === 'STRICT_NO_GO';
  const deferredList = selectedFailures.map(fId => melItems.find(m => m._id === fId)).filter(Boolean);

  const handleIssueRelease = () => {
    if (isNoGo) return;
    soundEngine.playLegalClearance();
    setReleaseIssued(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content p-6" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck size={20} color="var(--hud-cyan)" />
            <h3 className="font-hud" style={{ fontSize: '18px', color: '#fff' }}>
              OFFICIAL DISPATCH RELEASE & FLIGHT AUTHORIZATION
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Legal Form Paper */}
        <div style={{
          background: 'rgba(3, 7, 18, 0.95)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          marginBottom: '20px',
          lineHeight: '1.6'
        }}>
          <div style={{ borderBottom: '1px dashed rgba(56,189,248,0.3)', paddingBottom: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>CARRIER: AERO AIRLINES (CERT #121-FAA-AERO)</span>
            <span style={{ color: 'var(--hud-cyan)' }}>FLIGHT: AERO-702</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <div>AIRCRAFT: <strong>{aircraft.model} ({aircraft.icaoCode})</strong></div>
            <div>ROUTE: <strong>{telemetry.depIcao} → {telemetry.arrIcao}</strong></div>
            <div>AUTHORIZED CEILING: <strong style={{ color: isNoGo ? '#ef4444' : 'var(--hud-cyan)' }}>{dispatchResult?.ceilingCapFL > 0 ? `FL${dispatchResult.ceilingCapFL}` : 'N/A (GROUNDED)'}</strong></div>
            <div>OUTSIDE AIR TEMP: <strong>{telemetry.oatTemperature}°C</strong></div>
          </div>

          <div style={{ borderTop: '1px dashed rgba(56,189,248,0.3)', paddingTop: '8px', marginTop: '10px' }}>
            <div style={{ color: 'var(--hud-cyan)', marginBottom: '4px' }}>
              ACTIVE DEFERRED DEFECTS ({deferredList.length}):
            </div>
            {deferredList.length === 0 ? (
              <span style={{ color: '#10b981' }}>NONE — ZERO DEFECTS RECORDED (CLEAN AIRFRAME)</span>
            ) : (
              <ul style={{ paddingLeft: '14px' }}>
                {deferredList.map(item => (
                  <li key={item._id}>
                    MEL {item.itemCode}: {item.title} (CAT {item.repairCategory})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {dispatchResult?.clashes?.length > 0 && (
            <div style={{ borderTop: '1px dashed rgba(56,189,248,0.3)', paddingTop: '8px', marginTop: '10px', color: isNoGo ? '#ef4444' : '#f59e0b' }}>
              STATUTORY RULING: {dispatchResult.clashes[0].headline} — {dispatchResult.clashes[0].overridingSource}
            </div>
          )}
        </div>

        {/* Warning / Grounding Notice */}
        {isNoGo ? (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            color: '#fca5a5',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldAlert size={24} color="#ef4444" style={{ flexShrink: 0 }} />
            <div>
              <strong>FEDERAL DISPATCH RELEASE LOCKED:</strong>
              <br />
              This flight cannot be released. Mandatory FAA Airworthiness Directives prohibit departure with current defect configuration under 14 CFR § 39.7.
            </div>
          </div>
        ) : (
          /* Sign-off Checkboxes */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={picSigned}
                onChange={(e) => {
                  soundEngine.playSwitchClick();
                  setPicSigned(e.target.checked);
                }}
                style={{ width: '16px', height: '16px', accentColor: 'var(--hud-cyan)' }}
              />
              <span>I, Captain / Pilot-In-Command (PIC), have inspected all MEL deferrals and accept aircraft airworthiness status.</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={dispatcherSigned}
                onChange={(e) => {
                  soundEngine.playSwitchClick();
                  setDispatcherSigned(e.target.checked);
                }}
                style={{ width: '16px', height: '16px', accentColor: 'var(--hud-cyan)' }}
              />
              <span>I, Certified FAA Aircraft Dispatcher, authorize flight release under 14 CFR § 121.663.</span>
            </label>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="btn-avionics">
            Close
          </button>
          {!isNoGo && (
            <button
              onClick={handleIssueRelease}
              disabled={!picSigned || !dispatcherSigned || releaseIssued}
              className="btn-primary-action"
              style={{
                opacity: (!picSigned || !dispatcherSigned || releaseIssued) ? 0.5 : 1,
                cursor: (!picSigned || !dispatcherSigned || releaseIssued) ? 'not-allowed' : 'pointer'
              }}
            >
              {releaseIssued ? 'DISPATCH RELEASE TRANSMITTED (ACARS)' : 'AUTHENTICATE & ISSUE DISPATCH RELEASE'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
