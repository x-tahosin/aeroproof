import { INITIAL_MEL_ITEMS, INITIAL_REGULATORY_DIRECTIVES, INITIAL_OPS_SPECS } from '../sanity/dataset/initialData';
import { sanityService } from '../sanity/client';

export async function evaluateFlightDispatch({
  aircraftId,
  selectedFailures,
  telemetry
}) {
  // Call Sanity Context MCP tool to evaluate structured contradictions
  const { result: clashes, logEntry } = await sanityService.invokeMcpTool('sanity_context_evaluate_contradictions', {
    selectedFailures,
    flightConditions: telemetry
  });

  const failureItems = selectedFailures.map(fId => INITIAL_MEL_ITEMS.find(m => m._id === fId)).filter(Boolean);

  // If no failures selected: NOMINAL GREEN GO
  if (failureItems.length === 0) {
    return {
      verdict: 'LEGAL_GO',
      statusTitle: 'CLEARED FOR DEPARTURE',
      subText: 'All primary systems fully operative. Zero MEL deferrals active.',
      ceilingCapFL: telemetry.aircraftCeiling || 410,
      badgeClass: 'status-go',
      color: '#10b981',
      requiredOps: [],
      requiredMaint: [],
      clashes: [],
      traceLog: logEntry,
      confidence: 100,
      requiresDualSignoff: false
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
      confidence: 99.4,
      requiresDualSignoff: true
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
      requiresDualSignoff: true
    };
  }

  // Otherwise: CONDITIONAL DISPATCH (Amber)
  let minCeiling = telemetry.aircraftCeiling || 410;
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
    requiresDualSignoff: true
  };
}
