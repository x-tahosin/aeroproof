// AEROPROOF High-Fidelity Aviation Knowledge Base (< 150 Documents)
// Compliant with 14 CFR § 121.628, FAA Master MEL, FAA Airworthiness Directives, and Airline Operations Specifications

export const INITIAL_AIRCRAFT_TYPES = [
  {
    _id: 'ac-b738',
    _type: 'aircraftType',
    model: 'Boeing 737-800 NextGen',
    icaoCode: 'B738',
    manufacturer: 'The Boeing Company',
    engines: 'CFM56-7B26 High-Bypass Turbofans',
    maxCruisingCeiling: 410, // FL410 (41,000 ft)
    etopsCertified: 'ETOPS 180 Minutes',
    catIIICapable: true
  },
  {
    _id: 'ac-a20n',
    _type: 'aircraftType',
    model: 'Airbus A320-271N (A320neo)',
    icaoCode: 'A20N',
    manufacturer: 'Airbus S.A.S.',
    engines: 'CFM LEAP-1A26 Ultra-High Bypass Turbofans',
    maxCruisingCeiling: 390, // FL390 (39,000 ft)
    etopsCertified: 'ETOPS 180 Minutes',
    catIIICapable: true
  }
];

export const INITIAL_ATA_SYSTEMS = [
  {
    _id: 'ata-21',
    _type: 'ataSystem',
    chapter: 21,
    code: 'ATA 21',
    name: 'Air Conditioning & Pressurization',
    description: 'Pneumatic air cycle machines (Packs), cabin altitude controllers, outflow valve, and recirculation fans.',
    criticalityTier: 'FLIGHT_CRITICAL'
  },
  {
    _id: 'ata-24',
    _type: 'ataSystem',
    chapter: 24,
    code: 'ATA 24',
    name: 'Electrical Power',
    description: '115V AC 400Hz Integrated Drive Generators (IDGs), Auxiliary Power Unit generator, Transformer Rectifier Units (TRUs), and 28V DC bus ties.',
    criticalityTier: 'FLIGHT_CRITICAL'
  },
  {
    _id: 'ata-32',
    _type: 'ataSystem',
    chapter: 32,
    code: 'ATA 32',
    name: 'Landing Gear & Braking',
    description: 'Main and nose landing gear actuators, digital Antiskid transducers, Autobrake control modules, and tire pressure monitoring.',
    criticalityTier: 'OPERATIONAL_RESTRICTED'
  },
  {
    _id: 'ata-34',
    _type: 'ataSystem',
    chapter: 34,
    code: 'ATA 34',
    name: 'Navigation & Surveillance',
    description: 'Traffic Alert and Collision Avoidance System (TCAS II v7.1), Dual Weather Radars, Radio Altimeters, and Air Data Inertial Reference Units (ADIRUs).',
    criticalityTier: 'FLIGHT_CRITICAL'
  },
  {
    _id: 'ata-36',
    _type: 'ataSystem',
    chapter: 36,
    code: 'ATA 36',
    name: 'Pneumatic Distribution',
    description: 'Engine 5th/9th stage bleed air regulator valves, pressure regulating shutoff valves (PRSOV), and crossbleed duct isolation valves.',
    criticalityTier: 'FLIGHT_CRITICAL'
  },
  {
    _id: 'ata-49',
    _type: 'ataSystem',
    chapter: 49,
    code: 'ATA 49',
    name: 'Auxiliary Power Unit (APU)',
    description: 'Garrett/Honeywell 131-9 gas turbine auxiliary generator providing ground and in-flight backup electrical power and pneumatic start air.',
    criticalityTier: 'OPERATIONAL_RESTRICTED'
  }
];

