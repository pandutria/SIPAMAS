export type WeekAggregate = {
  week_number: number;
  value: number;
};

export function RealizationWeekAggregate(
  items: { week_number: number; value: number | string }[]
): WeekAggregate[] {
  if (!Array.isArray(items) || items.length === 0) return [];

  const acc: Record<number, WeekAggregate> = {};

  for (const item of items) {
    const weekNo = Number(item.week_number);
    const val = Number(item.value ?? 0);

    if (!acc[weekNo]) {
      acc[weekNo] = { week_number: weekNo, value: 0 };
    }

    acc[weekNo].value += val;
  }

  return Object.values(acc).sort((a, b) => a.week_number - b.week_number);
}
