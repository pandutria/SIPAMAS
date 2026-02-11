export const PassedWeek = (start: string) => {
  const startDate = new Date(start);
  const now = new Date();

  if (now < startDate) return 0;

  const diffTime = now.getTime() - startDate.getTime();
  return Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000)) + 1;
};
