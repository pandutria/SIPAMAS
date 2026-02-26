import { Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../ui/LoadingSpinner';
import FormInput from '../../ui/FormInput';
import BackButton from '../../ui/BackButton';
import usePengaduanHooks from '../../hooks/PengaduanHooks';
import FormSelect from '../../ui/FormSelect';
import { useRef, useState } from 'react';
import SubmitButton from '../../ui/SubmitButton';
import { Plus, Trash2, FileVideo, ImageIcon, Upload } from 'lucide-react';

export default function MasyarakatLaporanBaru() {
    const {
        pengaduanForm,
        handlePegaduanChangeForm,
        handlePengaduanPost
    } = usePengaduanHooks();
    const [mediaFilesData, setMediaFilesData] = useState<PengaduanMediaProps[]>([]);
    const [previews, setPreviews] = useState<{ url: string; tipe: string; name: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, loading } = useAuth();

    const kategoriLaporanOptions = [
        { id: 1, text: "Kualitas" },
        { id: 2, text: "Keterlambatan" },
        { id: 3, text: "Dampak Sosial" },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        files.forEach((file, i) => {
            const url = URL.createObjectURL(file);
            const tipe = file.type.startsWith("video") ? "video" : "foto";

            setPreviews(prev => [...prev, { url, tipe, name: file.name }]);
            setMediaFilesData(prev => [
                ...prev,
                {
                    id: Date.now() + i,
                    pengaduan_id: 0,
                    media_file: file,
                    media_tipe: tipe,
                }
            ]);
        });

        e.target.value = "";
    };

    const handleRemove = (index: number) => {
        URL.revokeObjectURL(previews[index].url);
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setMediaFilesData(prev => prev.filter((_, i) => i !== index));
    };

    if (loading) return <LoadingSpinner />;
    if (!user || user.role != "masyarakat") return <Navigate to="/" replace />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
                <div className="max-w-7xl mx-auto">
                    <BackButton type='custom' link='/masyarakat/riwayat-laporan' />

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 mt-4">
                        <div className="flex items-center gap-3 mb-6">
                            <h1 className="font-poppins-bold text-2xl text-gray-800">
                                Buat Laporan
                            </h1>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                                <FormInput
                                    title='Nama Pelapor'
                                    placeholder='Masukkan nama pelapor (otomatis)'
                                    value={user.fullname}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Email Pelapor'
                                    placeholder='Masukkan email pelapor (otomatis)'
                                    value={user.email}
                                    disabled={true}
                                />

                                <FormInput
                                    title='NIK'
                                    placeholder='Masukkan NIK (otomatis)'
                                    value={user.nik}
                                    disabled={true}
                                />

                                <FormInput
                                    title='Judul Laporan'
                                    placeholder='Masukkan Judul Laporan'
                                    value={pengaduanForm.judul}
                                    name='judul'
                                    onChange={handlePegaduanChangeForm}
                                    type='textarea'
                                />

                                <FormInput
                                    title='Deskripsi Laporan'
                                    placeholder='Masukkan Deskripsi Laporan'
                                    value={pengaduanForm.deskripsi}
                                    name='deskripsi'
                                    onChange={handlePegaduanChangeForm}
                                    type='textarea'
                                />

                                <FormSelect
                                    title='Kategori Laporan'
                                    name='kategori'
                                    value={pengaduanForm.kategori}
                                    onChange={handlePegaduanChangeForm}
                                >
                                    {kategoriLaporanOptions.map((item, index) => (
                                        <option key={index} value={item.text}>{item.text}</option>
                                    ))}
                                </FormSelect>

                                <FormInput
                                    title='Lokasi'
                                    placeholder='Masukkan Lokasi'
                                    value={pengaduanForm.alamat}
                                    name='alamat'
                                    onChange={handlePegaduanChangeForm}
                                />

                                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                                    <p className="font-poppins-semibold text-[14px] text-gray-700">
                                        Foto / Video Pendukung
                                        <span className="font-poppins-regular text-[12px] text-gray-400 ml-2">
                                            (Bisa lebih dari 1)
                                        </span>
                                    </p>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />

                                    {previews.length === 0 ? (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="group w-full border-2 border-dashed border-gray-200 hover:border-primary rounded-2xl p-10 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:bg-green-50 cursor-pointer"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                                                <Upload size={24} className="text-gray-400 group-hover:text-primary transition-colors duration-300" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-poppins-semibold text-[14px] text-gray-500 group-hover:text-primary transition-colors duration-300">
                                                    Klik untuk unggah foto atau video
                                                </p>
                                                <p className="font-poppins-regular text-[12px] text-gray-400 mt-1">
                                                    PNG, JPG, MP4, MOV — Bisa pilih lebih dari 1 file
                                                </p>
                                            </div>
                                        </button>
                                    ) : (
                                        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex flex-col gap-4">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                                {previews.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                                        data-aos="zoom-in"
                                                        data-aos-duration="300"
                                                    >
                                                        <div className="relative h-28 bg-gray-100 overflow-hidden">
                                                            {item.tipe === "video" ? (
                                                                <video
                                                                    src={item.url}
                                                                    className="w-full h-full object-cover"
                                                                    muted
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={item.url}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                            )}

                                                            <div className="absolute top-1.5 left-1.5">
                                                                <span className={`flex items-center gap-1 text-[10px] font-poppins-semibold px-2 py-0.5 rounded-full ${item.tipe === "video" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                                                                    {item.tipe === "video" ? <FileVideo size={10} /> : <ImageIcon size={10} />}
                                                                    {item.tipe === "video" ? "Video" : "Foto"}
                                                                </span>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemove(index)}
                                                                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
                                                            >
                                                                <Trash2 size={11} />
                                                            </button>
                                                        </div>

                                                        <div className="px-2 py-1.5">
                                                            <p className="text-[10px] font-poppins-medium text-gray-500 truncate">
                                                                {item.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="group rounded-xl border-2 border-dashed border-gray-200 hover:border-primary h-36 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 hover:bg-green-50 cursor-pointer"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                                                        <Plus size={16} className="text-gray-400 group-hover:text-primary transition-colors duration-300" />
                                                    </div>
                                                    <p className="text-[11px] font-poppins-medium text-gray-400 group-hover:text-primary transition-colors duration-300">
                                                        Tambah
                                                    </p>
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                                <span className="text-[12px] font-poppins-medium text-gray-400">
                                                    {previews.length} file dipilih
                                                    <span className="ml-2 text-gray-300">·</span>
                                                    <span className="ml-2">
                                                        {previews.filter(p => p.tipe === "foto").length} foto
                                                    </span>
                                                    <span className="ml-2 text-gray-300">·</span>
                                                    <span className="ml-2">
                                                        {previews.filter(p => p.tipe === "video").length} video
                                                    </span>
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        previews.forEach(p => URL.revokeObjectURL(p.url));
                                                        setPreviews([]);
                                                        setMediaFilesData([]);
                                                    }}
                                                    className="text-[12px] font-poppins-semibold text-red-400 hover:text-red-600 transition-colors duration-200 flex items-center gap-1"
                                                >
                                                    <Trash2 size={12} />
                                                    Hapus Semua
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <SubmitButton text='Kirim Laporan' onClick={() => handlePengaduanPost(mediaFilesData)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}