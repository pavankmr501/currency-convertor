import { describe, expect, it } from 'vitest';
import { getCurrencyCount, getRate } from '../src/currencies';

// Tests for the getRate() function in isolation.
// Rates are sourced from the 2026-03-31 snapshot in the CSV.
describe('getRate', () => {
  it('returns 1.0 for USD (base currency)', () => {
    expect(getRate('USD')).toBe(1.0);
  });

  it('returns the CSV rate for CAD', () => {
    expect(getRate('CAD')).toBeCloseTo(1.393);
  });

  it('returns the CSV rate for EUR', () => {
    expect(getRate('EUR')).toBeCloseTo(0.87);
  });

  it('returns the CSV rate for GBP', () => {
    expect(getRate('GBP')).toBeCloseTo(0.756);
  });

  it('returns the CSV rate for JPY', () => {
    expect(getRate('JPY')).toBeCloseTo(159.41);
  });

  it('returns null for an unrecognised code', () => {
    expect(getRate('XYZ')).toBeNull();
  });

  it('is case-sensitive — lowercase returns null', () => {
    // index.ts uppercases before calling getRate; the function itself is strict
    expect(getRate('usd')).toBeNull();
    expect(getRate('eur')).toBeNull();
  });
});

describe('getCurrencyCount', () => {
  it('returns a positive integer', () => {
    expect(getCurrencyCount()).toBeGreaterThan(0);
    expect(Number.isInteger(getCurrencyCount())).toBe(true);
  });

  it('includes USD in the count', () => {
    expect(getCurrencyCount()).toBeGreaterThan(1);
  });

  it('returns a consistent value across multiple calls', () => {
    expect(getCurrencyCount()).toBe(getCurrencyCount());
  });

  it('count exceeds 100 given the breadth of the CSV', () => {
    expect(getCurrencyCount()).toBeGreaterThan(100);
  });
});
