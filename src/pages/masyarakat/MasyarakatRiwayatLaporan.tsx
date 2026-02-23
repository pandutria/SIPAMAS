import Navbar from "../../components/Navbar";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import maps from "/icon/maps.png";
import "leaflet/dist/leaflet.css";
import usePengaduanHooks from "../../hooks/PengaduanHooks";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { Navigate, useNavigate } from "react-router-dom";
import type { PengaduanProps } from "../../types/global";
import { Plus } from "lucide-react";

const customIcon = L.icon({
  iconUrl: maps,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

type StatusType = "Menunggu" | "Diproses" | "Selesai" | "Ditolak";

const statusMap: Record<string, StatusType> = {
  "menunggu": "Menunggu",
  "pending": "Menunggu",
  "diproses": "Diproses",
  "dalam_proses": "Diproses",
  "dalam proses": "Diproses",
  "proses": "Diproses",
  "selesai": "Selesai",
  "ditolak": "Ditolak",
  "tolak": "Ditolak",
};

const statusConfig: Record<StatusType, { label: string; badge: string; badgeDot: string }> = {
  Menunggu: {
    label: "Menunggu",
    badge: "bg-blue-100 text-blue-600 border border-blue-200",
    badgeDot: "bg-blue-500",
  },
  Diproses: {
    label: "Diproses",
    badge: "bg-orange-100 text-orange-600 border border-orange-200",
    badgeDot: "bg-orange-500",
  },
  Selesai: {
    label: "Sudah Selesai",
    badge: "bg-green-100 text-green-600 border border-green-200",
    badgeDot: "bg-green-500",
  },
  Ditolak: {
    label: "Ditolak",
    badge: "bg-red-100 text-red-600 border border-red-200",
    badgeDot: "bg-red-500",
  },
};

function MapThumbnail({ lat, lng, alamat, uniqueId }: { lat: string | null; lng: string | null; alamat: string | null; uniqueId: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = (latitude: number, longitude: number) => {
      if (!mapRef.current) return;

      const map = L.map(mapRef.current, {
        attributionControl: false,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
      }).setView([latitude, longitude], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

      mapInstanceRef.current = map;
    };

    const parsedLat = lat ? parseFloat(lat) : NaN;
    const parsedLng = lng ? parseFloat(lng) : NaN;

    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      initMap(parsedLat, parsedLng);
    } else if (alamat) {
      const query = encodeURIComponent(`${alamat}, Indonesia`);
      fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=id`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            initMap(parseFloat(data[0].lat), parseFloat(data[0].lon));
          } else {
            initMap(-2.5489, 118.0149);
          }
        })
        .catch(() => initMap(-2.5489, 118.0149));
    } else {
      initMap(-2.5489, 118.0149);
    }

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, alamat, uniqueId]);

  return (
    <div className="relative w-full h-36">
      <div ref={mapRef} className="w-full h-full z-0" />
      <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none z-400" />
    </div>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < count ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function resolveStatus(raw: string): StatusType {
  const key = raw.toLowerCase().trim();
  return statusMap[key] ?? "Dalam Proses";
}

export default function MasyarakatRiwayatLaporan() {
  const [activeFilter, setActiveFilter] = useState<"Semua" | StatusType>("Semua");
  const { pengaduanData } = usePengaduanHooks();
  const [pengaduanDataFilter, setPengaduanDataFilter] = useState<PengaduanProps[]>([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const filters: ("Semua" | StatusType)[] = ["Semua", "Menunggu", "Diproses", "Selesai"];

  useEffect(() => {
    const fetchFiltered = async () => {
      const filtered = pengaduanData?.filter((item) => item.created_by?.fullname == user?.fullname) ?? [];
      setPengaduanDataFilter(filtered);
    }

    fetchFiltered();
  }, [pengaduanData, user]);

  const filteredData = activeFilter === "Semua"
    ? pengaduanDataFilter
    : pengaduanDataFilter.filter((item) => resolveStatus(item.status) === activeFilter);

  const stats = {
    total: pengaduanDataFilter.length,
    menunggu: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Menunggu").length,
    diproses: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Diproses").length,
    selesai: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Selesai").length,
    ditolak: pengaduanDataFilter.filter((i) => resolveStatus(i.status) === "Ditolak").length,
  };

  const statCards = [
    { label: "Jumlah Laporan", value: stats.total, icon: "📋", iconBg: "bg-blue-100", badge: null as string | null, badgeColor: "", valueColor: "text-blue-600" },
    { label: "Menunggu", value: stats.menunggu, icon: "🕐", iconBg: "bg-blue-100", badge: null, badgeColor: "", valueColor: "text-blue-500" },
    { label: "Diproses", value: stats.diproses, icon: "⏳", iconBg: "bg-orange-100", badge: null, badgeColor: "", valueColor: "text-orange-500" },
    { label: "Selesai", value: stats.selesai, icon: "✓", iconBg: "bg-green-100", badge: null, badgeColor: "", valueColor: "text-green-500" },
    { label: "Laporan Ditolak", value: stats.ditolak, icon: "✕", iconBg: "bg-red-100", badge: null, badgeColor: "", valueColor: "text-red-500" },
  ];

  if (loading) return <LoadingSpinner />;
  if (!user || user.role != "masyarakat") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-30 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-8" data-aos="fade-up" data-aos-duration="800">
          <div>
            <h1 className="font-poppins-bold text-2xl md:text-3xl text-gray-800">
              Selamat Datang, {user.fullname}
            </h1>
            <p className="font-poppins-regular text-sm text-gray-500 mt-1">
              Pantau progress aspirasi dan laporan Anda secara real-time.
            </p>
          </div>
          <button
            onClick={() => navigate("/masyarakat/laporan-baru")}
            className="shrink-0 font-poppins-semibold text-white bg-linear-to-r from-primary to-secondary py-2.5 px-5 rounded-xl text-[13px] flex items-center gap-2 hover:opacity-90 hover:scale-95 transition-all duration-300 shadow-sm"
          >
            <Plus size={16} />
            Buat Laporan Baru
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 relative overflow-hidden hover:shadow-md transition-shadow duration-200">
              {card.badge && (
                <span className={`absolute top-3 right-3 text-[10px] font-poppins-semibold text-white px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                  {card.badge}
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center text-lg mb-3`}>
                {card.icon}
              </div>
              <p className="font-poppins-regular text-xs text-gray-500 mb-1">{card.label}</p>
              <p className={`font-poppins-bold text-3xl ${card.valueColor}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="150">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="font-poppins-bold text-xl text-gray-800">Riwayat Laporan</h2>
            <div className="flex bg-white rounded-xl border border-gray-100 shadow-sm p-1 gap-1">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`font-poppins-semibold text-[13px] px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${activeFilter === f ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
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
                    onClick={() => navigate(`/masyarakat/laporan/detail/${item.id}`)}
                    key={`${item.id}-${index}`}
                    className="bg-white cursor-pointer rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    data-aos="fade-up"
                    data-aos-delay={index * 60}
                    data-aos-duration="500"
                  >
                    <div className="relative">
                      <MapThumbnail
                        lat={item.latitude}
                        lng={item.longitude}
                        alamat={item.alamat}
                        uniqueId={`${item.id}-${index}`}
                      />
                      <span className={`absolute top-2 left-2 z-500 text-[11px] font-poppins-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${config.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.badgeDot}`}></span>
                        {config.label}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[11px] font-poppins-regular">
                          {new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </div>

                      <h3 className="font-poppins-semibold text-[14px] text-gray-800 leading-snug line-clamp-2">
                        {item.judul ?? "Tanpa Judul"}
                      </h3>

                      {review?.rating && review?.catatan ? (
                        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                          <StarRating count={review.rating} />
                          <p className="font-poppins-regular text-[12px] text-gray-600 mt-1 italic line-clamp-2">
                            "{review.catatan}"
                          </p>
                        </div>
                      ) : (
                        <p className="font-poppins-regular text-[12px] text-gray-500 leading-relaxed line-clamp-2">
                          {item.deskripsi ?? "-"}
                        </p>
                      )}

                      {item.kategori && (
                        <span className="self-start text-[10px] font-poppins-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          {item.kategori}
                        </span>
                      )}

                      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-50">
                        <span className="font-poppins-regular text-[11px] text-gray-400">
                          ID: #{item.id}
                        </span>
                        <button
                          className="font-poppins-semibold text-[12px] text-primary hover:text-secondary transition-colors duration-200 flex items-center gap-1"
                        >
                          Lihat Detail
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl">
                📋
              </div>
              <p className="font-poppins-semibold text-gray-400 text-[15px]">Belum ada laporan</p>
              <p className="font-poppins-regular text-gray-300 text-[13px]">
                {activeFilter === "Semua"
                  ? "Anda belum membuat laporan apapun"
                  : `Laporan dengan status "${activeFilter}" tidak ditemukan`}
              </p>
              <button
                onClick={() => navigate("/masyarakat/laporan-baru")}
                className="mt-1 font-poppins-semibold text-white bg-linear-to-r from-primary to-secondary py-2.5 px-6 rounded-xl text-[13px] flex items-center gap-2 hover:opacity-90 duration-300 shadow-sm"
              >
                <Plus size={15} />
                Buat Laporan Baru
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}