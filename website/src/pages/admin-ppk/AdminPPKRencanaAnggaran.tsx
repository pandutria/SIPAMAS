/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TableContent from "../../ui/TableContent";
import TableHeader from "../../ui/TableHeader";
import { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import useRABHooks from "../../hooks/RABHooks";

export default function AdminPPKRencanaAnggaran() {
    const [tahun, setTahun] = useState('');
    const [search, setSearch] = useState('');

    const [selectPreview, setSelectPreview] = useState<any>(null);
    const { user, loading } = useAuth();
    const { 
        rabData,
        tahunData,
    } = useRABHooks();
    const [rabDataFilter, setRabDataFilter] = useState<RABProps[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const filteringDataRab = () => {
            const dataFilter = rabData?.filter((item: RABProps) => {
                const tahunFilter = tahun ? item?.proyek?.tahun_anggaran?.toString().includes(tahun) : true;
                const searchFilter = search ? item?.proyek?.nama?.toLowerCase().includes(search.toLowerCase()) : true;

                return tahunFilter && searchFilter;
            });

            setRabDataFilter(dataFilter as any);
        }

        filteringDataRab();
    }, [search, tahun, rabData]);

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
            key: 'proyek_id',
            label: 'ID Proyek'
        },
        {
            key: 'nama',
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
                navigate(`/admin-ppk/rencana-anggaran/lihat/${id}`);
            }
        }

        fetchPreview();
    }, [selectPreview, navigate]);

    if (loading) {
        return <LoadingSpinner/>
    }

    if (!user || user.role != "admin-ppk") {
        return <Navigate to="/" replace/>
    }

    return (
        <div>
            <Navbar/>

            <div className="lg:pt-24 pt-26" data-aos="fade-up" data-aos-duration="1000">
                <TableHeader 
                    title="Daftar Rencana Anggaran Biaya" 
                    tahunOptions={tahunData} 
                    searchValue={search}
                    onSearchChange={setSearch}
                    selectedTahun={tahun}
                    onTahunChange={setTahun}
                    showHapus={false}
                    showTambah={false}
                />
                <div className="p-6">
                    <TableContent
                        columns={columns}
                        data={rabDataFilter}
                        isSelect={true}
                        showEdit={false}
                        showPreview={true}
                        onPreview={(item) => setSelectPreview(item)} 
                    />
                </div>
            </div>
        </div>
    )
}
