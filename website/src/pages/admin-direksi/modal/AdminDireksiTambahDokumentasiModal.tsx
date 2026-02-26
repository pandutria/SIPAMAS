/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
import { useRef, useState } from "react";
import FormInput from "../../../ui/FormInput";
import addImage from "/icon/add-image.png";
import useProjectIdentity from "../../../hooks/ProjectIdentity";
import { useParams } from "react-router-dom";

interface AdminDireksiTambahDokumentasiProps {
    setShowModal: any;
    setPhotoData: any;
    type: string;
    isEdit?: boolean;
}

export default function AdminDireksiTambahDokumentasiModal({ setShowModal, type, setPhotoData, isEdit=false }: AdminDireksiTambahDokumentasiProps) {
    const [images, setImages] = useState<string[]>([]);
    const [keterangan, setKeterangan] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { handleProjectIdentityPhotoPost } = useProjectIdentity();
    const { id } = useParams();

    const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setImages((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = "";
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSimpan = () => {
        const data = images.map((image) => ({
            photo_file: image,
            title: keterangan
        }));

        if (isEdit) {
            handleProjectIdentityPhotoPost(data as any, type, Number(id));
        } else {
            setPhotoData((prev: any) => ({
            ...prev,
            [type]: [...prev[type], ...data]
        }));
        }

        setShowModal(false);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20 z-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md max-h-[90vh] overflow-y-auto relative">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white">
                    <h2 className="font-poppins-bold text-xl text-gray-800">
                        TAMBAHKAN DOKUMENTASI
                    </h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6 font-poppins-regular">
                    <div>
                        <label className="block font-poppins-medium text-sm text-gray-700 mb-2">
                            Unggah Foto <span className="text-primary">*</span>
                        </label>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleAddImage}
                        />
                        <div className="flex overflow-x-auto items-center mt-4 gap-4 pt-3 pb-2 scrollbar-hidden">
                            <img
                                src={addImage}
                                className="w-16 shrink-0 cursor-pointer hover:scale-95 hover:opacity-95 duration-200 h-auto"
                                alt=""
                                onClick={() => inputRef.current?.click()}
                            />
                            {images.map((src, index) => (
                                <div key={index} className="relative shrink-0">
                                    <img
                                        src={src}
                                        className="w-16 h-16 object-cover rounded-lg"
                                        alt={`upload-${index}`}
                                    />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <FormInput
                        title="Keterangan"
                        placeholder="Masukkan Keterangan"
                        type="textarea"
                        value={keterangan}
                        onChange={(e: any) => setKeterangan(e.target.value)}
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