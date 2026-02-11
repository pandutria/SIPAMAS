/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import MONEV_API from "../server/MonevAPI";

export default function PenyediaV6Data() {
    const [penyediaV6Data, setPenyediaV6Data] = useState<any>(null);
    const [penyediaV6Param, setPenyediaV6Param] = useState<any>(null);

    useEffect(() => {
        const fetchPenyedia = async() => {
            try {
                if (!penyediaV6Param) return; 
                const response = await MONEV_API.get(`/penyediav6?kd_penyedia=${penyediaV6Param}`);
                setPenyediaV6Data(response.data.data);
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        }

        fetchPenyedia();
    }, [penyediaV6Param]);

    return {
        penyediaV6Data,
        setPenyediaV6Param,
    }
}
