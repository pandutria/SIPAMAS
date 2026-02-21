/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus } from "lucide-react";
import Navbar from "../../../components/Navbar";
import BackButton from "../../../ui/BackButton";
import FormInput from "../../../ui/FormInput";
import FormSelect from "../../../ui/FormSelect";
import FormUploadFile from "../../../ui/FormUploadFile";
import { useEffect, useRef, useState } from "react";
import AdminDireksiTambahDokumentasiModal from "../modal/AdminDireksiTambahDokumentasiModal";
import AdminDireksiTambahDokumenModal from "../modal/AdminDireksiTambahDokumenModal";
import TableContent from "../../../ui/TableContent";
import TableHeader from "../../../ui/TableHeader";
import SubmitButton from "../../../ui/SubmitButton";
import L from "leaflet";
import maps from "/icon/maps.png";
import "leaflet/dist/leaflet.css";
import useProjectIdentity from "../../../hooks/ProjectIdentity";
import LocationData from "../../../data/LocationData";
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../../ui/LoadingSpinner";
import { Navigate } from "react-router-dom";

type PhotoType = "start" | "end";

const customIcon = L.icon({
    iconUrl: maps,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
});

function MapPicker({
    onLocationSelect,
}: {
    onLocationSelect: (lat: number, lng: number) => void;
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

        map.on("click", (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;

            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
            }

            onLocationSelect(lat, lng);
        });

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        };
    }, []);

    return (
        <div className="relative w-full h-full">
            <div ref={mapRef} className="w-full h-full rounded-lg z-0" />
            <div className="absolute bottom-0 right-0 w-full h-6 bg-white z-1000" />
        </div>
    );
}


