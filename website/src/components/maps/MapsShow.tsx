/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Navigation, X, ExternalLink, Compass } from "lucide-react";
import maps from "/icon/maps.png";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
const DEFAULT_CENTER = { lat: -2.5489, lng: 118.0149 };

interface MapsShowProps {
    data: ProjectIdentityLocationProps[];
}

interface ActiveLocation {
    loc: ProjectIdentityLocationProps;
    index: number;
}

interface LocationDetailPanelProps {
    location: ProjectIdentityLocationProps;
    index: number;
    onClose: () => void;
}

function LocationDetailPanel({ location, index, onClose }: LocationDetailPanelProps) {
    const coords = location.latitude && location.longitude
        ? { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }
        : null;

    const googleMapsUrl = coords
        ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
        : null;

    return (
        <>
            <style>{`
                @keyframes panelSlideIn {
                    from { opacity: 0; transform: translateX(16px) scale(0.96); }
                    to   { opacity: 1; transform: translateX(0) scale(1); }
                }
                @keyframes detailFadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes dotGlow {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
                    50%      { transform: scale(1.2); box-shadow: 0 0 0 5px rgba(74,222,128,0); }
                }
            `}</style>

            <div
                className="absolute top-3 right-3 z-10 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                style={{ animation: "panelSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
            >
                <div className="relative h-28 overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/80 to-secondary/80" />
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-3.5">
                        <div className="flex items-center gap-1.5 mb-1">
                            <div
                                className="w-2 h-2 rounded-full bg-green-400"
                                style={{ animation: "dotGlow 1.5s ease-in-out infinite" }}
                            />
                            <span className="font-poppins-semibold text-[10px] text-white/80">Lokasi {index + 1}</span>
                        </div>
                        <p className="font-poppins-bold text-[13px] text-white leading-snug line-clamp-2">
                            {location.kelurahan || "—"}, {location.kecamatan || "—"}
                        </p>
                        <p className="font-poppins-regular text-[10px] text-white/70 mt-0.5">
                            {location.kabupaten} · {location.provinsi}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all duration-150 hover:scale-110 active:scale-90"
                    >
                        <X size={11} />
                    </button>
                </div>

                <div className="p-3 flex flex-col gap-2.5" style={{ animation: "detailFadeUp 0.4s 0.15s ease both" }}>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-xl p-2.5 flex flex-col gap-0.5">
                            <span className="text-[8px] font-poppins-medium text-gray-400 uppercase tracking-wider flex items-center gap-0.5">
                                <Compass size={7} /> Latitude
                            </span>
                            <span className="font-poppins-bold text-[12px] text-primary">
                                {coords ? coords.lat.toFixed(5) : "—"}
                            </span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-2.5 flex flex-col gap-0.5">
                            <span className="text-[8px] font-poppins-medium text-gray-400 uppercase tracking-wider flex items-center gap-0.5">
                                <Compass size={7} /> Longitude
                            </span>
                            <span className="font-poppins-bold text-[12px] text-primary">
                                {coords ? coords.lng.toFixed(5) : "—"}
                            </span>
                        </div>
                    </div>

                    {location.alamat && (
                        <div className="bg-gray-50 rounded-xl p-2.5 flex gap-2 items-start">
                            <MapPin size={12} className="text-primary shrink-0 mt-0.5" />
                            <p className="font-poppins-regular text-[11px] text-gray-600 leading-relaxed line-clamp-2">
                                {location.alamat}
                            </p>
                        </div>
                    )}

                    {googleMapsUrl && (
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 font-poppins-semibold text-[11px] text-white bg-linear-to-r from-primary to-secondary py-2 rounded-xl hover:opacity-90 hover:scale-[0.98] active:scale-95 transition-all duration-200"
                        >
                            <ExternalLink size={11} />
                            Buka di Google Maps
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}

export default function MapsShow({ data }: MapsShowProps) {
    const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

    const mapRef = useRef<google.maps.Map | null>(null);
    const [activeLocation, setActiveLocation] = useState<ActiveLocation | null>(null);

    const validLocations = data?.filter(
        (loc) =>
            loc.latitude && loc.longitude &&
            !isNaN(parseFloat(loc.latitude)) &&
            !isNaN(parseFloat(loc.longitude))
    );

    const normalIcon: google.maps.Icon | undefined = isLoaded
        ? { url: maps, scaledSize: new window.google.maps.Size(36, 36), anchor: new window.google.maps.Point(18, 36) }
        : undefined;

    const activeIcon: google.maps.Icon | undefined = isLoaded
        ? { url: maps, scaledSize: new window.google.maps.Size(48, 48), anchor: new window.google.maps.Point(24, 48) }
        : undefined;

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;

        if (validLocations?.length === 0) return;

        if (validLocations?.length === 1) {
            map.panTo({
                lat: parseFloat(validLocations[0].latitude),
                lng: parseFloat(validLocations[0].longitude),
            });
            map.setZoom(14);
            return;
        }

        const bounds = new window.google.maps.LatLngBounds();
        validLocations?.forEach((loc) => {
            bounds.extend({ lat: parseFloat(loc.latitude), lng: parseFloat(loc.longitude) });
        });
        map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
    }, [validLocations?.length]);

    const handleFlyTo = (loc: ProjectIdentityLocationProps, index: number) => {
        const map = mapRef.current;
        if (!map) return;

        const lat = parseFloat(loc.latitude);
        const lng = parseFloat(loc.longitude);

        map.panTo({ lat, lng });
        map.setZoom(15);
        setActiveLocation({ loc, index });
    };

    const handleClosePanel = () => setActiveLocation(null);

    if (loadError) return (
        <div className="w-full h-80 flex items-center justify-center bg-gray-100 rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-400 font-poppins-regular">Gagal memuat Google Maps</p>
        </div>
    );

    if (!isLoaded) return (
        <div className="w-full h-80 flex items-center justify-center bg-gray-100 rounded-2xl border border-gray-200">
            <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400 font-poppins-regular">Memuat peta...</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            <div
                className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
                style={{ height: "380px", animation: "mapFadeIn 0.5s ease both" }}
            >
                <GoogleMap
                    mapContainerStyle={MAP_CONTAINER_STYLE}
                    center={DEFAULT_CENTER}
                    zoom={5}
                    onLoad={onMapLoad}
                    options={{
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        scrollwheel: true,
                    }}
                >
                    {validLocations?.map((loc, index) => {
                        const lat = parseFloat(loc.latitude);
                        const lng = parseFloat(loc.longitude);
                        const isActive = activeLocation?.index === index;

                        return (
                            <Marker
                                key={loc.id}
                                position={{ lat, lng }}
                                icon={isActive ? activeIcon : normalIcon}
                                onClick={() => handleFlyTo(loc, index)}
                            />
                        );
                    })}
                </GoogleMap>

                {validLocations?.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 z-10 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <MapPin size={24} className="text-gray-300" />
                        </div>
                        <p className="font-poppins-medium text-[13px] text-gray-400">Belum ada data lokasi</p>
                    </div>
                )}

                {validLocations?.length > 0 && (
                    <div
                        className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-gray-100"
                        style={{ animation: "chipPop 0.4s 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}
                    >
                        <Navigation size={12} className="text-primary" />
                        <span className="font-poppins-semibold text-[11px] text-gray-700">
                            {validLocations?.length} titik lokasi
                        </span>
                    </div>
                )}

                {activeLocation && (
                    <LocationDetailPanel
                        location={activeLocation.loc}
                        index={activeLocation.index}
                        onClose={handleClosePanel}
                    />
                )}
            </div>

            {validLocations?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {validLocations?.map((loc, index) => (
                        <button
                            key={loc.id}
                            onClick={() => handleFlyTo(loc, index)}
                            className={`
                                group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left
                                transition-all duration-200
                                ${activeLocation?.index === index
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-gray-100 bg-white hover:border-primary/40 hover:bg-gray-50 shadow-sm"
                                }
                            `}
                            style={{ animation: `chipPop 0.4s ${index * 0.06 + 0.1}s cubic-bezier(0.34,1.56,0.64,1) both` }}
                        >
                            <div className={`
                                w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200
                                ${activeLocation?.index === index
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"
                                }
                            `}>
                                <MapPin size={13} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={`font-poppins-semibold text-[10px] transition-colors duration-200 ${activeLocation?.index === index ? "text-primary" : "text-gray-700 group-hover:text-primary"}`}>
                                    Lokasi {index + 1}
                                </p>
                                <p className="font-poppins-regular text-[10px] text-gray-400 truncate mt-0.5">
                                    {loc.kecamatan || loc.kabupaten || "—"}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}