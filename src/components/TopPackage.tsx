/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import useRealisasiHooks from "../hooks/RealisasiHooks";
import { FormatPackage } from "../ui/FormatPackage";
import { ConvertToPercent } from "../utils/CovertToPercent";

export default function TopPackage() {
    const { realisasiData } = useRealisasiHooks();
    const [select, setSelect] = useState("2025");
    const tableData = useMemo(() => {
        const filtered = select
            ? realisasiData.filter((item: any) =>
                item?.schedule?.rab?.data_entry?.tahun_anggaran === select
            )
            : [];

        return FormatPackage(filtered).slice(0, 10);
    }, [realisasiData, select]);

    return (
        <div className="w-full min-h-screen p-4  sm:p-6 lg:p-8 mt-8" data-aos="fade-up" data-aos-duration="1000">
            <div className="max-w-350 mx-auto">
                <div className="mb-8">
                    <h1 className='font-poppins-bold text-2xl sm:text-4xl lg:text-3xl text-primary mb-2'>10 Paket Teratas Realisasi Pekerjaan Konstruksi</h1>
                    <div className="flex flex-row gap-4 items-center">
                        <p className="font-poppins-medium text-[16px]">Tahun Anggaran: </p>
                        <select value={select} onChange={(e) => setSelect(e.target.value)} className="border-2 border-gray-600 px-6 rounded-md font-poppins-regular text-[14px] py-2">
                            <option disabled selected>Pilih RAB</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                        </select>
                    </div>
                </div>
                
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-linear-to-r from-gray-50 to-gray-100">
                                    <th className="px-6 py-6 text-left min-w-45">
                                        <div className="bg-linear-to-r from-primary to-secondary text-white rounded-2xl px-6 py-4 font-poppins-bold text-sm shadow-lg transform hover:scale-105 transition-transform">
                                            Satuan Kerja
                                        </div>
                                    </th>
                                    <th className="px-6 py-6 text-left min-w-37.5">
                                        <div className="bg-linear-to-r from-primary to-secondary text-white rounded-2xl px-6 py-4 font-poppins-bold text-sm shadow-lg transform hover:scale-105 transition-transform">
                                            Kode Tender
                                        </div>
                                    </th>
                                    <th className="px-6 py-6 text-left min-w-28">
                                        <div className="bg-linear-to-r from-primary to-secondary text-white rounded-2xl px-6 py-4 font-poppins-bold text-sm shadow-lg transform hover:scale-105 transition-transform">
                                            Nama Paket
                                        </div>
                                    </th>
                                    <th className="px-6 py-6 text-center min-w-70" colSpan={2}>
                                        <div className="bg-linear-to-r from-gray-800 to-gray-900 text-white rounded-2xl px-6 py-4 font-poppins-bold text-sm shadow-lg mb-3">
                                            Durasi Pekerjaan
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-700 text-white rounded-xl px-4 py-3 font-poppins-semibold text-xs shadow-md hover:bg-gray-600 transition-colors">
                                                Tanggal Mulai
                                            </div>
                                            <div className="bg-gray-700 text-white rounded-xl px-4 py-3 font-poppins-semibold text-xs shadow-md hover:bg-gray-600 transition-colors">
                                                Tanggal Selesai
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-6 py-6 text-center min-w-64" colSpan={2}>
                                        <div className="bg-linear-to-r from-gray-800 to-gray-900 text-white rounded-2xl px-6 py-4 font-poppins-bold text-sm shadow-lg mb-3">
                                            Progress
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-blue-600 text-white rounded-xl px-4 py-3 font-poppins-semibold text-xs shadow-md hover:bg-blue-500 transition-colors">
                                                Rencana
                                            </div>
                                            <div className="bg-green-600 text-white rounded-xl px-4 py-3 font-poppins-semibold text-xs shadow-md hover:bg-green-500 transition-colors">
                                                Aktual
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-6 py-6 text-center min-w-30">
                                        <div className="bg-linear-to-r from-gray-800 to-gray-900 text-white rounded-2xl px-6 py-4 font-poppins-bold text-sm shadow-lg transform hover:scale-105 transition-transform">
                                            Deviasi
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tableData?.slice(0, 10)?.map((item: any, index: number) => (
                                    <tr key={index} className="hover:bg-linear-to-r hover:from-hover hover:to-transparent transition-all duration-200 group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-12 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <span className="font-poppins-semibold text-sm text-gray-800">{item.satuan_kerja}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-block bg-gray-100 px-4 py-2 rounded-lg font-poppins-medium text-sm text-gray-700 group-hover:bg-hover group-hover:text-primary transition-colors">
                                                {item.kode_paket}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-poppins-medium text-sm text-gray-800 line-clamp-2">{item.nama_paket}</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="bg-blue-50 rounded-lg px-4 py-2 inline-block">
                                                <span className="font-poppins-semibold text-sm text-blue-700">{item.tanggal_mulai}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="bg-purple-50 rounded-lg px-4 py-2 inline-block">
                                                <span className="font-poppins-semibold text-sm text-purple-700">{item.tanggal_akhir}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-25">
                                                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{width: `${ConvertToPercent(item.perencanaan_minggu_ini, item.perencanaan)}%`}}></div>
                                                </div>
                                                <span className="font-poppins-bold text-sm text-blue-700">{ConvertToPercent(item.perencanaan_minggu_ini, item.perencanaan)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-25">
                                                    <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500" style={{width: `${ConvertToPercent(item.aktual, item.perencanaan)}%`}}></div>
                                                </div>
                                                <span className="font-poppins-bold text-sm text-green-700">{ConvertToPercent(item.aktual, item.perencanaan)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-poppins-bold text-sm shadow-md ${
                                                item.perencanaan_minggu_ini <= item.aktual
                                                    ? 'bg-linear-to-r from-green-500 to-green-600 text-white' 
                                                    : 'bg-linear-to-r from-red-500 to-red-600 text-white'
                                            }`}>
                                                {item.perencanaan_minggu_ini <= item.aktual ? '↑' : item.perencanaan_minggu_ini > item.aktual ? '↓' : '→'}
                                                <span>{(ConvertToPercent(item.aktual, item.perencanaan) - ConvertToPercent(item.perencanaan_minggu_ini, item.perencanaan)).toFixed(2)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {tableData.length === 0 && (
                        <div className="py-32 text-center">
                            <div className="inline-block mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary rounded-full blur-2xl opacity-20"></div>
                                    <div className="relative p-8 bg-linear-to-br from-gray-50 to-gray-100 rounded-full border-2 border-gray-200 shadow-lg">
                                        <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-poppins-bold text-2xl text-gray-800 mb-2">Belum Ada Data</h3>
                            <p className="font-poppins-regular text-gray-500 text-base mb-6 max-w-xs mx-auto">Silakan pilih tahun anggaran untuk menampilkan data realisasi pekerjaan konstruksi</p>
                            <div className="flex justify-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0s"}}></div>
                                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{animationDelay: "0.15s"}}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.3s"}}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}