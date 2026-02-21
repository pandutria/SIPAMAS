/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, Edit2, CheckCircle, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useState } from 'react';
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

    const totalPages = Math.ceil(data.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = data.slice(startIndex, endIndex);

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

    return (
        <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-linear-to-r from-primary/20 to-primary/10 border-b-2 border-primary/30">
                            {isSelect && (
                                <th className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="w-4 h-4 text-primary bg-white border-2 border-primary/30 rounded focus:ring-primary focus:ring-2 cursor-pointer transition-all duration-200"
                                        />
                                    </div>
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-2 sm:px-8 py-3 sm:py-4 text-center font-poppins-semibold text-xs sm:text-sm text-gray-800 uppercase tracking-wider"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {(showEdit || showPreview || showSelect || showDownload) && (
                                <th className="px-2 sm:px-6 py-3 sm:py-4 text-center font-poppins-semibold text-xs sm:text-sm text-gray-800 uppercase tracking-wider">
                                    Aksi
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentData.length === 0 && data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (isSelect ? 1 : 0) + (showEdit || showPreview || showSelect || showDownload ? 1 : 0)}
                                    className="px-4 sm:px-8 py-8 sm:py-12 text-center"
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="text-gray-300">
                                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <p className="font-poppins-medium text-gray-500 text-sm sm:text-base">Tidak ada data</p>
                                        <p className="font-poppins-regular text-gray-400 text-xs sm:text-sm">Data akan muncul di sini</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            currentData.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-primary/2 transition-all duration-200 border-b border-gray-100"
                                >
                                    {isSelect && (
                                        <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected(item)}
                                                    onChange={(e) => handleSelectItem(item, e.target.checked)}
                                                    className="w-4 h-4 text-primary bg-white border-2 border-primary/30 rounded focus:ring-primary focus:ring-2 cursor-pointer transition-all duration-200"
                                                />
                                            </div>
                                        </td>
                                    )}
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-2 sm:px-8 py-3 sm:py-4 font-poppins-regular text-xs sm:text-sm text-gray-800 text-center"
                                        >
                                            {column.key === 'id' ? startIndex + index + 1 : item[column.key]}
                                        </td>
                                    ))}
                                    {(showEdit || showPreview || showSelect || showDownload) && (
                                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                                            <div className="flex items-center justify-center gap-1 sm:gap-3 flex-wrap">
                                                {showEdit && (
                                                    <button
                                                        onClick={() => onEdit?.(item)}
                                                        className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-all duration-200 cursor-pointer font-poppins-medium text-xs active:scale-95 hover:shadow-md"
                                                        title="Ubah"
                                                    >
                                                        <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span className="hidden sm:inline">{isRevisi ? "Revisi" : "Ubah"}</span>
                                                    </button>
                                                )}
                                                {showPreview && (
                                                    <button
                                                        onClick={() => onPreview?.(item)}
                                                        className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 cursor-pointer font-poppins-medium text-xs active:scale-95 hover:shadow-md"
                                                        title="Lihat"
                                                    >
                                                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span className="hidden sm:inline">Lihat</span>
                                                    </button>
                                                )}
                                                {showSelect && (
                                                    <button
                                                        onClick={() => onSelectedDataChange?.(item)}
                                                        className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 cursor-pointer font-poppins-medium text-xs active:scale-95 hover:shadow-md"
                                                        title="Pilih"
                                                    >
                                                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span className="hidden sm:inline">Pilih</span>
                                                    </button>
                                                )}
                                                {showDownload && (
                                                    <button
                                                        onClick={() => handleDownload(item)}
                                                        disabled={!item[downloadKey]}
                                                        className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-all duration-200 cursor-pointer font-poppins-medium text-xs active:scale-95 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                                                        title="Download"
                                                    >
                                                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
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
                <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="font-poppins-regular text-xs sm:text-sm text-gray-600 whitespace-nowrap">Data per halaman:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg font-poppins-regular text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value={15}>15</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-poppins-regular text-xs sm:text-sm text-gray-600">
                            Halaman {currentPage} dari {totalPages}
                        </span>
                        <span className="font-poppins-regular text-xs sm:text-sm text-gray-500">
                            ({startIndex + 1}-{Math.min(endIndex, data.length)} dari {data.length})
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg font-poppins-medium text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Sebelumnya</span>
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg font-poppins-medium text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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