/* eslint-disable react-hooks/set-state-in-effect */
import Navbar from "../../components/Navbar";
import { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import maps from "/icon/maps.png";
import usePengaduanHooks from "../../hooks/PengaduanHooks";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { Navigate, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

type StatusType = "Menunggu" | "Diproses" | "Diterima" | "Selesai" | "Ditolak";

const statusMap: Record<string, StatusType> = {
  menunggu: "Menunggu", pending: "Menunggu",
  diproses: "Diproses", dalam_proses: "Diproses", "dalam proses": "Diproses", proses: "Diproses",
  diterima: "Diterima", terima: "Diterima",
  selesai: "Selesai",
  ditolak: "Ditolak", tolak: "Ditolak",
};

const statusConfig: Record<StatusType, { label: string; badge: string; dot: string }> = {
  Menunggu: { label: "Menunggu", badge: "bg-blue-500/10 text-blue-600 border border-blue-200/60", dot: "bg-blue-400" },
  Diproses: { label: "Diproses", badge: "bg-orange-500/10 text-orange-600 border border-orange-200/60", dot: "bg-orange-400" },
  Diterima: { label: "Diterima", badge: "bg-violet-500/10 text-violet-600 border border-violet-200/60", dot: "bg-violet-400" },
  Selesai: { label: "Sudah Selesai", badge: "bg-emerald-500/10 text-emerald-600 border border-emerald-200/60", dot: "bg-emerald-400" },
  Ditolak: { label: "Ditolak", badge: "bg-red-500/10 text-red-600 border border-red-200/60", dot: "bg-red-400" },
};

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

function MapThumbnail({ lat, lng, alamat }: { lat: string | null; lng: string | null; alamat: string | null }) {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const parsedLat = lat ? parseFloat(lat) : NaN;
    const parsedLng = lng ? parseFloat(lng) : NaN;
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      setCoords({ lat: parsedLat, lng: parsedLng });
    } else if (alamat) {
      geocodeAddress(alamat).then(r => setCoords(r ?? { lat: -2.5489, lng: 118.0149 }));
    } else {
      setCoords({ lat: -2.5489, lng: 118.0149 });
    }
  }, [lat, lng, alamat]);

  const markerIcon: google.maps.Icon | undefined = isLoaded
    ? { url: maps, scaledSize: new window.google.maps.Size(28, 28), anchor: new window.google.maps.Point(14, 28) }
    : undefined;

  const onLoad = useCallback((map: google.maps.Map) => {
    map.setOptions({ disableDefaultUI: true, gestureHandling: "none", keyboardShortcuts: false });
  }, []);

  if (!isLoaded || !coords) {
    return (
      <div className="w-full h-36 bg-linear-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-36">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={coords}
        zoom={14}
        mapTypeId="roadmap"
        onLoad={onLoad}
        options={{ mapTypeId: "roadmap", disableDefaultUI: true, gestureHandling: "none", keyboardShortcuts: false }}
      >
        <Marker position={coords} icon={markerIcon} />
      </GoogleMap>
    </div>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < count ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function resolveStatus(raw: string): StatusType {
  return statusMap[raw.toLowerCase().trim()] ?? "Menunggu";
}

export default function MasyarakatRiwayatLaporan() {
  const [activeFilter, setActiveFilter] = useState<"Semua" | StatusType>("Semua");
  const { pengaduanData } = usePengaduanHooks();
  const [pengaduanDataFilter, setPengaduanDataFilter] = useState<PengaduanProps[]>([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const filters: ("Semua" | StatusType)[] = ["Semua", "Menunggu", "Diterima", "Diproses", "Selesai"];

  useEffect(() => {
    const filtered = pengaduanData?.filter((item) => item.created_by?.fullname === user?.fullname) ?? [];
    setPengaduanDataFilter(filtered);
  }, [pengaduanData, user]);

  const filteredData = activeFilter === "Semua"
    ? pengaduanDataFilter
    : pengaduanDataFilter.filter((item) => resolveStatus(item.status) === activeFilter);

  const stats = {
    total: pengaduanDataFilter.length,
    menunggu: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Menunggu").length,
    diterima: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Diterima").length,
    diproses: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Diproses").length,
    selesai: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Selesai").length,
    ditolak: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Ditolak").length,
  };

  const statCards = [
    {
      key: "total",
      label: "Total Laporan",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "text-gray-600",
      bg: "bg-gray-100",
      border: "border-gray-200",
      valueCls: "text-gray-800",
    },
    {
      key: "menunggu",
      label: "Menunggu",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      valueCls: "text-blue-700",
    },
    {
      key: "diterima",
      label: "Diterima",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      valueCls: "text-purple-700",
    },
    {
      key: "diproses",
      label: "Diproses",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
      valueCls: "text-orange-700",
    },
    {
      key: "selesai",
      label: "Selesai",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      valueCls: "text-green-700",
    },
    {
      key: "ditolak",
      label: "Ditolak",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      valueCls: "text-red-700",
    },
  ];

  if (loading) return <LoadingSpinner />;
  if (!user || user.role !== "masyarakat") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen" style={{ background: "#f4f6fb" }}>
      <Navbar />

      <div className="relative overflow-hidden bg-linear-to-tr from-primary to-secondary pt-18" data-aos="fade-up" data-aos-duration="1000">
        <div className="blob absolute -top-20 -right-16 w-80 h-80 rounded-full opacity-20" style={{ background: "radial-gradient(circle, white, transparent)" }} />
        <div className="blob2 absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-15" style={{ background: "radial-gradient(circle, white, transparent)" }} />
        <div className="blob absolute top-16 left-1/2 w-40 h-40 rounded-full opacity-10" style={{ background: "radial-gradient(circle, white, transparent)", animationDelay: "3s" }} />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="fade-up" style={{ animationDelay: "0ms" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
              <span className="font-poppins-regular text-white/60 text-[11px] uppercase tracking-widest">Riwayat Laporan Saya</span>
            </div>
            <h1 className="font-poppins-bold text-2xl md:text-3xl text-white leading-tight drop-shadow-sm">
              Selamat Datang, {user.fullname} 👋
            </h1>
            <p className="font-poppins-regular text-white/65 text-sm mt-1.5">
              Pantau progress aspirasi dan laporan Anda secara real-time.
            </p>
          </div>
          <div className="fade-up shrink-0" style={{ animationDelay: "80ms" }}>
            <button
              onClick={() => navigate("/masyarakat/laporan-baru")}
              className="font-poppins-semibold text-sm text-white bg-white/15 border border-white/30 backdrop-blur-sm py-2.5 px-5 rounded-xl flex items-center gap-2 hover:bg-white/25 active:scale-95 transition-all duration-200 shadow-lg"
            >
              <Plus size={15} />
              Buat Laporan Baru
            </button>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" style={{ transform: "translateY(28px)" }}>
            {statCards.map((card, i) => (
              <div
                key={card.key}
                className={`bg-white rounded-2xl border ${card.border} shadow-sm px-4 py-4 flex items-center gap-3 hover:shadow-md transition-shadow duration-200`}
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay={i * 60}
              >
                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-poppins-semibold text-gray-400 uppercase tracking-wider leading-tight truncate">
                    {card.label}
                  </p>
                  <p className={`text-2xl font-poppins-bold ${card.valueCls} leading-tight`}>
                    {stats[card.key as keyof typeof stats]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-14" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-16" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
        <div className="fade-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7" style={{ animationDelay: "280ms" }}>
          <div>
            <h2 className="font-poppins-bold text-[18px] text-gray-800">Riwayat Laporan</h2>
            <p className="font-poppins-regular text-[12px] text-gray-400 mt-0.5">
              {filteredData.length} laporan {activeFilter !== "Semua" ? `dengan status "${activeFilter}"` : "ditemukan"}
            </p>
          </div>
          <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm p-1 gap-0.5 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 font-poppins-semibold text-[12px] px-3.5 py-2 rounded-xl transition-all duration-200 ${activeFilter === f
                  ? "text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                style={activeFilter === f ? {
                  background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary, #047857) 100%)",
                } : {}}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredData.map((item, index) => {
              const resolvedStatus = resolveStatus(item.status);
              const config = statusConfig[resolvedStatus];
              const review = item.review;

              return (
                <div
                  key={`${item.id}-${index}`}
                  onClick={() => navigate(`/masyarakat/laporan/detail/${item.id}`)}
                  className="card-in group bg-white cursor-pointer rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${320 + index * 50}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <MapThumbnail lat={item.latitude} lng={item.longitude} alamat={item.alamat} />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    <span className={`absolute top-2.5 left-2.5 z-10 text-[10px] bg-white font-poppins-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm ${config.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} pulse-dot`} />
                      {config.label}
                    </span>

                    <span className="absolute bottom-2.5 right-2.5 z-10 font-poppins-regular text-[10px] text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      #{item.id.toString().padStart(4, "0")}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col gap-2.5">
                    <div className="flex items-center gap-1.5 text-gray-400 flex-wrap">
                      <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[11px] font-poppins-regular">
                        {new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      {item.kategori && (
                        <>
                          <span className="text-gray-200">·</span>
                          <span className="text-[10px] font-poppins-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {item.kategori}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-poppins-semibold text-[14px] text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
                      {item.judul ?? "Tanpa Judul"}
                    </h3>

                    {review?.rating && review?.catatan ? (
                      <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                        <StarRating count={review.rating} />
                        <p className="font-poppins-regular text-[11px] text-gray-600 mt-1.5 italic line-clamp-2">
                          "{review.catatan}"
                        </p>
                      </div>
                    ) : (
                      <p className="font-poppins-regular text-[12px] text-gray-500 leading-relaxed line-clamp-2">
                        {item.deskripsi ?? "Tidak ada deskripsi."}
                      </p>
                    )}

                    <div className="pt-2 mt-auto border-t border-gray-50 flex justify-end">
                      <span className="font-poppins-semibold text-[12px] text-primary flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                        Lihat Detail
                        <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="fade-up flex flex-col items-center justify-center py-24 gap-4" style={{ animationDelay: "320ms" }}>
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl shadow-lg border border-green-100"
              style={{ background: "linear-gradient(135deg, #f0fdf4, #d1fae5)" }}>
              📋
            </div>
            <p className="font-poppins-bold text-gray-500 text-[16px]">Belum ada laporan</p>
            <p className="font-poppins-regular text-gray-400 text-[13px] text-center max-w-xs">
              {activeFilter === "Semua"
                ? "Anda belum membuat laporan apapun. Mulai buat laporan pertama Anda."
                : `Laporan dengan status "${activeFilter}" tidak ditemukan.`}
            </p>
            <button
              onClick={() => navigate("/masyarakat/laporan-baru")}
              className="mt-2 font-poppins-semibold text-white py-2.5 px-6 rounded-xl text-[13px] flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-200 shadow-md"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary, #047857))" }}
            >
              <Plus size={15} />
              Buat Laporan Baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
}