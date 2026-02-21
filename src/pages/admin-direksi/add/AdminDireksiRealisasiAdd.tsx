/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

export default function AdminDireksiRealisasiAdd() {
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
        const filteringDataProjectIdentity = () => {
            const filter = scheduleData?.filter((item: ScheduleProps) => {
                const data = item?.rab?.proyek?.nama?.toLowerCase().includes(search.toLowerCase());
                const isExisting = realisasiData.some(
                    realization => realization?.schedule?.rab?.proyek?.nama == item?.rab?.proyek.nama
                );
                return data && !isExisting;
            });

            setTenderDataFilter(filter as any);
        }

        filteringDataProjectIdentity();
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
            key: 'proyek_id',
            label: 'Satuan Kerja'
        },
        {
            key: 'nama',
            label: 'Nama Paket'
        },
    ];

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user || user.role != "admin-direksi") {
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
                    <BackButton type='custom' link='/admin-direksi/realisasi-pekerjaan' />
                    
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
                            Realisasi Pekerjaan
                        </h1>

                        <div className="flex flex-col gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                                <ShowTableForm tenderCode={selectedSchedule?.rab?.proyek?.nama} onClick={() => {
                                    setShowTender(true);
                                    setSelectedSchedule(null);
                                }} />

                                <FormInput
                                    title='Nama Proyek'
                                    placeholder='Masukkan nama proyek (otomatis)'
                                    value={selectedSchedule?.rab?.proyek.nama}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Tahun Anggaran'
                                    placeholder='Masukkan tahun anggaran (otomatis)'
                                    value={selectedSchedule?.rab?.proyek.tahun_anggaran}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kategori Proyek'
                                    placeholder='Masukkan kategori proyek (otomatis)'
                                    value={selectedSchedule?.rab?.proyek.kategori}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kontraktor Pelaksana'
                                    placeholder='Masukkan kontrator pelaksana (otomatis)'
                                    value={selectedSchedule?.rab?.proyek.kontraktor_pelaksana}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Konsultas Pengawas'
                                    placeholder='Masukkan konsultas pengawas (otomatis)'
                                    value={selectedSchedule?.rab?.proyek.konsultas_pengawas}
                                    disabled={true}
                                />
                            </div>

                            <MapPicker latitude={Number(selectedSchedule?.rab?.proyek.latitude)} longitude={Number(selectedSchedule?.rab?.proyek.longitude)} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                                <FormInput
                                    title='Provinsi'
                                    placeholder='Masukkan provinsi'
                                    value={selectedSchedule?.rab?.proyek.provinsi}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kabupaten/Kota'
                                    placeholder='Masukkan kabupaten/kota'
                                    value={selectedSchedule?.rab?.proyek.kabupaten}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kecamatan'
                                    placeholder='Masukkan kecamatan'
                                    value={selectedSchedule?.rab?.proyek.kecamatan}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kelurahan/Desa'
                                    placeholder='Masukkan kelurahan/desa'
                                    value={selectedSchedule?.rab?.proyek.kelurahan}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Nilai Kontrak'
                                    placeholder='Masukkan nilai kontrak (otomatis)'
                                    value={selectedSchedule?.rab?.proyek.nilai_kontrak}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Sumber Dana'
                                    placeholder='Masukkan nilai kontrak (otomatis)'
                                    value={selectedSchedule?.rab?.proyek.nilai_kontrak}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Kontraktor Pelaksana'
                                    placeholder='Masukkan kontraktor pelaksana (otomatis)'
                                    value={selectedSchedule?.rab?.proyek.kontraktor_pelaksana}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Konsultas Pengawas'
                                    placeholder='Masukkan konsultas pengawas (otomatis)'
                                    value={selectedSchedule?.rab?.proyek.konsultas_pengawas}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Waktu Pelaksanaan (Mulai)'
                                    placeholder='Masukkan waktu pelaksanaan (mulai)'
                                    value={selectedSchedule?.tanggal_mulai}
                                    type='date'
                                    disabled={true}
                                />

                                <FormInput
                                    title='Waktu Pelaksanaan (Akhir)'
                                    placeholder='Masukkan waktu pelaksanaan (akhir)'
                                    value={selectedSchedule?.tanggal_akhir}
                                    disabled={true}
                                    type='date'
                                />

                                <FormInput
                                    title='Program'
                                    placeholder='Masukkan program'
                                    value={selectedSchedule?.rab?.program}
                                    disabled={true}
                                    type='textarea'
                                />
                            </div>
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
                                        (item: any) => item.weeks?.length || 0
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