export type WeekAggregate = {
  minggu_nomor: number;
  nilai: number;
};

export function RealizationWeekAggregate(
  items: { minggu_nomor: number; nilai: number | string }[]
): WeekAggregate[] {
  if (!Array.isArray(items) || items.length === 0) return [];

  const acc: Record<number, WeekAggregate> = {};

  for (const item of items) {
    const weekNo = Number(item.minggu_nomor);
    const val = Number(item.nilai ?? 0);

    if (!acc[weekNo]) {
      acc[weekNo] = { minggu_nomor: weekNo, nilai: 0 };
    }

    acc[weekNo].nilai += val;
  }

  return Object.values(acc).sort((a, b) => a.minggu_nomor - b.minggu_nomor);
}
