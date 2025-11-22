import { formatDate, formatRupiah, formatUpdatedDate, parseNumber } from "../utils";

// --- Testing parseNumber ---
describe('parseNumber', () => {
  test('should remove all non-digit characters', () => {
    expect(parseNumber('Rp 1.234.567,00')).toBe('123456700');
    expect(parseNumber('NomorHP: +62-812')).toBe('62812');
  });

  test('should return an empty string for non-numeric input', () => {
    expect(parseNumber('abcxyz')).toBe('');
  });

  test('should return the original string if it only contains digits', () => {
    expect(parseNumber('98765')).toBe('98765');
  });
});


// --- Testing formatRupiah ---
describe('formatRupiah', () => {
  test('should format a number string to Indonesian Rupiah correctly', () => {
    // 1234567 tobe Rp 1.234.567
    expect(formatRupiah('1234567')).toBe('Rp 1.234.567');
  });

  test('should clean input and format correctly', () => {
    expect(formatRupiah('Rp 1.234.567,00')).toBe('Rp 123.456.700');
  });
  
  test('should format a numeric type correctly', () => {
    expect(formatRupiah(50000)).toBe('Rp 50.000');
  });

  test('should return an empty string for null, undefined, or empty string input', () => {
    expect(formatRupiah(null as any)).toBe('');
    expect(formatRupiah(undefined as any)).toBe('');
    expect(formatRupiah('')).toBe('');
  });
});


// --- Testing formatDate ---
describe('formatDate', () => {
  const testDate = '2025-11-22T09:40:00Z'; 

  test('should format date for Indonesian locale (id-ID) correctly', () => {
    const formatted = formatDate(testDate);
    
    expect(formatted).toContain('22 Nov 2025'); 
  });
});


// --- Testing formatUpdatedDate ---
describe('formatUpdatedDate', () => {
  beforeAll(() => {
    // Mocking the current date to a fixed point in time (e.g., 2025-11-22T09:25:00.000Z)
    jest.useFakeTimers().setSystemTime(new Date('2025-11-22T14:25:00.000Z')); 
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should format current date/time in specified 24-hour format (22 Nov 2025, 21:25)', () => {
    const expected = '22 Nov 2025, 21.25'; 
    expect(formatUpdatedDate()).toBe(expected);
  });
});