export function getAge(dob: Date, now: Date): number {
  const diff = new Date(now.getTime() - dob.getTime());
  const y = diff.getUTCFullYear();
  return Math.abs(y - 1970);
}
