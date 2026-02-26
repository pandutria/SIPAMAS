import { Navigate, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import useProjectIdentity from "../../../hooks/ProjectIdentity";
import BackButton from "../../../ui/BackButton";
import FormInput from "../../../ui/FormInput";
import ShowTableForm from "../../../ui/ShowTableForm";
import { useEffect, useState } from "react";
import useEvaluasiHooks from "../../../hooks/EvaluasiHooks";
import type { EvaluasiProps } from "../../../types/global";
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../../ui/LoadingSpinner";
import { SortDescById } from "../../../utils/SortDescById";

export default function AdminPPKEvaluasiUpdateView() {
    const { projectIdentityByIdData, setSelectedProjectIdentityId } = useProjectIdentity();
    const {
        evaluasiForm,
        handleChangeForm,
        evaluasiData,
        setEvaluasiForm,
    } = useEvaluasiHooks();
    const { id } = useParams();
    const [evaluasiDataFilter, setEvaluasiDataFilter] = useState<EvaluasiProps[]>([]);
    const [evaluasiDataCurrent, setEvaluasiDataCurrent] = useState<EvaluasiProps | undefined>(undefined);
    const [skorInput, setSkorInput] = useState<string>(evaluasiForm.skor?.toString() ?? "");
    const realizationId = localStorage.getItem("realization_id");
    const { loading, user } = useAuth();

    useEffect(() => {
        setSelectedProjectIdentityId(Number(id));

        const fetchEvaluasi = async () => {
            const filtered = evaluasiData.filter((item) =>
                Number(item.realisasi_header_id) == Number(realizationId)
            );
            const current = evaluasiData.find((item) =>
                Number(item.realisasi_header_id) == Number(realizationId) && item.deleted_at == null
            );
            setEvaluasiDataFilter(filtered);
            setEvaluasiDataCurrent(current);
        };

        const fetchForm = async () => {
            setEvaluasiForm({
                skor: evaluasiDataCurrent?.skor ?? "",
                catatan: evaluasiDataCurrent?.catatan ?? "",
                tindakan: evaluasiDataCurrent?.tindakan ?? ""
            });
            setSkorInput(evaluasiDataCurrent?.skor?.toString() ?? "");
        };

        fetchForm();
        fetchEvaluasi();
    }, [setSelectedProjectIdentityId, id, evaluasiData, realizationId, evaluasiDataCurrent, setEvaluasiForm]);

    if (loading) return <LoadingSpinner />;
    if (!user || user.role != "admin-ppk") return <Navigate to="/" replace />;

    const skorValue = Number(evaluasiForm.skor) || 0;

    const getSkorConfig = (skor: number) => {
        if (skor >= 80) return { bar: "from-primary to-emerald-400", text: "text-primary", label: "Sangat Baik", bg: "bg-green-50 border-green-200" };
        if (skor >= 60) return { bar: "from-yellow-400 to-amber-400", text: "text-yellow-500", label: "Cukup", bg: "bg-yellow-50 border-yellow-200" };
        if (skor >= 40) return { bar: "from-orange-400 to-orange-500", text: "text-orange-500", label: "Kurang", bg: "bg-orange-50 border-orange-200" };
        return { bar: "from-red-400 to-red-500", text: "text-red-500", label: "Buruk", bg: "bg-red-50 border-red-200" };
    };

    const handleSkorChange = (value: number) => {
        const clamped = Math.min(100, Math.max(1, value));
        setSkorInput(String(clamped));
        handleChangeForm({
            target: { name: "skor", value: String(clamped) },
        } as React.ChangeEvent<HTMLInputElement>);
    };

    const colorConfig = getSkorConfig(skorValue);

    const getSkorColor = (skor: string, isDeleted: boolean) => {
        if (isDeleted) return "text-red-400";
        const score = Number(skor);
        if (score >= 80) return "text-primary";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getSkorBg = (skor: string, isDeleted: boolean) => {
        if (isDeleted) return "from-red-50 to-red-100";
        const score = Number(skor);
        if (score >= 80) return "from-green-50 to-emerald-100";
        if (score >= 60) return "from-yellow-50 to-amber-100";
        return "from-red-50 to-rose-100";
    };

    const getSkorRing = (skor: string, isDeleted: boolean) => {
        if (isDeleted) return "ring-red-200";
        const score = Number(skor);
        if (score >= 80) return "ring-primary";
        if (score >= 60) return "ring-yellow-400";
        return "ring-red-400";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-16 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
                <div className="max-w-7xl mx-auto">
                    <BackButton type='custom' link='/admin-direksi/evaluasi' />

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-7 bg-primary rounded-full"></div>
                            <h1 className="font-poppins-bold text-2xl text-gray-800">
                                Tambah Evaluasi Proyek
                            </h1>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                                <ShowTableForm disabled={true} tenderCode={`TND-0${projectIdentityByIdData?.id}`} onClick={() => false} />

                                <FormInput
                                    title='Nama Proyek'
                                    placeholder='Masukkan nama proyek (otomatis)'
                                    value={projectIdentityByIdData?.nama}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Tahun Anggaran'
                                    placeholder='Masukkan tahun anggaran (otomatis)'
                                    value={projectIdentityByIdData?.tahun_anggaran}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kategori Proyek'
                                    placeholder='Masukkan kategori proyek (otomatis)'
                                    value={projectIdentityByIdData?.kategori}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kontraktor Pelaksana'
                                    placeholder='Masukkan kontrator pelaksana (otomatis)'
                                    value={projectIdentityByIdData?.kontraktor_pelaksana}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Konsultas Pengawas'
                                    placeholder='Masukkan konsultas pengawas (otomatis)'
                                    value={projectIdentityByIdData?.konsultas_pengawas}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Lokasi'
                                    placeholder='Masukkan lokasi (otomatis)'
                                    value={projectIdentityByIdData?.kecamatan}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Nilai Kontrak'
                                    placeholder='Masukkan nilai kontrak (otomatis)'
                                    value={projectIdentityByIdData?.nilai_kontrak}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Temuan dan Catatan Pemeriksaan'
                                    placeholder='Masukkan catatan'
                                    value={evaluasiForm.catatan}
                                    name="catatan"
                                    onChange={handleChangeForm}
                                    type="textarea"
                                />

                                <FormInput
                                    title='Tindakan Korektif & Intruksi PPK'
                                    placeholder='Masukkan tindakan'
                                    value={evaluasiForm.tindakan}
                                    name="tindakan"
                                    onChange={handleChangeForm}
                                    type="textarea"
                                />

                                <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                                    <p className="font-poppins-semibold text-[14px] text-gray-700">
                                        Skor Evaluasi <span className="text-primary">*</span>
                                    </p>

                                    <div className={`rounded-2xl border-2 p-5 transition-all duration-300 ${colorConfig.bg}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`text-5xl font-poppins-bold leading-none ${colorConfig.text}`}>
                                                    {skorValue || 0}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-poppins-regular text-gray-400">dari 100</span>
                                                    <span className={`text-xs font-poppins-semibold ${colorConfig.text}`}>
                                                        {skorValue > 0 ? colorConfig.label : "—"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={100}
                                                    value={skorInput}
                                                    disabled={true}
                                                    onChange={(e) => {
                                                        setSkorInput(e.target.value);
                                                        const val = Number(e.target.value);
                                                        if (val >= 1 && val <= 100) handleSkorChange(val);
                                                    }}
                                                    onBlur={() => {
                                                        const val = Number(skorInput);
                                                        if (!val || val < 1) handleSkorChange(1);
                                                        else if (val > 100) handleSkorChange(100);
                                                    }}
                                                    className="w-16 h-9 text-center rounded-xl border border-gray-200 bg-white font-poppins-semibold text-sm focus:outline-none focus:border-primary transition-all duration-200 shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative w-full h-3 bg-white rounded-full overflow-hidden border border-gray-100 shadow-inner">
                                            <div
                                                className={`h-full rounded-full bg-linear-to-r ${colorConfig.bar} transition-all duration-300`}
                                                style={{ width: `${skorValue}%` }}
                                            />
                                        </div>

                                        <div className="flex justify-between mt-2">
                                            {[
                                                { val: 25, label: "Buruk" },
                                                { val: 50, label: "Kurang" },
                                                { val: 75, label: "Cukup" },
                                                { val: 100, label: "Baik" },
                                            ].map((item) => (
                                                <button
                                                    key={item.val}
                                                    type="button"
                                                    onClick={() => handleSkorChange(item.val)}
                                                    className={`text-[10px] font-poppins-semibold px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
                                                        skorValue === item.val
                                                            ? `${colorConfig.text} bg-white shadow-sm`
                                                            : "text-gray-400 hover:text-gray-600"
                                                    }`}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {evaluasiDataFilter.length > 0 && (
                        <div
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                            data-aos="fade-up"
                            data-aos-duration="800"
                            data-aos-delay="100"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-7 bg-primary rounded-full"></div>
                                    <h2 className="font-poppins-bold text-xl text-gray-800">
                                        Riwayat Evaluasi
                                    </h2>
                                </div>
                                <span className="font-poppins-medium text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                    {evaluasiDataFilter.length} Catatan
                                </span>
                            </div>

                            <div className="relative">
                                <div className="absolute left-6 top-0 bottom-0 w-px bg-linear-to-b from-primary via-gray-200 to-transparent hidden md:block"></div>

                                <div className="flex flex-col gap-5">
                                    {SortDescById(evaluasiDataFilter || []).map((item, index) => {
                                        const isDeleted = item.deleted_at !== null;
                                        return (
                                            <div
                                                key={item.id}
                                                className="md:pl-16 relative"
                                                data-aos="fade-left"
                                                data-aos-duration="600"
                                                data-aos-delay={index * 80}
                                            >
                                                <div className={`absolute left-4 top-6 w-4 h-4 rounded-full ring-2 hidden md:flex items-center justify-center ${isDeleted ? "bg-red-100 ring-red-300" : "bg-primary ring-primary"}`}>
                                                    <div className={`w-2 h-2 rounded-full ${isDeleted ? "bg-red-400" : "bg-white"}`}></div>
                                                </div>

                                                <div className={`rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${isDeleted ? "border-red-100 bg-red-50/40" : "border-green-100 bg-green-50/30"}`}>
                                                    <div className={`px-5 py-3 flex items-center justify-between border-b ${isDeleted ? "border-red-100 bg-red-50" : "border-green-100 bg-green-50"}`}>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`inline-flex items-center gap-1.5 text-xs font-poppins-semibold px-3 py-1 rounded-full ${isDeleted ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDeleted ? "bg-red-500" : "bg-primary"}`}></span>
                                                                {isDeleted ? "Dibatalkan" : "Aktif"}
                                                            </span>
                                                            <span className="text-xs font-poppins-regular text-gray-400">
                                                                #{evaluasiDataFilter.length - index}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs font-poppins-regular text-gray-400">
                                                            {new Date(item.created_at).toLocaleDateString("id-ID", {
                                                                day: "2-digit",
                                                                month: "long",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                    </div>

                                                    <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-5">
                                                        <div className="md:col-span-1">
                                                            <div className={`rounded-xl bg-linear-to-br ${getSkorBg(item.skor, isDeleted)} ring-2 ${getSkorRing(item.skor, isDeleted)} ring-opacity-30 p-5 flex flex-col items-center justify-center h-full min-h-28 gap-1`}>
                                                                <span className="text-xs font-poppins-medium text-gray-500 tracking-wide uppercase">
                                                                    Skor
                                                                </span>
                                                                <span className={`text-5xl font-poppins-bold leading-none ${getSkorColor(item.skor, isDeleted)}`}>
                                                                    {item.skor}
                                                                </span>
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <div className="h-1 rounded-full bg-gray-200 w-16 overflow-hidden">
                                                                        <div
                                                                            className={`h-full rounded-full transition-all duration-700 ${isDeleted ? "bg-red-400" : Number(item.skor) >= 80 ? "bg-primary" : Number(item.skor) >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
                                                                            style={{ width: `${item.skor}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-xs text-gray-400 font-poppins-regular">100</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="md:col-span-3 flex flex-col gap-4">
                                                            <div className="group">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className="w-2 h-2 rounded-full bg-secondary opacity-60"></div>
                                                                    <p className="text-xs font-poppins-semibold text-gray-500 uppercase tracking-wide">
                                                                        Temuan & Catatan Pemeriksaan
                                                                    </p>
                                                                </div>
                                                                <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                                                                    <p className="text-sm font-poppins-regular text-gray-700 leading-relaxed">
                                                                        {item.catatan || (
                                                                            <span className="text-gray-300 italic">Tidak ada catatan</span>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="group">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className="w-2 h-2 rounded-full bg-third opacity-60"></div>
                                                                    <p className="text-xs font-poppins-semibold text-gray-500 uppercase tracking-wide">
                                                                        Tindakan Korektif & Instruksi PPK
                                                                    </p>
                                                                </div>
                                                                <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                                                                    <p className="text-sm font-poppins-regular text-gray-700 leading-relaxed">
                                                                        {item.tindakan || (
                                                                            <span className="text-gray-300 italic">Tidak ada tindakan</span>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {isDeleted && (
                                                        <div className="px-5 py-2.5 bg-red-50 border-t border-red-100 flex items-center justify-end gap-2">
                                                            <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <p className="text-xs font-poppins-regular text-red-400">
                                                                Dibatalkan pada:{" "}
                                                                <span className="font-poppins-medium">
                                                                    {new Date(item.deleted_at).toLocaleDateString("id-ID", {
                                                                        day: "2-digit",
                                                                        month: "long",
                                                                        year: "numeric",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    })}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}