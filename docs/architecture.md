# Job Importer System - High-Level Design Architecture

## 🏗️ System Overview

The Job Importer System is a scalable, queue-based data processing pipeline designed to fetch, transform, and store job listings from external APIs. The system handles XML-to-JSON transformation, implements deduplication logic, and provides real-time import tracking through a web dashboard.

## 🎯 Architecture Goals

- **Scalability**: Handle high-volume job imports with horizontal scaling capabilities
- **Reliability**: Fault-tolerant processing with retry mechanisms and dead letter queues
- **Modularity**: Clean separation of concerns with pluggable components
- **Observability**: Comprehensive logging and monitoring of import operations
- **Performance**: Efficient bulk operations and concurrent processing

## 🏛️ System Architecture

```
                    EXTERNAL DATA SOURCES
                           │
                    ┌─────────────────┐
                    │ Job APIs (XML)  │
                    │ • Jobicy.com    │
                    │ • HigherEdJobs  │
                    └─────────┬───────┘
                              │ HTTP/XML
                              ▼
    ┌─────────────────────────────────────────────────────────┐
    │                   DATA INGESTION LAYER                  │
    ├─────────────────────────────────────────────────────────┤
    │  ┌─────────────────┐    ┌─────────────────────────────┐ │
    │  │  Fetch Service  │    │    Cron Scheduler           │ │
    │  │ • HTTP Client   │◀───│ • Hourly triggers           │ │
    │  │ • Rate limiting │    │ • Manual import endpoint    │ │
    │  │ • Error handling│    └─────────────────────────────┘ │
    │  └─────────┬───────┘                                    │
    └────────────┼────────────────────────────────────────────┘
                 │ Raw XML Data
                 ▼
    ┌─────────────────────────────────────────────────────────┐
    │                TRANSFORMATION LAYER                     │
    ├─────────────────────────────────────────────────────────┤
    │  ┌─────────────────────────────────────────────────────┐ │
    │  │         XML → JSON Parser & Validator              │ │
    │  │ • xml2js library for XML parsing                   │ │
    │  │ • Schema validation                                 │ │
    │  │ • Data normalization                               │ │
    │  │ • Field mapping & sanitization                     │ │
    │  └─────────────────┬───────────────────────────────────┘ │
    └────────────────────┼───────────────────────────────────────┘
                         │ Validated JSON Jobs
                         ▼
    ┌─────────────────────────────────────────────────────────┐
    │                   QUEUE LAYER                           │
    ├─────────────────────────────────────────────────────────┤
    │  ┌─────────────────────────────────────────────────────┐ │
    │  │              Redis + BullMQ                        │ │
    │  │ • Job batching (configurable batch size)           │ │
    │  │ • Priority queuing                                 │ │
    │  │ • Dead Letter Queue (DLQ) for failed jobs          │ │
    │  │ • Rate limiting & throttling                       │ │
    │  │ • Job retry with exponential backoff               │ │
    │  └─────────────────┬───────────────────────────────────┘ │
    └────────────────────┼───────────────────────────────────────┘
                         │ Queued Jobs
                         ▼
    ┌─────────────────────────────────────────────────────────┐
    │                 PROCESSING LAYER                        │
    ├─────────────────────────────────────────────────────────┤
    │  ┌─────────────────────────────────────────────────────┐ │
    │  │              Worker Pool                           │ │
    │  │ • Configurable concurrency (default: 5)            │ │
    │  │ • Horizontal scaling capability                     │ │
    │  │ • Idempotency checks                               │ │
    │  │ • Error handling & logging                         │ │
    │  └─────────────────┬───────────────────────────────────┘ │
    │                    │                                     │
    │  ┌─────────────────▼───────────────────────────────────┐ │
    │  │            Bulk Write Service                      │ │
    │  │ • MongoDB bulkWrite operations                     │ │
    │  │ • Upsert logic with externalId deduplication      │ │
    │  │ • Batch processing (configurable size)            │ │
    │  │ • Transaction support                             │ │
    │  └─────────────────┬───────────────────────────────────┘ │
    └────────────────────┼───────────────────────────────────────┘
                         │ Processed Jobs
                         ▼
    ┌─────────────────────────────────────────────────────────┐
    │                  PERSISTENCE LAYER                      │
    ├─────────────────────────────────────────────────────────┤
    │  ┌─────────────────────────────────────────────────────┐ │
    │  │               MongoDB Cluster                      │ │
    │  │                                                    │ │
    │  │  ┌─────────────────┐  ┌─────────────────────────┐  │ │
    │  │  │  jobs collection│  │ import_logs collection  │  │ │
    │  │  │ • Sharded       │  │ • TTL indexes          │  │ │
    │  │  │ • Indexed       │  │ • Audit trail          │  │ │
    │  │  │ • Deduplicated  │  │ • Statistics           │  │ │
    │  │  └─────────────────┘  └─────────────────────────┘  │ │
    │  └─────────────────────────────────────────────────────┘ │
    └─────────────────────┬───────────────────────────────────────┘
                          │ Data Access
                          ▼
    ┌─────────────────────────────────────────────────────────┐
    │                PRESENTATION LAYER                       │
    ├─────────────────────────────────────────────────────────┤
    │  ┌─────────────────────────────────────────────────────┐ │
    │  │                REST API Server                     │ │
    │  │ • Express.js framework                             │ │
    │  │ • Import logs endpoint with pagination             │ │
    │  │ • Manual import trigger endpoint                   │ │
    │  │ • Health check endpoints                           │ │
    │  └─────────────────┬───────────────────────────────────┘ │
    │                    │                                     │
    │  ┌─────────────────▼───────────────────────────────────┐ │
    │  │              React Frontend                        │ │
    │  │ • Import history dashboard                         │ │
    │  │ • Real-time updates (future: SSE/WebSocket)        │ │
    │  │ • Responsive design                                │ │
    │  │ • Pagination & filtering                           │ │
    │  └─────────────────────────────────────────────────────┘ │
    └─────────────────────────────────────────────────────────────┘
```

