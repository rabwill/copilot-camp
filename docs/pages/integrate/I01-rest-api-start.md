# Lab: Build a Backend API for Insurance Claims Operations
## Part 1: Core API for Claims Ops

## Introduction

In this lab you'll explore and test a comprehensive **Azure Functions API** for home insurance claims operations. This lab focuses on understanding the existing codebase, testing current functionality, and preparing for future enhancements.

### What You'll Explore

In this lab, you'll work with the **Contoso Claims Ops API** - a production-ready backend system that provides:

- **Claims Management** - View and update insurance claims with comprehensive data models
- **Inspection Operations** - Browse existing inspection tasks and understand the data structure  
- **Contractor Management** - Access contractor information and purchase order workflows


### Architecture Overview

The solution uses modern Azure serverless technologies with a layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Contoso Claims API                       │
├─────────────────────────────────────────────────────────────┤
│  Azure Functions v4 (TypeScript)                          │
│  ├── Claims Functions (GET, PUT)                          │
│  ├── Inspections Functions (GET only - Part 1)           │
│  ├── Contractors Functions (GET, POST)                    │
│  └── Swagger Documentation (Interactive UI)               │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                     │
│  ├── ClaimsImplementation (CRUD operations)              │
│  ├── InspectionsImplementation (Read + Future Create)    │
│  ├── ContractorsImplementation (Full CRUD)               │
│  └── Custom Error Types (Business logic validation)      │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                               │
│  ├── Azure Table Storage (Claims, Inspections, POs)      │
│  ├── TableStorageService (Data mapping & persistence)    │
│  ├── Azurite (Local Development Emulator)                │
│  └── JSON Mock Data (Realistic Insurance Scenarios)      │
├─────────────────────────────────────────────────────────────┤
│  Type Safety & Validation                                │
│  ├── TypeScript Interfaces (Complete type definitions)   │
│  ├── Joi Validation (Request/response validation)        │
│  └── Custom Business Logic Errors                        │
└─────────────────────────────────────────────────────────────┘
```

## Learning Objectives

By completing this lab, you will:

1. **Understand Azure Functions v4 architecture** and the TypeScript programming model
3. **Master Table Storage operations** using Azure Table Storage with Azurite emulator
4. **Navigate interactive API documentation** using Swagger UI for testing and exploration
5. **Understand enterprise patterns** including error handling, validation, and data mapping
6. **Prepare for AI integration** by understanding the data structures designed for ML workflows

## Prerequisites

### Prerequisites

- **Node.js 18.x or later** - [Download](https://nodejs.org/)
- **Azure Functions Core Tools v4** - Install: `npm install -g azure-functions-core-tools@4 --unsafe-perm true`
- **VS Code** (recommended) with Azure Functions extension


## Lab Scenario

You're joining the **Contoso Insurance** development team to understand their existing claims processing API. The system handles real insurance operations including claims management, property inspections, and contractor coordination.

### Current System Capabilities

**What's Already Built:**
- Complete claims management with policy holder and property data
- Inspection task viewing and filtering
- Contractor browsing and purchase order creation
- Comprehensive API documentation with interactive testing

**What You'll Add:**
- Inspection task creation 

### Sample Data You'll Work With

The system includes realistic insurance scenarios:

- **Claim CN202504990**: Storm damage to a Seattle home with roof issues
- **Claim CN202504991**: Water damage from a pipe leak in Portland  
- **Inspection Tasks**: Property assessments with AI analysis results
- **Contractors**: Certified contractors with specializations and ratings
- **Purchase Orders**: Active repair work orders with detailed line items

## Exercise 1: Environment Setup and Data Exploration (20 minutes)

### Step 1: Clone and Setup the Project

```bash
# Clone the repository
git clone -branch rest-api-lab-start https://github.com/microsoft/contoso-claims-ops.git
cd contoso-claims-ops

# Install dependencies
npm install

# Build the TypeScript project
npm run build
```

### Step 2: Start the Local Development Environment

```bash
# Terminal 1: Start Azurite storage emulator
npm run start:azurite

# Terminal 2: Initialize sample data (wait for Azurite to start)
npm run init-data

