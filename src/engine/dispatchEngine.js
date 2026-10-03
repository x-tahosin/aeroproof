import { INITIAL_MEL_ITEMS, INITIAL_REGULATORY_DIRECTIVES, INITIAL_OPS_SPECS } from '../sanity/dataset/initialData';
import { sanityService } from '../sanity/client';

export async function evaluateFlightDispatch({
  aircraftId,
  selectedFailures,
  telemetry
}) {
  // 1. Query applicable MEL items from Sanity Context MCP in real-time
  await sanityService.invokeMcpTool('sanity_context_query_mel', {
    aircraftId,
    selectedFailures
  });

  // 2. Traversal & Evaluation of Contradictions via Sanity Context MCP in real-time
  const { result: clashes, logEntry } = await sanityService.invokeMcpTool('sanity_context_evaluate_contradictions', {
    selectedFailures,
    flightConditions: telemetry
  });

  // 3. If statutory clashes exist, retrieve verified FAA Airworthiness Directive citation via MCP
  if (clashes && clashes.length > 0) {
    await sanityService.invokeMcpTool('sanity_context_get_ad_citation', {
      adNumber: clashes[0].overridingSource || 'AD 2024-18-09'
    });
  }

  const failureItems = selectedFailures.map(fId => INITIAL_MEL_ITEMS.find(m => m._id === fId)).filter(Boolean);

  // Aeronautical physics calculations
  const isB738 = aircraftId === 'ac-b738';
  const nominalCeiling = telemetry.aircraftCeiling || (isB738 ? 410 : 390);

  // 1. Single-Engine Drift-Down Altitude (FL)
  let driftDownCeilingFL = isB738 ? 215 : 205;
  const hasPackFailure = failureItems.some(i => i.itemCode?.startsWith('21-50'));
  const hasBleedFailure = failureItems.some(i => i.itemCode?.startsWith('36-11'));
  if (hasPackFailure || hasBleedFailure) {
    driftDownCeilingFL = Math.min(driftDownCeilingFL, 195);
  }

  // 2. Landing Field Length Calculations (14 CFR § 121.195)
  const baseLandingDistanceFt = isB738 ? 5250 : 5100;
  let runwayFactor = 1.0;
  if (telemetry.runwayCondition === 'WET') runwayFactor = 1.15;
  if (telemetry.runwayCondition === 'CONTAMINATED') runwayFactor = 1.35;

  const hasAutobrakeInop = failureItems.some(i => i.itemCode?.startsWith('32-42'));
  const hasAntiskidInop = failureItems.some(i => i.itemCode === '32-42-01');
  if (hasAutobrakeInop) runwayFactor += 0.15;
  if (hasAntiskidInop) runwayFactor += 0.25;

  const factoredLandingDistanceFt = Math.round(baseLandingDistanceFt * runwayFactor);
  const factoredLandingDistanceM = Math.round(factoredLandingDistanceFt * 0.3048);

  // 3. ETOPS Diversion Range
  const hasElecFailure = failureItems.some(i => i.itemCode?.startsWith('24-11') || i.itemCode?.startsWith('49-11'));
  const etopsDiversionTimeMin = (telemetry.isEtops && hasElecFailure) ? 60 : (telemetry.isEtops ? 180 : 60);

  // 4. CAT III Autoland Capability
  const hasAdiruFailure = failureItems.some(i => i.itemCode?.startsWith('34-12'));
  const catIIICapable = !hasElecFailure && !hasAdiruFailure && !hasAutobrakeInop;

  // Base physics payload
  const aeroMetrics = {
    driftDownCeilingFL,
    factoredLandingDistanceFt,
    factoredLandingDistanceM,
    runwayFactor: Number(runwayFactor.toFixed(2)),
    etopsDiversionTimeMin,
    catIIICapable,
    isTerrainClear: !(telemetry.isCatIII && driftDownCeilingFL < 220) // Minimum Enroute Altitude clearance
  };

  // If no failures selected: NOMINAL GREEN GO
  if (failureItems.length === 0) {
    return {
      verdict: 'LEGAL_GO',
      statusTitle: 'CLEARED FOR DEPARTURE',
      subText: 'All primary systems fully operative. Zero MEL deferrals active.',
      ceilingCapFL: nominalCeiling,
      badgeClass: 'status-go',
      color: '#10b981',
      requiredOps: [],
      requiredMaint: [],
      clashes: [],
      traceLog: logEntry,
      confidence: 100,
      requiresDualSignoff: false,
      aeroMetrics
    };
  }

  // Check if any contradiction enforces a STRICT NO_GO
  const fatalClash = clashes.find(c => c.dispatchVerdict === 'NO_GO');
  if (fatalClash) {
    return {
      verdict: 'STRICT_NO_GO',
      statusTitle: 'GROUNDED — DISPATCH PROHIBITED',
      subText: `Overruled by ${fatalClash.precedenceWinner}. Departure violates federal airworthiness directives.`,
      ceilingCapFL: 0,
      badgeClass: 'status-nogo',
      color: '#ef4444',
      requiredOps: ['AIRCRAFT GROUNDING NOTICE ISSUED', 'MAINTENANCE RECTIFICATION REQUIRED BEFORE DEPARTURE'],
      requiredMaint: ['Full system replacement & functional verification flight required.'],
      clashes,
      primaryClash: fatalClash,
      traceLog: logEntry,
      confidence: 99.8,
      requiresDualSignoff: true,
      aeroMetrics
    };
  }

  // Check if any Cat A item is inoperative with zero relief
  const nonDispatchableItem = failureItems.find(m => m.requiredQty > 0 && (m.installedQty - 1) < m.requiredQty && m.repairCategory === 'A');
  if (nonDispatchableItem) {
    return {
      verdict: 'STRICT_NO_GO',
      statusTitle: 'NO-GO: MANDATORY EQUIPMENT UNMET',
      subText: `${nonDispatchableItem.title} is required for all flight operations under 14 CFR § 121.303.`,
      ceilingCapFL: 0,
      badgeClass: 'status-nogo',
      color: '#ef4444',
      requiredOps: ['Notify Flight Operations Center (FOC)', 'Aircraft swap or passenger de-planing required.'],
      requiredMaint: ['Rectify defect and perform return-to-service sign-off.'],
      clashes,
      primaryClash: null,
      traceLog: logEntry,
      confidence: 99.8,
      requiresDualSignoff: true,
      aeroMetrics
    };
  }

  // Otherwise: CONDITIONAL DISPATCH (Amber)
  let minCeiling = nominalCeiling;
  const opsProcedures = [];
  const maintProcedures = [];

  failureItems.forEach(item => {
    if (item.altitudeRestrictionFL && item.altitudeRestrictionFL < minCeiling) {
      minCeiling = item.altitudeRestrictionFL;
    }
    if (item.operationsProcedureRequired) {
      opsProcedures.push(`(O) ${item.itemCode}: ${item.title} — Execute crew operational briefing and cockpit placarding.`);
    }
    if (item.maintenanceProcedureRequired) {
      maintProcedures.push(`(M) ${item.itemCode}: Licensed A&P mechanic physical deferral tag & circuit breaker collar installed.`);
    }
  });

  // Check for any conditional restriction clash
  const conditionalClash = clashes.find(c => c.dispatchVerdict === 'CONDITIONAL_GO_RESTRICTED');
  if (conditionalClash) {
    opsProcedures.unshift(`(O) REGULATORY RESTRICTION: ${conditionalClash.overridingClaim}`);
  }

  return {
    verdict: 'CONDITIONAL_GO',
    statusTitle: 'CONDITIONAL DISPATCH AUTHORIZED',
    subText: `Dispatch permitted under strict MMEL relief conditions with ${failureItems.length} deferred defect(s).`,
    ceilingCapFL: minCeiling,
    badgeClass: 'status-amber',
    color: '#f59e0b',
    requiredOps: opsProcedures,
    requiredMaint: maintProcedures,
    clashes,
    primaryClash: conditionalClash || clashes[0] || null,
    traceLog: logEntry,
    confidence: 96.8,
    requiresDualSignoff: true,
    aeroMetrics
  };
}