## 🧩 Component Details

### 1. **Data Ingestion Layer**

#### Fetch Service

- **Purpose**: Retrieve job data from external APIs
- **Key Features**:
  - HTTP client with timeout and retry logic
  - Rate limiting to respect API limits
  - Error handling for network failures

#### Cron Scheduler

- **Purpose**: Automated job import scheduling
- **Configuration**: Hourly execution (`0 * * * *`)
- **Features**:
  - Manual trigger endpoint for on-demand imports
  - Configurable schedule via environment variables

### 2. **Transformation Layer**

#### XML → JSON Parser & Validator

- **Purpose**: Convert and validate external data format
- **Technologies**: `xml2js` library
- **Process Flow**:
  1. Parse XML response to JavaScript objects
  2. Apply schema validation
  3. Normalize and sanitize data fields
  4. Map external fields to internal schema

### 3. **Queue Layer**

#### Redis + BullMQ

- **Purpose**: Asynchronous job processing with reliability
- **Key Features**:
  - **Job Batching**: Configurable batch sizes for efficient processing
  - **Priority Queuing**: Handle urgent imports first
  - **Dead Letter Queue**: Capture and analyze failed jobs
  - **Retry Logic**: Exponential backoff for transient failures
  - **Rate Limiting**: Control processing speed

### 4. **Processing Layer**

#### Worker Pool

- **Purpose**: Concurrent job processing
- **Configuration**:
  - Default concurrency: 5 workers
  - Horizontally scalable design
  - Environment-configurable parameters

#### Bulk Write Service

- **Purpose**: Efficient database operations
- **Features**:
  - MongoDB `bulkWrite` operations for performance
  - Upsert logic using `externalId` unique constraint for deduplication
  - Transaction support for data consistency
  - Batch processing to optimize database load
  - Detailed failure tracking with job data preservation

### 5. **Persistence Layer**

#### MongoDB Collections

##### jobs Collection