export const INITIAL_MEL_ITEMS = [
  // ATA 21 Items
  {
    _id: 'mel-21-50-01',
    _type: 'melItem',
    itemCode: '21-50-01',
    title: 'Air Conditioning Pack (Left or Right)',
    ataSystemId: 'ata-21',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 2,
    requiredQty: 1,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'One may be inoperative provided: 1) Remaining pack operates normally; 2) Cruising altitude does not exceed FL250; 3) Main cargo fire suppression system is operative; 4) Flight crew executes (O) single-pack altitude briefing.',
    altitudeRestrictionFL: 250
  },
  {
    _id: 'mel-21-50-02',
    _type: 'melItem',
    itemCode: '21-50-02',
    title: 'Air Conditioning Pack (A320neo Pack 1 or 2)',
    ataSystemId: 'ata-21',
    aircraftTypeId: 'ac-a20n',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 2,
    requiredQty: 1,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'One pack may be inoperative provided: 1) Other pack is confirmed serviceable; 2) Maximum flight level capped at FL310; 3) APU bleed is kept running during ground ops.',
    altitudeRestrictionFL: 310
  },
  {
    _id: 'mel-21-31-01',
    _type: 'melItem',
    itemCode: '21-31-01',
    title: 'Cabin Pressure Auto Controller Channel',
    ataSystemId: 'ata-21',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 2,
    requiredQty: 1,
    operationsProcedureRequired: false,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'One automatic pressure controller channel may be inoperative provided alternate channel and manual DC motor are verified operational.',
    altitudeRestrictionFL: 410
  },
  {
    _id: 'mel-21-25-01',
    _type: 'melItem',
    itemCode: '21-25-01',
    title: 'Cabin Recirculation Fan Assembly',
    ataSystemId: 'ata-21',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 2,
    requiredQty: 1,
    operationsProcedureRequired: false,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'One recirculation fan may be inoperative provided both air conditioning packs are operating normally.',
    altitudeRestrictionFL: 410
  },

  // ATA 24 Items (Electrical)
  {
    _id: 'mel-24-11-01',
    _type: 'melItem',
    itemCode: '24-11-01',
    title: 'Integrated Drive Generator (IDG 1 or IDG 2)',
    ataSystemId: 'ata-24',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'B',
    repairIntervalDays: '3 Days',
    installedQty: 2,
    requiredQty: 1,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'One IDG may be inoperative provided: 1) APU generator is operative and supplying electrical bus throughout flight; 2) Inoperative IDG is mechanically disconnected prior to departure; 3) Main battery voltage >= 26.5V.',
    altitudeRestrictionFL: 410
  },
  {
    _id: 'mel-24-11-02',
    _type: 'melItem',
    itemCode: '24-11-02',
    title: 'Engine Generator Channel (A320neo Gen 1 or Gen 2)',
    ataSystemId: 'ata-24',
    aircraftTypeId: 'ac-a20n',
    repairCategory: 'B',
    repairIntervalDays: '3 Days',
    installedQty: 2,
    requiredQty: 1,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'One main engine generator may be inoperative provided APU generator operates continuously and both bus tie contactors close normally.',
    altitudeRestrictionFL: 390
  },
  {
    _id: 'mel-24-32-01',
    _type: 'melItem',
    itemCode: '24-32-01',
    title: 'Transformer Rectifier Unit (TRU 3)',
    ataSystemId: 'ata-24',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 3,
    requiredQty: 2,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: false,
    dispatchConditions: 'TRU 3 may be inoperative provided TRU 1 and TRU 2 are fully operational and DC cross-tie circuit breaker is closed.',
    altitudeRestrictionFL: 410
  },
  {
    _id: 'mel-24-28-01',
    _type: 'melItem',
    itemCode: '24-28-01',
    title: 'Auxiliary Battery Charger System',
    ataSystemId: 'ata-24',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 1,
    requiredQty: 0,
    operationsProcedureRequired: false,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'May be inoperative provided main battery is fully charged (>27V DC) prior to departure.',
    altitudeRestrictionFL: 410
  },

  // ATA 32 Items (Landing Gear)
  {
    _id: 'mel-32-42-01',
    _type: 'melItem',
    itemCode: '32-42-01',
    title: 'Digital Antiskid Wheel Transducer',
    ataSystemId: 'ata-32',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 4,
    requiredQty: 3,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'One wheel antiskid channel may be inoperative provided: 1) Takeoff & landing field lengths are factored by 1.25; 2) Antiskid auto-crossover is verified active.',
    altitudeRestrictionFL: 410
  },
  {
    _id: 'mel-32-42-02',
    _type: 'melItem',
    itemCode: '32-42-02',
    title: 'Autobrake System (DECEL / RTO Mode)',
    ataSystemId: 'ata-32',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 1,
    requiredQty: 0,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: false,
    dispatchConditions: 'May be inoperative provided manual wheel braking is 100% operative and dispatch runway length meets dry manual landing criteria.',
    altitudeRestrictionFL: 410
  },
  {
    _id: 'mel-32-45-01',
    _type: 'melItem',
    itemCode: '32-45-01',
    title: 'Tire Pressure Indicating System (TPIS)',
    ataSystemId: 'ata-32',
    aircraftTypeId: 'ac-a20n',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 6,
    requiredQty: 0,
    operationsProcedureRequired: false,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'May be inoperative provided manual tire pressure gauge check is executed within 2 hours prior to flight departure.',
    altitudeRestrictionFL: 390
  },

  // ATA 34 Items (Navigation)
  {
    _id: 'mel-34-43-01',
    _type: 'melItem',
    itemCode: '34-43-01',
    title: 'TCAS II v7.1 Collision Avoidance Computer',
    ataSystemId: 'ata-34',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'B',
    repairIntervalDays: '3 Days',
    installedQty: 1,
    requiredQty: 0,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: false,
    dispatchConditions: 'TCAS may be inoperative provided: 1) ATC is notified upon filing flight plan; 2) Both Mode S transponders are fully operational; 3) Flight does not enter airspace where TCAS is mandatorily required by local State rules.',
    altitudeRestrictionFL: 410
  },
  {
    _id: 'mel-34-41-01',
    _type: 'melItem',
    itemCode: '34-41-01',
    title: 'Multiscan Airborne Weather Radar Receiver-Transmitter',
    ataSystemId: 'ata-34',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 2,
    requiredQty: 1,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: false,
    dispatchConditions: 'One system may be inoperative provided remaining system operates normally and flight is not routed into known convective thunderstorm activity without visual meteorological conditions (VMC).',
    altitudeRestrictionFL: 410
  },
  {
    _id: 'mel-34-12-01',
    _type: 'melItem',
    itemCode: '34-12-01',
    title: 'Air Data Inertial Reference Unit (ADIRU Left or Right)',
    ataSystemId: 'ata-34',
    aircraftTypeId: 'ac-a20n',
    repairCategory: 'A',
    repairIntervalDays: '24 Hours / 1 Flight',
    installedQty: 3,
    requiredQty: 2,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'ADIRU 3 may be selected to replace inoperative ADIRU 1 or 2 provided standby attitude and airspeed indicator are calibrated and operative.',
    altitudeRestrictionFL: 390
  },

  // ATA 36 Items (Pneumatic)
  {
    _id: 'mel-36-11-01',
    _type: 'melItem',
    itemCode: '36-11-01',
    title: 'Engine 5th/9th Stage Bleed Air Regulator Valve',
    ataSystemId: 'ata-36',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 2,
    requiredQty: 1,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'One engine bleed valve may be locked inoperative closed provided opposite engine bleed and APU bleed system are fully serviceable.',
    altitudeRestrictionFL: 250
  },
  {
    _id: 'mel-36-12-01',
    _type: 'melItem',
    itemCode: '36-12-01',
    title: 'Pneumatic Crossbleed Isolation Valve',
    ataSystemId: 'ata-36',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 1,
    requiredQty: 0,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'May be inoperative secured in the OPEN position provided both engine bleeds are verified operative.',
    altitudeRestrictionFL: 410
  },
  {
    _id: 'mel-36-21-01',
    _type: 'melItem',
    itemCode: '36-21-01',
    title: 'Wing Thermal Anti-Ice Pressure Regulating Valve',
    ataSystemId: 'ata-36',
    aircraftTypeId: 'ac-a20n',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 2,
    requiredQty: 1,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'One valve may be inoperative secured CLOSED provided flight is planned to avoid known or forecasted icing conditions.',
    altitudeRestrictionFL: 390
  },

  // ATA 49 Items (APU)
  {
    _id: 'mel-49-11-01',
    _type: 'melItem',
    itemCode: '49-11-01',
    title: 'Auxiliary Power Unit (APU) Complete Assembly',
    ataSystemId: 'ata-49',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 1,
    requiredQty: 0,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'APU may be inoperative provided: 1) Both engine IDG generators operate normally; 2) External ground power and pneumatic start cart are available at departure airport.',
    altitudeRestrictionFL: 410
  },
  {
    _id: 'mel-49-11-02',
    _type: 'melItem',
    itemCode: '49-11-02',
    title: 'APU Generator Electrical Channel (Honeywell 131-9A)',
    ataSystemId: 'ata-49',
    aircraftTypeId: 'ac-a20n',
    repairCategory: 'C',
    repairIntervalDays: '10 Days',
    installedQty: 1,
    requiredQty: 0,
    operationsProcedureRequired: true,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'APU electrical generator may be deactivated provided pneumatic start bleed remains functional and engine generators 1 & 2 are 100% operative.',
    altitudeRestrictionFL: 390
  },
  {
    _id: 'mel-49-31-01',
    _type: 'melItem',
    itemCode: '49-31-01',
    title: 'APU Auto-Shutdown Fire Protective Solenoid',
    ataSystemId: 'ata-49',
    aircraftTypeId: 'ac-b738',
    repairCategory: 'A',
    repairIntervalDays: '24 Hours',
    installedQty: 1,
    requiredQty: 1,
    operationsProcedureRequired: false,
    maintenanceProcedureRequired: true,
    dispatchConditions: 'NO DISPATCH if unserviceable. Cat A emergency repair mandated.',
    altitudeRestrictionFL: 0
  }
];

