/**
 * Retrieval-Augmented Generation (RAG) over local knowledge base.
 * Retrieval is deterministic keyword/category matching over the SQLite DB.
 * Retrieved snippets are passed to Granite as context.
 *
 * Caveat: All retrieved records may be UNVERIFIED. Source attribution is always included.
 */

import { getDb } from '../db/connection';

export interface RetrievedChunk {
  source: string;
  content: string;
  verified: boolean;
}

// ── Retrieve relevant schemes ─────────────────────────────────────────────────
export function retrieveSchemes(query: string, limit = 3): RetrievedChunk[] {
  const db = getDb();
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 3);

  if (terms.length === 0) return [];

  const rows = db.prepare(`
    SELECT name, summary, eligibility_conditions, benefits, official_url, status
    FROM government_schemes
    WHERE status != 'discontinued'
    AND (${terms.map(() => `(LOWER(name) LIKE ? OR LOWER(summary) LIKE ? OR LOWER(eligibility_conditions) LIKE ?)`).join(' OR ')})
    LIMIT ?
  `).all(...terms.flatMap(t => [`%${t}%`, `%${t}%`, `%${t}%`]), limit) as any[];

  return rows.map(row => ({
    source: `Government Scheme: ${row.name} (${row.official_url})`,
    content: `Scheme: ${row.name}\nSummary: ${row.summary}\nEligibility: ${row.eligibility_conditions}\nBenefits: ${row.benefits}`,
    verified: row.status === 'verified',
  }));
}

// ── Retrieve relevant training courses ────────────────────────────────────────
export function retrieveCourses(skills: string[], limit = 3): RetrievedChunk[] {
  if (skills.length === 0) return [];
  const db = getDb();

  const rows = db.prepare(`
    SELECT provider, title, category, duration_hours, mode, cost_inr, official_url, skills_taught, status
    FROM training_courses
    WHERE status != 'discontinued'
    AND (${skills.map(() => `LOWER(skills_taught) LIKE ?`).join(' OR ')})
    LIMIT ?
  `).all(...skills.map(s => `%${s.toLowerCase()}%`), limit) as any[];

  return rows.map(row => ({
    source: `Training Course: ${row.title} by ${row.provider} (${row.official_url})`,
    content: `Course: ${row.title}\nProvider: ${row.provider}\nDuration: ${row.duration_hours}h\nMode: ${row.mode}\nCost: ₹${row.cost_inr === 0 ? 'Free' : row.cost_inr}`,
    verified: row.status === 'verified',
  }));
}

// ── Combine retrieved chunks into a context string ────────────────────────────
export function buildRetrievedContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return '';
  return chunks
    .map((c, i) =>
      `[Source ${i + 1}]: ${c.source}${!c.verified ? ' [UNVERIFIED – details may be outdated]' : ''}\n${c.content}`
    )
    .join('\n\n');
}
