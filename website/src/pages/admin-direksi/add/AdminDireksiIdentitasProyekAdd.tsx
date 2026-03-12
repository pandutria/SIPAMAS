/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, MapPin as MapPinIcon, FileText, Image, DollarSign, FolderOpen, CheckCircle2, Navigation, X, Search } from "lucide-react";
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
import useProjectIdentity from "../../../hooks/ProjectIdentity";
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../../ui/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import maps from "/icon/maps.png";
import { TahunData } from "../../../data/TahunData";

type PhotoType = "start" | "end";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
const DEFAULT_CENTER = { lat: -2.5489, lng: 118.0149 };
const LIBRARIES: ("places")[] = ["places"];

async function reverseGeocode(lat: number, lng: number): Promise<{
    alamat: string;
    provinsi: string;
    kabupaten: string;
    kecamatan: string;
    kelurahan: string;
} | null> {
    try {
        const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}&language=id`
        );
        const data = await res.json();
        if (data.status !== "OK" || !data.results.length) return null;

        const components = data.results[0].address_components as google.maps.GeocoderAddressComponent[];
        const get = (type: string) =>
            components.find((c) => c.types.includes(type))?.long_name ?? "";

        return {
            alamat: data.results[0].formatted_address,
            kelurahan: get("administrative_area_level_4") || get("sublocality_level_1") || get("locality"),
            kecamatan: get("administrative_area_level_3"),
            kabupaten: get("administrative_area_level_2"),
            provinsi: get("administrative_area_level_1"),
        };
    } catch {
        return null;
    }
}

interface ClickableMapProps {
    pendingCoords: { lat: number; lng: number } | null;
    onMapClick: (coords: { lat: number; lng: number }) => void;
}

function ClickableMap({ pendingCoords, onMapClick }: ClickableMapProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const customMarkerIcon: google.maps.Icon | undefined = isLoaded
        ? {
            url: maps,
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 40),
        }
        : undefined;

    const onAutocompleteLoad = (ac: google.maps.places.Autocomplete) => {
        setAutocomplete(ac);
    };

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry?.location) {
                onMapClick({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
                setSearchValue(place.formatted_address ?? place.name ?? "");
            }
        }
    };

    if (loadError) return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-sm text-gray-400 font-poppins-regular">Gagal memuat Google Maps</p>
        </div>
    );

    if (!isLoaded) return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400 font-poppins-regular">Memuat peta...</p>
            </div>
        </div>
    );

    return (
        <div className="relative w-full h-full">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-md">
                <Autocomplete
                    onLoad={onAutocompleteLoad}
                    onPlaceChanged={onPlaceChanged}
                    options={{ componentRestrictions: { country: "id" } }}
                >
                    <div className="relative flex items-center">
                        <Search
                            size={15}
                            className="absolute left-3 text-gray-400 pointer-events-none"
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Cari lokasi..."
                            className="
                                w-full pl-9 pr-9 py-2.5 rounded-xl
                                bg-white/95 backdrop-blur-sm
                                border border-gray-200 shadow-md
                                font-poppins-regular text-[13px] text-gray-700
                                placeholder:text-gray-400
                                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                transition-all duration-200
                            "
                        />
                        {searchValue && (
                            <button
                                onClick={() => setSearchValue("")}
                                className="absolute right-3 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </Autocomplete>
            </div>

            <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={pendingCoords ?? DEFAULT_CENTER}
                zoom={pendingCoords ? 15 : 5}
                onClick={(e) => {
                    if (e.latLng) onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                }}
                options={{
                    mapTypeId: "roadmap",
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    scrollwheel: true,
                    draggableCursor: "crosshair",
                }}
            >
                {pendingCoords && (
                    <Marker
                        position={pendingCoords}
                        icon={customMarkerIcon}
                        animation={window.google?.maps?.Animation?.DROP}
                    />
                )}
            </GoogleMap>
        </div>
    );
}

interface MiniMapProps {
    coords: { lat: number; lng: number };
    label: string;
}

function MiniMap({ coords, label }: MiniMapProps) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    const customMarkerIcon: google.maps.Icon | undefined = isLoaded
        ? {
            url: maps,
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 30),
        }
        : undefined;

    if (!isLoaded) return <div className="w-full h-full bg-gray-100 animate-pulse" />;

    return (
        <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={coords}
            zoom={14}
            options={{
                disableDefaultUI: true,
                gestureHandling: "none",
                zoomControl: false,
                draggable: false,
            }}
        >
            <Marker position={coords} title={label} icon={customMarkerIcon} />
        </GoogleMap>
    );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-3 mt-8 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {icon}
            </div>
            <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h2 className="font-poppins-bold text-xl text-gray-800">{title}</h2>
            </div>
        </div>
    );
}

interface LocationCardProps {
    location: ProjectIdentityLocationProps;
    index: number;
    onRemove: (index: number) => void;
    isRemoving: boolean;
}

function LocationCard({ location, index, onRemove, isRemoving }: LocationCardProps) {
    const coords =
        location.latitude && location.longitude
            ? { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }
            : null;

    const label = [location.kelurahan, location.kecamatan, location.kabupaten].filter(Boolean).join(", ");

    return (
        <div
            className={`
                group relative rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden
                transition-all duration-500
                ${isRemoving ? "opacity-0 scale-95 -translate-y-2" : "opacity-100 scale-100 translate-y-0"}
                hover:shadow-md hover:-translate-y-0.5
            `}
            style={{ animation: "locationSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
        >
            <style>{`
                @keyframes locationSlideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>

            <div className="h-36 relative overflow-hidden">
                {coords ? (
                    <MiniMap coords={coords} label={label} />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <MapPinIcon size={24} className="text-gray-300" />
                    </div>
                )}
                <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-poppins-semibold text-[11px] text-gray-700">Lokasi {index + 1}</span>
                </div>
                <button
                    onClick={() => onRemove(index)}
                    className="
                        absolute top-2.5 right-2.5
                        w-7 h-7 rounded-full flex items-center justify-center
                        bg-red-500 text-white shadow-md
                        opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100
                        transition-all duration-200 hover:bg-red-600 active:scale-90
                    "
                >
                    <X size={12} />
                </button>
            </div>

            <div className="p-3.5 flex flex-col gap-2.5">
                <div>
                    <p className="font-poppins-semibold text-[12px] text-gray-800 line-clamp-1">
                        {location.kelurahan || "—"}, {location.kecamatan || "—"}
                    </p>
                    <p className="font-poppins-regular text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                        {location.kabupaten}, {location.provinsi}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-poppins-medium text-gray-400 uppercase tracking-wider">Latitude</span>
                        <span className="font-poppins-semibold text-[11px] text-primary mt-0.5">
                            {coords ? coords.lat.toFixed(6) : "—"}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-poppins-medium text-gray-400 uppercase tracking-wider">Longitude</span>
                        <span className="font-poppins-semibold text-[11px] text-primary mt-0.5">
                            {coords ? coords.lng.toFixed(6) : "—"}
                        </span>
                    </div>
                </div>
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

    const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [pendingAddress, setPendingAddress] = useState<{
        alamat: string; provinsi: string; kabupaten: string; kecamatan: string; kelurahan: string;
    } | null>(null);
    const [reversing, setReversing] = useState(false);

    const [locations, setLocations] = useState<ProjectIdentityLocationProps[]>([]);
    const [removingIndex, setRemovingIndex] = useState<number | null>(null);
    const [addSuccess, setAddSuccess] = useState(false);

    const { handleChangeFile, handleChangeForm, handleProjectIdentityPost, projectIdentityForm } = useProjectIdentity();
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
        document.body.style.overflow = showModalPhoto ? "hidden" : "auto";
        const dataFiltering = documentData.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
        setDocumentDataFilter(dataFiltering);
    }, [showModalPhoto, documentData, search]);

    const handleMapClick = async (coords: { lat: number; lng: number }) => {
        setPendingCoords(coords);
        setPendingAddress(null);
        setReversing(true);
        const result = await reverseGeocode(coords.lat, coords.lng);
        setPendingAddress(result);
        setReversing(false);
    };

    const handleClearPending = () => {
        setPendingCoords(null);
        setPendingAddress(null);
    };

    const handleAddLocation = () => {
        if (!pendingCoords) return;

        const newLocation: ProjectIdentityLocationProps = {
            id: Date.now(),
            identitas_proyek_id: 0,
            alamat: pendingAddress?.alamat ?? "",
            provinsi: pendingAddress?.provinsi ?? "",
            kabupaten: pendingAddress?.kabupaten ?? "",
            kecamatan: pendingAddress?.kecamatan ?? "",
            kelurahan: pendingAddress?.kelurahan ?? "",
            latitude: String(pendingCoords.lat),
            longitude: String(pendingCoords.lng),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setLocations(prev => [...prev, newLocation]);
        setAddSuccess(true);
        setTimeout(() => setAddSuccess(false), 2000);
        setPendingCoords(null);
        setPendingAddress(null);
    };

    const handleRemoveLocation = (index: number) => {
        setRemovingIndex(index);
        setTimeout(() => {
            setLocations(prev => prev.filter((_, i) => i !== index));
            setRemovingIndex(null);
        }, 400);
    };

    const handleRemovePhoto = (type: PhotoType, index: number) => {
        setPhotoData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    const handleDeleteDocument = () => {
        setDocumentData(prev => prev.filter(item => !selectedRemove.includes(item.id)));
        setSelectedRemove([]);
    };

    const canAdd = pendingCoords && !reversing;

    if (loading) return <LoadingSpinner />;
    if (!user || user.role !== "admin-direksi") return <Navigate to="/" replace />;

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
                        <FormSelect value={projectIdentityForm.tahun_anggaran} name="tahun_anggaran" onChange={handleChangeForm} title="Tahun Anggaran">
                            {TahunData?.map((item, index) => (
                                <option key={index} value={item.text}>{item.text}</option>
                            ))}
                        </FormSelect>
                        <FormSelect value={projectIdentityForm.kategori} name="kategori" onChange={handleChangeForm} title="Kategori Proyek">
                            {projectCategory?.map((item, index) => (
                                <option key={index} value={item.text}>{item.text}</option>
                            ))}
                        </FormSelect>
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8" />

                    <SectionHeader icon={<MapPinIcon size={18} />} title="Lokasi & Koordinat Proyek" />

                    <div className="flex flex-col gap-6">
                        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-2">
                                    <Navigation size={15} className="text-primary" />
                                    <p className="font-poppins-semibold text-[14px] text-gray-700">Tambah Titik Lokasi Baru</p>
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5">
                                        <Search size={12} className="text-blue-500" />
                                        <span className="font-poppins-medium text-[11px] text-blue-500">Cari atau klik peta untuk menentukan lokasi</span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                                style={{ height: "380px" }}
                            >
                                <ClickableMap pendingCoords={pendingCoords} onMapClick={handleMapClick} />
                            </div>

                            {(pendingCoords || reversing) && (
                                <div
                                    className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden"
                                    style={{ animation: "fadeSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
                                >
                                    <style>{`
                                        @keyframes fadeSlideUp {
                                            from { opacity: 0; transform: translateY(10px); }
                                            to   { opacity: 1; transform: translateY(0); }
                                        }
                                    `}</style>

                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${reversing ? "bg-amber-400 animate-pulse" : "bg-green-400"}`} />
                                            <span className="font-poppins-semibold text-[12px] text-gray-700">
                                                {reversing ? "Mendeteksi alamat..." : "Titik lokasi dipilih"}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleClearPending}
                                            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-400 flex items-center justify-center text-gray-400 transition-all duration-200"
                                        >
                                            <X size={11} />
                                        </button>
                                    </div>

                                    <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-poppins-medium text-gray-400 uppercase tracking-wider">Latitude</span>
                                            <span className="font-poppins-semibold text-[13px] text-primary">
                                                {pendingCoords?.lat.toFixed(6)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-poppins-medium text-gray-400 uppercase tracking-wider">Longitude</span>
                                            <span className="font-poppins-semibold text-[13px] text-primary">
                                                {pendingCoords?.lng.toFixed(6)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-poppins-medium text-gray-400 uppercase tracking-wider">Kecamatan</span>
                                            <span className={`font-poppins-semibold text-[12px] transition-all duration-300 ${reversing ? "text-gray-300" : "text-gray-700"}`}>
                                                {reversing ? "Memuat..." : (pendingAddress?.kecamatan || "—")}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-poppins-medium text-gray-400 uppercase tracking-wider">Kabupaten</span>
                                            <span className={`font-poppins-semibold text-[12px] transition-all duration-300 ${reversing ? "text-gray-300" : "text-gray-700"}`}>
                                                {reversing ? "Memuat..." : (pendingAddress?.kabupaten || "—")}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 col-span-2">
                                            <span className="text-[10px] font-poppins-medium text-gray-400 uppercase tracking-wider">Kelurahan / Desa</span>
                                            <span className={`font-poppins-semibold text-[12px] transition-all duration-300 ${reversing ? "text-gray-300" : "text-gray-700"}`}>
                                                {reversing ? "Memuat..." : (pendingAddress?.kelurahan || "—")}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 col-span-2">
                                            <span className="text-[10px] font-poppins-medium text-gray-400 uppercase tracking-wider">Provinsi</span>
                                            <span className={`font-poppins-semibold text-[12px] transition-all duration-300 ${reversing ? "text-gray-300" : "text-gray-700"}`}>
                                                {reversing ? "Memuat..." : (pendingAddress?.provinsi || "—")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div>
                                    {locations.length > 0 && (
                                        <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1">
                                            <MapPinIcon size={12} className="text-primary" />
                                            <span className="font-poppins-semibold text-[12px] text-primary">
                                                {locations.length} lokasi ditambahkan
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleAddLocation}
                                    disabled={!canAdd}
                                    className={`
                                        font-poppins-semibold flex items-center gap-2 py-2.5 px-5 rounded-xl text-[13px]
                                        transition-all duration-300
                                        ${canAdd
                                            ? "text-white bg-linear-to-r from-primary to-secondary shadow-sm hover:opacity-90 hover:scale-95 cursor-pointer"
                                            : "text-gray-400 bg-gray-100 cursor-not-allowed"
                                        }
                                    `}
                                >
                                    {addSuccess ? (
                                        <>
                                            <CheckCircle2
                                                size={15}
                                                style={{ animation: "scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
                                            />
                                            Lokasi Ditambahkan!
                                            <style>{`
                                                @keyframes scaleIn {
                                                    from { transform: scale(0) rotate(-45deg); opacity: 0; }
                                                    to   { transform: scale(1) rotate(0deg); opacity: 1; }
                                                }
                                            `}</style>
                                        </>
                                    ) : (
                                        <>
                                            <MapPinIcon size={15} />
                                            Tambah ke Daftar Lokasi
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {locations.length > 0 && (
                            <div data-aos="fade-up" data-aos-duration="500">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-5 bg-primary rounded-full" />
                                        <p className="font-poppins-semibold text-[15px] text-gray-700">Daftar Lokasi Proyek</p>
                                    </div>
                                    <span className="font-poppins-regular text-[12px] text-gray-400">
                                        {locations.length} titik lokasi
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {locations.map((loc, index) => (
                                        <LocationCard
                                            key={loc.id}
                                            location={loc}
                                            index={index}
                                            onRemove={handleRemoveLocation}
                                            isRemoving={removingIndex === index}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8" />

                    <SectionHeader icon={<Image size={18} />} title="Dokumentasi Lapangan" />

                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="flex bg-white rounded-xl p-1 gap-1 border border-gray-100 shadow-sm">
                                {(["start", "end"] as PhotoType[])?.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedPhoto(tab)}
                                        className={`font-poppins-semibold transition-all duration-300 flex-1 sm:flex-none px-4 py-2 cursor-pointer rounded-lg text-[13px] sm:text-[14px] ${selectedPhoto === tab
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
                                {photoData[selectedPhoto]?.map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        data-aos="fade-up"
                                        data-aos-delay={index * 50}
                                        className="group rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <button
                                            onClick={() => handleRemovePhoto(selectedPhoto, index)}
                                            className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 hover:bg-red-600"
                                        >
                                            <X size={12} />
                                        </button>
                                        <div className="overflow-hidden h-36 sm:h-40">
                                            <img src={item.photo_file} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="bg-white px-3 py-2.5">
                                            <p className="text-[12px] font-poppins-medium text-gray-700 line-clamp-2">{item.title}</p>
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
                                    <p className="text-[12px] font-poppins-medium text-gray-400 group-hover:text-primary transition-colors duration-300">Tambah Foto</p>
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

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8" />

                    <SectionHeader icon={<DollarSign size={18} />} title="Nilai Kontrak & Pelaksanaan" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                        <FormInput value={projectIdentityForm.nilai_kontrak} name="nilai_kontrak" onChange={handleChangeForm} title="Nilai Proyek" placeholder="Masukkan nilai proyek" />
                        <FormSelect value={projectIdentityForm.sumber_dana} name="sumber_dana" onChange={handleChangeForm} title="Sumber Dana">
                            {sumberDanaOptions?.map((item, index) => (
                                <option key={index} value={item.text}>{item.text}</option>
                            ))}
                        </FormSelect>
                        <FormInput value={projectIdentityForm.kontraktor_pelaksana} name="kontraktor_pelaksana" onChange={handleChangeForm} title="Kontraktor Pelaksana" placeholder="Masukkan kontraktor pelaksana" />
                        <FormInput value={projectIdentityForm.konsultas_pengawas} name="konsultas_pengawas" onChange={handleChangeForm} title="Konsultas Pengawas" placeholder="Masukkan konsultas pengawas" />
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mt-8" />

                    <SectionHeader icon={<FileText size={18} />} title="Dokumen" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                        <FormUploadFile name="kontrak_file" onChange={handleChangeFile} title="Kontrak Kerja" />
                        <FormUploadFile name="surat_perintah_file" onChange={handleChangeFile} title="Surat Perintah Mulai Kerja (SPMK)" />
                        <FormUploadFile name="surat_penunjukan_file" onChange={handleChangeFile} title="Surat Penunjukan Penyedia Barang/Jasa (SPPBJ)" />
                        <FormUploadFile name="berita_acara_file" onChange={handleChangeFile} title="Berita Acara Serah Terima (BAST/PHO/FHO)" />
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
                        <SubmitButton
                            text="Simpan Identitas Proyek"
                            onClick={() => handleProjectIdentityPost(photoData, documentData, locations)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}