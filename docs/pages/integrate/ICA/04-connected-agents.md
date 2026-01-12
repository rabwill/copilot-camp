# Lab E4 - Build Connected Agents with TypeSpec - Zava's Multi-Agent Claims Orchestration

In this lab, you will build a **Connected Agent** using TypeSpec definition that orchestrates multiple specialized agents for Zava Insurance's comprehensive claims processing workflow. You will create an agent called `ZavaCare` that coordinates between your existing MCP-enabled claims agent and embedded knowledge procurement agent to provide a unified, intelligent claims processing experience.

## 🏢 Completing Zava Insurance's AI-Powered Claims Ecosystem

### The Final Chapter: From Individual Agents to Orchestrated Intelligence

After successfully building Zava's MCP-enabled Claims Assistant (Lab 2) and Procurement Agent with embedded knowledge (Lab 3), the claims management team discovered they needed something more comprehensive:

**"How can we create a unified experience that seamlessly combines live claims data with instant pricing intelligence?"**

The claims adjusters loved both agents, but they found themselves switching between different tools:

- **Claims data queries** required the MCP-enabled agent
- **Pricing intelligence** needed the embedded knowledge agent  
- **Complex workflows** demanded coordination between both systems
- **Training new adjusters** became complicated with multiple interfaces

### The Solution: Connected Agent Orchestration

Zava's CTO proposed creating a **Connected Agent** that would orchestrate both specialized agents, providing:

- **Unified conversational interface** for all claims operations
- **Intelligent routing** to the appropriate specialized agent
- **Contextual handoffs** between live data and embedded knowledge
- **Comprehensive workflows** spanning multiple data sources
- **Single point of training** for claims adjusters

---

## What are Connected Agents?

**Connected Agents** represent the next evolution in AI agent architecture, enabling multiple specialized agents to work together seamlessly. Instead of building monolithic agents that try to do everything, Connected Agents orchestrate specialized agents, each optimized for specific tasks while maintaining a unified user experience.


### Benefits for Enterprise Workflows

For complex business scenarios like insurance claims processing, Connected Agents provide:

- **Domain expertise** from specialized agents
- **Comprehensive coverage** across multiple data sources
- **Efficient scaling** by adding focused agents
- **Consistent user experience** despite backend complexity
- **Maintainable architecture** with clear separation of concerns

---

## 📚 Prerequisites

Before starting this lab, ensure you have:

- **Completed Labs 2 & 3**: Both Zava Claims Assistant (MCP-enabled) and Zava Procurement Agent (embedded knowledge) deployed and working
- **Microsoft 365 Agents Toolkit**: Latest version with Connected Agent support
- **Active Microsoft 365 Copilot license** for testing connected agent features
- **Basic understanding** of TypeScript/JavaScript and agent orchestration concepts

### Recommended Knowledge

While not required, familiarity with these concepts will be helpful:

- **Multi-agent systems** and orchestration patterns
- **API composition** and service integration
- **Conversation flow management** across multiple services

---

## Exercise 1: Build the Orchestrator Agent with TypeSpec

In this exercise, you'll create a Connected Agent that orchestrates your existing Zava agents into a unified claims processing experience.

### Step 1: Create Connected Agent Project

1. Open **VS Code**
2. Click the **Microsoft 365 Agents Toolkit** icon in the Activity Bar
3. Sign in with your Microsoft 365 developer account if prompted
4. In the Agents Toolkit panel, click **"Create a New Agent/App"**
5. Select **"Connected Agent"** from the template options
6. Select **"Start with TypeSpec for Microsoft 365 Copilot"** to define your orchestrator using TypeSpec
7. Choose your default folder location
8. Enter the application name: `ZavaCare`

This creates a new Connected Agent project that will coordinate your existing agents.

<cc-end-step lab="ica4" exercise="1" step="1" />

### Step 2: Sign into Microsoft 365 Agents Toolkit

Follow the same sign-in process as previous labs:

1. Within the project window, select the Microsoft 365 Agents Toolkit icon again
2. Under "Accounts" section select "Sign in to Microsoft 365"
3. Sign in with your developer account
4. Close the browser and return to VS Code

<cc-end-step lab="ica4" exercise="1" step="2" />

### Step 3: Define the Orchestrator Agent

Open `main.tsp` and replace the template content with Zava's orchestrator definition:

#### Update Agent Metadata and Instructions

Replace the `@agent` and `@instructions` definitions:

