/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, MapPin as MapPinIcon, FileText, Image, DollarSign, FolderOpen } from "lucide-react";
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

function MapPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, { attributionControl: false }).setView([-2.5489, 118.0149], 5);

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
            <div ref={mapRef} className="w-full h-full rounded-xl z-0" />
            <div className="absolute bottom-0 right-0 w-full h-6 bg-white z-1000" />
        </div>
    );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-3 mt-8 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {icon}
            </div>
            <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h2 className="font-poppins-bold text-xl text-gray-800">{title}</h2>
            </div>
        </div>
    );
}

export default function AdminDireksiIdentitasProyekAdd() {
    const [showModalPhoto, setShowModalPhoto] = useState(false);
    const [showModalDocument, setShowModalDocument] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoType>("start");
    const [photoData, setPhotoData] = useState<Record<PhotoType, any[]>>({ start: [], end: [] });
    const [search, setSearch] = useState("");
    const [documentDataFilter, setDocumentDataFilter] = useState<any[]>([]);
    const [documentData, setDocumentData] = useState<any[]>([]);
    const [selectedRemove, setSelectedRemove] = useState<number[]>([]);

    const { handleChangeFile, handleChangeForm, handleProjectIdentityPost, projectIdentityForm, setProjectIdentityForm } = useProjectIdentity();
    const { kecamatanData, kelurahanData, setSelectedKecamatamCode } = LocationData();
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const { loading, user } = useAuth();

    const projectCategory = [
        { id: 1, text: "Keterlambatan" },
        { id: 2, text: "Kualitas" },
        { id: 3, text: "Dampak Sosial" },
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
        if (showModalPhoto) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        const dataFiltering = documentData.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
        setDocumentDataFilter(dataFiltering);
    }, [showModalPhoto, documentData, search]);

    const handleDeleteDocument = () => {
        setDocumentData(prev => prev.filter(item => !selectedRemove.includes(item.id)));
        setSelectedRemove([]);
    };

    if (loading) return <LoadingSpinner />;
    if (!user || user.role != "admin-direksi") return <Navigate to="/" replace />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

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

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16" data-aos="fade-up" data-aos-duration="1000">
                <BackButton type="custom" link="/admin-direksi/identitas-proyek" />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
                    <div className="flex items-center gap-3 mb-8">
                        <h1 className="font-poppins-bold text-2xl text-gray-800">Tambah Identitas Proyek</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                        <FormInput value={projectIdentityForm.nama} name="nama" onChange={handleChangeForm} title="Nama Proyek" placeholder="Masukkan nama proyek" />
                        <FormInput value={projectIdentityForm.tahun_anggaran} name="tahun_anggaran" onChange={handleChangeForm} title="Tahun Anggaran" placeholder="Masukkan tahun anggaran" />
                        <FormSelect value={projectIdentityForm.kategori} name="kategori" onChange={handleChangeForm} title="Kategori Proyek">
                            {projectCategory.map((item, index) => (
                                <option key={index} value={item.text}>{item.text}</option>
                            ))}
                        </FormSelect>
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8"></div>

                    <SectionHeader icon={<MapPinIcon size={18} />} title="Lokasi & Koordinat Proyek" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                        <div className="flex flex-col gap-6">
                            <FormInput disabled={true} value={projectIdentityForm.provinsi} name="provinsi" onChange={handleChangeForm} title="Provinsi" placeholder="Masukkan provinsi" />
                            <FormInput disabled={true} value={projectIdentityForm.kabupaten} name="kabupaten" onChange={handleChangeForm} title="Kabupaten/Kota" placeholder="Masukkan kabupaten/kota" />
                            <FormSelect
                                value={projectIdentityForm.kecamatan}
                                name="kecamatan"
                                title="Kecamatan"
                                onChange={(e) => {
                                    handleChangeForm(e);
                                    const name = e.target.value;
                                    const selected = kecamatanData.find(item => item.name === name);
                                    setSelectedKecamatamCode(selected?.code as any);
                                    setProjectIdentityForm(prev => ({
                                        ...prev,
                                        kelurahan: "",
                                        kecamatan_kode: String(selected?.code)
                                    }));
                                }}
                            >
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

                        <div className="flex flex-col gap-2">
                            <p className="font-poppins-semibold text-[14px]">
                                Peta Interaktif (GPS) <span className="text-primary">*</span>
                            </p>
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="relative w-full h-64 bg-gray-100">
                                    <MapPicker onLocationSelect={(lat, lng) => setCoords({ lat, lng })} />
                                </div>
                                <div className="grid grid-cols-2 border-t border-gray-200">
                                    <div className="flex flex-col p-4 border-r border-gray-200">
                                        <span className="text-xs font-poppins-medium text-gray-400">Latitude</span>
                                        <span className={`font-poppins-semibold text-sm mt-1 ${coords ? "text-primary" : "text-gray-300"}`}>
                                            {coords ? coords.lat.toFixed(6) : "0.000000"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col p-4">
                                        <span className="text-xs font-poppins-medium text-gray-400">Longitude</span>
                                        <span className={`font-poppins-semibold text-sm mt-1 ${coords ? "text-primary" : "text-gray-300"}`}>
                                            {coords ? coords.lng.toFixed(6) : "0.000000"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {!coords && (
                                <p className="text-xs font-poppins-regular text-gray-400 flex items-center gap-1">
                                    <MapPinIcon size={11} />
                                    Klik pada peta untuk menentukan koordinat lokasi proyek
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8"></div>

                    <SectionHeader icon={<Image size={18} />} title="Dokumentasi Lapangan" />

                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="flex bg-white rounded-xl p-1 gap-1 border border-gray-100 shadow-sm">
                                {(["start", "end"] as PhotoType[]).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedPhoto(tab)}
                                        className={`font-poppins-semibold transition-all duration-300 flex-1 sm:flex-none px-4 py-2 cursor-pointer rounded-lg text-[13px] sm:text-[14px] ${
                                            selectedPhoto === tab
                                                ? "text-white bg-linear-to-r from-primary to-secondary shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        {tab === "start" ? "Foto Lokasi Awal" : "Foto Lokasi Akhir"}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowModalPhoto(true)}
                                className="font-poppins-semibold w-full sm:w-fit text-white bg-linear-to-r from-primary to-secondary py-2.5 px-5 cursor-pointer hover:opacity-90 hover:scale-95 duration-300 rounded-xl text-[13px] sm:text-[14px] flex justify-center items-center gap-2 shadow-sm"
                            >
                                <Plus size={16} />
                                Tambahkan Sekarang
                            </button>
                        </div>

                        {photoData[selectedPhoto].length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {photoData[selectedPhoto].map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        data-aos="fade-up"
                                        data-aos-delay={index * 50}
                                        className="group rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="overflow-hidden h-36 sm:h-40">
                                            <img
                                                src={item.photo_file}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="bg-white px-3 py-2.5">
                                            <p className="text-[12px] font-poppins-medium text-gray-700 line-clamp-2">
                                                {item.title}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setShowModalPhoto(true)}
                                    className="group rounded-xl border-2 border-dashed border-gray-200 hover:border-primary min-h-44 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:bg-green-50 cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                                        <Plus size={20} className="text-gray-400 group-hover:text-primary transition-colors duration-300" />
                                    </div>
                                    <p className="text-[12px] font-poppins-medium text-gray-400 group-hover:text-primary transition-colors duration-300">
                                        Tambah Foto
                                    </p>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                    <Image size={28} className="text-gray-300" />
                                </div>
                                <p className="font-poppins-medium text-gray-400 text-[14px]">Belum ada foto diunggah</p>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8"></div>

                    <SectionHeader icon={<DollarSign size={18} />} title="Nilai Kontrak & Pelaksanaan" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                        <FormInput value={projectIdentityForm.nilai_kontrak} name="nilai_kontrak" onChange={handleChangeForm} title="Nilai Proyek" placeholder="Masukkan nilai proyek" />
                        <FormSelect value={projectIdentityForm.sumber_dana} name="sumber_dana" onChange={handleChangeForm} title="Sumber Dana">
                            {sumberDanaOptions.map((item, index) => (
                                <option key={index} value={item.text}>{item.text}</option>
                            ))}
                        </FormSelect>
                        <FormInput value={projectIdentityForm.kontraktor_pelaksana} name="kontraktor_pelaksana" onChange={handleChangeForm} title="Kontraktor Pelaksana" placeholder="Masukkan kontraktor pelaksana" />
                        <FormInput value={projectIdentityForm.konsultas_pengawas} name="konsultas_pengawas" onChange={handleChangeForm} title="Konsultas Pengawas" placeholder="Masukkan konsultas pengawas" />
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8"></div>

                    <SectionHeader icon={<FileText size={18} />} title="Dokumen" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                        <FormUploadFile name="kontrak_file" onChange={handleChangeFile} title="Kontrak Kerja" />
                        <FormUploadFile name="surat_perintah_file" onChange={handleChangeFile} title="Surat Perintah Mulai Kerja (SPMK)" />
                        <FormUploadFile name="surat_penunjukan_file" onChange={handleChangeFile} title="Surat Penunjukan Penyedia Barang/Jasa (SPPBJ)" />
                        <FormUploadFile name="berita_acara_file" onChange={handleChangeFile} title="Berita Acara Serah Terima (BAST/PHO/FHO)" />
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8"></div>

                    <SectionHeader icon={<FolderOpen size={18} />} title="Dokumen Pendukung" />

                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col gap-6">
                        <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 justify-between items-start lg:items-center">
                            <div className="flex flex-col gap-1">
                                <h3 className="font-poppins-semibold text-[16px] lg:text-[18px] text-gray-800">
                                    Dokumen Pendukung Lainnya
                                </h3>
                                <p className="font-poppins-regular text-[12px] lg:text-[13px] text-gray-400">
                                    Addendum kontrak, jaminan pelaksanaan, jaminan pemeliharaan, dsb.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModalDocument(true)}
                                className="font-poppins-semibold w-full lg:w-fit text-white bg-linear-to-r from-primary to-secondary py-2.5 px-5 cursor-pointer hover:opacity-90 hover:scale-95 duration-300 rounded-xl text-[13px] sm:text-[14px] flex justify-center items-center gap-2 shadow-sm"
                            >
                                <Plus size={16} />
                                Tambahkan Sekarang
                            </button>
                        </div>

                        {documentData.length > 0 ? (
                            <div>
                                <TableHeader
                                    showTitle={false}
                                    showHapus={true}
                                    showTambah={false}
                                    showTahun={false}
                                    searchValue={search}
                                    onSearchChange={setSearch}
                                    onHapusClick={handleDeleteDocument}
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
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                    <FolderOpen size={28} className="text-gray-300" />
                                </div>
                                <p className="font-poppins-medium text-gray-400 text-[14px]">Belum ada dokumen diunggah</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <SubmitButton text="Simpan Identitas Proyek" onClick={() => handleProjectIdentityPost(photoData, documentData, coords)} />
                    </div>
                </div>
            </div>
        </div>
    );
}