/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import TableHeader from "../../ui/TableHeader";
import TableContent from "../../ui/TableContent";
import { useEffect, useState } from "react";
import useProjectIdentity from "../../hooks/ProjectIdentity";

export default function AdminPPKIndentitasProyek() {
    const [tahun, setTahun] = useState('');
    const [search, setSearch] = useState('');
    const [selectEdit, setSelectEdit] = useState<any>(null);
    const [selectPreview, setSelectPreview] = useState<any>(null);

    const navigate = useNavigate();
    const { projectIdentityData, tahunData } = useProjectIdentity();
    const [projectIdentityFilter, setProjectIdentityFilter] = useState<ProjectIdentityProps[]>([]);
    const { user, loading } = useAuth();

    useEffect(() => {
        const filteringDataProjectIdentity = () => {
            const dataFilter = projectIdentityData?.filter((item: ProjectIdentityProps) => {
                const tahunFilter = tahun ? item?.tahun_anggaran?.toString().includes(tahun) : true;
                const searchFilter = search ? item?.nama?.toLowerCase().includes(search.toLowerCase()) : true;

                return tahunFilter && searchFilter;
            });

            setProjectIdentityFilter(dataFilter);
        }

        const fetchShow = () => {
            if (selectPreview) {
                navigate(`/admin-ppk/identitas-proyek/lihat/${selectPreview.id}`);
            }
        }

        filteringDataProjectIdentity();
        fetchShow();
    }, [search, tahun, projectIdentityData, selectEdit, selectPreview, navigate]);

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
            key: 'project_id',
            label: 'ID Proyek'
        },
        {
            key: 'nama',
            label: 'Nama Proyek'
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
                    title="Daftar Identitas Proyek"
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
                        onEdit={(item) => setSelectEdit(item)}
                        onPreview={(item) => setSelectPreview(item)}    
                    />
                </div>
            </div>
        </div>
    )
}
