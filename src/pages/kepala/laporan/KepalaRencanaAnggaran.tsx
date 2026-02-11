/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import TableContent from "../../../ui/TableContent";
import TableHeader from "../../../ui/TableHeader";
import { useEffect, useState } from 'react';
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../../ui/LoadingSpinner";
import useRABHooks from "../../../hooks/RABHooks";

export default function PPKRencanaAnggaran() {
    const [tahun, setTahun] = useState('');
    const [satuanKerja, setSatuanKerja] = useState('');
    const [search, setSearch] = useState('');
    const [selectPreview, setSelectPreview] = useState<any>(null);

    const { user, loading } = useAuth();
    const { 
        rabData,
        tahunData,
        satkerData,
    } = useRABHooks();
    const [rabDataFilter, setRabDataFilter] = useState<RABProps[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const filteringDataRab = () => {
            const dataFilter = rabData?.filter((item: RABProps) => {
                const tahunFilter = tahun ? item?.data_entry?.tahun_anggaran?.toString().includes(tahun) : true;
                const searchFilter = search ? item?.data_entry?.kode_paket?.toLowerCase().includes(search.toLowerCase()) : true;
                const satuanKerjaFilter = satuanKerja ? item.data_entry?.satuan_kerja?.toLowerCase().includes(satuanKerja.toLowerCase()) : true;

                return tahunFilter && searchFilter && satuanKerjaFilter;
            });

            setRabDataFilter(dataFilter as any);
        }

        filteringDataRab();
    }, [search, satuanKerja, tahun, rabData]);

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
        {
            key: 'alasan_count',
            label: 'Revisi'
        },
    ];

    useEffect(() => {
        const fetchPreview = () => {
            if (selectPreview) {
                const id = selectPreview?.id;
                navigate(`/kepala/rencana-anggaran/lihat/${id}`);
            }
        }

        fetchPreview();
    }, [selectPreview, navigate]);

    if (loading) {
        return <LoadingSpinner/>
    }

    if (!user || (user.role.name != "kepala bagian" && user.role.name != "kepala biro")) {
        return <Navigate to="/" replace/>
    }

    return (
        <div>
            <Navbar/>
           
            <div className="lg:pt-32 pt-28" data-aos="fade-up" data-aos-duration="1000">
                <TableHeader 
                    title="Daftar Rencana Anggaran Biaya" 
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
                        data={rabDataFilter}
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
