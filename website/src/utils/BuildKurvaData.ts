import { PassedWeek } from "./PassedWeek";

export function buildKurvaData(
  schedule?: ScheduleProps | null,
  realization?: {
    detail?: { minggu_nomor: string | number; nilai: string | number | null }[]
  } | null
): { minggu: number; rencana: number; aktual: number }[] {
  if (!schedule?.items?.length) return [];

  const rencanaMap = new Map<number, number>();
  const aktualMap = new Map<number, number>();

  for (const item of schedule.items) {
    for (const w of item.weeks ?? []) {
      const week = Number(w.minggu_nomor);
      const nilai = Number(w.nilai ?? 0);

      if (!Number.isFinite(week) || !Number.isFinite(nilai)) continue;

      rencanaMap.set(week, (rencanaMap.get(week) ?? 0) + nilai);
    }
  }

  for (const d of realization?.detail ?? []) {
    const week = Number(d.minggu_nomor);
    const nilai = Number(d.nilai ?? 0);

    if (!Number.isFinite(week) || !Number.isFinite(nilai)) continue;

    aktualMap.set(week, (aktualMap.get(week) ?? 0) + nilai);
  }

  const passedWeek = PassedWeek(schedule.tanggal_mulai);

  const weeks = [...rencanaMap.keys()]
    .filter(week => week <= passedWeek) 
    .sort((a, b) => a - b);

  let rencanaCum = 0;
  let aktualCum = 0;

  return weeks.map(week => {
    rencanaCum += rencanaMap.get(week) ?? 0;
    aktualCum += aktualMap.get(week) ?? 0;

    return {
      minggu: week,
      rencana: Math.round(rencanaCum),
      aktual: Math.round(aktualCum)
    };
  });
}
