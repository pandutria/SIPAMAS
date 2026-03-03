import { PassedWeek } from "../utils/PassedWeek";
import { ConvertToPercent } from "../utils/CovertToPercent";

export const FormatPackage = (
  data: RealizationProps[],
  mode: 'top' | 'bottom' = 'top'
) => {
  const formatted = data.map((item) => {
    const schedule = item.schedule;
    const dataProyek = schedule?.rab?.proyek;

    const currentWeek = schedule?.tanggal_mulai
      ? PassedWeek(schedule.tanggal_mulai)
      : Infinity;

    const perencanaan =
      schedule?.items?.reduce((acc: number, i: ScheduleItemProps) => {
        const sum = i.weeks?.reduce(
          (s: number, w: ScheduleWeekProps) => s + Number(w.nilai), 0
        ) || 0;
        return acc + sum;
      }, 0) || 0;

    const perencanaan_minggu_ini =
      schedule?.items?.reduce((acc: number, i: ScheduleItemProps) => {
        const sum = i.weeks?.reduce(
          (s: number, w: ScheduleWeekProps) => w.minggu_nomor <= currentWeek ? s + Number(w.nilai) : s, 0
        ) || 0;
        return acc + sum;
      }, 0) || 0;

    const aktual =
      item.details?.reduce(
        (acc: number, d: RealizationDetailProps) => acc + Number(d.nilai), 0
      ) || 0;

    const perencanaan_minggu_ini_pct = ConvertToPercent(perencanaan_minggu_ini, perencanaan);
    const aktual_pct = ConvertToPercent(aktual, perencanaan);
    const deviasi_persen = perencanaan_minggu_ini_pct - aktual_pct;

    return {
      id: item.id,
      tahun_anggaran: dataProyek?.tahun_anggaran || "",
      identitas_proyek: `TND-0${dataProyek?.id}`,
      nama: dataProyek?.nama || "",
      tanggal_mulai: schedule?.tanggal_mulai || "",
      tanggal_akhir: schedule?.tanggal_akhir || "",
      perencanaan,
      perencanaan_minggu_ini,
      perencanaan_minggu_ini_pct,
      aktual,
      aktual_pct,
      deviasi_persen,
    };
  });

  return [...formatted].sort((a, b) =>
    mode === 'top'
      ? a.deviasi_persen - b.deviasi_persen
      : b.deviasi_persen - a.deviasi_persen
  );
};