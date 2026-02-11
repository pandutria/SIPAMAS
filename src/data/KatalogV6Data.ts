import { useEffect, useState } from "react";
import MONEV_API from "../server/MonevAPI";

export default function KatalogV6Data() {
  const [katalogv6Data, setKatalogV6Data] = useState<KatalogV6DataProps[]>([]);
  const [katalogv6Tahun, setKatalogV6Tahun] = useState<string>("2025");
  
  useEffect(() => {
    const fetchKatalogV6Data = async () => {
      try {
        const response = await MONEV_API.get(`/katalogv6?tahun=${katalogv6Tahun}`);
        setKatalogV6Data(response.data.data);
      } catch (error) {
        if (error) {
                    console.error("Terjadi Kesalahan");
                }
      }
    }

    fetchKatalogV6Data();
  }, [katalogv6Tahun]);

  return {
    katalogv6Data,
    setKatalogV6Tahun,
    katalogv6Tahun
  };
}
