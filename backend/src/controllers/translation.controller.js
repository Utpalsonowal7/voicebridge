import * as elevenlabs from '../services/elevenlabs.service.js';

export async function createTranslation(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Record or select an audio clip first.' });
  const targetLanguage = req.body.targetLanguage;
  if (!targetLanguage) return res.status(400).json({ error: 'Choose a language to translate into.' });

  // Memory-only upload. Zero the buffer after the provider accepts/rejects the upload.
  let audio = req.file;
  try {
    const result = await elevenlabs.createDub({
      audio,
      filename: req.file.originalname || 'voice.webm',
      sourceLanguage: req.body.sourceLanguage,
      targetLanguage,
      name: 'VoiceBridge test'
    });
    res.status(202).json(result);
  } finally {
    audio.buffer.fill(0);
    audio = null;
    req.file = undefined;
  }
}

export async function translationStatus(req, res) {
  const result = await elevenlabs.getDubStatus(req.params.dubbingId);
  res.json({ status: result.status });
}

export async function translatedAudio(req, res) {
  const languageCode = req.query.languageCode;
  if (!languageCode) return res.status(400).json({ error: 'A language code is required.' });
  const result = await elevenlabs.getDubAudio(req.params.dubbingId, languageCode);
  res.set('Content-Type', result.headers.get('content-type') || 'audio/mpeg');
  res.set('Cache-Control', 'no-store');
  const audio = Buffer.from(await result.arrayBuffer());
  res.send(audio);
  audio.fill(0);
}
