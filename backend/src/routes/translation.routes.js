import { Router } from 'express';
import { createTranslation, translationStatus, translatedAudio } from '../controllers/translation.controller.js';
import { uploadAudio } from '../middleware/upload-audio.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();
router.post('/', uploadAudio.single('audio'), asyncHandler(createTranslation));
router.get('/:dubbingId', asyncHandler(translationStatus));
router.get('/:dubbingId/audio', asyncHandler(translatedAudio));
export default router;
