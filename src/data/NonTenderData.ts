import { useEffect, useState } from "react";
import MONEV_API from "../server/MonevAPI";

export default function NonTenderData() {
  const [nonTenderData, setNonTenderData] = useState<NonTenderDataProps[]>([]);
  const [nonTenderTahun, setNonTenderTahun] = useState<string>("2025");
  
  useEffect(() => {
    const fetchNonTenderData = async () => {
      try {
        const response = await MONEV_API.get(`/nontenderselesai?tahun=${nonTenderTahun}`);
        setNonTenderData(response.data.data);
      } catch (error) {
        if (error) {
                    console.error("Terjadi Kesalahan");
                }
      }
    }

    fetchNonTenderData()
  }, [nonTenderTahun]);

  return {
    nonTenderData,
    nonTenderTahun,
    setNonTenderTahun
  }
}