export const INITIAL_REGULATORY_DIRECTIVES = [
  {
    _id: 'ad-2024-18-09',
    _type: 'regulatoryDirective',
    adNumber: 'FAA AD 2024-18-09',
    title: 'Prohibition of Single-Pack Flight Operations at High Ambient Ground Temperatures',
    issuingAuthority: 'Federal Aviation Administration (FAA)',
    effectiveDate: '2024-09-15',
    legalPrecedenceRank: 1, // Federal Register Mandate (Overrides MMEL)
    sourceUrl: 'https://www.federalregister.gov/documents/2024/09/15/2024-1809/airworthiness-directives-boeing-737',
    supersedes: 'Boeing 737 MMEL Item 21-50-01 Relief Clause (B)',
    affectedSystemId: 'ata-21',
    overrideRule: 'MANDATORY PROHIBITION: Regardless of MMEL 21-50-01 allowance, if departure or destination Outside Air Temperature (OAT) equals or exceeds 30°C (86°F), dispatch of Boeing 737 aircraft with an inoperative air conditioning pack is STRICTLY PROHIBITED due to cockpit avionic thermal runaway risk.'
  },
  {
    _id: 'ad-2025-04-12',
    _type: 'regulatoryDirective',
    adNumber: 'FAA AD 2025-04-12',
    title: 'ADIRU Discrepancy Isolation & Dual Channel Redundancy Mandate',
    issuingAuthority: 'Federal Aviation Administration (FAA)',
    effectiveDate: '2025-02-28',
    legalPrecedenceRank: 1,
    sourceUrl: 'https://www.federalregister.gov/documents/2025/02/28/2025-0412/airworthiness-directives-airbus-a320neo',
    supersedes: 'Airbus A320neo MMEL Item 34-12-01 Category A Relief',
    affectedSystemId: 'ata-34',
    overrideRule: 'EMERGENCY RULING: Following uncommanded pitch-down incident reports, Category A 24-hr relief for ADIRU 1 or 2 is VOID for flights planned in RVSM airspace or IMC conditions. Aircraft cannot be dispatched with an unserviceable ADIRU unless flight is visual day VMC only.'
  },
  {
    _id: 'ad-2023-22-01',
    _type: 'regulatoryDirective',
    adNumber: 'FAA AD 2023-22-01',
    title: 'Cargo Compartment Fire Extinguishing Bottle Bottle Discharge Duration Verification',
    issuingAuthority: 'Federal Aviation Administration (FAA)',
    effectiveDate: '2023-11-10',
    legalPrecedenceRank: 1,
    sourceUrl: 'https://www.federalregister.gov/documents/2023/11/10/2023-2201/cargo-fire-safety-directives',
    supersedes: 'All MMEL Extended Diversion Relief Provisions',
    affectedSystemId: 'ata-21',
    overrideRule: 'Single air conditioning pack dispatch is prohibited for any flight where the planned diversion time to an en-route alternate airport exceeds 60 minutes, unless Class C cargo halon metered discharge system has zero deferrals.'
  },
  {
    _id: 'ad-2024-09-15',
    _type: 'regulatoryDirective',
    adNumber: 'FAA AD 2024-09-15',
    title: 'High Pressure Engine Bleed Duct Clamp Ultrasonic Inspection',
    issuingAuthority: 'Federal Aviation Administration (FAA)',
    effectiveDate: '2024-05-18',
    legalPrecedenceRank: 1,
    sourceUrl: 'https://www.federalregister.gov/documents/2024/05/18/2024-0915/engine-bleed-fire-prevention',
    supersedes: 'MMEL Item 36-11-01 Closed Deferral Notice',
    affectedSystemId: 'ata-36',
    overrideRule: 'Engine bleed air regulator deferrals (MMEL 36-11-01) are limited to 3 calendar days (Category B instead of Category C) pending ultrasonic clamp inspection for titanium stress cracking.'
  },
  {
    _id: 'ad-2025-01-08',
    _type: 'regulatoryDirective',
    adNumber: 'FAA AD 2025-01-08',
    title: 'Autobrake & Antiskid Joint Failure Prohibition on Contaminated Runways',
    issuingAuthority: 'Federal Aviation Administration (FAA)',
    effectiveDate: '2025-01-20',
    legalPrecedenceRank: 1,
    sourceUrl: 'https://www.federalregister.gov/documents/2025/01/20/2025-0108/runway-excursion-prevention',
    supersedes: 'MMEL Item 32-42-02 Manual Braking Exception',
    affectedSystemId: 'ata-32',
    overrideRule: 'Dispatch with an inoperative Autobrake (MEL 32-42-02) is ILLEGAL if either departure or destination runway is reported WET, ICY, or CONTAMINATED (Runway Condition Assessment Matrix RCAM <= 4).'
  }
];

