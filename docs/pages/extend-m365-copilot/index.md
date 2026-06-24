---
title: Extend Microsoft 365 Copilot
---

<div data-widget="landinghero"
     data-badge="🤖 Developer path"
     data-badge-color="blue"
     data-title="Extend Microsoft 365 Copilot"
     data-subtitle="Build customized assistants with Declarative Agents. From fundamentals to production-grade security and rich interactive UI — all in one coherent narrative."
     data-path="0::Prerequisites (E0)|1::Fundamentals (E-Intro)|2::Build &amp; Integrate|3::Authentication|4::Integration"></div>

<div data-widget="dacompare"
     data-title="What is a Declarative Agent?"
     data-left-label="Microsoft 365 Copilot (base)"
     data-left-body="General-purpose AI across your M365 data. No domain focus, no custom tools, no branded identity."
     data-right-label="Declarative Agent"
     data-right-body="A focused Copilot persona with custom instructions, domain knowledge, conversation starters, and tool integrations — deployed as an app inside M365 for your organization."
     data-note="Think of it like this: Copilot is a Swiss Army knife. A Declarative Agent is a scalpel — same AI foundation, purpose-built for one job. The three artefacts that define it are &lt;code&gt;manifest.json&lt;/code&gt; (Teams app identity), &lt;code&gt;declarativeAgent.json&lt;/code&gt; (persona + instructions), and optionally &lt;code&gt;ai-plugin.json&lt;/code&gt; (tools/actions)."></div>

## What you're going to build

In the Extend Path of Copilot Developer Camp, you first complete a mandatory on-ramp, then choose a bundle based on your implementation style and scenario.

Your journey is:
- **On-ramp (required): E0 + E1 (NEW)** — Set up your environment and build your first Declarative Agent without TypeSpec
- **Choose your build path:**
     - **MCP path (Bundles A/B)** — Build agent capabilities using MCP servers, then add security, orchestration, and rich UI
     - **API path (Bundle C)** — Build a Declarative Agent that calls a custom API directly (non-MCP)
     - **Connector grounding path (Bundle D)** — Build a Declarative Agent grounded with connectors
     - **CLI tooling path (Bundle E)** — Build and iterate Declarative Agents using CLI-first workflows (WIQD/Evals placeholders)

By the end, you will have an HR-focused Copilot agent that can be adapted to your production architecture, whether your organization uses MCP, direct APIs, connector-grounded data, or CLI-driven validation and evaluation workflows.

<div data-widget="sectionlabel" data-text="Learning path sections"></div>

| Section                            | Labs | Focus                                                 |
| ---------------------------------- | ---- | ------------------------------------------------------- |
| **Mandatory On-ramp**              | E0 + E1 (NEW) | Complete prerequisites and build your first Declarative Agent before any bundle |
| **Bundle A — MCP Foundations**     | E8 + E10 | Build, connect, and secure an MCP server with OAuth/Entra ID |
| **Bundle B — MCP Advanced**        | E8 + E9 + E11 | Add orchestration and rich interactive widget experiences |
| **Bundle C — API-Based Declarative Agent**     | E2 + E3 + E4 + E5 + E6a | Build a Declarative Agent that retrieves data from a custom API (not MCP) |
| **Bundle D — DA with Connectors**  | E2 + E3 + E4 + E7 | Ground your agent using connectors for domain relevance |
| **Bundle E — DA + CLI Tools**      | E12 + E13 (placeholder) | Use CLI-first workflows for tool inspection and eval-driven iteration |

---

## Start here with prerequisites

<div data-widget="onramp"
     data-title="Get your environment ready"
     data-sub="One focused lab prepares your machine and builds your mental model. Time: ~45 min."
     data-steps="Prerequisites &amp; Concepts::preq::Lab E0 — Prerequisites &amp; Concepts::Install every tool, verify every version, and understand MCP, Dev Tunnels, Azurite, and Declarative Agents before building anything.::Go to Lab E0::00-prerequisites"></div>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/index" />