/* eslint-disable @typescript-eslint/no-explicit-any */
import { SwalMessage } from "../utils/SwalMessage";
import API from "../server/API";
import SwalLoading from "../utils/SwalLoading";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { SortDescById } from "../utils/SortDescById";

export default function useRABHooks() {
    const token = localStorage.getItem("token");
    const [program, setProgram] = useState("");
    const [rabData, setRabData] = useState<RABProps[]>([]);
    const [tahunData, setTahunData] = useState<any>([]);
    const [satkerData, setSatkerData] = useState<any>([]);
    const [rabDataByid, setRabDataById] = useState<RABProps | null>(null);
    const [selectedId, setSelectedId] = useState<any>(null);
    const navigate = useNavigate();
    const [revisionCount, setRevisionCount] = useState<any[]>([]);

    const buildTahunOptions = (data: any) => {
        const uniqueYears = Array.from(
            new Set(
                data
                    .map((item: any) => Number(item?.data_entry?.tahun_anggaran))
                    .filter((v: any): v is number => typeof v === "number")
            )
        ).sort((a: any, b: any) => b - a);

        return uniqueYears.map((tahun: any) => ({
            id: tahun.toString(),
            text: tahun.toString()
        }));
    };


    const buildSatkerOptions = (data: any[]) => {
        const uniqueMap = new Map<string, string>();

        data.forEach(item => {
            if (typeof item?.data_entry?.satuan_kerja === "string") {
                uniqueMap.set(item?.data_entry?.satuan_kerja, item?.data_entry?.satuan_kerja);
            }
        });

        return Array.from(uniqueMap.entries()).map(([key, value]) => ({
            id: key,
            text: value
        }));
    };

    useEffect(() => {
        const fetchRab = async () => {
            try {
                const response = await API.get("/rab", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data: RABProps[] = response.data.data;

                const latestRabMap = new Map<number, RABProps>();

                data.forEach(item => {
                    if (!item.rab_group_id) return;

                    const existing = latestRabMap.get(item.rab_group_id);
                    if (!existing || item.alasan_count > existing.alasan_count) {
                        latestRabMap.set(item.rab_group_id, item);
                    }
                });

                const mappingData = Array.from(latestRabMap.values()).map(item => ({
                    ...item,
                    tahun_anggaran: item.data_entry.tahun_anggaran?.toString(),
                    satuan_kerja: item.data_entry.satuan_kerja?.toString(),
                    kode_rup: item.data_entry.kode_rup?.toString(),
                    kode_paket: item.data_entry.kode_paket?.toString(),
                    nama_paket: item.data_entry.nama_paket?.toString(),
                }));


                const tahunOpts = buildTahunOptions(data);
                const satkerOpts = buildSatkerOptions(data);

                setRabData(SortDescById(mappingData || []));
                setTahunData(tahunOpts);
                setSatkerData(satkerOpts);
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        };

        const fetchRabById = async () => {
            try {
                if (!selectedId) return;
                const response = await API.get(`/rab/${selectedId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const responseRab = await API.get('/rab', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data: RABProps[] = responseRab.data.data
                const currentRab = data.find(item => item.id === Number(selectedId));
                if (!currentRab) return;

                const groupId = currentRab.rab_group_id ?? currentRab.id;

                const revisions = data
                    .filter(item =>
                        item.id === groupId ||
                        item.rab_group_id === groupId
                    )
                    .sort((a: any, b: any) => (a.revisi_ke ?? 0) - (b.revisi_ke ?? 0))
                    .map(item => ({
                        rab_id: item.id,
                        rab_group_id: item.rab_group_id,
                        alasan_count: item.alasan_count,
                        created_at: item.created_at,
                    }));


                setRabDataById(response.data.data);
                setRevisionCount(revisions);
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        }

        fetchRab();
        fetchRabById();
    }, [selectedId, token]);

    const handleRABPost = async (dataEntryId: number, dataRabDetail: RABDetailProps[]) => {
        try {
            if (!dataEntryId || !dataRabDetail) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Harap isi field yang telah disediakan!"
                });

                return;
            }

            if (!program) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Harap isi field yang telah disediakan!"
                });

                return;
            }

            SwalLoading();
            const responseRabHeader = await API.post("/rab/create", {
                data_entry_id: dataEntryId,
                program: program?.toString(),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const rabHeaderId = responseRabHeader.data.data.id;
            let responseRabDetail;

            for (let index = 0; index < dataRabDetail.length; index++) {
                const data = dataRabDetail[index];
                responseRabDetail = await API.post("/rab/detail/create", {
                    rab_header_id: rabHeaderId,
                    description: data.description,
                    volume: data.volume,
                    unit: data.unit,
                    unit_price: data.unit_price,
                    total: data.total
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            const message = responseRabDetail?.data.message;
            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: message
            });

            setTimeout(() => {
                navigate("/ppk/rencana-anggaran/");
            }, 2000);
        } catch (error) {
            if (error) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Terjadi Kesalahan!",
                    type: "error"
                })
            }
        }
    }

    const handleRABPut = async (dataEntry: any, dataRabHeader: any, reason: string, dataRabDetailUpdate: RABDetailProps[]) => {
        try {
            SwalLoading();
            const responseRabHeader = await API.post("/rab/create", {
                rab_group_id: dataRabHeader.rab_group_id,
                data_entry_id: dataEntry,
                program: program ? program.toString() : dataRabHeader?.program,
                alasan_text: reason,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const rabHeaderId = responseRabHeader.data.data.id;
            const dataRabDetail = dataRabHeader.rab_details;
            let responseRabDetail;

            if (dataRabDetailUpdate.length > 0) {
                for (let index = 0; index < dataRabDetailUpdate.length; index++) {
                    const data = dataRabDetailUpdate[index];
                    responseRabDetail = await API.post("/rab/detail/create", {
                        rab_header_id: rabHeaderId,
                        description: data.description,
                        volume: data.volume,
                        unit: data.unit,
                        unit_price: data.unit_price,
                        total: data.total
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
            } else {
                for (let index = 0; index < dataRabDetail.length; index++) {
                    const data = dataRabDetail[index];
                    responseRabDetail = await API.post("/rab/detail/create", {
                        rab_header_id: rabHeaderId,
                        description: data.description,
                        volume: data.volume,
                        unit: data.unit,
                        unit_price: data.unit_price,
                        total: data.total
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
            }

            const message = responseRabDetail?.data.message;
            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: message
            });

            setTimeout(() => {
                navigate("/ppk/rencana-anggaran/");
            }, 2000);
        } catch (error) {
            if (error) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Terjadi Kesalahan!",
                    type: "error"
                })
            }
        }
    }

    const handleChangeRAB = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name == "program") return setProgram(value);
    }

    const handleDeleteRab = async (ids: number[]) => {
        try {
            if (ids.length === 0) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Harap pilih minimal 1 data untuk dihapus!"
                });

                return;
            }

            const result = await SwalMessage({
                type: "warning",
                title: "Konfirmasi!",
                text: `Apakah anda yakin ingin menghapus data RAB ini?`,
            });

            if (result.isConfirmed) {
                let response;
                SwalLoading();

                for (let index = 0; index < ids.length; index++) {
                    const id = ids[index];
                    response = await API.delete(`/rab/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }

                const message = response?.data.message;
                SwalMessage({
                    type: "success",
                    title: "Berhasil!",
                    text: message
                });

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error: any) {
            if (error) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: error.response.data.message
                })
            }
        }
    }

    return {
        handleRABPost,
        handleChangeRAB,
        program,
        rabData,
        tahunData,
        satkerData,
        setSelectedId,
        rabDataByid,
        handleRABPut,
        revisionCount,
        handleDeleteRab
    }
}
