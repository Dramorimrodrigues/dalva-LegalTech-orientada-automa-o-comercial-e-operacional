// =============================================================
// DALVA — Rate Limiter (In-memory para MVP)
// Em produção, usar Redis ou banco de dados
// =============================================================

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blockedUntil: number;
}

const attempts = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 5; // máximo 5 tentativas
const BLOCK_DURATION_MS = 15 * 60 * 1000; // bloqueia por 15 minutos

/**
 * Verifica se um identificador (IP/email) está rate-limited.
 * Retorna { allowed: boolean, remainingAttempts: number, retryAfterMs: number }
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterMs: number;
} {
  const now = Date.now();
  const entry = attempts.get(identifier);

  // Limpar entradas expiradas periodicamente
  if (attempts.size > 10000) {
    for (const [key, val] of attempts) {
      if (now - val.firstAttempt > WINDOW_MS * 2) {
        attempts.delete(key);
      }
    }
  }

  if (!entry) {
    // Primeira tentativa
    attempts.set(identifier, {
      count: 1,
      firstAttempt: now,
      blockedUntil: 0,
    });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1, retryAfterMs: 0 };
  }

  // Verificar se está bloqueado
  if (entry.blockedUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterMs: entry.blockedUntil - now,
    };
  }

  // Verificar se a janela expirou — resetar
  if (now - entry.firstAttempt > WINDOW_MS) {
    attempts.set(identifier, {
      count: 1,
      firstAttempt: now,
      blockedUntil: 0,
    });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1, retryAfterMs: 0 };
  }

  // Incrementar tentativas
  entry.count++;

  if (entry.count > MAX_ATTEMPTS) {
    // Bloquear
    entry.blockedUntil = now + BLOCK_DURATION_MS;
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterMs: BLOCK_DURATION_MS,
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - entry.count,
    retryAfterMs: 0,
  };
}

/**
 * Reseta o rate limit para um identificador (após login bem-sucedido)
 */
export function resetRateLimit(identifier: string): void {
  attempts.delete(identifier);
}
