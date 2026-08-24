import crypto from 'crypto';

const CAPTCHA_TTL_MS = 5 * 60 * 1000;
const OPS = [
  { sym: '+', calc: (a: number, b: number) => a + b },
  { sym: '×', calc: (a: number, b: number) => a * b },
];

function secret(): string {
  return process.env.JWT_SECRET || 'skylogic-captcha-secret';
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function generateCaptchaChallenge(): {
  token: string;
  question: string;
} {
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  const op = OPS[Math.floor(Math.random() * OPS.length)];

  const body = Buffer.from(
    JSON.stringify({
      a,
      b,
      op: op.sym,
      exp: Date.now() + CAPTCHA_TTL_MS,
    })
  ).toString('base64url');

  return {
    token: `${body}.${sign(body)}`,
    question: `${a} ${op.sym} ${b}`,
  };
}

export function verifyCaptchaChallenge(token: string, answer: unknown): boolean {
  try {
    const [body, sig] = String(token).split('.');
    if (!body || !sig) return false;
    const expected = sign(body);
    const sigBuf = Buffer.from(sig, 'base64url');
    const expBuf = Buffer.from(expected, 'base64url');
    if (sigBuf.length !== expBuf.length) return false;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload || typeof payload.a !== 'number' || typeof payload.b !== 'number') {
      return false;
    }
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return false;

    const op = OPS.find((o) => o.sym === payload.op);
    if (!op) return false;

    const numeric = typeof answer === 'string' ? Number(answer.trim()) : Number(answer);
    if (!Number.isFinite(numeric)) return false;
    return numeric === op.calc(payload.a, payload.b);
  } catch {
    return false;
  }
}
