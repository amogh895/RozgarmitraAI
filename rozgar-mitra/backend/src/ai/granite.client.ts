/**
 * IBM Granite client via watsonx.ai REST API
 *
 * Authentication: IBM Cloud IAM API Key → bearer token (expires 3600s)
 * Token is cached and refreshed automatically.
 *
 * Documentation references:
 *   - IAM token exchange: POST https://iam.cloud.ibm.com/identity/token
 *   - Text generation: POST {serviceUrl}/ml/v1/text/generation?version=2023-05-29
 *   - Supported model: ibm/granite-3-3-8b-instruct (multitenant, Lite-compatible)
 *   - Lite plan: 300,000 tokens/month free, 2 req/s rate limit
 */

import { config } from '../config';

interface IamTokenResponse {
  access_token: string;
  expires_in: number;
  expiration: number;
}

interface GraniteGenerateRequest {
  model_id: string;
  input: string;
  parameters: {
    max_new_tokens: number;
    temperature: number;
    repetition_penalty: number;
    stop_sequences?: string[];
  };
  project_id: string;
}

interface GraniteGenerateResponse {
  model_id: string;
  created_at: string;
  results: Array<{
    generated_text: string;
    generated_token_count: number;
    input_token_count: number;
    stop_reason: string;
  }>;
}

// ── Token cache ───────────────────────────────────────────────────────────────
let _cachedToken: string | null = null;
let _tokenExpiry = 0;

async function getIamToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  // Refresh 60s before expiry
  if (_cachedToken && _tokenExpiry - now > 60) return _cachedToken;

  const params = new URLSearchParams({
    grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
    apikey: config.watsonx.apiKey,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  let resp: Response;
  try {
    resp = await fetch(config.watsonx.iamTokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      signal: controller.signal,
    } as RequestInit);
  } finally {
    clearTimeout(timeout);
  }

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`IAM token fetch failed (${resp.status}): ${text}`);
  }

  const data = (await resp.json()) as IamTokenResponse;
  _cachedToken = data.access_token;
  _tokenExpiry = data.expiration;
  return _cachedToken;
}

// ── Retry helper ──────────────────────────────────────────────────────────────
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastErr: Error | undefined;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      // Don't retry auth errors or prompt-injection responses
      if (err.message?.includes('IAM') || err.message?.includes('403')) throw err;
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, attempt * 1500));
      }
    }
  }
  throw lastErr!;
}

// ── Main generate function ────────────────────────────────────────────────────
export async function generateWithGranite(
  prompt: string,
  opts: { maxTokens?: number; temperature?: number } = {}
): Promise<string> {
  if (!config.hasWatsonxCredentials()) {
    throw new GraniteUnavailableError(
      'IBM watsonx.ai credentials not configured. Set WATSONX_API_KEY and WATSONX_PROJECT_ID in .env.'
    );
  }

  return withRetry(async () => {
    const token = await getIamToken();

    const body: GraniteGenerateRequest = {
      model_id: config.watsonx.modelId,
      input: prompt,
      parameters: {
        max_new_tokens: opts.maxTokens ?? 600,
        temperature: opts.temperature ?? 0.5,
        repetition_penalty: 1.1,
        stop_sequences: ['Human:', 'User:'],
      },
      project_id: config.watsonx.projectId,
    };

    const url = `${config.watsonx.serviceUrl}/ml/v1/text/generation?version=2023-05-29`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    let resp: Response;
    try {
      resp = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      } as RequestInit);
    } finally {
      clearTimeout(timeout);
    }

    if (!resp.ok) {
      if (resp.status === 401 || resp.status === 403) {
        _cachedToken = null; // Invalidate cache
        const text = await resp.text();
        throw new Error(`Granite auth error (${resp.status}): ${text}`);
      }
      if (resp.status === 429) {
        throw new Error('Rate limit exceeded. Please wait before retrying.');
      }
      const text = await resp.text();
      throw new Error(`Granite API error (${resp.status}): ${text}`);
    }

    const data = (await resp.json()) as GraniteGenerateResponse;
    const generated = data.results?.[0]?.generated_text ?? '';

    if (!generated.trim()) throw new Error('Granite returned empty response');
    return generated;
  });
}

// ── Typed error for unavailable service ───────────────────────────────────────
export class GraniteUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GraniteUnavailableError';
  }
}
