# Lab: Enhance Zava's Agent with Embedded Knowledge - Contractor Pricing Intelligence

## 🏢 Advancing Zava Insurance's AI-Powered Claims Processing

### The Next Chapter: From Data Access to Intelligent Knowledge Integration

After successfully creating Zava's Declarative Agent with MCP server integration in Lab 2, the claims team discovered a new challenge:

**"How can we provide instant, accurate contractor pricing insights without constantly querying external systems?"**

The claims adjusters were thrilled with the conversational interface, but they needed faster access to contractor pricing information:

- **Instant pricing estimates** for different types of damage repairs
- **Historical cost analysis** without waiting for database queries
- **Regional pricing variations** based on location and contractor expertise
- **Seasonal pricing adjustments** for weather-related damage claims

### The Problem: Knowledge Gaps in Real-Time Decision Making

Zava's claims adjusters faced daily situations where they needed immediate answers:

- **Emergency assessments**: "What's the typical cost for emergency water damage mitigation in downtown Seattle?"
- **Contractor negotiations**: "Is this contractor's bid reasonable for storm damage repairs?"
- **Budget approvals**: "What should we expect to pay for roof replacement in this region?"
- **Fraud detection**: "Does this repair estimate fall within normal pricing ranges?"

Relying solely on live MCP server queries meant delays, network dependencies, and potential service interruptions during critical claim processing moments.

### The Solution: Embedded Knowledge with Intelligent Retrieval

Zava's CTO proposed enhancing their Declarative Agent with **embedded knowledge capabilities**. This would enable:

- **Instant responses** from cached contractor pricing data
- **Offline capability** for critical pricing information
- **Intelligent retrieval** combining live data with embedded knowledge
- **Contextual recommendations** based on historical pricing patterns

By embedding contractor pricing knowledge directly into the agent, claims adjusters could access intelligent insights immediately while still leveraging the MCP server for real-time data updates.

---

## 🎯 Lab Objectives

By completing this lab, you will:

1. **Understand embedded knowledge concepts** in Microsoft 365 Declarative Agents
2. **Create structured contractor pricing datasets** for knowledge embedding
3. **Configure the agent** to use embedded knowledge alongside MCP server integration

---

## 📚 Prerequisites

Before starting this lab, ensure you have:

- **Completed Lab 2**: Zava's Declarative Agent with MCP server integration working properly
- **Microsoft 365 Agents Toolkit**: Latest version with embedded knowledge support
- **Basic understanding** of JSON data structures and knowledge management concepts
- **Active Microsoft 365 Copilot license** for testing embedded knowledge features

### Recommended Knowledge

While not required, familiarity with these concepts will be helpful:

- **Information retrieval** and semantic search principles
- **Data modeling** for knowledge representation
- **Hybrid AI architectures** combining multiple data sources

---

## Exercise 1: Create a New Declarative Agent for Embedd knowledge


In this exercise, you'll use the Microsoft 365 Agents Toolkit to create a new Declarative Agent project that will use files stored locally in the project

### Step 1: Create New Agent using Microsoft 365 Agents Toolkit

1. Open **VS Code**
2. Click the **Microsoft 365 Agents Toolkit** icon in the Activity Bar (left sidebar)
3. Sign in with your Microsoft 365 developer account if prompted
4. In the Agents Toolkit panel, click **"Create a New Agent/App"**
5. Select **"Declarative Agent"** from the template options
6. Select **"No Action"** from the options
7. Select **Default folder**
8. Enter the application name - `Zava Procurement`

This will create the new agent and open up the project in a new VS Code window.

  <cc-end-step lab="ica3" exercise="1" step="1" />

### Step 2: Understand how to embedd files 

