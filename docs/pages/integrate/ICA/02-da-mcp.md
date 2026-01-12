# Lab: Connect AI Agents to Claims Data - Building Zava's Declarative Agent

## 🏢 Continuing Zava Insurance's Digital Transformation Journey

### The Next Chapter: From Data Access to Intelligent Conversations

After successfully building the MCP server in Lab 1, Zava Insurance's development team faced their next challenge:

 **"How do we make this powerful claims data accessible through natural language conversations?"**

The claims adjusters were excited about the MCP server's capabilities, but they needed something more intuitive:

- **Conversational interfaces** instead of API calls
- **Natural language queries** like "Show me all urgent storm damage claims"
- **Integrated workflows** within Microsoft 365 Copilot
- **Context-aware responses** that understand insurance terminology

### The Solution: Microsoft 365 Declarative Agents

Zava's CTO proposed integrating their MCP server with **Microsoft 365 Copilot** using **Declarative Agents**. This would enable:

- **Natural conversations** about claims data
- **Seamless integration** with existing Microsoft 365 workflows  
- **Intelligent context** understanding insurance processes
- **Rich, interactive responses** with adaptive cards and data visualization

---

## 🎯 Lab Objectives

By completing this lab, you will:

1. Create a new Declarative Agent project using Microsoft 365 Agents Toolkit
2. Configure the agent to connect to Zava's MCP server
3. Define conversation starters and instructions for claims management
4. Test the agent integration with real claims data
5. Add rich cards for interaction

---

## 📚 Prerequisites

Before starting this lab, ensure you have:

- **Completed Lab 1**: MCP server running locally but publicly accessible https url.
- **Node.js 22+** installed
- **VS Code** with Microsoft 365 Agents Toolkit extension
- **Microsoft 365 developer account** with Copilot license
- **Basic knowledge** of TypeScript/JavaScript and JSON

---

## Exercise 1: Create a New Declarative Agent Project

In this exercise, you'll use the Microsoft 365 Agents Toolkit to create a new Declarative Agent project that will connect to Zava's claims system.

### Step 1: Create New Agent using Microsoft 365 Agents Toolkit

1. Open **VS Code**
2. Click the **Microsoft 365 Agents Toolkit** icon in the Activity Bar (left sidebar)
3. Sign in with your Microsoft 365 developer account if prompted

#### Create New Agent Project

1. In the Agents Toolkit panel, click **"Create a New Agent/App"**
2. Select **"Declarative Agent"** from the template options
3. Next choose **"Add an Action"** to add to your agent
4. Next select **Start with an MCP server**
5. Enter the publicly accessible MCP Server URl from previous lab (dev tunnel id/mcp/messages)
6. Choose the Default folder to scafold the agent (or choose a prefered location in your machine)
7. When prompted for project details:
   - **Application Name**: `Zava Claims Assistant`

You will be directed to the newly created project which has the file .vscode/mcp.json open. This is the MCP server configuration file for VS Code to use.

- Select **Start** button to fetch tools from your server.
- Once started you will see the number of tools and prompts available 1️⃣. 
- Select **ATK:Fecth action from MCP** 2️⃣ to select tools you want to add to the agent. 

![image ATK picking mcp tools](../../../assets/images/integrate/ICA/images/atk.png)

- When you select  **ATK:Fecth action from MCP**, you will be asked to provide the action manifest, select **ai-plugin.json**.
- Select the tools you want to add to the agent. Let's select 10 tools for now.

    - create_claim
    - create_inspection
    - get_claim
    - get_claims
    - get_contractors
    - get_inspection
    - get_inspections
    - update_claim
    - update_inspection
    - get_inspectors

This step will populate the action manifest **ai-plugin.json** with the required functions, MCP server url etc that is needed for actions in an agent.

<cc-end-step lab="ica2" exercise="1" step="1" />

### Step 2: Understand the Action manifest update from previous step

Open `appPackage/ai-plugin.json` and examine the structure with your chosen tools and MCP server url prepopulated:

