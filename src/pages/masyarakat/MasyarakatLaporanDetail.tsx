import { useParams, useNavigate, Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import usePengaduanHooks from "../../hooks/PengaduanHooks";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import maps from "/icon/maps.png";
import "leaflet/dist/leaflet.css";
import { BASE_URL_FILE } from "../../server/API";
import type { PengaduanReviewProps } from "../../types/global";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import BackButton from "../../ui/BackButton";

const customIcon = L.icon({
    iconUrl: maps,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
});

const statusConfig: Record<string, { label: string; badge: string; dot: string }> = {
    menunggu: { label: "Menunggu", badge: "bg-blue-100 text-blue-600 border border-blue-200", dot: "bg-blue-500" },
    diproses: { label: "Diproses", badge: "bg-orange-100 text-orange-600 border border-orange-200", dot: "bg-orange-500" },
    selesai: { label: "Sudah Selesai", badge: "bg-green-100 text-green-600 border border-green-200", dot: "bg-green-500" },
    ditolak: { label: "Ditolak", badge: "bg-red-100 text-red-600 border border-red-200", dot: "bg-red-500" },
};

function resolveStatusKey(raw: string): string {
    return raw.toLowerCase().replace(/[_ ]/g, "").replace("dalam", "").replace("proses", "diproses") || raw.toLowerCase().trim();
}

function MapDetail({ lat, lng, alamat }: { lat: string | null; lng: string | null; alamat: string | null }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const initMap = (latitude: number, longitude: number) => {
            if (!mapRef.current) return;
            const map = L.map(mapRef.current, { attributionControl: false, zoomControl: true }).setView([latitude, longitude], 16);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
            L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
            mapInstanceRef.current = map;
        };

        const parsedLat = lat ? parseFloat(lat) : NaN;
        const parsedLng = lng ? parseFloat(lng) : NaN;

        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            initMap(parsedLat, parsedLng);
        } else if (alamat) {
            fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(alamat + ", Indonesia")}&format=json&limit=1&countrycodes=id`)
                .then(res => res.json())
                .then(data => {
                    if (data?.length > 0) initMap(parseFloat(data[0].lat), parseFloat(data[0].lon));
                    else initMap(-2.5489, 118.0149);
                })
                .catch(() => initMap(-2.5489, 118.0149));
        } else {
            initMap(-2.5489, 118.0149);
        }

        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
        };
    }, [lat, lng, alamat]);

    return <div ref={mapRef} className="w-full h-56 rounded-xl z-0" />;
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < (hovered || value);
                return (
                    <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setHovered(i + 1)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => onChange(i + 1)}
                        className="transition-transform duration-150 hover:scale-125 cursor-pointer"
                    >
                        <svg className={`w-7 h-7 transition-colors duration-150 ${filled ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                );
            })}
        </div>
    );
}

