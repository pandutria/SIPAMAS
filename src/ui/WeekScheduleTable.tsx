/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trash2, FileText, ChevronDown, ChevronUp, History } from "lucide-react";
import FormatRupiah from "../utils/FormatRupiah";
import { BASE_URL_FILE } from "../server/API";
import { useState } from "react";
import { FormatDate } from "../utils/FormatDate";

interface WeekScheduleTableProps {
    totalMinggu: number;
    dataFile: ScheduleItemProps[];
    handleDeleteRow: (index: number) => void;
    showDelete?: boolean;
    isRealization?: boolean;
    realizationData?: RealizationDetailProps[];
}

export default function WeekScheduleTable({ totalMinggu, dataFile, handleDeleteRow, showDelete = false, isRealization = false, realizationData }: WeekScheduleTableProps) {
    const [expandedWeeks, setExpandedWeeks] = useState<{ [key: number]: boolean }>({});
    const getWeeklyCumulativeValue = (weekIdx: number) => {
        return dataFile?.reduce((sum: number, item: ScheduleItemProps) => {
            const cumulativeForItem = item.schedule_weeks
                .slice(0, weekIdx + 1)
                .reduce((acc, val) => {
                    return acc + (Number(val.value) || 0);
                }, 0);
            return sum + cumulativeForItem;
        }, 0) || 0;
    };

    const getWeeklyRealizationValue = (weekIdx: number) => {
        return realizationData?.find((item: any) => Number(item.week_number) === weekIdx + 1)?.value || 0;
    };

    const getRealizationCumulativeValue = (weekIdx: number) => {
        let cumulative = 0;
        for (let i = 0; i <= weekIdx; i++) {
            const weekValue = realizationData?.find((item: any) => Number(item.week_number) === i + 1)?.value || 0;
            cumulative += Number(weekValue);
        }
        return cumulative;
    };

    const getWeeklyEvidence = (weekIdx: number) => {
        return realizationData?.filter((item: any) => Number(item.week_number) === weekIdx + 1) || [];
    };

    const toggleWeekExpansion = (weekIdx: number) => {
        setExpandedWeeks(prev => ({
            ...prev,
            [weekIdx]: !prev[weekIdx]
        }));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-linear-to-r from-primary/20 to-primary/10 border-b-2 border-primary/30">
                                <th className="px-6 py-4 text-left font-poppins-semibold text-gray-800 text-sm">
                                    Keterangan
                                </th>
                                <th className="px-6 py-4 text-center font-poppins-semibold text-gray-800 text-sm">
                                    Jumlah
                                </th>
                                <th className="px-6 py-4 text-center font-poppins-semibold text-gray-800 text-sm">
                                    Bobot (%)
                                </th>
                                <th
                                    colSpan={totalMinggu}
                                    className="px-6 py-4 text-center font-poppins-semibold text-gray-800 text-sm bg-primary/5"
                                >
                                    Minggu Pelaksanaan
                                </th>
                                {showDelete && (
                                    <th className="px-6 py-4 text-center font-poppins-semibold text-gray-800 text-sm">
                                        Aksi
                                    </th>
                                )}
                            </tr>
                            <tr className="bg-primary/5 border-b border-gray-200">
                                <th colSpan={3}></th>
                                {Array.from({ length: totalMinggu }).map((_, i) => (
                                    <th
                                        key={i}
                                        className="px-4 py-3 text-center font-poppins-medium text-xs text-gray-700 border-l border-gray-200 hover:bg-primary/10 transition-colors duration-200"
                                    >
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-poppins-bold text-xs ring-1 ring-primary/20">
                                            {i + 1}
                                        </span>
                                    </th>
                                ))}
                                <th></th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {dataFile?.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={totalMinggu + 5}
                                        className="px-6 py-12 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="text-gray-300">
                                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <p className="font-poppins-medium text-gray-500">Tidak ada data</p>
                                            <p className="font-poppins-regular text-gray-400 text-sm">Upload file Excel untuk menampilkan jadwal pelaksanaan</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {dataFile?.map((item: ScheduleItemProps, index: any) => (
                                        <tr key={index} className="hover:bg-primary/5 transition-all duration-200 border-b border-gray-100">
                                            <td className="px-6 py-4 font-poppins-medium text-sm text-gray-800 max-w-xs">
                                                <div className="truncate hover:text-clip" title={item.description}>
                                                    {item.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-poppins-medium text-xs ring-1 ring-blue-200">
                                                    {FormatRupiah(Number(item.total_price))}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-poppins-medium text-xs ring-1 ring-amber-200">
                                                    {item.weight}%
                                                </span>
                                            </td>
                                            {item.schedule_weeks?.map((val, i) => (
                                                <td
                                                    key={i}
                                                    className="px-4 py-4 text-center border-l border-gray-200 bg-primary/2 hover:bg-primary/5 transition-all duration-200"
                                                >
                                                    <div className={`flex items-center justify-center h-8 rounded font-poppins-bold text-sm transition-all duration-200 ${Number(val.value) > 0
                                                        ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                                                        : 'text-gray-400'
                                                        }`}>
                                                        {Number(val.value) > 0 ? val.value : "-" as any}
                                                    </div>
                                                </td>
                                            ))}

                                            {showDelete && (
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleDeleteRow(index)}
                                                        className="inline-flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95 ring-1 ring-red-200"
                                                        title="Hapus baris"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}

                                    <tr className="bg-linear-to-r from-primary/10 to-primary/5 border-t-2 border-primary/30">
                                        <td className="px-6 py-4 font-poppins-semibold text-gray-700 text-sm">
                                            Jumlah
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full font-poppins-bold text-sm ring-2 ring-blue-300 shadow-sm">
                                                {FormatRupiah(
                                                    dataFile?.reduce(
                                                        (sum: number, item: ScheduleItemProps) => sum + Number(item.total_price),
                                                        0
                                                    )
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full font-poppins-bold text-sm ring-2 ring-amber-300 shadow-sm">
                                                {dataFile?.reduce((sum: number, item: ScheduleItemProps) => sum + item.weight, 0)}%
                                            </span>
                                        </td>
                                        {Array.from({ length: totalMinggu }).map((_, i) => (
                                            <td key={i} className="border-l border-gray-200 bg-primary/3"></td>
                                        ))}
                                        <td></td>
                                    </tr>

                                    <tr className="bg-blue-50/50 hover:bg-blue-50 transition-colors duration-200">
                                        <td
                                            colSpan={3}
                                            className="px-6 py-4 font-poppins-semibold text-gray-700 text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                                Kemajuan Pekerjaan Mingguan
                                            </div>
                                        </td>
                                        {Array.from({ length: totalMinggu }).map((_, weekIdx) => (
                                            <td
                                                key={weekIdx}
                                                className="px-4 py-4 text-center border-l border-gray-200"
                                            >
                                                <div className="inline-flex items-center justify-center min-w-12 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-poppins-bold text-sm ring-1 ring-blue-300 shadow-sm hover:shadow-md transition-all duration-200">
                                                    {dataFile?.reduce(
                                                        (sum: number, item: ScheduleItemProps) =>
                                                            sum + (Number(item.schedule_weeks[weekIdx].value) || 0),
                                                        0
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                        <td></td>
                                    </tr>

                                    <tr className="bg-emerald-50/50 hover:bg-emerald-50 transition-colors duration-200">
                                        <td
                                            colSpan={3}
                                            className="px-6 py-4 font-poppins-semibold text-gray-700 text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                                                Kemajuan Kumulatif Mingguan
                                            </div>
                                        </td>
                                        {Array.from({ length: totalMinggu }).map((_, weekIdx) => (
                                            <td
                                                key={weekIdx}
                                                className="px-4 py-4 text-center border-l border-gray-200"
                                            >
                                                <div className="inline-flex items-center justify-center min-w-12 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-poppins-bold text-sm ring-1 ring-emerald-300 shadow-sm hover:shadow-md transition-all duration-200">
                                                    {getWeeklyCumulativeValue(weekIdx)}
                                                </div>
                                            </td>
                                        ))}
                                        <td></td>
                                    </tr>

                                    {isRealization && (
                                        <tr className="bg-blue-50/50 hover:bg-blue-50 transition-colors duration-200">
                                            <td
                                                colSpan={3}
                                                className="px-6 py-4 font-poppins-semibold text-gray-700 text-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                                                    Realisasi
                                                </div>
                                            </td>
                                            {Array.from({ length: totalMinggu }).map((_, weekIdx) => (
                                                <td
                                                    key={weekIdx}
                                                    className="px-4 py-4 text-center border-l border-gray-200"
                                                >
                                                    <div className="inline-flex items-center justify-center min-w-12 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-poppins-bold text-sm ring-1 ring-red-300 shadow-sm hover:shadow-md transition-all duration-200">
                                                        {getWeeklyRealizationValue(weekIdx) || "-"}
                                                    </div>
                                                </td>
                                            ))}
                                            <td></td>
                                        </tr>
                                    )}

                                    {isRealization && (
                                        <tr className="bg-emerald-50/50 hover:bg-emerald-50 transition-colors duration-200">
                                            <td
                                                colSpan={3}
                                                className="px-6 py-4 font-poppins-semibold text-gray-700 text-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
                                                    Kemajuan Realisasi
                                                </div>
                                            </td>
                                            {Array.from({ length: totalMinggu }).map((_, weekIdx) => (
                                                <td
                                                    key={weekIdx}
                                                    className="px-4 py-4 text-center border-l border-gray-200"
                                                >
                                                    <div className="inline-flex items-center justify-center min-w-12 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg font-poppins-bold text-sm ring-1 ring-yellow-300 shadow-sm hover:shadow-md transition-all duration-200">
                                                        {getRealizationCumulativeValue(weekIdx) || "-"}
                                                    </div>
                                                </td>
                                            ))}
                                            <td></td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isRealization && realizationData && realizationData.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b-2 border-primary/30 bg-linear-to-r from-primary/20 to-primary/10">
                        <h2 className="font-poppins-semibold text-lg text-gray-800">
                            Bukti Realisasi Per Minggu
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Array.from({ length: totalMinggu }).map((_, weekIdx) => {
                                const weekEvidence = getWeeklyEvidence(weekIdx);
                                const currentEvidence = weekEvidence?.[0];
                                const hasRevisions = weekEvidence && weekEvidence.length > 1;
                                const isExpanded = expandedWeeks[weekIdx];

                                return (
                                    <div key={weekIdx} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
                                        <div className="p-4 flex flex-col items-center justify-center text-center bg-linear-to-br from-gray-50 to-white">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-poppins-bold text-sm ring-1 ring-primary/20 mb-3">
                                                {weekIdx + 1}
                                            </span>
                                            <h3 className="font-poppins-semibold text-gray-800 mb-2">
                                                Minggu {weekIdx + 1}
                                            </h3>

                                            {currentEvidence ? (
                                                <div className="w-full space-y-3">
                                                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                                        <div className="text-xs text-blue-600 font-poppins-medium mb-1">
                                                            Realisasi Terkini
                                                        </div>
                                                        <div className="text-2xl font-poppins-bold text-blue-700">
                                                            {currentEvidence.value}%
                                                        </div>
                                                        {currentEvidence.alasan_text && (
                                                            <div className="mt-2 text-xs text-gray-600 font-poppins-regular">
                                                                <span className="font-poppins-medium">Alasan: </span>
                                                                {currentEvidence.alasan_text}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => window.open(`${BASE_URL_FILE}/${currentEvidence.bukti_file}`, '_blank')}
                                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-poppins-medium text-sm"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        Lihat Bukti
                                                    </button>

                                                    {hasRevisions && (
                                                        <button
                                                            onClick={() => toggleWeekExpansion(weekIdx)}
                                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-poppins-medium text-sm"
                                                        >
                                                            <History className="w-4 h-4" />
                                                            Riwayat Revisi ({weekEvidence.length})
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500 font-poppins-regular py-4">
                                                    Belum ada bukti
                                                </div>
                                            )}
                                        </div>

                                        {isExpanded && hasRevisions && (
                                            <div className="border-t border-gray-200 bg-gray-50">
                                                <div className="p-4 space-y-3">
                                                    <div className="text-xs font-poppins-semibold text-gray-600 uppercase tracking-wide mb-3">
                                                        Data Sebelumnya
                                                    </div>
                                                    {weekEvidence?.map((revision: any, revIdx: number) => (
                                                        <div key={revision.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-poppins-semibold text-gray-500">
                                                                    Revisi #{weekEvidence.length - revIdx - 1} - Diubah {FormatDate(revision.created_at)}
                                                                </span>
                                                                <span className="text-lg font-poppins-bold text-gray-700">
                                                                    {revision.value}%
                                                                </span>
                                                            </div>

                                                            {revision.alasan_text && (
                                                                <div className="mb-2 p-2 bg-yellow-50 rounded border border-yellow-100">
                                                                    <div className="text-xs text-yellow-700 font-poppins-medium mb-1">
                                                                        Alasan Revisi:
                                                                    </div>
                                                                    <div className="text-xs text-gray-700 font-poppins-regular">
                                                                        {revision.alasan_text}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {revision.bukti_file && (
                                                                <button
                                                                    onClick={() => window.open(`${BASE_URL_FILE}/${revision.bukti_file}`, '_blank')}
                                                                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-all duration-200 font-poppins-medium text-xs"
                                                                >
                                                                    <FileText className="w-3 h-3" />
                                                                    Lihat Bukti
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}