# Terminal 3: Start Azure Functions
npm start
```

**✅ Checkpoint**: Verify all services are running:
- Azurite: Storage emulator running on ports 10000-10002
- Data initialization: Sample insurance data loaded successfully
- Azure Functions: API available at http://localhost:7071/api

### Step 3: Access the Interactive Documentation

Open your browser and navigate to: **http://localhost:7071/api/index**

This will redirect you to the comprehensive Swagger UI interface where you can:
- Browse all 12 API endpoints
- View detailed request/response schemas
- Test endpoints interactively
- Understand the complete data model

## Exercise 2: Understanding the Inspection System Architecture (25 minutes)

### Step 1: Explore the Inspection Data Model

Let's examine the current inspection functionality by looking at the key files:

#### A. TypeScript Type Definitions

Open [`src/types/index.ts`](src/types/index.ts) and review the inspection-related interfaces:

```typescript
// Key interfaces you'll work with
export interface InspectionTask {
  id: string;
  claimId: string;
  claimNumber: string;
  taskType: 'initial' | 'reinspection' | 'final' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  // ... detailed property and photo analysis data
}

export interface InspectionPhoto {
  id: string;
  filename: string;
  url: string;
  description: string;
  damageVisible: boolean;
  aiAnalysis?: {
    confidence: number;
    detectedDamage: string[];
    flags: string[];
  };
}
```

**🔍 Key Observations:**
- Comprehensive type safety for all inspection operations
- Built-in support for AI analysis results
- Structured data for insurance workflow requirements
- Integration points for photo analysis and damage detection

#### B. Current Inspection Functions

Examine [`src/functions/inspections.ts`](src/functions/inspections.ts):

The file currently implements:
- **`getInspections`**: Retrieves inspection tasks with filtering capabilities
- **HTTP route registration**: Only GET method is currently active
- **Comprehensive Swagger documentation**: Detailed API specifications
- **Error handling**: Production-ready error management

**📝 Notice**: The POST endpoint for creating inspectionsdoes not exist yet but we'll implement it in in this lab

### Step 2: Test the Existing Inspection Functionality

#### A. View All Inspections

1. Open Swagger UI: http://localhost:7071/api/swagger-ui
2. Navigate to **Inspections** section
3. Click on **GET /inspections**
4. Click **"Try it out"** and **"Execute"**

**Expected Result**: You should see 2 inspection tasks:
- `insp-001`: Completed roof inspection for claim CN202504990
- `insp-002`: Scheduled water damage inspection for claim CN202504991

#### B. Filter Inspections by Claim

1. In the same GET endpoint, add a query parameter:
   - **claimId**: `1` (for the Seattle roof damage claim)
2. Execute the request

**Expected Result**: Only one inspection task related to the roof damage claim.

#### C. Filter by Status

1. Clear the claimId parameter
2. Add **status**: `completed`
3. Execute the request

**Expected Result**: Only the completed inspection task with full findings and AI analysis.

## Exercise 3: Understanding the Complete System (30 minutes)

### Step 1: Explore Claims Management

#### A. View Claims Data Structure

Test the claims endpoints to understand how inspections relate to claims:

1. **GET /claims**: View all insurance claims
2. **GET /claims/CN202504990**: View the specific storm damage claim

**🔍 Key Observations:**
- Claims contain policy holder information, property details, and damage assessments
- Each claim can have multiple inspection tasks
- Status tracking throughout the claims lifecycle

#### B. Update a Claim

Try updating claim CN202504990:

1. Navigate to **PUT /claims/CN202504990**
2. Use this request body:
```json
{
  "status": {
    "name": "Under Review",
    "description": "Inspection completed, reviewing findings"
  },
  "estimatedLoss": 18000,
  "notes": ["Inspection completed", "Roof damage confirmed", "Contractor quotes pending"]
}
```

### Step 2: Explore Contractor and Purchase Order System

#### A. Browse Available Contractors

1. **GET /contractors**: View all active contractors
2. **Filter by specialty**: Add `specialty=Roofing` to see roofing specialists
3. **Filter preferred contractors**: Add `isPreferred=true`

#### B. Create a Purchase Order

1. **POST /purchase-orders**: Create a repair work order
2. Use this sample request:
```json
{
  "claimId": "1",
  "contractorId": "contractor-001",
  "workDescription": "Emergency roof repair and decking replacement",
  "lineItems": [
    {
      "description": "Emergency tarp installation",
      "quantity": 1,
      "unitPrice": 500.00,
      "category": "labor"
    }
  ],
  "notes": ["Emergency repair needed immediately"]
}
```

## Exercise 4: Understanding the Technical Architecture (25 minutes)

### Step 1: Examine the Data Persistence Layer

#### A. Table Storage Service

Review [`src/services/tableStorage.ts`](src/services/tableStorage.ts):

**Key Features:**
- **Azurite Integration**: Local development with Azure Table Storage emulation
- **Entity Mapping**: Conversion between TypeScript objects and Table Storage entities
- **JSON Serialization**: Complex objects stored as JSON strings in Table Storage
- **CRUD Operations**: Full create, read, update, delete functionality

**🔍 Technical Insight**: Notice how complex TypeScript objects are flattened into Table Storage entities with JSON serialization for nested data.

#### B. Business Logic Implementation

Examine [`src/implementation/inspectionsImplementation.ts`](src/implementation/inspectionsImplementation.ts):

**Current Capabilities:**
- **`getAllInspections`**: Filtering and data retrieval logic
- **`getInspectionById`**: Single inspection retrieval
- **`analyzeInspectionPhotos`**: Mock AI analysis (ready for real AI integration)
- **Custom Error Types**: `InspectionNotFoundError`, `ValidationError`

**🔍 What's Missing**: The `createInspectionTask` method exists but we'll enhance it in Part 2.

### Step 2: Test AI Integration Capabilities

The system includes mock AI analysis to demonstrate integration patterns:

1. Get an existing inspection ID: `insp-001`
2. Navigate to **POST /inspections/{taskId}/analyze-photos** (this endpoint exists in the implementation)
3. Enter task ID: `insp-001`
4. Execute the request

**Expected Result**: Mock AI analysis showing:
- Detected damage types and severity levels
- Confidence scores for AI predictions
- Automated recommendations for repair actions
- Flagged issues requiring immediate attention

### Step 3: Explore the Type Safety System

#### A. Validation Patterns

Review [`src/implementation/claimsImplementation.ts`](src/implementation/claimsImplementation.ts) to see:

**Joi Validation Schemas**:
```typescript
const updateClaimSchema = Joi.object({
  status: Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    description: Joi.string()
  }),
  estimatedLoss: Joi.number().min(0),
  damageTypes: Joi.array().items(/* detailed validation */)
});
```

**Custom Error Handling**:
```typescript
export class ClaimNotFoundError extends Error {
  constructor(claimNumber: string) {
    super(`Claim ${claimNumber} not found`);
    this.name = 'ClaimNotFoundError';
  }
}
```

#### B. Complete Type Coverage

The system provides comprehensive TypeScript coverage for:
- **Insurance domain objects**: Claims, policies, properties, damage types
- **Inspection workflows**: Tasks, photos, analysis results, recommendations
- **Business operations**: Contractors, purchase orders, line items
- **API responses**: Standardized response formats with proper error handling


**Great work!** You've successfully explored a production-ready insurance claims API and understand how modern serverless architectures handle complex business domains. The foundation you've built will support advanced AI integration and enterprise-scale operations.

Next you will implement the "create inspection" functionality and complete the full inspection management workflow.

## Exercise 5: Implement the  Create Inspection Functionality 


### Files You'll Create/Modify

```
src/
├── functions/
│   └── inspections.ts              # ✏️ Add POST endpoint implementation
├── implementation/
│   └── inspectionsImplementation.ts # ✏️ Add createInspectionTask method
└── types/
    └── index.ts                    # ✅ Already complete (interfaces defined)
