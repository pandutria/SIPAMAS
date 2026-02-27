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
    }

    const [tahunAnggaran, setTahunAnggaran] = useState<string>('');
    const [paket, setPaket] = useState<string>('');

    const [searchTahun, setSearchTahun] = useState<string>('');
    const [searchPaket, setSearchPaket] = useState<string>('');

    const {
        realisasiData,
        tahunData,
    } = useRealisasiHooks();

    const [openDropdown, setOpenDropdown] = useState<string>('');
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const sectionRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const paketCode = realisasiData.map((item: any) => ({
        label: item?.nama_paket,
        text: item?.kode_paket
    }))
    
    const transformedTahunData = tahunData?.map((item: any) => {
        if (typeof item === 'string' || typeof item === 'number') {
            return { text: String(item) };
        }
        if (item?.text) {
            return { text: String(item.text) };
        }
        return item;
    }) || [];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef!.current) {
                observer.unobserve(sectionRef!.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filterOptions = (options: OptionProps[], searchTerm: string) => {
        return options.filter(option =>
            option?.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (option?.label && option.label.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const handleSearch = () => {
        if (!paket || !tahunAnggaran) {
            SwalMessage({
                type: "error",
                title: "Gagal!",
                text: "Harap pilih tahun / paket terlebih dahulu!"
            });

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
            window.scrollTo({
                top: 1000,
                behavior: "smooth"
            });
            setIsSearching(false);
        }, 500);
    };

    const renderDropdown = (
        id: string,
        label: string,
        icon: React.ReactNode,
        value: string,
        setValue: (val: string) => void,
        searchValue: string,
        setSearchValue: (val: string) => void,
        options: OptionProps[]
    ) => {
        const isOpen = openDropdown === id;
        const filteredOptions = filterOptions(options, searchValue);
        const selectedOption = options.find(opt => opt.text === value);

        return (
            <div className="relative group">
                <label className="text-sm font-poppins-semibold text-gray-700 mb-3 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-third to-secondary"></span>
                    <span>{label}</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <div className="p-1.5 rounded-lg bg-linear-to-br from-hover to-hover group-hover:from-hover group-hover:to-hover transition-all duration-300">
                            {icon}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpenDropdown(isOpen ? '' : id)}
                        className="w-full pl-16 pr-12 py-4 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-third focus:ring-4 focus:ring-hover text-left bg-white hover:border-third hover:shadow-lg group-hover:bg-linear-to-r group-hover:from-white group-hover:to-hover/30"
                    >
                        <span className={`font-poppins-medium ${selectedOption ? 'text-gray-800' : 'text-gray-400'}`}>
                            {label === "Paket" ? (
                                selectedOption ? `${selectedOption.label} (${selectedOption.text})` : realisasiData?.[realisasiData.length - 1]?.schedule.rab?.proyek.nama ? `${realisasiData[realisasiData.length - 1].schedule.rab?.proyek.nama} (${realisasiData[realisasiData.length - 1].schedule.rab?.proyek.nama})` : "Tidak Ada"
                            ) : (
                                selectedOption ? selectedOption.text : `Pilih ${label}`
                            )}
                        </span>
                    </button>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <ChevronDown
                            className={`h-5 w-5 text-third transition-all duration-300 ${isOpen ? 'rotate-180 scale-110' : ''}`}
                        />
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute z-20 w-full mt-3 bg-white border-2 border-hover rounded-xl shadow-2xl animate-fade-in overflow-hidden">
                        <div className="p-3 bg-linear-to-r from-hover to-hover/50 border-b border-hover">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-third" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Cari..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-hover rounded-lg focus:outline-none focus:border-third focus:ring-2 focus:ring-hover bg-white font-poppins-regular text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                        <div className="max-h-56 overflow-y-auto custom-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) => (
                                    <button
                                        key={option.text}
                                        type="button"
                                        onClick={() => {
                                            setValue(option.text);
                                            setSearchValue('');
                                            setOpenDropdown('');
                                        }}
                                        className={`w-full font-poppins-regular text-left px-4 py-3 hover:bg-linear-to-r hover:from-hover hover:to-hover/50 transition-all duration-200 border-b border-gray-100 last:border-0 ${
                                            value === option.text ? 'bg-linear-to-r from-hover to-hover font-poppins-semibold border-l-4 border-l-third' : ''
                                        } ${index === 0 ? 'rounded-t-lg' : ''} ${index === filteredOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                                        style={{ color: value === option.text ? '#f60' : '#374151' }}
                                    >
                                        {label === "Paket" ? (
                                            <div className="flex flex-col">
                                                <span className="flex items-center space-x-2">
                                                    {value === option.text && (
                                                        <span className="w-2 h-2 rounded-full bg-third animate-pulse"></span>
                                                    )}
                                                    <span className="font-poppins-semibold">{option.label}</span>
                                                </span>
                                                {option.label && (
                                                    <span className="text-xs text-gray-500 mt-1 ml-4">({option.text})</span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="flex items-center space-x-2">
                                                {value === option.text && (
                                                    <span className="w-2 h-2 rounded-full bg-third animate-pulse"></span>
                                                )}
                                                <span>{option.text}</span>
                                            </span>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-gray-400 text-sm text-center font-poppins-regular">
                                    <div className="flex flex-col items-center space-y-2">
                                        <Search className="h-8 w-8 text-gray-300" />
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
            className="lg:h-screen h-auto flex items-center px-4 md:px-8"
            data-aos="fade-up"
            data-aos-duration="1000"
        >
            <div className="max-w-7xl mx-auto w-full">
                <div
                    className={`text-center mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-hover to-hover rounded-full mb-4">
                        <Sparkles className="h-4 w-4 text-third" />
                        <span className="text-sm font-poppins-semibold text-secondary">Sistem Pencarian Data</span>
                    </div>
                    <h1
                        className="text-3xl md:text-4xl lg:text-5xl font-poppins-bold mb-4 bg-linear-to-r from-secondary via-third to-secondary bg-clip-text text-transparent"
                    >
                        Realisasi Aduan Masyarakat
                    </h1>
                    <p className="text-gray-600 text-[12px] md:text-lg max-w-3xl mx-auto font-poppins-regular leading-relaxed">
                        Cari dan lihat detail realisasi pekerjaan konstruksi berdasarkan tahun anggaran, satuan kerja, dan paket aduan dengan mudah dan cepat
                    </p>
                </div>

                <div
                    ref={dropdownRef}
                    className={`bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 transition-all duration-1000 delay-200 border border-hover ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                    style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)'
                    }}
                >
                    <div className="mb-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-1 h-8 bg-linear-to-b from-third to-secondary rounded-full"></div>
                            <h2 className="text-2xl font-poppins-bold text-gray-800">Filter Pencarian</h2>
                        </div>
                        <div className="h-px bg-linear-to-r from-hover via-third to-hover"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {renderDropdown(
                            'tahun',
                            'Tahun Anggaran',
                            <Calendar className="h-5 w-5 text-third" />,
                            tahunAnggaran,
                            setTahunAnggaran,
                            searchTahun,
                            setSearchTahun,
                            transformedTahunData
                        )}

                        {renderDropdown(
                            'paket',
                            'Paket',
                            <Package className="h-5 w-5 text-third" />,
                            paket,
                            setPaket,
                            searchPaket,
                            setSearchPaket,
                            paketCode as any
                        )}
                    </div>

                    <div className="flex justify-center pt-3">
                        <button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className={`group bg-linear-to-b from-third to-secondary relative flex items-center space-x-3 text-white font-poppins-semibold px-10 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden ${
                                isSearching ? '' : 'hover:scale-105'
                            }`}
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                            
                            {isSearching ? (
                                <>
                                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="relative z-10">Mencari...</span>
                                </>
                            ) : (
                                <>
                                    <Search className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                    <span className="relative z-10">Cari Data Realisasi</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}