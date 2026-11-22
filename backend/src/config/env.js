import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 4000),
  apiKey: process.env.ELEVENLABS_API_KEY || '',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  maxAudioBytes: Number(process.env.MAX_AUDIO_MB || 20) * 1024 * 1024
};
