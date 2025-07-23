export function mbToBytes(mb: number): number {
  if (typeof mb !== 'number' || isNaN(mb) || mb < 0) {
    throw new Error('Invalid input: mb must be a non-negative number');
  }
  return mb * 1024 * 1024;
}
