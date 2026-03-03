/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, MapPin as MapPinIcon, FileText, Image, DollarSign, FolderOpen, Trash2, MessageSquareWarning, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Navbar from "../../../components/Navbar";
import BackButton from "../../../ui/BackButton";
import FormInput from "../../../ui/FormInput";
import FormSelect from "../../../ui/FormSelect";
import FormUploadFile from "../../../ui/FormUploadFile";
import { useEffect, useState, useCallback } from "react";
import AdminDireksiTambahDokumentasiModal from "../modal/AdminDireksiTambahDokumentasiModal";
import AdminDireksiTambahDokumenModal from "../modal/AdminDireksiTambahDokumenModal";
import TableContent from "../../../ui/TableContent";
import TableHeader from "../../../ui/TableHeader";
import SubmitButton from "../../../ui/SubmitButton";
import useProjectIdentity from "../../../hooks/ProjectIdentity";
import LocationData from "../../../data/LocationData";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../../ui/LoadingSpinner";
import { BASE_URL_FILE } from "../../../server/API";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import maps from "/icon/maps.png";
import usePengaduanHooks from "../../../hooks/PengaduanHooks";
import { TahunData } from "../../../data/TahunData";

type PhotoType = "start" | "end";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
const DEFAULT_CENTER = { lat: -2.5489, lng: 118.0149 };

const statusConfig: Record<string, { label: string; badge: string; dot: string }> = {
    menunggu: { label: "Menunggu", badge: "bg-blue-100 text-blue-600 border border-blue-200", dot: "bg-blue-500" },
    diterima: { label: "Diterima", badge: "bg-purple-100 text-purple-600 border border-purple-200", dot: "bg-purple-500" },
    diproses: { label: "Diproses", badge: "bg-orange-100 text-orange-600 border border-orange-200", dot: "bg-orange-500" },
    selesai: { label: "Sudah Selesai", badge: "bg-green-100 text-green-600 border border-green-200", dot: "bg-green-500" },
    ditolak: { label: "Ditolak", badge: "bg-red-100 text-red-600 border border-red-200", dot: "bg-red-500" },
};

function resolveStatusKey(raw: string): string {
    const s = raw.toLowerCase().trim().replace(/[_ ]/g, "");
    if (s.includes("terima") || s === "diterima") return "diterima";
    if (s.includes("proses") || s.includes("diproses")) return "diproses";
    if (s.includes("selesai")) return "selesai";
    if (s.includes("tolak")) return "ditolak";
    return "menunggu";
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        if (data.status === "OK" && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        }
        return null;
    } catch {
        return null;
    }
}

interface GoogleMapPickerProps {
    coords: { lat: number; lng: number } | null;
    label: string;
}

function GoogleMapPicker({ coords, label }: GoogleMapPickerProps) {
    const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

    const customMarkerIcon: google.maps.Icon | undefined = isLoaded
        ? { url: maps, scaledSize: new window.google.maps.Size(36, 36), anchor: new window.google.maps.Point(18, 36) }
        : undefined;

    if (loadError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                <p className="text-sm text-gray-400 font-poppins-regular">Gagal memuat Google Maps</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                <p className="text-sm text-gray-400 font-poppins-regular">Memuat peta...</p>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={coords ?? DEFAULT_CENTER}
            zoom={coords ? 15 : 5}
            options={{ zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: false, scrollwheel: true }}
        >
            {coords && <Marker position={coords} title={label} icon={customMarkerIcon} />}
        </GoogleMap>
    );
}

function SectionHeader({ icon, title, badge }: { icon: React.ReactNode; title: string; badge?: number }) {
    return (
        <div className="flex items-center gap-3 mt-8 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {icon}
            </div>
            <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h2 className="font-poppins-bold text-xl text-gray-800">{title}</h2>
                {badge !== undefined && badge > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-[11px] font-poppins-bold">
                        {badge}
                    </span>
                )}
            </div>
        </div>
    );
}

