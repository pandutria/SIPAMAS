/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import TableContent from "../../ui/TableContent";
import TableHeader from "../../ui/TableHeader";
import AdminTambahKelompokKerjaModal from "./modal/AdminTambahKelompokKerjaModal";
import AdminUbahKelompokKerjaModal from "./modal/AdminUbahKelompokKerjaModal";
import usePokjaGroupHooks from "../../hooks/PokjaGroupHooks";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function SuperAdminKelompokKerja() {
    const [selectedIds, setSelectedIds] = useState<any>([]);
    const [selectedEdit, setSelectedEdit] = useState<any>(null);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [search, setSearch] = useState('');
    const { pokjaGroup, handlePokjaGroupDelete } = usePokjaGroupHooks();
    const [pokjaGroupFilter, setPokjaGroupFilter] = useState<pokjaGroupProps[]>([]);
    const { user, loading } = useAuth();
    const columns = [
        {
            key: 'id',
            label: 'No'
        },
        {
            key: 'name',
            label: "Kelompok Kerja"
        },        
    ];

    useEffect(() => {
        const fetchEdit = () => {
            if (selectedEdit) {
                setShowModalEdit(true);
            }
        }

        const filteringPokjaGroups = () => {
            const filter = pokjaGroup?.filter((item: pokjaGroupProps) => {
                const dataFilter = search ? item.name.toLowerCase().includes(search.toLowerCase()) : true;
                return dataFilter;
            });

            setPokjaGroupFilter(filter);
        }

        fetchEdit();
        filteringPokjaGroups();
    }, [selectedEdit, search, pokjaGroup]);

    if (loading) {
        return <LoadingSpinner/>;
    }

    if (!user || user.role != "super-admin") {
        return <Navigate to="/" replace/>
    }
    
    return (
        <div>
            <Navbar/>
            <AdminTambahKelompokKerjaModal 
                isOpen={showModalAdd} 
                onClose={() => setShowModalAdd(false)}
            />
            <AdminUbahKelompokKerjaModal 
                isOpen={showModalEdit} 
                onClose={() => {
                        setShowModalEdit(false); 
                        setSelectedEdit(null);
                    }
                } 
                data={selectedEdit}
            />

            <div className="pt-28" data-aos="fade-up" data-aos-duration="1000">
                <TableHeader
                    title="Manajemen Kelompok Kerja"
                    showTambah={true}
                    showHapus={true}
                    type="pokja"
                    showTahunQuery={false}
                    searchValue={search}
                    onSearchChange={(item) => setSearch(item)}
                    onTambahClick={() => setShowModalAdd(true)}
                    onHapusClick={() => handlePokjaGroupDelete(selectedIds)}
                />
                <div className="p-6">
                    <TableContent
                        columns={columns}
                        data={pokjaGroupFilter}
                        isSelect={true}
                        showEdit={true}
                        showPreview={false}
                        showSelect={false}
                        onEdit={(item) => setSelectedEdit(item)}
                        onSelectedIdsChange={(ids) => setSelectedIds(ids)}
                    />
                </div>
            </div>
        </div>
    )
}