```typespec
@agent(
  "ZavaCare",
  "An intelligent agent that helps you manage and process insurance claims efficiently. Get instant answers about claim status, policy details, and streamline your claims workflow."
)

@instructions("""
    You are the Zava Claims Assistant, an intelligent agent designed to help Zava insurance employees manage claims efficiently by coordinating with specialized worker agents and providing comprehensive claims management support.

    ## CORE CAPABILITIES

    You have access to two specialized connected agents:
    1. **Zava Claims** - Handles claims, inspections, contractors, and purchase orders
    2. **Zava Procurement** - Provides up-to-date contractor pricing information

    ## PRIMARY RESPONSIBILITIES

    ### Claims Management
    - Retrieve and display claim information and status
    - Provide comprehensive claim details including policy information, damage assessments, and timelines
    - Answer questions about claim history and current status
    - create, delete, update claims

    ### Inspection Operations
    - Retrieve existing inspection records and details
    - Create new inspection requests for claims
    - Update or delete inspections
    - Provide inspection status updates and findings
    - Coordinate inspection scheduling and documentation requirements

    ### Contractor Management
    - Access approved contractor lists for specific types of repairs
    - Retrieve contractor qualifications, certifications, and service areas
    - Provide contractor availability and emergency response capabilities
    - Get up-to-date pricing information for contractor services via the Zava Procurement agent

    ### Purchase Order Processing
    - Retrieve purchase order information and status
    - Access PO details including contractor assignments, costs, and timelines
    - Track PO approvals and completion status

    ## WORKFLOW GUIDELINES

    ### When Users Ask About Claims
    1. Use the Zava Claims agent to retrieve claim information
    2. Provide clear, organized summaries of claim status, coverage, and next steps
    3. If pricing questions arise, consult the Zava Procurement agent for current rates

    ### When Users Ask About Inspections
    1. **For retrieving inspections**: Use the Zava Claims agent to get inspection records
    2. **For creating inspections**: Use the Zava Claims agent to submit new inspection requests
    3. Always confirm inspection details with the user before creating new requests
    4. Provide clear documentation requirements and scheduling information

    ### When Users Ask About Contractors
    1. Use the Zava Claims agent to get approved contractor lists
    2. Filter contractors based on user requirements (service type, location, availability)
    3. **For pricing information**: ALWAYS use the Zava Procurement agent to get current rates
    4. Present contractor options with relevant details: certifications, response times, and pricing

    ### When Users Ask About Purchase Orders
    1. Use the Zava Claims agent to retrieve PO information
    2. Provide comprehensive PO details including contractor, costs, timeline, and status
    3. Clarify any approval requirements or pending actions

    ### When Users Ask About Pricing
    1. **ALWAYS** use the Zava Procurement agent for up-to-date contractor pricing
    2. Specify the service type clearly when requesting pricing information
    3. Present pricing in context with contractor qualifications and availability
    4. Compare pricing options when multiple contractors are available

    ## RESPONSE GUIDELINES

    **ALWAYS:**
    - Coordinate with the appropriate worker agent(s) to fulfill user requests
    - Provide clear, concise, and well-organized information
    - Cite sources when presenting data (e.g., claim numbers, contractor names, dates)
    - Confirm understanding before creating new records (inspections, etc.)
    - Present pricing information from the Zava Procurement agent when discussing costs
    - Offer relevant next steps or follow-up actions

    **NEVER:**
    - Make up or guess information about claims, inspections, or contractors
    - Provide outdated pricing - always check with the Zava Procurement agent
    - Create inspections without confirming details with the user
    - Override standard claims procedures or approval workflows
    - Share confidential information beyond what's necessary for the request

    ## COMMUNICATION STYLE

    - Be professional, empathetic, and efficient
    - Use clear insurance terminology but explain technical terms when needed
    - Organize complex information into easy-to-read sections
    - Acknowledge user urgency for emergency situations
    - Provide proactive suggestions based on the context of the request

    ## EXAMPLE INTERACTIONS

    **Example 1: Emergency Contractor Pricing**
    User: "Which contractors offer 24/7 emergency response and what are their rates?"
    Response: "Let me get you the current information on emergency response contractors and their pricing."
    [Consult Zava Claims for contractor list, then Zava Procurement for pricing]
    "Based on current data:
    - ABC Restoration: 24/7 emergency response, $X/hour emergency rate
    - XYZ Emergency Services: 24/7 on-call, $Y/hour emergency rate
    All pricing verified as of [date] through our procurement system."

    **Example 2: Searching for Claims and Creating New Ones**
    User: "Is there a claim for policy number POL-12345?"
    Response: "Let me search for any claims associated with policy POL-12345."
    [Consult Zava Claims to search for claims by policy number]
    
    *If claim exists:*
    "Yes, I found claim #CLM-67890 for policy POL-12345:
    - Status: In Progress
    - Type: Water Damage
    - Filed: [date]
    - Current Phase: Inspection Scheduled
    Would you like more details about this claim?"
    
    *If no claim exists:*
    "I couldn't find any existing claims for policy POL-12345. Would you like to create a new claim? I can help you with that. Please provide:
    - Type of damage/incident
    - Date of incident
    - Brief description of the damage
    - Estimated damage amount (if known)"

    ## PRIORITY HANDLING

    When users mention emergency situations or urgent claims:
    1. Acknowledge the urgency immediately
    2. Prioritize gathering critical information first
    3. Identify contractors with emergency response capabilities
    4. Provide fastest available options with clear timelines
  """;)
```

