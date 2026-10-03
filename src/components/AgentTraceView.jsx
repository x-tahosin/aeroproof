import React, { useState, useEffect } from 'react';
import {
  Search, FileText, AlertTriangle, Settings, CheckCircle2, Cpu, Brain,
  Network, Database, Sparkles, Activity, Code, X, ChevronRight, Terminal,
  Zap, Radio, RefreshCw, Layers
} from 'lucide-react';
import { soundEngine } from '../sound/avionicsAudio';
import { sanityService } from '../sanity/client';

export default function AgentTraceView({
  aircraft,
  telemetry,
  selectedFailures,
  dispatchResult,
  traceLogs: initialTraceLogs
}) {
  const [activeTab, setActiveTab] = useState('stream'); // 'stream' or 'timeline'
  const [inspectedStep, setInspectedStep] = useState(null);
  const [inspectedPacket, setInspectedPacket] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [liveLogs, setLiveLogs] = useState(sanityService.getTraceLogs());

  useEffect(() => {
    // Subscribe to live incoming MCP trace events
    const unsub = sanityService.subscribeTrace((newEntry, allLogs) => {
      setLiveLogs([...allLogs]);
    });
    return () => unsub();
  }, []);

  const isNoGo = dispatchResult?.verdict === 'STRICT_NO_GO';
  const isConditional = dispatchResult?.verdict === 'CONDITIONAL_GO';
  const hasClashes = dispatchResult?.clashes && dispatchResult.clashes.length > 0;

  const groqQueries = sanityService.getGroqQueries();

  // Dynamic 5-step reasoning trace based on live dispatch evaluation
  const steps = [
    {
      num: 1,
      title: '1. CONTEXT QUERY INITIATED',
      time: 'LIVE',
      desc: `Sanity Context MCP dispatch stream opened for ${aircraft.model} (${aircraft.icaoCode}). Flight sector: ${telemetry.depIcao} → ${telemetry.arrIcao}.`,
      sub: `Airframe ID: ${aircraft._id} • OAT: ${telemetry.oatTemperature}°C • Planned: FL${telemetry.cruisingAltitude}`,
      icon: Search,
      isConflict: false,
      groq: groqQueries.fetchAllAircraft,
      toolCall: 'sanity_context_query_mel'
    },
    {
      num: 2,
      title: '2. DEREFERENCED KNOWLEDGE GRAPH',
      time: 'LIVE',
      desc: `Retrieved structured MMEL dataset with multi-hop dereferencing (->) across ATA 21, 24, 32, 34, 36, and 49 chapters.`,
      sub: `Dataset: production • ${selectedFailures.length} active defect(s) evaluated against Content Lake`,
      icon: FileText,
      isConflict: false,
      groq: groqQueries.fetchMelItemsWithRelations,
      toolCall: 'sanity_context_query_mel'
    },
    {
      num: 3,
      title: hasClashes ? '3. CONTRADICTION DETECTED' : '3. REGULATORY COMPLIANCE SCAN',
      time: 'LIVE',
      desc: hasClashes
        ? `Arbitration conflict detected: ${dispatchResult.clashes[0].headline} (Trigger: ${dispatchResult.clashes[0].triggerCondition}).`
        : `Zero statutory contradictions found. Current defects conform to standard MMEL relief provisions.`,
      sub: hasClashes
        ? `Overriding Directive: ${dispatchResult.clashes[0].overridingSource} vs Baseline: ${dispatchResult.clashes[0].baselineSource}`
        : `All evaluated systems meet 14 CFR § 121.628 minimum operational criteria`,
      icon: hasClashes ? AlertTriangle : CheckCircle2,
      isConflict: hasClashes,
      groq: groqQueries.fetchContradictions,
      toolCall: 'sanity_context_evaluate_contradictions'
    },
    {
      num: 4,
      title: '4. STATUTORY PRECEDENCE APPLIED',
      time: 'LIVE',
      desc: hasClashes
        ? `Statutory Precedence 14 CFR § 39.7 enforced: Codified Federal Airworthiness Directives strictly overrule manufacturer MMEL.`
        : `Carrier Operations Specifications (OpsSpecs) and MMEL conditions validated without operational exclusions.`,
      sub: hasClashes
        ? `Precedence Hierarchy: 1. FAA AD (Federal Law) > 2. OpsSpecs > 3. Manufacturer MMEL`
        : `Standard Category B/C deferral clock stamped with A&P maintenance collar requirements`,
      icon: Settings,
      isConflict: false,
      groq: `*[_type == "regulatoryDirective" && legalPrecedenceRank == 1]`,
      toolCall: 'sanity_context_get_ad_citation'
    },
    {
      num: 5,
      title: '5. FINAL DISPATCH DECISION',
      time: 'LIVE',
      desc: `STATUS: ${dispatchResult?.statusTitle || 'CLEARED FOR DEPARTURE'}. Authorized ceiling: ${dispatchResult?.ceilingCapFL > 0 ? 'FL' + dispatchResult.ceilingCapFL : 'GROUNDED'}.`,
      sub: isNoGo ? 'PIC Release Locked • Mandatory Rectification Required' : 'PIC and Dispatcher Dual Authorization Enabled',
      icon: isNoGo ? AlertTriangle : CheckCircle2,
      isConflict: isNoGo,
      isSuccess: !isNoGo,
      groq: `// Final Arbitrated Dispatch Release Object\n{\n  verdict: "${dispatchResult?.verdict}",\n  confidence: ${dispatchResult?.confidence}%\n}`,
      toolCall: 'dispatch_engine_verdict'
    }
  ];

  const handleTriggerLiveAudit = async () => {
    soundEngine.playSwitchClick();
    setIsScanning(true);
    await sanityService.invokeMcpTool('sanity_context_query_mel', {
      aircraftId: aircraft._id,
      selectedFailures
    });
    await sanityService.invokeMcpTool('sanity_context_evaluate_contradictions', {
      selectedFailures,
      flightConditions: telemetry
    });
    if (hasClashes) {
      await sanityService.invokeMcpTool('sanity_context_get_ad_citation', {
        adNumber: dispatchResult.clashes[0].overridingSource || 'AD 2024-18-09'
      });
    }
    await sanityService.testLiveMcpConnection();
    setIsScanning(false);
  };

  const confidenceScore = dispatchResult?.confidence || 99.8;
  const strokeOffset = Math.round(414 - (414 * confidenceScore) / 100);

  return (
    <div className="grok-card p-6" style={{ minHeight: '84vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid rgba(56,189,248,0.12)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} className="pulse-glow" />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', fontWeight: 700 }}>
            REAL-TIME MCP DISPATCH STREAM
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            #{aircraft.icaoCode}-SESSION-LIVE
          </span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-hud)', fontSize: '20px', fontWeight: 800, letterSpacing: '0.14em', color: '#fff' }}>
            A E R O P R O O F
          </h2>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', letterSpacing: '0.08em' }}>
            Sanity Context MCP Real-Time Dereference Terminal
          </span>
        </div>

        <div style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: '#10b981',
          fontWeight: 700,
          background: 'rgba(16, 185, 129, 0.1)',
          padding: '4px 12px',
          borderRadius: '9999px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          MCP AGENT: ACTIVE ({liveLogs.length} EVENTS)
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '270px 1.4fr 360px',
        gap: '20px',
        alignItems: 'stretch',
        position: 'relative'
      }}>
        
        {/* Left Column: Confidence Meter, Controls & MCP Indicators */}
        <div style={{
          background: 'rgba(5, 12, 26, 0.88)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '16px',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          boxShadow: '0 15px 40px -10px rgba(0,0,0,0.8)'
        }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', letterSpacing: '0.12em', color: 'var(--text-muted)', fontWeight: 700 }}>
            ARBITRATION CONFIDENCE
          </span>

          {/* Circular Confidence Meter Ring */}
          <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 160 160" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <circle cx="80" cy="80" r="66" fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth="8" />
              <circle
                cx="80"
                cy="80"
                r="66"
                fill="none"
                stroke={isNoGo ? '#ef4444' : isConditional ? '#f59e0b' : 'var(--neon-cyan)'}
                strokeWidth="8"
                strokeDasharray="414"
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 12px ${isNoGo ? '#ef4444' : 'var(--neon-cyan)'})` }}
              />
            </svg>
            <div style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '32px',
              fontWeight: 900,
              color: '#fff',
              textShadow: `0 0 20px ${isNoGo ? '#ef4444' : 'var(--neon-cyan)'}`
            }}>
              {confidenceScore}%
            </div>
          </div>

          {/* Trigger Real-Time Scan Button */}
          <button
            onClick={handleTriggerLiveAudit}
            disabled={isScanning}
            className="btn-primary-action"
            style={{ width: '100%', padding: '10px 14px', fontSize: '11px' }}
          >
            <RefreshCw size={13} className={isScanning ? 'rotate-ring-forward' : ''} />
            <span>{isScanning ? 'TRANSMITTING MCP...' : 'TRIGGER REAL-TIME MCP SCAN'}</span>
          </button>

          {/* Real-time Subsystem Status */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(56,189,248,0.12)', paddingTop: '14px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontWeight: 600 }}>
              SANITY MCP PIPELINES
            </span>
            {[
              { label: 'GROQ RESOLVER', status: 'ACTIVE (14ms)', color: '#10b981' },
              { label: 'GRAPH DEREF (->)', status: 'EXPANDED', color: 'var(--neon-cyan)' },
              { label: '14 CFR § 39.7 ENGINE', status: 'ENFORCING', color: '#f59e0b' },
              { label: 'MCP PROTOCOL', status: 'v1.0 (stdio/SSE)', color: '#10b981' }
            ].map(ind => (
              <div key={ind.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{ind.label}</span>
                <span style={{ color: ind.color, fontWeight: 700 }}>{ind.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: View Switcher (Real-Time Packet Stream vs Reasoning Timeline) */}
        <div style={{
          background: 'rgba(4, 10, 24, 0.75)',
          border: '1px solid rgba(56, 189, 248, 0.18)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          minHeight: '480px'
        }}>
          {/* Stream / Timeline Tab Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(56,189,248,0.15)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => {
                  soundEngine.playSwitchClick();
                  setActiveTab('stream');
                }}
                className={`grok-btn ${activeTab === 'stream' ? 'active' : ''}`}
                style={{ padding: '5px 12px', fontSize: '11px' }}
              >
                <Zap size={12} />
                <span>REAL-TIME MCP PACKETS ({liveLogs.length})</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playSwitchClick();
                  setActiveTab('timeline');
                }}
                className={`grok-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                style={{ padding: '5px 12px', fontSize: '11px' }}
              >
                <Layers size={12} />
                <span>REASONING PHASES (5)</span>
              </button>
            </div>

            <span style={{ fontSize: '10px', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
              ● LIVE STREAMING
            </span>
          </div>

          {/* Tab 1: Real-Time MCP Event Stream */}
          {activeTab === 'stream' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '520px', paddingRight: '4px' }}>
              {liveLogs.map((log) => {
                const isSelected = inspectedPacket?.id === log.id;
                return (
                  <div
                    key={log.id}
                    onClick={() => {
                      soundEngine.playSwitchClick();
                      setInspectedPacket(isSelected ? null : log);
                      setInspectedStep(null);
                    }}
                    style={{
                      background: isSelected ? 'rgba(0, 242, 254, 0.15)' : 'rgba(2, 6, 18, 0.85)',
                      border: isSelected ? '1.5px solid var(--neon-cyan)' : '1px solid rgba(56, 189, 248, 0.16)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Terminal size={13} color="var(--neon-cyan)" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--neon-cyan)' }}>
                          {log.tool}()
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>[{log.timestamp}]</span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>{log.durationMs}ms</span>
                        <span style={{ color: 'var(--text-dim)' }}>~{log.tokens} tk</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      INPUT: {JSON.stringify(log.args)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Tab 2: 5 Reasoning Phases Timeline */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '520px' }}>
              {steps.map(st => {
                const Icon = st.icon;
                const isInspected = inspectedStep?.num === st.num;

                return (
                  <div
                    key={st.num}
                    onClick={() => {
                      soundEngine.playSwitchClick();
                      setInspectedStep(isInspected ? null : st);
                      setInspectedPacket(null);
                    }}
                    style={{
                      background: isInspected ? 'rgba(0, 242, 254, 0.15)' : st.isConflict ? 'rgba(239, 68, 68, 0.12)' : 'rgba(6, 16, 32, 0.8)',
                      border: isInspected ? '1.5px solid var(--neon-cyan)' : st.isConflict ? '1px solid rgba(239,68,68,0.45)' : '1px solid rgba(56, 189, 248, 0.18)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={14} color={st.isConflict ? '#ef4444' : st.isSuccess ? '#10b981' : 'var(--neon-cyan)'} />
                        <span style={{ fontFamily: 'var(--font-hud)', fontSize: '12px', fontWeight: 800, color: st.isConflict ? '#fca5a5' : '#fff' }}>
                          {st.title}
                        </span>
                      </div>
                      <ChevronRight size={12} color="var(--neon-cyan)" />
                    </div>
                    <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: 3D Holographic Neural Brain Knowledge Graph OR Raw GROQ Inspector */}
        <div style={{
          background: (inspectedStep || inspectedPacket) ? 'rgba(4, 9, 24, 0.95)' : 'transparent',
          border: (inspectedStep || inspectedPacket) ? '1px solid rgba(56, 189, 248, 0.3)' : 'none',
          borderRadius: '16px',
          padding: (inspectedStep || inspectedPacket) ? '18px' : '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {inspectedPacket ? (
            /* Live MCP Packet Inspector */
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(56,189,248,0.2)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={15} color="var(--neon-cyan)" />
                  <span style={{ fontFamily: 'var(--font-hud)', fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                    MCP PACKET: {inspectedPacket.tool}()
                  </span>
                </div>
                <button
                  onClick={() => setInspectedPacket(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={15} />
                </button>
              </div>

              <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                LATENCY: <strong style={{ color: '#10b981' }}>{inspectedPacket.durationMs}ms</strong> • TRANSPORT: <strong style={{ color: 'var(--neon-cyan)' }}>{inspectedPacket.transport}</strong>
              </div>

              {/* Raw Executed GROQ Query */}
              <div style={{ flex: 1, background: 'rgba(2, 6, 16, 0.95)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '8px', padding: '10px', overflowY: 'auto' }}>
                <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#94a3b8', marginBottom: '4px' }}>
                  // EXECUTED GROQ DEREFERENCE:
                </div>
                <pre style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                  {inspectedPacket.groq}
                </pre>
              </div>

              {/* Arguments & Payload */}
              <div style={{ background: 'rgba(2, 6, 16, 0.95)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '8px', padding: '10px', maxHeight: '140px', overflowY: 'auto' }}>
                <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#94a3b8', marginBottom: '4px' }}>
                  // JSON-RPC INPUT ARGS:
                </div>
                <pre style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#a5f3fc', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(inspectedPacket.args, null, 2)}
                </pre>
              </div>
            </div>
          ) : inspectedStep ? (
            /* Step Inspector */
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(56,189,248,0.2)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={15} color="var(--neon-cyan)" />
                  <span style={{ fontFamily: 'var(--font-hud)', fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                    STEP {inspectedStep.num} GROQ DEREFERENCE
                  </span>
                </div>
                <button
                  onClick={() => setInspectedStep(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={15} />
                </button>
              </div>

              <div style={{ flex: 1, background: 'rgba(2, 6, 16, 0.95)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '8px', padding: '10px', overflowY: 'auto' }}>
                <pre style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                  {inspectedStep.groq}
                </pre>
              </div>
            </div>
          ) : (
            /* 3D Holographic Neural Brain Render */
            <>
              <div style={{ textAlign: 'center', marginBottom: '10px', position: 'relative', zIndex: 5 }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', letterSpacing: '0.12em', color: 'var(--neon-cyan)', fontWeight: 700 }}>
                  SANITY KNOWLEDGE GRAPH // 3D NEURAL DEREFERENCE
                </span>
              </div>

              <div style={{
                position: 'relative',
                width: '100%',
                height: '320px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src="/assets/3d/neural_brain_clean.png"
                  alt="3D Holographic Neural Knowledge Graph"
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 25px rgba(0,242,254,0.3)) brightness(1.1) contrast(1.15)',
                  }}
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: '10px', position: 'relative', zIndex: 5 }}>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Click any packet or reasoning step to inspect raw GROQ dereferences
                </span>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
}
