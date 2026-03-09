/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/set-state-in-effect */
import { useParams, Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import usePengaduanHooks from "../../hooks/PengaduanHooks";
import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import maps from "/icon/maps.png";
import { BASE_URL_FILE } from "../../server/API";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import BackButton from "../../ui/BackButton";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

const statusConfig: Record<string, { label: string; badge: string; dot: string }> = {
    menunggu: { label: "Menunggu", badge: "bg-blue-100 text-blue-600 border border-blue-200", dot: "bg-blue-500" },
    diterima: { label: "Diterima", badge: "bg-purple-100 text-purple-600 border border-purple-200", dot: "bg-purple-500" },
    diproses: { label: "Diproses", badge: "bg-orange-100 text-orange-600 border border-orange-200", dot: "bg-orange-500" },
    selesai: { label: "Sudah Selesai", badge: "bg-green-100 text-green-600 border border-green-200", dot: "bg-green-500" },
    ditolak: { label: "Ditolak", badge: "bg-red-100 text-red-600 border border-red-200", dot: "bg-red-500" },
};

const statusPrintConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    menunggu: { label: "Menunggu", color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
    diterima: { label: "Diterima", color: "#6d28d9", bg: "#f5f3ff", border: "#ddd6fe" },
    diproses: { label: "Diproses", color: "#c2410c", bg: "#fff7ed", border: "#fed7aa" },
    selesai: { label: "Sudah Selesai", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
    ditolak: { label: "Ditolak", color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
};

function resolveStatusKey(raw: string): string {
    const s = raw.toLowerCase().trim().replace(/[_ ]/g, "");
    if (s.includes("terima") || s === "diterima") return "diterima";
    if (s.includes("proses") || s.includes("diproses")) return "diproses";
    if (s.includes("selesai")) return "selesai";
    if (s.includes("tolak")) return "ditolak";
    return "menunggu";
}

const mapContainerStyle = { width: "100%", height: "224px" };
const defaultCenter = { lat: -2.5489, lng: 118.0149 };

const customMarkerIcon = (ready: boolean): google.maps.Icon | undefined =>
    ready
        ? { url: maps, scaledSize: new google.maps.Size(36, 36), anchor: new google.maps.Point(18, 36) }
        : undefined;

function MapDetail({ lat, lng, alamat }: { lat: string | null; lng: string | null; alamat: string | null }) {
    const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
    const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

    useEffect(() => {
        const parsedLat = lat ? parseFloat(lat) : NaN;
        const parsedLng = lng ? parseFloat(lng) : NaN;

        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            setCenter({ lat: parsedLat, lng: parsedLng });
            return;
        }

        if (alamat && GOOGLE_MAPS_API_KEY) {
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(alamat + ", Indonesia")}&key=${GOOGLE_MAPS_API_KEY}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "OK" && data.results?.[0]?.geometry?.location) {
                        const { lat: gLat, lng: gLng } = data.results[0].geometry.location;
                        setCenter({ lat: gLat, lng: gLng });
                    } else {
                        setCenter(defaultCenter);
                    }
                })
                .catch(() => setCenter(defaultCenter));
        } else {
            setCenter(defaultCenter);
        }
    }, [lat, lng, alamat]);

    if (!isLoaded || !center) {
        return (
            <div className="w-full h-56 rounded-xl bg-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-[11px] text-gray-400 font-poppins-medium">Memuat peta...</p>
                </div>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            mapContainerClassName="rounded-xl"
            center={center}
            zoom={14}
            options={{ disableDefaultUI: true, gestureHandling: "cooperative", keyboardShortcuts: false }}
        >
            <Marker position={center} icon={customMarkerIcon(isLoaded)} />
        </GoogleMap>
    );
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
    const {
        pengaduanDataById,
        setSelectedPengaduanId,
        handlePengaduanReviewPost,
        pengaduanReviewForm,
        handleChangePengaduanReviewForm,
    } = usePengaduanHooks();
    const { id } = useParams();
    const { loading, user } = useAuth();
    const [lightbox, setLightbox] = useState<string | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        if (id) setSelectedPengaduanId(Number(id));
    }, [setSelectedPengaduanId, id]);

    const data = pengaduanDataById;
    const statusKey = data ? resolveStatusKey(data.status) : "menunggu";
    const statusCfg = statusConfig[statusKey] ?? statusConfig["menunggu"];
    const printCfg = statusPrintConfig[statusKey] ?? statusPrintConfig["menunggu"];
    const isSelesai = statusKey === "selesai";
    const hasReview = !!data?.review;

    const handlePrint = async () => {
        if (!data) return;
        setIsPrinting(true);

        try {
            let mapLat: number = defaultCenter.lat;
            let mapLng: number = defaultCenter.lng;
            let mapZoom = 5;

            const parsedLat = data.latitude ? parseFloat(data.latitude) : NaN;
            const parsedLng = data.longitude ? parseFloat(data.longitude) : NaN;

            if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
                mapLat = parsedLat;
                mapLng = parsedLng;
                mapZoom = 15;
            } else if (data.alamat && GOOGLE_MAPS_API_KEY) {
                try {
                    const res = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.alamat + ", Indonesia")}&key=${GOOGLE_MAPS_API_KEY}`
                    );
                    const geo = await res.json();
                    if (geo.status === "OK" && geo.results?.[0]?.geometry?.location) {
                        mapLat = geo.results[0].geometry.location.lat;
                        mapLng = geo.results[0].geometry.location.lng;
                        mapZoom = 15;
                    }
                } catch {
                    // fallback to default
                }
            }

            const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${mapLat},${mapLng}&zoom=${mapZoom}&size=900x320&scale=2&maptype=roadmap${mapZoom === 15 ? `&markers=icon:https://maps.google.com/mapfiles/ms/icons/green-dot.png%7C${mapLat},${mapLng}` : ""}&style=feature:poi|element:labels|visibility:off&key=${GOOGLE_MAPS_API_KEY}`;
            const printDate = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
            const submitDate = new Date(data.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

            const starsHtml = (rating: number) =>
                Array.from({ length: 5 }).map((_, i) =>
                    `<span style="color:${i < rating ? "#f59e0b" : "#e5e7eb"};font-size:20px;line-height:1;">★</span>`
                ).join("");

            const ratingLabel = ["", "Sangat Buruk", "Kurang Baik", "Cukup", "Baik", "Sangat Baik"];

            const timelinesHtml = data.timelines && data.timelines.length > 0
                ? data.timelines.map((tl, i) => `
                    <div style="display:flex;gap:14px;position:relative;${i < data.timelines!.length - 1 ? "padding-bottom:24px;" : ""}">
                        <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
                            <div style="width:22px;height:22px;border-radius:50%;background:${i === 0 ? "#15803d" : "#d1fae5"};border:2px solid ${i === 0 ? "#15803d" : "#6ee7b7"};display:flex;align-items:center;justify-content:center;z-index:1;flex-shrink:0;">
                                <div style="width:7px;height:7px;background:${i === 0 ? "white" : "#15803d"};border-radius:50%;"></div>
                            </div>
                            ${i < data.timelines!.length - 1 ? `<div style="width:2px;flex:1;min-height:20px;background:linear-gradient(to bottom,#15803d,#d1fae5);margin-top:2px;"></div>` : ""}
                        </div>
                        <div style="flex:1;padding-top:2px;">
                            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:3px;">
                                <p style="font-weight:700;font-size:12px;color:#111827;margin:0;">${tl.judul ?? "Update Status"}</p>
                                ${i === 0 ? `<span style="font-size:8px;font-weight:800;color:#15803d;background:#f0fdf4;border:1px solid #bbf7d0;padding:1px 6px;border-radius:999px;letter-spacing:0.06em;">TERBARU</span>` : ""}
                            </div>
                            <p style="font-size:10px;color:#9ca3af;margin:0 0 4px;font-weight:500;">${new Date(tl.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB</p>
                            ${tl.keterangan ? `<p style="font-size:11px;color:#4b5563;margin:0;line-height:1.6;background:#f9fafb;border-radius:6px;padding:6px 8px;">${tl.keterangan}</p>` : ""}
                        </div>
                    </div>`).join("")
                : `<div style="text-align:center;padding:20px 0;color:#9ca3af;font-size:12px;">
                    <p style="margin:0;font-size:28px;">⏱</p>
                    <p style="margin:6px 0 0;">Belum ada update timeline</p>
                   </div>`;

            const reviewHtml = hasReview
                ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div>${starsHtml(data.review?.rating ?? 0)}</div>
                        <span style="font-size:10px;font-weight:700;color:#15803d;background:white;border:1px solid #bbf7d0;padding:2px 8px;border-radius:999px;">${ratingLabel[data.review?.rating ?? 0] ?? ""}</span>
                    </div>
                    ${data.review?.catatan ? `<p style="font-size:12px;color:#374151;font-style:italic;margin:0 0 8px;line-height:1.6;background:white;border-radius:6px;padding:8px 10px;border:1px solid #d1fae5;">"${data.review.catatan}"</p>` : ""}
                    <p style="font-size:10px;color:#6b7280;margin:0;">Dikirim pada ${new Date(data.review?.created_at ?? "").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                   </div>`
                : `<div style="text-align:center;padding:16px 0;color:#9ca3af;font-size:11px;">
                    <p style="margin:0;font-size:24px;">⭐</p>
                    <p style="margin:6px 0 0;">Belum ada penilaian diberikan</p>
                   </div>`;

            const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"/>
<title>Laporan Pengaduan #${data.id.toString().padStart(4, "0")} — ${data.proyek?.nama ?? ""}</title>
<style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Segoe UI',system-ui,Arial,sans-serif;background:#fff;color:#1f2937;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-size:13px;}
    .page{max-width:900px;margin:0 auto;padding:36px 40px;}

    .doc-header{display:flex;align-items:stretch;justify-content:space-between;gap:20px;margin-bottom:28px;padding-bottom:24px;border-bottom:3px solid #15803d;}
    .doc-header-left{display:flex;flex-direction:column;justify-content:center;gap:4px;}
    .doc-brand{font-size:10px;font-weight:700;color:#15803d;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:2px;}
    .doc-number{font-size:30px;font-weight:900;color:#111827;letter-spacing:-1px;line-height:1;}
    .doc-sub{font-size:11px;color:#6b7280;margin-top:4px;}
    .doc-header-right{display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;gap:8px;}
    .status-badge{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;border-radius:999px;font-size:11px;font-weight:800;background:${printCfg.bg};color:${printCfg.color};border:1.5px solid ${printCfg.border};letter-spacing:0.03em;}
    .status-dot{width:7px;height:7px;border-radius:50%;background:${printCfg.color};flex-shrink:0;}
    .print-meta{font-size:10px;color:#9ca3af;text-align:right;line-height:1.5;}

    .section{margin-bottom:20px;}
    .section-title{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
    .section-icon{width:28px;height:28px;border-radius:8px;background:#f0fdf4;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .section-label{font-size:13px;font-weight:800;color:#111827;letter-spacing:-0.2px;}
    .section-line{flex:1;height:1px;background:#f3f4f6;}

    .card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;}
    .card-accent{background:linear-gradient(135deg,#f0fdf4 0%,#fff 60%);border:1px solid #d1fae5;}

    .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
    .grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
    .grid-4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;}
    .grid-main{display:grid;grid-template-columns:1fr 280px;gap:20px;align-items:start;}

    .field-label{font-size:9px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2px;}
    .field-value{font-size:12px;font-weight:600;color:#111827;line-height:1.4;}
    .field-value-light{font-size:12px;color:#374151;line-height:1.4;}

    .proyek-card{background:linear-gradient(135deg,#f0fdf4,#f8fffe);border:1.5px solid #a7f3d0;border-radius:12px;padding:16px 20px;margin-bottom:20px;}
    .proyek-name{font-size:16px;font-weight:800;color:#064e3b;margin-bottom:10px;letter-spacing:-0.3px;}

    .info-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;}
    .info-card{background:#f9fafb;border:1px solid #f3f4f6;border-radius:10px;padding:12px 14px;}

    .pelapor-row{display:flex;align-items:center;gap:12px;background:#f9fafb;border:1px solid #f3f4f6;border-radius:10px;padding:12px 14px;margin-bottom:20px;}
    .pelapor-avatar{width:40px;height:40px;border-radius:10px;background:#dcfce7;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;}
    .pelapor-fields{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;flex:1;}

    .desc-box{background:#f9fafb;border:1px solid #f3f4f6;border-radius:10px;padding:14px;font-size:12px;color:#374151;line-height:1.8;text-align:justify;}
    .catatan-box{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px 12px;margin-top:10px;}
    .catatan-label{font-size:9px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;}
    .catatan-text{font-size:11px;color:#78350f;line-height:1.6;}

    .map-container{border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;margin-top:10px;}
    .map-img{width:100%;height:auto;display:block;}
    .map-address{font-size:11px;color:#6b7280;margin-bottom:8px;display:flex;align-items:flex-start;gap:4px;}

    .sidebar-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px;margin-bottom:14px;}

    .footer{margin-top:28px;padding-top:20px;border-top:2px solid #f3f4f6;}
    .footer-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;align-items:end;}
    .footer-info p{font-size:10px;color:#6b7280;margin:0;line-height:1.6;}
    .footer-info strong{font-size:11px;color:#374151;font-weight:700;}
    .sig-box{text-align:center;}
    .sig-line{border-bottom:1.5px solid #d1d5db;height:52px;margin-bottom:6px;}
    .sig-label{font-size:10px;color:#6b7280;}
    .sig-title{font-size:9px;color:#9ca3af;margin-top:2px;}
    .watermark{text-align:center;}
    .watermark-stamp{display:inline-block;border:2.5px solid #15803d30;border-radius:50%;width:80px;height:80px;display:flex;align-items:center;justify-content:center;margin:0 auto;}
    .watermark-text{font-size:8px;font-weight:800;color:#15803d40;letter-spacing:0.05em;text-transform:uppercase;line-height:1.3;text-align:center;}
    .bar{height:4px;background:linear-gradient(to right,#15803d,#22c55e,#86efac);border-radius:999px;margin-bottom:28px;}

    @media print{
        body{background:#fff;}
        .page{padding:20px 24px;}
    }
</style>
</head>
<body>
<div class="page">

<div class="bar"></div>

<div class="doc-header">
    <div class="doc-header-left">
        <span class="doc-brand">📋 Dokumen Resmi · Laporan Pengaduan Masyarakat</span>
        <h1 class="doc-number">Laporan #${data.id.toString().padStart(4, "0")}</h1>
        <p class="doc-sub">Sistem Informasi Pengaduan · ${data.proyek?.nama ?? "—"}</p>
    </div>
    <div class="doc-header-right">
        <span class="status-badge"><span class="status-dot"></span>${printCfg.label}</span>
        <div class="print-meta">
            <p><strong>Tanggal Cetak</strong></p>
            <p>${printDate} WIB</p>
        </div>
    </div>
</div>

<div class="proyek-card">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#15803d" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        <span style="font-size:10px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.08em;">Informasi Proyek Terkait</span>
    </div>
    <p class="proyek-name">${data.proyek?.nama ?? "—"}</p>
    <div class="grid-4">
        ${data.proyek.locations.map(loc => loc.provinsi).length > 0 ? `<div><p class="field-label">Provinsi</p><p class="field-value-light">${data.proyek.locations.map(loc => loc.provinsi).join(", ")}</p></div>` : ""}
        ${data.proyek.locations.map(loc => loc.kabupaten).length > 0 ? `<div><p class="field-label">Kabupaten</p><p class="field-value-light">${data.proyek.locations.map(loc => loc.kabupaten).join(", ")}</p></div>` : ""}
        ${data.proyek.locations.map(loc => loc.kecamatan).length > 0 ? `<div><p class="field-label">Kecamatan</p><p class="field-value-light">${data.proyek.locations.map(loc => loc.kecamatan).join(", ")}</p></div>` : ""}
        ${data.proyek.locations.map(loc => loc.kelurahan).length > 0 ? `<div><p class="field-label">Kelurahan</p><p class="field-value-light">${data.proyek.locations.map(loc => loc.kelurahan).join(", ")}</p></div>` : ""}
    </div>
</div>

<div class="info-grid">
    <div class="info-card">
        <p class="field-label">Nomor Laporan</p>
        <p class="field-value">#${data.id.toString().padStart(4, "0")}</p>
    </div>
    <div class="info-card">
        <p class="field-label">Tanggal Pengajuan</p>
        <p class="field-value">${submitDate} WIB</p>
    </div>
    ${data.judul ? `<div class="info-card"><p class="field-label">Judul Laporan</p><p class="field-value">${data.judul}</p></div>` : ""}
    ${data.kategori ? `<div class="info-card" style="background:#fff7ed;border-color:#fed7aa;"><p class="field-label" style="color:#c2410c;">Kategori Masalah</p><p class="field-value" style="color:#9a3412;">${data.kategori}</p></div>` : ""}
</div>

${data.created_by ? `
<div class="pelapor-row">
    <div class="pelapor-avatar">👤</div>
    <div class="pelapor-fields">
        <div><p class="field-label">Nama Pelapor</p><p class="field-value">${data.created_by.fullname ?? data.created_by.fullname ?? "—"}</p></div>
        ${data.created_by.email ? `<div><p class="field-label">Email</p><p class="field-value-light">${data.created_by.email}</p></div>` : ""}
        ${(data.created_by as any).phone ? `<div><p class="field-label">No. Telepon</p><p class="field-value-light">${(data.created_by as any).phone}</p></div>` : ""}
    </div>
</div>` : ""}

<div class="grid-main">
    <div>
        <div class="section">
            <div class="section-title">
                <div class="section-icon"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#15803d" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
                <span class="section-label">Deskripsi Laporan</span>
                <div class="section-line"></div>
            </div>
            <div class="desc-box">${data.deskripsi ?? "<em style='color:#9ca3af;'>Tidak ada deskripsi yang diberikan.</em>"}</div>
            ${data.catatan ? `<div class="catatan-box"><p class="catatan-label">⚠ Catatan Tambahan</p><p class="catatan-text">${data.catatan}</p></div>` : ""}
        </div>

        <div class="section">
            <div class="section-title">
                <div class="section-icon"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#15803d" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
                <span class="section-label">Lokasi Kejadian</span>
                <div class="section-line"></div>
            </div>
            ${data.alamat ? `<div class="map-address">📍 <span>${data.alamat}</span></div>` : ""}
            <div class="map-container"><img class="map-img" src="${staticMapUrl}" alt="Peta Lokasi Kejadian" /></div>
            ${mapZoom === 5 ? `<p style="font-size:10px;color:#9ca3af;text-align:center;margin-top:6px;">⚠ Koordinat tidak tersedia — peta menampilkan wilayah Indonesia</p>` : ""}
        </div>
    </div>

    <div>
        <div class="sidebar-card">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:14px;">
                <div class="section-icon"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#15803d" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                <span style="font-size:12px;font-weight:800;color:#111827;">Timeline Penanganan</span>
                ${data.timelines && data.timelines.length > 0 ? `<span style="font-size:9px;font-weight:700;background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;padding:1px 6px;border-radius:999px;margin-left:auto;">${data.timelines.length} update</span>` : ""}
            </div>
            ${timelinesHtml}
        </div>

        <div class="sidebar-card">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:12px;">
                <div class="section-icon"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#15803d" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg></div>
                <span style="font-size:12px;font-weight:800;color:#111827;">Penilaian Layanan</span>
            </div>
            ${reviewHtml}
        </div>
    </div>
</div>

<div class="footer">
    <div class="footer-grid">
        <div class="footer-info">
            <strong>Dokumen Resmi Sistem Pengaduan</strong>
            <p>No. Laporan &nbsp;: #${data.id.toString().padStart(4, "0")}</p>
            <p>Status &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${printCfg.label}</p>
            <p>Proyek &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${data.proyek?.nama ?? "—"}</p>
            <p>Kategori &nbsp;&nbsp;: ${data.kategori ?? "—"}</p>
            <p style="margin-top:6px;font-size:9px;color:#d1d5db;">Dicetak otomatis dari sistem. Dokumen ini sah tanpa tanda tangan basah apabila dicetak langsung dari sistem.</p>
        </div>
        <div class="sig-box">
            <div class="sig-line"></div>
            <p class="sig-label">Mengetahui,</p>
            <p class="sig-title">Petugas yang Menangani</p>
        </div>
        <div class="watermark">
            <div style="border:2px dashed #15803d30;border-radius:12px;padding:12px;text-align:center;">
                <p style="font-size:28px;margin-bottom:4px;">✓</p>
                <p style="font-size:9px;font-weight:800;color:#15803d60;text-transform:uppercase;letter-spacing:0.06em;line-height:1.4;">Laporan<br/>Terverifikasi<br/>Sistem</p>
            </div>
        </div>
    </div>
</div>

</div>
<script>window.onload=()=>{window.print();}<\/script>
</body>
</html>`;

            const printWindow = window.open("", "_blank", "width=1100,height=750");
            if (printWindow) {
                printWindow.document.write(html);
                printWindow.document.close();
            }
        } finally {
            setIsPrinting(false);
        }
    };

    if (loading || !data) return <LoadingSpinner />;
    if (!user || user.role !== "masyarakat") return <Navigate to="/" replace />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {lightbox && (
                <div className="fixed inset-0 bg-black/80 z-9999 flex items-center justify-center p-4" onClick={() => setLightbox(null)} data-aos="fade-in">
                    <img src={lightbox} className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain" />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16">
                <BackButton type="custom" link="/masyarakat/riwayat-laporan" />

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="flex-1 flex flex-col gap-5 w-full">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" data-aos="fade-up" data-aos-duration="600">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="font-poppins-bold text-2xl md:text-3xl text-gray-800">
                                            #{data.id.toString().padStart(4, "0")}
                                        </h1>
                                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-poppins-semibold px-3 py-1 rounded-full ${statusCfg.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusCfg.dot}`} />
                                            {statusCfg.label}
                                        </span>
                                    </div>
                                    <p className="font-poppins-regular text-sm text-primary">
                                        Laporan diajukan pada{" "}
                                        {new Date(data.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}{" "}WIB
                                    </p>
                                </div>
                                <button
                                    onClick={handlePrint}
                                    disabled={isPrinting}
                                    className="flex items-center gap-2 font-poppins-semibold text-[13px] text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:border-primary hover:text-primary transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isPrinting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            Menyiapkan...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                            </svg>
                                            Cetak
                                        </>
                                    )}
                                </button>
                            </div>

                            {(data.judul || data.kategori) && (
                                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-100 rounded-xl p-4 bg-gray-50">
                                    {data.judul && (
                                        <div>
                                            <p className="text-[10px] font-poppins-semibold text-gray-400 uppercase tracking-wider mb-1">Judul Laporan</p>
                                            <p className="font-poppins-semibold text-[14px] text-gray-800">{data.judul}</p>
                                        </div>
                                    )}
                                    {data.kategori && (
                                        <div>
                                            <p className="text-[10px] font-poppins-semibold text-gray-400 uppercase tracking-wider mb-1">Kategori Masalah</p>
                                            <p className="font-poppins-semibold text-[14px] text-gray-800">{data.kategori}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {data.proyek && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" data-aos="fade-up" data-aos-duration="600" data-aos-delay="40">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h2 className="font-poppins-bold text-[16px] text-gray-800">Informasi Proyek</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-[10px] font-poppins-semibold text-gray-400 uppercase tracking-wider mb-0.5">Nama Proyek</p>
                                        <p className="font-poppins-semibold text-[13px] text-gray-800">{data.proyek.nama}</p>
                                    </div>
                                    {data.proyek?.locations?.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-poppins-semibold text-gray-400 uppercase tracking-wider mb-0.5">Lokasi</p>
                                            <p className="font-poppins-medium text-[13px] text-gray-700">{data.proyek.locations.map(loc => loc.kecamatan).join(", ")}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

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
                                {data.deskripsi ?? "Tidak ada deskripsi."}
                            </p>
                            {data.catatan && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                                    <p className="text-[10px] font-poppins-semibold text-yellow-700 uppercase tracking-wider mb-1">Catatan</p>
                                    <p className="font-poppins-regular text-[13px] text-yellow-800 leading-relaxed">{data.catatan}</p>
                                </div>
                            )}
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
                            {data.alamat && (
                                <p className="font-poppins-regular text-[13px] text-gray-500 mb-3">{data.alamat}</p>
                            )}
                            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                <MapDetail lat={data.latitude} lng={data.longitude} alamat={data.alamat} />
                            </div>
                        </div>

                        {data.medias && data.medias.length > 0 && (
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

                            {data.timelines && data.timelines.length > 0 ? (
                                <div className="relative">
                                    <div className="absolute left-2.75 top-2 bottom-2 w-0.5 bg-linear-to-b from-primary via-green-200 to-gray-100" />
                                    <div className="flex flex-col gap-5">
                                        {data.timelines.map((tl, index) => (
                                            <div key={tl.id} className="flex gap-4 relative" data-aos="fade-up" data-aos-duration="400">
                                                <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md z-10 ring-2 ring-white mt-0.5">
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                </div>
                                                <div className="flex-1 pb-1">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <p className="font-poppins-semibold text-[13px] text-gray-800 leading-snug">{tl.judul ?? "Update"}</p>
                                                        {index === 0 && (
                                                            <span className="text-[9px] font-poppins-bold text-primary bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full shrink-0">
                                                                TERBARU
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="font-poppins-regular text-[11px] text-gray-400 mb-1.5">
                                                        {new Date(tl.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                    </p>
                                                    {tl.keterangan && (
                                                        <p className="font-poppins-regular text-[12px] text-gray-600 leading-relaxed">{tl.keterangan}</p>
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
                                            <p className="font-poppins-regular text-[13px] text-gray-600 italic leading-relaxed">"{data.review.catatan}"</p>
                                        )}
                                        <p className="font-poppins-regular text-[11px] text-gray-400">
                                            Dikirim{" "}
                                            {new Date(data.review?.created_at ?? "").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                        </p>
                                    </div>
                                    <p className="font-poppins-medium text-[12px] text-gray-400 text-center">Anda sudah memberikan ulasan</p>
                                </div>
                            ) : isSelesai ? (
                                <div className="flex flex-col gap-3">
                                    <StarInput
                                        value={Number(pengaduanReviewForm.rating)}
                                        onChange={(v) => handleChangePengaduanReviewForm({ target: { name: "rating", value: String(v) } } as React.ChangeEvent<HTMLInputElement>)}
                                    />
                                    {Number(pengaduanReviewForm.rating) > 0 && (
                                        <p className="font-poppins-medium text-[12px] text-primary">
                                            {["", "Sangat Buruk", "Kurang Baik", "Cukup", "Baik", "Sangat Baik"][Number(pengaduanReviewForm.rating)]}
                                        </p>
                                    )}
                                    <textarea
                                        value={pengaduanReviewForm.catatan}
                                        onChange={(e) => handleChangePengaduanReviewForm({ target: { name: "catatan", value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                                        placeholder="Ceritakan Pengalaman Anda..."
                                        className="w-full font-poppins-regular text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary resize-none transition-colors duration-200 text-gray-700 placeholder:text-gray-300"
                                        rows={4}
                                    />
                                    <button
                                        onClick={() => handlePengaduanReviewPost(Number(id))}
                                        disabled={!pengaduanReviewForm.rating}
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