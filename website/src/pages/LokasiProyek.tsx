/* eslint-disable react-hooks/set-state-in-effect */
import Navbar from '../components/Navbar';
import useProjectIdentity from '../hooks/ProjectIdentity';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };
const DEFAULT_CENTER = { lat: -2.5489, lng: 118.0149 };

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', Indonesia')}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        if (data.status === 'OK' && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        }
        return null;
    } catch {
        return null;
    }
}

function getAlamat(project: ProjectIdentityProps): string {
    return [project.kecamatan, project.kabupaten, project.provinsi].filter(Boolean).join(', ') || '-';
}

function getStatus(project: ProjectIdentityProps) {
    const selesai = !!project.updated_at && project.updated_at !== project.created_at;
    return selesai
        ? { label: 'Selesai', color: '#16a34a', bg: 'bg-green-500', dot: 'bg-green-400' }
        : { label: 'Berproses', color: '#f97316', bg: 'bg-orange-400', dot: 'bg-orange-400' };
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

interface ResolvedProject extends ProjectIdentityProps {
    resolvedLat: number;
    resolvedLng: number;
}

function CustomMarker({ project, isSelected, onClick }: {
    project: ResolvedProject;
    isSelected: boolean;
    onClick: () => void;
}) {
    const status = getStatus(project);
    return (
        <OverlayView
            position={{ lat: project.resolvedLat, lng: project.resolvedLng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <div
                onClick={onClick}
                className="relative cursor-pointer flex flex-col items-center"
                style={{ transform: 'translate(-50%, -100%)' }}
            >
                <div className={`transition-all duration-300 ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
                    <div
                        className="relative flex items-center justify-center rounded-full shadow-xl border-2 border-white"
                        style={{
                            width: isSelected ? 36 : 28,
                            height: isSelected ? 36 : 28,
                            background: status.color,
                            boxShadow: isSelected
                                ? `0 0 0 4px ${status.color}40, 0 4px 20px ${status.color}60`
                                : `0 2px 12px ${status.color}50`,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {isSelected ? (
                            <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        ) : (
                            <div className="w-2 h-2 rounded-full bg-white opacity-80" />
                        )}
                    </div>
                    <div
                        className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                        style={{
                            bottom: isSelected ? -7 : -5,
                            borderLeft: `${isSelected ? 6 : 5}px solid transparent`,
                            borderRight: `${isSelected ? 6 : 5}px solid transparent`,
                            borderTop: `${isSelected ? 8 : 6}px solid ${status.color}`,
                        }}
                    />
                </div>
            </div>
        </OverlayView>
    );
}

function ProjectCard({ project, isSelected, onClick, index }: {
    project: ResolvedProject;
    isSelected: boolean;
    onClick: () => void;
    index: number;
}) {
    const status = getStatus(project);
    return (
        <button
            onClick={onClick}
            className="w-full text-left p-4 rounded-2xl border transition-all duration-300 group"
            style={{
                background: isSelected ? 'white' : '#f9fafb',
                borderColor: isSelected ? 'transparent' : '#f3f4f6',
                boxShadow: isSelected ? '0 8px 24px rgba(0,0,0,0.08)' : undefined,
                animationDelay: `${index * 40}ms`,
            }}
        >
            <div className="flex items-start gap-3">
                <div
                    className="shrink-0 w-2.5 h-2.5 rounded-full mt-4"
                    style={{ background: status.color, boxShadow: `0 0 6px ${status.color}60` }}
                />
                <div className="flex-1 min-w-0">
                    <span className={`inline-flex text-[9px] font-poppins-semibold text-white px-2 py-0.5 rounded-full mb-1.5 ${status.bg}`}>
                        Proyek {status.label}
                    </span>
                    <p className={`font-poppins-semibold text-[13px] leading-snug mb-1.5 truncate ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                        {project.nama}
                    </p>
                    <div className="flex items-start gap-1">
                        <svg className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="font-poppins-regular text-[11px] text-gray-400 leading-relaxed line-clamp-2">{getAlamat(project)}</p>
                    </div>
                </div>
            </div>
        </button>
    );
}

function InfoPanel({ project, onClose }: { project: ResolvedProject; onClose: () => void }) {
    const status = getStatus(project);
    return (
        <div
            className="bg-white mt-6 rounded-2xl border border-gray-100 p-5 w-80"
            style={{
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                animation: 'infoPanelIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
        >
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                    <span className={`inline-flex text-[9px] font-poppins-bold text-white px-2.5 py-1 rounded-full mb-2 ${status.bg}`}>
                        Proyek {status.label}
                    </span>
                    <p className="font-poppins-bold text-[15px] text-gray-800 leading-snug">{project.nama}</p>
                </div>
                <button
                    onClick={onClose}
                    className="shrink-0 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:rotate-90"
                >
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="h-px bg-gray-100 mb-4" />

            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                        <p className="font-poppins-semibold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Mulai</p>
                        <p className="font-poppins-bold text-[11px] text-gray-800">{formatDate(project.created_at)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                        <p className="font-poppins-semibold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Selesai</p>
                        <p className="font-poppins-bold text-[11px] text-gray-800">{formatDate(project.updated_at)}</p>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="font-poppins-semibold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Lokasi</p>
                    <p className="font-poppins-medium text-[12px] text-gray-700 leading-relaxed">{getAlamat(project)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="font-poppins-semibold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Koordinat</p>
                    <p className="font-poppins-regular text-[11px] text-gray-500">
                        {project.resolvedLat.toFixed(5)}, {project.resolvedLng.toFixed(5)}
                    </p>
                </div>
            </div>
        </div>
    );
}

function SidebarContent({ visible, children }: { visible: boolean; children: React.ReactNode }) {
    const [rendered, setRendered] = useState(visible);
    const [show, setShow] = useState(visible);

    useEffect(() => {
        if (visible) {
            setRendered(true);
            const t = requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
            return () => cancelAnimationFrame(t);
        } else {
            setShow(false);
            const t = setTimeout(() => setRendered(false), 450);
            return () => clearTimeout(t);
        }
    }, [visible]);

    if (!rendered) return null;

    return (
        <div
            className="flex flex-col h-full"
            style={{
                opacity: show ? 1 : 0,
                transform: show ? 'translateX(0) scale(1)' : 'translateX(-20px) scale(0.98)',
                transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}
        >
            {children}
        </div>
    );
}

export default function LokasiProyek() {
    const { projectIdentityData } = useProjectIdentity();
    const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

    const mapRef = useRef<google.maps.Map | null>(null);
    const [resolvedProjects, setResolvedProjects] = useState<ResolvedProject[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [tahun, setTahun] = useState('');
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [mobileSheet, setMobileSheet] = useState(false);

    const uniqueYears = useMemo(() =>
        Array.from(new Set(projectIdentityData?.map(p => p.tahun_anggaran).filter(Boolean))) as string[],
        [projectIdentityData]
    );

    const filtered = useMemo(() =>
        resolvedProjects.filter(p => {
            const matchSearch = search === '' ||
                p.nama?.toLowerCase().includes(search.toLowerCase()) ||
                getAlamat(p).toLowerCase().includes(search.toLowerCase());
            const matchTahun = tahun === '' || p.tahun_anggaran === tahun;
            return matchSearch && matchTahun;
        }),
        [resolvedProjects, search, tahun]
    );

    const selectedProject = useMemo(() =>
        filtered.find(p => p.id === selectedId) ?? null,
        [filtered, selectedId]
    );

    console.log(filtered)
    const countSelesai = useMemo(() => filtered.filter(p => getStatus(p).label === 'Sudah Lengkap').length, [filtered]);
    const countBerproses = useMemo(() => filtered.filter(p => getStatus(p).label === 'Belum Lengkap').length, [filtered]);

    useEffect(() => {
        if (!projectIdentityData) return;
        const resolve = async () => {
            const results = await Promise.all(
                projectIdentityData.map(async (p) => {
                    const lat = parseFloat(p.latitude ?? '');
                    const lng = parseFloat(p.longitude ?? '');
                    if (!isNaN(lat) && !isNaN(lng)) return { ...p, resolvedLat: lat, resolvedLng: lng };
                    const alamat = getAlamat(p);
                    if (alamat && alamat !== '-') {
                        const coords = await geocodeAddress(alamat);
                        if (coords) return { ...p, resolvedLat: coords.lat, resolvedLng: coords.lng };
                    }
                    return null;
                })
            );
            setResolvedProjects(results.filter(Boolean) as ResolvedProject[]);
        };
        resolve();
    }, [projectIdentityData]);

    const flyToProject = useCallback((project: ResolvedProject) => {
        setSelectedId(project.id);
        if (mapRef.current) {
            mapRef.current.panTo({ lat: project.resolvedLat, lng: project.resolvedLng });
            mapRef.current.setZoom(11);
        }
    }, []);

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    return (
        <div>
            <Navbar />

            <div
                className="relative flex overflow-hidden"
                style={{ height: 'calc(100vh - 64px)', marginTop: '64px' }}
            >
                <div
                    className="hidden md:flex relative z-10 flex-col shrink-0 bg-white border-r border-gray-100 overflow-hidden"
                    style={{
                        width: sidebarVisible ? '384px' : '0px',
                        transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1)',
                    }}
                >
                    <SidebarContent visible={sidebarVisible}>
                        <div className="p-5 pt-10 flex flex-col gap-4 min-w-96">
                            <div>
                                <p className="font-poppins-semibold text-[10px] text-gray-400 uppercase tracking-widest mb-2">Tahun Pengadaan</p>
                                <div className="relative">
                                    <select
                                        value={tahun}
                                        onChange={e => setTahun(e.target.value)}
                                        className="w-full font-poppins-medium text-[13px] text-gray-700 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gray-400 appearance-none bg-gray-50 cursor-pointer transition-colors duration-200"
                                    >
                                        <option value="">Semua Anggaran</option>
                                        {uniqueYears.map(y => (
                                            <option key={y} value={y}>Anggaran {y}</option>
                                        ))}
                                    </select>
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <p className="font-poppins-semibold text-[10px] text-gray-400 uppercase tracking-widest mb-2">Pencarian Proyek</p>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Nama proyek atau lokasi..."
                                        className="w-full font-poppins-regular text-[13px] text-gray-700 border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 focus:outline-none focus:border-gray-400 transition-colors duration-200 placeholder:text-gray-300 bg-gray-50"
                                    />
                                    {search && (
                                        <button
                                            onClick={() => setSearch('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90"
                                        >
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {[
                                    { count: countSelesai, label: 'Selesai', textColor: 'text-green-600', labelColor: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100', delay: '0ms' },
                                    { count: countBerproses, label: 'Berproses', textColor: 'text-orange-500', labelColor: 'text-orange-400', bg: 'bg-orange-50', border: 'border-orange-100', delay: '60ms' },
                                    { count: filtered.length, label: 'Total', textColor: 'text-gray-700', labelColor: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-100', delay: '120ms' },
                                ].map(s => (
                                    <div
                                        key={s.label}
                                        className={`stats-card flex-1 ${s.bg} border ${s.border} rounded-xl p-3 text-center`}
                                        style={{ animationDelay: s.delay }}
                                    >
                                        <p className={`font-poppins-bold text-[18px] ${s.textColor}`}>{s.count}</p>
                                        <p className={`font-poppins-regular text-[10px] ${s.labelColor}`}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="px-5 py-2.5 border-b border-gray-100 min-w-96 flex items-center justify-between">
                            <p className="font-poppins-semibold text-[10px] text-gray-400 uppercase tracking-widest">Daftar Proyek</p>
                        </div>

                        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-2 min-w-96">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">🗺️</div>
                                    <p className="font-poppins-medium text-[13px] text-gray-400">Proyek tidak ditemukan</p>
                                </div>
                            ) : filtered.map((project, i) => (
                                <div key={project.id} className="list-item-anim" style={{ animationDelay: `${i * 40}ms` }}>
                                    <ProjectCard
                                        project={project}
                                        isSelected={selectedId === project.id}
                                        onClick={() => flyToProject(project)}
                                        index={i}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-100 min-w-96 bg-gray-50/80">
                            <div className="flex gap-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" style={{ boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
                                    <p className="font-poppins-regular text-[11px] text-gray-500">Proyek Selesai</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400" style={{ boxShadow: '0 0 6px rgba(251,146,60,0.5)' }} />
                                    <p className="font-poppins-regular text-[11px] text-gray-500">Proyek Berproses</p>
                                </div>
                            </div>
                        </div>
                    </SidebarContent>
                </div>

                <button
                    onClick={() => setSidebarVisible(v => !v)}
                    className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-600 border border-gray-200 rounded-r-xl shadow-md w-6 h-14 items-center justify-center bg-white hover:bg-gray-50 hover:shadow-lg hover:w-7"
                    style={{
                        left: sidebarVisible ? '384px' : '0px',
                        transition: 'left 0.45s cubic-bezier(0.4,0,0.2,1), width 0.2s, box-shadow 0.2s',
                    }}
                >
                    <svg
                        className="w-3 h-3 text-gray-500"
                        style={{
                            transform: sidebarVisible ? 'rotate(0deg)' : 'rotate(180deg)',
                            transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
                        }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex-1 relative">
                    {loadError && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <p className="text-gray-400 font-poppins-regular">Gagal memuat Google Maps</p>
                        </div>
                    )}
                    {!isLoaded && !loadError && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <p className="text-gray-400 font-poppins-regular animate-pulse">Memuat peta...</p>
                        </div>
                    )}
                    {isLoaded && (
                        <GoogleMap
                            mapContainerStyle={MAP_CONTAINER_STYLE}
                            center={DEFAULT_CENTER}
                            zoom={5}
                            mapTypeId="roadmap"
                            onLoad={onMapLoad}
                            options={{
                                mapTypeId: "roadmap",
                                zoomControl: true,
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false,
                                scrollwheel: true,
                            }}
                        >
                            {filtered.map(project => (
                                <CustomMarker
                                    key={project.id}
                                    project={project}
                                    isSelected={selectedId === project.id}
                                    onClick={() => { flyToProject(project); setMobileSheet(true); }}
                                />
                            ))}
                        </GoogleMap>
                    )}

                    {selectedProject && (
                        <div className="hidden md:block absolute top-4 right-4 z-400">
                            <InfoPanel project={selectedProject} onClose={() => setSelectedId(null)} />
                        </div>
                    )}

                    <button
                        onClick={() => setMobileSheet(true)}
                        className="md:hidden absolute bottom-28 left-1/2 -translate-x-1/2 z-400 text-white font-poppins-semibold text-[13px] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 active:scale-95 transition-transform duration-200"
                        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #065f46 100%)' }}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Daftar Proyek ({filtered.length})
                    </button>
                </div>

                <div className={`md:hidden fixed inset-0 z-500 transition-all duration-300 ${mobileSheet ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                    <div
                        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileSheet ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => setMobileSheet(false)}
                    />
                    <div
                        className="absolute bottom-0 left-0 right-0 rounded-t-3xl shadow-2xl flex flex-col bg-white"
                        style={{
                            maxHeight: '82vh',
                            transform: mobileSheet ? 'translateY(0)' : 'translateY(100%)',
                            transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                        }}
                    >
                        <div className="flex items-center justify-center pt-3 pb-1">
                            <div className="w-10 h-1 bg-gray-200 rounded-full" />
                        </div>

                        <div className="px-4 pt-2 pb-3 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="font-poppins-bold text-[16px] text-gray-800">Daftar Proyek</p>
                                <button
                                    onClick={() => setMobileSheet(false)}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-200 hover:rotate-90 hover:bg-gray-200"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Cari proyek..."
                                        className="w-full text-[13px] font-poppins-regular text-gray-700 border border-gray-200 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-gray-400 bg-gray-50 placeholder:text-gray-300"
                                    />
                                </div>
                                <select
                                    value={tahun}
                                    onChange={e => setTahun(e.target.value)}
                                    className="font-poppins-medium text-[12px] text-gray-700 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none bg-gray-50 appearance-none cursor-pointer"
                                >
                                    <option value="">Semua</option>
                                    {uniqueYears.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2">
                                {[
                                    { count: countSelesai, label: 'Selesai', textColor: 'text-green-600', labelColor: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100' },
                                    { count: countBerproses, label: 'Berproses', textColor: 'text-orange-500', labelColor: 'text-orange-400', bg: 'bg-orange-50', border: 'border-orange-100' },
                                    { count: filtered.length, label: 'Total', textColor: 'text-gray-700', labelColor: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-100' },
                                ].map(s => (
                                    <div key={s.label} className={`flex-1 ${s.bg} border ${s.border} rounded-xl p-2.5 text-center`}>
                                        <p className={`font-poppins-bold text-[15px] ${s.textColor}`}>{s.count}</p>
                                        <p className={`font-poppins-regular text-[9px] ${s.labelColor}`}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1 px-4 pb-4 flex flex-col gap-2">
                            {selectedProject && (
                                <div className="mb-1">
                                    <p className="font-poppins-semibold text-[10px] text-gray-400 uppercase tracking-widest mb-2 px-1">Dipilih</p>
                                    <InfoPanel project={selectedProject} onClose={() => setSelectedId(null)} />
                                </div>
                            )}
                            <p className="font-poppins-semibold text-[10px] text-gray-400 uppercase tracking-widest px-1 mt-1">Semua Proyek</p>
                            {filtered.map((project, i) => (
                                <div key={project.id} className="list-item-anim" style={{ animationDelay: `${i * 35}ms` }}>
                                    <ProjectCard
                                        project={project}
                                        isSelected={selectedId === project.id}
                                        onClick={() => { flyToProject(project); setMobileSheet(false); }}
                                        index={i}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex gap-5">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                <p className="font-poppins-regular text-[11px] text-gray-500">Proyek Selesai</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                                <p className="font-poppins-regular text-[11px] text-gray-500">Proyek Berproses</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}