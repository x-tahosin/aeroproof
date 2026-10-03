---
title: When Two Aviation Manuals Disagree at 34°C: Building AEROPROOF with Sanity Context MCP
published: false
description: How an AI agent uses Sanity Context MCP and structured regulatory graphs to prevent catastrophic aircraft dispatches when FAA Airworthiness Directives secretly overrule Master MEL manuals.
tags: devchallenge, sanitychallenge, sanity, ai
cover_image: https://raw.githubusercontent.com/x-tahosin/aeroproof/main/public/cover.jpg
canonical_url: https://x-tahosin.github.io/aeroproof/
---

*This is a submission for the [Sanity Challenge, Path One: Ship an Agent That Queries Real Content](https://dev.to/challenges/sanity-2026-09-16)*

---

## ⚡ The Fatal Trap: Why Keyword Search Will Kill You at 34°C

Imagine you are a commercial airline flight dispatcher clearing a Boeing 737-800 from Denver (`KDEN`) to Los Angeles (`KLAX`).

Before pushback, the first officer radios maintenance: **Air Conditioning Pack 1 has suffered an uncommanded pneumatic trip.** Maintenance confirms the pack cannot be reset at the gate.

The crew opens their standard digital flight manuals and performs a search for `"air conditioning pack inoperative"`. 

Within milliseconds, standard keyword search or vector RAG finds **Boeing 737 Master Minimum Equipment List (MMEL) Item 21-50-01**:

> *"One pack may be inoperative provided: remaining pack operates normally, and flight altitude does not exceed FL250 (25,000 ft)."*

The captain plans a cruising altitude of FL240. The keyword search is happy. The dispatcher issues a release. The aircraft takes off.

**And ten minutes later, the crew faces an electrical fire in the cockpit.**

Why?

Because on that scorching afternoon in Denver, the outside air temperature on the tarmac was **34°C (93°F)**.

Buried inside the federal register was **FAA Emergency Airworthiness Directive AD 2024-18-09**, which states:

> *"Regardless of MMEL 21-50-01 allowance, if departure or destination Outside Air Temperature (OAT) equals or exceeds 30°C (86°F), dispatch of Boeing 737 aircraft with an inoperative air conditioning pack is STRICTLY PROHIBITED due to flight deck electronic equipment bay thermal runaway risk."*

Under federal aviation law (14 CFR § 39.7), **an Airworthiness Directive carries absolute legal authority and legally overrules the manufacturer's MMEL**.

Taking off was not just an oversight—**it was a federal felony and an existential safety disaster**.

```
+-------------------------------------------------------------------------+
|                  THE KEYWORD SEARCH / VECTOR RAG FAILURE                 |
|                                                                         |
|  Query: "Can we dispatch with Pack 1 inoperative?"                      |
|                                                                         |
|  [Vector / Keyword Search]: Finds MMEL 21-50-01 -> "YES, <= FL250"     |
|                             Verdict: LEGAL GO (FATAL ERROR)             |
|                                                                         |
|  [AEROPROOF Structured Graph]: Traverses:                               |
|       ATA 21 Pack Deferral                                              |
|       -> Environmental Filter: Denver OAT = 34°C (>= 30°C)              |
|       -> Overriding Node: FAA AD 2024-18-09 (Rank 1 Precedence)         |
|       -> Verdict: AIRCRAFT GROUNDED / STRICT NO-GO                      |
+-------------------------------------------------------------------------+
```

When the Sanity team announced the prompt for Path One—***"Build anything that needs an answer it can't afford to get wrong... The strongest submissions will show an agent that only works because the content was structured. If a keyword search would have gotten you the same answer, aim higher"***—I knew exactly what had to be built.

Welcome to **AEROPROOF**.

---

## 🎮 What I Built: AEROPROOF

**AEROPROOF** is an autonomous aviation airworthiness verification engine and Electronic Flight Bag (EFB) glass-cockpit dispatch cockpit powered by **Sanity Context MCP** and **Sanity Content Lake**.

![AEROPROOF Nominal Glass Cockpit Console](https://raw.githubusercontent.com/x-tahosin/aeroproof/main/public/screenshots/cockpit_nominal.png)

It models the complex, multi-layered regulatory architecture of commercial aviation (**Boeing 737-800** and **Airbus A320neo**) across six ATA-100 systems, evaluating deferred defects against federal airworthiness directives, carrier operations specifications, and real-time flight telemetry.

### Core Capabilities

1. **Deterministic Dispatch Decision Engine:** Real-time calculation of **CLEARED FOR DEPARTURE (Green)**, **CONDITIONAL DISPATCH (Amber)**, or **AIRCRAFT GROUNDED (Red)** clearance.
2. **Regulatory Contradiction Arbitration Matrix:** Side-by-side comparative diffing between baseline manufacturer MMEL allowances and overriding FAA AD / Carrier OpsSpec prohibitions, complete with source provenance and 14 CFR statutory citations.
3. **Interactive Airframe Subsystem Topology:** Interactive top-down SVG aircraft schematics linking cockpit nodes across the nose (ATA 34 NAV/TCAS), wing roots (ATA 21 Packs), engines (ATA 24 IDG / ATA 36 Bleed), landing gear (ATA 32 Antiskid/Autobrake), and tail (ATA 49 APU).
4. **Sanity Context MCP Terminal:** Live execution trace displaying exact MCP tool calls, latency in milliseconds, tokens consumed, and relational GROQ queries with graph dereferencing (`->`).
5. **Zero-Asset Procedural Avionics Sound Engine:** Real cockpit Master Caution dual chimes, warning horns, and 3-tone legal dispatch release signals synthesized in real-time using native Web Audio API oscillators.
6. **Captain (PIC) & Dispatcher Dual Sign-Off:** Formatted flight release generator with dynamic airworthiness ceiling caps and ACARS dispatch authorization.

![Hot Day Grounded State](https://raw.githubusercontent.com/x-tahosin/aeroproof/main/public/screenshots/hot_day_grounded.png)

---

## 🚀 Live Demo & Code

- 🌐 **Interactive Glass Cockpit Demo:** [https://x-tahosin.github.io/aeroproof/](https://x-tahosin.github.io/aeroproof/)
- 💻 **GitHub Repository:** [https://github.com/x-tahosin/aeroproof](https://github.com/x-tahosin/aeroproof)
- 📋 **Public Sanity Context Endpoint:** `https://aeroproof-live.api.sanity.io/v2026-03-01/context/mcp`
- 🗄️ **Public Sanity Project ID:** `aeroproof-live` (dataset: `production`)

---

## 🧠 How I Used Sanity: Structured Content vs Probability

Aviation airworthiness is strictly deterministic. A probabilistic language model hallucinating a repair interval or missing an altitude cap can ground a fleet or cause an accident.

Sanity was used not as a flat text repository, but as a **relational graph of airworthiness constraints**.

### 1. The Knowledge Base Schema (< 150 Document Beta Budget)

We modeled 38 interconnected documents in the Sanity Content Lake across six schema types:

```typescript
// Sanity Schema: Contradiction Matrix Rule
export const contradictionRuleSchema = {
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

### 2. Multi-Hop Graph Dereferencing with GROQ

When an agent queries a deferred item in Sanity, it dereferences the entire system chain in a single atomic GROQ query:

```groq
*[_type == "melItem" && itemCode == $code][0] {
  _id,
  itemCode,
  title,
  repairCategory,
  installedQty,
  requiredQty,
  operationsProcedureRequired,
  maintenanceProcedureRequired,
  altitudeRestrictionFL,
  "ataSystem": *[_type == "ataSystem" && _id == ^.ataSystemId][0] {
    chapter, code, name, criticalityTier
  },
  "aircraftType": *[_type == "aircraftType" && _id == ^.aircraftTypeId][0] {
    model, icaoCode, maxCruisingCeiling
  },
  "activeDirectives": *[_type == "regulatoryDirective" && affectedSystemId == ^.ataSystemId] {
    adNumber, legalPrecedenceRank, overrideRule, sourceUrl
  }
}
```

### 3. Sanity Context MCP Agent Tools

The agent interacts with Sanity through dedicated MCP tools:

- `sanity_context_query_mel(aircraftId, ataChapter)`: Retrieves applicable MEL items filtered by airframe variant.
- `sanity_context_evaluate_contradictions(selectedFailures, flightConditions)`: Traverses the contradiction graph to detect whether environmental variables (temperature, runway contamination, ETOPS routing, CAT III visibility) activate higher-priority regulatory overrides.
- `sanity_context_get_ad_citation(adNumber)`: Retrieves the verified federal register citation URL and effective date for human audit trails.

---

## ⚖️ Side-by-Side Contradiction Arbitration

Here is what the **Regulatory Contradiction Arbitration Matrix** produces when the agent detects a conflict:

![Regulatory Contradiction Matrix](https://raw.githubusercontent.com/x-tahosin/aeroproof/main/public/screenshots/arbitration_matrix.png)

### The Legal Hierarchy of Airworthiness

When two documents disagree, AEROPROOF resolves them using federal statutory precedence:

1. **Rank 1: FAA Airworthiness Directives (14 CFR Part 39)** — Mandatory emergency safety orders published in the Federal Register. They supersede all manufacturer manuals.
2. **Rank 2: Carrier Operations Specifications (OpsSpecs)** — Operational contract between the airline and the FAA under 14 CFR § 121.628(b)(1). Governs ETOPS, RVSM, and Low Visibility Autoland.
3. **Rank 3: Manufacturer Master Minimum Equipment List (MMEL)** — General engineering relief baseline.
4. **Rank 4: Flight Crew Operating Manual (FCOM)** — Manufacturer operating guidance.

---

## 🧪 4 Instant Evaluation Scenarios

You can test these directly in the [Live Cockpit](https://x-tahosin.github.io/aeroproof/) with a single click:

| Preset Scenario | Aircraft & Fault | Baseline MMEL Claim | Overriding Mandate | Resulting Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **1. Hot Day Pack Clash** | Boeing 737-800, Pack Inop, OAT 34°C | MMEL 21-50-01 allows dispatch $\le$ FL250 | **FAA AD 2024-18-09** prohibits dispatch if OAT $\ge$ 30°C | **GROUNDED (NO-GO)** |
| **2. Oceanic ETOPS Generator Trap** | Airbus A320neo, APU Gen Inop, ETOPS 120 | MMEL 49-11-02 allows 10-day relief | **OpsSpec B043** mandates 3 AC generators for oceanic sectors | **GROUNDED (NO-GO)** |
| **3. Contaminated Runway Autobrake** | Boeing 737-800, Autobrake Inop, Slush | MMEL 32-42-02 allows manual pedal braking | **FAA AD 2025-01-08** prohibits takeoff on wet/slush runway | **GROUNDED (NO-GO)** |
| **4. ADIRU RVSM Altitude Cap** | Airbus A320neo, ADIRU 2 Inop, FL350 | MMEL 34-12-01 allows Cat A 24-hr relief | **OpsSpec B046** bars degraded ADIRU from RVSM (> FL290) | **CONDITIONAL (Cap FL250)** |

---

## 🔏 Captain (PIC) & Dispatcher Dual Sign-Off

Under **14 CFR § 121.663**, no commercial aircraft can depart without mutual digital concurrence between the Pilot-in-Command (PIC) and a licensed Aircraft Dispatcher.

![Dual Signoff Modal](https://raw.githubusercontent.com/x-tahosin/aeroproof/main/public/screenshots/dual_signoff.png)

When an Airworthiness Directive grounds the flight, the release button is cryptographically locked with an active federal warning. When conditions are compliant, dual authentication generates a formal ACARS dispatch release document.

---

## 📌 Sanity Project Details

As required by the challenge guidelines, here are the public Sanity project parameters:

- **Sanity Project ID:** `aeroproof-live`
- **Dataset:** `production`
- **API Version:** `2026-03-01`
- **Public MCP Context Endpoint:** `https://aeroproof-live.api.sanity.io/v2026-03-01/context/mcp`
- **Schema Source Code:** [src/sanity/schemas/index.js](https://github.com/x-tahosin/aeroproof/blob/main/src/sanity/schemas/index.js)
- **Aviation Graph Dataset:** [src/sanity/dataset/initialData.js](https://github.com/x-tahosin/aeroproof/blob/main/src/sanity/dataset/initialData.js)

---

## 💡 What I Learned

Building AEROPROOF confirmed something profound about the future of AI agents:

**Keyword search and vector similarity search are great for trivia, but lethal for compliance.**

In high-stakes engineering, two documents can share 98% semantic similarity while being 100% legally contradictory. Without structured content, knowledge graph relationships, and explicit contradiction precedence, an AI agent is simply guessing.

Sanity's Content Lake and Context MCP provide the structured semantic spine that turns a conversational chatbot into an enterprise-grade decision engine.

---

*Thank you for reviewing AEROPROOF! Fly safe, and always check your ADs before departure.* 🛫
