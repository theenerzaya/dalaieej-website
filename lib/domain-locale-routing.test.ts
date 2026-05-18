import { describe, expect, it } from 'vitest';
import { localeFromHostname, localizePath } from './domain-locale-routing';

describe('localeFromHostname', () => {
  it('maps mn domains to Mongolian locale', () => {
    expect(localeFromHostname('dalaieej.mn')).toBe('mn');
    expect(localeFromHostname('www.dalaieej.mn')).toBe('mn');
  });

  it('maps com domains to English locale', () => {
    expect(localeFromHostname('dalaieej.com')).toBe('en');
    expect(localeFromHostname('www.dalaieej.com')).toBe('en');
  });

  it('returns null for unknown hosts', () => {
    expect(localeFromHostname('localhost')).toBeNull();
    expect(localeFromHostname('example.com')).toBeNull();
  });
});

describe('localizePath', () => {
  it('prefixes root and unprefixed routes', () => {
    expect(localizePath('/', 'mn')).toBe('/mn');
    expect(localizePath('/booking', 'mn')).toBe('/mn/booking');
    expect(localizePath('/booking', 'en')).toBe('/en/booking');
  });

  it('rewrites an existing locale prefix', () => {
    expect(localizePath('/en/booking', 'mn')).toBe('/mn/booking');
    expect(localizePath('/mn/booking', 'en')).toBe('/en/booking');
  });

  it('normalizes locale-only paths', () => {
    expect(localizePath('/en', 'mn')).toBe('/mn');
    expect(localizePath('/mn', 'en')).toBe('/en');
  });
});
