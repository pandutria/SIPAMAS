import { PassedWeek } from "../utils/PassedWeek";

export const FormatPackage = (
  data: RealizationProps[],
  mode: "top" | "bottom" = "top"
) => {
  const formatted = data.map((item) => {
    const schedule = item.schedule;
    const rab = schedule?.rab;
    const proyek = rab?.proyek;

    const currentWeek = schedule?.tanggal_mulai
      ? PassedWeek(schedule.tanggal_mulai)
      : Infinity;

    const perencanaan =
      schedule?.items.reduce((acc, i) => {
        const sum = i.weeks.reduce(
          (s, w) => s + Number(w.nilai),
          0
        );
        return acc + sum;
      }, 0) ?? 0;

    const perencanaan_minggu_ini =
      schedule?.items.reduce((acc, i) => {
        const sum = i.weeks.reduce(
          (s, w) =>
            w.minggu_nomor <= currentWeek
              ? s + Number(w.nilai)
              : s,
          0
        );
        return acc + sum;
      }, 0) ?? 0;

    const aktual =
      item.details.reduce(
        (acc, d) => acc + Number(d.nilai),
        0
      ) ?? 0;

    const deviasi_abs = Math.abs(perencanaan_minggu_ini - aktual);
    const deviasi_persen =
      perencanaan_minggu_ini === 0
        ? 0
        : (deviasi_abs / perencanaan_minggu_ini) * 100;

    return {
      id: item.id,
      tahun_anggaran: proyek?.tahun_anggaran ?? "",
      satuan_kerja: proyek?.nama ?? "",
      kode_paket: proyek?.id?.toString() ?? "",
      nama_paket: proyek?.nama ?? "",
      tanggal_mulai: schedule?.tanggal_mulai ?? "",
      tanggal_akhir: schedule?.tanggal_akhir ?? "",
      perencanaan,
      perencanaan_minggu_ini,
      aktual,
      deviasi: deviasi_abs,
      deviasi_persen,
    };
  });

  return formatted.sort((a, b) =>
    mode === "top"
      ? a.deviasi_persen - b.deviasi_persen
      : b.deviasi_persen - a.deviasi_persen
  );
};