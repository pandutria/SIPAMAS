/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from '../../components/Navbar'
import TableHeader from '../../ui/TableHeader'
import TableContent from '../../ui/TableContent'
import { useEffect, useState } from 'react';
import usePengaduanHooks from '../../hooks/PengaduanHooks';
import SuperAdminModalLaporanDetail from './modal/SuperAdminModalLaporanDetail';

export default function SuperAdminManajemenLaporan() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const { pengaduanData } = usePengaduanHooks();
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalPreview, setShowModalPreview] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<PengaduanProps | null>(null);
    const [selectedPreview, setSelectedPreview] = useState<PengaduanProps | null>(null);
    const [pengaduanDataFilter, setPengaduanDataFIlter] = useState<PengaduanProps[]>([]);

    useEffect(() => {
        const fetchEdit = () => {
            if (selectedEdit) {
                setShowModalEdit(true);
            }
        }

        const fetchPreview = () => {
            if (selectedPreview) {
                setShowModalPreview(true);
            }
        }

        const fetchPengaduan = async () => {
            const filtered = pengaduanData.filter((item) => {
                const matcheTitle = item.judul?.toLowerCase()?.includes(search.toLowerCase());
                const statusFilter = status ? item.status == status : true;
                return matcheTitle && statusFilter;
            });

            setPengaduanDataFIlter(filtered);
        }

        fetchPengaduan();
        fetchEdit();
        fetchPreview();
    }, [pengaduanData, search, status, selectedEdit, selectedPreview]);

    const columns = [
        {
            key: "id",
            label: "No"
        },
        {
            key: "judul",
            label: "Judul Pengaduan"
        },
        {
            key: "kategori",
            label: "Kategori"
        },
        {
            key: "kontak",
            label: "Kontak"
        },
        {
            key: "status",
            label: "Status"
        },
    ];

    return (
        <div>
            <Navbar />

            <SuperAdminModalLaporanDetail
                isOpen={showModalPreview}
                onClose={() => {
                    setShowModalPreview(false)
                    setSelectedPreview(null)
                }}
                data={selectedPreview as any}
            />

            <div className="pt-28" data-aos="fade-up" data-aos-duration="1000">
                <TableHeader
                    title="Manajemen Laporan"
                    showTambah={false}
                    type="admin"
                    showTahunQuery={false}
                    searchValue={search}
                    showStatus={true}
                    selectedStatus={status}
                    onStatusChange={setStatus}
                    onSearchChange={(item) => setSearch(item)}
                />
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
    )
}
