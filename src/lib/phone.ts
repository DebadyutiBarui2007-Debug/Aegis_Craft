/**
 * Canonical E.164 Indian Mobile Phone Normalizer
 * Standardizes inputs such as:
 *   - "9845012345"
 *   - "98450 12345"
 *   - "+91 98450 12345"
 *   - "+919845012345"
 *   - "919845012345"
 *   - "+91-98450-12345"
 * To canonical E.164 string: "+919845012345"
 */
export function normalizeIndianPhone(rawPhone: string): string {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  if (digits.length > 10) {
    const last10 = digits.slice(-10);
    return `+91${last10}`;
  }
  return rawPhone.trim();
}

export function isValidIndianPhone(rawPhone: string): boolean {
  const normalized = normalizeIndianPhone(rawPhone);
  return /^\+91[6-9]\d{9}$/.test(normalized);
}
