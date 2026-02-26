/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TableContent from "../../ui/TableContent";
import TableHeader from "../../ui/TableHeader";
import { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import useRealisasiHooks from "../../hooks/RealisasiHooks";

export default function AdminDireksiRealisasi() {
    const [tahun, setTahun] = useState('');
    const [search, setSearch] = useState('');
    const [selectRevisi, setSelectRevisi] = useState<RABProps | null>(null);
    const [selectPreview, setSelectPreview] = useState<any>(null);
    const { user, loading } = useAuth();
    const { realisasiData, tahunData } = useRealisasiHooks();
    const [scheduleDataFilter, setScheduleDataFilter] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const filteringDataSchedule = () => {
            const dataFilter = realisasiData?.filter((item) => {
                const tahunFilter = tahun ? item?.schedule?.rab?.proyek?.tahun_anggaran?.toString().includes(tahun) : true;
                const searchFilter = search ? item?.schedule?.rab?.proyek?.nama?.toLowerCase().includes(search.toLowerCase()) : true;

                return tahunFilter && searchFilter;
            });

            setScheduleDataFilter(dataFilter as any);
        }

        filteringDataSchedule();
    }, [search, tahun, realisasiData]);

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
            label: 'Satuan Kerja'
        },
        {
            key: 'nama',
            label: 'Nama Paket'
        },
    ];

    useEffect(() => {
        const fetchEdit = () => {
            if (selectRevisi) {
                const id = selectRevisi?.id;
                navigate(`/admin-direksi/realisasi-pekerjaan/ubah/${id}`);
            }
        }

        const fetchPreview = () => {
            if (selectPreview) {
                const id = selectPreview?.id;
                navigate(`/admin-direksi/realisasi-pekerjaan/lihat/${id}`);
            }
        }

        fetchEdit();
        fetchPreview();
    }, [selectRevisi, selectPreview, navigate]);

    if (loading) {
        return <LoadingSpinner/>
    }

    if (!user || user.role != "admin-direksi") {
        return <Navigate to="/" replace/>
    }

    return (
        <div>
            <Navbar/> 
 
            <div className="lg:pt-24 pt-26" data-aos="fade-up" data-aos-duration="1000">
                <TableHeader 
                    title="Daftar Realisasi Pelaksanaan" 
                    tahunOptions={tahunData}  
                    searchValue={search}
                    onSearchChange={setSearch}
                    selectedTahun={tahun}
                    onTahunChange={setTahun}
                    showHapus={false}
                    onTambahClick={() => navigate("/admin-direksi/realisasi-pekerjaan/tambah")}
                />
                <div className="p-6">
                    <TableContent
                        columns={columns}
                        data={scheduleDataFilter}
                        isSelect={false}
                        showEdit={true}
                        showPreview={true}
                        onEdit={(item) => setSelectRevisi(item)}
                        onPreview={(item) => setSelectPreview(item)} 
                    />
                </div>
            </div>
        </div>
    )
}
