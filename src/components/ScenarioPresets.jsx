import React from 'react';
import { Flame, Compass, CloudSnow, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { soundEngine } from '../sound/avionicsAudio';

export const SCENARIO_PRESETS = [
  {
    id: 'hot-pack-clash',
    title: 'Hot Day Pack Clash',
    aircraftId: 'ac-b738',
    failures: ['mel-21-50-01'], // Pack inop
    telemetry: {
      depIcao: 'KDEN',
      arrIcao: 'KLAX',
      oatTemperature: 34, // >= 30°C triggers FAA AD 2024-18-09
      cruisingAltitude: 250,
      runwayCondition: 'DRY',
      isEtops: false,
      isCatIII: false
    },
    icon: Flame,
    color: '#ef4444',
    badge: 'FAA AD OVERRULE (NO-GO)',
    summary: 'MMEL 21-50-01 allows 1-pack flight <= FL250, but FAA AD 2024-18-09 strictly grounds aircraft when OAT >= 30°C.'
  },
  {
    id: 'etops-apu-trap',
    title: 'Oceanic ETOPS Generator Trap',
    aircraftId: 'ac-a20n',
    failures: ['mel-49-11-02'], // APU Gen inop
    telemetry: {
      depIcao: 'KJFK',
      arrIcao: 'EGLL',
      oatTemperature: 18,
      cruisingAltitude: 370,
      runwayCondition: 'DRY',
      isEtops: true, // Triggers OpsSpec B043
      isCatIII: false
    },
    icon: Compass,
    color: '#ef4444',
    badge: 'OPSSPEC B043 OVERRULE',
    summary: 'MMEL 49-11-02 allows 10-day APU deferral, but OpsSpec B043 mandates 3 AC generators for oceanic sectors.'
  },
  {
    id: 'contaminated-autobrake',
    title: 'Contaminated Runway Autobrake',
    aircraftId: 'ac-b738',
    failures: ['mel-32-42-02'], // Autobrake inop
    telemetry: {
      depIcao: 'KORD',
      arrIcao: 'KMSP',
      oatTemperature: -2,
      cruisingAltitude: 310,
      runwayCondition: 'CONTAMINATED', // Triggers FAA AD 2025-01-08
      isEtops: false,
      isCatIII: false
    },
    icon: CloudSnow,
    color: '#ef4444',
    badge: 'RUNWAY EXCURSION NO-GO',
    summary: 'MMEL allows manual braking, but FAA AD 2025-01-08 prohibits dispatch on wet/slush runways without autobrake.'
  },
  {
    id: 'rvsm-adiru-restriction',
    title: 'ADIRU RVSM Altitude Cap',
    aircraftId: 'ac-a20n',
    failures: ['mel-34-12-01'], // ADIRU inop
    telemetry: {
      depIcao: 'KDFW',
      arrIcao: 'KDEN',
      oatTemperature: 22,
      cruisingAltitude: 350, // > FL290 triggers OpsSpec B046
      runwayCondition: 'DRY',
      isEtops: false,
      isCatIII: false
    },
    icon: AlertTriangle,
    color: '#f59e0b',
    badge: 'CONDITIONAL FLIGHT CAPPED',
    summary: 'Degraded ADIRU allows Category A relief, but OpsSpec B046 caps cruise altitude below FL290 (RVSM exclusion).'
  }
];

export default function ScenarioPresets({ onApplyScenario }) {
  return (
    <div className="cockpit-card p-5 mb-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="var(--hud-cyan)" />
          <h3 className="font-hud" style={{ fontSize: '15px', letterSpacing: '0.08em', color: '#fff' }}>
            REGULATORY CONTRADICTION STRESS-TEST SCENARIOS (1-CLICK LOAD)
          </h3>
        </div>
        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          INSTANT JUDGE EVALUATION PRESETS
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px'
      }}>
        {SCENARIO_PRESETS.map((sc) => {
          const Icon = sc.icon;

          return (
            <div
              key={sc.id}
              onClick={() => {
                soundEngine.playSwitchClick();
                onApplyScenario(sc);
              }}
              style={{
                background: 'rgba(5, 12, 26, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = sc.color;
                e.currentTarget.style.boxShadow = `0 0 16px ${sc.color}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon size={16} color={sc.color} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                      {sc.title}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    color: sc.color,
                    background: `${sc.color}15`,
                    border: `1px solid ${sc.color}40`,
                    padding: '1px 5px',
                    borderRadius: '3px'
                  }}>
                    {sc.badge}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {sc.summary}
                </p>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--hud-cyan)', fontFamily: 'var(--font-mono)' }}>
                <span>AIRCRAFT: {sc.aircraftId === 'ac-b738' ? 'B737-800' : 'A320neo'}</span>
                <span style={{ textDecoration: 'underline' }}>LOAD & RUN →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
