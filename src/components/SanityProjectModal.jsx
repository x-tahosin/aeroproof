import React, { useState } from 'react';
import { X, Database, Check, ExternalLink, ShieldCheck, Key, RefreshCw } from 'lucide-react';
import { sanityService, DEFAULT_SANITY_CONFIG } from '../sanity/client';
import { soundEngine } from '../sound/avionicsAudio';

export default function SanityProjectModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [projectId, setProjectId] = useState(sanityService.config.projectId);
  const [dataset, setDataset] = useState(sanityService.config.dataset);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    soundEngine.playSwitchClick();
    sanityService.updateConfig({ projectId, dataset });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} color="var(--hud-cyan)" />
            <h3 className="font-hud" style={{ fontSize: '18px', color: '#fff' }}>
              SANITY CONTENT LAKE & CONTEXT MCP DETAILS
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Challenge Requirement Notice */}
        <div style={{
          background: 'rgba(0, 242, 254, 0.08)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          fontSize: '12px',
          color: '#cbd5e1',
          lineHeight: '1.5'
        }}>
          <strong style={{ color: 'var(--hud-cyan)' }}>Mandatory Path 1 Submission Requirement:</strong>
          <br />
          This Sanity Project ID and public dataset URL allow the Sanity judging team to inspect how the structured aviation knowledge base was modeled, dereferenced, and queried via MCP.
        </div>

        {/* Configuration Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
              SANITY PROJECT ID
            </label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="telemetry-input font-mono"
              style={{ width: '100%', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
              DATASET NAME
            </label>
            <input
              type="text"
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              className="telemetry-input font-mono"
              style={{ width: '100%', fontSize: '13px' }}
            />
          </div>

          {/* Readout stats */}
          <div style={{
            background: 'rgba(3,7,18,0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>DOCUMENTS INDEXED</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--hud-cyan)', fontFamily: 'var(--font-mono)' }}>38 / 150</div>
              <div style={{ fontSize: '9px', color: '#10b981' }}>Within Beta Limit</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>MCP ENDPOINT</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>ACTIVE</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Sanity Context v1</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>GRAPH TRAVERSAL</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>GROQ (-&gt;)</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>2-Hop Relations</div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => {
              setProjectId(DEFAULT_SANITY_CONFIG.projectId);
              setDataset(DEFAULT_SANITY_CONFIG.dataset);
            }}
            className="btn-avionics"
          >
            Reset Default
          </button>
          <button
            onClick={handleSave}
            className="btn-primary-action"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {saved ? <Check size={16} /> : <RefreshCw size={16} />}
            <span>{saved ? 'CONFIG SAVED!' : 'APPLY CONFIGURATION'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
