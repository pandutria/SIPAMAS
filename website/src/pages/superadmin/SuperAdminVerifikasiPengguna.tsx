/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import TableContent from "../../ui/TableContent";
import TableHeader from "../../ui/TableHeader";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { Navigate } from "react-router-dom";
import useUserHooks from "../../hooks/UserHooks";
import SuperAdminUbahStatusPengguna from "./modal/SuperAdminUbahStatusPengguna";

export default function SuperAdminVerifikasiPengguna() {
    const [selectedEdit, setSelectedEdit] = useState<any>(null);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [search, setSearch] = useState("");
    const [listUserFilter, setListUserFilter] = useState<UserProps[]>([]);
    const { user, loading } = useAuth();
    const { listUser } = useUserHooks();

    const columns = [
        {
            key: 'id',
            label: 'No'
        },
        {
            key: 'fullname',
            label: "Nama Pengguna"
        },
        {
            key: 'email',
            label: "Email Pengguna"
        },
        {
            key: 'phone_number',
            label: 'Nomor Telepon'
        },
        {
            key: 'nik',
            label: 'NIK'
        },
        {
            key: 'status',
            label: "Status"
        },
    ];

    useEffect(() => {
        const fetchEdit = () => {
            if (selectedEdit) {
                setShowModalEdit(true);
            }
        }

        const filteringUserData = () => {   
            const dataFilter = listUser.filter((item: UserProps) => {
                const keyword = search.toLowerCase();
                const filter = search
                    ? [
                        item.fullname,
                        item.email,
                        item.role,
                    ]
                        .join(' ')
                        .toLowerCase()
                        .includes(keyword)
                    : true;
                const roleFilter = item.role == "masyarakat";
                const statusFilter = item.is_active == "false";

                return filter && roleFilter && statusFilter;
            });

            setListUserFilter(dataFilter);
        }

        fetchEdit();
        filteringUserData();
    }, [selectedEdit, listUser, search]);

    if (loading) {
        return <LoadingSpinner />
    }

    if (user?.role != "super-admin" || !user) {
        return <Navigate to="/" replace />
    }

    return (
        <div>
            <Navbar />
            <SuperAdminUbahStatusPengguna
                isOpen={showModalEdit}
                onClose={() => {
                    setShowModalEdit(false);
                    setSelectedEdit(null);
                }}
                data={selectedEdit}
            />

            <div className="pt-28" data-aos="fade-up" data-aos-duration="1000">
                <TableHeader
                    title="Verifikasi Akun Pengguna"
                    showTambah={false}
                    type="admin"
                    showTahunQuery={false}
                    searchValue={search}
                    onSearchChange={(item) => setSearch(item)}
                />
                <div className="p-6">
                    <TableContent
                        columns={columns}
                        data={listUserFilter}
                        isSelect={false}
                        showEdit={true}
                        showPreview={false}
                        onEdit={(item) => setSelectedEdit(item)}
                    />
                </div>
            </div>
        </div>
    )
}

