/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, Plus, Trash } from 'lucide-react';

interface TableHeaderProps {
    title: string;
    showHapus?: boolean;
    showTambah?: boolean;
    showTahunQuery?: boolean;
    onTambahClick?: () => void;
    onHapusClick?: () => void;
    tahunOptions?: any[];
    tahunOptionQuery?: any[];
    satuanKerjaOptions?: any[];
    selectedTahun?: string;
    selectedTahunQuery?: string;
    selectedSatuanKerja?: string;
    searchValue?: string;
    onTahunChange?: (value: string) => void;
    onTahunQueryChange?: (value: string) => void;
    onSatuanKerjaChange?: (value: string) => void;
    onSearchChange?: (value: string) => void;
    className?: string;
    type?: 'ppk' | 'pokja';   
}

export default function TableHeader({
    title,
    onTambahClick,
    onHapusClick,
    showTambah = true,
    showHapus = false,
    showTahunQuery = true,
    selectedTahun = '',
    selectedTahunQuery = '',
    selectedSatuanKerja = '',
    searchValue = '',
    onTahunChange,
    onTahunQueryChange,
    onSatuanKerjaChange,
    onSearchChange,
    className,
    tahunOptions = [],
    tahunOptionQuery = [
        { text: '2024' },
        { text: '2025' }
    ],
    satuanKerjaOptions = [],
    type = "ppk",
}: TableHeaderProps) {
    return (
        <div className={`w-full bg-white flex flex-col rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 mb-3 sm:mb-4 md:mb-5 lg:mb-6 shadow-sm ${className}`}>
            <div className="mb-3 sm:mb-4 md:mb-5">
                <h1 className="font-poppins-bold text-lg sm:text-xl md:text-2xl text-gray-800">
                    {title}
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 md:gap-3 w-full lg:w-auto">
                    {type === 'ppk' && (
                        <>
                            <select
                                value={selectedTahun}
                                onChange={(e) => onTahunChange?.(e.target.value)}
                                className="text-xs sm:text-sm px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 cursor-pointer bg-white text-gray-700 font-poppins-regular hover:border-gray-400 w-full sm:w-40"
                            >
                                <option value="">Pilih Tahun</option>
                                {tahunOptions.map((item, index) => (
                                    <option key={index} value={item.text}>
                                        {item.text}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedSatuanKerja}
                                onChange={(e) => onSatuanKerjaChange?.(e.target.value)}
                                className="text-xs sm:text-sm px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 cursor-pointer bg-white text-gray-700 font-poppins-regular hover:border-gray-400 w-full sm:w-56"
                            >
                                <option value="">Pilih Satuan Kerja</option>
                                {satuanKerjaOptions.map((item, index) => (
                                    <option key={index} value={item.text}>
                                        {item.text}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    {type === 'pokja' && showTahunQuery && (
                        <select
                            value={selectedTahunQuery}
                            onChange={(e) => onTahunQueryChange?.(e.target.value)}
                            className="text-xs sm:text-sm px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 cursor-pointer bg-white text-gray-700 font-poppins-regular hover:border-gray-400 w-full sm:w-40"
                        >
                            <option value="" disabled>Pilih Tahun</option>
                            {tahunOptionQuery.map((item, index) => (
                                <option key={index} value={item.text}>
                                    {item.text}
                                </option>
                            ))}
                        </select>
                    )}

                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            placeholder="Cari..."
                            className="text-xs sm:text-sm pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-white text-gray-700 w-full font-poppins-regular hover:border-gray-400"
                        />
                        <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 sm:gap-2.5 md:gap-3 w-full lg:w-auto lg:min-w-fit">
                    {showTambah && (
                        <button
                            onClick={onTambahClick}
                            className="flex items-center justify-center text-xs sm:text-sm gap-2 bg-primary border-2 border-primary hover:bg-transparent text-white hover:text-primary font-poppins-medium px-4 py-2 sm:py-2.5 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md whitespace-nowrap"
                        >
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                            <span>Tambah</span>
                        </button>
                    )}
                    {showHapus && (
                        <button
                            onClick={onHapusClick}
                            className="flex items-center justify-center text-xs sm:text-sm gap-2 bg-red-600 border-2 border-red-600 hover:bg-transparent text-white hover:text-red-600 font-poppins-medium px-4 py-2 sm:py-2.5 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md whitespace-nowrap"
                        >
                            <Trash className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                            <span>Hapus Terpilih</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}