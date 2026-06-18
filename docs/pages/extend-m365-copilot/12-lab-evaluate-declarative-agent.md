# Lab: Evaluate Your Declarative Agent with the M365 Copilot Evaluations CLI

In this lab, you'll use the **Microsoft 365 Copilot Agent Evaluations CLI** (`runevals`) to measure the quality of a Declarative Agent automatically. You'll learn how to write test datasets grounded in real operational data, run evaluations, read an HTML report, and use both AI-based and deterministic scoring to improve your agent — without manual testing.

---

## Scenario

Zava Insurance's development team has built a Declarative Agent connected to a live **MCP (Model Context Protocol) server**. The agent gives claims adjusters natural language access to real operational data — active claims, inspection histories, purchase orders, contractors, and inspector assignments — all served by the Zava Claims MCP server built in Lab 08.

The agent is live on their tenant, but the team has a nagging question: **how do they know it returns accurate, relevant answers against real claim data?**

Manual spot-checking doesn't scale. The team needs a repeatable, automated way to:

- Verify the agent retrieves the correct claim details by number
- Confirm it answers aggregation queries accurately (e.g., "which claims are open?")
- Catch regressions when the MCP server data or agent configuration changes
- Test multi-turn conversations where context must persist across follow-up questions

That's exactly what the Agent Evaluations CLI is designed for.

---

## 🎯 Lab Objectives

By completing this lab, you will:

- Install the `@microsoft/m365-copilot-eval` CLI globally
- Configure Azure OpenAI and tenant credentials for LLM-based scoring
- Write an `evals.json` dataset grounded in real Zava claims data
- Run your first automated evaluation and explore the HTML report
- Understand all 7 evaluator types and when to apply each to an MCP-connected agent
- Use `ExactMatch` and `PartialMatch` for deterministic, data-accuracy tests
- Write multi-turn conversation threads that follow a real claim through its lifecycle
- Build a comprehensive accuracy test suite using real claim numbers, names, and statuses

---

## 📚 Prerequisites

Before starting, ensure you have:

- A Microsoft 365 tenant with Copilot licences
- The Zava Insurance Claims Declarative Agent deployed to your tenant *(provisioned in Exercise 1)*
- **Node.js 24.12.0 or later** — check with `node --version`
- An **Azure OpenAI resource** with `gpt-4o-mini` deployed in any Azure subscription you have access to
- Your **Tenant ID**, **Azure OpenAI endpoint**, and **Azure OpenAI API key**
- **VS Code** with the **Microsoft 365 Agents Toolkit** extension installed
- Admin consent granted for the Agent Evaluations CLI WorkIQ client app in your tenant

!!! note "Platform support"
    The CLI supports **Windows** (built-in authentication), **macOS** (requires Microsoft Company Portal installed), and **Linux/WSL** (requires `libwebkit2gtk-4.1-0 libdbus-1-dev python3-gi gir1.2-secret-1` — install with `sudo apt install ...` before running). Install the appropriate broker for your OS before starting.

!!! tip "Already have an agent?"
    If you've already deployed your own Declarative Agent pointing at `https://zava-insurance-mcp.azurewebsites.net/mcp`, skip Exercise 1 and go straight to Exercise 2.

---

## Exercise 1: Set Up the Zava Insurance Claims Agent

In this exercise, you'll provision the **Declarative Agent** from the Copilot Developer Camp repository. The MCP data source is already hosted at `https://zava-insurance-mcp.azurewebsites.net/mcp` — no local server setup required.

!!! note "What is the Zava Insurance MCP server?"
    The Zava Claims MCP server exposes live insurance claims data — claims, inspections, purchase orders, contractors, and inspectors — through standardised MCP tools. It is deployed to Azure and available at `https://zava-insurance-mcp.azurewebsites.net/mcp`. The Declarative Agent calls these tools on behalf of the user to answer natural language questions.

### Step 1: Get the Project

Clone the Copilot Developer Camp repository with a sparse checkout to download only the Zava projects:

