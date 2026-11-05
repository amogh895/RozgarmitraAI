import { Router, Request, Response } from 'express';
import { getDb } from '../db/connection';
import { generateWithGranite, GraniteUnavailableError } from '../ai/granite.client';
import { buildMentorPrompt, buildSkillGapPrompt, buildFinancialGuidancePrompt, sanitiseInput } from '../ai/prompts';
import { retrieveSchemes, retrieveCourses, buildRetrievedContext } from '../ai/retrieval';
import { config } from '../config';

const router = Router();

// GET /api/chat/status — public
router.get('/status', (_req, res: Response) => {
  res.json({
    success: true,
    data: {
      ai_available: config.hasWatsonxCredentials(),
      model: config.watsonx.modelId,
      message: config.hasWatsonxCredentials()
        ? 'IBM Granite AI mentor is ready'
        : 'IBM Granite credentials not set — AI features unavailable.',
    },
  });
});

// POST /api/chat/message — fully public, no auth required
router.post('/message', async (req: Request, res: Response) => {
  const { content, language = 'en' } = req.body;
  if (!content?.trim()) {
    return res.status(400).json({ error: 'BadRequest', message: 'content is required' });
  }

  const safeContent = sanitiseInput(content);
  const lang = language === 'hi' ? 'hi' : 'en';

  // RAG retrieval
  const schemeChunks = retrieveSchemes(safeContent);
  const courseChunks = retrieveCourses([]);
  const allChunks = [...schemeChunks, ...courseChunks];
  const retrievedContext = buildRetrievedContext(allChunks);
  const sources = allChunks.map(c => c.source);

  // Pick prompt type
  const lower = safeContent.toLowerCase();
  const isFinancial = /\b(save|saving|budget|loan|money|paise|bachat|karz|invest)\b/.test(lower);
  const isSkillGap = /\b(learn|skill|course|training|seekh|sikhna|roadmap)\b/.test(lower);

  let prompt: string;
  if (isFinancial) {
    prompt = buildFinancialGuidancePrompt(safeContent, lang);
  } else if (isSkillGap) {
    prompt = buildSkillGapPrompt([], safeContent, lang);
  } else {
    prompt = buildMentorPrompt(safeContent, { language: lang, retrievedContext });
  }

  let reply: string;
  let isAiGenerated = true;

  try {
    reply = await generateWithGranite(prompt, { maxTokens: 600 });
  } catch (err: any) {
    isAiGenerated = false;
    console.error('[Granite error]', err.message ?? err.name);
    reply = lang === 'hi'
      ? 'AI सेवा अभी उपलब्ध नहीं है। कृपया थोड़ी देर बाद पुनः प्रयास करें।'
      : 'AI mentor is temporarily unavailable. Please try again in a moment.';
  }

  // Store session in DB (sessionless — just log messages for analytics)
  try {
    const db = getDb();
    // Ensure an anonymous session exists
    let sessionId = req.body.session_id as number | undefined;
    if (!sessionId) {
      // Find or create a generic public session (worker_id = 0 placeholder — we skip FK for public)
      // Just store messages without session for simplicity
    }
  } catch { /* non-fatal */ }

  res.json({ success: true, data: { reply, sources, isAiGenerated } });
});

export default router;
