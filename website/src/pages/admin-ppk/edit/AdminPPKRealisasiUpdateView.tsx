/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import BackButton from '../../../ui/BackButton';
import ShowTableForm from '../../../ui/ShowTableForm';
import FormInput from '../../../ui/FormInput';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import WeekScheduleTable from '../../../ui/WeekScheduleTable';
import useRealisasiHooks from '../../../hooks/RealisasiHooks';
import RealizationModal from '../../../ui/RealizationModal';
import MapsShow from '../../../components/maps/MapsShow';

export default function AdminPPKRealisasiUpdateView() {
    const [showRealisasiModal, setShowRealisasiModal] = useState(false);
    const location = useLocation();
    const { id } = useParams();

    const { realisasiDataById, setSelectedId } = useRealisasiHooks();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (id) {
            setSelectedId(id)
        }
    }, [setSelectedId, id, location]);

    useEffect(() => {
        if (showRealisasiModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = "auto"
        }

    }, [showRealisasiModal]);

    if (loading || !realisasiDataById) {
        return <LoadingSpinner />
    }

    if (!user || user.role != "admin-ppk") {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {showRealisasiModal && (
                <RealizationModal
                    selectedSchedule={realisasiDataById as any}
                    setShowRealisasiModal={setShowRealisasiModal}
                    type='put'
                />
            )}

            <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
                <div className="max-w-7xl mx-auto">
                    <BackButton />
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
                            Lihat Realisasi Pekerjaan
                        </h1>

                        <div className="flex flex-col gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                                <ShowTableForm disabled={true} tenderCode={realisasiDataById?.schedule?.rab?.proyek?.nama} onClick={() => false} />

                                <FormInput
                                    title='Nama Proyek'
                                    placeholder='Masukkan nama proyek (otomatis)'
                                    value={realisasiDataById?.schedule?.rab?.proyek.nama}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Tahun Anggaran'
                                    placeholder='Masukkan tahun anggaran (otomatis)'
                                    value={realisasiDataById?.schedule?.rab?.proyek.tahun_anggaran}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kategori Proyek'
                                    placeholder='Masukkan kategori proyek (otomatis)'
                                    value={realisasiDataById?.schedule?.rab?.proyek.kategori}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kontraktor Pelaksana'
                                    placeholder='Masukkan kontrator pelaksana (otomatis)'
                                    value={realisasiDataById?.schedule?.rab?.proyek.kontraktor_pelaksana}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Konsultas Pengawas'
                                    placeholder='Masukkan konsultas pengawas (otomatis)'
                                    value={realisasiDataById?.schedule?.rab?.proyek.konsultas_pengawas}
                                    disabled={true}
                                />
                            </div>

                            {(realisasiDataById?.schedule?.rab?.proyek?.locations?.length || 0) > 0 && (
                                <MapsShow data={realisasiDataById!.schedule!.rab!.proyek.locations} />
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                                <FormInput
                                    title='Nilai Kontrak'
                                    placeholder='Masukkan nilai kontrak (otomatis)'
                                    value={realisasiDataById?.schedule?.rab?.proyek.nilai_kontrak}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Sumber Dana'
                                    placeholder='Masukkan nilai kontrak (otomatis)'
                                    value={realisasiDataById?.schedule?.rab?.proyek.nilai_kontrak}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kontraktor Pelaksana'
                                    placeholder='Masukkan kontraktor pelaksana (otomatis)'
                                    value={realisasiDataById?.schedule?.rab?.proyek.kontraktor_pelaksana}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Konsultas Pengawas'
                                    placeholder='Masukkan konsultas pengawas (otomatis)'
                                    value={realisasiDataById?.schedule?.rab?.proyek.konsultas_pengawas}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Waktu Pelaksanaan (Mulai)'
                                    placeholder='Masukkan waktu pelaksanaan (mulai)'
                                    value={realisasiDataById?.schedule?.tanggal_mulai}
                                    type='date'
                                    disabled={true}
                                />

                                <FormInput
                                    title='Waktu Pelaksanaan (Akhir)'
                                    placeholder='Masukkan waktu pelaksanaan (akhir)'
                                    value={realisasiDataById?.schedule?.tanggal_akhir}
                                    disabled={true}
                                    type='date'
                                />

                                <FormInput
                                    title='Program'
                                    placeholder='Masukkan program'
                                    value={realisasiDataById?.schedule?.rab?.program}
                                    disabled={true}
                                    type='textarea'
                                />
                            </div>
                        </div>
                    </div>

                    <WeekScheduleTable
                        totalMinggu={
                            Math.max(
                                ...(realisasiDataById?.schedule?.items?.map(
                                    (item: any) => item.weeks?.length || 0
                                ) ?? [0])
                            )
                        }
                        dataFile={realisasiDataById?.schedule?.items as any}
                        handleDeleteRow={null as any}
                        isRealization={true}
                        realizationData={realisasiDataById?.details}
                    />
                </div>
            </div>
        </div>
    );
}