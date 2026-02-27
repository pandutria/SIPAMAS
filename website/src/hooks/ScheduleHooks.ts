/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { SwalMessage } from "../utils/SwalMessage";
import API from "../server/API";
import SwalLoading from "../utils/SwalLoading";
import { SortDescById } from "../utils/SortDescById";
import { TotalWeek } from "../utils/TotalWeek";
import { useNavigate } from "react-router-dom";

export default function useScheduleHooks() {
    const [scheduleData, setScheduleData] = useState<ScheduleProps[]>([]);
    const [tahunData, setTahunData] = useState<any>([]);
    const token = localStorage.getItem("token");
    const [scheduleDataById, setScheduleDataById] = useState<ScheduleProps | null>(null);
    const [selectedId, setSelectedId] = useState<any>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [revisionCount, setRevisionCount] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetcSchedule = async () => {
            try {
                const response = await API.get("/schedule", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = response.data.data;
                const latestScheduleMap = new Map<number, ScheduleProps>();

                data.forEach((item: ScheduleProps) => {
                    if (!item.schedule_group_id) return;

                    const existing = latestScheduleMap.get(item.schedule_group_id);
                    if (!existing || item.alasan_count > existing.alasan_count) {
                        latestScheduleMap.set(item.schedule_group_id, item);
                    }
                });

                const mappingData = Array.from(latestScheduleMap.values()).map((item: ScheduleProps) => ({
                    ...item,
                    tahun_anggaran: item.rab?.proyek.tahun_anggaran,
                    proyek_id: `TND-0${item.rab?.proyek?.id}`,
                    nama: item.rab?.proyek?.nama,
                    program: item.rab?.program,
                }));

                const tahunUnique = Array.from(
                    new Set(
                        mappingData
                            ?.map((item: { tahun_anggaran: any; }) => item.tahun_anggaran)
                            .filter(Boolean)
                    )
                ).sort((a, b) => Number(b) - Number(a));

                const tahunOptions = tahunUnique.map((tahun, index) => ({
                    id: index + 1,
                    text: tahun?.toString()
                }));

                setScheduleData(SortDescById(mappingData || []));
                setTahunData(tahunOptions);
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
                console.error(error)
            }
        }

        const fetcScheduleById = async () => {
            try {
                if (!selectedId) return;
                const responseData = await API.get("/schedule", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const response = await API.get(`/schedule/${selectedId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data: ScheduleProps[] = responseData.data.data;

                const currentSchedule = data.find(
                    item => item.id === Number(selectedId)
                );
                if (!currentSchedule) return;

                const groupId =
                    currentSchedule.schedule_group_id ?? currentSchedule.id;

                const revisions = data
                    .filter(item =>
                        item.id === groupId ||
                        item.schedule_group_id === groupId
                    )
                    .sort((a: any, b: any) => (a?.revisi_ke ?? 0) - (b?.revisi_ke ?? 0))
                    .map(item => ({
                        schedule_id: item.id,
                        schedule_group_id: item.schedule_group_id,
                        alasan_count: item.alasan_count,
                        created_at: item.created_at
                    }));

                setStartDate(response.data.data.tanggal_mulai);
                setEndDate(response.data.data.tanggal_akhir);

                setRevisionCount(revisions)
                setScheduleDataById(response.data.data);
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        }

        fetcSchedule();
        fetcScheduleById();
    }, [selectedId, token]);

    const handleSchedulePost = async (dataProjectIdentityByRab: RABProps, dataItem: ScheduleItemProps[], weeksTotal: number) => {
        try {
            if (dataItem.length < 0 || !startDate || !endDate) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Harap isi field yang telah disediakan!"
                });

                return;
            }

            const weeksFromDate = TotalWeek(startDate, endDate);
            if (weeksTotal != weeksFromDate) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Tanggal pelaksanaan dengan minggu pelaksanaan tidak sesuai!"
                });

                return;
            }

            SwalLoading();
            const formData = new FormData();
            formData.append("rab_id", String(dataProjectIdentityByRab.id));
            formData.append("tanggal_mulai", startDate);
            formData.append("tanggal_akhir", endDate);

            const responseScheduleHeader = await API.post("/schedule/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            for (let index = 0; index < dataItem.length; index++) {
                const scheduleItem = dataItem[index];
                const formData = new FormData();
                formData.append("schedule_header_id", String(responseScheduleHeader.data.data?.id));
                formData.append("keterangan", scheduleItem.keterangan);
                formData.append("nomor", (index + 1).toString());
                formData.append("bobot", String(scheduleItem.bobot));
                formData.append("jumlah", String(scheduleItem.jumlah));

                const responseScheduleItem = await API.post("/schedule/item/create", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                for (let index = 0; index < scheduleItem.weeks.length; index++) {
                    const scheduleWeek = scheduleItem.weeks[index];
                    const formData = new FormData();
                    formData.append("schedule_item_id", String(responseScheduleItem.data.data?.id));
                    formData.append("minggu_nomor", String(index + 1));
                    formData.append("nilai", String(scheduleWeek.nilai));

                    await API.post('/schedule/week/create', formData, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
            }

            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: "Jadwal Pelaksanaan berhasil ditambahkan!"
            });

            setTimeout(() => {
                navigate("/admin-direksi/jadwal-pelaksanaan");
            }, 2000);
        } catch (error: any) {
            if (error) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: error.response.data.message
                });
            }
        }
    }

    const handleChangeSchedule = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name == "start") return setStartDate(value);
        if (name == "end") return setEndDate(value);
    }

    const handleSchedulePut = async (dataProjectIdentityByRab: ScheduleProps, scheduleGroupId: number, dataItem: ScheduleItemProps[], reason: string, weeksTotal: number) => {
        try {
            if (dataItem.length < 0) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Harap isi field yang telah kami sediakan!"
                });

                return;
            }

            const weeksFromDate = TotalWeek(startDate, endDate);
            if (weeksTotal != weeksFromDate) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Tanggal pelaksanaan dengan minggu pelaksanaan tidak sesuai!"
                });

                return;
            }

            SwalLoading();
            const formData = new FormData();
            formData.append("rab_id", String(dataProjectIdentityByRab.rab_id));
            formData.append("schedule_group_id", String(scheduleGroupId));
            formData.append("tanggal_mulai", startDate);
            formData.append("tanggal_akhir", endDate);
            formData.append("alasan_text", reason);

            const responseScheduleHeader = await API.post("/schedule/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            for (let index = 0; index < dataItem.length; index++) {
                const scheduleItem = dataItem[index];
                const formData = new FormData();
                formData.append("schedule_header_id", String(responseScheduleHeader.data.data.id));
                formData.append("keterangan", scheduleItem.keterangan);
                formData.append("nomor", (index + 1).toString());
                formData.append("jumlah", String(scheduleItem.jumlah));
                formData.append("bobot", String(scheduleItem.bobot));

                const responseScheduleItem = await API.post("/schedule/item/create", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                for (let index = 0; index < scheduleItem.weeks.length; index++) {
                    const scheduleWeek = scheduleItem.weeks[index];
                    const formData = new FormData();
                    formData.append("schedule_item_id", responseScheduleItem.data.data.id);
                    formData.append("minggu_nomor", String(index + 1));
                    formData.append("nilai", String(scheduleWeek.nilai));

                    await API.post('/schedule/week/create', formData, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
            }

            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: "Ubah jadwal berhasil!"
            });

            setTimeout(() => {
                navigate("/admin-direksi/jadwal-pelaksanaan")
            }, 2000);
        } catch (error: any) {
            if (error) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: error?.response?.data?.message
                });
            }
        }
    }

    const handleScheduleDelete = async (ids: number[]) => {
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
                text: `Apakah anda yakin ingin menghapus data Jadwal ini?`,
            });

            if (result.isConfirmed) {
                let response;
                SwalLoading();

                for (let index = 0; index < ids.length; index++) {
                    const id = ids[index];
                    response = await API.delete(`/schedule/delete/${id}`, {
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
            console.error(error)
        }
    }

    return {
        handleSchedulePost,
        scheduleData,
        tahunData,
        setSelectedId,
        scheduleDataById,
        handleSchedulePut,
        handleScheduleDelete,
        revisionCount,
        startDate,
        endDate,
        handleChangeSchedule
    }
}