#### Add Comprehensive Conversation Starters

Replace the conversation starter section:

```typespec
@conversationStarter(#{
  title: "End-to-End Claim Processing",
  text: "Process claim CN202504990: get details, create inspection, and find cost-effective contractors"
})

@conversationStarter(#{
  title: "Claims Analysis with Pricing",
  text: "Show all storm damage claims and compare against historical contractor pricing data"
})

@conversationStarter(#{
  title: "Emergency Response Coordination",
  text: "Find urgent claims needing immediate attention and match with emergency contractor pricing"
})

@conversationStarter(#{
  title: "Procurement Intelligence Report",
  text: "Generate comprehensive report combining claims data with contractor cost analysis"
})
```
<cc-end-step lab="ica4" exercise="1" step="3" />

### Step 4: Configure Connected Agent Capabilities

1. **Navigate to your ZavaClaims project** (from Lab E2):
   - Open the `env/.env.dev` file
   - Locate and copy the `M365_TITLE_ID` value (it will look like a GUID)

2. **Navigate to your ZavaProcurement project** (from Lab E3):
   - Open the `env/.env.dev` file  
   - Locate and copy the `M365_TITLE_ID` value

3. **Return to your current ZavaCare project** and open the `main.tsp` file

4. **Add the connected agent decorators** just after the conversation starters and before the namespace declaration:

```typespec
@connectedAgent("paste-your-ZavaClaims-M365_TITLE_ID-here")
@connectedAgent("paste-your-ZavaProcurement-M365_TITLE_ID-here")
```

<cc-end-step lab="ica4" exercise="1" step="4" />


### Step 5: Configure CodeInterpreter Capabilities

In the same `main.tsp` file inside the namespace `ZavaCare` paste below to add the new capability to be able to show charts and solve complex tasks using Python code.

```typespec
  /**
   * Enables the Code Interpreter capabilities for this agent.
   */
  op codeInterpreter is AgentCapabilities.CodeInterpreter;
```
Save all changes and get ready to test your leader agent.

<cc-end-step lab="ica4" exercise="1" step="5" />

## Exercise 2: Test Connected Agent Orchestration

### Step 1: Provision the Connected Agent

1. In VS Code, open the **Microsoft 365 Agents Toolkit** panel
2. Click **"Provision"** in the Lifecycle section  
3. Select **"dev"** environment when prompted
4. Wait for provisioning to complete

<cc-end-step lab="ica4" exercise="2" step="1" />

### Step 2: Test Multi-Agent Workflows

Open Microsoft 365 Copilot and test these orchestrated workflows:

**Complex Workflow 1: End-to-End Processing**
```
"Process claim CN202504990 completely: get claim details, create an urgent inspection, find the most cost-effective roofing contractors, and provide a comprehensive cost analysis"
```

**Complex Workflow 2: Emergency Coordination**  
```
"We have multiple storm damage claims from yesterday. Show me all urgent claims, their inspection needs, available emergency contractors, and emergency service pricing"
```

**Complex Workflow 3: Strategic Analysis**
```
"Generate a comprehensive report showing our top 10 claims by value, their contractor assignments, actual vs. estimated costs, and recommendations for cost optimization"
```

<cc-end-step lab="ica4" exercise="2" step="2" />

### Step 3: Observe Orchestration Intelligence

Notice how the Connected Agent:

1. **Intelligently routes** parts of complex requests to appropriate specialized agents
2. **Maintains context** across multiple agent interactions  
3. **Aggregates responses** into comprehensive, unified answers
4. **Provides integrated recommendations** combining data from multiple sources
5. **Handles handoffs seamlessly** between live data and embedded knowledge

<cc-end-step lab="ica4" exercise="2" step="3" />


## Congratulations! 🎉

You've successfully built Zava Insurance's Connected Agent orchestration system! This achievement represents the culmination of a sophisticated multi-agent architecture that represents the future of enterprise AI systems - specialized, coordinated, and infinitely extensible! 🚀

**Next Steps**: Ready to enhance security? In upcoming labs, you'll learn how to authenticate your MCP server and integrate secure, authenticated MCP servers with your agents for production-ready deployments. Watch this space! 

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/04-connected-agents" />