export default function AdminDireksiIdentitasProyekAdd() {
    const [showModalPhoto, setShowModalPhoto] = useState(false);
    const [showModalDocument, setShowModalDocument] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoType>("start");
    const [photoData, setPhotoData] = useState<Record<PhotoType, any[]>>({
        start: [],
        end: []
    });
    const [search, setSearch] = useState("");
    const [documentDataFilter, setDocumentDataFilter] = useState<any[]>([]);
    const [documentData, setDocumentData] = useState<any[]>([]);
    const [selectedRemove, setSelectedRemove] = useState<number[]>([]);

    const {
        handleChangeFile,
        handleChangeForm,
        handleProjectIdentityPost,
        projectIdentityForm,
        setProjectIdentityForm
    } = useProjectIdentity();
    const { kecamatanData, kelurahanData, setSelectedKecamatamCode } = LocationData();
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const { loading, user } = useAuth();

    const projectCategory = [
        {
            id: 1,
            text: "Keterlambatan"
        },
        {
            id: 2,
            text: "Kualitas"
        },
        {
            id: 3,
            text: "Dampak Sosial"
        },
    ];

    const sumberDanaOptions = [
        { id: 1, text: "APBN" },
        { id: 2, text: "APB" },
        { id: 3, text: "APBD" },
    ];

    const columns = [
        { key: "id", label: "No" },
        { key: "name", label: "Nama Dokumen" },
        { key: "kategori", label: "Kategori" },
        { key: "created_at", label: "Tanggal Upload" },
    ];

    useEffect(() => {
        const fetchShow = () => {
            if (showModalPhoto) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = "auto";
            }
        }

        const fetchDocumentFilter = async () => {
            const dataFiltering = documentData.filter((item) => {
                return item.name.toLowerCase().includes(search.toLowerCase());
            });

            setDocumentDataFilter(dataFiltering);
        };

        fetchDocumentFilter();
        fetchShow();
    }, [showModalPhoto, documentData, search]);

    const handleDeleteDocument = () => {
        setDocumentData(prev => prev.filter(item => !selectedRemove.includes(item.id)));
        setSelectedRemove([]);
    };

    if (loading) {
        return <LoadingSpinner/>
    }

    if (!user || user.role != "admin-direksi") {
        return <Navigate to="/" replace/>
    }
    
    return (
        <div>
            <Navbar />

            <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
                <div className="max-w-7xl mx-auto">
                    <BackButton type='custom' link='/admin-direksi/identitas-proyek' />

                    {showModalPhoto && (
                        <AdminDireksiTambahDokumentasiModal
                            setShowModal={setShowModalPhoto}
                            type={selectedPhoto}
                            setPhotoData={setPhotoData}
                        />
                    )}

                    {showModalDocument && (
                        <AdminDireksiTambahDokumenModal
                            setShowModal={setShowModalDocument}
                            setDocumentData={setDocumentData}
                        />
                    )}

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
                            Tambah Identitas Proyek
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                            <FormInput value={projectIdentityForm.nama} name="nama" onChange={handleChangeForm} title='Nama Proyek' placeholder='Masukkan nama proyek' />
                            <FormInput value={projectIdentityForm.tahun_anggaran} name="tahun_anggaran" onChange={handleChangeForm} title='Tahun Anggaran' placeholder='Masukkan tahun anggaran' />
                            <FormSelect value={projectIdentityForm.kategori} name="kategori" onChange={handleChangeForm} title="Kategori Proyek">
                                {projectCategory.map((item, index) => (
                                    <option key={index} value={item.text}>{item.text}</option>
                                ))}
                            </FormSelect>
                        </div>

                        <h1 className="font-poppins-bold text-2xl mt-8 text-gray-800 mb-6">
                            Lokasi & Koordinat Proyek
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                            <div className="flex flex-col gap-6">
                                <FormInput disabled={true} value={projectIdentityForm.provinsi} name="provinsi" onChange={handleChangeForm} title='Provinsi' placeholder='Masukkan provinsi' />
                                <FormInput disabled={true} value={projectIdentityForm.kabupaten} name="kabupaten" onChange={handleChangeForm} title='Kabupaten/Kota' placeholder='Masukkan kabupaten/kota' />
                                <FormSelect value={projectIdentityForm.kecamatan} name="kecamatan" title="Kecamatan" onChange={(e) => {
                                    handleChangeForm(e);
                                    const name = e.target.value;
                                    const selected = kecamatanData.find(item => item.name === name);

                                    setSelectedKecamatamCode(selected?.code as any);
                                    setProjectIdentityForm(prev => ({
                                        ...prev,
                                        kelurahan: "",
                                        kecamatan_kode: String(selected?.code)
                                    }))
                                }}>
                                    {kecamatanData.map((item, index) => (
                                        <option key={index} value={item.name}>{item.name}</option>
                                    ))}
                                </FormSelect>

                                <FormSelect value={projectIdentityForm.kelurahan} name="kelurahan" onChange={handleChangeForm} title="Desa / Kelurahan">
                                    {kelurahanData.map((item, index) => (
                                        <option key={index} value={item.name}>{item.name}</option>
                                    ))}
                                </FormSelect>
                            </div>

                            <div className="flex flex-col gap-0">
                                <p className="font-poppins-semibold text-[14px] mb-2">Peta Interaktif (GPS) <span className="text-primary">*</span></p>

                                <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                                    <div className="relative w-full h-64 bg-gray-100">
                                        <MapPicker onLocationSelect={(lat, lng) => setCoords({ lat, lng })} />
                                    </div>

                                    <div className="grid grid-cols-2 border-t border-gray-200">
                                        <div className="flex flex-col p-4 border-r border-gray-200">
                                            <span className="text-xs text-gray-500">Latitude</span>
                                            <span className="font-semibold text-sm mt-1">
                                                {coords ? coords.lat.toFixed(6) : "0.00"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col p-4">
                                            <span className="text-xs text-gray-500">Longitude</span>
                                            <span className="font-semibold text-sm mt-1">
                                                {coords ? coords.lng.toFixed(6) : "0.00"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h1 className="font-poppins-bold text-2xl mt-8 text-gray-800 mb-6">
                            Dokumentasi Lapangan
                        </h1>

                        <div className="font-poppins-regular bg-white border-2 border-gray-200 rounded-md p-4 pb-10 flex flex-col gap-8">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedPhoto("start")}
                                        className={`font-poppins-semibold duration-200 flex-1 sm:flex-none ${selectedPhoto == "start" ? "text-white bg-linear-to-r from-primary to-secondary" : "text-primary border-2 border-primary"} py-2.5 px-3 sm:py-3 sm:px-4 cursor-pointer rounded-md text-[13px] sm:text-[14px]`}
                                    >
                                        Foto Lokasi Awal
                                    </button>
                                    <button
                                        onClick={() => setSelectedPhoto("end")}
                                        className={`font-poppins-semibold duration-200 flex-1 sm:flex-none ${selectedPhoto == "end" ? "text-white bg-linear-to-r from-primary to-secondary" : "text-primary border-2 border-primary"} py-2.5 px-3 sm:py-3 sm:px-4 cursor-pointer rounded-md text-[13px] sm:text-[14px]`}
                                    >
                                        Foto Lokasi Akhir
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowModalPhoto(true)}
                                    className='font-poppins-semibold w-full sm:w-fit text-white bg-linear-to-r from-primary to-secondary py-2.5 sm:py-3 px-4 cursor-pointer hover:scale-95 duration-300 hover:opacity-95 rounded-md text-[13px] sm:text-[14px] flex justify-center items-center gap-2'
                                >
                                    <Plus size={18} />
                                    Tambahkan Sekarang
                                </button>
                            </div>

                            {photoData[selectedPhoto].length > 0 ? (
                                <div className="flex items-start gap-4 overflow-x-auto scrollbar-hidden pb-2">
                                    {photoData[selectedPhoto].map((item: any, index: number) => (
                                        <div
                                            key={index}
                                            className="flex flex-col shrink-0 gap-3 rounded-lg border-2 border-gray-200 w-56 sm:w-70"
                                        >
                                            <img
                                                src={item.photo_file}
                                                className="w-full object-cover rounded-t-lg h-36 sm:h-40"
                                            />
                                            <p className="mx-3 mb-3 text-[13px] sm:text-[14px] font-poppins-medium line-clamp-2">
                                                {item.title}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center font-poppins-medium text-[14px] sm:text-[16px] text-gray-400 py-6">
                                    Belum ada data yang diunggah
                                </p>
                            )}
                        </div>

                        <h1 className="font-poppins-bold text-2xl mt-8 text-gray-800 mb-6">
                            Nilai Kontrak & Pelaksanaan
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                            <FormInput value={projectIdentityForm.nilai_kontrak} name="nilai_kontrak" onChange={handleChangeForm} title='Nilai Proyek' placeholder='Masukkan nilai proyek' />
                            <FormSelect value={projectIdentityForm.sumber_dana} name="sumber_dana" onChange={handleChangeForm} title="Sumber Dana">
                                {sumberDanaOptions.map((item, index) => (
                                    <option key={index} value={item.text}>{item.text}</option>
                                ))}
                            </FormSelect>
                            <FormInput value={projectIdentityForm.kontraktor_pelaksana} name="kontraktor_pelaksana" onChange={handleChangeForm} title='Kontraktor Pelaksana' placeholder='Masukkan kontraktor pelaksana' />
                            <FormInput value={projectIdentityForm.konsultas_pengawas} name="konsultas_pengawas" onChange={handleChangeForm} title='Konsultas Pengawas' placeholder='Masukkan konsultas pengawas' />
                        </div>

                        <h1 className="font-poppins-bold text-2xl mt-8 text-gray-800 mb-6">
                            Dokumen
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                            <FormUploadFile name="kontrak_file" onChange={handleChangeFile} title="Kontrak Kerja" />
                            <FormUploadFile name="surat_perintah_file" onChange={handleChangeFile} title="Surat Perintah Mulai Kerja (SPMK)" />
                            <FormUploadFile name="surat_penunjukan_file" onChange={handleChangeFile} title="Surat Penunjukan Penyedia Barang/Jasa (SPPBJ)" />
                            <FormUploadFile name="berita_acara_file" onChange={handleChangeFile} title="Berita Acara Serah Terima (BAST/PHO/FHO)" />
                        </div>

                        <h1 className="font-poppins-bold text-2xl mt-8 text-gray-800 mb-6">
                            Dokumen Pendukung
                        </h1>

                        <div className="font-poppins-regular bg-white border-2 border-gray-200 rounded-md p-4 pb-10 flex flex-col gap-12">
                            <div className="flex lg:flex-row flex-col lg:gap-0 gap-6 justify-between items-center">
                                <div className="flex flex-col gap-2">
                                    <h1 className="font-poppins-semibold lg:text-[20px] text-[16px]">Dokumen Pendukung Lainnya</h1>
                                    <p className="font-poppins-medium lg:text-[14px] text-[12px] text-gray-400">Addendum kontrak, jaminan pelaksanaan, jaminan pemeliharaan, dsb.</p>
                                </div>
                                <button onClick={() => setShowModalDocument(true)} className='font-poppins-semibold w-full sm:w-fit text-white bg-linear-to-r from-primary to-secondary py-2.5 sm:py-3 px-4 cursor-pointer hover:scale-95 duration-300 hover:opacity-95 rounded-md text-[13px] sm:text-[14px] flex justify-center items-center gap-2'>
                                    <Plus />
                                    Tambahkan Sekarang
                                </button>
                            </div>

                            {documentData.length > 0 ? (
                                <div className="-mt-8">
                                    <TableHeader
                                        showTitle={false}
                                        showHapus={true}
                                        showTambah={false}
                                        showTahun={false}
                                        searchValue={search}
                                        onSearchChange={setSearch}
                                        onHapusClick={() => handleDeleteDocument()}
                                    />

                                    <TableContent
                                        columns={columns}
                                        data={documentDataFilter}
                                        showPreview={false}
                                        showEdit={false}
                                        isSelect={true}
                                        onSelectedIdsChange={(item) => setSelectedRemove(item)}
                                    />
                                </div>
                            ) : (
                                <p className="text-center font-poppins-medium text-[16px] text-gray-400">
                                    Belum ada data yang diunggah
                                </p>
                            )}
                        </div>

                        <SubmitButton text='Simpan Identitas Proyek' onClick={() => handleProjectIdentityPost(photoData, documentData, coords)} />
                    </div>
                </div>
            </div>
        </div>
    );
}