```json
{
    "$schema": "https://aka.ms/json-schemas/copilot-extensions/v2.1/plugin.schema.json",
    "schema_version": "v2.4",
    "name_for_human": "Zava Claims Assistant",
    "description_for_human": "Zava Claims Assistant${{APP_NAME_SUFFIX}}",
    "contact_email": "publisher-email@example.com",
    "namespace": "zavaclaimsassistant",
    "functions": [
        {
            "name": "create_claim",
            "description": "Create a new insurance claim",
            "parameters": {
                ...
}
```

You now have a basic Declarative Agent that is connected to your MCP Server with 10 tools ready for use.
<cc-end-step lab="ica2" exercise="1" step="2" />

---

## Exercise 2: Configure the Agent for Zava's Claims Operations

Transform the basic agent into Zava's intelligent claims assistant by configuring its identity, instructions,  capabilities, and conversation starters.

### Step 1: Update Agent Identity and Description

Replace the content of `appPackage/declarativeAgent.json` with Zava's configuration:

```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
    "version": "v1.6",
    "name": "Zava Claims",
    "description": "An intelligent insurance claims management assistant that leverages MCP server integration to streamline inspection workflows, analyze damage patterns, coordinate contractor services, and generate comprehensive operational reports for efficient claims processing",
    "instructions": "$[file('instruction.txt')]",
    "conversation_starters": [
        {
            "title": "Find Inspections by Claim Number",
            "text": "Find all inspections for claim number CN202504991"
        },
        {
            "title": "Create Inspection & Find Contractors",
            "text": "Create an urgent inspection for claim CN202504990 and recommend water damage contractors"
        },
        {
            "title": "Analyze Claims Trends",
            "text": "Show me all high-priority claims and their inspection status"
        },
        {
            "title": "Find Emergency Contractors",
            "text": "Find preferred contractors specializing in storm damage for immediate deployment"
        },
        {
            "title": "Claims Operation Summary",
            "text": "Generate a summary of all pending inspections and contractor assignments"
        }
    ]
}
```

<cc-end-step lab="ica2" exercise="2" step="1" />

### Step 2: Create Detailed Agent Instructions

Update `appPackage/instruction.txt` with comprehensive instructions for the agent:

```plaintext
# Zava Claims Operations Assistant

## Role
You are an intelligent insurance claims management assistant with access to the Zava Claims Operations MCP Server. Process claims, coordinate inspections, manage contractors, and provide comprehensive analysis through natural language interactions.

## Core Functions

### Claims Management
- Retrieve and analyze all claims using natural language queries
- Get specific claim details by claim number or partial information
- Create new insurance claims with complete documentation
- Update existing claim information and status
- Use fuzzy matching for partial claim information to help users find what they need

### Inspection Operations
- Filter inspections by claim ID, status, priority, or workload
- Retrieve detailed inspection data and schedules
- Create new inspection tasks with appropriate priority levels
- Modify existing inspection details and assignments
- Access inspector availability and specialties
- Automatically determine priorities: safety hazards = 'urgent', water damage = 'high', routine = 'medium'

### Contractor Services
- Find contractors by specialty, location, and preferred status
- Access contractor ratings, availability, and past performance
- Coordinate contractor assignments with inspection schedules
- Track purchase orders and contractor costs

## Decision Framework

### For Inspections:
1. Assess urgency based on damage type and safety requirements
2. Select appropriate task type: 'initial', 'reinspection', 'emergency', 'final'  
3. Generate detailed instructions with specific focus areas
4. Consider inspector specialties and contractor availability for scheduling

### For Claims Analysis:
1. Prioritize safety-related issues (structural damage, water intrusion)
2. Group similar damage types for efficient processing
3. Identify patterns that might indicate fraud or systemic issues
4. Recommend preventive measures based on damage trends

## Response Guidelines

**Always Include:**
- Relevant claim numbers and context
- Clear next steps and action items
- Priority levels and urgency indicators
- Safety risk assessments when applicable

**For Complex Requests:**
1. Break down the request into specific components
2. Retrieve relevant claim and inspection data
3. Execute appropriate MCP server functions
4. Provide integrated analysis with actionable recommendations
5. Suggest follow-up actions or monitoring

**Communication Style:**
- Professional yet approachable for insurance professionals
- Use industry terminology appropriately
- Provide clear explanations for complex procedures
- Always prioritize customer service and regulatory compliance
```
<cc-end-step lab="ica2" exercise="2" step="2" />

