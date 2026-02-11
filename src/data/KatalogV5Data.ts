import { useEffect, useState } from "react";
import MONEV_API from "../server/MonevAPI";

export default function KatalogV5Data() {
  const [katalogv5Data, setKatalogV5Data] = useState<KatalogV5DataProps[]>([]);
  const [katalogv5Tahun, setKatalogV5tahun] = useState<string>("2025");
  
  useEffect(() => {
    const fetchKatalogV5Data = async () => {
      try {
        const response = await MONEV_API.get(`/katalogv5?tahun=${katalogv5Tahun}`);
        setKatalogV5Data(response.data.data);
      } catch (error) {
        if (error) {
                    console.error("Terjadi Kesalahan");
                }
      }
    }

    fetchKatalogV5Data();
  }, [katalogv5Tahun]);

  return {
    katalogv5Data,
    setKatalogV5tahun,
    katalogv5Tahun
  };
}
