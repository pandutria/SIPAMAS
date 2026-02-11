/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { SwalMessage } from "../utils/SwalMessage";
import API from "../server/API";
import SwalLoading from "../utils/SwalLoading";
import { SortDescById } from "../utils/SortDescById";
import { TotalWeek } from "../utils/TotalWeek";

export default function useScheduleHooks() {
    const [scheduleData, setScheduleData] = useState<ScheduleProps[]>([]);
    const [tahunData, setTahunData] = useState<any>([]);
    const [satkerData, setSatkerData] = useState<any>([]);
    const token = localStorage.getItem("token");
    const [scheduleDataById, setScheduleDataById] = useState<ScheduleProps | null>(null);
    const [selectedId, setSelectedId] = useState<any>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [revisionCount, setRevisionCount] = useState<any[]>([]);

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
                    tahun_anggaran: item.rab?.data_entry.tahun_anggaran,
                    satuan_kerja: item.rab?.data_entry.satuan_kerja,
                    kode_rup: item.rab?.data_entry?.satuan_kerja,
                    kode_paket: item.rab?.data_entry?.kode_paket,
                    nama_paket: item.rab?.data_entry?.nama_paket,
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

                const satkerUnique = Array.from(
                    new Set(
                        mappingData
                            ?.map((item: { satuan_kerja: any; }) => item.satuan_kerja)
                            .filter(Boolean)
                    )
                );

                const satkerOptions = [
                    ...satkerUnique.map((satker, index) => ({
                        id: index + 2,
                        text: satker
                    }))
                ];

                setScheduleData(SortDescById(mappingData || []));
                setTahunData(tahunOptions);
                setSatkerData(satkerOptions);
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
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

    const handleSchedulePost = async (dataTenderByRab: RABProps, dataItem: ScheduleItemProps[], weeksTotal: number) => {
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

                console.log(weeksTotal, weeksFromDate)
                return;
            }

            SwalLoading();
            const responseScheduleHeader = await API.post("/schedule/create", {
                rab_id: dataTenderByRab.id,
                tanggal_mulai: startDate,
                tanggal_akhir: endDate
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            for (let index = 0; index < dataItem.length; index++) {
                const scheduleItem = dataItem[index];

                const responseScheduleItem = await API.post("/schedule/item/create", {
                    schedule_header_id: responseScheduleHeader.data.data?.id,
                    description: scheduleItem?.description,
                    number: (index + 1).toString(),
                    weight: scheduleItem?.weight,
                    total_price: Number(scheduleItem?.total_price)
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                for (let index = 0; index < scheduleItem.schedule_weeks.length; index++) {
                    const scheduleWeek = scheduleItem.schedule_weeks[index];

                    await API.post('/schedule/week/create', {
                        schedule_item_id: responseScheduleItem.data.data?.id,
                        week_number: index + 1,
                        value: scheduleWeek.value
                    }, {
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
                window.location.href = "/ppk/jadwal-pelaksanaan"
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

    const handleSchedulePut = async (dataTenderByRab: ScheduleProps, scheduleGroupId: number, dataItem: ScheduleItemProps[], reason: string, weeksTotal: number) => {
        try {
            if (dataItem.length < 0) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Harap isi field yang telah kami sediakan!"
                });

                return;
            }

            const weeksFromDate = TotalWeek(startDate ? startDate : dataTenderByRab.tanggal_mulai, endDate ? endDate : dataTenderByRab.tanggal_akhir);
            if (weeksTotal != weeksFromDate) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Tanggal pelaksanaan dengan minggu pelaksanaan tidak sesuai!"
                });

                return;
            }

            SwalLoading();
            const responseScheduleHeader = await API.post("/schedule/create", {
                rab_id: dataTenderByRab.rab_id ? dataTenderByRab.rab_id : dataTenderByRab.id,
                schedule_group_id: scheduleGroupId,
                tanggal_mulai: startDate ? startDate : dataTenderByRab.tanggal_mulai,
                tanggal_akhir: endDate ? endDate : dataTenderByRab.tanggal_akhir,
                alasan_text: reason,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            for (let index = 0; index < dataItem.length; index++) {
                const scheduleItem = dataItem[index];

                const responseScheduleItem = await API.post("/schedule/item/create", {
                    schedule_header_id: responseScheduleHeader.data.data?.id,
                    description: scheduleItem?.description,
                    number: (index + 1).toString(),
                    weight: scheduleItem?.weight,
                    total_price: Number(scheduleItem?.total_price)
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                for (let index = 0; index < scheduleItem.schedule_weeks.length; index++) {
                    const scheduleWeek = scheduleItem.schedule_weeks[index];

                    await API.post('/schedule/week/create', {
                        schedule_item_id: responseScheduleItem.data.data?.id,
                        week_number: index + 1,
                        value: scheduleWeek.value
                    });
                }
            }

            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: "Ubah jadwal berhasil!"
            });

            setTimeout(() => {
                window.location.href = "/ppk/jadwal-pelaksanaan"
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
        }
    }

    return {
        handleSchedulePost,
        scheduleData,
        tahunData,
        satkerData,
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
