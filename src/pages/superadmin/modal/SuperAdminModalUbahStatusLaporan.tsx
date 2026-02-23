/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
import FormSelect from "../../../ui/FormSelect";
import { useEffect, useState } from "react";
import SubmitButton from "../../../ui/SubmitButton";
import usePengaduanHooks from "../../../hooks/PengaduanHooks";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: any) => void;
    data: PengaduanProps
}

export default function SuperAdminModalUbahStatusLaporan({ isOpen, onClose, data }: ModalProps) {
    const [status, setStatus] = useState("");
    const { handlePengaduanStatusPut } = usePengaduanHooks();

    const statusOptions = [
        {
            id: 2,
            text: "Menunggu"
        },
        {
            id: 2,
            text: "Diproses"
        },
        {
            id: 3,
            text: "Diterima"
        },
        {
            id: 4,
            text: "Ditolak"
        },
    ];

    useEffect(() => {
        const fetchStatus = async() => {
            if (data) {
                setStatus(data.status ?? "");
            }
        }

        fetchStatus();
    }, [data]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/20"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col font-poppins-medium">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="font-poppins-bold text-xl text-gray-800">
                        Ubah Status Pengaduan
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-2 flex flex-col">
                    <FormSelect
                        title="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        {statusOptions.map((item) => (
                            <option key={item.id} value={item.text}>{item.text}</option>
                        ))}
                    </FormSelect>
                    <SubmitButton
                        text="Ubah"
                        onClick={() => handlePengaduanStatusPut(status, data.id)}
                    />
                </div>
            </div>
        </div>
    )
}
