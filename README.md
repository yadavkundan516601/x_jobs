# 🛠️ Job Importer Assignment

This project is a full-stack job importer system that fetches job listings from an external RSS feed, processes them through a backend queue, stores them in a MongoDB database, and displays them in a responsive React frontend with pagination.

## 📌 Objective

> **Assignment Goal**: Build a system that can automatically fetch job posts from a feed like `https://jobicy.com/?feed=job_feed`, persist them in a database, track logs for every import, and display those logs on a clean frontend UI.

## 🧱 Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React (Vite), JSX, Custom CSS     |
| Backend  | Node.js (ESM), Express            |
| Database | MongoDB                           |
| Queue    | BullMQ (Redis-based)              |
| Others   | XML Parsing (`xml2js`), Cron jobs |

## ⚙️ How to Run the Project

### 🔧 Backend Setup

1. **Install dependencies**

```bash
cd server
npm install
```

2. **Set environment variables**
   Create a `.env` file inside `server/`:

```env
# Server Port
PORT=5000

# MongoDB Connection URI
MONGO_URI=mongodb://localhost:27017/job-importer

# Redis Connection
REDIS_URL=redis://localhost:6379

# Cron Scgedule
SCHEDULE="0 * * * *"      # Every hour at minute 0

# BullMQ Configuration
JOB_BATCH_SIZE=100            # Number of jobs per queue batch
JOB_CONCURRENCY=5             # Number of concurrent jobs the worker will process

# Node Environment
NODE_ENV=development

```

3. **Run the backend server**

```bash
npm start
```

4. **Run the background worker**

```bash
npm run worker
```

> ✅ This will start Express server at `http://localhost:5000` and handle job processing in background.

---

### 💻 Frontend Setup

1. **Install dependencies**

```bash
cd client
npm install
```

2. **Set frontend API base URL**
   Create `.env` in `client/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

3. **Run the React app**

```bash
npm run dev
```

> ✅ Visit `http://localhost:5173` to view the Import Log Dashboard

## 📷 Screenshot

![Screenshot](/docs/images/preview.png)

---

## ✅ API Endpoints (Summary)

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/api/import-logs` | Paginated import logs |

## ✨ Notes for Reviewers

- The queue (`BullMQ`) is used to **offload XML parsing and job processing** from the request lifecycle.
- All jobs are **deduplicated using `externalId`**.
- Cron job and `/trigger-import` manually initiate the import process.
