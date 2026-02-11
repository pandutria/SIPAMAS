/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import MONEV_API from "../server/MonevAPI";

export default function TenderData() {
  const [tenderData, setTenderData] = useState<TenderDataProps[]>([]);
  const [tenderTahun, setTenderTahun] = useState<string>("2025");  

  useEffect(() => {
    const fetchTenderData = async () => {
      try {
        const responseTenderSelesai = await MONEV_API.get(`/tenderselesai?tahun=${tenderTahun}`);
        const responseTender = await MONEV_API.get(`/tender?tahun=${tenderTahun}`);

        const tenderSelesaiResData = responseTenderSelesai.data.data;
        const tenderResData = responseTender.data.data;

        const tenderMap = new Map(
          tenderSelesaiResData.map((item: any) => [item.kd_tender, item])
        );

        const mergedData = tenderResData
          .filter((selesai: any) => selesai.status_tender === "Selesai")
          .map((selesai: any) => {
            const tender = tenderMap.get(selesai.kd_tender) as any;

            const {
              kd_rup_paket,
              ...restTender
            } = tender;

            return {
              ...restTender,
              ...selesai,
              kd_rup: selesai.kd_rup ?? kd_rup_paket ?? tender.kd_rup
            };
          });

        setTenderData(mergedData);
      } catch (error) {
        if (error) {
                    console.error("Terjadi Kesalahan");
                }
      }
    }

    fetchTenderData()
  }, [tenderTahun]);

  return {
    tenderData,
    setTenderTahun,
    tenderTahun
  };
}
