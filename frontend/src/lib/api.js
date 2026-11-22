const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function requestTranslation({ audio, sourceLanguage, targetLanguage }) {
  const body = new FormData();
  body.append('audio', audio, `voice-${Date.now()}.webm`);
  body.append('sourceLanguage', sourceLanguage);
  body.append('targetLanguage', targetLanguage);
  const response = await fetch(`${API_URL}/api/translations`, { method: 'POST', body });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Could not send this recording.');
  return payload;
}

export async function getDubStatus(dubbingId) {
  const response = await fetch(`${API_URL}/api/translations/${encodeURIComponent(dubbingId)}`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Could not get translation status.');
  return payload;
}

export async function getDubAudio(dubbingId, languageCode) {
  const params = new URLSearchParams({ languageCode });
  const response = await fetch(`${API_URL}/api/translations/${encodeURIComponent(dubbingId)}/audio?${params}`);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Translated audio is not ready yet.');
  }
  return response.blob();
}