function PengaduanCard({ item }: { item: PengaduanProps }) {
    const [expanded, setExpanded] = useState(false);
    const statusKey = resolveStatusKey(item.status ?? "menunggu");
    const statusCfg = statusConfig[statusKey] ?? statusConfig["menunggu"];
    const hasMedias = item.medias && item.medias.length > 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                            <MessageSquareWarning size={15} className="text-orange-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-poppins-bold text-[14px] text-gray-800 leading-snug truncate">
                                {item.judul ?? "Tanpa Judul"}
                            </p>
                            <p className="font-poppins-regular text-[11px] text-gray-400 mt-0.5">
                                #{item.id.toString().padStart(4, "0")} · {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-poppins-semibold px-2.5 py-1 rounded-full ${statusCfg.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                            {statusCfg.label}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    {item.kategori && (
                        <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                            <p className="text-[9px] font-poppins-semibold text-gray-400 uppercase tracking-wider mb-0.5">Kategori</p>
                            <p className="text-[12px] font-poppins-semibold text-gray-700">{item.kategori}</p>
                        </div>
                    )}
                    {item.created_by && (
                        <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                            <p className="text-[9px] font-poppins-semibold text-gray-400 uppercase tracking-wider mb-0.5">Pelapor</p>
                            <p className="text-[12px] font-poppins-semibold text-gray-700 truncate">
                                {(item.created_by as any).fullname ?? item.created_by.fullname ?? "—"}
                            </p>
                        </div>
                    )}
                </div>

                {item.deskripsi && (
                    <p className="font-poppins-regular text-[12px] text-gray-500 leading-relaxed line-clamp-2">
                        {item.deskripsi}
                    </p>
                )}
            </div>

            {hasMedias && (
                <>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full flex items-center justify-between px-5 py-2.5 bg-gray-50 border-t border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                    >
                        <span className="font-poppins-semibold text-[12px] text-gray-500">
                            {item.medias!.length} Lampiran Media
                        </span>
                        {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </button>

                    {expanded && (
                        <div className="px-5 pb-4 pt-3 border-t border-gray-100 bg-gray-50">
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {item.medias!.map((media) => {
                                    const src = typeof media.media_file === "string"
                                        ? `${BASE_URL_FILE}/${media.media_file}`
                                        : URL.createObjectURL(media.media_file as File);
                                    const isVideo = media.media_tipe === "video";
                                    return (
                                        <a
                                            key={media.id}
                                            href={src}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                                        >
                                            {isVideo ? (
                                                <video src={src} className="w-full h-full object-cover" muted />
                                            ) : (
                                                <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400" />
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                                                <ExternalLink size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                            </div>
                                            {isVideo && (
                                                <span className="absolute top-1 left-1 text-[8px] font-poppins-semibold bg-purple-100 text-purple-600 px-1 py-0.5 rounded-full">
                                                    Vid
                                                </span>
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default function AdminDireksiIdentitasProyekUpdateView() {
    const [showModalPhoto, setShowModalPhoto] = useState(false);
    const [showModalDocument, setShowModalDocument] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoType>("start");
    const [photoData, setPhotoData] = useState<Record<PhotoType, any[]>>({ start: [], end: [] });
    const [search, setSearch] = useState("");
    const [documentDataFilter, setDocumentDataFilter] = useState<any[]>([]);
    const [documentData, setDocumentData] = useState<any[]>([]);
    const [selectedRemove, setSelectedRemove] = useState<number[]>([]);
    const [geocoding, setGeocoding] = useState(false);
    const [pengaduanSearch, setPengaduanSearch] = useState("");
    const location = useLocation();
    const [isDisabled, setIsDisabled] = useState(false);

    const {
        handleChangeFile,
        handleChangeForm,
        handleProjectIdentityPut,
        projectIdentityForm,
        setProjectIdentityForm,
        projectIdentityByIdData,
        setSelectedProjectIdentityId,
        handleProjectIdentityPhotoDelete,
        handleProjectIdentityDocumentDelete,
    } = useProjectIdentity();

    const { pengaduanData } = usePengaduanHooks();
    const { kecamatanData, kelurahanData, setSelectedKecamatamCode } = LocationData();
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const { loading, user } = useAuth();
    const { id } = useParams();

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

    const proyekPengaduan = pengaduanData.filter((item) => {
        const matchProyek = item.identitas_proyek_id === Number(id);
        const matchSearch = item.judul?.toLowerCase().includes(pengaduanSearch.toLowerCase()) ?? true;
        return matchProyek && matchSearch;
    });

    const pengaduanStats = {
        total: proyekPengaduan.length,
        menunggu: proyekPengaduan.filter((i) => resolveStatusKey(i.status ?? "") === "menunggu").length,
        diproses: proyekPengaduan.filter((i) => resolveStatusKey(i.status ?? "") === "diproses").length,
        selesai: proyekPengaduan.filter((i) => resolveStatusKey(i.status ?? "") === "selesai").length,
        ditolak: proyekPengaduan.filter((i) => resolveStatusKey(i.status ?? "") === "ditolak").length,
    };

    useEffect(() => {
        document.body.style.overflow = showModalPhoto ? "hidden" : "auto";

        if (location.pathname.startsWith("/admin-direksi/identitas-proyek/lihat")) setIsDisabled(true);
        if (id) setSelectedProjectIdentityId(Number(id));

        if (projectIdentityByIdData) {
            setCoords({ lat: Number(projectIdentityByIdData.latitude), lng: Number(projectIdentityByIdData.longitude) });
            setPhotoData({
                start: projectIdentityByIdData.photos.filter((item) => item.type === "start"),
                end: projectIdentityByIdData.photos.filter((item) => item.type === "end"),
            });
            setDocumentData(projectIdentityByIdData.documents);
            setSelectedKecamatamCode(String(projectIdentityByIdData.kecamatan_kode));
        }

        const dataFiltering = documentData?.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
        setDocumentDataFilter(dataFiltering);
    }, [showModalPhoto, documentData, search, projectIdentityByIdData]);

    const buildAddressQuery = useCallback(() => {
        const parts = [
            projectIdentityForm.kelurahan,
            projectIdentityForm.kecamatan,
            projectIdentityForm.kabupaten,
            projectIdentityForm.provinsi,
            "Indonesia",
        ].filter(Boolean);
        return parts.join(", ");
    }, [projectIdentityForm.kelurahan, projectIdentityForm.kecamatan, projectIdentityForm.kabupaten, projectIdentityForm.provinsi]);

    useEffect(() => {
        if (isDisabled) return;
        const address = buildAddressQuery();
        if (!address || address === "Indonesia") return;

        const timeout = setTimeout(async () => {
            setGeocoding(true);
            const result = await geocodeAddress(address);
            if (result) setCoords(result);
            setGeocoding(false);
        }, 600);

        return () => clearTimeout(timeout);
    }, [buildAddressQuery, isDisabled]);

    const mapLabel = [
        projectIdentityForm.kelurahan,
        projectIdentityForm.kecamatan,
        projectIdentityForm.kabupaten,
    ].filter(Boolean).join(", ") || "Lokasi Proyek";

    if (loading || !projectIdentityByIdData) return <LoadingSpinner />;
    if (!user || user.role !== "admin-direksi") return <Navigate to="/" replace />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {showModalPhoto && (
                <AdminDireksiTambahDokumentasiModal
                    setShowModal={setShowModalPhoto}
                    type={selectedPhoto}
                    setPhotoData={setPhotoData}
                    isEdit={true}
                />
            )}

            {showModalDocument && (
                <AdminDireksiTambahDokumenModal
                    setShowModal={setShowModalDocument}
                    setDocumentData={setDocumentData}
                    isEdit={true}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16" data-aos="fade-up" data-aos-duration="1000">
                <BackButton type="custom" link="/admin-direksi/identitas-proyek" />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="font-poppins-bold text-2xl text-gray-800">
                            {isDisabled ? "Lihat" : "Ubah"} Identitas Proyek
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                        <FormInput disabled={isDisabled} value={projectIdentityForm.nama} name="nama" onChange={handleChangeForm} title="Nama Proyek" placeholder="Masukkan nama proyek" />
                        <FormSelect value={projectIdentityForm.tahun_anggaran} name="tahun_anggaran" onChange={handleChangeForm} title="Tahun Anggaran">
                            {TahunData?.map((item, index) => (
                                <option key={index} value={item.text}>{item.text}</option>
                            ))}
                        </FormSelect>

                        <FormSelect disabled={isDisabled} value={projectIdentityForm.kategori} name="kategori" onChange={handleChangeForm} title="Kategori Proyek">
                            {projectCategory.map((item, index) => (
                                <option key={index} value={item.text}>{item.text}</option>
                            ))}
                        </FormSelect>
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8" />

                    <SectionHeader icon={<MapPinIcon size={18} />} title="Lokasi & Koordinat Proyek" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                        <div className="flex flex-col gap-6">
                            <FormInput disabled={true} value={projectIdentityForm.provinsi} name="provinsi" onChange={handleChangeForm} title="Provinsi" placeholder="Masukkan provinsi" />
                            <FormInput disabled={true} value={projectIdentityForm.kabupaten} name="kabupaten" onChange={handleChangeForm} title="Kabupaten/Kota" placeholder="Masukkan kabupaten/kota" />
                            <FormSelect
                                disabled={isDisabled}
                                value={projectIdentityForm.kecamatan}
                                name="kecamatan"
                                title="Kecamatan"
                                onChange={(e) => {
                                    handleChangeForm(e);
                                    const selected = kecamatanData.find(item => item.name === e.target.value);
                                    setSelectedKecamatamCode(String(selected?.code));
                                    setProjectIdentityForm(prev => ({ ...prev, kelurahan: "", kecamatan_kode: String(selected?.code) }));
                                    setCoords(null);
                                }}
                            >
                                {kecamatanData.map((item, index) => (
                                    <option key={index} value={item.name}>{item.name}</option>
                                ))}
                            </FormSelect>
                            <FormSelect disabled={isDisabled} value={projectIdentityForm.kelurahan} name="kelurahan" onChange={handleChangeForm} title="Desa / Kelurahan">
                                {kelurahanData.map((item, index) => (
                                    <option key={index} value={item.name}>{item.name}</option>
                                ))}
                            </FormSelect>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="font-poppins-semibold text-[14px]">
                                Peta Lokasi (Google Maps) <span className="text-primary">*</span>
                            </p>
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="relative w-full h-64 bg-gray-100">
                                    {geocoding && (
                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-xl">
                                            <p className="text-sm text-gray-500 font-poppins-regular">Mencari lokasi...</p>
                                        </div>
                                    )}
                                    <GoogleMapPicker coords={coords} label={mapLabel} />
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
                            {!isDisabled && !geocoding && coords && (
                                <p className="text-xs font-poppins-regular text-green-500 flex items-center gap-1">
                                    <MapPinIcon size={11} />
                                    Koordinat otomatis terdeteksi dari wilayah yang dipilih
                                </p>
                            )}
                            {!isDisabled && !geocoding && !coords && (
                                <p className="text-xs font-poppins-regular text-gray-400 flex items-center gap-1">
                                    <MapPinIcon size={11} />
                                    Pilih Kecamatan dan Desa/Kelurahan untuk memperbarui koordinat
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8" />

                    <SectionHeader icon={<Image size={18} />} title="Dokumentasi Lapangan" />

                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="flex bg-white rounded-xl p-1 gap-1 border border-gray-100 shadow-sm">
                                {(["start", "end"] as PhotoType[]).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedPhoto(tab)}
                                        className={`font-poppins-semibold transition-all duration-300 flex-1 sm:flex-none px-4 py-2 cursor-pointer rounded-lg text-[13px] sm:text-[14px] ${selectedPhoto === tab ? "text-white bg-linear-to-r from-primary to-secondary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        {tab === "start" ? "Foto Lokasi Awal" : "Foto Lokasi Akhir"}
                                    </button>
                                ))}
                            </div>

                            {!isDisabled && (
                                <button
                                    onClick={() => setShowModalPhoto(true)}
                                    className="font-poppins-semibold w-full sm:w-fit text-white bg-linear-to-r from-primary to-secondary py-2.5 px-5 cursor-pointer hover:opacity-90 hover:scale-95 duration-300 rounded-xl text-[13px] sm:text-[14px] flex justify-center items-center gap-2 shadow-sm"
                                >
                                    <Plus size={16} />
                                    Tambahkan Sekarang
                                </button>
                            )}
                        </div>

                        {photoData[selectedPhoto].length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {photoData[selectedPhoto].map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        data-aos="fade-up"
                                        data-aos-delay={index * 50}
                                        className="group relative rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <a
                                            href={item.photo_file ? `${BASE_URL_FILE}/${item.photo_file}` : item.photo_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block overflow-hidden h-36 sm:h-40"
                                        >
                                            <img
                                                src={item.photo_file ? `${BASE_URL_FILE}/${item.photo_file}` : item.photo_file}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </a>

                                        {!isDisabled && (
                                            <button
                                                onClick={() => handleProjectIdentityPhotoDelete(item.id)}
                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        )}

                                        <div className="bg-white px-3 py-2.5">
                                            <p className="text-[12px] font-poppins-medium text-gray-700 line-clamp-2">{item.title}</p>
                                        </div>
                                    </div>
                                ))}

                                {!isDisabled && (
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
                                )}
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

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8" />

                    <SectionHeader icon={<DollarSign size={18} />} title="Nilai Kontrak & Pelaksanaan" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                        <FormInput disabled={isDisabled} value={projectIdentityForm.nilai_kontrak} name="nilai_kontrak" onChange={handleChangeForm} title="Nilai Proyek" placeholder="Masukkan nilai proyek" />
                        <FormSelect disabled={isDisabled} value={projectIdentityForm.sumber_dana} name="sumber_dana" onChange={handleChangeForm} title="Sumber Dana">
                            {sumberDanaOptions.map((item, index) => (
                                <option key={index} value={item.text}>{item.text}</option>
                            ))}
                        </FormSelect>
                        <FormInput disabled={isDisabled} value={projectIdentityForm.kontraktor_pelaksana} name="kontraktor_pelaksana" onChange={handleChangeForm} title="Kontraktor Pelaksana" placeholder="Masukkan kontraktor pelaksana" />
                        <FormInput disabled={isDisabled} value={projectIdentityForm.konsultas_pengawas} name="konsultas_pengawas" onChange={handleChangeForm} title="Konsultas Pengawas" placeholder="Masukkan konsultas pengawas" />
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8" />

                    <SectionHeader icon={<FileText size={18} />} title="Dokumen" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                        <FormUploadFile disabled={isDisabled} value={projectIdentityForm.kontrak_file} name="kontrak_file" onChange={handleChangeFile} title="Kontrak Kerja" />
                        <FormUploadFile disabled={isDisabled} value={projectIdentityForm.surat_perintah_file} name="surat_perintah_file" onChange={handleChangeFile} title="Surat Perintah Mulai Kerja (SPMK)" />
                        <FormUploadFile disabled={isDisabled} value={projectIdentityForm.surat_penunjukan_file} name="surat_penunjukan_file" onChange={handleChangeFile} title="Surat Penunjukan Penyedia Barang/Jasa (SPPBJ)" />
                        <FormUploadFile disabled={isDisabled} value={projectIdentityForm.berita_acara_file} name="berita_acara_file" onChange={handleChangeFile} title="Berita Acara Serah Terima (BAST/PHO/FHO)" />
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8" />

                    <SectionHeader icon={<FolderOpen size={18} />} title="Dokumen Pendukung" />

                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col gap-6">
                        <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 justify-between items-start lg:items-center">
                            <div className="flex flex-col gap-1">
                                <h3 className="font-poppins-semibold text-[16px] lg:text-[18px] text-gray-800">Dokumen Pendukung Lainnya</h3>
                                <p className="font-poppins-regular text-[12px] lg:text-[13px] text-gray-400">
                                    Addendum kontrak, jaminan pelaksanaan, jaminan pemeliharaan, dsb.
                                </p>
                            </div>

                            {!isDisabled && (
                                <button
                                    onClick={() => setShowModalDocument(true)}
                                    className="font-poppins-semibold w-full lg:w-fit text-white bg-linear-to-r from-primary to-secondary py-2.5 px-5 cursor-pointer hover:opacity-90 hover:scale-95 duration-300 rounded-xl text-[13px] sm:text-[14px] flex justify-center items-center gap-2 shadow-sm"
                                >
                                    <Plus size={16} />
                                    Tambahkan Sekarang
                                </button>
                            )}
                        </div>

                        {documentData.length > 0 ? (
                            <div>
                                <TableHeader
                                    showTitle={false}
                                    showHapus={!isDisabled}
                                    showTambah={false}
                                    showTahun={false}
                                    searchValue={search}
                                    onSearchChange={setSearch}
                                    onHapusClick={() => handleProjectIdentityDocumentDelete(selectedRemove)}
                                />
                                <TableContent
                                    columns={columns}
                                    data={documentDataFilter}
                                    showPreview={false}
                                    showEdit={false}
                                    isSelect={!isDisabled}
                                    onSelectedIdsChange={(item) => setSelectedRemove(item)}
                                    showDownload={true}
                                    downloadKey="photo_file"
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

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8" />

                    <SectionHeader
                        icon={<MessageSquareWarning size={18} />}
                        title="Laporan Pengaduan Terkait"
                        badge={pengaduanStats.total}
                    />

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={pengaduanSearch}
                                    onChange={(e) => setPengaduanSearch(e.target.value)}
                                    placeholder="Cari laporan..."
                                    className="w-full pl-9 pr-4 py-2.5 text-[13px] font-poppins-regular border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors duration-200"
                                />
                            </div>
                        </div>

                        {proyekPengaduan.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {proyekPengaduan.map((item, index) => (
                                    <div key={item.id} data-aos="fade-up" data-aos-delay={index * 60} data-aos-duration="400">
                                        <PengaduanCard item={item as any} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 gap-3 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                    <MessageSquareWarning size={28} className="text-gray-300" />
                                </div>
                                <p className="font-poppins-medium text-gray-400 text-[14px]">
                                    {pengaduanSearch ? "Tidak ada laporan yang cocok" : "Belum ada laporan pengaduan untuk proyek ini"}
                                </p>
                            </div>
                        )}
                    </div>

                    {!isDisabled && (
                        <div className="mt-8">
                            <SubmitButton text="Ubah Identitas Proyek" onClick={() => handleProjectIdentityPut(coords)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}