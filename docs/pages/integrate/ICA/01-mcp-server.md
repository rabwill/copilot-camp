# Lab: Build a Model Context Protocol (MCP) Server for AI-Powered Claims Operations

## 🏢 The Story of Zava Insurance: A Digital Transformation Journey

### Meet Zava Insurance Company

**Zava Insurance** is a mid-sized home insurance company founded in 1987, serving customers across the Pacific Northwest. What started as a family-owned business in Seattle has grown into a regional leader, protecting over 150,000 homes from Washington to California.

### The Challenge: Manual Claims Operations

For decades, Zava's claims operations relied on traditional processes:

- **Paper-based workflows** with claims adjusters juggling multiple spreadsheets
- **Phone tag between adjusters, inspectors, and contractors** causing delays
- **Manual scheduling** of property inspections leading to bottlenecks
- **Fragmented data** across different systems making it hard to get a complete picture

When the Pacific Northwest experienced severe storms in October 2025, Zava received over 2,000 claims in just 48 hours. Their traditional systems couldn't handle the surge, leading to:

- **3-week delays** in initial claim responses
- **Lost contractor assignments** due to poor coordination
- **Frustrated customers** unable to get status updates
- **Compliance issues** with state insurance regulations

### The Vision: AI-Powered Claims Operations

Zava's CTO, proposed a bold solution: **"What if AI agents could handle routine claims operations, freeing our adjusters to focus on complex cases and customer care?"**

The vision included:

- **AI agents** that could instantly access claims data, schedule inspections, and coordinate with contractors
- **Real-time status updates** for customers through chatbots
- **Automated damage assessments** using computer vision and structured data
- **Intelligent contractor matching** based on specialties, location, and availability

### The Technical Solution: MCP Server Architecture

To enable this AI-powered future, Zava's development team built a **Model Context Protocol (MCP) server** that provides:

- **Standardized access** to claims data for any AI agent
- **Rich contextual information** about damage types, contractor specialties, and inspection requirements
- **Secure, scalable operations** using Azure cloud infrastructure
- **Real-time data synchronization** across all systems

---

## 🎯 Lab Objectives

By completing this lab, you will:

1. Understand how MCP servers enable AI agent integration
2. Build and run a production-ready MCP server for insurance operations
3. Explore the architecture that powers Zava's digital transformation

---

## 📚 Prerequisites

Before starting this lab, ensure you have:

- **Node.js 22+** installed on your machine
- **VS Code** (recommended) with TypeScript support
- Basic knowledge of **TypeScript/JavaScript**
- Understanding of **REST APIs** and **JSON**

---

## Exercise 1: Set Up Your Development Environment