```

### Step 1: Review What Exists

Let's examine the current state of the inspection system:

#### A. Existing Function Implementation

Open [`src/functions/inspections.ts`](src/functions/inspections.ts) and observe:

```typescript
// Currently only has:
export async function getInspections(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // ... GET implementation exists
}

// HTTP registration only includes GET:
app.http('getInspections', {
  methods: ['GET'],
  route: 'inspections',
  authLevel: 'anonymous',
  handler: getInspections
});

// Missing: createInspection function and POST route registration
```

#### B. Existing Implementation Class

Open [`src/implementation/inspectionsImplementation.ts`](src/implementation/inspectionsImplementation.ts) and observe:

```typescript
export class InspectionsImplementation {
  // ✅ Has: getAllInspections method
  async getAllInspections(claimId?: string, status?: string): Promise<InspectionTask[]> {
    // ... implementation exists
  }

  // ✅ Has: getInspectionById method  
  async getInspectionById(taskId: string): Promise<InspectionTask> {
    // ... implementation exists
  }

  // ❌ Missing: createInspectionTask method - you'll add this
}
```

#### C. Available Type Definitions

Review [`src/types/index.ts`](src/types/index.ts) to see the interfaces you'll use:

```typescript
export interface CreateInspectionTaskRequest {
  claimId: string;
  taskType: 'initial' | 'reinspection' | 'final' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate?: string;
  inspectorId?: string;
  instructions: string;
}

