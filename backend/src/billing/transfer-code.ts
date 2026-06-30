const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateTransferCode(): string {
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    suffix += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return `GP-${suffix}`;
}
