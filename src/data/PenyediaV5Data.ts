/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import MONEV_API from "../server/MonevAPI";

export default function PenyediaV5Data() {
    const [penyediaV5Data, setPenyediaV5Data] = useState<any>(null);
    const [penyediaV5Param, setPenyediaV5Param] = useState<any>(null);

    useEffect(() => {
        const fetchPenyedia = async() => {
            try {
                if (!penyediaV5Param) return; 
                const response = await MONEV_API.get(`/penyediav5?kd_penyedia=${penyediaV5Param}`);
                setPenyediaV5Data(response.data.data);
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        }

        fetchPenyedia();
    }, [penyediaV5Param]);

    return {
        penyediaV5Data,
        setPenyediaV5Param,
    }
}
