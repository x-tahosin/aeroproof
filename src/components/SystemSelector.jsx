import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronRight, CheckSquare, Square, Wrench, FileText } from 'lucide-react';
import { soundEngine } from '../sound/avionicsAudio';

export default function SystemSelector({
  ataSystems,
  melItems,
  aircraft,
  selectedFailures,
  onToggleFailure
}) {
  const [openChapters, setOpenChapters] = useState({ 21: true, 24: true, 32: false, 34: false, 36: false, 49: true });

  const toggleChapter = (ch) => {
    soundEngine.playSwitchClick();
    setOpenChapters(prev => ({ ...prev, [ch]: !prev[ch] }));
  };

  // Filter items matching selected aircraft
  const relevantItems = melItems.filter(m => m.aircraftTypeId === aircraft._id);

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'A': return 'badge-cat-a';
      case 'B': return 'badge-cat-b';
      case 'C': return 'badge-cat-c';
      case 'D': return 'badge-cat-d';
      default: return 'badge-cat-c';
    }
  };

  return (
    <div className="cockpit-card p-4" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="var(--hud-cyan)" />
          <span className="font-hud" style={{ fontSize: '13px', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            ATA 100 SUBSYSTEMS & MEL FAULT MATRIX
          </span>
        </div>
        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          CLICK TO INJECT FAULT
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ataSystems.map(sys => {
          const sysItems = relevantItems.filter(item => item.ataSystemId === sys._id);
          if (sysItems.length === 0) return null;

          const activeCountInSys = sysItems.filter(i => selectedFailures.includes(i._id)).length;
          const isOpen = !!openChapters[sys.chapter];

          return (
            <div
              key={sys._id}
              style={{
                background: activeCountInSys > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(4, 10, 22, 0.6)',
                border: activeCountInSys > 0 ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
            >
              {/* Accordion Chapter Header */}
              <div
                onClick={() => toggleChapter(sys.chapter)}
                style={{
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: 'rgba(8, 18, 36, 0.7)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isOpen ? <ChevronDown size={14} color="var(--hud-cyan)" /> : <ChevronRight size={14} color="var(--hud-cyan)" />}
                  <span className="font-hud" style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>
                    {sys.code}: {sys.name}
                  </span>
                </div>
                {activeCountInSys > 0 && (
                  <span className="badge-cat-a font-mono" style={{ fontSize: '10px' }}>
                    {activeCountInSys} INOPERATIVE
                  </span>
                )}
              </div>

              {/* Items List */}
              {isOpen && (
                <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {sysItems.map(item => {
                    const isFailed = selectedFailures.includes(item._id);

                    return (
                      <div
                        key={item._id}
                        onClick={() => {
                          soundEngine.playSwitchClick();
                          onToggleFailure(item._id);
                        }}
                        style={{
                          background: isFailed ? 'rgba(239, 68, 68, 0.18)' : 'rgba(10, 22, 44, 0.5)',
                          border: isFailed ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(56, 189, 248, 0.08)',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <div style={{ marginTop: '2px', color: isFailed ? '#ef4444' : 'var(--text-dim)' }}>
                            {isFailed ? <CheckSquare size={16} /> : <Square size={16} />}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span className="font-mono" style={{ fontSize: '11px', color: isFailed ? '#fca5a5' : 'var(--hud-cyan)' }}>
                                {item.itemCode}
                              </span>
                              <span style={{ fontSize: '12px', fontWeight: 600, color: isFailed ? '#fff' : '#cbd5e1' }}>
                                {item.title}
                              </span>
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px', lineHeight: '1.4' }}>
                              {item.dispatchConditions}
                            </p>
                          </div>
                        </div>

                        {/* Badges / Flags */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                          <span className={`${getCategoryBadge(item.repairCategory)} font-mono`}>
                            CAT {item.repairCategory} ({item.repairIntervalDays})
                          </span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {item.operationsProcedureRequired && (
                              <span style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#fcd34d', fontSize: '9px', padding: '1px 4px', borderRadius: '3px', fontFamily: 'var(--font-mono)' }} title="Operational Procedure Required">
                                (O)
                              </span>
                            )}
                            {item.maintenanceProcedureRequired && (
                              <span style={{ background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.4)', color: '#7dd3fc', fontSize: '9px', padding: '1px 4px', borderRadius: '3px', fontFamily: 'var(--font-mono)' }} title="Maintenance Procedure Required">
                                (M)
                              </span>
                            )}
                            <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                              {item.requiredQty}/{item.installedQty} REQ
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
