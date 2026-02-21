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
                    proyek_id: `TND-0${item.proyek.id}`,
                    tahun_anggaran: item.proyek.tahun_anggaran,
                    nama: item.proyek.nama,
                    kontraktor_pelaksana: item.proyek.kontraktor_pelaksana
                }));

                const tahunOpts = buildTahunOptions(data);
                setRabData(SortDescById(mappingData || []));
                setTahunData(tahunOpts);
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


                setProgram(response.data.data.program);
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

    const handleRABPost = async (projectIdentityId: number, dataRabDetail: RABDetailProps[]) => {
        try {
            if (!projectIdentityId || !dataRabDetail || !program) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Harap isi field yang telah disediakan!"
                });

                return;
            }

            SwalLoading();
            const formData = new FormData();
            formData.append("identitas_proyek_id", String(projectIdentityId));
            formData.append("program", program);

            const responseRabHeader = await API.post("/rab/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const rabHeaderId = responseRabHeader.data.data.id;
            let responseRabDetail;

            for (let index = 0; index < dataRabDetail.length; index++) {
                const data = dataRabDetail[index];

                const formData = new FormData();
                formData.append("rab_header_id", rabHeaderId);
                formData.append("keterangan", data.keterangan);
                formData.append("volume", String(data.volume));
                formData.append("satuan", data.satuan);
                formData.append("harga", String(data.harga));
                formData.append("total", String(data.total));

                responseRabDetail = await API.post("/rab/detail/create", formData, {
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
                navigate("/admin-direksi/rencana-anggaran/");
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

    const handleRABPut = async (projectIdentityId: any, dataRabHeader: any, reason: string, dataRabDetailUpdate: RABDetailProps[]) => {
        try {
            SwalLoading();
            const formData = new FormData();
            formData.append("identitas_proyek_id", projectIdentityId);
            formData.append("rab_group_id", dataRabHeader.rab_group_id);
            formData.append("program", program);
            formData.append("alasan_text", reason);

            const responseRabHeader = await API.post("/rab/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const rabHeaderId = responseRabHeader.data.data.id;
            let responseRabDetail;

            for (let index = 0; index < dataRabDetailUpdate.length; index++) {
                const data = dataRabDetailUpdate[index];
                const formData = new FormData();
                formData.append("rab_header_id", rabHeaderId);
                formData.append("keterangan", data.keterangan);
                formData.append("volume", String(data.volume));
                formData.append("satuan", data.satuan);
                formData.append("harga", String(data.harga));
                formData.append("total", String(data.total));

                responseRabDetail = await API.post("/rab/detail/create", formData, {
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
                navigate("/admin-direksi/rencana-anggaran/");
            }, 2000);
        } catch (error) {
            if (error) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Terjadi Kesalahan!",
                    type: "error"
                })
            }
            console.error(error)
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
        setSelectedId,
        rabDataByid,
        handleRABPut,
        revisionCount,
        handleDeleteRab
    }
}