```bash
git clone https://github.com/microsoft/copilot-camp.git
cd copilot-camp/src/extend-m365-copilot/path-e-lab12-evaluate-declarative-agent
```

!!! tip "Already cloned copilot-camp?"
    If you've cloned it for another lab, just navigate to the folder:
    ```bash
    cd copilot-camp/src/extend-m365-copilot/path-e-lab08-mcp-server
    ```

You only need the Declarative Agent project:

```
path-e-lab08-mcp-server/
└── zava-insurance-claims/      ← the Declarative Agent project
    ├── appPackage/
    │   ├── declarativeAgent.json   ← points to the hosted MCP server
    │   └── manifest.json
    ├── env/
    │   └── .env.local
    └── teamsapp.yml
```

### Step 2: Provision the Declarative Agent

Open the `zava-insurance-claims/` folder in VS Code:

```bash
code zava-insurance-claims
```

Click the **Microsoft 365 Agents Toolkit** icon in the Activity Bar. Under **ACCOUNTS**, sign in to your Microsoft 365 account. Under **LIFECYCLE**, click **Provision** and choose the `local` environment.

Agents Toolkit builds the app package and uploads it to your tenant. Watch the **Output** panel — provisioning takes 1–2 minutes.

!!! note "MCP server is already running"
    The agent's `declarativeAgent.json` is pre-configured to call `https://zava-insurance-mcp.azurewebsites.net/mcp`. You don't need to start anything locally — the hosted server is always on.

### Step 3: Verify the Agent in Copilot

