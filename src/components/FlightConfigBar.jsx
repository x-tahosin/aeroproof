import React from 'react';
import { Thermometer, Mountain, CloudRain, Compass, Eye, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../sound/avionicsAudio';

export default function FlightConfigBar({ telemetry, onChangeTelemetry }) {
  const isHotDay = telemetry.oatTemperature >= 30;

  const handleOatChange = (e) => {
    const val = parseInt(e.target.value, 10);
    onChangeTelemetry({ ...telemetry, oatTemperature: val });
  };

  const handleAltitudeChange = (e) => {
    const val = parseInt(e.target.value, 10);
    onChangeTelemetry({ ...telemetry, cruisingAltitude: val });
  };

  const handleRunwayChange = (e) => {
    soundEngine.playSwitchClick();
    onChangeTelemetry({ ...telemetry, runwayCondition: e.target.value });
  };

  const toggleEtops = () => {
    soundEngine.playSwitchClick();
    onChangeTelemetry({ ...telemetry, isEtops: !telemetry.isEtops });
  };

  const toggleCatIII = () => {
    soundEngine.playSwitchClick();
    onChangeTelemetry({ ...telemetry, isCatIII: !telemetry.isCatIII });
  };

  return (
    <div className="cockpit-card mb-6 p-4">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={16} color="var(--hud-cyan)" />
          <span className="font-hud" style={{ fontSize: '13px', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            FLIGHT ENVIRONMENTAL TELEMETRY & ROUTE CONSTRAINTS
          </span>
        </div>
        {isHotDay && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)'
          }}>
            <AlertTriangle size={13} />
            <span>FAA AD 2024-18-09 TRIGGER ACTIVE (OAT ≥ 30°C)</span>
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        alignItems: 'center'
      }}>
        {/* Route / Airports */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
            ROUTE (DEP → ARR)
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={telemetry.depIcao || 'KDEN'}
              onChange={(e) => onChangeTelemetry({ ...telemetry, depIcao: e.target.value.toUpperCase() })}
              className="telemetry-input font-mono"
              style={{ width: '80px', textAlign: 'center', fontWeight: 'bold' }}
              maxLength={4}
            />
            <span style={{ color: 'var(--text-dim)', alignSelf: 'center' }}>→</span>
            <input
              type="text"
              value={telemetry.arrIcao || 'KLAX'}
              onChange={(e) => onChangeTelemetry({ ...telemetry, arrIcao: e.target.value.toUpperCase() })}
              className="telemetry-input font-mono"
              style={{ width: '80px', textAlign: 'center', fontWeight: 'bold' }}
              maxLength={4}
            />
          </div>
        </div>

        {/* Outside Air Temp (OAT) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              OUTSIDE AIR TEMP (OAT)
            </label>
            <span className="font-mono" style={{
              fontSize: '13px',
              fontWeight: 700,
              color: isHotDay ? '#ef4444' : 'var(--hud-cyan)'
            }}>
              {telemetry.oatTemperature > 0 ? `+${telemetry.oatTemperature}` : telemetry.oatTemperature}°C
            </span>
          </div>
          <input
            type="range"
            min="-20"
            max="48"
            value={telemetry.oatTemperature}
            onChange={handleOatChange}
            style={{ width: '100%', accentColor: isHotDay ? '#ef4444' : 'var(--hud-cyan)', cursor: 'pointer' }}
          />
        </div>

        {/* Planned Cruise Flight Level */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              CRUISE CEILING
            </label>
            <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--hud-cyan)' }}>
              FL{telemetry.cruisingAltitude} ({telemetry.cruisingAltitude * 100} ft)
            </span>
          </div>
          <input
            type="range"
            min="180"
            max="410"
            step="10"
            value={telemetry.cruisingAltitude}
            onChange={handleAltitudeChange}
            style={{ width: '100%', accentColor: 'var(--hud-cyan)', cursor: 'pointer' }}
          />
        </div>

        {/* Runway Surface Condition */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
            RUNWAY CONDITION
          </label>
          <select
            value={telemetry.runwayCondition}
            onChange={handleRunwayChange}
            className="telemetry-input font-mono"
            style={{ width: '100%', cursor: 'pointer' }}
          >
            <option value="DRY">DRY (RCAM 6)</option>
            <option value="WET">WET (RCAM 5)</option>
            <option value="CONTAMINATED">SLUSH / CONTAMINATED (RCAM ≤ 4)</option>
          </select>
        </div>

        {/* Toggles: ETOPS & CAT III */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={toggleEtops}
            className={`btn-avionics ${telemetry.isEtops ? 'active' : ''}`}
            style={{ flex: 1, fontSize: '11px', padding: '8px' }}
          >
            <Compass size={13} />
            <span>ETOPS 120+</span>
          </button>

          <button
            onClick={toggleCatIII}
            className={`btn-avionics ${telemetry.isCatIII ? 'active' : ''}`}
            style={{ flex: 1, fontSize: '11px', padding: '8px' }}
          >
            <Eye size={13} />
            <span>CAT III ILS</span>
          </button>
        </div>

      </div>
    </div>
  );
}