export interface InspectionTask {
  id: string;
  claimId: string;
  claimNumber: string;
  taskType: 'initial' | 'reinspection' | 'final' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  // ... many more properties
}
```

### Step 2: Identify What Needs to Be Built

We need to implement:

1. **Validation Schema** - Joi schema for request validation
2. **Business Logic** - Create inspection method with rules
3. **HTTP Function** - POST endpoint handler
4. **Error Handling** - Custom error classes and HTTP responses
5. **Route Registration** - Wire up the POST endpoint


### Step 3: Create Validation Schema and Error Classes

Open [`src/implementation/inspectionsImplementation.ts`](src/implementation/inspectionsImplementation.ts) and add these additions:

#### A. Add Required Imports (at the top of the file)

```typescript
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
```

#### B. Add Validation Schema (after the imports)

```typescript
// Validation schema for creating inspection tasks
const createInspectionTaskSchema = Joi.object({
  claimId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Claim ID is required',
      'any.required': 'Claim ID must be provided'
    }),
  taskType: Joi.string()
    .valid('initial', 'reinspection', 'final', 'emergency')
    .required()
    .messages({
      'any.only': 'Task type must be one of: initial, reinspection, final, emergency',
      'any.required': 'Task type is required'
    }),
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent')
    .required()
    .messages({
      'any.only': 'Priority must be one of: low, medium, high, urgent',
      'any.required': 'Priority level is required'
    }),
  scheduledDate: Joi.string()
    .isoDate()
    .optional()
    .messages({
      'string.isoDate': 'Scheduled date must be a valid ISO date string'
    }),
  inspectorId: Joi.string()
    .optional()
    .messages({
      'string.base': 'Inspector ID must be a string'
    }),
  instructions: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Instructions must be at least 10 characters long',
      'string.max': 'Instructions cannot exceed 1000 characters',
      'string.empty': 'Instructions are required',
      'any.required': 'Instructions must be provided'
    })
});
```

#### C. Add Custom Error Classes (before the class definition)

```typescript
// Custom error types for business logic
export class InspectionNotFoundError extends Error {
  constructor(taskId: string) {
    super(`Inspection task ${taskId} not found`);
    this.name = 'InspectionNotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ClaimNotFoundError extends Error {
  constructor(claimId: string) {
    super(`Claim with ID ${claimId} not found`);
    this.name = 'ClaimNotFoundError';
  }
}

export class BusinessRuleViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleViolationError';
  }
}
```

### Step 4: Add Helper Methods to the InspectionsImplementation Class

Add these private methods inside the `InspectionsImplementation` class:

```typescript
export class InspectionsImplementation {
  // ... existing methods ...

  // Add these new private helper methods:

  private async validateClaimExists(claimId: string): Promise<any> {
    logger.info(`Validating claim exists: ${claimId}`);
    
    const claims = await tableStorageService.getClaims();
    const claim = claims.find(c => c.id === claimId);
    
    if (!claim) {
      throw new ClaimNotFoundError(claimId);
    }
    
    return claim;
  }

