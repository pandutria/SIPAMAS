/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from '../../components/Navbar'
import TableHeader from '../../ui/TableHeader'
import TableContent from '../../ui/TableContent'
import { useEffect, useState } from 'react';
import usePengaduanHooks from '../../hooks/PengaduanHooks';
import SuperAdminModalLaporanDetail from './modal/SuperAdminModalLaporanDetail';
import SuperAdminModalUbahStatusLaporan from './modal/SuperAdminModalUbahStatusLaporan';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { Navigate } from 'react-router-dom';

function resolveStatus(raw: string): string {
    const s = raw.toLowerCase().trim().replace(/[_ ]/g, "");
    if (s.includes("terima")) return "Diterima";
    if (s.includes("proses")) return "Diproses";
    if (s.includes("selesai")) return "Selesai";
    if (s.includes("tolak")) return "Ditolak";
    return "Menunggu";
}

const statCards = [
    {
        key: "total",
        label: "Total Laporan",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        color: "text-gray-600",
        bg: "bg-gray-100",
        border: "border-gray-200",
        valueCls: "text-gray-800",
    },
    {
        key: "menunggu",
        label: "Menunggu",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        valueCls: "text-blue-700",
    },
    {
        key: "diterima",
        label: "Diterima",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-100",
        valueCls: "text-purple-700",
    },
    {
        key: "diproses",
        label: "Diproses",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        ),
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-100",
        valueCls: "text-orange-700",
    },
    {
        key: "selesai",
        label: "Selesai",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ),
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-100",
        valueCls: "text-green-700",
    },
    {
        key: "ditolak",
        label: "Ditolak",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-100",
        valueCls: "text-red-700",
    },
];

export default function SuperAdminManajemenLaporan() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const { pengaduanData } = usePengaduanHooks();
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalPreview, setShowModalPreview] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<PengaduanProps | null>(null);
    const [selectedPreview, setSelectedPreview] = useState<PengaduanProps | null>(null);
    const [pengaduanDataFilter, setPengaduanDataFIlter] = useState<PengaduanProps[]>([]);
    const { user, loading } = useAuth();

    useEffect(() => {
        if (selectedEdit) setShowModalEdit(true);
        if (selectedPreview) setShowModalPreview(true);

        const filtered = pengaduanData.filter((item) => {
            const matcheTitle = item.judul?.toLowerCase()?.includes(search.toLowerCase());
            const statusFilter = status ? item.status == status : true;
            return matcheTitle && statusFilter;
        });

        setPengaduanDataFIlter(filtered);
    }, [pengaduanData, search, status, selectedEdit, selectedPreview]);

    const stats = {
        total: pengaduanDataFilter.length,
        menunggu: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Menunggu").length,
        diterima: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Diterima").length,
        diproses: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Diproses").length,
        selesai: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Selesai").length,
        ditolak: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Ditolak").length,
    };

    const columns = [
        { key: "id", label: "No" },
        { key: "judul", label: "Judul Pengaduan" },
        { key: "kategori", label: "Kategori" },
        { key: "nama", label: "Nama Pelapor" },
        { key: "kontak", label: "Kontak" },
        { key: "status", label: "Status" },
    ];

    if (loading) return <LoadingSpinner />;
    if (!user || user.role != "super-admin") return <Navigate to="/" replace />;

    return (
        <div>
            <Navbar />

            <SuperAdminModalLaporanDetail
                isOpen={showModalPreview}
                onClose={() => { setShowModalPreview(false); setSelectedPreview(null); }}
                data={selectedPreview as any}
            />

            <SuperAdminModalUbahStatusLaporan
                isOpen={showModalEdit}
                onClose={() => { setShowModalEdit(false); setSelectedEdit(null); }}
                data={selectedEdit as any}
            />

            <div className="pt-28" data-aos="fade-up" data-aos-duration="1000">
                <TableHeader
                    title="Manajemen Laporan Pengaduan Masyarakat"
                    showTambah={false}
                    type="admin"
                    showTahunQuery={false}
                    searchValue={search}
                    showStatus={true}
                    selectedStatus={status}
                    onStatusChange={setStatus}
                    onSearchChange={(item) => setSearch(item)}
                />

                <div className="px-6 pb-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                        {statCards.map((card, i) => (
                            <div
                                key={card.key}
                                className={`bg-white rounded-2xl border ${card.border} shadow-sm px-4 py-4 flex items-center gap-3 hover:shadow-md transition-shadow duration-200`}
                                data-aos="fade-up"
                                data-aos-duration="500"
                                data-aos-delay={i * 60}
                            >
                                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                                    {card.icon}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-poppins-semibold text-gray-400 uppercase tracking-wider leading-tight truncate">
                                        {card.label}
                                    </p>
                                    <p className={`text-2xl font-poppins-bold ${card.valueCls} leading-tight`}>
                                        {stats[card.key as keyof typeof stats]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    <TableContent
                        columns={columns}
                        data={pengaduanDataFilter}
                        isSelect={false}
                        showEdit={true}
                        showPreview={true}
                        onEdit={setSelectedEdit}
                        onPreview={setSelectedPreview}
                    />
                </div>
            </div>
        </div>
    );
}