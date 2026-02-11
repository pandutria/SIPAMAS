import { PassedWeek } from "./PassedWeek";

export const PlannedProgressUntilWeek = (
  scheduleWeeks: { value: number }[],
  startDate: string
) => {
  const passedWeek = PassedWeek(startDate);

  return scheduleWeeks
    .slice(0, passedWeek)
    .reduce((sum, item) => sum + Number(item.value || 0), 0);
};