  private async validateBusinessRules(taskData: CreateInspectionTaskRequest, claim: any): Promise<void> {
    logger.info('Validating business rules for inspection creation');
    
    // Rule 1: Check if claim is in a valid state for inspection
    if (claim.status.name === 'Closed' || claim.status.name === 'Denied') {
      throw new BusinessRuleViolationError(
        `Cannot create inspection for ${claim.status.name.toLowerCase()} claim`
      );
    }
    
    // Rule 2: Check for duplicate pending inspections of the same type
    const existingInspections = await tableStorageService.getInspections(taskData.claimId);
    const pendingInspections = existingInspections.filter(
      inspection => inspection.status === 'pending' || inspection.status === 'scheduled'
    );
    
    const duplicateTypeInspection = pendingInspections.find(
      inspection => inspection.taskType === taskData.taskType
    );
    
    if (duplicateTypeInspection) {
      throw new BusinessRuleViolationError(
        `A ${taskData.taskType} inspection is already pending for this claim (ID: ${duplicateTypeInspection.id})`
      );
    }
    
    // Rule 3: Validate scheduled date constraints
    if (taskData.scheduledDate) {
      const scheduledDate = new Date(taskData.scheduledDate);
      const now = new Date();
      
      // Cannot schedule in the past
      if (scheduledDate < now) {
        throw new ValidationError('Scheduled date cannot be in the past');
      }
      
      // Cannot schedule more than 90 days in the future
      const maxFutureDate = new Date();
      maxFutureDate.setDate(maxFutureDate.getDate() + 90);
      
      if (scheduledDate > maxFutureDate) {
        throw new ValidationError('Scheduled date cannot be more than 90 days in the future');
      }
    }
  }

  private generateInspectionId(): string {
    // Generate a meaningful inspection ID with timestamp
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const random = Math.random().toString(36).substr(2, 4);
    return `insp-${timestamp}-${random}`;
  }
}
```

### Step 5: Implement the Main createInspectionTask Method

Add this method to the `InspectionsImplementation` class:

```typescript
export class InspectionsImplementation {
  // ... existing methods and helpers ...

