import { getDb } from '../db/connection';
import { generateWithGranite, GraniteUnavailableError } from '../ai/granite.client';
import { buildMentorPrompt, buildSkillGapPrompt, buildFinancialGuidancePrompt, sanitiseInput } from '../ai/prompts';
import { retrieveSchemes, retrieveCourses, buildRetrievedContext } from '../ai/retrieval';
import type { WorkerProfile } from '@rozgar-mitra/shared';

export interface ChatInput {
  content: string;
  sessionId?: number;
  language: 'en' | 'hi';
  workerProfile: WorkerProfile | null;
  userName: string;
}

export interface ChatOutput {
  reply: string;
  sessionId: number;
  sources: string[];
  isAiGenerated: boolean;
}

export async function handleChat(input: ChatInput): Promise<ChatOutput> {
  const db = getDb();
  const workerId = input.workerProfile?.id;

  // ── Get or create chat session ─────────────────────────────────────────────
  let sessionId = input.sessionId;
  if (!sessionId && workerId) {
    const result = db.prepare(`
      INSERT INTO chat_sessions (worker_id, title) VALUES (?, ?)
    `).run(workerId, sanitiseInput(input.content).substring(0, 60));
    sessionId = result.lastInsertRowid as number;
  }

  // ── Store user message ─────────────────────────────────────────────────────
  if (sessionId) {
    db.prepare(`INSERT INTO chat_messages (session_id, role, content) VALUES (?, 'user', ?)`).run(
      sessionId, input.content
    );
  }

  // ── RAG retrieval ──────────────────────────────────────────────────────────
  const schemeChunks = retrieveSchemes(input.content);
  const courseChunks = retrieveCourses(input.workerProfile?.skills ?? []);
  const allChunks = [...schemeChunks, ...courseChunks];
  const retrievedContext = buildRetrievedContext(allChunks);
  const sources = allChunks.map(c => c.source);

  // ── Detect topic for specialised prompts ──────────────────────────────────
  const lower = input.content.toLowerCase();
  const isFinancial = /\b(save|saving|budget|loan|money|paise|bachat|karz|invest)\b/.test(lower);
  const isSkillGap = /\b(learn|skill|course|training|seekh|sikhna|roadmap)\b/.test(lower);

  let prompt: string;
  if (isFinancial) {
    prompt = buildFinancialGuidancePrompt(input.content, input.language);
  } else if (isSkillGap && input.workerProfile) {
    prompt = buildSkillGapPrompt(
      input.workerProfile.skills,
      input.content,
      input.language
    );
  } else {
    prompt = buildMentorPrompt(input.content, {
      workerName: input.userName,
      skills: input.workerProfile?.skills,
      workCategories: input.workerProfile?.work_categories,
      experienceYears: input.workerProfile?.experience_years,
      state: input.workerProfile?.state ?? undefined,
      educationLevel: input.workerProfile?.education_level,
      language: input.language,
      retrievedContext,
    });
  }

  // ── Call Granite ───────────────────────────────────────────────────────────
  let reply: string;
  let isAiGenerated = true;

  try {
    reply = await generateWithGranite(prompt, { maxTokens: 600 });
  } catch (err: any) {
    isAiGenerated = false;
    if (err instanceof GraniteUnavailableError || err.name === 'GraniteUnavailableError') {
      reply = input.language === 'hi'
        ? 'क्षमा करें, अभी AI सहायता उपलब्ध नहीं है। कृपया बाद में प्रयास करें। अन्य सुविधाएं जैसे नौकरी खोज और सरकारी योजनाएं उपलब्ध हैं।'
        : 'AI mentor is currently unavailable (IBM watsonx.ai credentials not configured). Other features like job search and government schemes are still available.';
    } else {
      // Log real error server-side for debugging, show safe message to user
      console.error('[Granite error]', err.message ?? err.name);
      const hint = err.message?.includes('no_associated_service_instance')
        ? ' (Fix: Associate a WML instance with your watsonx.ai project in IBM Cloud.)'
        : '';
      reply = input.language === 'hi'
        ? 'AI सेवा में अस्थायी समस्या है। कृपया थोड़ी देर बाद पुनः प्रयास करें।'
        : `AI service is temporarily unavailable. Please try again in a moment.${hint}`;
    }
  }

  // ── Store assistant message ────────────────────────────────────────────────
  if (sessionId) {
    db.prepare(`
      INSERT INTO chat_messages (session_id, role, content, sources)
      VALUES (?, 'assistant', ?, ?)
    `).run(sessionId, reply, JSON.stringify(sources));
    db.prepare(`UPDATE chat_sessions SET updated_at = datetime('now') WHERE id = ?`).run(sessionId);
  }

  return { reply, sessionId: sessionId ?? 0, sources, isAiGenerated };
}

export function getChatSessions(workerId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM chat_sessions WHERE worker_id = ? ORDER BY updated_at DESC
  `).all(workerId);
}

export function getChatHistory(sessionId: number, workerId: number) {
  const db = getDb();
  const session = db.prepare(`SELECT * FROM chat_sessions WHERE id = ? AND worker_id = ?`).get(sessionId, workerId);
  if (!session) throw new Error('SESSION_NOT_FOUND');
  return db.prepare(`
    SELECT id, role, content, sources, created_at FROM chat_messages
    WHERE session_id = ?
    ORDER BY created_at ASC
  `).all(sessionId).map((m: any) => ({
    ...m,
    sources: JSON.parse(m.sources || '[]'),
  }));
}
