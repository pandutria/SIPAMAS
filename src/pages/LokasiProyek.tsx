import Navbar from '../components/Navbar'
import useProjectIdentity from '../hooks/ProjectIdentity'
import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FormatRupiah from '../utils/FormatRupiah';

const iconSelesai = L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:#16a34a;border:3px solid white;box-shadow:0 2px 12px rgba(22,163,74,0.5)"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const iconProses = L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:#f97316;border:3px solid white;box-shadow:0 2px 12px rgba(249,115,22,0.5)"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

function getAlamat(project: ProjectIdentityProps): string {
    return [project.kecamatan, project.kabupaten, project.provinsi].filter(Boolean).join(', ') || '-';
}

function getStatusLabel(project: ProjectIdentityProps) {
    const selesai = !!project.updated_at && project.updated_at !== project.created_at;
    return selesai
        ? { label: 'Proyek Selesai', bg: 'bg-green-500', icon: iconSelesai }
        : { label: 'Proyek Berproses', bg: 'bg-orange-400', icon: iconProses };
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
}

export default function LokasiProyek() {
    const { projectIdentityData } = useProjectIdentity();

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [tahun, setTahun] = useState('');
    const [mapReady, setMapReady] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [mobileSheet, setMobileSheet] = useState(false);

    const uniqueYears = useMemo(() =>
        Array.from(new Set(projectIdentityData?.map(p => p.tahun_anggaran).filter(Boolean))) as string[],
        [projectIdentityData]
    );

    const filtered = useMemo(() =>
        (projectIdentityData ?? []).filter(p => {
            const matchSearch = search === '' ||
                p.nama?.toLowerCase().includes(search.toLowerCase()) ||
                getAlamat(p).toLowerCase().includes(search.toLowerCase());
            const matchTahun = tahun === '' || p.tahun_anggaran === tahun;
            return matchSearch && matchTahun;
        }),
        [projectIdentityData, search, tahun]
    );

    const selectedProject = useMemo(() =>
        filtered.find(p => p.id === selectedId) ?? null,
        [filtered, selectedId]
    );

    useEffect(() => {
        const fetchMaps = async () => {
            if (!mapRef.current || mapInstanceRef.current) return;
            const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false })
                .setView([-2.5489, 118.0149], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            mapInstanceRef.current = map;
            setMapReady(true);
        }

        fetchMaps();
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !mapReady) return;

        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        const geocodeAndAdd = async (project: ProjectIdentityProps) => {
            const lat = project.latitude ? parseFloat(project.latitude) : NaN;
            const lng = project.longitude ? parseFloat(project.longitude) : NaN;
            const { icon } = getStatusLabel(project);

            const addMarker = (la: number, lo: number) => {
                const marker = L.marker([la, lo], { icon })
                    .addTo(map)
                    .on('click', () => {
                        setSelectedId(project.id);
                        setMobileSheet(true);
                        map.flyTo([la, lo], 15, { duration: 1.2 });
                    });
                markersRef.current.push(marker);
            };

            if (!isNaN(lat) && !isNaN(lng)) {
                addMarker(lat, lng);
            } else {
                const alamat = getAlamat(project);
                if (alamat && alamat !== '-') {
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(alamat + ', Indonesia')}&format=json&limit=1&countrycodes=id`);
                        const data = await res.json();
                        if (data?.length > 0) addMarker(parseFloat(data[0].lat), parseFloat(data[0].lon));
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        };

        filtered.forEach(geocodeAndAdd);
    }, [filtered, mapReady]);

    const flyToProject = (project: ProjectIdentityProps) => {
        const map = mapInstanceRef.current;
        if (!map) return;
        setSelectedId(project.id);

        const lat = project.latitude ? parseFloat(project.latitude) : NaN;
        const lng = project.longitude ? parseFloat(project.longitude) : NaN;

        if (!isNaN(lat) && !isNaN(lng)) {
            map.flyTo([lat, lng], 15, { duration: 1.2 });
        } else {
            const alamat = getAlamat(project);
            if (alamat && alamat !== '-') {
                fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(alamat + ', Indonesia')}&format=json&limit=1&countrycodes=id`)
                    .then(r => r.json())
                    .then(d => {
                        if (d?.length > 0) map.flyTo([parseFloat(d[0].lat), parseFloat(d[0].lon)], 15, { duration: 1.2 });
                    }).catch(() => { });
            }
        }
    };

    return (
        <div>
            <Navbar />

            <div className="relative flex overflow-hidden pt-2" style={{ height: 'calc(100vh - 64px)', marginTop: '64px' }}>
                <div
                    className={`hidden md:flex relative z-10 flex-col transition-all duration-500 shrink-0 ${sidebarVisible ? 'w-96' : 'w-0 overflow-hidden'}`}
                    style={{ background: 'linear-gradient(160deg, var(--color-primary) 0%, #065f46 100%)' }}
                >
                    <div className="p-5 flex flex-col gap-4 min-w-96">
                        <div>
                            <p className="font-poppins-semibold text-[10px] text-white/60 uppercase tracking-widest mb-2">Tahun Pengadaan</p>
                            <div className="relative">
                                <select
                                    value={tahun}
                                    onChange={e => setTahun(e.target.value)}
                                    className="w-full font-poppins-medium text-[13px] text-white border border-white/20 rounded-xl px-4 py-2.5 focus:outline-none focus:border-white/50 appearance-none bg-white/10 cursor-pointer transition-colors duration-200"
                                >
                                    <option value="" className="text-gray-800">Semua Anggaran</option>
                                    {uniqueYears.map(y => (
                                        <option key={y} value={y} className="text-gray-800">Anggaran {y}</option>
                                    ))}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <p className="font-poppins-semibold text-[10px] text-white/60 uppercase tracking-widest mb-2">Pencarian Proyek</p>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Nama proyek atau lokasi..."
                                    className="w-full font-poppins-regular text-[13px] text-white border border-white/20 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-white/50 transition-colors duration-200 placeholder:text-white/30 bg-white/10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-5 py-2.5 border-b border-white/10 min-w-96 flex items-center justify-between">
                        <p className="font-poppins-semibold text-[11px] text-white/60 uppercase tracking-widest">Daftar Proyek</p>
                        <span className="text-[11px] font-poppins-bold text-white bg-white/20 px-2.5 py-0.5 rounded-full">{filtered.length}</span>
                    </div>

                    <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-2 min-w-96">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">🗺️</div>
                                <p className="font-poppins-medium text-[13px] text-white/50">Proyek tidak ditemukan</p>
                            </div>
                        ) : filtered.map((project) => {
                            const isSelected = selectedId === project.id;
                            const status = getStatusLabel(project);
                            return (
                                <button
                                    key={project.id}
                                    onClick={() => flyToProject(project)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${isSelected ? 'border-white/40 bg-white/20 shadow-lg shadow-black/10' : 'border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/20'}`}
                                >
                                    <span className={`inline-flex text-[9px] font-poppins-semibold text-white px-2 py-0.5 rounded-full mb-1.5 ${status.bg}`}>
                                        {status.label}
                                    </span>
                                    <p className="font-poppins-semibold text-[13px] leading-snug mb-1.5 text-white">{project.nama}</p>
                                    <div className="flex items-start gap-1.5">
                                        <svg className="w-3 h-3 text-white/40 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="font-poppins-regular text-[11px] text-white/50 leading-relaxed">{getAlamat(project)}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-white/10 min-w-96 bg-black/10">
                        <p className="font-poppins-semibold text-[10px] text-white/50 uppercase tracking-widest mb-2">Keterangan Status:</p>
                        <div className="flex gap-5">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <p className="font-poppins-regular text-[12px] text-white/70">Proyek Selesai</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                                <p className="font-poppins-regular text-[12px] text-white/70">Proyek Berproses</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setSidebarVisible(v => !v)}
                    className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-600 border border-white/30 rounded-r-xl shadow-lg w-6 h-14 items-center justify-center transition-all duration-500"
                    style={{ left: sidebarVisible ? '384px' : '0px', background: 'linear-gradient(160deg, var(--color-primary) 0%, #065f46 100%)' }}
                >
                    <svg className={`w-3 h-3 text-white transition-transform duration-300 ${sidebarVisible ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex-1 relative">
                    <div ref={mapRef} className="w-full h-full" />
                    {selectedProject && (
                        <div className="hidden md:block absolute top-4 right-4 z-400 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-80">
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex-1">
                                    <span className={`inline-flex items-center text-[10px] font-poppins-semibold text-white px-2.5 py-1 rounded-full mb-2 ${getStatusLabel(selectedProject).bg}`}>
                                        {getStatusLabel(selectedProject).label}
                                    </span>
                                    <p className="font-poppins-bold text-[15px] text-gray-800 leading-snug">{selectedProject.nama}</p>
                                </div>
                                <button onClick={() => setSelectedId(null)} className="shrink-0 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200">
                                    <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="h-px bg-gray-100 mb-3"></div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <p className="font-poppins-semibold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Mulai Proyek</p>
                                    <p className="font-poppins-bold text-[12px] text-gray-800">{formatDate(selectedProject.created_at)}</p>
                                </div>
                                <div>
                                    <p className="font-poppins-semibold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Proyek Selesai</p>
                                    <p className="font-poppins-bold text-[12px] text-gray-800">{formatDate(selectedProject.updated_at)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="font-poppins-semibold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Alamat Lengkap</p>
                                <p className="font-poppins-regular text-[12px] text-gray-600 leading-relaxed">{getAlamat(selectedProject)}</p>
                            </div>
                            {selectedProject.nilai_kontrak && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="font-poppins-semibold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Nilai Kontrak</p>
                                    <p className="font-poppins-bold text-[13px] text-primary">{FormatRupiah(Number(selectedProject.nilai_kontrak))}</p>
                                </div>
                            )}
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
                        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileSheet ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => setMobileSheet(false)}
                    />
                    <div
                        className={`absolute bottom-0 left-0 right-0 rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ${mobileSheet ? 'translate-y-0' : 'translate-y-full'}`}
                        style={{ background: 'linear-gradient(160deg, var(--color-primary) 0%, #065f46 100%)', maxHeight: '82vh' }}
                    >
                        <div className="flex items-center justify-center pt-3 pb-1">
                            <div className="w-10 h-1 bg-white/30 rounded-full"></div>
                        </div>

                        <div className="px-4 pt-2 pb-3 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="font-poppins-bold text-[16px] text-white">Daftar Proyek</p>
                                <button onClick={() => setMobileSheet(false)} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Cari proyek..."
                                        className="w-full text-[13px] font-poppins-regular text-white border border-white/20 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-white/50 bg-white/10 placeholder:text-white/30"
                                    />
                                </div>
                                <select
                                    value={tahun}
                                    onChange={e => setTahun(e.target.value)}
                                    className="font-poppins-medium text-[12px] text-white border border-white/20 rounded-xl px-3 py-2 focus:outline-none bg-white/10 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-800">Semua</option>
                                    {uniqueYears.map(y => (
                                        <option key={y} value={y} className="text-gray-800">{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1 px-4 pb-4 flex flex-col gap-2">
                            {/* MOBILE DETAIL CARD */}
                            {selectedProject && (
                                <div className="bg-white rounded-2xl p-4 mb-1 shadow-lg">
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="flex-1">
                                            <span className={`inline-flex text-[9px] font-poppins-semibold text-white px-2 py-0.5 rounded-full mb-2 ${getStatusLabel(selectedProject).bg}`}>
                                                {getStatusLabel(selectedProject).label}
                                            </span>
                                            <p className="font-poppins-bold text-[14px] text-gray-800 leading-snug">{selectedProject.nama}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedId(null)}
                                            className="shrink-0 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                                        >
                                            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="h-px bg-gray-100 mb-3"></div>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <p className="font-poppins-semibold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Mulai Proyek</p>
                                            <p className="font-poppins-bold text-[12px] text-gray-800">{formatDate(selectedProject.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="font-poppins-semibold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Proyek Selesai</p>
                                            <p className="font-poppins-bold text-[12px] text-gray-800">{formatDate(selectedProject.updated_at)}</p>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <p className="font-poppins-semibold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Alamat Lengkap</p>
                                        <p className="font-poppins-regular text-[12px] text-gray-600 leading-relaxed">{getAlamat(selectedProject)}</p>
                                    </div>
                                    {selectedProject.nilai_kontrak && (
                                        <div className="pt-2 border-t border-gray-100">
                                            <p className="font-poppins-semibold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Nilai Kontrak</p>
                                            <p className="font-poppins-bold text-[13px] text-primary">{selectedProject.nilai_kontrak}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {filtered.map((project) => {
                                const isSelected = selectedId === project.id;
                                const status = getStatusLabel(project);
                                return (
                                    <button
                                        key={project.id}
                                        onClick={() => { flyToProject(project); setMobileSheet(false); }}
                                        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 active:scale-[0.98] ${isSelected ? 'border-white/40 bg-white/20' : 'border-white/10 bg-white/5'}`}
                                    >
                                        <span className={`inline-flex text-[9px] font-poppins-semibold text-white px-2 py-0.5 rounded-full mb-1 ${status.bg}`}>
                                            {status.label}
                                        </span>
                                        <p className="font-poppins-semibold text-[13px] text-white leading-snug mb-1">{project.nama}</p>
                                        <p className="font-poppins-regular text-[11px] text-white/50">{getAlamat(project)}</p>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="px-4 py-3 border-t border-white/10 bg-black/10 flex gap-5">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                <p className="font-poppins-regular text-[11px] text-white/70">Proyek Selesai</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                                <p className="font-poppins-regular text-[11px] text-white/70">Proyek Berproses</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}