/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import TableContent from "../../../ui/TableContent";
import TableHeader from "../../../ui/TableHeader";
import { useEffect, useState } from 'react';
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../../ui/LoadingSpinner";
import useRealisasiHooks from "../../../hooks/RealisasiHooks";

export default function KepalaRealisasi() {
    const [tahun, setTahun] = useState('');
    const [satuanKerja, setSatuanKerja] = useState('');
    const [search, setSearch] = useState('');
    const [selectPreview, setSelectPreview] = useState<any>(null);
    const { user, loading } = useAuth();
    const { realisasiData, tahunData, satkerData } = useRealisasiHooks();
    const [scheduleDataFilter, setScheduleDataFilter] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const filteringDataRab = () => {
            const dataFilter = realisasiData?.filter((item) => {
                const tahunFilter = tahun ? item?.schedule?.rab?.data_entry?.tahun_anggaran?.toString().includes(tahun) : true;
                const searchFilter = search ? item?.schedule?.rab?.data_entry?.kode_paket?.toLowerCase().includes(search.toLowerCase()) : true;
                const satuanKerjaFilter = satuanKerja ? item?.schedule?.rab?.data_entry?.satuan_kerja?.toLowerCase().includes(satuanKerja.toLowerCase()) : true;

                return tahunFilter && searchFilter && satuanKerjaFilter;
            });

            setScheduleDataFilter(dataFilter as any);
        }

        filteringDataRab();
    }, [search, satuanKerja, tahun, realisasiData]);

    const columns = [
        {
            key: 'id',
            label: 'No'
        },
        {
            key: 'tahun_anggaran',
            label: 'Tahun Anggaran'
        },
        {
            key: 'satuan_kerja',
            label: 'Satuan Kerja'
        },
        {
            key: 'kode_rup',
            label: 'Kode RUP'
        },
        {
            key: 'kode_paket',
            label: 'kode Tender'
        },
        {
            key: 'nama_paket',
            label: 'Nama Paket'
        },
    ];

    useEffect(() => {
        const fetchPreview = () => {
            if (selectPreview) {
                const id = selectPreview?.id;
                navigate(`/kepala/realisasi-pekerjaan/lihat/${id}`);
            }
        }

        fetchPreview();
    }, [selectPreview, navigate]);

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user || (user.role.name != "kepala bagian" && user.role.name != "kepala biro")) {
        return <Navigate to="/" replace />
    }

    return (
        <div>
            <Navbar />

            <div className="lg:pt-32 pt-28" data-aos="fade-up" data-aos-duration="1000">
                <TableHeader
                    title="Daftar Realisasi Pelaksanaan"
                    tahunOptions={tahunData}
                    satuanKerjaOptions={satkerData}
                    searchValue={search}
                    onSearchChange={setSearch}
                    selectedTahun={tahun}
                    onTahunChange={setTahun}
                    selectedSatuanKerja={satuanKerja}
                    onSatuanKerjaChange={setSatuanKerja}
                    showHapus={false}
                    showTambah={false}
                />
                <div className="p-6">
                    <TableContent
                        columns={columns}
                        data={scheduleDataFilter}
                        isSelect={false}
                        showEdit={false}
                        showPreview={true}
                        onPreview={(item) => setSelectPreview(item)}
                    />
                </div>
            </div>
        </div>
    )
}
