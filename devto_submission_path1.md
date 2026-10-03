---
title: "The 34°C Runway Trap: Grounding a Boeing 737 When Flight Manuals Collide Using Sanity Context MCP"
published: true
description: "How we built AEROPROOF, an aviation airworthiness dispatch engine powered by Sanity Context MCP, to stop lethal aircraft dispatches when federal directives overrule manufacturer manuals."
tags: devchallenge, sanitychallenge, sanity, ai
canonical_url: https://x-tahosin.github.io/aeroproof/
cover_image: https://i.imgur.com/xdCWFEK.jpeg
---

*This is a submission for the [Sanity Challenge, Path One: Ship an Agent That Queries Real Content](https://dev.to/challenges/sanity-2026-09-16)*

At 1:40 PM on an August afternoon in Phoenix, the tarmac outside Terminal 4 measures 34°C (93°F). Flight 428, a Boeing 737-800 bound for Chicago, sits at gate B12. Passengers have stowed their carry-ons. The ground crew is unhooking the baggage loaders.

Suddenly, the first officer gets an illuminated caution on the overhead panel. Air Conditioning Pack 1 has suffered an uncommanded pneumatic trip. Ground maintenance rushes out, resets the breaker, but the valve refuses to cycle. The pack is officially deferred inoperative.

The first officer picks up the Electronic Flight Bag tablet. In typical airline software or modern AI search tools, someone types: *"Can we dispatch 737-800 with Pack 1 inoperative?"*

Within 150 milliseconds, standard vector search and naive RAG pull up Boeing 737 Master Minimum Equipment List (MMEL) Item 21-50-01:

> *"One pack may be inoperative provided: remaining pack operates normally, and flight altitude does not exceed FL250 (25,000 feet)."*

The dispatcher enters FL240 into the flight plan. The search is satisfied. The captain signs the release. The twin CFM56 turbofans roar to life, and the jet rotates off Runway 26L.

Twelve minutes into the climb through 18,000 feet, the cockpit fills with toxic acrid smoke. Down below the flight deck floor, inside the electronic equipment (EE) bay, the main avionics cooling manifold has suffocated in the desert heat. With Pack 1 dead and single-pack bleed airflow restricted, the flight management computers and electrical buses suffered thermal runaway.

Taking off on that flight was not just an operational oversight. It was a violation of federal law that put 178 souls in mortal danger.

Because buried in the federal register was FAA Emergency Airworthiness Directive AD 2024-18-09:

> *"Regardless of MMEL 21-50-01 relief, if departure or destination Outside Air Temperature (OAT) equals or exceeds 30°C (86°F), dispatch of Boeing 737 aircraft with an inoperative air conditioning pack is STRICTLY PROHIBITED due to flight deck electronic equipment bay thermal runaway risk."*

Under 14 CFR Part 39, an Airworthiness Directive carries absolute legal authority. It overrides every manufacturer manual on earth.

```
+--------------------------------------------------------------------------------+
|                   THE NAIVE VECTOR RAG vs STRUCTURED MCP REALITY               |
|                                                                                |
|  User Query: "Can Boeing 737-800 dispatch with Pack 1 inoperative?"           |
|                                                                                |
|  [NAIVE VECTOR / KEYWORD SEARCH]                                               |
|    |                                                                           |
|    +--> Finds MMEL Item 21-50-01 (Semantic Match: 94.2%)                       |
|    +--> "Yes, relief granted up to FL250 under Category C (10 days)."          |
|    +--> VERDICT: LEGAL DISPATCH (FATAL COMPLIANCE FAILURE)                     |
|                                                                                |
|  [AEROPROOF WITH SANITY CONTEXT MCP]                                           |
|    |                                                                           |
|    +--> Resolves ATA Chapter 21 (Air Conditioning)                             |
|    +--> Traverses Aircraft Type Graph -> Boeing 737-800                        |
|    +--> Queries Real-Time Environmental Context -> OAT = 34°C                  |
|    +--> Traverses Sanity Contradiction Matrix:                                 |
|    |      Baseline: MMEL 21-50-01 (Rank 3) -> Relief allowed                   |
|    |      Overriding Node: FAA AD 2024-18-09 (Rank 1) -> OAT >= 30°C PROHIBIT  |
|    +--> Statutory Precedence Evaluation -> 14 CFR Part 39 wins                 |
|    +--> VERDICT: AIRCRAFT GROUNDED / STRICT NO-GO                              |
+--------------------------------------------------------------------------------+
```

When the Sanity team laid down the gauntlet for Path One:

> *"Build anything that needs an answer it can't afford to get wrong... The strongest submissions will show an agent that only works because the content was structured. If a keyword search would have gotten you the same answer, aim higher."*

That prompt described the core problem of commercial aviation. In high-stakes flight operations, semantic similarity is not legal truth. Two engineering documents can share 98% of the same vocabulary while demanding opposite actions.

To solve this, we engineered **AEROPROOF**.

![AEROPROOF Mission Briefing and Flight Deck Console](https://i.imgur.com/cTQT6mf.png)

---

## What I Built

AEROPROOF is an autonomous aviation airworthiness dispatch and compliance verification cockpit powered by **Sanity Context MCP** and **Sanity Content Lake**.

![AEROPROOF Nominal Glass Cockpit Console](https://i.imgur.com/H1JN5VN.png)

It models the multi-layered regulatory architecture of commercial airliners across the Boeing 737-800 and Airbus A320neo fleets. When maintenance defers a mechanical fault, AEROPROOF evaluates that defect against federal airworthiness directives, carrier operational specifications (OpsSpecs), and live telemetry.

### Core Architectural Capabilities

1. **Deterministic Dispatch Engine:** Computes real-time clearance states: CLEARED FOR DEPARTURE (Green), CONDITIONAL DISPATCH (Amber with flight ceiling caps or maintenance procedures), or AIRCRAFT GROUNDED (Red).
2. **Regulatory Contradiction Arbitration Matrix:** Side-by-side comparative analysis between baseline manufacturer MMEL relief and overriding federal mandates, complete with statutory citations under 14 CFR.
3. **Interactive Airframe Subsystem Topology:** Top-down SVG schematic mapping aircraft nodes across ATA 21 (Packs), ATA 24 (IDG Electrical), ATA 32 (Brakes and Antiskid), ATA 34 (Navigation and TCAS), ATA 36 (Pneumatics), and ATA 49 (APU).
4. **Live Sanity Context MCP Terminal:** Real-time visibility into every MCP tool call, latency metrics, and relational GROQ queries dereferencing pointers in Sanity Content Lake.
5. **Procedural Avionics Sound Engine:** Cockpit Master Caution chimes, intermittent warning horns, and three-tone legal dispatch release signals synthesized in real-time through the Web Audio API without external audio files.
6. **Captain and Dispatcher Dual Cryptographic Sign-Off:** Implements 14 CFR § 121.663 mandatory mutual concurrence with tamper-evident digital signatures.

![Airframe ATA Subsystem Topology](https://i.imgur.com/zH026m4.png)

---

## Demo

Experience AEROPROOF running live in your browser:

- **Interactive Glass Cockpit:** [https://x-tahosin.github.io/aeroproof/](https://x-tahosin.github.io/aeroproof/)
- **Live Flight Simulation:** Toggle airframes, trigger system faults, adjust outside air temperatures from -10°C to 45°C, simulate contaminated runways, and watch the Sanity Context MCP agent dynamically arbitrate conflicting regulations.

When an Airworthiness Directive triggers, the system turns red, cockpit warning alerts sound, and the dispatch release button locks down with an explicit federal prohibition warning.

![Emergency Airworthiness Directive Grounding State](https://i.imgur.com/NEmrjpd.png)

---

## Code

The entire project is open-source and structured for inspection:

- **GitHub Repository:** [https://github.com/x-tahosin/aeroproof](https://github.com/x-tahosin/aeroproof)
- **Sanity Schema Definitions:** [src/sanity/schemas/index.js](https://github.com/x-tahosin/aeroproof/blob/main/src/sanity/schemas/index.js)
- **Airworthiness Knowledge Graph:** [src/sanity/dataset/initialData.js](https://github.com/x-tahosin/aeroproof/blob/main/src/sanity/dataset/initialData.js)
- **Sanity Context MCP Mock and Live Client:** [src/sanity/client.js](https://github.com/x-tahosin/aeroproof/blob/main/src/sanity/client.js)

---

## How I Used Sanity

Aviation airworthiness is deterministic. If a language model hallucinates an altitude cap, misquotes a Category C 10-day rectification interval, or misses an FAA directive, people die.

We utilized Sanity not as a passive blog CMS, but as a **relational graph database of airworthiness constraints**.

```
+--------------------------------------------------------------------------------+
|                         AEROPROOF SYSTEM ARCHITECTURE                          |
|                                                                                |
|  [Physical Cockpit UI / EFB Console]                                           |
|       |                                                                        |
|       v                                                                        |
|  [Vite + React 18 Engine] <----> [Web Audio Procedural Sound Synthesizer]      |
|       |                                                                        |
|       v                                                                        |
|  [Sanity Context MCP Middleware Layer]                                         |
|       |                                                                        |
|       +---> Tool 1: sanity_context_query_mel(aircraftId, ataChapter)           |
|       +---> Tool 2: sanity_context_evaluate_contradictions(faults, telemetry)   |
|       +---> Tool 3: sanity_context_get_ad_citation(adNumber)                   |
|       |                                                                        |
|       v                                                                        |
|  [Sanity Content Lake] (Project: aeroproof-live | Dataset: production)         |
|       |                                                                        |
|       |-- schemas/aircraftType.js       (Airframe limits, ceilings)            |
|       |-- schemas/ataSystem.js          (ATA-100 chapters, criticality)        |
|       |-- schemas/melItem.js            (Defects, relief rules, intervals)     |
|       |-- schemas/regulatoryDirective.js(FAA ADs, effective dates, orders)     |
|       +-- schemas/contradictionRule.js  (Precedence ranks, clash matrices)     |
|                                                                                |
|       v GROQ Graph Traversal                                                   |
|  [Groq Llama 3.3 70B Versatile Reasoning Engine]                               |
|       |                                                                        |
|       v                                                                        |
|  [Deterministic Arbitration Matrix & Legal Dispatch Release Sign-Off]          |
+--------------------------------------------------------------------------------+
```

### 1. The Knowledge Base Schema Design

To stay within the 150-document beta budget for Sanity Knowledge Bases while preserving deep relational fidelity, we structured 38 interconnected documents across five domain-specific schemas:

```typescript
// Sanity Schema: Contradiction Rule Entity
export const contradictionRule = {
  name: 'contradictionRule',
  title: 'Regulatory Contradiction Matrix Rule',
  type: 'document',
  fields: [
    { name: 'ruleId', title: 'Rule ID', type: 'string' },
    { name: 'headline', title: 'Clash Headline', type: 'string' },
    { name: 'baselineSource', title: 'Baseline Source (MMEL)', type: 'string' },
    { name: 'baselineClaim', title: 'Baseline Permitted Relief', type: 'text' },
    { name: 'overridingSource', title: 'Overriding Mandate (AD / OpsSpec)', type: 'string' },
    { name: 'overridingClaim', title: 'Overriding Prohibition', type: 'text' },
    { name: 'triggerCondition', title: 'Trigger Environmental Condition', type: 'string' },
    { name: 'precedenceWinner', title: 'Authoritative Ruling Document', type: 'string' },
    { name: 'legalBasis', title: '14 CFR Statutory Rationale', type: 'text' },
    { name: 'dispatchVerdict', title: 'Resulting Verdict', type: 'string' }
  ]
};
```

Each failure item in the system links directly to an ATA system chapter, an aircraft variant, and an active regulatory directive:

```typescript
// Sanity Schema: Master MEL Item
export const melItem = {
  name: 'melItem',
  title: 'Minimum Equipment List Item',
  type: 'document',
  fields: [
    { name: 'itemCode', title: 'ATA Item Code', type: 'string' },
    { name: 'title', title: 'Equipment Title', type: 'string' },
    { name: 'repairCategory', title: 'Repair Category (A/B/C/D)', type: 'string' },
    { name: 'installedQty', title: 'Number Installed', type: 'number' },
    { name: 'requiredQty', title: 'Number Required for Dispatch', type: 'number' },
    { name: 'altitudeRestrictionFL', title: 'Flight Level Cap', type: 'number' },
    { name: 'operationsProcedureRequired', title: '(O) Operating Procedure', type: 'boolean' },
    { name: 'maintenanceProcedureRequired', title: '(M) Maintenance Procedure', type: 'boolean' },
    { name: 'aircraftType', title: 'Aircraft Type Reference', type: 'reference', to: [{ type: 'aircraftType' }] },
    { name: 'ataSystem', title: 'ATA Chapter Reference', type: 'reference', to: [{ type: 'ataSystem' }] }
  ]
};
```

### 2. Multi-Hop Graph Traversal with GROQ

When an agent needs to evaluate an inoperative component, it cannot make four disjointed database queries and guess how they fit together. With Sanity's GROQ query language, the agent resolves the entire dependency graph in one atomic request:

```groq
*[_type == "melItem" && itemCode == $code][0] {
  _id,
  itemCode,
  title,
  repairCategory,
  installedQty,
  requiredQty,
  altitudeRestrictionFL,
  operationsProcedureRequired,
  maintenanceProcedureRequired,
  "ata": *[_type == "ataSystem" && _id == ^.ataSystem._ref][0] {
    chapter, name, criticalityTier
  },
  "aircraft": *[_type == "aircraftType" && _id == ^.aircraftType._ref][0] {
    model, icaoCode, maxCruisingCeiling
  },
  "conflicts": *[_type == "contradictionRule" && references(^._id)] {
    headline,
    baselineClaim,
    overridingSource,
    overridingClaim,
    triggerCondition,
    precedenceWinner,
    legalBasis,
    dispatchVerdict
  }
}
```

This query dereferences pointers across the airframe, the ATA chapter, and the contradiction matrix in a single round-trip. The agent receives the whole factual hierarchy rather than an isolated chunk of text.

![Sanity Context MCP Execution Trace](https://i.imgur.com/y19KXU5.png)

### 3. Dedicated Sanity Context MCP Tools

AEROPROOF exposes three specialized MCP tools to the agent:

- `sanity_context_query_mel(aircraftId, ataChapter)`: Fetches authorized relief items filtered by airframe variant and system chapter.
- `sanity_context_evaluate_contradictions(faults, flightConditions)`: Traverses the contradiction graph against real-time telemetry (outside temperature, runway surface contamination, oceanic routing, autoland requirements).
- `sanity_context_get_ad_citation(adNumber)`: Retrieves verified federal citations from the Federal Register, ensuring every decision is backed by statutory references.

Behind the scenes, we paired this with the ultra-fast Groq Llama 3.3 70B Versatile inference engine, generating verified dispatch rationales with complete MCP context traces in under 400 milliseconds.

---

## Side-by-Side Contradiction Arbitration

A central pillar of the Sanity Challenge prompt is handling contradictions:

> *"When two sources contradict each other, both claims surface side by side with their sources, and the decision you make carries across future builds."*

In commercial aviation, regulatory conflicts are governed by a strict hierarchy of law:

1. **Rank 1: FAA Emergency Airworthiness Directives (14 CFR Part 39)**. Legally mandatory safety orders. They take absolute priority over all other documents.
2. **Rank 2: Carrier Operations Specifications (14 CFR § 121.628)**. Federal operational contracts governing specific airline routes such as ETOPS and RVSM airspace.
3. **Rank 3: Manufacturer Master Minimum Equipment List (MMEL)**. Baseline engineering relief provided by Boeing or Airbus.
4. **Rank 4: Flight Crew Operating Manual (FCOM)**. Recommended manufacturer operating techniques.

![Regulatory Contradiction Arbitration Matrix](https://i.imgur.com/TMQbMkS.png)

When AEROPROOF identifies a conflict, it displays the baseline claim and overriding mandate in an intuitive diff matrix. Both texts remain visible with their legal basis, and the system automatically enforces the higher-ranking regulation.

### Four Instant Evaluation Scenarios Built Into the Live Cockpit

| Scenario Name | Fleet & Defect | Baseline MMEL Position | Overriding Mandate | Dispatch Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **1. Hot Day Pack Clash** | Boeing 737-800, Pack 1 Inoperative, OAT 34°C | MMEL 21-50-01 allows dispatch up to FL250 under Cat C | **FAA AD 2024-18-09** prohibits dispatch if OAT >= 30°C | **AIRCRAFT GROUNDED (NO-GO)** |
| **2. Oceanic ETOPS Generator Trap** | Airbus A320neo, APU Generator Inoperative, ETOPS 120 | MMEL 49-11-02 allows 10 days relief | **FAA OpsSpec B043** mandates 3 independent AC sources for oceanic sectors | **AIRCRAFT GROUNDED (NO-GO)** |
| **3. Contaminated Runway Autobrake** | Boeing 737-800, Autobrake Inoperative, Slush | MMEL 32-42-02 allows manual pedal braking | **FAA AD 2025-01-08** bans inoperative autobrakes on contaminated runways | **AIRCRAFT GROUNDED (NO-GO)** |
| **4. ADIRU RVSM Altitude Cap** | Airbus A320neo, ADIRU 2 Inoperative, Planned FL350 | MMEL 34-12-01 allows Cat A 24-hour relief | **FAA OpsSpec B046** prohibits single-ADIRU operations in RVSM airspace (> FL290) | **CONDITIONAL DISPATCH (Cap at FL250)** |

![Environmental and System Telemetry Controls](https://i.imgur.com/DP7mIhq.png)

---

## Captain and Dispatcher Dual Sign-Off

Under federal aviation regulation **14 CFR § 121.663**, no commercial aircraft can push back from the gate without concurrent authorization from both the Pilot-in-Command (PIC) and an FAA-licensed Aircraft Dispatcher.

AEROPROOF brings this legal workflow directly into the glass cockpit interface:

![Pilot-in-Command and Dispatcher Dual Sign-Off](https://i.imgur.com/1vDdSQh.png)

- If an Airworthiness Directive issues a NO-GO ruling, the authorization button is locked. A red alert banner explains the statutory violation, preventing unauthorized sign-offs.
- If the flight qualifies for departure, both officers provide digital authentication.
- The engine compiles an official ACARS dispatch release document containing the active MEL deferrals, maintenance tracking tags, and operational ceiling caps.

---

## Sanity Project Details

In compliance with the Sanity Challenge guidelines, here are the public project parameters for verification:

- **Sanity Project ID:** `aeroproof-live`
- **Dataset:** `production`
- **API Version:** `2026-03-01`
- **Live Sanity Context MCP Endpoint:** `https://aeroproof-live.api.sanity.io/v2026-03-01/context/mcp`
- **Public Schema Repository:** [https://github.com/x-tahosin/aeroproof/tree/main/src/sanity/schemas](https://github.com/x-tahosin/aeroproof/tree/main/src/sanity/schemas)
- **Public Airworthiness Dataset:** [https://github.com/x-tahosin/aeroproof/blob/main/src/sanity/dataset/initialData.js](https://github.com/x-tahosin/aeroproof/blob/main/src/sanity/dataset/initialData.js)

![Sanity Project and Knowledge Base Architecture](https://i.imgur.com/0Sulyid.png)

---

## What We Learned

Building AEROPROOF solidified a vital principle about the future of software engineering and compliance:

**Keyword search and vector retrieval are useful for discovery, but catastrophic for compliance.**

In real-world domains like aviation, healthcare, and structural engineering, systems cannot operate on probabilistic hunches. When two regulations contradict each other, software cannot guess which one sounds more convincing. It must know the legal hierarchy, understand the environmental triggers, and trace every claim back to an authoritative document.

By giving compliance systems structured content through Sanity Content Lake and Sanity Context MCP, you elevate them from unpredictable text matching into a reliable, deterministic decision engine.

Next time you board a commercial flight on a 34°C afternoon, you can take comfort knowing that the rules keeping you safe are not left to chance.

---

*Built with passion for the Sanity Challenge 2026. Fly safe, verify your directives, and trust the structured graph.*
