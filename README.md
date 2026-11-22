# VoiceBridge

A modular web prototype for testing voice translation with ElevenLabs. Record a short clip in the browser, choose a target language, send it to ElevenLabs Dubbing, and play the resulting audio when it is ready.

> This first version uses the asynchronous Dubbing API. It is for short recordings, not live, two-way conversation. The ElevenLabs API key stays on the backend.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Audio upload: Multer memory storage (no audio files written to disk)
- Translation: ElevenLabs Dubbing API

## Run locally

1. Install Node.js 20+.
2. Copy `.env.example` to `backend/.env` and add your ElevenLabs API key.
3. From the project root run:

   ```bash
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173` and allow microphone access.

The API listens on `http://localhost:4000`. `backend/public/` is reserved for backend-served static assets; microphone recording happens in the browser and is posted to the backend as multipart audio.

## Audio handling

The upload is stored by Multer in RAM only. After the upstream ElevenLabs upload request settles, the server overwrites the in-memory buffer and drops its reference, on success or failure. The browser also releases the local recording URL after sending it.

ElevenLabs stores the dubbing job and generated output according to the account and service settings. This app does not save the original recording to its own disk or database. The translated audio is streamed through the backend and is not persisted by this app.

## Environment

| Variable | Description | Default |
| --- | --- | --- |
| `ELEVENLABS_API_KEY` | Secret ElevenLabs API key | required |
| `PORT` | Backend port | `4000` |
| `CLIENT_ORIGIN` | Frontend origin allowed by CORS | `http://localhost:5173` |
| `MAX_AUDIO_MB` | Maximum upload size in MB | `20` |
| `VITE_API_URL` | API origin for frontend | `http://localhost:4000` |

## Project structure

```text
frontend/
  src/components/       Reusable UI components
  src/hooks/            Browser audio recording hook
  src/lib/              Backend API client
backend/
  public/               Reserved static assets
  src/config/           Environment configuration
  src/controllers/      Request handlers
  src/middleware/       Upload and error middleware
  src/routes/           HTTP routes
  src/services/         ElevenLabs API integration
  src/utils/            Shared server utilities
```

## Current API

- `GET /api/health`
- `POST /api/translations` — multipart fields `audio`, `sourceLanguage`, and `targetLanguage`
- `GET /api/translations/:dubbingId` — poll job status
- `GET /api/translations/:dubbingId/audio?languageCode=hi` — fetch translated audio


## Development notes

Commits are grouped by project setup, interface, recording, API client, and provider integration so the project history is easy to follow.
