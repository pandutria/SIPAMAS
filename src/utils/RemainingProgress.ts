export function RemainingProgress(
  detail?: { value?: string | number | null }[] | null
): number {
  if (!Array.isArray(detail) || detail.length === 0) return 0;

  return detail.reduce((sum, item) => {
    const val = Number(item?.value ?? 0);
    return sum + (Number.isFinite(val) ? val : 0);
  }, 0);
}
