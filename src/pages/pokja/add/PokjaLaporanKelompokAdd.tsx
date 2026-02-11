/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import BackButton from '../../../ui/BackButton';
import FormSelect from '../../../ui/FormSelect';
import ShowTableForm from '../../../ui/ShowTableForm';
import TableContent from '../../../ui/TableContent';
import FormInput from '../../../ui/FormInput';
import FormUploadFile from '../../../ui/FormUploadFile';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Navigate } from 'react-router-dom';
import useUserHooks from '../../../hooks/UserHooks';
import useDataEntryHooks from '../../../hooks/DataEntryHooks';
import SubmitButton from '../../../ui/SubmitButton';
import TableHeader from '../../../ui/TableHeader';
import TenderData from '../../../data/TenderData';
import { SwalMessage } from '../../../utils/SwalMessage';

export default function PokjaLaporanKelompokAdd() {
    const [metodePengadaan, setMetodePengadaan] = useState<any>("");
    const { tenderData, tenderTahun, setTenderTahun } = TenderData();
    const [tenderDataFilter, setTenderDataFilter] = useState<TenderDataProps[]>([]);

    const [showTender, setShowTender] = useState<any>('');
    const [selectedTender, setSelectedTender] = useState<any>(null);
    const [metodePengadaanOptions, setMetodePengadaanOptions] = useState<any>([]);
    const [showSelectedPPK, setShowSelectedPPK] = useState(false);
    const [userPPK, setUserPPK] = useState<UserProps[]>([]);

    const { user, loading } = useAuth();
    const { listUser } = useUserHooks();
    const [search, setSearch] = useState("");
    const {
        dataEntryPengadaan,
        selectedPPK,
        note,
        handleEntryKelompokKerjaPost,
        handleChangeEntryPenjabatPengadaan,
        handleChangeFileEntryPenjabatPengadaan,
        formDataMandotary,
        setFormDataMandotrary,
        handleChangeMadotaryPenjabatPengadaan
    } = useDataEntryHooks();

    useEffect(() => {
        if (!tenderData || tenderData.length === 0) return;

        const uniqueMetode = Array.from(
            new Set(tenderData.map((item: any) => item.mtd_pemilihan))
        );

        const options = uniqueMetode.map((name, index) => ({
            id: index + 1,
            name
        }));

        setMetodePengadaanOptions(options);
    }, [tenderData]);

    const tenderColumns = [
        {
            key: "id",
            label: "No"
        },
        {
            key: "kd_tender",
            label: "Kode Tender"
        },
        {
            key: "kd_rup",
            label: "Kode RUP"
        },
        {
            key: "mtd_pemilihan",
            label: "Metode Pengadaan"
        },
        {
            key: "jenis_pengadaan",
            label: "Jenis Pengadaan"
        },
        {
            key: "tahun_anggaran",
            label: "Tahun Anggaran"
        }
    ]

    useEffect(() => {
        const fetchTender = () => {
            if (showTender) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }

        const filteringUserPPK = () => {
            const filteringData = listUser?.filter((item: UserProps) => {
                const filter = item.role_id === 2;
                return filter;
            });

            setUserPPK(filteringData);
        }

        if (selectedTender) {
            setFormDataMandotrary({
                no_kontrak: selectedTender?.no_kontrak ?? '',
                tgl_kontrak: selectedTender?.tgl_kontrak ?? '',
                nama_ppk: selectedTender?.nama_ppk ?? '',
                jabatan_ppk: selectedTender?.jabatan_ppk ?? '',
                nama_pimpinan_perusahaan: selectedTender?.nama_pimpinan_perusahaan ?? '',
                jabatan_pimpinan: selectedTender?.jabatan_pimpinan ?? '',

                nama_penyedia: selectedTender?.nama_penyedia ?? '',
                nilai_penawaran: selectedTender?.nilai_penawaran ?? '',
                nilai_negosiasi: selectedTender?.nilai_negosiasi ?? '',
                nomor_telp: selectedTender?.telepon ?? '',
                email: selectedTender?.email ?? '',
                npwp_penyedia: selectedTender?.npwp_penyedia ?? '',

                alamat_pemenang: selectedTender?.alamat_pemenang ?? '',
                lokasi_pekerjaan: selectedTender?.lokasi_pekerjaan ?? '',

                pendaftar: selectedTender?.pendaftar ?? '',
                pemasukan: selectedTender?.pemasukan ?? '',

                pagu: selectedTender?.pagu ?? '',
                hps: selectedTender?.hps ?? ''
            });
        }


        if (selectedTender?.jenis_pengadaan) {
            if (selectedTender?.jenis_pengadaan.toLowerCase() === ("Pekerjaan Konstruksi").toLowerCase()) {
                setShowSelectedPPK(true);
            } else {
                setShowSelectedPPK(false)
            }
        }

        const filteringDataTender = () => {
            const filter = tenderData.filter((item: TenderDataProps) => {
                const data = item?.kd_tender?.toString().toLowerCase().includes(search.toLowerCase());
                const isExisting = dataEntryPengadaan?.some(
                    kode => String(kode?.kode_paket).trim() == String(item?.kd_tender)
                );

                const metodeFilter = item.mtd_pemilihan?.includes(metodePengadaan);
                return metodeFilter && data && !isExisting;
            });

            setTenderDataFilter(filter)
        }

        filteringDataTender();
        fetchTender();
        filteringUserPPK();
    }, [selectedTender, showTender, listUser, search, tenderData, metodePengadaan, dataEntryPengadaan, setFormDataMandotrary]);

    const handleShowTender = () => {
        if (metodePengadaan) {
            setShowTender(true);
        } else {
            SwalMessage({
                type: "error",
                title: "Gagal!",
                text: "Harap pilih metode pengadaan terlebih dahulu!"
            });
        }
    }

    if (loading || tenderData.length == 0) {
        return <LoadingSpinner />
    }

    if (!user || user.role.name != "pokja/pp") {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
                <div className="max-w-7xl mx-auto">
                    <BackButton />

                    {showTender && (
                        <div className="fixed inset-0 h-screen flex justify-center items-center bg-black/20 z-20">
                            <div className="bg-white p-4 rounded-lg flex flex-col max-w-[90vw] max-h-[70vh] gap-4 relative">
                                <div className="absolute top-4 right-4 cursor-pointer text-primary" onClick={() => setShowTender(false)}>
                                    <X />
                                </div>
                                <TableHeader
                                    title="Data Tender"
                                    type='pokja'
                                    showHapus={false}
                                    showTambah={false}
                                    searchValue={search}
                                    selectedTahunQuery={tenderTahun}
                                    onTahunQueryChange={(item) => setTenderTahun(item)}
                                    onSearchChange={(item) => setSearch(item)}
                                />
                                <div className="overflow-y-auto max-h-[70vh] w-full">
                                    <TableContent
                                        columns={tenderColumns}
                                        data={tenderDataFilter}
                                        isSelect={false}
                                        showEdit={false}
                                        showPreview={false}
                                        showSelect={true}
                                        idKey="id"
                                        onSelectedDataChange={(item) => {
                                            setSelectedTender(item)
                                            setShowTender(false)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="font-poppins-bold text-2xl text-gray-800 mb-8">
                            Tambah Laporan Kelompok Kerja
                        </h1>

                        <div className="space-y-8">
                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    1. TRANSAKSI INFORMASI
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <FormSelect title="Metode Pengadaan" name="" value={String(metodePengadaan)} onChange={(e) => {
                                            setMetodePengadaan(e.target.value);
                                        }}>
                                            {metodePengadaanOptions.map((item: any, index: number) => (
                                                <option key={index} value={item.name}>{item.name}</option>
                                            ))}
                                        </FormSelect>
                                    </div>

                                    <div className="md:col-span-2">
                                        <ShowTableForm tenderCode={selectedTender ? selectedTender?.kd_tender : "Kode tender / No Tender"} onClick={() => handleShowTender()} />
                                    </div>

                                    <FormInput title="Kode RUP" name="" value={selectedTender?.kd_rup} placeholder="Otomatis terisi" disabled={true} />
                                    <FormInput title="Tahun Anggaran" name="" value={selectedTender?.tahun_anggaran.toString()} placeholder="Otomatis terisi" disabled={true} />

                                    <div className="md:col-span-2">
                                        <FormInput title="Satuan Kerja" name="" value={selectedTender?.nama_satker} placeholder="Otomatis terisi" disabled={true} />
                                    </div>

                                    <div className="md:col-span-2">
                                        <FormInput title="Nama Paket" name="" value={selectedTender?.nama_paket} placeholder="Otomatis terisi" disabled={true} />
                                    </div>

                                    <FormInput title="Sumber Dana" name="" value={selectedTender?.sumber_dana} placeholder="Otomatis terisi" disabled={true} />
                                    <FormInput title="Jenis Pengadaan" name="" value={selectedTender?.jenis_pengadaan?.toString()} placeholder="Otomatis terisi" disabled={true} />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    2. INFORMASI KEUANGAN
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput disabled={formDataMandotary?.pagu ? true : false} title="Nilai Pagu (Rp)" name="pagu" value={formDataMandotary.pagu} placeholder="Otomatis terisi" />
                                    <FormInput disabled={formDataMandotary?.hps ? true : false} title="Nilai HPS (Rp)" name="hps" value={formDataMandotary.hps} placeholder="Otomatis terisi" />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    3. DETAIL KONTRAK
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput required={false} title="Jumlah Pendaftar" name="pendaftar" value={formDataMandotary?.pendaftar} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput required={false} title="Jumlah Pemasukan" name="pemasukan" value={formDataMandotary?.pemasukan} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput required={false} title="Nomor Kontrak" name="no_kontrak" value={formDataMandotary?.no_kontrak} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput required={false} title="Nilai Kontrak" name="nilai_kontrak" value={formDataMandotary?.nilai_kontrak} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput type='date' required={false} title="Tanggal Kontrak" name="tgl_kontrak" value={formDataMandotary?.tgl_kontrak} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput required={false} title="Nama PPK" name="nama_ppk" value={formDataMandotary?.nama_ppk} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput required={false} title="Jabatan PPK" name="jabatan_ppk" value={formDataMandotary?.jabatan_ppk} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput required={false} title="Nama Pimpinan Perusahaan" name="nama_pimpinan_perusahaan" value={formDataMandotary?.nama_pimpinan_perusahaan} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput required={false} title="Jabatan Pimpinan" name="jabatan_pimpinan" value={formDataMandotary?.jabatan_pimpinan} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    4. INFORMASI PEMENANG
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput title="Pemenang" name="nama_penyedia" value={formDataMandotary?.nama_penyedia} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput title="Nilai Penawaran" name="nilai_penawaran" value={formDataMandotary?.nilai_penawaran} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput title="Nilai Negosiasi" name="nilai_negosiasi" value={formDataMandotary?.nilai_negosiasi} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput title="Nomor Telepon/HP" name="nomor_telp" value={formDataMandotary?.phone} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput title="Email" name="email" value={formDataMandotary?.email} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput title="NPWP" name="npwp_penyedia" value={formDataMandotary?.npwp_penyedia} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    5. LOKASI & ALAMAT
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormInput title="Alamat Pemenang" name="alamat_pemenang" value={formDataMandotary?.alamat_pemenang} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput title="Lokasi Pekerjaan" name="lokasi_pekerjaan" value={formDataMandotary?.lokasi_pekerjaan} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    6. LAMPIRAN DAN CATATAN
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormUploadFile title="Evidence/Bukti Laporan Hasil Pemilihan PP" name="file" onChange={handleChangeFileEntryPenjabatPengadaan} />
                                    <FormInput required={false} title="Catatan" type='textarea' name="note" value={note} onChange={handleChangeEntryPenjabatPengadaan} placeholder="Catatan" />

                                    {showSelectedPPK && (
                                        <FormSelect title="Ditujukan ke PPK" name="ppk" value={selectedPPK} onChange={handleChangeEntryPenjabatPengadaan}>
                                            {userPPK.map((item, index) => (
                                                <option key={index} value={item.id}>PPK - {item.fullname}</option>
                                            ))}
                                        </FormSelect>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <SubmitButton text='Simpan' onClick={() => handleEntryKelompokKerjaPost(selectedTender, metodePengadaan)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}