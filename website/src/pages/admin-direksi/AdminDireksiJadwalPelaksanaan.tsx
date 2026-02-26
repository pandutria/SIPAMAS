/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TableContent from "../../ui/TableContent";
import TableHeader from "../../ui/TableHeader";
import { useEffect, useState } from 'react';
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import FormInput from "../../ui/FormInput";
import { SwalMessage } from "../../utils/SwalMessage";
import useScheduleHooks from "../../hooks/ScheduleHooks";

export default function AdminDireksiJadwalPelaksanaan() {
    const [tahun, setTahun] = useState('');
    const [search, setSearch] = useState('');
    const [selectRevisi, setSelectRevisi] = useState<RABProps | null>(null);
    const [showRevisi, setShowRevisi] = useState(false);
    const [selectPreview, setSelectPreview] = useState<any>(null);
    const { user, loading } = useAuth();
    const { scheduleData, tahunData, handleScheduleDelete } = useScheduleHooks();
    const [scheduleDataFilter, setScheduleDataFilter] = useState<any[]>([]);
    const [reason, setReason] = useState("");
    const navigate = useNavigate();
    const [selectedRemove, setSelectedRemove] = useState<number[]>([]);

    useEffect(() => {
        const filteringDataRab = () => {
            const dataFilter = scheduleData?.filter((item: ScheduleProps) => {
                const tahunFilter = tahun ? item?.rab?.proyek?.tahun_anggaran.toString().includes(tahun) : true;
                const searchFilter = search ? item?.rab?.proyek?.nama.toLowerCase().includes(search.toLowerCase()) : true;

                return tahunFilter && searchFilter;
            });

            setScheduleDataFilter(dataFilter as any);
        }

        filteringDataRab();
    }, [search, tahun, scheduleData]);

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
        const fetchEdit = () => {
            if (selectRevisi) {
                document.body.style.overflow = 'hidden';
                setShowRevisi(true);
            } else {
                document.body.style.overflow = 'auto';
                setShowRevisi(false)
            }
        }

        const fetchPreview = () => {
            if (selectPreview) {
                const id = selectPreview?.id;
                navigate(`/admin-direksi/jadwal-pelaksanaan/lihat/${id}`, {
                    state: {
                        reason: reason
                    }
                });
            }
        }

        fetchEdit();
        fetchPreview();
    }, [selectRevisi, selectPreview, navigate, reason]);

    if (loading) {
        return <LoadingSpinner/>
    }

    if (!user || user.role != "admin-direksi") {
        return <Navigate to="/" replace/>
    }

    return (
        <div>
            <Navbar/>

            {showRevisi && (
                <div className="bg-black/20 w-full h-screen fixed flex justify-center items-center z-40">
                    <div className="bg-white rounded-lg p-4 flex flex-col justify-center items-center w-100 gap-10 relative">
                        <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setSelectRevisi(null)}>
                            <X/>
                        </div>
                        <p className="font-poppins-medium text-[20px]">Komfirmasi Perubahan</p>
                        <div className="w-full">
                            <FormInput title="Alasan" placeholder="Alasan Kamu..." onChange={(e) => setReason(e.target.value)} value={reason}/>
                        </div>
                        <button 
                            onClick={() => {
                                if (reason) {
                                    localStorage.setItem("reason", reason);
                                    navigate(`/admin-direksi/jadwal-pelaksanaan/ubah/${selectRevisi?.id}`);
                                } else {
                                    SwalMessage({
                                        type: "error",
                                        title: "Gagal!",
                                        text: "Harap isi alasan terlebih dahulu!"
                                    });
                                }
                            }} 
                            className="px-6 w-full py-2 bg-primary hover:bg-transparent hover:text-primary border-2 border-primary cursor-pointer text-white font-poppins-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
                            Kirim
                        </button>
                    </div>
                </div>
            )}
 
            <div className="lg:pt-24 pt-26" data-aos="fade-up" data-aos-duration="1000">
                <TableHeader 
                    title="Daftar Jadwal Pelaksanaan" 
                    tahunOptions={tahunData} 
                    searchValue={search}
                    onSearchChange={setSearch}
                    selectedTahun={tahun}
                    onTahunChange={setTahun}
                    showHapus={true}
                    onHapusClick={() => handleScheduleDelete(selectedRemove)}
                    onTambahClick={() => navigate("/admin-direksi/jadwal-pelaksanaan/tambah")}
                />
                <div className="p-6">
                    <TableContent
                        columns={columns}
                        data={scheduleDataFilter}
                        isSelect={true}
                        showEdit={true}
                        showPreview={true}
                        isRevisi={true}
                        onSelectedIdsChange={(item) => setSelectedRemove(item)}                
                        onEdit={(item) => setSelectRevisi(item)}
                        onPreview={(item) => setSelectPreview(item)} 
                    />
                </div>
            </div>
        </div>
    )
}