  async createInspectionTask(taskData: CreateInspectionTaskRequest): Promise<InspectionTask> {
    logger.info('Starting inspection task creation', { 
      claimId: taskData.claimId, 
      taskType: taskData.taskType,
      priority: taskData.priority 
    });

    // Step 1: Validate request structure
    const { error } = createInspectionTaskSchema.validate(taskData);
    if (error) {
      const errorMessage = error.details[0]?.message || 'Invalid request data';
      logger.error('Validation failed', { error: errorMessage });
      throw new ValidationError(errorMessage);
    }
    
    // Step 2: Validate claim exists and get claim data
    const claim = await this.validateClaimExists(taskData.claimId);
    logger.info('Claim validation successful', { claimNumber: claim.claimNumber });
    
    // Step 3: Apply business rules validation
    await this.validateBusinessRules(taskData, claim);
    logger.info('Business rules validation successful');
    
    // Step 4: Generate unique inspection ID
    const inspectionId = this.generateInspectionId();
    
    // Step 5: Determine initial status based on scheduling
    const initialStatus = taskData.scheduledDate ? 'scheduled' : 'pending';
    
    // Step 6: Create comprehensive inspection task object
    const newTask: InspectionTask = {
      id: inspectionId,
      claimId: taskData.claimId,
      claimNumber: claim.claimNumber,
      taskType: taskData.taskType,
      priority: taskData.priority,
      status: initialStatus,
      scheduledDate: taskData.scheduledDate,
      instructions: taskData.instructions,
      
      // Initialize empty collections for future data
      photos: [],
      findings: '',
      recommendedActions: [],
      flaggedIssues: [],
      
      // Copy property information from the associated claim
      property: {
        id: claim.property.id,
        address: { ...claim.property.address },
        propertyType: claim.property.propertyType,
        yearBuilt: claim.property.yearBuilt,
        squareFootage: claim.property.squareFootage,
        roofType: claim.property.roofType,
        constructionType: claim.property.constructionType
      },
      
      // Set inspector information if provided
      inspector: taskData.inspectorId ? {
        id: taskData.inspectorId,
        name: 'To Be Assigned', // In real system, would lookup inspector details
        email: 'tba@contoso.com',
        phone: '555-0000',
        licenseNumber: 'TBA',
        specializations: ['General Inspection']
      } : undefined,
      
      // Set timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Step 7: Save to Azure Table Storage
    try {
      await tableStorageService.upsertInspection(newTask);
      logger.info('Inspection task created and saved successfully', { 
        inspectionId: newTask.id,
        claimNumber: newTask.claimNumber,
        status: newTask.status
      });
    } catch (error) {
      logger.error('Failed to save inspection task to storage', error);
      throw new Error('Failed to create inspection task due to storage error');
    }
    
    return newTask;
  }
}
```



### Step 6: Add the Create Inspection HTTP Function

Open [`src/functions/inspections.ts`](src/functions/inspections.ts) and add these additions:

#### A. Add Missing Imports (update the imports section)

```typescript
import { 
  inspectionsImplementation,
  InspectionNotFoundError,
  ValidationError,
  ClaimNotFoundError,
  BusinessRuleViolationError  // Add this import
} from '../implementation/inspectionsImplementation';
```

#### B. Add the createInspection Function (after the getInspections function)

```typescript
/**
 * @swagger
 * /inspections:
 *   post:
 *     tags: [Inspections]
 *     summary: Create a new inspection task
 *     description: Create a new inspection task for a claim with comprehensive validation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - claimId
 *               - taskType
 *               - priority
 *               - instructions
 *             properties:
 *               claimId:
 *                 type: string
 *                 description: ID of the associated claim
 *               taskType:
 *                 type: string
 *                 enum: [initial, reinspection, final, emergency]
 *                 description: Type of inspection task
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 description: Priority level
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled date for inspection (optional)
 *               inspectorId:
 *                 type: string
 *                 description: ID of assigned inspector (optional)
 *               instructions:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 description: Detailed inspection instructions
 *           example:
 *             claimId: "1"
 *             taskType: "initial"
 *             priority: "high"
 *             instructions: "Assess roof damage after recent storm. Focus on potential structural issues and water damage."
 *             scheduledDate: "2025-10-25T09:00:00Z"
 *     responses:
 *       201:
 *         description: Successfully created inspection task
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/InspectionTask'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Claim not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Business rule violation (e.g., duplicate inspection)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export async function createInspection(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    // Parse and validate request body
    const taskData: CreateInspectionTaskRequest = await request.json() as CreateInspectionTaskRequest;
    
    logger.info('Received create inspection request', { 
      claimId: taskData.claimId, 
      taskType: taskData.taskType 
    });
    
    // Create the inspection task
    const newTask = await inspectionsImplementation.createInspectionTask(taskData);
    
    // Return successful response
    const response: ApiResponse<InspectionTask> = {
      success: true,
      data: newTask,
      message: 'Inspection task created successfully',
      timestamp: new Date().toISOString()
    };
    
    logger.info('Inspection creation successful', { 
      inspectionId: newTask.id,
      claimNumber: newTask.claimNumber 
    });
    
    return {
      status: 201,
      jsonBody: response
    };
  } catch (error) {
    // Handle validation errors (400 Bad Request)
    if (error instanceof ValidationError) {
      logger.warn('Validation error during inspection creation', { error: error.message });
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    // Handle claim not found (404 Not Found)
    if (error instanceof ClaimNotFoundError) {
      logger.warn('Claim not found during inspection creation', { error: error.message });
      return {
        status: 404,
        jsonBody: {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    // Handle business rule violations (409 Conflict)
    if (error instanceof BusinessRuleViolationError) {
      logger.warn('Business rule violation during inspection creation', { error: error.message });
      return {
        status: 409,
        jsonBody: {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    // Handle all other errors (500 Internal Server Error)
    logger.error('Unexpected error during inspection creation:', error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      }
    };
  }
}
```

### Step 7: Register the POST Route

Add the route registration at the end of [`src/functions/inspections.ts`](src/functions/inspections.ts):

```typescript
// Register HTTP triggers
app.http('getInspections', {
  methods: ['GET'],
  route: 'inspections',
  authLevel: 'anonymous',
  handler: getInspections
});

// Add this new registration for POST
app.http('createInspection', {
  methods: ['POST'],
  route: 'inspections',
  authLevel: 'anonymous',
  handler: createInspection
});
```

### Step 8: Add Individual Inspection Retrieval (Bonus)

While we're enhancing the system, let's add the ability to get individual inspections:

```typescript
/**
 * @swagger
 * /inspections/{taskId}:
 *   get:
 *     tags: [Inspections]
 *     summary: Get a specific inspection task
 *     description: Retrieve details of a specific inspection task by ID
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The inspection task ID
 *     responses:
 *       200:
 *         description: Successfully retrieved inspection task
 *       404:
 *         description: Inspection task not found
 *       500:
 *         description: Internal server error
 */
export async function getInspectionById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const taskId = request.params.taskId;
    
    const task = await inspectionsImplementation.getInspectionById(taskId);
    
    const response: ApiResponse<InspectionTask> = {
      success: true,
      data: task,
      message: 'Inspection task retrieved successfully',
      timestamp: new Date().toISOString()
    };
    
