/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
import { useState } from "react";
import FormInput from "../../../ui/FormInput";
import FormUploadFile from "../../../ui/FormUploadFile";
import useProjectIdentity from "../../../hooks/ProjectIdentity";
import { useParams } from "react-router-dom";

interface AdminDireksiTambahDokumentasiProps {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setDocumentData: React.Dispatch<
        React.SetStateAction<ProjectIdentityDocumentProps[]>
    >;
    isEdit?: boolean;
}

export default function AdminDireksiTambahDokumenModal({ setShowModal, setDocumentData, isEdit = false }: AdminDireksiTambahDokumentasiProps) {
    const [docFile, setDocFile] = useState<File | null>(null);
    const [category, setCategory] = useState("");
    const { handleProjectIdentityDocumentPost } = useProjectIdentity();
    const { id } = useParams();

    const handleSimpan = () => {
        if (!docFile) return;

        if (isEdit) {
            const newData: ProjectIdentityDocumentProps = {
                id: 0,
                photo_file: docFile,
                name: docFile.name,
                kategori: category,
                created_at: new Date().toLocaleDateString("id-ID"),
            };

            handleProjectIdentityDocumentPost(newData, Number(id));
        } else {
            setDocumentData(prev => {
                const nextId =
                    prev.length > 0
                        ? Math.max(...prev.map(item => item.id)) + 1
                        : 1;

                const newData: ProjectIdentityDocumentProps = {
                    id: nextId,
                    photo_file: docFile,
                    name: docFile.name,
                    kategori: category,
                    created_at: new Date().toLocaleDateString("id-ID"),
                };

                return [...prev, newData];
            });
        }

        setShowModal(false);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20 z-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md max-h-[90vh] overflow-y-auto relative">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white">
                    <h2 className="font-poppins-bold text-xl text-gray-800">
                        TAMBAHKAN DOKUMEN LAINNYA
                    </h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6 font-poppins-regular">
                    <FormUploadFile
                        title="Unggah Dokumen"
                        name="doc"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setDocFile(e.target.files?.[0] ?? null)
                        }
                    />

                    <FormInput
                        title="Kategori"
                        placeholder="Masukkan Kategori"
                        value={category}
                        onChange={(e: any) => setCategory(e.target.value)}
                    />

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setShowModal(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-poppins-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSimpan}
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-poppins-medium hover:bg-primary/90 transition-all duration-200"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}