### Step 3: Update the Teams App Manifest

Open `appPackage/manifest.json` and update it with Zava's branding:

```json
{
    "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.23/MicrosoftTeams.schema.json",
    "manifestVersion": "1.23",
    "version": "${{APP_VERSION}}",
    "id": "${{TEAMS_APP_ID}}",
    "developer": {
        "name": "Zava Insurance",
        "websiteUrl": "https://www.zavainsurance.com",
        "privacyUrl": "https://www.zavainsurance.com/privacy",
        "termsOfUseUrl": "https://www.zavainsurance.com/terms"
    },
    "icons": {
        "color": "color.png",
        "outline": "outline.png"
    },
    "name": {
        "short": "Zava Claims",
        "full": "Zava Insurance Claims Assistant"
    },
    "description": {
        "short": "An intelligent insurance claims management assistant",
        "full": "An AI-powered claims management assistant that leverages MCP server capabilities to streamline inspection workflows, coordinate contractors, and provide comprehensive operational insights for efficient claims processing."
    },
    "accentColor": "#0078D4",
    "composeExtensions": [],
    "copilotAgents": {
        "declarativeAgents": [            
            {
                "id": "declarativeAgent",
                "file": "declarativeAgent.json"
            }
        ]
    },
    "permissions": [
        "identity",
        "messageTeamMembers"
    ],
    "validDomains": []
}
```

Your agent now has a clear identity as Zava's claims assistant with comprehensive instructions.
<cc-end-step lab="ica2" exercise="2" step="3" />

---


## Exercise 3: Test the Agent Integration

Test your Declarative Agent to ensure it can successfully communicate with the MCP server and handle claims operations.

### Step 1: Ensure MCP Server is Running

Before testing, make sure your MCP server from previous lab is still running:

1. Open a terminal and navigate to the `zava-mcp-server` directory
2. Verify Azurite is running: `npm run start:azurite`
3. Verify MCP server is running: `npm run start:mcp-http`
4. Test the health endpoint: `curl <devtunnel url>/health`

<cc-end-step lab="ica2" exercise="3" step="1" />

### Step 2: Provision the Agent

In VS Code with your `zava-claims-agent` project open:

1. Open the **Microsoft 365 Agents Toolkit** panel
2. Click **"Provision"** in the Lifecycle section
3. Select **"dev"** environment when prompted
4. Wait for provisioning to complete - this creates and uploads the agent package

<cc-end-step lab="ica2" exercise="3" step="2" />

### Step 3: Test in Microsoft 365 Copilot

1. Click **"Preview"** in the Agents Toolkit panel
2. This will open Microsoft Teams with your agent available
3. In Teams, open **Copilot** and look for your **"Zava Claims"** agent
4. Try the conversation starters:
   - "Find all inspections for claim number CN202504991"
   - "Show me all high-priority claims and their inspection status"

  <cc-end-step lab="ica2" exercise="3" step="3" />

### Step 4: Test Natural Language Queries

Try these natural language queries to test the agent's capabilities:

```
What claims do we have for storm damage?
```

```
Create a new urgent inspection for claim CN202504990 to assess water damage in the basement
```

```
Find contractors who specialize in roofing and are marked as preferred
```

```
Show me the details for claim number CN202504991
```

```
Create a new claim for Alice Johnson at 456 Oak Street with fire damage from yesterday
```

Your agent should successfully respond to natural language queries and interact with the MCP server data.
<cc-end-step lab="ica2" exercise="3" step="4" />

---

## Exercise 4: Enhance Agent Capabilities with Adaptive Cards

