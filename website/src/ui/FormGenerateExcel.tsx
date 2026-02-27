import { Download, Upload } from "lucide-react";
import type React from "react";

interface formGenerateExcelProps {
    title: string;
    handleDownloadTemplate: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave?: () => void;
}

export default function FormGenerateExcel({ title, handleFileChange, handleDownloadTemplate, handleSave }: formGenerateExcelProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="font-poppins-bold text-xl text-gray-800 mb-6">
                Detail
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <label className="block font-poppins-medium text-sm text-gray-700 mb-2">
                        Input File .xlsx
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".xlsx"
                            className="hidden"
                            id="file-upload"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg font-poppins text-gray-700 hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                        >
                            <Upload className="h-5 w-5 text-primary" />
                            <span>Pilih File Excel</span>
                        </label>
                    </div>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => handleDownloadTemplate()}
                        className="flex items-center text-[12px] cursor-pointer gap-2 px-6 py-2.5 border border-primary text-primary hover:bg-primary hover:text-white font-poppins-medium rounded-lg transition-all duration-200"
                    >
                        <Download className="h-4 w-4" />
                        Unduh Template {title}
                    </button>
                </div>
                <div className="flex lg:justify-end justify-start items-end">
                    <button
                        onClick={handleSave}
                        className="px-8 py-2.5 text-[12px] cursor-pointer border-2 border-primary hover:bg-transparent hover:text-primary bg-primary h-fit w-fit text-white font-poppins-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    )
}