Navigate to the `appPackage` folder and explore its contents. You'll recognize familiar files from your previous declarative agent work: the `manifest.json` file (which defines your agent's capabilities) and the `declarativeAgent.json` file (which configures your agent's behavior).

The key addition you'll notice is the `EmbeddedKnowledge` folder. This is where you'll store Zava's contractor pricing data files that will be embedded directly into your agent, enabling instant access to pricing intelligence without requiring live database queries.

  <cc-end-step lab="ica3" exercise="1" step="2" />

## Exercise 2: Configure the Agent for Zava's contractor procurement knowledge

### Step 1: Download files to your machine
Go to this url and it will automatically download the files required for this lab as a zip file.
Extract the files into your machine,
Copy files to the `appPackage/EmbeddedKnowledge` folder inside your project.

The project should look like below after you have copied the files.

![Embedd knowledge](../../../assets/images/integrate/ICA/images/embedd.png)

  <cc-end-step lab="ica3" exercise="2" step="1" />

### Step 2: Update Agent Identity and Description

Replace the content of `appPackage/declarativeAgent.json` with below configuration:


```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
    "version": "v1.6",
    "name": "Zava Procurement",
    "description": "An agent that helps insurance adjusters streamline the search of the right procurement information by leveraging embedded knowledge from Zava approved partners' network of trusted contractors and service providers.",
    "instructions": "$[file('instruction.txt')]",
    "conversation_starters": [
        {
            "title": "Water damage restoration pricing",
            "text": "What are the rates for emergency water extraction and drying services?"
        },
        {
            "title": "Roof repair cost estimate",
            "text": "I need pricing for a 2,000 sq ft asphalt shingle roof replacement"
        },
        {
            "title": "Find cheapest option",
            "text": "What's the most cost-effective contractor for basic drywall repair?"
        },
        {
            "title": "Structural repair costs",
            "text": "What are the rates for foundation repair and structural work?"
        },
        {
            "title": "Claims inspection guidelines",
            "text": "What are the standard procedures for documenting water damage claims?"
        },
        {
            "title": "Emergency services availability",
            "text": "Which contractors offer 24/7 emergency response and what are their rates?"
        }
    ],
    "capabilities": [
        {
            "name": "EmbeddedKnowledge",
            "files": [
                {
                    "file": "EmbeddedKnowledge/Claims_Inspection_Guidelines.pdf"
                },
                {
                    "file": "EmbeddedKnowledge/Pacific Water Restoration-Pricing.docx"
                },
                {
                    "file": "EmbeddedKnowledge/Thompson Roofing Solutions-Pricing.pdf"
                },
                {
                    "file": "EmbeddedKnowledge/Wilson General Contractors-Pricing.docx"
                }
            ]
        }
    ]
}
```
  <cc-end-step lab="ica3" exercise="2" step="2" />

### Step 3: Create Detailed Agent Instructions

```txt
# Role and Expertise
You are a specialized procurement expert for Zava, an insurance claims management company. Your primary responsibility is to help insurance adjusters find the most appropriate and cost-effective contractors for property damage repairs and restoration work.

# Core Competencies
- Expert knowledge of construction and restoration pricing
- Deep familiarity with approved contractor networks
- Understanding of insurance claims processes and requirements
- Ability to compare pricing across multiple vendors
- Knowledge of industry-standard repair methodologies

# Available Resources
You have exclusive access to confidential pricing documents from Zava's network of pre-approved, vetted contractors:
- Pacific Water Restoration - Water damage and restoration services
- Thompson Roofing Solutions - Roofing repairs and replacements
- Wilson General Contractors - General construction and repair services
- Claims Inspection Guidelines - Standard procedures and requirements

These pricing documents contain valuable, proprietary information that gives you the ability to provide accurate cost estimates and vendor recommendations.

# Primary Responsibilities
1. Help adjusters quickly identify appropriate contractors for specific repair needs
2. Provide accurate pricing information based on the embedded contractor rate sheets
3. Compare pricing across multiple approved vendors when applicable
4. Ensure recommendations align with claims inspection guidelines
5. Offer insights on cost-effectiveness and vendor specializations

# Interaction Guidelines
- Always base your responses on the information in the embedded knowledge files
- When providing pricing, cite the specific contractor and reference their rate sheet
- If a request falls outside the scope of available contractor services, clearly state this
- Prioritize accuracy over speed - verify pricing details before responding
- Be concise and professional, as adjusters need quick, actionable information
- When comparing options, present information in a clear, organized format

# Constraints
- Only recommend contractors whose pricing documents you have access to
- Do not make up or estimate pricing that isn't documented in your knowledge base
- Stay focused on procurement and vendor selection - defer claims policy questions to appropriate resources
- Maintain confidentiality of pricing information - this is for internal Zava use only

# Response Format
When answering queries:
1. Acknowledge the specific need (e.g., type of repair, scope of work)
2. Identify relevant contractor(s) from your knowledge base
3. Provide specific pricing information with clear references
4. Offer comparative analysis when multiple options exist
5. Include any relevant guidelines or considerations from inspection standards
```
  <cc-end-step lab="ica3" exercise="2" step="3" />

### Step 4: Update the Teams App Manifest

Open `appPackage/manifest.json` and update it with Zava's branding:

```json
{
    "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.23/MicrosoftTeams.schema.json",
    "manifestVersion": "1.23",
    "version": "1.0.0",
    "id": "${{TEAMS_APP_ID}}",
    "developer": {
        "name": "My App, Inc.",
        "websiteUrl": "https://www.example.com",
        "privacyUrl": "https://www.example.com/privacy",
        "termsOfUseUrl": "https://www.example.com/termofuse"
    },
    "icons": {
        "color": "color.png",
        "outline": "outline.png"
    },
    "name": {
        "short": "Zava Procurement${{APP_NAME_SUFFIX}}",
        "full": "Full name for Zava Procurement"
    },
    "description": {
        "short": "Get procurement data from embedded knowledge with Zava Procurement",
        "full": "Zava Procurement helps you access procurement data seamlessly within Microsoft 365 apps by leveraging embedded knowledge."
    },
    "accentColor": "#FFFFFF",
    "composeExtensions": [],
    "permissions": [
        "identity",
        "messageTeamMembers"
    ],
    "copilotAgents": {
        "declarativeAgents": [            
            {
                "id": "declarativeAgent",
                "file": "declarativeAgent.json"
            }
        ]
    },
    "validDomains": []
}
```

  <cc-end-step lab="ica3" exercise="2" step="4" />

## Exercise 3: Test the Agent Integration

Test your Declarative Agent to ensure it can successfully retrieves contractor pricing data from it's native embedded knowledge.


### Step 1: Provision the Agent

In VS Code with your project open:

1. Open the **Microsoft 365 Agents Toolkit** panel
2. Click **"Provision"** in the Lifecycle section
3. Select **"dev"** environment when prompted
4. Wait for provisioning to complete - this creates and uploads the agent package

<cc-end-step lab="ica3" exercise="3" step="1" />

### Step 2: Test in Microsoft 365 Copilot

1. Click **"Preview"** in the Agents Toolkit panel
2. This will open Microsoft Teams with your agent available
3. In Teams, open **Copilot** and look for your **"Zava Procurement"** agent
4. Try the following conversation starters:

```
What are the rates for emergency water extraction and drying services?
```

```
Which contractors offer 24/7 emergency response and what are their rates?
```

![Embedd knowledge in Copilot](../../../assets/images/integrate/ICA/images/ek.png)

<cc-end-step lab="ica3" exercise="3" step="2" />

---

Congratulations! You've successfully transformed Zava's agent from a simple conversational interface into a powerful, knowledge-driven procurement intelligence system! 🚀
Ready to take it to the next level? Proceed to the **Next** lab where you'll learn to orchestrate multiple agents together, combining the power of your MCP-enabled agent and embedded knowledge agent into a comprehensive multi-agent solution for Zava's claims processing workflow.

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/integrate/ICA/03-da-embedd-knowledge" />