Make the agent responses more visual and interactive by adding adaptive card templates for key scenarios.

### Step 1: Create Adaptive Cards Directory

Create a new directory structure:

```bash
mkdir -p appPackage/adaptiveCards
```
<cc-end-step lab="ica2" exercise="4" step="1" />

### Step 2: Create Claim Details Card Template

Create a file inside the newly created adaptiveCards folder called **claim.jon**

Copy paste the below content to the new file  `appPackage/adaptiveCards/claim.json`:

```json
{
  "type": "AdaptiveCard",
  "version": "1.6",
  "body": [
    {
      "type": "Container",
      "style": "emphasis",
      "items": [
        {
          "type": "ColumnSet",
          "columns": [
            {
              "type": "Column",
              "width": "stretch",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "Claim Details",
                  "weight": "Bolder",
                  "size": "Medium",
                  "color": "Accent"
                }
              ]
            },
            {
              "type": "Column",
              "width": "auto",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "${claimNumber}",
                  "weight": "Bolder",
                  "size": "Medium",
                  "horizontalAlignment": "Right"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "FactSet",
      "facts": [
        {
          "title": "Policy Holder:",
          "value": "${policyHolderName}"
        },
        {
          "title": "Property:",
          "value": "${property}"
        },
        {
          "title": "Status:",
          "value": "${status}"
        },
        {
          "title": "Date of Loss:",
          "value": "${dateOfLoss}"
        },
        {
          "title": "Estimated Loss:",
          "value": "$${estimatedLoss}"
        }
      ]
    },
    {
      "type": "TextBlock",
      "text": "Damage Types",
      "weight": "Bolder",
      "spacing": "Medium"
    },
    {
      "type": "Container",
      "items": [
        {
          "type": "TextBlock",
          "text": "${join(damageTypes, ' • ')}",
          "wrap": true
        }
      ]
    },
    {
      "type": "TextBlock",
      "text": "Description",
      "weight": "Bolder",
      "spacing": "Medium"
    },
    {
      "type": "TextBlock",
      "text": "${description}",
      "wrap": true,
      "spacing": "Small"
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Schedule Inspection",
      "data": {
        "action": "schedule_inspection",
        "claimId": "${id}"
      }
    },
    {
      "type": "Action.Submit", 
      "title": "Find Contractors",
      "data": {
        "action": "find_contractors",
        "claimId": "${id}"
      }
    }
  ]
}
```
<cc-end-step lab="ica2" exercise="4" step="2" />

### Step 3: Create Inspection Summary Card

Similarly create `appPackage/adaptiveCards/inspection.json` and paste below content: 

```json
{
  "type": "AdaptiveCard",
  "version": "1.6",
  "body": [
    {
      "type": "Container",
      "style": "emphasis",
      "items": [
        {
          "type": "TextBlock",
          "text": "Inspection Task",
          "weight": "Bolder",
          "size": "Medium",
          "color": "Accent"
        }
      ]
    },
    {
      "type": "ColumnSet",
      "columns": [
        {
          "type": "Column",
          "width": "stretch",
          "items": [
            {
              "type": "FactSet",
              "facts": [
                {
                  "title": "Claim:",
                  "value": "${claimId}"
                },
                {
                  "title": "Type:",
                  "value": "${taskType}"
                },
                {
                  "title": "Priority:",
                  "value": "${priority}"
                },
                {
                  "title": "Status:",
                  "value": "${status}"
                }
              ]
            }
          ]
        },
        {
          "type": "Column",
          "width": "auto",
          "items": [
            {
              "type": "Container",
              "style": "${{if(equals(priority, 'urgent'), 'attention', 'default')}}",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "${priority}",
                  "weight": "Bolder",
                  "horizontalAlignment": "Center",
                  "color": "${{if(equals(priority, 'urgent'), 'Warning', 'Default')}}"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "TextBlock",
      "text": "Instructions",
      "weight": "Bolder",
      "spacing": "Medium"
    },
    {
      "type": "TextBlock",
      "text": "${instructions}",
      "wrap": true,
      "spacing": "Small"
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Update Status",
      "data": {
        "action": "update_inspection",
        "inspectionId": "${id}"
      }
    },
    {
      "type": "Action.Submit",
      "title": "Assign Inspector",
      "data": {
        "action": "assign_inspector",
        "inspectionId": "${id}"
      }
    }
  ]
}

```

