/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { SwalMessage } from '../../../utils/SwalMessage';
import TableContent from '../../../ui/TableContent';
import BackButton from '../../../ui/BackButton';
import ShowTableForm from '../../../ui/ShowTableForm';
import FormInput from '../../../ui/FormInput';
import SubmitButton from '../../../ui/SubmitButton';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Navigate } from 'react-router-dom';
import TableHeader from '../../../ui/TableHeader';
import useScheduleHooks from '../../../hooks/ScheduleHooks';
import WeekScheduleTable from '../../../ui/WeekScheduleTable';
import useRealisasiHooks from '../../../hooks/RealisasiHooks';
import RealizationModal from '../../../ui/RealizationModal';

export default function PPKRealisasiAdd() {
    const [showTender, setShowTender] = useState(false);
    const [showRealisasiModal, setShowRealisasiModal] = useState(false);
    const [search, setSearch] = useState("");

    const [tenderDataFilter, setTenderDataFilter] = useState<ScheduleProps[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<ScheduleProps | null>(null);

    const { realisasiData } = useRealisasiHooks();
    const { scheduleData } = useScheduleHooks();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (showTender && !selectedSchedule) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = "auto"
        }
    }, [showTender, selectedSchedule]);

    useEffect(() => {
        if (showRealisasiModal) {
            document.body.style.overflow = 'hidden';            
        } else {
            document.body.style.overflow = "auto"
        }
    }, [showRealisasiModal]);

    useEffect(() => {
        const filteringDataTender = () => {
            const filter = scheduleData?.filter((item: ScheduleProps) => {
                const data = item?.rab?.data_entry?.kode_paket?.toLowerCase().includes(search.toLowerCase());
                const isExisting = realisasiData.some(
                    realization => realization?.schedule?.rab?.data_entry?.kode_paket == item?.rab?.data_entry.kode_paket
                );
                return data && !isExisting;
            });

            setTenderDataFilter(filter as any);
        }

        filteringDataTender();
    }, [search, realisasiData, scheduleData]);

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
    ];  

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user || user.role.name != "ppk") {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {showTender && (
                <div className="fixed inset-0 h-screen flex justify-center items-center bg-black/20 z-20">
                    <div className="bg-white p-4 rounded-lg flex flex-col max-w-[90vw] max-h-[70vh] gap-4 relative">
                        <div className="absolute top-4 right-4 cursor-pointer text-primary" onClick={() => setShowTender(false)}>
                            <X />
                        </div>
                        <TableHeader
                            title="Data Tender Dari Jadwal"
                            type='pokja'
                            showHapus={false}
                            showTambah={false}
                            searchValue={search}
                            onSearchChange={(item) => setSearch(item)}
                            showTahunQuery={false}
                        />
                        <div className="overflow-y-auto max-h-[70vh] w-full">
                            <TableContent
                                columns={columns}
                                data={tenderDataFilter}
                                isSelect={false}
                                showEdit={false}
                                showPreview={false}
                                showSelect={true}
                                idKey="id"
                                onSelectedDataChange={(item) => {
                                    setSelectedSchedule(item as any)
                                    setShowTender(false)
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showRealisasiModal && (
                <RealizationModal
                    selectedSchedule={selectedSchedule as any}
                    setShowRealisasiModal={setShowRealisasiModal}
                />
            )}

            <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
                <div className="max-w-7xl mx-auto">
                    <BackButton type='custom' link='/ppk/realisasi-pekerjaan'/>
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
                            Realisasi Pekerjaan
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                            <ShowTableForm tenderCode={selectedSchedule?.rab?.data_entry?.kode_paket?.toString()} onClick={() => {
                                setShowTender(true);
                                setSelectedSchedule(null);
                            }} />

                            <FormInput
                                title='Tahun Anggaran'
                                placeholder='Masukkan tahun anggaran (otomatis)'
                                value={selectedSchedule?.rab?.data_entry?.tahun_anggaran?.toString() as any}
                                disabled={true}
                            />

                            <FormInput
                                title='Satuan Kerja'
                                placeholder='Masukkan tahun satuan kerja (otomatis)'
                                value={selectedSchedule?.rab?.data_entry?.nama_paket?.toString()}
                                disabled={true}
                            />

                            <FormInput
                                title='Kode RUP'
                                placeholder='Masukkan tahun kode RUP (otomatis)'
                                value={selectedSchedule?.rab?.data_entry?.kode_rup?.toString()}
                                disabled={true}
                            />

                            <FormInput
                                title='Lokasi Pekerjaan'
                                placeholder='Masukkan lokasi pekerjaan (otomatis)'
                                value={selectedSchedule?.rab?.data_entry?.lokasi_pekerjaan?.toString()}
                                disabled={true}
                                type='textarea'
                            />

                            <FormInput
                                title='Program Kegiatan'
                                placeholder='Masukkan program kegiatan'
                                value={selectedSchedule?.rab?.program}
                                name='program'
                                disabled={true}
                            />

                            <FormInput
                                title='Kegiatan'
                                placeholder='Masukkan kegiatan'
                                value={selectedSchedule?.rab?.data_entry?.nama_paket?.toString()}
                                name='activity'
                                disabled={true}
                            />

                            <FormInput
                                title='Tanggal Awal'
                                placeholder='Masukkan tanggal awal'
                                value={selectedSchedule?.tanggal_mulai?.toString()}
                                name='start'
                                disabled={true}
                                type='date'
                            />

                            <FormInput
                                title='Tanggal Akhir'
                                placeholder='Masukkan tanggal akhir'
                                value={selectedSchedule?.tanggal_akhir?.toString()}
                                name='end'
                                disabled={true}
                                type='date'
                            />
                        </div>
                        <SubmitButton
                            text='Tambahkan Realisasi'
                            onClick={() => {
                                if (selectedSchedule) {
                                    setShowRealisasiModal(true)
                                } else {
                                    SwalMessage({
                                        type: "error",
                                        title: "Gagal!",
                                        text: "Harap pilih tender terlebih dahulu!"
                                    })
                                }
                            }}
                        />
                    </div>

                    {selectedSchedule && (
                        <WeekScheduleTable
                            totalMinggu={
                                Math.max(
                                    ...(selectedSchedule?.items?.map(
                                        (item: any) => item.schedule_weeks?.length || 0
                                    ) ?? [0])
                                )
                            }
                            dataFile={selectedSchedule?.items as any}
                            handleDeleteRow={null as any}
                            isRealization={true}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}