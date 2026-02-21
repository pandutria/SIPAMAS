import { PassedWeek } from "./PassedWeek";

export const PlannedProgressUntilWeek = (
  scheduleWeeks: { nilai: number }[],
  startDate: string
) => {
  const passedWeek = PassedWeek(startDate);

  return scheduleWeeks
    .slice(0, passedWeek)
    .reduce((sum, item) => sum + Number(item.nilai || 0), 0);
};
