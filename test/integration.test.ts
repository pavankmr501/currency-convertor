import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

// Integration tests hit the full Worker via SELF.fetch(), exercising routing,
// validation, CSV parsing, and conversion in one shot.

describe('GET /convert — happy paths', () => {
  it('converts USD to CAD', async () => {
    const res = await SELF.fetch('http://example.com/convert?amount=100&from=USD&to=CAD');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { from: string; to: string; amount: number; result: number; rate: number };
    expect(body.from).toBe('USD');
    expect(body.to).toBe('CAD');
    expect(body.amount).toBe(100);
    expect(body.result).toBeCloseTo(139.3);
    expect(body.rate).toBeCloseTo(1.393);
  });

  it('converts EUR to USD (inverse direction)', async () => {
    const res = await SELF.fetch('http://example.com/convert?amount=100&from=EUR&to=USD');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { result: number; rate: number };
    // rate[EUR] = 0.87 → 100 EUR = 100 / 0.87 USD
    expect(body.result).toBeCloseTo(100 / 0.87);
    expect(body.rate).toBeCloseTo(1 / 0.87);
  });

  it('handles USD to USD (pass-through)', async () => {
    const res = await SELF.fetch('http://example.com/convert?amount=50&from=USD&to=USD');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { result: number; rate: number };
    expect(body.result).toBe(50);
    expect(body.rate).toBe(1);
  });

  it('accepts lowercase currency codes', async () => {
    const res = await SELF.fetch('http://example.com/convert?amount=10&from=usd&to=jpy');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { from: string; to: string };
    expect(body.from).toBe('USD');
    expect(body.to).toBe('JPY');
  });
});

describe('GET /convert — validation errors', () => {
  it('returns 400 when amount is missing', async () => {
    const res = await SELF.fetch('http://example.com/convert?from=USD&to=CAD');
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('Missing required parameter: amount');
  });

  it('returns 400 when from is missing', async () => {
    const res = await SELF.fetch('http://example.com/convert?amount=100&to=CAD');
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('Missing required parameter: from');
  });

  it('returns 400 when to is missing', async () => {
    const res = await SELF.fetch('http://example.com/convert?amount=100&from=USD');
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('Missing required parameter: to');
  });

  it('returns 400 for non-numeric amount', async () => {
    const res = await SELF.fetch('http://example.com/convert?amount=abc&from=USD&to=CAD');
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('Invalid amount: must be a numeric value');
  });

  it('returns 400 for cross-currency pair (neither is USD)', async () => {
    const res = await SELF.fetch('http://example.com/convert?amount=100&from=EUR&to=CAD');
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toContain("One of 'from' or 'to' must be USD");
  });

  it('returns 400 for an unknown target currency', async () => {
    const res = await SELF.fetch('http://example.com/convert?amount=100&from=USD&to=XYZ');
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('Unknown currency code: XYZ');
  });

  it('returns 400 for an unknown source currency', async () => {
    const res = await SELF.fetch('http://example.com/convert?amount=100&from=XYZ&to=USD');
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('Unknown currency code: XYZ');
  });
});

describe('Other routes', () => {
  it('GET / returns Hello World', async () => {
    const res = await SELF.fetch('http://example.com/');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { message: string };
    expect(body.message).toBe('Hello World!');
  });

  it('unknown path returns 404', async () => {
    const res = await SELF.fetch('http://example.com/no-such-route');
    expect(res.status).toBe(404);
  });
});
