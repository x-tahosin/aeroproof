import React, { useState } from 'react';
import { Terminal, Database, Code, CheckCircle, Clock, Zap } from 'lucide-react';
import { sanityService } from '../sanity/client';

export default function SanityMcpTrace({ traceLogs }) {
  const [activeTab, setActiveTab] = useState('trace'); // 'trace' or 'groq'
  const groqQueries = sanityService.getGroqQueries();

  return (
    <div className="cockpit-card p-5">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={18} color="var(--hud-cyan)" />
          <h3 className="font-hud" style={{ fontSize: '15px', letterSpacing: '0.08em', color: '#fff' }}>
            SANITY CONTEXT MCP AGENT EXECUTION TRACE
          </h3>
          <span className="font-mono" style={{ fontSize: '10px', color: 'var(--hud-cyan)', background: 'rgba(0,242,254,0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0,242,254,0.3)' }}>
            ENDPOINT: /v2026-03-01/context/mcp
          </span>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('trace')}
            className={`btn-avionics ${activeTab === 'trace' ? 'active' : ''}`}
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            <Zap size={12} />
            <span>MCP Tool Trace ({traceLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('groq')}
            className={`btn-avionics ${activeTab === 'groq' ? 'active' : ''}`}
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            <Code size={12} />
            <span>Relational GROQ Queries</span>
          </button>
        </div>
      </div>

      {activeTab === 'trace' ? (
        <div style={{
          background: 'rgba(3, 7, 18, 0.95)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          maxHeight: '260px',
          overflowY: 'auto'
        }}>
          {traceLogs.length === 0 ? (
            <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>
              Awaiting dispatch telemetry or fault injection to trigger MCP tool execution...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {traceLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    background: 'rgba(6, 15, 30, 0.7)',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
                    borderRadius: '6px',
                    padding: '8px 10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--text-dim)' }}>[{log.timestamp}]</span>
                      <span style={{ color: 'var(--hud-cyan)', fontWeight: 700 }}>
                        TOOL: {log.tool}()
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', color: 'var(--text-muted)', fontSize: '10px' }}>
                      <span>LATENCY: {log.durationMs}ms</span>
                      <span>TOKENS: ~{log.tokens}</span>
                      <span style={{ color: '#10b981' }}>DOCS RETRIEVED: {log.itemsReturned}</span>
                    </div>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '10px', wordBreak: 'break-all' }}>
                    ARGS: {JSON.stringify(log.args)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* GROQ Queries Tab */
        <div style={{
          background: 'rgba(3, 7, 18, 0.95)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          maxHeight: '260px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div>
            <div style={{ color: 'var(--hud-cyan)', fontWeight: 700, marginBottom: '4px' }}>
              // 1. Relational Graph Dereferencing (MEL Items with linked ATA Chapter & Aircraft):
            </div>
            <pre style={{ color: '#a5f3fc', background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '4px', overflowX: 'auto' }}>
              {groqQueries.fetchMelItemsWithRelations}
            </pre>
          </div>

          <div>
            <div style={{ color: 'var(--hud-cyan)', fontWeight: 700, marginBottom: '4px' }}>
              // 2. Regulatory Contradiction Rules & Precedence Arbitration:
            </div>
            <pre style={{ color: '#a5f3fc', background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '4px', overflowX: 'auto' }}>
              {groqQueries.fetchContradictions}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
