/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
import FormSelect from "../../../ui/FormSelect";
import SubmitButton from "../../../ui/SubmitButton";
import useUserHooks from "../../../hooks/UserHooks";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: any) => void;
    data: PengaduanProps
}

export default function SuperAdminUbahStatusPengguna({ isOpen, onClose, data }: ModalProps) {
    const { isActive, handleChangeUser, handleVerificationUserPut } = useUserHooks();

    const statusOptions = [
        {
            id: 1,
            text: "Tidak Aktif",
            value: "false"
        },
        {
            id: 2,
            text: "Aktif",
            value: "true"
        },
    ];

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-10000 overflow-hidden flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/20"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col font-poppins-medium">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="font-poppins-bold text-xl text-gray-800">
                        Ubah Status Pengguna
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
                        value={isActive}
                        name="isActive"
                        onChange={handleChangeUser}
                    >
                        {statusOptions.map((item) => (
                            <option key={item.id} value={item.value}>{item.text}</option>
                        ))}
                    </FormSelect>
                    <SubmitButton
                        text="Ubah"
                        onClick={() => handleVerificationUserPut(data.id)}
                    />
                </div>
            </div>
        </div>
    )
}
