export function normalizeEmail(email: string): string {
  if (!email) return email;

  // Convert to lowercase
  let normalized = email.toLowerCase().trim();

  // Handle Gmail-specific normalization
  if (normalized.endsWith('@gmail.com')) {
    // Remove dots and everything between + and @ for Gmail addresses
    const [localPart, domain] = normalized.split('@');
    const cleanLocalPart = localPart
      .replace(/\./g, '') // Remove all dots
      .split('+')[0]; // Remove everything after '+'
    normalized = `${cleanLocalPart}@${domain}`;
  }

  return normalized;
}
