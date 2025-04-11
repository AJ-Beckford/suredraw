import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import groupsRouter from './routes/groups.js';
import contributionsRouter from './routes/contributions.js';
import { initCouchDB } from './services/couchdb.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize databases
await initCouchDB();

// Routes
app.use('/api/groups', groupsRouter);
app.use('/api/contributions', contributionsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Connected to Fabric network: ${process.env.CHANNEL_NAME}`);
});