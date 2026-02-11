/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TableContent from "../../ui/TableContent";
import TableHeader from "../../ui/TableHeader";
import { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import useDataEntryHooks from "../../hooks/DataEntryHooks";

export default function PokjaLaporanPenjabatPengadaan() {
    const [search, setSearch] = useState('');
    const [selectEdit, setSelectEdit] = useState<DataEntryProps | null>(null);
    const [selectPreview, setSelectPreview] = useState<any>(null);
    const [selectedRemove, setSelectedRemove] = useState<any[]>([]);
    const [dataTable, setDataTable] = useState<any[]>([]);
    const { user, loading } = useAuth();
    const { dataEntryPengadaan, handleDataEntryPengadaanDelete } = useDataEntryHooks();
    const navigate = useNavigate();

    const columns = [
        {
            key: 'id',
            label: 'No'
        },
        {
            key: 'kode_paket',
            label: 'Kode Tender'
        },
        {
            key: 'kode_rup',
            label: 'Kode RUP'
        },
        {
            key: 'nama_paket',
            label: 'Nama Paket'
        },
        {
            key: 'tanggal_masuk',
            label: 'Tanggal Masuk/Perubahan'
        },
        {
            key: 'metode_pengadaan',
            label: 'Metode Pengadaan'
        },
    ];

    useEffect(() => {
        const fetchEdit = () => {
            if (selectEdit) {
                const id = selectEdit?.id;
                navigate(`/pokja/data-entry-penjabat-pengadaan/ubah/${id}`);
            }
        }

        const fetchPreview = () => {
            if (selectPreview) {
                const id = selectPreview?.id;
                navigate(`/pokja/data-entry-penjabat-pengadaan/lihat/${id}`);
            }
        }

        const filteringDataEntryPengadaan = () => {
            const filter = dataEntryPengadaan?.filter((item: DataEntryProps) => {
                const filterType = item?.tipe?.includes("Penjabat");
                const dataFilter = search ? item?.kode_paket?.toLowerCase().includes(search.toLowerCase()) : true;
                return dataFilter && filterType;
            });

            setDataTable(filter);
        }

        fetchEdit();
        fetchPreview();
        filteringDataEntryPengadaan();
    }, [selectEdit, selectPreview, navigate, search, dataEntryPengadaan]);

    if (loading) {
        return <LoadingSpinner/>
    }

    if (!user || user.role.name != "pokja/pp") {
        return <Navigate to="/" replace/>
    }

    return (
        <div>
            <Navbar/>

            <div className="lg:pt-32 pt-28" data-aos="fade-up" data-aos-duration="1000">
                <TableHeader
                    title="Daftar Laporan Pejabat Pengadaan"
                    showHapus={true}
                    type="pokja"
                    onHapusClick={() => handleDataEntryPengadaanDelete(selectedRemove)}
                    onTambahClick={() => navigate("/pokja/data-entry-penjabat-pengadaan/tambah")}
                    searchValue={search}
                    showTahunQuery={false}
                    onSearchChange={(item) => setSearch(item)}
                />
                <div className="p-6">
                    <TableContent
                        columns={columns}
                        data={dataTable}
                        isSelect={true}
                        showEdit={true}
                        showPreview={true}
                        onEdit={(item) => setSelectEdit(item)}
                        onPreview={(item) => setSelectPreview(item)}
                        onSelectedIdsChange={(item) => setSelectedRemove(item)}
                    />
                </div>
            </div>
        </div>
    )
}

