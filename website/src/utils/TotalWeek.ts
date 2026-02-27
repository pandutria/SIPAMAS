export const TotalWeek = (tanggalAwal: string, tanggalAkhir: string): number => {
  const startDate = new Date(tanggalAwal);
  const endDate = new Date(tanggalAkhir);

  if (startDate > endDate) return 0;

  const diffTime = endDate.getTime() - startDate.getTime(); 
  const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;
  const jumlahMinggu = Math.ceil(diffDays / 7);

  return jumlahMinggu;
};
