#!/bin/bash

mkdir -p src/{config,models,services,jobs,queues,workers,cron,controllers,routes,middlewares,utils}

# Config files
touch src/config/{db.js,redis.js,bullmq.js,env.js}

# Models
touch src/models/{Job.model.js,ImportLog.model.js}

# Services
touch src/services/{jobService.js,importLogService.js}

# Job fetching logic
touch src/jobs/{fetchJobsFromAPI.js,index.js}

# Queue setup
touch src/queues/{jobQueue.js,producers.js}

# Worker (BullMQ consumer)
touch src/workers/jobWorker.js

# Cron
touch src/cron/jobFetcher.js

# Controllers & Routes
touch src/controllers/importLog.controller.js
touch src/routes/importLog.routes.js

# Middleware
touch src/middlewares/{errorHandler.js,notFound.js}

# Utilities
touch src/utils/{xmlToJson.js,logger.js}

# App and entry
touch src/app.js
touch src/server.js

# Root-level files
touch .env .gitignore README.md package.json

echo "✅ Folder and file structure created successfully!"
