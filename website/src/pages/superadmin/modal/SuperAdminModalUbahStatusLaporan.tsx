/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import maps from "/icon/maps.png";
import { BASE_URL_FILE } from "../../../server/API";
import FormSelect from "../../../ui/FormSelect";
import SubmitButton from "../../../ui/SubmitButton";
import usePengaduanHooks from "../../../hooks/PengaduanHooks";
import useProjectIdentity from "../../../hooks/ProjectIdentity";
import { SwalMessage } from "../../../utils/SwalMessage";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

const statusConfig: Record<string, { label: string; badge: string }> = {
    menunggu: { label: "Menunggu", badge: "bg-blue-100 text-blue-600 border border-blue-200" },
    diterima: { label: "Diterima", badge: "bg-green-100 text-green-600 border border-green-200" },
    diproses: { label: "Diproses", badge: "bg-orange-100 text-orange-600 border border-orange-200" },
    selesai: { label: "Selesai", badge: "bg-green-100 text-green-600 border border-green-200" },
    ditolak: { label: "Ditolak", badge: "bg-red-100 text-red-600 border border-red-200" },
};

const statusOptions = [
    { id: 1, text: "Diterima" },
    { id: 2, text: "Ditolak" },
];

function resolveStatusKey(raw: string): string {
    const s = raw.toLowerCase().trim().replace(/[_ ]/g, "");
    if (s.includes("proses") || s.includes("diproses")) return "diproses";
    if (s.includes("terima") || s.includes("diterima")) return "diterima";
    if (s.includes("selesai")) return "selesai";
    if (s.includes("tolak")) return "ditolak";
    return "menunggu";
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ", Indonesia")}&key=${GOOGLE_MAPS_API_KEY}`
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

function MapModal({ lat, lng, alamat }: { lat: string | null; lng: string | null; alamat: string | null }) {
    const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        const parsedLat = lat ? parseFloat(lat) : NaN;
        const parsedLng = lng ? parseFloat(lng) : NaN;
        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            setCoords({ lat: parsedLat, lng: parsedLng });
        } else if (alamat) {
            geocodeAddress(alamat).then(result => {
                setCoords(result ?? { lat: -2.5489, lng: 118.0149 });
            });
        } else {
            setCoords({ lat: -2.5489, lng: 118.0149 });
        }
    }, [lat, lng, alamat]);

    const customMarkerIcon: google.maps.Icon | undefined = isLoaded
        ? { url: maps, scaledSize: new window.google.maps.Size(36, 36), anchor: new window.google.maps.Point(18, 36) }
        : undefined;

    if (loadError) {
        return (
            <div className="w-full h-48 rounded-xl bg-gray-100 flex items-center justify-center">
                <p className="text-sm text-gray-400 font-poppins-regular">Gagal memuat Google Maps</p>
            </div>
        );
    }

    if (!isLoaded || !coords) {
        return (
            <div className="w-full h-48 rounded-xl bg-gray-100 flex items-center justify-center">
                <p className="text-sm text-gray-400 font-poppins-regular animate-pulse">Memuat peta...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-48">
            <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={coords}
                zoom={15}
                mapTypeId="roadmap"
                options={{
                    mapTypeId: "roadmap",
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    scrollwheel: false
                }}
            >
                <Marker position={coords} icon={customMarkerIcon} />
            </GoogleMap>
        </div>
    );
}

function StarDisplay({ value }: { value: number }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-5 h-5 transition-colors duration-200 ${i < value ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <p className="font-poppins-regular text-[11px] text-gray-400 uppercase tracking-wide">{label}</p>
            <div className="font-poppins-semibold text-[14px] text-gray-800">{value}</div>
        </div>
    );
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-primary rounded-full shrink-0" />
            <p className="font-poppins-bold text-[15px] text-gray-800">{title}</p>
        </div>
    );
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: any) => void;
    data: PengaduanProps;
}

export default function SuperAdminModalUbahStatusLaporan({ isOpen, onClose, data }: ModalProps) {
    const [lightbox, setLightbox] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState("");
    const { projectIdentityData } = useProjectIdentity();
    const {
        handlePengaduanStatusPut,
        handlePengaduanSetProjectIdentity,
        projectIdentityForm,
        setProjectIdentityForm
    } = usePengaduanHooks();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setVisible(true), 10);
            document.body.style.overflow = "hidden";
        } else {
            setVisible(false);
            document.body.style.overflow = "auto";
        }

        setProjectIdentityForm(data?.identitas_proyek_id);
        setStatus(String(data?.status));
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen, data, setProjectIdentityForm, setStatus]);

    if (!isOpen) return null;

    const statusKey = resolveStatusKey(data.status);
    const statusCfg = statusConfig[statusKey] ?? statusConfig["menunggu"];
    const review = data.review;
    const reviewer = data.created_by;

    return (
        <div className="fixed inset-0 z-100000 flex items-center justify-center overflow-hidden">
            <div
                className={`absolute inset-0 bg-black/40 transition-opacity ${visible ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            {lightbox && (
                <div
                    className="absolute inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <img src={lightbox} className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain" />
                </div>
            )}

            <div className="relative bg-white rounded-2xl shadow-2xl w-full mx-4 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="font-poppins-bold text-xl text-gray-800">Ubah Status Laporan</h2>
                        <p className="font-poppins-regular text-[13px] text-gray-400 mt-0.5">
                            Lihat detail dan ubah status laporan dari masyarakat
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:rotate-90 ml-4 shrink-0"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-5 flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                        <InfoField
                            label="Nomor Tiket Pengaduan"
                            value={<span className="text-primary">#{data?.id.toString().padStart(4, "0")}</span>}
                        />
                        <InfoField label="Judul Laporan" value={data.judul ?? "-"} />
                        <InfoField label="Kategori Laporan" value={data.kategori ?? "-"} />
                        <InfoField label="Nama Pelapor" value={data.created_by?.fullname ?? "-"} />
                        <InfoField
                            label="Tanggal Pelaporan"
                            value={new Date(data.created_at).toLocaleDateString("id-ID", {
                                day: "2-digit", month: "2-digit", year: "numeric",
                                hour: "2-digit", minute: "2-digit"
                            }).replace(/\//g, "-")}
                        />
                        <InfoField
                            label="Status Saat Ini"
                            value={
                                <span className={`inline-flex items-center text-[12px] font-poppins-semibold px-3 py-1 rounded-full ${statusCfg.badge}`}>
                                    {statusCfg.label}
                                </span>
                            }
                        />
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

                    <div className="flex flex-col gap-2">
                        <p className="font-poppins-regular text-[11px] text-gray-400 uppercase tracking-wide">Lokasi Kejadian</p>
                        {data.alamat && (
                            <p className="font-poppins-semibold text-[14px] text-gray-800 mb-2">{data.alamat}</p>
                        )}
                        {(data.latitude || data.longitude) && (
                            <div className="flex items-center gap-1.5 mb-2">
                                <div className="bg-white border border-gray-200 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm w-fit">
                                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <span className="font-poppins-regular text-[11px] text-gray-500">
                                        {data.latitude}, {data.longitude}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                            <MapModal lat={data.latitude} lng={data.longitude} alamat={data.alamat} />
                        </div>
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

                    <div className="flex flex-col gap-2">
                        <SectionHeader title="Deskripsi Pengaduan" />
                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                            <p className="font-poppins-regular text-[13px] text-gray-600 leading-relaxed">
                                {data.deskripsi ?? "Tidak ada deskripsi."}
                            </p>
                        </div>
                    </div>

                    {data.medias && data.medias.length > 0 && (
                        <>
                            <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
                            <div className="flex flex-col gap-3">
                                <SectionHeader title="Lampiran Pengaduan" />
                                <div className="grid grid-cols-3 gap-3">
                                    {data.medias.map((media, index) => {
                                        const src = typeof media.media_file === "string"
                                            ? `${BASE_URL_FILE}/${media.media_file}`
                                            : URL.createObjectURL(media.media_file as File);
                                        const isVideo = media.media_tipe === "video";
                                        return (
                                            <div
                                                key={media.id}
                                                className="group relative rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer aspect-video"
                                                style={{ animationDelay: `${index * 60}ms` }}
                                                onClick={() => !isVideo && setLightbox(src)}
                                            >
                                                {isVideo ? (
                                                    <video src={src} className="w-full h-full object-cover" muted />
                                                ) : (
                                                    <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

                    <div className="flex flex-col gap-6">
                        <SectionHeader title="Ubah Status Laporan" />

                        <FormSelect
                            title="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            {statusOptions.map((item) => (
                                <option key={item.id} value={item.text}>{item.text}</option>
                            ))}
                        </FormSelect>

                        {status == "Diterima" && (
                            <FormSelect
                                title="Proyek Terkait"
                                value={projectIdentityForm as any}
                                onChange={(e) => setProjectIdentityForm(e.target.value)}
                            >
                                {projectIdentityData.map((item) => (
                                    <option key={item.id} value={item.id}>{`${item.nama} - ${item.kecamatan}, ${item.kelurahan} Tahun ${item.tahun_anggaran}`}</option>
                                ))}
                            </FormSelect>
                        )}

                    </div>

                    {review && (
                        <>
                            <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
                            <div className="flex flex-col gap-3">
                                <SectionHeader title="Penilaian Masyarakat" />
                                <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-poppins-semibold text-[13px] text-gray-800">{reviewer?.fullname ?? "Masyarakat"}</p>
                                            <p className="font-poppins-regular text-[11px] text-gray-400">Masyarakat</p>
                                        </div>
                                    </div>
                                    <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex flex-col gap-2">
                                        <StarDisplay value={review.rating ?? 0} />
                                        {review.catatan && (
                                            <p className="font-poppins-regular text-[13px] text-gray-600 italic">"{review.catatan}"</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <SubmitButton
                        text="Simpan Perubahan"
                        onClick={() => {
                            if (status == "Ditolak") {
                                handlePengaduanStatusPut(status, null, data.id)
                            } else {
                                if (status && projectIdentityForm) {
                                    handlePengaduanSetProjectIdentity()
                                    handlePengaduanStatusPut(status, null, data.id)
                                } else {
                                    SwalMessage({
                                        type: "error",
                                        title: "Gagal!",
                                        text: "Seluruh field wajib diisi!"
                                    })
                                }
                            }
                        }}
                    />

                    <div className="h-2" />
                </div>
            </div>
        </div>
    );
}