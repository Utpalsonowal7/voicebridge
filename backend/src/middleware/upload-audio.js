import multer from 'multer';
import { env } from '../config/env.js';

// Memory storage only: audio is never written to disk.
export const uploadAudio = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxAudioBytes, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('audio/')) return callback(Object.assign(new Error('Upload an audio recording.'), { status: 400, publicMessage: 'Please upload an audio file.' }));
    callback(null, true);
  }
});
