/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import Navbar from '../../../../components/Navbar';
import BackButton from '../../../../ui/BackButton';
import ShowTableForm from '../../../../ui/ShowTableForm';
import FormInput from '../../../../ui/FormInput';
import { useAuth } from '../../../../context/AuthContext';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import { Navigate, useParams } from 'react-router-dom';
import WeekScheduleTable from '../../../../ui/WeekScheduleTable';
import useRealisasiHooks from '../../../../hooks/RealisasiHooks';

export default function KepalaRealisasiView() {
    const { id } = useParams();
    const { realisasiDataById, setSelectedId } = useRealisasiHooks();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (id) {
            setSelectedId(id)
        }
    }, [setSelectedId, id]);

    if (loading || !realisasiDataById) {
        return <LoadingSpinner />
    }

    if (!user || (user.role.name != "kepala bagian" && user.role.name != "kepala biro")) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
                <div className="max-w-7xl mx-auto">
                    <BackButton />
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
                            Lihat Realisasi Pekerjaan
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                            <ShowTableForm tenderCode={realisasiDataById?.schedule?.rab?.data_entry?.kode_paket?.toString()} disabled={true} />

                            <FormInput
                                title='Tahun Anggaran'
                                placeholder='Masukkan tahun anggaran (otomatis)'
                                value={realisasiDataById?.schedule?.rab?.data_entry?.tahun_anggaran?.toString() as any}
                                disabled={true}
                            />

                            <FormInput
                                title='Satuan Kerja'
                                placeholder='Masukkan tahun satuan kerja (otomatis)'
                                value={realisasiDataById?.schedule?.rab?.data_entry?.nama_paket?.toString()}
                                disabled={true}
                            />

                            <FormInput
                                title='Kode RUP'
                                placeholder='Masukkan tahun kode RUP (otomatis)'
                                value={realisasiDataById?.schedule?.rab?.data_entry?.kode_rup?.toString()}
                                disabled={true}
                            />

                            <FormInput
                                title='Lokasi Pekerjaan'
                                placeholder='Masukkan lokasi pekerjaan (otomatis)'
                                value={realisasiDataById?.schedule?.rab?.data_entry?.lokasi_pekerjaan?.toString()}
                                disabled={true}
                                type='textarea'
                            />

                            <FormInput
                                title='Program Kegiatan'
                                placeholder='Masukkan program kegiatan'
                                value={realisasiDataById?.schedule?.rab?.program}
                                name='program'
                                disabled={true}
                            />

                            <FormInput
                                title='Kegiatan'
                                placeholder='Masukkan kegiatan'
                                value={realisasiDataById?.schedule?.rab?.data_entry?.nama_paket?.toString()}
                                name='activity'
                                disabled={true}
                            />

                            <FormInput
                                title='Tanggal Awal'
                                placeholder='Masukkan tanggal awal'
                                value={realisasiDataById?.schedule?.tanggal_mulai?.toString()}
                                name='start'
                                disabled={true}
                                type='date'
                            />

                            <FormInput
                                title='Tanggal Akhir'
                                placeholder='Masukkan tanggal akhir'
                                value={realisasiDataById?.schedule?.tanggal_akhir?.toString()}
                                name='end'
                                disabled={true}
                                type='date'
                            />
                        </div>                   
                    </div>

                    <WeekScheduleTable
                        totalMinggu={
                            Math.max(
                                ...(realisasiDataById?.schedule?.items?.map(
                                    (item: any) => item.schedule_weeks?.length || 0
                                ) ?? [0])
                            )
                        }
                        dataFile={realisasiDataById?.schedule?.items as any}
                        handleDeleteRow={null as any}
                        isRealization={true}
                        realizationData={realisasiDataById?.detail}
                    />
                </div>
            </div>
        </div>
    );
}