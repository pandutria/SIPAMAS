import axios from "axios";
import { useEffect, useState } from "react";

interface LocationDataProps {
    code: string;
    name: string;
}

export default function LocationData() {
    const [kecamatanData, setKecamatanData] = useState<LocationDataProps[]>([]);
    const [kelurahanData, setKelurahanData] = useState<LocationDataProps[]>([]);
    const [selectedKecamatanCode, setSelectedKecamatamCode] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchKecamatan = async() => {
            const response = await axios.get("/wilayah/api/districts/82.02.json");
            setKecamatanData(response.data.data);
        }

        const fetchKelurahan = async() => {
            if (!selectedKecamatanCode) return;
            const response = await axios.get(`/wilayah/api/villages/${selectedKecamatanCode}.json`);
            setKelurahanData(response.data.data);
        }

        fetchKecamatan();
        fetchKelurahan();
    }, [selectedKecamatanCode]);

    return {
        kecamatanData,
        kelurahanData,
        setSelectedKecamatamCode
    }
}
