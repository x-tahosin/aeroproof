export const aircraftTypeSchema = {
  name: 'aircraftType',
  title: 'Aircraft Type & Variant',
  type: 'document',
  fields: [
    { name: 'model', title: 'Model Name', type: 'string' },
    { name: 'icaoCode', title: 'ICAO Designator', type: 'string' },
    { name: 'manufacturer', title: 'Manufacturer', type: 'string' },
    { name: 'engines', title: 'Powerplant Variant', type: 'string' },
    { name: 'maxCruisingCeiling', title: 'Max Ceiling (FL)', type: 'number' },
    { name: 'etopsCertified', title: 'ETOPS Rating', type: 'string' },
    { name: 'catIIICapable', title: 'CAT III Autoland Capable', type: 'boolean' }
  ]
};

export const ataSystemSchema = {
  name: 'ataSystem',
  title: 'ATA 100 System Classification',
  type: 'document',
  fields: [
    { name: 'chapter', title: 'ATA Chapter Number', type: 'number' },
    { name: 'code', title: 'ATA Code', type: 'string' },
    { name: 'name', title: 'System Title', type: 'string' },
    { name: 'description', title: 'System Overview', type: 'text' },
    { name: 'criticalityTier', title: 'Criticality Tier', type: 'string', options: { list: ['FLIGHT_CRITICAL', 'OPERATIONAL_RESTRICTED', 'DISPATCH_CONVENIENCE'] } }
  ]
};

export const melItemSchema = {
  name: 'melItem',
  title: 'Minimum Equipment List (MEL) Item',
  type: 'document',
  fields: [
    { name: 'itemCode', title: 'MEL Sequence Code', type: 'string' },
    { name: 'title', title: 'Equipment Title', type: 'string' },
    { name: 'ataSystem', title: 'ATA Chapter Reference', type: 'reference', to: [{ type: 'ataSystem' }] },
    { name: 'aircraftType', title: 'Aircraft Applicability', type: 'reference', to: [{ type: 'aircraftType' }] },
    { name: 'repairCategory', title: 'Repair Interval Category', type: 'string', options: { list: ['A', 'B', 'C', 'D'] } },
    { name: 'repairIntervalDays', title: 'Repair Interval (Days/Hours)', type: 'string' },
    { name: 'installedQty', title: 'Number Installed', type: 'number' },
    { name: 'requiredQty', title: 'Number Required for Dispatch', type: 'number' },
    { name: 'operationsProcedureRequired', title: '(O) Operations Procedure Required', type: 'boolean' },
    { name: 'maintenanceProcedureRequired', title: '(M) Maintenance Procedure Required', type: 'boolean' },
    { name: 'dispatchConditions', title: 'Standard MMEL Dispatch Relief Conditions', type: 'text' },
    { name: 'altitudeRestrictionFL', title: 'Altitude Ceiling Cap (FL)', type: 'number' }
  ]
};

export const regulatoryDirectiveSchema = {
  name: 'regulatoryDirective',
  title: 'FAA Airworthiness Directive (AD)',
  type: 'document',
  fields: [
    { name: 'adNumber', title: 'Directive ID (e.g. AD 2024-18-09)', type: 'string' },
    { name: 'title', title: 'AD Subject Title', type: 'string' },
    { name: 'issuingAuthority', title: 'Issuing Authority', type: 'string' },
    { name: 'effectiveDate', title: 'Mandatory Effective Date', type: 'date' },
    { name: 'legalPrecedenceRank', title: 'Federal Precedence Rank', type: 'number' }, // 1 is highest (AD > OpsSpec > MMEL)
    { name: 'sourceUrl', title: 'FAA Federal Register Citation URL', type: 'url' },
    { name: 'supersedes', title: 'Supersedes Prior AD/MMEL Clause', type: 'string' },
    { name: 'affectedSystem', title: 'Affected ATA System', type: 'reference', to: [{ type: 'ataSystem' }] },
    { name: 'overrideRule', title: 'Emergency Operational Prohibition / Override', type: 'text' }
  ]
};

export const opsSpecSchema = {
  name: 'opsSpec',
  title: 'Carrier Operations Specification (OpsSpec)',
  type: 'document',
  fields: [
    { name: 'paragraph', title: 'OpsSpec Paragraph (e.g. C055, B043)', type: 'string' },
    { name: 'title', title: 'Operational Specification Title', type: 'string' },
    { name: 'carrier', title: 'Air Carrier Certificate', type: 'string' },
    { name: 'scope', title: 'Operational Scope (ETOPS / CAT III / RVSM)', type: 'string' },
    { name: 'prohibitionClause', title: 'Operational Restriction Clause', type: 'text' }
  ]
};

export const contradictionRuleSchema = {
  name: 'contradictionRule',
  title: 'Regulatory Contradiction Matrix Rule',
  type: 'document',
  fields: [
    { name: 'ruleId', title: 'Contradiction Rule ID', type: 'string' },
    { name: 'headline', title: 'Clash Headline', type: 'string' },
    { name: 'baselineSource', title: 'Baseline Relief Document (MMEL)', type: 'string' },
    { name: 'baselineClaim', title: 'Baseline Permitted Relief', type: 'text' },
    { name: 'overridingSource', title: 'Overriding Document (AD / OpsSpec)', type: 'string' },
    { name: 'overridingClaim', title: 'Overriding Prohibition / Restriction', type: 'text' },
    { name: 'triggerCondition', title: 'Trigger Environmental/Flight Condition', type: 'string' },
    { name: 'precedenceWinner', title: 'Authoritative Ruling Document', type: 'string' },
    { name: 'legalBasis', title: '14 CFR Statutory Grounding Rationale', type: 'text' },
    { name: 'dispatchVerdict', title: 'Resulting Dispatch Action', type: 'string', options: { list: ['NO_GO', 'CONDITIONAL_GO_RESTRICTED', 'GO'] } }
  ]
};