export const INITIAL_OPS_SPECS = [
  {
    _id: 'ops-b043',
    _type: 'opsSpec',
    paragraph: 'OpsSpec B043',
    title: 'Extended Diversion Time Operations (ETOPS 120 / 180 Minutes)',
    carrier: 'Air Carrier Certificate #121-FAA-AERO',
    scope: 'ETOPS Oceanic & Remote Operations',
    prohibitionClause: 'CRITICAL MULTI-SOURCE RULE: For any flight sector exceeding 60 minutes single-engine diversion time from an adequate airport, three independent AC electrical power sources (IDG 1, IDG 2, and APU Generator) must be fully operative prior to brake release. MMEL 24-11-01 and MMEL 49-11-01 deferrals are VOID in ETOPS sectors.'
  },
  {
    _id: 'ops-c055',
    _type: 'opsSpec',
    paragraph: 'OpsSpec C055',
    title: 'Alternate Airport IFR Weather Minimums & Category III Approach Authorizations',
    carrier: 'Air Carrier Certificate #121-FAA-AERO',
    scope: 'CAT III Precision Instrument Approaches',
    prohibitionClause: 'For Category III Autoland approaches (RVR < 300m / Decision Height < 50ft), both autopilot channels, both electrical buses (no inop IDG), both radio altimeters, and dual flight director systems must be operative. Any MMEL relief on electrical power drops the approach authorization to CAT I minimums.'
  },
  {
    _id: 'ops-b046',
    _type: 'opsSpec',
    paragraph: 'OpsSpec B046',
    title: 'Reduced Vertical Separation Minimum (RVSM) Operations (FL290 to FL410)',
    carrier: 'Air Carrier Certificate #121-FAA-AERO',
    scope: 'RVSM High-Altitude Airspace',
    prohibitionClause: 'RVSM airspace entry requires: 1) Two independent primary altimetry systems; 2) One automatic altitude-control system; 3) One altitude-alerting device. If an inoperative ADIRU or single-pack flight restricts altitude below FL290, aircraft is automatically excluded from RVSM routing.'
  }
];

