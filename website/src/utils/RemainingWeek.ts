export function RemainingWeeks(
  startDate: string | Date,
  endDate: string | Date,
  now: Date = new Date()
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const effectiveNow = now < start ? start : now;
  if (effectiveNow > end) return 0;

  const diffMs = end.getTime() - effectiveNow.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return Math.ceil(diffDays / 7);
}
