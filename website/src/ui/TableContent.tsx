/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, Edit2, CheckCircle, ChevronLeft, ChevronRight, Download, FileX } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { BASE_URL_FILE } from '../server/API';

interface TableColumn {
    key: string;
    label: string;
}

interface TableContentProps {
    columns: TableColumn[];
    data: any[];
    isSelect?: boolean;
    showEdit?: boolean;
    showPreview?: boolean;
    showSelect?: boolean;
    showDownload?: boolean;
    downloadKey?: string;
    onEdit?: (item: any) => void;
    onPreview?: (item: any) => void;
    idKey?: string;
    onSelectedIdsChange?: (ids: any[]) => void;
    onSelectedDataChange?: (data: any[]) => void;
    isRevisi?: boolean;
}

export default function TableContent({
    columns,
    data,
    isSelect = false,
    showEdit = true,
    showPreview = true,
    showSelect = false,
    showDownload = false,
    downloadKey = 'file_url',
    onEdit,
    onPreview,
    idKey = 'id',
    onSelectedIdsChange,
    onSelectedDataChange,
    isRevisi = false,
}: TableContentProps) {
    const [selectedIds, setSelectedIds] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [visibleRows, setVisibleRows] = useState<Set<number>>(new Set());
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

    const totalPages = Math.ceil(data.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = data.slice(startIndex, endIndex);

    useEffect(() => {
        setVisibleRows(new Set());
        const timers: ReturnType<typeof setTimeout>[] = [];
        currentData.forEach((_, index) => {
            const timer = setTimeout(() => {
                setVisibleRows(prev => new Set([...prev, index]));
            }, index * 50);
            timers.push(timer);
        });
        return () => timers.forEach(clearTimeout);
    }, [currentPage, pageSize, data]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = currentData.map(item => item[idKey]);
            setSelectedIds(allIds);
            onSelectedIdsChange?.(allIds);
            onSelectedDataChange?.(currentData);
        } else {
            setSelectedIds([]);
            onSelectedIdsChange?.([]);
            onSelectedDataChange?.([]);
        }
    };

    const handleSelectItem = (item: any, checked: boolean) => {
        const itemId = item[idKey];
        let newSelectedIds: any[];
        if (checked) {
            newSelectedIds = [...selectedIds, itemId];
        } else {
            newSelectedIds = selectedIds.filter(id => id !== itemId);
        }
        setSelectedIds(newSelectedIds);
        onSelectedIdsChange?.(newSelectedIds);
        const selectedData = data.filter(d => newSelectedIds.includes(d[idKey]));
        onSelectedDataChange?.(selectedData);
    };

    const isSelected = (item: any) => selectedIds.includes(item[idKey]);
    const isAllSelected = currentData.length > 0 && currentData.every(item => isSelected(item));

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleDownload = (item: any) => {
        const path = item[downloadKey];
        if (!path) return;
        const cleanPath = path.replace(/\\/g, '/');
        window.open(`${BASE_URL_FILE}/${cleanPath}`, '_blank');
    };

    const hasActions = showEdit || showPreview || showSelect || showDownload;
    const colSpan = columns.length + (isSelect ? 1 : 0) + (hasActions ? 1 : 0);

    return (
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            style={{ transition: 'box-shadow 0.3s ease' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}
        >

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className='bg-linear-to-tr from-primary/60 to-secondary/60'
                        >
                            {isSelect && (
                                <th className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="checkbox-custom w-4 h-4 text-primary bg-white border-2 border-primary/30 rounded focus:ring-primary focus:ring-2 cursor-pointer"
                                        />
                                    </div>
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="header-th px-2 sm:px-8 py-3 sm:py-4 text-center font-poppins-semibold text-xs sm:text-sm text-gray-800 uppercase tracking-wider cursor-default select-none"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {hasActions && (
                                <th className="header-th px-2 sm:px-6 py-3 sm:py-4 text-center font-poppins-semibold text-xs sm:text-sm text-gray-800 uppercase tracking-wider">
                                    Aksi
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentData.length === 0 ? (
                            <tr>
                                <td colSpan={colSpan} className="px-4 sm:px-8 py-12 sm:py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="float-icon text-gray-200">
                                            <FileX className="w-16 h-16 mx-auto" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="font-poppins-medium text-gray-500 text-sm sm:text-base mb-1">Tidak ada data</p>
                                            <p className="font-poppins-regular text-gray-400 text-xs sm:text-sm">Data akan muncul di sini</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            currentData.map((item, index) => (
                                <tr
                                    key={index}
                                    ref={el => { rowRefs.current[index] = el; }}
                                    className={`row-animate ${visibleRows.has(index) ? 'visible' : ''}`}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        backgroundColor: hoveredRow === index
                                            ? 'rgba(var(--color-primary-rgb, 59,130,246),0.04)'
                                            : isSelected(item)
                                                ? 'rgba(var(--color-primary-rgb, 59,130,246),0.06)'
                                                : index % 2 === 0 ? '#ffffff' : '#fafafa',
                                        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                                        boxShadow: hoveredRow === index ? 'inset 3px 0 0 rgba(var(--color-primary-rgb,59,130,246),0.5)' : 'none',
                                    }}
                                    onMouseEnter={() => setHoveredRow(index)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                >
                                    {isSelect && (
                                        <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected(item)}
                                                    onChange={(e) => handleSelectItem(item, e.target.checked)}
                                                    className="checkbox-custom w-4 h-4 text-primary bg-white border-2 border-primary/30 rounded focus:ring-primary focus:ring-2 cursor-pointer"
                                                />
                                            </div>
                                        </td>
                                    )}
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-2 sm:px-8 py-3 sm:py-4 font-poppins-regular text-xs sm:text-sm text-gray-700 text-center"
                                        >
                                            {column.key === 'id' ? (
                                                <span
                                                    className="px-2 sm:px-8 py-3 sm:py-4 font-poppins-regular text-xs sm:text-sm text-gray-700 text-center"
                                                >
                                                    {startIndex + index + 1}
                                                </span>
                                            ) : item[column.key]}
                                        </td>
                                    ))}
                                    {hasActions && (
                                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                                            <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                                                {showEdit && (
                                                    <button
                                                        onClick={() => onEdit?.(item)}
                                                        className="btn-action inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg font-poppins-medium text-xs"
                                                        title="Ubah"
                                                    >
                                                        <Edit2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                        <span className="hidden sm:inline">{isRevisi ? 'Revisi' : 'Ubah'}</span>
                                                    </button>
                                                )}
                                                {showPreview && (
                                                    <button
                                                        onClick={() => onPreview?.(item)}
                                                        className="btn-action inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-poppins-medium text-xs"
                                                        title="Lihat"
                                                    >
                                                        <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                        <span className="hidden sm:inline">Lihat</span>
                                                    </button>
                                                )}
                                                {showSelect && (
                                                    <button
                                                        onClick={() => onSelectedDataChange?.(item)}
                                                        className="btn-action inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg font-poppins-medium text-xs"
                                                        title="Pilih"
                                                    >
                                                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                        <span className="hidden sm:inline">Pilih</span>
                                                    </button>
                                                )}
                                                {showDownload && (
                                                    <button
                                                        onClick={() => handleDownload(item)}
                                                        disabled={!item[downloadKey]}
                                                        className="btn-action inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg font-poppins-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                                                        title="Download"
                                                    >
                                                        <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                        <span className="hidden sm:inline">Download</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {data.length > 0 && (
                <div
                    className="px-3 sm:px-6 py-3 sm:py-4 flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between"
                    style={{
                        borderTop: '1px solid rgba(var(--color-primary-rgb,59,130,246),0.1)',
                        background: 'linear-gradient(135deg, rgba(var(--color-primary-rgb,59,130,246),0.03) 0%, #ffffff 100%)'
                    }}
                >
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="font-poppins-regular text-xs sm:text-sm text-gray-500 whitespace-nowrap">Data per halaman:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            className="select-animated px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200 rounded-lg font-poppins-regular text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white shadow-sm"
                        >
                            <option value={15}>15</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-poppins-medium text-xs sm:text-sm text-gray-600">
                            Halaman {currentPage} dari {totalPages}
                        </span>
                        <span className="font-poppins-regular text-xs text-gray-400">
                            ({startIndex + 1}–{Math.min(endIndex, data.length)} dari {data.length} data)
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="page-btn inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 rounded-lg font-poppins-medium text-xs sm:text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed bg-white shadow-sm"
                        >
                            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Sebelumnya</span>
                        </button>

                        <div className="hidden sm:flex items-center gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let page: number;
                                if (totalPages <= 5) {
                                    page = i + 1;
                                } else if (currentPage <= 3) {
                                    page = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    page = totalPages - 4 + i;
                                } else {
                                    page = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className="page-btn w-8 h-8 rounded-lg font-poppins-medium text-xs flex items-center justify-center border transition-all duration-200"
                                        style={{
                                            background: currentPage === page
                                                ? 'linear-gradient(135deg, var(--color-primary,#3b82f6), var(--color-secondary,#6366f1))'
                                                : 'white',
                                            color: currentPage === page ? 'white' : '#6b7280',
                                            borderColor: currentPage === page ? 'transparent' : '#e5e7eb',
                                            boxShadow: currentPage === page ? '0 2px 8px rgba(59,130,246,0.4)' : '',
                                        }}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="page-btn inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 rounded-lg font-poppins-medium text-xs sm:text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed bg-white shadow-sm"
                        >
                            <span className="hidden sm:inline">Selanjutnya</span>
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}