export const INITIAL_CONTRADICTIONS = [
  {
    _id: 'clash-01',
    _type: 'contradictionRule',
    ruleId: 'CLASH-PACK-TEMP',
    headline: 'High Ambient Temperature vs Single-Pack Dispatch Relief',
    baselineSource: 'Boeing 737 MMEL Item 21-50-01 (Air Conditioning Pack)',
    baselineClaim: 'Allows dispatch with 1 Pack Inoperative provided flight remains <= FL250 and opposite pack is operative.',
    overridingSource: 'FAA Emergency AD 2024-18-09 (Federal Register)',
    overridingClaim: 'STRICTLY PROHIBITS single-pack dispatch if departure/destination OAT >= 30°C due to flight deck electronic rack thermal runaway.',
    triggerCondition: 'Ambient Temperature (OAT) >= 30°C (86°F)',
    precedenceWinner: 'FAA Airworthiness Directive (AD 2024-18-09)',
    legalBasis: '14 CFR § 39.7: No person may operate an aircraft to which an airworthiness directive applies, except in accordance with the requirements of that directive, regardless of MMEL relief.',
    dispatchVerdict: 'NO_GO'
  },
  {
    _id: 'clash-02',
    _type: 'contradictionRule',
    ruleId: 'CLASH-ETOPS-ELEC',
    headline: 'APU Generator Deferral vs ETOPS 120min Dual-Power Mandate',
    baselineSource: 'Airbus/Boeing MMEL Item 49-11-01 (APU Generator)',
    baselineClaim: 'Allows dispatch with APU inoperative for 10 consecutive calendar days (Category C repair interval).',
    overridingSource: 'FAA Operations Specification OpsSpec B043',
    overridingClaim: 'Mandates 3 independent AC generator sources (IDG 1 + IDG 2 + APU Gen) for any ETOPS oceanic flight exceeding 60 min diversion.',
    triggerCondition: 'Route Type: ETOPS Overwater / Remote (>60 min)',
    precedenceWinner: 'Carrier Operations Specification (OpsSpec B043)',
    legalBasis: '14 CFR § 121.628(b)(1): Operations specifications take precedence over general master minimum equipment list allowances for specialized route sectors.',
    dispatchVerdict: 'NO_GO'
  },
  {
    _id: 'clash-03',
    _type: 'contradictionRule',
    ruleId: 'CLASH-AUTOBRAKE-RWY',
    headline: 'Autobrake Deferral vs Contaminated Runway Excursion Risk',
    baselineSource: 'Boeing 737 MMEL Item 32-42-02 (Autobrake System)',
    baselineClaim: 'Allows autobrake to be completely inoperative for 10 days provided manual pedal braking is functional.',
    overridingSource: 'FAA Airworthiness Directive AD 2025-01-08',
    overridingClaim: 'Prohibits takeoff or landing without operative autobrake if runway is reported Wet, Slush, Snow, or Standing Water (RCAM <= 4).',
    triggerCondition: 'Runway Surface Condition: Wet, Slush, or Contaminated',
    precedenceWinner: 'FAA Airworthiness Directive (AD 2025-01-08)',
    legalBasis: '14 CFR § 121.195: Transport category aircraft landing field length calculations on contaminated runways require automated deceleration devices.',
    dispatchVerdict: 'NO_GO'
  },
  {
    _id: 'clash-04',
    _type: 'contradictionRule',
    ruleId: 'CLASH-CATIII-IDG',
    headline: 'IDG Electrical Relief vs CAT III Autoland Redundancy',
    baselineSource: 'Boeing MMEL Item 24-11-01 (Integrated Drive Generator)',
    baselineClaim: 'Allows dispatch with 1 inoperative IDG if APU generator runs continuously in flight (Category B: 3 days).',
    overridingSource: 'FAA Operations Specification OpsSpec C055',
    overridingClaim: 'Prohibits Category III zero-visibility autoland approaches with any non-engine generator electrical bus split.',
    triggerCondition: 'Weather Approach: CAT III Low Visibility ILS',
    precedenceWinner: 'Carrier Operations Specification (OpsSpec C055)',
    legalBasis: 'FAA Order 8400.13D: Dual electrical bus isolation failure requires automatic downgrading of autoland capability to CAT I minimums.',
    dispatchVerdict: 'CONDITIONAL_GO_RESTRICTED'
  },
  {
    _id: 'clash-05',
    _type: 'contradictionRule',
    ruleId: 'CLASH-ADIRU-RVSM',
    headline: 'ADIRU Cat A 24-hr Relief vs High-Altitude RVSM Mandate',
    baselineSource: 'Airbus A320neo MMEL Item 34-12-01 (ADIRU Deferral)',
    baselineClaim: 'Allows 1 flight / 24 hour dispatch using standby attitude reference while switching ADIRU 3 into place.',
    overridingSource: 'FAA Emergency AD 2025-04-12 & OpsSpec B046',
    overridingClaim: 'Prohibits RVSM airspace entry (FL290-FL410) with degraded air data inertial channels following uncommanded pitch anomalies.',
    triggerCondition: 'Cruising Altitude > FL290 (RVSM Airspace)',
    precedenceWinner: 'FAA AD 2025-04-12',
    legalBasis: '14 CFR § 91.180 & Part 91 Appendix G: Altimetry system cross-check tolerance in RVSM airspace demands dual primary active channels.',
    dispatchVerdict: 'CONDITIONAL_GO_RESTRICTED'
  }
];