```javascript
{
  _id: ObjectId,
  externalId: String,     // Unique identifier from source (required, unique)
  title: String,          // Job title (required)
  description: String,    // Brief job description
  fullContent: String,    // Full content from content:encoded field
  company: String,        // Company name
  pubDate: Date,          // Publication date from RSS feed
  link: String,           // Original job posting URL
  location: String,       // Job location
  jobType: String,        // Employment type (full-time, part-time, etc.)
  mediaUrl: String,       // Associated media/image URL
  sourceUrl: String,      // Source feed URL
  raw: Object,            // Complete original RSS item for debugging
  createdAt: Date,        // Auto-generated timestamp
  updatedAt: Date         // Auto-generated timestamp
}
```

##### importlogs Collection

```javascript
{
  _id: ObjectId,
  fileName: String,       // Source URL/identifier (required)
  timestamp: Date,        // Import execution time (default: Date.now)
  totalFetched: Number,   // Total jobs retrieved from source (required)
  totalImported: Number,  // Successfully processed jobs (required)
  newJobs: Number,        // Newly created job records (required)
  updatedJobs: Number,    // Updated existing job records (required)
  failedJobs: [           // Array of failed job processing attempts
    {
      reason: String,     // Failure reason description
      jobId: String,      // External job identifier
      jobData: Object     // Complete job data that failed processing
    }
  ]
}
```

### 6. **Presentation Layer**

#### REST API Server

- **Framework**: Express.js with ESM modules
- **Endpoints**:
  - `GET /api/import-logs` - Paginated import history

#### React Frontend

- **Purpose**: Admin dashboard for import monitoring
- **Features**:
  - Import history with pagination
  - Responsive design for mobile compatibility
  - Real-time status updates (future enhancement)
  - Filter and search capabilities(future enhancement)

## 🔄 Data Flow

1. **Scheduled Trigger**: Cron job triggers import process hourly
2. **Data Fetch**: Fetch service retrieves XML data from job APIs
3. **Transformation**: XML parser converts to JSON and validates data
4. **Queue Addition**: Validated jobs are batched and added to Redis queue
5. **Worker Processing**: Workers pick up jobs and process them concurrently
6. **Database Upsert**: Bulk write service performs efficient database operations
7. **Logging**: Import statistics are recorded in import_logs collection
8. **UI Updates**: Frontend displays updated import history

## ⚡ Scalability Considerations

### Horizontal Scaling

- **Worker Scaling**: Multiple worker processes can run across different servers
- **Database Sharding**: MongoDB collection can be sharded by source or date
- **Queue Distribution**: Redis cluster for high-throughput scenarios

### Performance Optimizations

- **Bulk Operations**: Batch database writes for efficiency
- **Connection Pooling**: Reuse database connections
- **Indexing Strategy**: Optimized indexes on frequently queried fields
- **Caching**: Redis caching for frequently accessed data

## 🛡️ Reliability & Error Handling

### Fault Tolerance

- **Retry Logic**: Exponential backoff for transient failures
- **Dead Letter Queue**: Capture persistently failing jobs
- **Circuit Breaker**: Prevent cascade failures from external APIs
- **Health Checks**: Monitor system component health

### Data Integrity

- **Idempotency**: Safe to retry operations without side effects
- **Deduplication**: Prevent duplicate records using `externalId` unique constraint
- **Transaction Support**: ACID properties for critical operations
- **Audit Trail**: Complete logging with detailed failure tracking including job data
- **Raw Data Preservation**: Original RSS feed data stored in `raw` field for debugging

### Configurable Parameters

- **Batch Size**: Number of jobs processed per batch
- **Concurrency**: Worker pool size
- **Schedule**: Cron expression for automatic imports
- **Retry Count**: Maximum retry attempts for failed jobs
- **Timeout**: HTTP request timeout values


### Logging Strategy

- **Structured Logging**: JSON formatted logs for easy parsing
- **Log Levels**: Debug, Info, Warn, Error categorization
- **Correlation IDs**: Track requests across system components
- **Performance Logging**: Execution time tracking for optimization