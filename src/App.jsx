import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingHeroView from './components/LandingHeroView';
import MainCockpitView from './components/MainCockpitView';
import SystemsVisualizerView from './components/SystemsVisualizerView';
import AuditorView from './components/AuditorView';
import WhatIfSimulatorView from './components/WhatIfSimulatorView';
import AgentTraceView from './components/AgentTraceView';

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
  const [activeView, setActiveView] = useState('hero'); // 'hero', 'cockpit', 'systems', 'auditor', 'simulator', 'trace'
  const [aircraft, setAircraft] = useState(INITIAL_AIRCRAFT_TYPES[0]); // Boeing 737-800
  const [selectedFailures, setSelectedFailures] = useState([]);
  
  const [telemetry, setTelemetry] = useState({
    depIcao: 'KDEN',
    arrIcao: 'KLAX',
    oatTemperature: 24,
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

  return (
    <div style={{ minHeight: '100vh', padding: '16px 24px 60px', maxWidth: '1480px', margin: '0 auto' }}>
      
      {/* Subtle Hexagonal & Dot Grid */}
      <div className="hex-grid-overlay" />

      {/* Top Navigation Bar */}
      <Navbar
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenSanityModal={() => setIsSanityModalOpen(true)}
      />

      {/* View Switcher */}
      {activeView === 'hero' && (
        <LandingHeroView
          onEnterCockpit={() => setActiveView('cockpit')}
          onSelectView={setActiveView}
        />
      )}

      {activeView === 'cockpit' && (
        <MainCockpitView
          aircraft={aircraft}
          onSelectAircraft={setAircraft}
          telemetry={telemetry}
          onChangeTelemetry={setTelemetry}
          selectedFailures={selectedFailures}
          onToggleFailure={handleToggleFailure}
          dispatchResult={dispatchResult}
          onOpenSignoffModal={() => setIsSignoffModalOpen(true)}
        />
      )}

      {activeView === 'systems' && (
        <SystemsVisualizerView
          aircraft={aircraft}
          selectedFailures={selectedFailures}
          onToggleFailure={handleToggleFailure}
          melItems={INITIAL_MEL_ITEMS}
          dispatchResult={dispatchResult}
        />
      )}

      {activeView === 'auditor' && (
        <AuditorView
          aircraft={aircraft}
          telemetry={telemetry}
          onChangeTelemetry={setTelemetry}
          selectedFailures={selectedFailures}
          onToggleFailure={handleToggleFailure}
          dispatchResult={dispatchResult}
        />
      )}

      {activeView === 'simulator' && (
        <WhatIfSimulatorView
          aircraft={aircraft}
          telemetry={telemetry}
          onChangeTelemetry={setTelemetry}
          selectedFailures={selectedFailures}
          onToggleFailure={handleToggleFailure}
          dispatchResult={dispatchResult}
        />
      )}

      {activeView === 'trace' && (
        <AgentTraceView
          aircraft={aircraft}
          telemetry={telemetry}
          selectedFailures={selectedFailures}
          dispatchResult={dispatchResult}
          traceLogs={traceLogs}
        />
      )}

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
      <footer style={{ marginTop: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
        AEROPROOF © 2026 • Built for the DEV Sanity Challenge (Path 1: Ship an Agent That Queries Real Content) • Powered by Sanity Context MCP & Content Lake
      </footer>

    </div>
  );
}
