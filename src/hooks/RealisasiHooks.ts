/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import API from "../server/API";
import { SwalMessage } from "../utils/SwalMessage";
import { useNavigate } from "react-router-dom";
import SwalLoading from "../utils/SwalLoading";
import { SortDescById } from "../utils/SortDescById";

export default function useRealisasiHooks() {
    const [realisasiData, setRealisasiData] = useState<RealizationProps[]>([]);
    const [realisasiDataById, setRealisasiDataById] = useState<RealizationProps | null>(null);
    const [week, setWeek] = useState<string | number>();
    const [target, setTarget] = useState<string>("");
    const [reason, setReason] = useState(null);
    const [file, setFile] = useState<File | null>(null);
    const [tahunData, setTahunData] = useState<any>([]);
    const [selectedId, setSelectedId] = useState<any>(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRealization = async () => {
            try {
                const response = await API.get("/realisasi", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data.data;
                const normalizeDetailByWeek = (details: RealizationDetailProps[]) => {
                    const map = new Map<number, RealizationDetailProps>();

                    details.forEach((d) => {
                        const existing = map.get(d.minggu_nomor);

                        if (!existing) {
                            map.set(d.minggu_nomor, d);
                        } else {
                            if (d.alasan_count > existing.alasan_count) {
                                map.set(d.minggu_nomor, d);
                            }
                        }
                    });

                    return Array.from(map.values());
                };

                const mappingData = data?.map((item: RealizationProps) => ({
                    ...item,
                    detail: item.details
                        ? normalizeDetailByWeek(item.details)
                        : [],
                    tahun_anggaran: item?.schedule.rab?.proyek.tahun_anggaran,
                    proyek_id: `TND-0${item.schedule.rab?.proyek.id}`,
                    nama: item.schedule.rab?.proyek.nama,
                }))

                const tahunUnique = Array.from(
                    new Set(
                        mappingData
                            ?.map((item: { tahun_anggaran: any; }) => item.tahun_anggaran)
                            .filter(Boolean)
                    )
                ).sort((a, b) => Number(b) - Number(a));

                const tahunOptions = tahunUnique?.map((tahun, index) => ({
                    id: index + 1,
                    text: tahun?.toString()
                }));

                setRealisasiData(SortDescById(mappingData || []));
                setTahunData(tahunOptions);
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
                console.error(error)
            }
        }

        const fetchRealizationById = async () => {
            try {
                if (!selectedId) return;
                const response = await API.get(`/realisasi/${selectedId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data.data;
                const dataRevision = {
                    ...data,
                    details: SortDescById(data.details)
                }

                setRealisasiDataById(dataRevision);
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        }

        fetchRealization();
        fetchRealizationById();
    }, [token, selectedId]);

    const handleRealizationPost = async (selectedSchedule: ScheduleProps, weekComulatif: number, realizationWeekComulatif: number) => {
        try {
            if (!week || !target || !file) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Harap isi seluruh field!"
                });

                return;
            }

            if (realizationWeekComulatif + Number(target) > weekComulatif) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Realisasi data lebih besar dari jadwal!"
                });

                return;
            }

            SwalLoading();
            const formParentData = new FormData();
            formParentData.append("schedule_header_id", String(selectedSchedule.id));

            const responseHeader = await API.post("/realisasi/create", formParentData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const formData = new FormData();
            formData.append("realisasi_header_id", responseHeader?.data?.data?.id);
            formData.append("minggu_nomor", String(week));
            formData.append("nilai", String(target));
            formData.append("bukti_file", file);
            if (reason) {
                formData.append("alasan_text", reason);
            }
            
            const responseChild = await API.post("/realisasi/detail/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: responseChild.data.message
            });

            setTimeout(() => {
                navigate("/admin-direksi/realisasi-pekerjaan/");
            }, 2000);
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

    const handleRealizationPut = async (
        selectedRealization: RealizationProps,
        weekComulatif: number,
    ) => {
        try {
            if (!week || !target || !file) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Harap isi seluruh field!"
                });
                return;
            }

            const currentWeek = Number(week);
            const inputValue = Number(target);

            const weekScheduleLimit = selectedRealization!.schedule.items!.reduce(
                (sum, item) => {
                    const weekData = item.weeks.find(
                        w => w.minggu_nomor === currentWeek
                    );
                    return sum + Number(weekData?.nilai || 0);
                },
                0
            );

            const normalizeTotal = (
                details: RealizationDetailProps[] = []
            ): Map<number, number> => {
                const map = new Map<number, RealizationDetailProps[]>();

                for (const item of details) {
                    if (!map.has(item.minggu_nomor)) {
                        map.set(item.minggu_nomor, []);
                    }
                    map.get(item.minggu_nomor)!.push(item);
                }

                const result = new Map<number, number>();

                for (const [week, items] of map.entries()) {
                    const maxAlasan = Math.max(...items.map(i => i.alasan_count));

                    if (maxAlasan === 0) {
                        result.set(
                            week,
                            items.reduce((s, i) => s + Number(i.nilai || 0), 0)
                        );
                    } else {
                        const chosen = items.reduce((a, b) =>
                            b.alasan_count > a.alasan_count ? b : a
                        );
                        result.set(week, Number(chosen.nilai || 0));
                    }
                }

                return result;
            };

            const normalized = normalizeTotal(selectedRealization.details || []);

            const totalUsed = Array.from(normalized.entries()).reduce(
                (sum, [weekNum, value]) =>
                    weekNum !== currentWeek ? sum + value : sum,
                0
            );

            const remainingTotal = weekComulatif - totalUsed;

            if (inputValue > weekScheduleLimit) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: `Nilai maksimal minggu ${currentWeek} adalah ${weekScheduleLimit}`
                });
                return;
            }

            if (inputValue > remainingTotal) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: `Sisa total realisasi hanya ${remainingTotal}`
                });
                return;
            }

            const previousValue = selectedRealization.details?.some(
                d => d.minggu_nomor === currentWeek
            );

            if (previousValue && !reason) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Alasan wajib diisi!"
                });
                return;
            }

            SwalLoading();

            const formData = new FormData();
            formData.append(
                "realisasi_header_id",
                selectedRealization.id.toString()
            );
            formData.append("minggu_nomor", String(currentWeek));
            formData.append("nilai", String(inputValue));
            formData.append("bukti_file", file);

            if (reason) {
                formData.append("alasan_text", reason);
            }

            const responseChild = await API.post(
                "/realisasi/detail/create",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: responseChild.data.message
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error: any) {
            SwalMessage({
                type: "error",
                title: "Gagal!",
                text: error?.response?.data?.message || "Terjadi kesalahan"
            });
        }
    };


    const handleChangeRealization = (e: React.ChangeEvent<any>) => {
        const { name, value, files } = e.target;
        if (name == "week") return setWeek(value);
        if (name == "target") return setTarget(value);
        if (name == "reason") return setReason(value);
        if (name == "file") return setFile(files?.[0] || null)
    }

    return {
        realisasiData,
        handleRealizationPost,
        handleChangeRealization,
        week,
        target,
        file,
        tahunData,
        setSelectedId,
        realisasiDataById,
        handleRealizationPut,
        reason
    }
}