<cc-end-step lab="ica2" exercise="4" step="3" />

### Step 4: Create Contractor Information Card

And do the same for `appPackage/adaptiveCards/contractor.json`:

```json
{
  "type": "AdaptiveCard",
  "version": "1.6",
  "body": [
    {
      "type": "Container",
      "style": "${{if(preferred, 'good', 'default')}}",
      "items": [
        {
          "type": "ColumnSet",
          "columns": [
            {
              "type": "Column",
              "width": "stretch",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "${companyName}",
                  "weight": "Bolder",
                  "size": "Medium"
                },
                {
                  "type": "TextBlock",
                  "text": "${contactName}",
                  "spacing": "None",
                  "isSubtle": true
                }
              ]
            },
            {
              "type": "Column",
              "width": "auto",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "${{if(preferred, '⭐ Preferred', 'Standard')}}",
                  "weight": "Bolder",
                  "color": "${{if(preferred, 'Good', 'Default')}}",
                  "horizontalAlignment": "Right"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "FactSet",
      "facts": [
        {
          "title": "Specialties:",
          "value": "${join(specialties, ', ')}"
        },
        {
          "title": "Phone:",
          "value": "${phone}"
        },
        {
          "title": "Email:",
          "value": "${email}"
        },
        {
          "title": "Location:",
          "value": "${location}"
        },
        {
          "title": "Rating:",
          "value": "${rating}/5.0"
        }
      ]
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Assign to Claim",
      "data": {
        "action": "assign_contractor",
        "contractorId": "${id}"
      }
    },
    {
      "type": "Action.OpenUrl",
      "title": "Contact",
      "url": "mailto:${email}"
    }
  ]
}
```

Your agent now has rich adaptive card templates for displaying claims, inspections, and contractor information.
<cc-end-step lab="ica2" exercise="4" step="4" />

---

## Exercise 5: Provision with new enhancements

Provision your enhanced agent and test all the integrated capabilities with the MCP server. Go to **manifest.json** file and upgrade the version from 1.0.0 to 1.0.1.

### Step 1 Update and re-provision the Agent

1. In the Agents Toolkit panel, click **"Provision"** again to update your agent with the new adaptive cards
2. Wait for it to complete

<cc-end-step lab="ica2" exercise="5" step="1" />

### Step 2: Test Complete Workflows

Test these end-to-end workflows in Microsoft 365 Copilot:

**Workflow 1: Complete Claims Investigation**

```
Show me details for claim CN202504990
```

```
Create an urgent inspection for this claim to assess the roof damage
```

```
Find preferred contractors who specialize in roofing
```

```
What's the current status of all inspections for this claim?
```

![adaptive cards in response](../../../assets/images/integrate/ICA/images/adaptive-cards.png)

**Workflow 2: New Claim Processing**

```
Create a new claim for John Doe at 123 Elm Street with hail damage from yesterday, policy POL-12345, estimated loss $8000
```

```
Schedule an initial inspection for this new claim with high priority
```

```
Find contractors specializing in hail damage repair
```

**Workflow 3: Operational Overview**

```
Show me all claims with urgent inspections
```

```
What contractors are available for emergency water damage repairs?
```

```
Give me a summary of all open claims and their inspection status
```


Your complete Zava Claims Agent is now operational with full MCP server integration and rich cards.

<cc-end-step lab="ica2" exercise="5" step="2" />

---

Congratulations! You've successfully created and deployed Zava Insurance's Declarative Agent that seamlessly integrates with their MCP server. Proceed "Next" to add another Declarative agent to help prepare you for multi-agent orchestration. 

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/integrate/ICA/01-mcp-server" />
