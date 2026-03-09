/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, ChevronDown, Calendar, Package, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import useRealisasiHooks from '../hooks/RealisasiHooks';
import { SwalMessage } from '../utils/SwalMessage';

interface searchDataProps {
    setSelectedRealization: any
}

export default function SearchData({ setSelectedRealization }: searchDataProps) {
    interface OptionProps {
        label?: string;
        text: string;
        ppk?: string;
    }

    const [tahunAnggaran, setTahunAnggaran] = useState<string>('');
    const [paket, setPaket] = useState<string>('');
    const [searchTahun, setSearchTahun] = useState<string>('');
    const [searchPaket, setSearchPaket] = useState<string>('');

    const { realisasiData, tahunData } = useRealisasiHooks();

    const [openDropdown, setOpenDropdown] = useState<string>('');
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const sectionRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const paketCode: OptionProps[] = realisasiData.map((item: any) => ({
        label: item?.nama,
        text: item?.nama,
        ppk: item?.schedule?.created_by?.fullname,
    }));

    const transformedTahunData: OptionProps[] = tahunData?.map((item: any) => {
        if (typeof item === 'string' || typeof item === 'number') return { text: String(item) };
        if (item?.text) return { text: String(item.text) };
        return item;
    }) || [];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filterOptions = (options: OptionProps[], searchTerm: string) =>
        options.filter(option =>
            option?.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (option?.label && option.label.toLowerCase().includes(searchTerm.toLowerCase()))
        );

    const handleSearch = () => {
        if (!paket || !tahunAnggaran) {
            SwalMessage({ type: "error", title: "Gagal!", text: "Semua field harus diisi!" });
            return;
        }

        setIsSearching(true);
        setTimeout(() => {
            const realisasiBySearch = realisasiData.filter((item) => {
                const paketFilter = item.schedule.rab?.proyek.nama?.toLowerCase()?.includes(paket.toLowerCase());
                const tahunFilter = item.schedule.rab?.proyek.tahun_anggaran?.includes(tahunAnggaran);
                return paketFilter && tahunFilter;
            });

            setSelectedRealization(realisasiBySearch);
            window.scrollTo({ top: 4360, behavior: "smooth" });
            setIsSearching(false);
        }, 500);
    };
    console.log(window.scrollY)

    const renderDropdown = (
        id: string,
        label: string,
        icon: React.ReactNode,
        value: string,
        setValue: (val: string) => void,
        searchValue: string,
        setSearchValue: (val: string) => void,
        options: OptionProps[],
        isPaket?: boolean
    ) => {
        const isOpen = openDropdown === id;
        const filteredOptions = filterOptions(options, searchValue);
        const selectedOption = options.find(opt => opt.text === value);

        return (
            <div className="relative group">
                <label className="block text-sm font-poppins-semibold text-gray-700 mb-2.5 items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-third to-secondary shrink-0"></span>
                    <span>{label}</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                        <div className="p-1.5 rounded-lg bg-primary/30 transition-all duration-300">
                            {icon}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpenDropdown(isOpen ? '' : id)}
                        className="w-full pl-14 sm:pl-16 pr-10 py-3.5 sm:py-4 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-hover/40 text-left bg-white hover:border-hover/40 hover:shadow-lg"
                    >
                        <span className={`font-poppins-medium text-sm sm:text-base truncate block ${selectedOption ? 'text-gray-800' : 'text-gray-400'}`}>
                            {isPaket ? (
                                selectedOption
                                    ? `${selectedOption.label} (${selectedOption.text})`
                                    : "Pilih Paket"
                            ) : (
                                selectedOption ? selectedOption.text : `Pilih ${label}`
                            )}
                        </span>
                    </button>
                    <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                        <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 text-third transition-all duration-300 ${isOpen ? 'rotate-180 scale-110' : ''}`} />
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute z-30 w-full mt-2 bg-white border-2 border-hover rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                        <div className="p-2.5 sm:p-3 bg-linear-to-r from-hover/40 to-hover/50 border-b border-hover/40">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-third" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Cari..."
                                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-hover rounded-lg focus:outline-none focus:border-third focus:ring-2 focus:ring-hover bg-white font-poppins-regular text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                        <div className="max-h-48 sm:max-h-56 overflow-y-auto custom-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.text}
                                        type="button"
                                        onClick={() => { setValue(option.text); setSearchValue(''); setOpenDropdown(''); }}
                                        className={`w-full font-poppins-regular text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-linear-to-r hover:from-hover/40 hover:to-hover/50 transition-all duration-200 border-b border-gray-100 last:border-0 ${value === option.text ? 'font-poppins-semibold border-l-4 text-primary' : ''}`}
                                    >
                                        {isPaket ? (
                                            <div className="flex flex-col">
                                                <span className="flex items-center space-x-2">
                                                    {value === option.text && <span className="w-2 h-2 rounded-full bg-third animate-pulse shrink-0"></span>}
                                                    <span className="font-poppins-semibold text-sm leading-snug">{option.label}</span>
                                                </span>
                                                {option.label && <span className="text-xs text-gray-500 mt-0.5 ml-4">{(option.text)}</span>}
                                            </div>
                                        ) : (
                                            <span className="flex items-center space-x-2 text-sm">
                                                {value === option.text && <span className="w-2 h-2 rounded-full bg-third animate-pulse shrink-0"></span>}
                                                <span>{option.text}</span>
                                            </span>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-5 text-gray-400 text-sm text-center font-poppins-regular">
                                    <div className="flex flex-col items-center space-y-2">
                                        <Search className="h-7 w-7 text-gray-300" />
                                        <span>Tidak ada hasil</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            ref={sectionRef}
            className="min-h-screen flex items-center via-white to-hover/20"
        >
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-10 sm:pb-16">
                <div className={`text-center mb-6 sm:mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-linear-to-r from-hover/30 to-hover/30 rounded-full mb-3 sm:mb-4">
                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                        <span className="text-xs sm:text-sm font-poppins-semibold text-primary">Sistem Pencarian Data</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-poppins-bold mb-3 sm:mb-4 bg-linear-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent leading-tight px-2">
                        Realisasi Pekerjaan Proyek
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-poppins-regular leading-relaxed px-2">
                        Cari dan lihat detail realisasi pekerjaan berdasarkan tahun anggaran dan paket pekerjaan dengan mudah dan cepat
                    </p>
                </div>

                <div
                    ref={dropdownRef}
                    className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 lg:p-10 transition-all duration-1000 delay-200 border border-hover ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)' }}
                >
                    <div className="mb-5 sm:mb-6">
                        <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                            <div className="w-1 h-7 sm:h-8 bg-linear-to-b from-third to-secondary rounded-full"></div>
                            <h2 className="text-xl sm:text-2xl font-poppins-bold text-gray-800">Filter Pencarian</h2>
                        </div>
                        <div className="h-px bg-linear-to-r from-hover via-third to-hover"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        {renderDropdown(
                            'tahun', 'Tahun Anggaran',
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-third" />,
                            tahunAnggaran, setTahunAnggaran,
                            searchTahun, setSearchTahun,
                            transformedTahunData
                        )}
                        {renderDropdown(
                            'paket', 'Paket',
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-third" />,
                            paket, setPaket,
                            searchPaket, setSearchPaket,
                            paketCode,
                            true
                        )}
                    </div>

                    <div className="flex justify-center pt-1 sm:pt-3">
                        <button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className={`group relative w-full sm:w-auto flex items-center justify-center space-x-3 bg-linear-to-b from-primary to-secondary/80 text-white font-poppins-semibold px-8 sm:px-10 py-3 sm:py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden ${isSearching ? '' : 'hover:scale-105'}`}
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                            {isSearching ? (
                                <>
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="relative z-10 text-sm sm:text-base">Mencari...</span>
                                </>
                            ) : (
                                <>
                                    <Search className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                    <span className="relative z-10 text-sm sm:text-base">Cari Data Realisasi</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-hover">
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 font-poppins-regular">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 shrink-0"></div>
                                <span>Data Tersedia</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-third shrink-0"></div>
                                <span>Sedang Diproses</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0"></div>
                                <span>Tidak Tersedia</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}