function StarDisplay({ value }: { value: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < value ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function MasyarakatLaporanDetail() {
    const { pengaduanDataById, setSelectedPengaduanId, handlePengaduanReviewPost } = usePengaduanHooks();
    const { id } = useParams();
    const { loading, user } = useAuth();
    const [rating, setRating] = useState(0);
    const [catatan, setCatatan] = useState("");
    const [lightbox, setLightbox] = useState<string | null>(null);

    useEffect(() => {
        if (id) setSelectedPengaduanId(Number(id));
    }, [setSelectedPengaduanId, id]);

    const data = pengaduanDataById;
    const statusKey = data ? resolveStatusKey(data.status) : "menunggu";
    const statusCfg = statusConfig[statusKey] ?? statusConfig["menunggu"];
    const isSelesai = statusKey === "selesai";
    const hasReview = !!data?.review;

    const handleReviewSubmit = () => {
        if (!rating) return;
        handlePengaduanReviewPost({ rating, catatan, pengaduan_id: Number(id) } as PengaduanReviewProps);
    };

    if (loading || !data) {
        return <LoadingSpinner/>
    }

    if (!user || user.role != "masyarakat") {
        return <Navigate to="/" replace/>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {lightbox && (
                <div
                    className="fixed inset-0 bg-black/80 z-9999 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                    data-aos="fade-in"
                >
                    <img src={lightbox} className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain" />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16">
                <BackButton type="custom" link="/masyarakat/riwayat-laporan"/>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="flex-1 flex flex-col gap-5 w-full">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" data-aos="fade-up" data-aos-duration="600">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="font-poppins-bold text-2xl md:text-3xl text-gray-800">
                                            #{data?.id.toString().padStart(4, "0")}
                                        </h1>
                                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-poppins-semibold px-3 py-1 rounded-full ${statusCfg.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusCfg.dot}`}></span>
                                            {statusCfg.label}
                                        </span>
                                    </div>
                                    <p className="font-poppins-regular text-sm text-primary">
                                        Laporan diajukan pada{" "}
                                        {new Date(data!.created_at).toLocaleDateString("id-ID", {
                                            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                                        })} WIB
                                    </p>
                                </div>
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 font-poppins-semibold text-[13px] text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:border-primary hover:text-primary transition-all duration-200 shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Cetak
                                </button>
                            </div>

                            {(data?.judul || data?.kategori) && (
                                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-100 rounded-xl p-4 bg-gray-50">
                                    {data?.judul && (
                                        <div>
                                            <p className="text-[10px] font-poppins-semibold text-gray-400 uppercase tracking-wider mb-1">Judul Laporan</p>
                                            <p className="font-poppins-semibold text-[14px] text-gray-800">{data?.judul}</p>
                                        </div>
                                    )}
                                    {data?.kategori && (
                                        <div>
                                            <p className="text-[10px] font-poppins-semibold text-gray-400 uppercase tracking-wider mb-1">Kategori Masalah</p>
                                            <p className="font-poppins-semibold text-[14px] text-gray-800">{data?.kategori}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" data-aos="fade-up" data-aos-duration="600" data-aos-delay="80">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h2 className="font-poppins-bold text-[16px] text-gray-800">Deskripsi Laporan</h2>
                            </div>
                            <p className="font-poppins-regular text-[14px] text-gray-600 leading-relaxed text-justify">
                                {data?.deskripsi ?? "Tidak ada deskripsi."}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" data-aos="fade-up" data-aos-duration="600" data-aos-delay="160">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h2 className="font-poppins-bold text-[16px] text-gray-800">Lokasi Kejadian</h2>
                            </div>
                            {data?.alamat && (
                                <p className="font-poppins-regular text-[13px] text-gray-500 mb-3">{data?.alamat}</p>
                            )}
                            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                <MapDetail lat={data!.latitude} lng={data!.longitude} alamat={data!.alamat} />
                            </div>
                        </div>

                        {data?.medias && data?.medias.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" data-aos="fade-up" data-aos-duration="600" data-aos-delay="240">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                    </div>
                                    <h2 className="font-poppins-bold text-[16px] text-gray-800">Lampiran</h2>
                                    <span className="text-[11px] font-poppins-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {data.medias.length} file
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {data.medias.map((media, index) => {
                                        const src = typeof media.media_file === "string"
                                            ? `${BASE_URL_FILE}/${media.media_file}`
                                            : URL.createObjectURL(media.media_file as File);
                                        const isVideo = media.media_tipe === "video";
                                        return (
                                            <div
                                                key={media.id}
                                                className="group relative rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square"
                                                data-aos="zoom-in"
                                                data-aos-delay={index * 50}
                                                data-aos-duration="400"
                                                onClick={() => !isVideo && setLightbox(src)}
                                            >
                                                {isVideo ? (
                                                    <video src={src} className="w-full h-full object-cover" muted />
                                                ) : (
                                                    <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                    </svg>
                                                </div>
                                                {isVideo && (
                                                    <span className="absolute top-1.5 left-1.5 text-[9px] font-poppins-semibold bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">
                                                        Video
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:w-80 xl:w-96 flex flex-col gap-5 w-full lg:sticky lg:top-24">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" data-aos="fade-left" data-aos-duration="600" data-aos-delay="100">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="font-poppins-bold text-[15px] text-gray-800">Timeline Penanganan</h2>
                            </div>

                            {data!.timelines && data!.timelines.length > 0 ? (
                                <div className="relative">
                                    <div className="absolute left-2.75 top-2 bottom-2 w-0.5 bg-linear-to-b from-primary via-green-200 to-gray-100"></div>
                                    <div className="flex flex-col gap-5">
                                        {data?.timelines.map((tl, index) => (
                                            <div
                                                key={tl.id}
                                                className="flex gap-4 relative"
                                                data-aos="fade-up"
                                                data-aos-delay={100 + index * 80}
                                                data-aos-duration="400"
                                            >
                                                <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md z-10 ring-2 ring-white mt-0.5">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                                <div className="flex-1 pb-1">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <p className="font-poppins-semibold text-[13px] text-gray-800 leading-snug">
                                                            {tl.judul ?? "Update"}
                                                        </p>
                                                        {index === 0 && (
                                                            <span className="text-[9px] font-poppins-bold text-primary bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full shrink-0">
                                                                TERBARU
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="font-poppins-regular text-[11px] text-gray-400 mb-1.5">
                                                        {new Date(tl.created_at).toLocaleDateString("id-ID", {
                                                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                                                        })}
                                                    </p>
                                                    {tl.keterangan && (
                                                        <p className="font-poppins-regular text-[12px] text-gray-600 leading-relaxed">
                                                            {tl.keterangan}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-8 gap-2">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="font-poppins-medium text-[12px] text-gray-400">Belum ada update timeline</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" data-aos="fade-left" data-aos-duration="600" data-aos-delay="200">
                            <h2 className="font-poppins-bold text-[15px] text-gray-800 mb-4">Berikan Penilaian</h2>

                            {hasReview ? (
                                <div className="flex flex-col gap-3">
                                    <div className="bg-green-50 rounded-xl border border-green-100 p-4 flex flex-col gap-2">
                                        <StarDisplay value={data.review?.rating ?? 0} />
                                        {data.review?.catatan && (
                                            <p className="font-poppins-regular text-[13px] text-gray-600 italic leading-relaxed">
                                                "{data.review.catatan}"
                                            </p>
                                        )}
                                        <p className="font-poppins-regular text-[11px] text-gray-400">
                                            Dikirim {new Date(data.review?.created_at ?? "").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                        </p>
                                    </div>
                                    <p className="font-poppins-medium text-[12px] text-gray-400 text-center">
                                        Anda sudah memberikan ulasan
                                    </p>
                                </div>
                            ) : isSelesai ? (
                                <div className="flex flex-col gap-3">
                                    <StarInput value={rating} onChange={setRating} />
                                    {rating > 0 && (
                                        <p className="font-poppins-medium text-[12px] text-primary">
                                            {["", "Sangat Buruk", "Kurang Baik", "Cukup", "Baik", "Sangat Baik"][rating]}
                                        </p>
                                    )}
                                    <textarea
                                        value={catatan}
                                        onChange={(e) => setCatatan(e.target.value)}
                                        placeholder="Ceritakan Pengalaman Anda..."
                                        className="w-full font-poppins-regular text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary resize-none transition-colors duration-200 text-gray-700 placeholder:text-gray-300"
                                        rows={4}
                                    />
                                    <button
                                        onClick={handleReviewSubmit}
                                        disabled={!rating}
                                        className="w-full font-poppins-semibold text-white bg-linear-to-r from-primary to-secondary py-3 rounded-xl text-[14px] hover:opacity-90 hover:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm"
                                    >
                                        Kirim Ulasan
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-6 gap-2">
                                    <div className="flex gap-1 mb-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <svg key={i} className="w-6 h-6 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="font-poppins-medium text-[12px] text-gray-400 text-center">
                                        Penilaian hanya bisa diberikan setelah laporan selesai diproses
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}