/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, Plus, Trash, Filter } from 'lucide-react';

interface TableHeaderProps {
    title?: string;
    showTitle?: boolean;
    showHapus?: boolean;
    showTambah?: boolean;
    showTahunQuery?: boolean;
    showTahun?: boolean;
    showStatus?: boolean;
    onTambahClick?: () => void;
    onHapusClick?: () => void;
    tahunOptions?: any[];
    tahunOptionQuery?: any[];
    selectedTahun?: string;
    selectedTahunQuery?: string;
    statusOptions?: any[];
    onStatusChange?: (value: string) => void;
    selectedStatus?: string;
    searchValue?: string;
    onTahunChange?: (value: string) => void;
    onTahunQueryChange?: (value: string) => void;
    onSearchChange?: (value: string) => void;
    className?: string;
    type?: 'user' | 'admin';
}

export default function TableHeader({
    title,
    showTitle = true,
    onTambahClick,
    onHapusClick,
    showTambah = true,
    showHapus = false,
    showTahunQuery = true,
    showTahun = true,
    showStatus = false,
    selectedTahun = '',
    selectedTahunQuery = '',
    searchValue = '',
    onTahunChange,
    onTahunQueryChange,
    onSearchChange,
    statusOptions = [
        { text: 'Menunggu' },
        { text: 'Diproses' },
        { text: 'Selesai' },
        { text: 'Ditolak' },
    ],
    onStatusChange,
    selectedStatus,
    className,
    tahunOptions = [],
    tahunOptionQuery = [
        { text: '2024' },
        { text: '2025' },
    ],
    type = 'user',
}: TableHeaderProps) {
    const selectClass = "text-xs sm:text-sm px-3 py-2 sm:py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 cursor-pointer bg-white text-gray-700 font-poppins-regular hover:border-primary/50 w-full sm:w-40 appearance-none"

    return (
        <div className={`w-full bg-white flex flex-col rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 mb-3 sm:mb-4 md:mb-5 lg:mb-6 border border-gray-100 ${className}`}>
            {showTitle && (
                <div className="mb-4 sm:mb-5 flex items-center gap-3">
                    <div className="w-1 h-7 rounded-full bg-primary shrink-0" />
                    <h1 className="font-poppins-bold text-lg sm:text-xl md:text-2xl text-gray-800">
                        {title}
                    </h1>
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 md:gap-3 w-full lg:w-auto">
                    {type === 'user' && showTahun && (
                        <div className="relative w-full sm:w-40">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                            <select
                                value={selectedTahun}
                                onChange={(e) => onTahunChange?.(e.target.value)}
                                className={`${selectClass} pl-8`}
                            >
                                <option value="">Pilih Tahun</option>
                                {tahunOptions.map((item, index) => (
                                    <option key={index} value={item.text}>
                                        {item.text}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {type === 'admin' && showTahunQuery && (
                        <div className="relative w-full sm:w-40">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                            <select
                                value={selectedTahunQuery}
                                onChange={(e) => onTahunQueryChange?.(e.target.value)}
                                className={`${selectClass} pl-8`}
                            >
                                <option value="" disabled>Pilih Tahun</option>
                                {tahunOptionQuery.map((item, index) => (
                                    <option key={index} value={item.text}>
                                        {item.text}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {type === 'admin' && showStatus && (
                        <div className="relative w-full sm:w-40">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                            <select
                                value={selectedStatus}
                                onChange={(e) => onStatusChange?.(e.target.value)}
                                className={`${selectClass} pl-8`}
                            >
                                <option value="" disabled>Pilih Status</option>
                                {statusOptions.map((item, index) => (
                                    <option key={index} value={item.text}>
                                        {item.text}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="relative w-full md:w-72 group">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            placeholder="Cari data..."
                            className="text-xs sm:text-sm pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 bg-white text-gray-700 w-full font-poppins-regular hover:border-primary/50 hover:shadow-sm focus:shadow-md"
                        />
                        <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-4.5 sm:w-4.5 text-gray-400 transition-colors duration-300 group-focus-within:text-primary" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 sm:gap-2.5 md:gap-3 w-full lg:w-auto lg:min-w-fit">
                    {showTambah && (
                        <button
                            onClick={onTambahClick}
                            className="flex items-center justify-center text-xs sm:text-sm gap-2 bg-primary border-2 border-primary hover:bg-transparent text-white hover:text-primary font-poppins-medium px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 whitespace-nowrap"
                        >
                            <Plus className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0 transition-transform duration-300 group-hover:rotate-90" />
                            <span>Tambah</span>
                        </button>
                    )}
                    {showHapus && (
                        <button
                            onClick={onHapusClick}
                            className="flex items-center justify-center text-xs sm:text-sm gap-2 bg-red-500 border-2 border-red-500 hover:bg-transparent text-white hover:text-red-500 font-poppins-medium px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 whitespace-nowrap"
                        >
                            <Trash className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0" />
                            <span>Hapus Terpilih</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}