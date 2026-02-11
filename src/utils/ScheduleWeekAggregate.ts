export type WeekAggregate = {
  week_number: number;
  value: number;
};

export function ScheduleWeekAggregate(
  items: { schedule_weeks?: { week_number: number; value: number }[] }[]
): WeekAggregate[] {
  if (!Array.isArray(items) || items.length === 0) return [];

  const acc: Record<number, WeekAggregate> = {};

  for (const item of items) {
    item.schedule_weeks?.forEach(week => {
      const weekNo = Number(week.week_number);
      const val = Number(week.value ?? 0);

      if (!acc[weekNo]) {
        acc[weekNo] = { week_number: weekNo, value: 0 };
      }

      acc[weekNo].value += val;
    });
  }

  return Object.values(acc).sort((a, b) => a.week_number - b.week_number);
}
