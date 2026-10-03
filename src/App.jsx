import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FlightConfigBar from './components/FlightConfigBar';
import AircraftCockpitView from './components/AircraftCockpitView';
import SystemSelector from './components/SystemSelector';
import DispatchDecisionCard from './components/DispatchDecisionCard';
import RegulatoryConflictAuditor from './components/RegulatoryConflictAuditor';
import SanityMcpTrace from './components/SanityMcpTrace';
import ScenarioPresets from './components/ScenarioPresets';
import SanityProjectModal from './components/SanityProjectModal';
import PICSignoffModal from './components/PICSignoffModal';

import {
  INITIAL_AIRCRAFT_TYPES,
  INITIAL_ATA_SYSTEMS,
  INITIAL_MEL_ITEMS
} from './sanity/dataset/initialData';
import { evaluateFlightDispatch } from './engine/dispatchEngine';
import { sanityService } from './sanity/client';
import { soundEngine } from './sound/avionicsAudio';

export default function App() {
  const [aircraft, setAircraft] = useState(INITIAL_AIRCRAFT_TYPES[0]); // B737-800
  const [selectedFailures, setSelectedFailures] = useState([]);
  const [telemetry, setTelemetry] = useState({
    depIcao: 'KDEN',
    arrIcao: 'KLAX',
    oatTemperature: 22,
    cruisingAltitude: 370,
    runwayCondition: 'DRY',
    isEtops: false,
    isCatIII: false,
    aircraftCeiling: INITIAL_AIRCRAFT_TYPES[0].maxCruisingCeiling
  });

  const [dispatchResult, setDispatchResult] = useState(null);
  const [traceLogs, setTraceLogs] = useState([]);
  const [isSanityModalOpen, setIsSanityModalOpen] = useState(false);
  const [isSignoffModalOpen, setIsSignoffModalOpen] = useState(false);

  // Evaluate dispatch clearance whenever state updates
  useEffect(() => {
    let isMounted = true;

    async function runEval() {
      const result = await evaluateFlightDispatch({
        aircraftId: aircraft._id,
        selectedFailures,
        telemetry: {
          ...telemetry,
          aircraftCeiling: aircraft.maxCruisingCeiling
        }
      });

      if (isMounted) {
        setDispatchResult(result);
        setTraceLogs([...sanityService.getTraceLogs()]);

        // Audio cues based on result
        if (result.verdict === 'STRICT_NO_GO') {
          soundEngine.playWarningHorn();
        } else if (result.verdict === 'CONDITIONAL_GO' && selectedFailures.length > 0) {
          soundEngine.playMasterCaution();
        }
      }
    }

    runEval();

    return () => {
      isMounted = false;
    };
  }, [aircraft, selectedFailures, telemetry]);

  const handleToggleFailure = (itemId) => {
    setSelectedFailures(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAircraft = (newAc) => {
    setAircraft(newAc);
    // filter out failures belonging to the other aircraft
    setSelectedFailures(prev => prev.filter(fId => {
      const itm = INITIAL_MEL_ITEMS.find(m => m._id === fId);
      return itm && itm.aircraftTypeId === newAc._id;
    }));
    setTelemetry(prev => ({ ...prev, aircraftCeiling: newAc.maxCruisingCeiling }));
  };

  const handleApplyScenario = (scenario) => {
    const targetAc = INITIAL_AIRCRAFT_TYPES.find(a => a._id === scenario.aircraftId) || aircraft;
    setAircraft(targetAc);
    setSelectedFailures(scenario.failures);
    setTelemetry(prev => ({
      ...prev,
      ...scenario.telemetry,
      aircraftCeiling: targetAc.maxCruisingCeiling
    }));
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px 24px 60px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Optional subtle CRT scanlines overlay */}
      <div className="scanlines-overlay" />

      {/* Cockpit EFB Header */}
      <Header
        aircraft={aircraft}
        onSelectAircraft={handleSelectAircraft}
        aircraftList={INITIAL_AIRCRAFT_TYPES}
        onOpenSanityModal={() => setIsSanityModalOpen(true)}
      />

      {/* Flight Configuration & Environmental Telemetry */}
      <FlightConfigBar
        telemetry={telemetry}
        onChangeTelemetry={setTelemetry}
      />

      {/* 1-Click Judge Evaluation Scenario Presets */}
      <ScenarioPresets
        onApplyScenario={handleApplyScenario}
      />

      {/* Central Glass Cockpit Dispatch Status */}
      <div style={{ marginBottom: '24px' }}>
        <DispatchDecisionCard
          dispatchResult={dispatchResult}
          onOpenSignoffModal={() => setIsSignoffModalOpen(true)}
        />
      </div>

      {/* Main Grid: Left (Subsystem Topology) & Right (System Fault Matrix) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Left: Aircraft Visual Topology */}
        <AircraftCockpitView
          aircraft={aircraft}
          selectedFailures={selectedFailures}
          melItems={INITIAL_MEL_ITEMS}
          onToggleFailure={handleToggleFailure}
          dispatchResult={dispatchResult}
        />

        {/* Right: ATA 100 System Matrix & Fault Injection */}
        <SystemSelector
          ataSystems={INITIAL_ATA_SYSTEMS}
          melItems={INITIAL_MEL_ITEMS}
          aircraft={aircraft}
          selectedFailures={selectedFailures}
          onToggleFailure={handleToggleFailure}
        />
      </div>

      {/* The Crucial Path 1 Centerpiece: Side-by-Side Regulatory Conflict Auditor */}
      <RegulatoryConflictAuditor
        clashes={dispatchResult?.clashes || []}
      />

      {/* Sanity Context MCP Agent Trace Log & GROQ Terminal */}
      <SanityMcpTrace
        traceLogs={traceLogs}
      />

      {/* Modals */}
      <SanityProjectModal
        isOpen={isSanityModalOpen}
        onClose={() => setIsSanityModalOpen(false)}
      />

      <PICSignoffModal
        isOpen={isSignoffModalOpen}
        onClose={() => setIsSignoffModalOpen(false)}
        aircraft={aircraft}
        telemetry={telemetry}
        dispatchResult={dispatchResult}
        selectedFailures={selectedFailures}
        melItems={INITIAL_MEL_ITEMS}
      />

      {/* Footer */}
      <footer style={{ marginTop: '40px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
        AEROPROOF © 2026 • Built for the DEV Sanity Challenge (Path 1: Ship an Agent That Queries Real Content) • Powered by Sanity Context MCP & Content Lake
      </footer>

    </div>
  );
}
