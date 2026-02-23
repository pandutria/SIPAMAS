/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: any) => void;
    data: PengaduanProps
}

export default function SuperAdminModalLaporanDetail({ isOpen, onClose, data }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/20"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="font-poppins-bold text-xl text-gray-800">
                        Detail Laporan
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-8">
                    
                </div>
            </div>
        </div>
    )
}
