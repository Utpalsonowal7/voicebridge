const API_BASE = 'https://api.elevenlabs.io/v1/dubbing';

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, ...options.headers }
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const detail = payload.detail?.message || payload.detail || `ElevenLabs returned ${response.status}`;
    const error = new Error(String(detail));
    error.status = response.status === 401 ? 401 : 502;
    error.publicMessage = response.status === 401
      ? 'ElevenLabs rejected the API key. Check your backend .env file.'
      : 'ElevenLabs could not complete the translation. Check the audio, language settings, and account access.';
    throw error;
  }
  return response;
}

export async function createDub({ audio, filename, sourceLanguage, targetLanguage, name }) {
  const form = new FormData();
  form.append('file', new Blob([audio.buffer], { type: audio.mimetype }), filename);
  form.append('name', name || 'VoiceBridge translation');
  form.append('source_lang', sourceLanguage === 'auto' ? 'auto' : sourceLanguage);
  form.append('target_lang', targetLanguage);
  const response = await request(API_BASE, { method: 'POST', body: form });
  const payload = await response.json();
  return { dubbingId: payload.dubbing_id, status: 'dubbing' };
}

export async function getDubStatus(dubbingId) {
  const response = await request(`${API_BASE}/${encodeURIComponent(dubbingId)}`);
  return response.json();
}

export async function getDubAudio(dubbingId, languageCode) {
  return request(`${API_BASE}/${encodeURIComponent(dubbingId)}/audio/${encodeURIComponent(languageCode)}`);
}