Open [https://copilot.microsoft.com](https://copilot.microsoft.com). In the agent picker, select **Zava Insurance Claims (local)** and try:

> "Show me the details for claim CN202504990"

The agent should respond with Kimberly King's fire damage claim in Spokane, WA — fetching the data live from the hosted MCP server at `https://zava-insurance-mcp.azurewebsites.net/mcp`. If it responds with accurate claim details, you're ready to evaluate it.

---

## Exercise 2: Install the Evaluations CLI

In this exercise, you'll install the `runevals` CLI globally so it's available from any terminal.

### Step 1: Install the CLI

```bash
npm install -g @microsoft/m365-copilot-eval
```

### Step 2: Verify the Installation

```bash
runevals --version
runevals --help
```

You should see version `1.9.x` or later.

!!! warning "runevals not recognised?"
    Run `npm config get prefix` to find your npm global folder. Add that path (Windows) or `<path>/bin` (macOS/Linux) to your `PATH` environment variable, then reopen your terminal.

### Step 3: Pre-warm the Python Environment (Optional but Recommended)

The CLI uses a Python runtime for LLM-based evaluations, downloaded automatically on first run. Pre-warm it now to avoid delays later:

```bash
runevals --init-only
```

---

## Exercise 3: Configure Your Evaluation Environment

The CLI needs your **tenant ID**, your **Azure OpenAI credentials**, and your **agent ID**. In this exercise, you'll set these up using environment files.

### Step 1: Understand the Environment File Strategy

| Source | When it's used |
|--------|---------------|
| `.env.local` (project root) | Agents Toolkit projects — auto-detected |
| `.env.local.user` (project root) | Secrets override — **never commit** |
| `env/.env.{name}` | Non-ATK projects, loaded with `--env {name}` |
| System environment variables | CI/CD pipelines |

Your Agents Toolkit project already has `.env.local` with `M365_TITLE_ID` and `TEAMS_APP_TENANT_ID`. You only need to add the Azure OpenAI secrets.

### Step 2: Create `.env.local.user`

From inside your `zava-insurance-claims` folder, create `.env.local.user`:

```ini
# .env.local.user — NEVER commit this file

AZURE_AI_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
AZURE_AI_API_KEY="your-api-key-here"
AZURE_AI_API_VERSION="2024-12-01-preview"
AZURE_AI_MODEL_NAME="gpt-4o-mini"
```

!!! warning "Never commit secrets"
    Confirm `.env.local.user` appears in `.gitignore` before your first commit. Run `git status` — if the file appears as untracked, add it to `.gitignore` immediately.

### Step 3: Get Your Azure OpenAI Values

If you don't yet have an Azure OpenAI resource with `gpt-4o-mini`:

1. Open the [Azure Portal](https://portal.azure.com) and search for **Azure OpenAI**
2. Click **Create** → fill in the details → **Review + Create** → **Create**
3. Once deployed, open the resource → go to **Azure AI Foundry** portal
4. Select **Models + Endpoints** → **Deploy Model** → **Deploy base model**
5. Choose **gpt-4o-mini** → **Confirm** → set token capacity to **50K tokens/min** → **Deploy**
6. After deployment, copy the **Endpoint URL** and **API Key** into `.env.local.user`

### Step 4: Confirm Agent Auto-Detection

Open `env/.env.local` and confirm it contains `M365_TITLE_ID`. The CLI reads this automatically to identify your agent — no extra configuration needed.

!!! tip "Don't see M365_TITLE_ID?"
    Run `runevals` from the project folder. The CLI will list all agents in your tenant and let you select the right one interactively.

### Step 5: Grant Admin Consent

The CLI communicates with your M365 Copilot agent through the **WorkIQ** client application. Your tenant admin must grant consent once before first use. Ask your admin to follow the [Grant admin consent guide](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/evaluations-cli-quickstart).

!!! note "You are the admin?"
    In a developer tenant where you have admin rights, the CLI prompts you to grant consent automatically on the first `runevals` run.

---

## Exercise 4: Write Your First Evaluation Dataset

An **eval dataset** is a JSON file containing prompts and expected responses. For an MCP-connected agent, these prompts should be grounded in the **actual data the agent will retrieve** — not hypothetical answers.

The sample dataset loaded into the MCP server includes real claims. Here are key facts to know:

| Claim | Policyholder | Damage type | Status | Estimated loss |
|-------|-------------|------------|--------|---------------|
| CN202504990 | Kimberly King | Fire damage (severe) | Approved | $23,391 |
| CN202504993 | Christopher Anderson | Mold damage (minor) | Open | $3,195 |
| CN202504995 | Emily Johnson | Water damage (severe) | In Repair | $36,683 |
| CN202504999 | Amanda Rodriguez | Structural damage (severe) | Open — Under Investigation | $31,486 |
| CN202505004 | Thomas Anderson | Flooding (moderate) | In Repair | $9,009 |

### Step 1: Understand the Dataset Schema

The CLI auto-discovers eval files in these locations:

```
./prompts.json       ./evals.json       ./tests.json
./evals/prompts.json ./evals/evals.json ./evals/tests.json
```

A minimal eval document:

```json
{
  "schemaVersion": "1.2.0",
  "items": [
    {
      "prompt": "Your question to the agent",
      "expected_response": "What a correct answer should contain"
    }
  ]
}
```

Use `"1.2.0"` to unlock all current features including multi-turn conversations.

### Step 2: Create Your First Dataset

Create `evals/evals.json` inside `zava-insurance-claims/`:

```json
{
  "schemaVersion": "1.2.0",
  "items": [
    {
      "prompt": "Show me the details for claim CN202504990.",
      "expected_response": "Claim CN202504990 belongs to Kimberly King for fire damage and smoke damage at 9901 Valley Rd, Spokane, WA. The estimated loss is $23,391 and the claim status is Approved."
    },
    {
      "prompt": "What claims are currently In Repair?",
      "expected_response": "The following claims are currently In Repair: CN202504995 (Emily Johnson, water damage), CN202505001 (Angela King, wind damage), CN202505004 (Thomas Anderson, flooding), and CN202505007 (Kimberly Williams, hail damage)."
    },
    {
      "prompt": "Who is assigned as adjuster on claim CN202504993?",
      "expected_response": "Claim CN202504993 for Christopher Anderson (mold damage at 6927 Lake View Dr, Salem, OR) is assigned to adjuster adj-003."
    }
  ]
}
```

!!! tip "Writing good expected responses for MCP agents"
    Your `expected_response` should reflect what the agent returns after calling the MCP tool. Include the key facts the agent must surface — policyholder name, claim number, status, location. LLM-based evaluators compare meaning, not exact wording, so precise phrasing isn't required.

### Step 3: Understand What Gets Evaluated by Default

When you run the CLI, **two evaluators run automatically** for every item:

| Evaluator | Type | What it measures | Pass threshold |
|-----------|------|-----------------|---------------|
| **Relevance** | LLM judge | Is the response on-topic and directly answering the question? | Score ≥ 3 (out of 5) |
| **Coherence** | LLM judge | Is the response well-structured and easy to understand? | Score ≥ 3 (out of 5) |

A prompt is marked **Pass** only when every enabled evaluator meets its threshold. The remaining five evaluators are opt-in and explored in Exercise 6.

---

## Exercise 5: Run Your First Evaluation

### Step 1: Run the Evaluation

From inside the `zava-insurance-claims` folder:

```bash
runevals
```

The CLI loads `.env.local` and `.env.local.user`, discovers `evals/evals.json`, sends each prompt to your agent (which calls the MCP server for live data), and scores the responses.

You'll see:

```
🚀 M365 Copilot Agent Evaluations CLI

📂 Loading environment: local
🤖 Agent ID: T_your-title-id.declarativeAgent
📄 Using prompts file: ./evals/evals.json
📊 Running evaluations...

─────────────────────────────────────────────────────────────
✓ Evals completed successfully!

Results saved to: ./.evals/2026-06-18_10-30-45.html
```

!!! note "First-run sign-in"
    A browser window opens asking you to sign in with your M365 account. This is the WorkIQ client requesting permission to send prompts to your agent. Sign in and return to the terminal.

### Step 2: Open the HTML Report

Open the `.html` file from `.evals/` in your browser. It contains:

- A **summary banner** — overall pass rate across all prompts
- **Aggregate statistics** — average scores per evaluator
- **Per-prompt cards** — prompt, agent response, expected response, and per-evaluator scores with LLM reasoning

### Step 3: Examine a Prompt Card

Expand the card for claim CN202504990. You'll see the agent's actual response (retrieved live via the MCP server), your expected response, and a 1–5 score with reasoning.

!!! tip "Reading the reasoning"
    If the Relevance or Coherence score is lower than expected, the reasoning column explains why. For MCP agents, a common cause is the agent returning raw JSON instead of a natural language summary — the reasoning will call this out.

### Step 4: Run With Verbose Logging

```bash
runevals --log-level debug
```

Debug output shows the exact MCP tool calls the agent made, the raw tool responses, and each evaluator's decision. This is your primary debugging tool when an evaluation unexpectedly fails.

!!! warning "Debug output may contain sensitive data"
    Debug logs include raw API payloads. Do not share debug output publicly without first redacting API keys, bearer tokens, and any sensitive claim data.

---

## Exercise 6: Use All 7 Evaluators

This exercise covers the full evaluator set and shows which are most useful for an MCP-connected operational agent.

### Step 1: The Evaluator Reference Table

| Evaluator | Type | Scale | On by default | Best used for |
|-----------|------|-------|--------------|--------------|
| **Relevance** | LLM judge | 1–5 | ✅ Yes | Checking the response addresses the question |
| **Coherence** | LLM judge | 1–5 | ✅ Yes | Checking writing clarity and structure |
| **Groundedness** | LLM judge | 1–5 | No | Verifying the answer is supported by retrieved data, not hallucinated |
| **Similarity** | LLM judge | 1–5 | No | Measuring semantic closeness to expected response |
| **Citations** | Count-based | ≥ 0 | No | Confirming the agent cited sources |
| **ExactMatch** | String match | Pass/Fail | No | Verifying a specific value appears verbatim in the response |
| **PartialMatch** | String match | 0.0–1.0 | No | Checking approximate string overlap with expected response |

!!! note "ExactMatch and PartialMatch are ideal for MCP agents"
    Because the Zava MCP server returns structured, deterministic data, you can write precise tests: if you ask for claim CN202504990's policyholder, the agent **must** return "Kimberly King" — no paraphrase is acceptable. ExactMatch enforces this without any LLM cost.

### Step 2: Enable Groundedness at File Level

For an MCP-connected agent, Groundedness is the most valuable LLM evaluator — it checks whether the agent's answer is actually supported by what the MCP tools returned, rather than made up. Update `evals/evals.json`:

```json
{
  "schemaVersion": "1.2.0",
  "default_evaluators": {
    "Relevance": {},
    "Coherence": {},
    "Groundedness": {}
  },
  "items": [
    {
      "prompt": "Show me the details for claim CN202504990.",
      "expected_response": "Claim CN202504990 belongs to Kimberly King for fire damage and smoke damage at 9901 Valley Rd, Spokane, WA. The estimated loss is $23,391 and the claim status is Approved."
    },
    {
      "prompt": "What claims are currently In Repair?",
      "expected_response": "The following claims are currently In Repair: CN202504995 (Emily Johnson, water damage), CN202505001 (Angela King, wind damage), CN202505004 (Thomas Anderson, flooding), and CN202505007 (Kimberly Williams, hail damage)."
    },
    {
      "prompt": "Who is assigned as adjuster on claim CN202504993?",
      "expected_response": "Claim CN202504993 for Christopher Anderson is assigned to adjuster adj-003."
    }
  ]
}
```

### Step 3: Use ExactMatch for Specific Fact Verification

`ExactMatch` checks whether the `expected_response` string appears verbatim (case-insensitively) in the agent's actual response. Use it when there is one correct answer with no room for paraphrase — a name, a status, a claim number.

Add these four ExactMatch items to your `evals/evals.json` items array. Each verifies a specific fact from the live dataset:

```json
{
  "prompt": "What is the policyholder name for claim CN202504990?",
  "expected_response": "Kimberly King",
  "evaluators": { "ExactMatch": { "case_sensitive": false } },
  "evaluators_mode": "replace"
},
{
  "prompt": "What is the estimated loss for claim CN202505004?",
  "expected_response": "9,009",
  "evaluators": { "ExactMatch": { "case_sensitive": false } },
  "evaluators_mode": "replace"
},
{
  "prompt": "What is the property address for claim CN202504999?",
  "expected_response": "1069 Lake View Dr, Tacoma, WA 98401",
  "evaluators": { "ExactMatch": { "case_sensitive": false } },
  "evaluators_mode": "replace"
},
{
  "prompt": "Who is the policyholder for claim CN202504995?",
  "expected_response": "Emily Johnson",
  "evaluators": { "ExactMatch": { "case_sensitive": false } },
  "evaluators_mode": "replace"
}
```

The two evaluator modes are:

| Mode | Behaviour |
|------|-----------|
| `"extend"` (default) | Per-item evaluators are **added** to the file-level defaults. Both run. |
| `"replace"` | Per-item evaluators **replace** the file-level defaults entirely. Only the per-item evaluators run. |

Using `"replace"` with ExactMatch means no LLM call is made for these items — they're instant, deterministic, and free.

### Step 4: Use PartialMatch for Status Fields

Claim statuses in the dataset include descriptive suffixes (e.g. `"In Repair - Repairs in progress"`). The agent may or may not include the full suffix. Use `PartialMatch` to check that the key status term appears without requiring the exact full string:

```json
{
  "prompt": "What is the current status of claim CN202504993?",
  "expected_response": "Open",
  "evaluators": { "PartialMatch": {} },
  "evaluators_mode": "replace"
},
{
  "prompt": "What is the status of claim CN202504995?",
  "expected_response": "In Repair",
  "evaluators": { "PartialMatch": {} },
  "evaluators_mode": "replace"
}
```

`PartialMatch` scores 0.0–1.0 based on overlap between `expected_response` and the agent's response. A score of 0.5 or higher passes by default. Since "Open" is a short string that should appear unambiguously in any correct answer, this test is nearly as strict as ExactMatch while tolerating minor formatting differences.

### Step 5: Run and Compare

```bash
runevals
```

Your report will now show two tiers of tests:
- The first three prompts scored by Relevance, Coherence, and Groundedness (LLM-based, 1–5)
- The ExactMatch prompts scored as instant Pass/Fail with no LLM cost
- The PartialMatch prompts scored 0.0–1.0

---

## Exercise 7: Test Multi-Turn Conversations

Real claims adjusters don't ask one question — they drill into a claim across multiple turns. In this exercise, you'll write a multi-turn thread that follows claim CN202504990 (Kimberly King's fire damage claim) through a realistic lookup-to-inspection-to-action workflow.

### Step 1: Understand the Multi-Turn Schema

```json
{
  "name": "Thread name shown in the report",
  "turns": [
    {
      "prompt": "First user message",
      "expected_response": "Expected first response"
    },
    {
      "prompt": "Follow-up referencing the first turn",
      "expected_response": "Expected follow-up response"
    }
  ]
}
```

Each thread supports 1–20 turns. Each turn shares the same conversation session — the agent receives the full history before answering each follow-up. Each turn can have its own evaluator configuration.

### Step 2: Write the Claim Lifecycle Thread

This thread walks through claim CN202504990 as a claims adjuster would: look up the claim → review inspection history → confirm recommended action.

**What the MCP data tells us:**
- Claim CN202504990: Kimberly King, fire damage (severe), Approved, $23,391, 9901 Valley Rd Spokane WA
- `insp-001`: initial inspection, **completed** — *"Roof damage is consistent with the claim report."* — recommended: *"Recommend full roof replacement."*
- `insp-002`: re-inspection, **completed** — *"Roof damage confirmed, replacement needed."* — recommended: *"Full replacement recommended"* and *"Obtain multiple quotes"*
- `po-001`: Purchase order PO-2025-001 from Wilson General Contractors — total **$15,209.86**, status: **pending**

Create `evals/multi-turn-claim-CN202504990.json`:

```json
{
  "schemaVersion": "1.2.0",
  "default_evaluators": {
    "Relevance": {},
    "Coherence": {}
  },
  "items": [
    {
      "name": "Claim CN202504990 lifecycle — lookup to action",
      "turns": [
        {
          "prompt": "Pull up all the details for claim CN202504990.",
          "expected_response": "Claim CN202504990 is for Kimberly King, covering fire damage and smoke damage at 9901 Valley Rd, Spokane, WA 99201. The estimated loss is $23,391. The claim is currently Approved and is assigned to adjuster adj-007."
        },
        {
          "prompt": "What inspections have been completed for this claim?",
          "expected_response": "Two inspections have been completed for claim CN202504990. The first (insp-001) found that roof damage is consistent with the claim report and recommended a full roof replacement. The second re-inspection (insp-002) confirmed the roof damage and recommended obtaining multiple quotes for the replacement.",
          "evaluators": {
            "Groundedness": {},
            "ExactMatch": { "case_sensitive": false }
          },
          "evaluators_mode": "extend"
        },
        {
          "prompt": "What is the recommended next step based on those inspections?",
          "expected_response": "Full replacement recommended",
          "evaluators": {
            "ExactMatch": { "case_sensitive": false }
          },
          "evaluators_mode": "replace"
        },
        {
          "prompt": "Is there a purchase order for this claim? If so, what is the total?",
          "expected_response": "15,209.86",
          "evaluators": {
            "ExactMatch": { "case_sensitive": false }
          },
          "evaluators_mode": "replace"
        }
      ]
    }
  ]
}
```

**What each turn tests:**

| Turn | Prompt | Evaluators | What it verifies |
|------|--------|-----------|-----------------|
| 1 | Pull up CN202504990 | Relevance + Coherence | Agent retrieves claim and presents key facts |
| 2 | Inspection history | Relevance + Coherence + Groundedness + ExactMatch | Agent finds both completed inspections and surfaces correct findings |
| 3 | Recommended action | ExactMatch | Agent correctly surfaces "Full replacement recommended" from inspection data |
| 4 | Purchase order total | ExactMatch | Agent retrieves PO-2025-001 and returns the correct total |

!!! note "Why ExactMatch in turn 2?"
    Turn 2 uses `evaluators_mode: "extend"` so all four evaluators run. ExactMatch checks that specific inspection findings appear verbatim. If the agent summarises correctly (relevance ✅, coherent ✅, grounded ✅) but omits the specific finding text, the ExactMatch failure tells you exactly what's missing — without reading the entire response.

### Step 3: Run and Interpret the Thread Report

```bash
runevals --prompts-file ./evals/multi-turn-claim-CN202504990.json
```

In the HTML report, the thread appears as a single expandable card showing:

- **Thread summary**: overall Pass/Fail and turns passed vs. failed
- **Per-turn scores**: expanded individually below

A thread is marked **Fail** if any single turn fails — even if the other three pass.

!!! note "Why threads matter"
    Turn 1 tests whether the agent *knows* the answer. Turns 2–4 test whether it *remembers* what you were talking about and can navigate deeper into the same claim. A failing turn 3 or 4 despite passing turn 1 means the agent loses context — a critical production issue for multi-step workflows.

---

## Exercise 8: Build a Comprehensive Accuracy Test Suite

For an MCP-connected operational agent, the most powerful evaluation strategy is a comprehensive **accuracy test suite** — a collection of ExactMatch and PartialMatch tests covering all entity types the agent can query: claims, inspections, purchase orders, contractors, and inspectors.

Unlike LLM-based evaluators, these tests are deterministic, require no Azure OpenAI calls, and run in seconds. They form your **regression baseline** — run them before and after any agent or MCP server change to catch breaking changes immediately.

### Step 1: Create the Claims Accuracy Test Suite

Create `evals/accuracy-claims.json`. Each test targets a specific data field from the live dataset:

```json
{
  "schemaVersion": "1.2.0",
  "items": [
    {
      "prompt": "What is the policyholder name for claim CN202504990?",
      "expected_response": "Kimberly King",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "What is the policyholder name for claim CN202504995?",
      "expected_response": "Emily Johnson",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "What is the policy number for claim CN202504999?",
      "expected_response": "POL-HO-2025-010",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "What property address is listed for claim CN202504993?",
      "expected_response": "6927 Lake View Dr, Salem, OR 97301",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "What is the status of claim CN202504993?",
      "expected_response": "Open",
      "evaluators": { "PartialMatch": {} },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "What is the estimated loss for claim CN202505004?",
      "expected_response": "9,009",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "Who is the adjuster assigned to claim CN202504990?",
      "expected_response": "adj-007",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    }
  ]
}
```

### Step 2: Create the Inspections Accuracy Test Suite

Create `evals/accuracy-inspections.json`:

```json
{
  "schemaVersion": "1.2.0",
  "items": [
    {
      "prompt": "What are the inspection findings for inspection insp-001 on claim CN202504990?",
      "expected_response": "Roof damage is consistent with the claim report.",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "What was the recommended action from inspection insp-002 on claim CN202504990?",
      "expected_response": "Full replacement recommended",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "What is the status of inspection insp-018 for claim CN202504999?",
      "expected_response": "in-progress",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "Which inspector is assigned to inspection insp-003 for claim CN202504992?",
      "expected_response": "inspector-014",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    }
  ]
}
```

### Step 3: Create the Contractors Accuracy Test Suite

Create `evals/accuracy-contractors.json`:

```json
{
  "schemaVersion": "1.2.0",
  "items": [
    {
      "prompt": "What is the business name for contractor-003?",
      "expected_response": "Wilson General Contractors",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "What is the rating for contractor-026?",
      "expected_response": "4.9",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "Which city is contractor-016 located in?",
      "expected_response": "Portland",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    }
  ]
}
```

### Step 4: Create the Purchase Orders Accuracy Test Suite

Create `evals/accuracy-purchase-orders.json`:

```json
{
  "schemaVersion": "1.2.0",
  "items": [
    {
      "prompt": "What is the total amount for purchase order PO-2025-001?",
      "expected_response": "15,209.86",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "What is the status of purchase order PO-2025-002?",
      "expected_response": "approved",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "Which claim is purchase order PO-2025-003 for?",
      "expected_response": "CN202504995",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    },
    {
      "prompt": "What is the total for purchase order PO-2025-006?",
      "expected_response": "19,929.56",
      "evaluators": { "ExactMatch": { "case_sensitive": false } },
      "evaluators_mode": "replace"
    }
  ]
}
```

### Step 5: Run the Full Accuracy Suite as a Batch

Run all test files in the `evals/` folder in one sweep. Each run produces a timestamped HTML report.

**PowerShell:**

```powershell
Get-ChildItem .\evals\*.json | ForEach-Object {
    $ts  = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
    $out = ".\.evals\$ts-$([IO.Path]::GetFileNameWithoutExtension($_.Name)).html"
    Write-Host "`n=== Running $($_.Name) ===" -ForegroundColor Cyan
    runevals --prompts-file $_.FullName --log-level debug --output $out
}
```

**macOS/Linux (bash):**

```bash
for f in evals/*.json; do
  ts=$(date +%Y-%m-%d_%H-%M-%S)
  name=$(basename "$f" .json)
  runevals \
    --prompts-file "$f" \
    --log-level debug \
    --output ".evals/${ts}-${name}.html"
done
```

!!! tip "Use the accuracy suite as your regression baseline"
    Run the full suite before and after any change to the agent configuration or the MCP server. An ExactMatch failure on a previously-passing test means data was corrupted, a tool response changed format, or the agent prompt stopped extracting the right field. Pin the failing test to the exact change that broke it.

---

## 🎉 Congratulations!

You've completed the Declarative Agent Evaluation lab! Here's what you accomplished:

✅ Installed the `@microsoft/m365-copilot-eval` CLI and configured Azure OpenAI credentials  
✅ Set up the Zava Claims MCP server and Declarative Agent, verified end-to-end connectivity  
✅ Wrote a structured `evals.json` dataset grounded in real claim numbers, names, and statuses  
✅ Ran an automated evaluation and interpreted the per-prompt HTML report  
✅ Enabled all 7 evaluator types and understood which matter most for MCP-connected agents  
✅ Used `ExactMatch` and `PartialMatch` for deterministic, zero-LLM-cost data accuracy tests  
✅ Wrote a 4-turn conversation thread following claim CN202504990 through its lifecycle  
✅ Built a comprehensive accuracy test suite covering claims, inspections, purchase orders, and contractors  

---

## CLI Quick Reference

| Command | What it does |
|---------|-------------|
| `runevals` | Run evals using `.env.local` (default for ATK projects) |
| `runevals --env dev` | Run using `env/.env.dev` |
| `runevals --prompts-file ./evals/my-test.json` | Use a specific dataset file |
| `runevals --prompts "My prompt" --expected "Expected"` | Quick inline single-prompt test |
| `runevals --interactive` | Enter prompts interactively in the terminal |
| `runevals --log-level debug` | Verbose output — shows MCP tool calls and evaluator reasoning |
| `runevals --output results.json` | Save results as JSON instead of HTML |
| `runevals --output results.csv` | Save results as CSV |
| `runevals --concurrency 5` | Run up to 5 prompts in parallel |
| `runevals --init-only` | Set up the Python runtime cache without running evals |
| `runevals cache-info` | Show Python runtime cache details |
| `runevals cache-clear` | Clear and rebuild the Python cache |

---

## 🔗 Additional Resources

- [Agent Evaluations CLI — Microsoft Learn Quickstart](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/evaluations-cli-quickstart)
- [m365-copilot-eval GitHub Repository](https://github.com/microsoft/m365-copilot-eval)
- [Eval Document Schema Reference & Changelog](https://github.com/microsoft/m365-copilot-eval/tree/main/schema)
- [Zava Insurance Claims Agent Source — Copilot Developer Camp](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab08-mcp-server/zava-insurance-claims)
- [Copilot Developer Camp — All Labs](https://aka.ms/copilotcamp)

---


