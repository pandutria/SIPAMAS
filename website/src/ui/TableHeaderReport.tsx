/* eslint-disable @typescript-eslint/no-explicit-any */
import { Printer, FileDown, FileSpreadsheet } from 'lucide-react';

interface TableHeaderReportProps {
    title: string;
    tahunOptions?: any[];
    kelompokOptions?: any[];
    metodePengadaanOptions?: any[];
    sumberDanaOptions?: any[];
    namaPenggunaOptions?: any[];
    selectedTahun?: string;
    selectedKelompok?: string;
    selectedMetodePengadaan?: string;
    selectedSumberDana?: string;
    selectedNamaPengguna?: string;
    onTahunChange?: (value: string) => void;
    onMetodePengadaanChange?: (value: string) => void;
    onSumberDanaChange?: (value: string) => void;
    onNamaPenggunaChange?: (value: string) => void;
    onKelompokChange?: (value: string) => void;
    onBuatReport?: () => void;
    onPrint?: () => void;
    onSavePDF?: () => void;
    onSaveExcel?: () => void;
    className?: string;
    isKepala?: boolean;
    isKelompok?: boolean;
}

export default function TableHeaderReport({
    title,
    tahunOptions = [],
    kelompokOptions = [],
    metodePengadaanOptions = [],
    sumberDanaOptions = [],
    namaPenggunaOptions = [],
    selectedTahun = '',
    selectedKelompok = '',
    selectedMetodePengadaan = '',
    selectedSumberDana = '',
    selectedNamaPengguna = '',
    onTahunChange,
    onMetodePengadaanChange,
    onSumberDanaChange,
    onNamaPenggunaChange,
    onKelompokChange,
    onPrint,
    onSavePDF,
    onSaveExcel,
    className,
    isKepala = false,
    isKelompok = false
}: TableHeaderReportProps) {
    return (
        <div className={`w-full bg-white rounded-lg p-6 mb-6 ${className}`}>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="flex flex-col gap-6">
                    <h1 className="font-poppins-bold text-2xl text-gray-800">
                        {title}
                    </h1>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <select
                            value={selectedTahun}
                            onChange={(e) => onTahunChange?.(e.target.value)}
                            className="text-[12px] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 cursor-pointer bg-white text-gray-700 font-poppins-regular"
                        >
                            <option value="">Pilih Tahun</option>
                            {tahunOptions.map((item, index) => (
                                <option key={index} value={item.text || item}>
                                    {item.text || item}
                                </option>
                            ))}
                        </select>

                        {(isKepala && !isKelompok) && (
                            <select
                                value={selectedNamaPengguna}
                                onChange={(e) => onNamaPenggunaChange?.(e.target.value)}
                                className="text-[12px] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 cursor-pointer bg-white text-gray-700 font-poppins-regular"
                            >
                                <option value="">Pilih Nama Pengguna</option>
                                {namaPenggunaOptions.map((item, index) => (
                                    <option key={index} value={item.id || item}>
                                        {item.id} - {item.text || item.fullname || item}
                                    </option>
                                ))}
                            </select>
                        )}

                        {(isKepala && isKelompok) && (
                            <select
                                value={selectedKelompok}
                                onChange={(e) => onKelompokChange?.(e.target.value)}
                                className="text-[12px] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 cursor-pointer bg-white text-gray-700 font-poppins-regular"
                            >
                                <option value="">Pilih Kelompok</option>
                                {kelompokOptions.map((item, index) => (
                                    <option key={index} value={item.id || item}>
                                        {item.text || item.fullname || item}
                                    </option>
                                ))}
                            </select>
                        )}

                        <select
                            value={selectedMetodePengadaan}
                            onChange={(e) => onMetodePengadaanChange?.(e.target.value)}
                            className="text-[12px] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 cursor-pointer bg-white text-gray-700 font-poppins-regular"
                        >
                            <option value="">Pilih Metode Pengadaan</option>
                            {metodePengadaanOptions.map((item, index) => (
                                <option key={index} value={item.text || item}>
                                    {item.text || item}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedSumberDana}
                            onChange={(e) => onSumberDanaChange?.(e.target.value)}
                            className="text-[12px] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 cursor-pointer bg-white text-gray-700 font-poppins-regular"
                        >
                            <option value="">Pilih Sumber Dana</option>
                            {sumberDanaOptions.map((item, index) => (
                                <option key={index} value={item.text || item}>
                                    {item.text || item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onPrint}
                        className="flex items-center justify-center text-[12px] gap-2 bg-blue-600 border-2 border-blue-600 hover:bg-transparent text-white hover:text-blue-600 font-poppins-medium px-4 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                        <Printer className="h-5 w-5" />
                        Print
                    </button>

                    <button
                        onClick={onSavePDF}
                        className="flex items-center justify-center text-[12px] gap-2 bg-red-600 border-2 border-red-600 hover:bg-transparent text-white hover:text-red-600 font-poppins-medium px-4 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                        <FileDown className="h-5 w-5" />
                        Simpan PDF
                    </button>

                    <button
                        onClick={onSaveExcel}
                        className="flex items-center justify-center text-[12px] gap-2 bg-green-600 border-2 border-green-600 hover:bg-transparent text-white hover:text-green-600 font-poppins-medium px-4 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                        <FileSpreadsheet className="h-5 w-5" />
                        Simpan Excel
                    </button>
                </div>
            </div>
        </div>
    );
}