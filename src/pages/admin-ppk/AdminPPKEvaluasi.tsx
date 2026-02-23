import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import TableHeader from "../../ui/TableHeader";
import TableContent from "../../ui/TableContent";
import { useEffect, useState } from "react";
import useRealisasiHooks from "../../hooks/RealisasiHooks";

export default function AdminPPKEvaluasi() {
    const [tahun, setTahun] = useState('');
    const [search, setSearch] = useState('');
    const [selectPreview, setSelectPreview] = useState<RealizationProps | null>(null);

    const navigate = useNavigate();
    const { realisasiData, tahunData } = useRealisasiHooks();
    const [projectIdentityFilter, setProjectIdentityFilter] = useState<RealizationProps[]>([]);
    const { user, loading } = useAuth();

    useEffect(() => {
        const filteringDataProjectIdentity = () => {
            const dataFilter = realisasiData?.filter((item: RealizationProps) => {
                const tahunFilter = tahun ? item?.schedule?.rab?.proyek?.tahun_anggaran.includes(tahun) : true;
                const searchFilter = search ? item?.schedule?.rab?.proyek?.nama.toLowerCase().includes(search.toLowerCase()) : true;

                return tahunFilter && searchFilter;
            });

            setProjectIdentityFilter(dataFilter);
        }

        const fetchShow = () => {
            if (selectPreview) {
                localStorage.setItem("realization_id", String(selectPreview.id));
                navigate(`/admin-ppk/evaluasi/lihat/${selectPreview.schedule.rab?.identitas_proyek_id}`);
            }
        }

        filteringDataProjectIdentity();
        fetchShow();
    }, [search, tahun, realisasiData, selectPreview, navigate]);

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
            label: 'Nama Proyek'
        },
        {
            key: 'lokasi',
            label: 'Lokasi Proyek'
        },
        {
            key: 'status',
            label: 'Status'
        },
    ];

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user || user.role != "admin-ppk") {
        return <Navigate to="/" replace />
    }
    return (
        <div>
            <Navbar />

            <div className="lg:pt-24 pt-26" data-aos="fade-up" data-aos-duration="1000">
                <TableHeader
                    title="Daftar Evaluasi Identitas Proyek"
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
                        data={projectIdentityFilter}
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
