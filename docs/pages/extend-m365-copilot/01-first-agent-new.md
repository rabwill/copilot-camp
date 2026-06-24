# Lab E1 (NEW): Your First Declarative Agent

<div data-widget="hero"
  data-badge="On-ramp · Lab E1 (NEW)"
  data-badge-color="blue"
  data-icon="🧰"
  data-title="Your First Declarative Agent"
  data-subtitle="Scaffold, customize, provision, and test a minimal Declarative Agent so you're ready for all bundles."
  data-time="30-45 min"
  data-requires="Lab E0"
  data-toolkit="Microsoft 365 Agents Toolkit"></div>

<div data-widget="checklist"
  data-items="First Declarative Agent scaffolded~Created from Agents Toolkit with no actions|Agent identity and instructions customized~Updated declarativeAgent.json and instruction.txt|Provision and test loop completed~Validated edit -> provision -> test workflow in Copilot"></div>

## Key concepts before you build

<div data-widget="concepts"
  data-cards="Declarative Agent anatomy::purple::Three core files::&lt;code&gt;declarativeAgent.json&lt;/code&gt; defines behavior, &lt;code&gt;instruction.txt&lt;/code&gt; defines policy/prompting, and &lt;code&gt;manifest.json&lt;/code&gt; defines app packaging metadata.||No Action template::teal::Start minimal on purpose::This template removes API complexity so you can focus on the core provisioning and testing loop first.||Provisioning lifecycle::blue::Edit -> provision -> test::Most labs follow this same cycle. E1 establishes the exact workflow you'll reuse in bundles A-D."></div>

In this lab, you will scaffold, configure, provision, and test your first Declarative Agent using Microsoft 365 Agents Toolkit, without TypeSpec and without backend APIs. This lab is the mandatory bridge between prerequisites and all bundle tracks.

## Scenario

You have joined the Zava Insurance developer team. Before building MCP-powered workflows, you need to prove your local environment works and that you understand Declarative Agent anatomy.

You will build a simple **Zava Onboarding Assistant** that helps new employees with common HR and IT onboarding questions (office locations, helpdesk, leave policy, and benefits).

---

## Lab objectives

By completing this lab, you will:

- Understand the three core files in a Declarative Agent
- Scaffold a new agent project with Agents Toolkit in VS Code
- Customize identity, instructions, and conversation starters
- Provision and test the agent in Microsoft 365 Copilot Chat
- Understand the edit -> provision -> test loop used across all bundles

---

## Prerequisites

Before starting this lab, complete:

- **Lab E0**: [00-prerequisites.md](./00-prerequisites)
- VS Code with **Microsoft 365 Agents Toolkit** (v6.4.2+)
- Microsoft 365 account with Copilot access

---

## Exercise 1: Scaffold the project

### Step 1: Open Agents Toolkit in VS Code

1. Open VS Code.
2. Select the **Microsoft 365 Agents Toolkit** icon in the Activity Bar.
3. Sign in with your Microsoft 365 developer account if prompted.

<cc-end-step lab="e1" exercise="1" step="1" />

### Step 2: Create a new Declarative Agent

1. In Agents Toolkit, select **Create a New Agent/App**.
2. Select **Declarative Agent**.
3. Select **No Action** to scaffold a minimal template.
4. Choose a folder on your machine.
5. For app name, enter: **Zava Onboarding Agent**.

<cc-end-step lab="e1" exercise="1" step="2" />

### Step 3: Inspect generated structure

Open the generated project and review the `appPackage` folder:

```text
ZavaOnboardingAgent/
├── appPackage/
│   ├── declarativeAgent.json
│   ├── instruction.txt
│   ├── manifest.json
│   ├── color.png
│   └── outline.png
├── env/
│   └── .env.dev
└── teamsapp.yml
```

- `manifest.json`: Teams app identity and package metadata
- `declarativeAgent.json`: Agent persona, starters, and references
- `instruction.txt`: Agent behavior and policy prompt

<cc-end-step lab="e1" exercise="1" step="3" />

---

## Exercise 2: Configure your first agent

### Step 1: Update declarativeAgent.json

Replace the full content of `appPackage/declarativeAgent.json` with:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
  "version": "v1.6",
  "name": "Zava Onboarding Assistant",
  "description": "Helps new Zava Insurance employees find answers to common HR and IT onboarding questions.",
  "instructions": "$[file('instruction.txt')]",
  "conversation_starters": [
    {
      "title": "IT helpdesk hours",
      "text": "What are the IT helpdesk hours and how do I raise a ticket?"
    },
    {
      "title": "Holiday policy",
      "text": "How many days of annual leave do I get and how do I book them?"
    },
    {
      "title": "Office locations",
      "text": "Where are Zava's offices and what are the parking arrangements?"
    },
    {
      "title": "Benefits summary",
      "text": "Give me a quick summary of the key employee benefits."
    }
  ]
}
```

<cc-end-step lab="e1" exercise="2" step="1" />

### Step 2: Update instruction.txt

Replace all content in `appPackage/instruction.txt` with:

```text
# Zava Onboarding Assistant

