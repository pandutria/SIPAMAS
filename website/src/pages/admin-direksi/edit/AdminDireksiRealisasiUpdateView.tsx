/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { SwalMessage } from '../../../utils/SwalMessage';
import BackButton from '../../../ui/BackButton';
import ShowTableForm from '../../../ui/ShowTableForm';
import FormInput from '../../../ui/FormInput';
import SubmitButton from '../../../ui/SubmitButton';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import WeekScheduleTable from '../../../ui/WeekScheduleTable';
import useRealisasiHooks from '../../../hooks/RealisasiHooks';
import RealizationModal from '../../../ui/RealizationModal';
import L from "leaflet";
import maps from "/icon/maps.png";
import "leaflet/dist/leaflet.css";

const customIcon = L.icon({
    iconUrl: maps,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
});

function MapPicker({
    latitude,
    longitude
}: {
    latitude: number;
    longitude: number;
}) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            attributionControl: false,
        }).setView([-2.5489, 118.0149], 5);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        if (latitude || longitude) {
            markerRef.current = L.marker(
                [latitude, longitude],
                { icon: customIcon }
            ).addTo(map);
        }

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        };
    }, [latitude, longitude]);

    return (
        <div className="relative w-full h-80">
            <div ref={mapRef} className="w-full h-full rounded-lg z-0" />
        </div>
    );
}

export default function AdminDireksiRealisasiUpdateView() {
    const [showRealisasiModal, setShowRealisasiModal] = useState(false);
    const location = useLocation();
    const [isDisabled, setIsDisabled] = useState(false);
    const { id } = useParams();

    const { realisasiDataById, setSelectedId } = useRealisasiHooks();
    const { user, loading } = useAuth();

    useEffect(() => {
        const fetchIsCheckDisabled = () => {
            if (location.pathname.startsWith("/admin-direksi/realisasi-pekerjaan/lihat/")) {
                setIsDisabled(true)
            }
        }

        if (id) {
            setSelectedId(id)
        }

        fetchIsCheckDisabled();
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

    if (!user || user.role != "admin-direksi") {
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
                            {isDisabled ? "Lihat" : "Ubah"} Realisasi Pekerjaan
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

                            <MapPicker latitude={Number(realisasiDataById?.schedule?.rab?.proyek.latitude)} longitude={Number(realisasiDataById?.schedule?.rab?.proyek.longitude)} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                                <FormInput
                                    title='Provinsi'
                                    placeholder='Masukkan provinsi'
                                    value={realisasiDataById?.schedule?.rab?.proyek.provinsi}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kabupaten/Kota'
                                    placeholder='Masukkan kabupaten/kota'
                                    value={realisasiDataById?.schedule?.rab?.proyek.kabupaten}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kecamatan'
                                    placeholder='Masukkan kecamatan'
                                    value={realisasiDataById?.schedule?.rab?.proyek.kecamatan}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kelurahan/Desa'
                                    placeholder='Masukkan kelurahan/desa'
                                    value={realisasiDataById?.schedule?.rab?.proyek.kelurahan}
                                    disabled={true}
                                />

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

                        {!isDisabled && (
                            <SubmitButton
                                text='Tambah / Ubah Realisasi'
                                onClick={() => {
                                    if (realisasiDataById?.schedule) {
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
                        )}
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