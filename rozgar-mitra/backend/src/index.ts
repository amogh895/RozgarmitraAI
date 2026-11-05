import app from './app';
import { config } from './config';
import { getDb } from './db/connection';

// Ensure DB is initialised on startup
getDb();

app.listen(config.port, () => {
  console.log(`🚀 RozgarMitra API running on http://localhost:${config.port}`);
  console.log(`   Environment : ${config.nodeEnv}`);
  console.log(`   AI Mentor   : ${config.hasWatsonxCredentials() ? '✅ IBM Granite configured' : '⚠️  IBM Granite credentials NOT set (AI features disabled)'}`);
});
