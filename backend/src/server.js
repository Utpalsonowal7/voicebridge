import app from './app.js';
import { env } from './config/env.js';

if (!env.apiKey) console.warn('ELEVENLABS_API_KEY is not configured. Add it to .env before requesting translations.');
app.listen(env.port, () => console.log(`VoiceBridge API listening at http://localhost:${env.port}`));