In this exercise, you'll clone Zava's MCP server codebase and set up your local development environment.

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/microsoft/Ignite25-BRK319-Demos.git
cd Ignite25-BRK319-Demos/src/DA/zava-mcp-server
```
<cc-end-step lab="ica1" exercise="1" step="1" />

### Step 2: Install Dependencies

Install all required packages:

```bash
npm install
```

This installs key dependencies:

- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `@azure/data-tables` - Azure Table Storage client
- `express` - HTTP server framework
- `zod` - Runtime type validation

<cc-end-step lab="ica1" exercise="1" step="2" />

### Step 3: Examine the Project Structure

Explore the codebase structure, open the project in VSCode by typing and enter

```
code .
```

Key directories:

- `src/` - TypeScript source code
- `data/` - Sample JSON data files

<cc-end-step lab="ica1" exercise="1" step="3" />

You have the code base ready with sample data. 

---

## Exercise 2: Start Zava's Local Claims Database

Zava uses Azure Table Storage for their claims database. In this exercise, you'll start a local emulator and load sample data.

### Step 1: Start Azure Storage Emulator

In **Terminal 1**, start the Azurite emulator:

```bash
npm run start:azurite
```

You should see:
```
Azurite Blob service is starting at http://127.0.0.1:10000
Azurite Queue service is starting at http://127.0.0.1:10001
Azurite Table service is starting at http://127.0.0.1:10002
```

**Keep this terminal running** - it's your local database server.
<cc-end-step lab="ica1" exercise="2" step="1" />

### Step 2: Load Sample Claims Data

In **Terminal 2**, initialize Zava's sample data:

```bash
npm run init-data
```

This loads realistic data including:

- **Claims**: Storm damage, water damage, fire damage cases
- **Contractors**: Roofing specialists, water restoration, general contractors
- **Inspections**: Scheduled and completed inspection tasks
- **Inspectors**: Available field inspectors with specialties

<cc-end-step lab="ica1" exercise="2" step="2" />

## Step 3: Verify Data Loading

Check the console output. You should see:
```
🚀 Starting data initialization...
📋 Initializing table: claims
✅ Table 'claims' created or already exists
📄 Loaded 2 items from claims.json
✅ Upserted entity: CN202504990
✅ Upserted entity: CN202504991
✅ Completed initialization for table: claims
📋 Initializing table: inspections
✅ Table 'inspections' created or already exists
📄 Loaded 2 items from inspections.json
✅ Upserted entity: insp-001
✅ Upserted entity: insp-002
✅ Completed initialization for table: inspections
📋 Initializing table: inspectors
✅ Table 'inspectors' created or already exists
📄 Loaded 4 items from inspectors.json
✅ Upserted entity: inspector-001
✅ Upserted entity: inspector-002
✅ Upserted entity: inspector-003
✅ Upserted entity: inspector-004
✅ Completed initialization for table: inspectors
📋 Initializing table: contractors
✅ Table 'contractors' created or already exists
📄 Loaded 3 items from contractors.json
✅ Upserted entity: contractor-001
✅ Upserted entity: contractor-002
✅ Upserted entity: contractor-003
✅ Completed initialization for table: contractors
📋 Initializing table: purchaseOrders
✅ Table 'purchaseOrders' created or already exists
📄 Loaded 2 items from purchaseOrders.json
✅ Upserted entity: po-001
✅ Upserted entity: po-002
✅ Completed initialization for table: purchaseOrders
🎉 Data initialization completed successfully!
✨ All tables initialized successfully
```

Your local claims database is now running with sample data that mirrors Zava's production environment.
<cc-end-step lab="ica1" exercise="2" step="3" />

---

## Exercise 3: Launch the MCP Server

Now you'll start Zava's MCP server that enables AI agents to interact with the claims system.



### Step 1: Start the MCP Server

In **Terminal 2** (keeping Azurite running in Terminal 1):

```bash
npm run start:mcp-http
```

You should see a message as below (parts of the message):
```
🚀 Zava Claims MCP HTTP Server started on 127.0.0.1:3001 
...
```
<cc-end-step lab="ica1" exercise="3" step="1" />

### Step 2: Test Server Health

Open a new browser tab and visit:
```
http://127.0.0.1:3001/health
```

You should see a JSON response confirming the server is healthy in the browser.

```json
{"status":"healthy","timestamp":"2025-11-11T01:46:11.618Z","service":"zava-claims-mcp-server","authentication":"No authentication"}
```

<cc-end-step lab="ica1" exercise="3" step="2" />

### Step 3.3: Explore Available Endpoints

Visit these URLs to explore the API:
- **Health Check**: `http://127.0.0.1:3001/health`
- **API Documentation**: `http://127.0.0.1:3001/docs`
- **MCP Tools List**: `http://127.0.0.1:3001/tools`

Your MCP server is now running and ready. 
<cc-end-step lab="ica1" exercise="3" step="3" />

---

## Exercise 4: Test AI Agent Interactions

Experience how AI agents interact with Zava's claims system using the MCP Inspector tool.

### Step 1: Launch MCP Inspector

In **Terminal 3**, start the interactive MCP testing tool:

```bash
npm run inspector
```