    return {
      status: 200,
      jsonBody: response
    };
  } catch (error) {
    if (error instanceof InspectionNotFoundError) {
      return {
        status: 404,
        jsonBody: {
          success: false,
          error: 'Inspection task not found',
          timestamp: new Date().toISOString()
        }
      };
    }
    
    logger.error('Error fetching inspection:', error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Register the individual inspection endpoint
app.http('getInspectionById', {
  methods: ['GET'],
  route: 'inspections/{taskId}',
  authLevel: 'anonymous',
  handler: getInspectionById
});
```


### Step 9: Build and Start the Enhanced System

```bash
# Build the TypeScript code
npm run build

# If Azure Functions is running, restart it to pick up changes
# Press Ctrl+C to stop, then:
npm start
```

### Step 10: Test the New Create Inspection Functionality

#### A. Test Successful Creation

1. **Open Swagger UI**: http://localhost:7071/api/swagger-ui
2. **Navigate to POST /inspections**
3. **Test with valid data**:

```json
{
  "claimId": "1",
  "taskType": "reinspection",
  "priority": "medium",
  "instructions": "Follow-up inspection to assess repair work completed after initial roof damage assessment. Check for proper installation of new shingles and verify structural integrity.",
  "scheduledDate": "2025-10-25T10:00:00Z"
}
```

**Expected Result**: 
- Status: 201 Created
- Response includes complete inspection task with generated ID
- Property information copied from claim
- Status set to "scheduled" (because scheduledDate provided)

#### B. Test Validation Scenarios

4. **Test missing required field**:
```json
{
  "claimId": "1",
  "taskType": "initial",
  "priority": "high"
}
```
**Expected**: 400 Bad Request - "Instructions are required"

5. **Test invalid claim ID**:
```json
{
  "claimId": "999",
  "taskType": "initial",
  "priority": "high",
  "instructions": "Test inspection for non-existent claim"
}
```
**Expected**: 404 Not Found - "Claim with ID 999 not found"

6. **Test short instructions**:
```json
{
  "claimId": "2",
  "taskType": "initial",
  "priority": "high",
  "instructions": "Too short"
}
```
**Expected**: 400 Bad Request - "Instructions must be at least 10 characters long"

#### C. Test Business Rules

7. **Create initial inspection for claim 1**:
```json
{
  "claimId": "1",
  "taskType": "initial",
  "priority": "high",
  "instructions": "Initial damage assessment for storm damage claim"
}
```

8. **Try to create another initial inspection** (should fail):
```json
{
  "claimId": "1",
  "taskType": "initial",
  "priority": "medium",
  "instructions": "Another initial inspection - this should be rejected"
}
```
**Expected**: 409 Conflict - Duplicate inspection message

9. **Test past date validation**:
```json
{
  "claimId": "2",
  "taskType": "initial",
  "priority": "high",
  "instructions": "Test inspection with past scheduled date",
  "scheduledDate": "2025-01-01T10:00:00Z"
}
```
**Expected**: 400 Bad Request - "Scheduled date cannot be in the past"


## Summary of What You Built

### New Files/Functionality Added:

1. **Enhanced [`src/implementation/inspectionsImplementation.ts`](src/implementation/inspectionsImplementation.ts)**:
   - ✅ Comprehensive Joi validation schema
   - ✅ Custom error classes for different scenarios
   - ✅ Business rule validation methods
   - ✅ Complete `createInspectionTask` method with full logic
   - ✅ Helper methods for validation and ID generation

2. **Enhanced [`src/functions/inspections.ts`](src/functions/inspections.ts)**:
   - ✅ `createInspection` HTTP function with full error handling
   - ✅ `getInspectionById` function for individual retrieval
   - ✅ POST and GET route registrations
   - ✅ Comprehensive Swagger documentation

### Key Features Implemented:
- **Request validation** with custom error messages
- **Business rule enforcement** (no duplicates, valid claims, date constraints)
- **Automatic data population** from associated claims
- **Status management** based on scheduling information
- **Comprehensive error handling** with appropriate HTTP codes
- **Integration with existing data layer** using Table Storage


**Congratulations!** You've successfully built a complete, production-ready inspection creation system from scratch. The system now supports the full inspection management lifecycle with enterprise-grade validation, error handling, and business logic integration with the broader claims management platform. Select "Next" to create MCP server from the Claims Ops Service. 