## Role
You are a friendly HR and IT onboarding assistant for new employees at Zava Insurance,
a mid-sized home insurance company based in the Pacific Northwest.
Your job is to answer common questions from people in their first 90 days at Zava.

## What you know
- Zava's offices are in Seattle (HQ), Portland, and Spokane.
  Seattle HQ is at 1400 5th Ave, open Mon-Fri 8am-6pm.
  Free parking is available in the basement for HQ staff with a valid pass.
- IT Helpdesk: helpdesk@zava-insurance.com or Teams channel #it-help.
  Hours: Mon-Fri 7am-7pm Pacific. For urgent issues out of hours, call +1-800-ZAVA-ITS.
- Annual leave: 20 days per year (prorated in year one). Request via Workday.
  Christmas shutdown: Dec 24 - Jan 2 is pre-approved leave for all staff.
- Benefits include: medical/dental/vision (day 1), 401k with 4% match (after 90 days),
  $500 annual wellness budget, and monthly WFH stipend of $50.
- Mandatory onboarding courses must be completed in your first 30 days via the LMS.
  Log in at learn.zava-insurance.com using your corporate SSO.

## Behaviour guidelines
- Be warm, concise, and reassuring.
- If you don't know the answer, say so and suggest who to contact.
- Don't invent policy details not listed above.
- Keep answers short unless the user asks for detail.
- Offer a follow-up question at the end.
```

<cc-end-step lab="e1" exercise="2" step="2" />

### Step 3: Update manifest.json

Update the app identity values in `appPackage/manifest.json`:

```json
{
  "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.23/MicrosoftTeams.schema.json",
  "manifestVersion": "1.23",
  "version": "1.0.0",
  "id": "${{TEAMS_APP_ID}}",
  "developer": {
    "name": "Zava Insurance Dev Team",
    "websiteUrl": "https://www.zava-insurance.com",
    "privacyUrl": "https://www.zava-insurance.com/privacy",
    "termsOfUseUrl": "https://www.zava-insurance.com/terms"
  },
  "name": {
    "short": "Zava Onboarding",
    "full": "Zava Insurance Onboarding Assistant"
  },
  "description": {
    "short": "HR and IT help for new Zava employees",
    "full": "Answers common onboarding questions for new Zava Insurance employees — office locations, IT helpdesk, leave policy, and benefits."
  }
}
```

<cc-end-step lab="e1" exercise="2" step="3" />

---

## Exercise 3: Provision and test

### Step 1: Provision the agent

1. In Agents Toolkit, under **Lifecycle**, select **Provision**.
2. Wait for a success notification.
3. Open `env/.env.dev` and confirm `TEAMS_APP_ID` and `M365_TITLE_ID` are populated.

<cc-end-step lab="e1" exercise="3" step="1" />

### Step 2: Open the agent in Copilot Chat

1. Go to [https://m365.cloud.microsoft/chat/](https://m365.cloud.microsoft/chat/).
2. Open **Agents** in the left pane.
3. Select **Zava Onboarding**.
4. Run one of the conversation starters.

<cc-end-step lab="e1" exercise="3" step="2" />

### Step 3: Validate behavior with prompts

Try these prompts:

- "Where is the Seattle office and when is it open?"
- "How do I submit annual leave?"
- "What happens if I need IT support at 9pm?"
- "What is the 401k match rate?"
- "Tell me about stock options" (agent should not invent data)

<cc-end-step lab="e1" exercise="3" step="3" />

---

## Exercise 4: Understand the development loop

### Step 1: Enable developer mode in Copilot Chat

In Copilot Chat, run:

```text
-developer on
```

Submit a query and inspect debug information.

<cc-end-step lab="e1" exercise="4" step="1" />

### Step 2: Make a live update and re-provision

Add this line to `instruction.txt` under "What you know":

```text
- The staff canteen (Seattle HQ, floor 2) is open Mon-Fri 7:30am-3pm.
  It serves hot meals, salads, and barista coffee.
  Payment via Zava staff card only.
```

Provision again, then ask: "Is there a canteen at HQ?"

<cc-end-step lab="e1" exercise="4" step="2" />

---8<--- "e-congratulations.md"

You are now ready to choose a bundle path from the landing page.

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/01-first-agent-new" />