This opens a web interface where you can test MCP tools as if you were an AI agent.

<cc-end-step lab="ica1" exercise="4" step="1" />

### Step 2: Explore Available Tools

In the MCP Inspector interface, you'll see **15 tools** available to AI agents:

**Claims Management Tools:**

- `get_claims` - List all insurance claims
- `get_claim` - Get specific claim details
- `create_claim` - File a new claim
- `update_claim` - Update claim status
- `delete_claim` - Close/delete claims

**Inspection Tools:**

- `get_inspections` - List inspection tasks
- `create_inspection` - Schedule new inspections
- `update_inspection` - Update inspection status

**Contractor & Inspector Tools:**

- `get_contractors` - Find contractors by specialty
- `get_inspectors` - List available inspectors

<cc-end-step lab="ica1" exercise="4" step="2" />

### Step 3: Test the "Get Claims" Tool

1. Click on `get_claims` tool
2. Click **"Run Tool"** (no parameters needed)
3. Observe the JSON response with Zava's current claims

You should see claims like:
```json
{
  "id": "1",
  "claimNumber": "CN202504990", 
  "policyHolderName": "John Smith",
  "property": "123 Main St, Seattle, WA 98101",
  "status": "Open - Claim is under investigation",
  "damageTypes": ["Roof damage - moderate severity", "Storm damage"],
  "estimatedLoss": 15000
}
```

![image of mcp inspector tool interacting with zava mcp server](../../../assets/images/integrate/ICA/01-mcp-server/mcp-inspector.png)

<cc-end-step lab="ica1" exercise="4" step="3" />

### Step 4: Test Creating a New Claim

1. Click on `create_claim` tool
2. Fill in the form with sample data:
   - **claimNumber**: `CN202504995`
   - **policyNumber**: `POL-HO-2025-005`
   - **policyHolderName**: `Alice Johnson`
   - **policyHolderEmail**: `alice@email.com`
   - **property**: `789 Pine St, Seattle, WA 98103`
   - **dateOfLoss**: `2025-11-10T00:00:00Z`
   - **dateReported**: `2025-11-11T09:00:00Z`
   - **status**: `Open`
   - **damageTypes**: `["Hail damage", "Roof damage"]`
   - **description**: `Hail damage to roof and gutters`
   - **estimatedLoss**: `12000`

3. Click **"Call Tool"**
4. Verify the new claim was created successfully

<cc-end-step lab="ica1" exercise="4" step="4" />

### Step 5: Test Smart Prompts

1. Click on the **"Prompts"** tab
2. Try the `damage_assessment_prompt` with:
   - **claimId**: `1`
   - **damageType**: `Roof damage`
3. Observe how the MCP server provides contextual prompts for AI agents

<cc-end-step lab="ica1" exercise="4" step="5" />

### Step 6: Set Up Public Access with Dev Tunnel

To enable external access to your MCP server (useful for testing with cloud-based AI agents or sharing with team members), you'll use VS Code's built-in Dev Tunnel feature to create a public HTTPS endpoint.

#### Why Use HTTPS Instead of HTTP?

- **Security**: HTTPS encrypts communication between AI agents and your MCP server
- **Cloud Compatibility**: Many cloud-based AI services require HTTPS endpoints
- **Production Readiness**: Mirrors real-world deployment scenarios where MCP servers are accessed over secure connections
- **Cross-Origin Support**: HTTPS tunnels handle CORS (Cross-Origin Resource Sharing) better than local HTTP servers

#### Create a Dev Tunnel in VS Code

- In VS Code's terminal panel, locate the Ports tab.

- Click the Forward a Port button and enter port number 3001.

- Right-click on the forwarded port address and select Configure the Tunnel:

- Port Visibility: Select "Public" to make it accessible externally
- Set Port Label: Enter zava-mcp-server (optional but recommended)
- Copy Local Address: Click to copy the tunnel URL to your clipboard
- Authenticate: If prompted, sign in with your Microsoft/GitHub account to create the tunnel.

    The copied URL will look similar to this:

    ```
    https://3001-abc123def456.use.devtunnels.ms 
    ```
    Save this URL - you'll need it for the next step. We'll refer to this as <tunnel-url>.

#### Update Package.json with Tunnel URL

Now update your package.json to use the tunnel URL for testing:

- Open **package.json** in the zava-mcp-server directory.

- Locate the inspector script and update it from:

```json
"inspector": "npx @modelcontextprotocol/inspector --transport http --server-url http://localhost:3001/mcp/messages"
```

to

```json
"inspector": "npx @modelcontextprotocol/inspector --transport http --server-url <tunnel-url>/mcp/messages"
```
- Replace <tunnel-url> with your actual tunnel URL from above step.

- If the inspector is currently running, stop it by pressing Ctrl+C in the terminal, then restart it:

```
npm run inspector
```

The MCP Inspector now opens a new browser session with a publicly accessible endpoint. Test all tools and prompts available to see how it works and brings back data. 

You've successfully tested how AI agents interact with Zava's claims system through the MCP protocol and you now have a public HTTPS endpoint for your MCP server that can be accessed by external AI agents and services.

<cc-end-step lab="ica1" exercise="4" step="6" />

---

## Exercise 5: Explore the MCP Server Code (Optional but recommended)

Understand the technical implementation that powers Zava's AI-enabled claims operations.

### Step 1: Examine the Main MCP Server File

Open `src/mcp-server-http.ts` in VS Code and explore:

**MCP Server Initialization**
```typescript
const server = new Server({
  name: 'zava-claims-mcp-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
    prompts: {},
  },
});
```

**Tool Definitions**
Each tool has a name, description, and JSON schema:
```typescript
{
  name: 'get_claim',
  description: 'Retrieve a specific insurance claim by ID or claim number',
  inputSchema: {
    type: 'object',
    properties: {
      claimId: {
        type: 'string',
        description: 'The claim ID (e.g., "1", "2") or claim number'
      }
    },
    required: ['claimId']
  }
}
```
<cc-end-step lab="ica1" exercise="5" step="1" />

### Step 2: Understand Tool Handlers

Find the `CallToolRequestSchema` handler (around line 800):
```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'get_claims':
      const claims = await claimsImplementation.getClaims();
      return {
        content: [{ type: 'text', text: JSON.stringify(claims, null, 2) }]
      };
    // ... more cases
  }
});
```
<cc-end-step lab="ica1" exercise="5" step="2" />

### Step 3: Explore Data Layer Implementation

Open `src/implementation/claimsImplementation.ts`:

This file contains the business logic for:
- Retrieving claims from Azure Table Storage
- Creating new claims with validation
- Updating claim status and details
- Integrating with contractor and inspection systems

<cc-end-step lab="ica1" exercise="5" step="3" />

### Step 4: Review Sample Data Structure

Open `data/claims.json` to understand the realistic sample data:
- **Real-world claim scenarios**: Storm damage, water damage, fire incidents
- **Complete address information**: Pacific Northwest properties
- **Detailed damage assessments**: Severity levels and damage types
- **Workflow status tracking**: Investigation, approval, settlement stages

You now understand how Zava's MCP server is architected to enable AI agent interactions.

<cc-end-step lab="ica1" exercise="5" step="4" />

---

Congratulations! You've successfully built and tested Zava Insurance's MCP server that enables AI-powered claims operations locally. Select "Next" to add it into a Declarative Agent.

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/integrate/ICA/01-mcp-server" />

### 🔗 Additional Resources

- **MCP Protocol Documentation**: [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)
- **Azure Table Storage**: [Azure Documentation](https://docs.microsoft.com/en-us/azure/storage/tables/)
- **Zava Insurance Demo**: [GitHub Repository](https://github.com/microsoft/Ignite25-BRK319-Demos/src/DA/zava-mcp-server)
