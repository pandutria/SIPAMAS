export function ConvertToPercent(
  value: number,
  maxValue: number
): number {
  if (!Number.isFinite(value) || !Number.isFinite(maxValue) || maxValue <= 0)
    return 0;

  return Number(((value / maxValue) * 100).toFixed(2));
}
