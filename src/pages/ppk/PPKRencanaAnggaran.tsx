/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TableContent from "../../ui/TableContent";
import TableHeader from "../../ui/TableHeader";
import { useEffect, useState } from 'react';
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import useRABHooks from "../../hooks/RABHooks";
import FormInput from "../../ui/FormInput";
import { SwalMessage } from "../../utils/SwalMessage";

export default function PPKRencanaAnggaran() {
    const [tahun, setTahun] = useState('');
    const [satuanKerja, setSatuanKerja] = useState('');
    const [search, setSearch] = useState('');

    const [selectRevisi, setSelectRevisi] = useState<RABProps | null>(null);
    const [showRevisi, setShowRevisi] = useState(false);
    const [selectPreview, setSelectPreview] = useState<any>(null);
    const [selectedRemove, setSelectedRemove] = useState<number[]>([]);

    const { user, loading } = useAuth();
    const { 
        rabData,
        tahunData,
        satkerData,
        handleDeleteRab
    } = useRABHooks();
    const [rabDataFilter, setRabDataFilter] = useState<RABProps[]>([]);
    const [reason, setReason] = useState("");
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
                navigate(`/ppk/rencana-anggaran/lihat/${id}`, {
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

    if (!user || user.role.name != "ppk") {
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
                                    navigate(`/ppk/rencana-anggaran/ubah/${selectRevisi?.id}`);
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
                    showHapus={true}
                    onTambahClick={() => navigate("/ppk/rencana-anggaran/tambah")}
                    onHapusClick={() => handleDeleteRab(selectedRemove)}
                />
                <div className="p-6">
                    <TableContent
                        columns={columns}
                        data={rabDataFilter}
                        isSelect={true}
                        showEdit={true}
                        isRevisi={true}
                        showPreview={true}
                        onEdit={(item) => setSelectRevisi(item)}
                        onPreview={(item) => setSelectPreview(item)} 
                        onSelectedIdsChange={(item) => setSelectedRemove(item)}
                    />
                </div>
            </div>
        </div>
    )
}
