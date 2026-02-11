/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import BackButton from '../../../ui/BackButton';
import FormSelect from '../../../ui/FormSelect';
import ShowTableForm from '../../../ui/ShowTableForm';
import FormInput from '../../../ui/FormInput';
import FormUploadFile from '../../../ui/FormUploadFile';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import useUserHooks from '../../../hooks/UserHooks';
import useDataEntryHooks from '../../../hooks/DataEntryHooks';
import SubmitButton from '../../../ui/SubmitButton';

export default function PokjaLaporanKelompokUpdateView() {
    const { id } = useParams();
    const { user, loading } = useAuth();
    const { listUser } = useUserHooks();
    const [isDisabled, setIsDisabled] = useState(false);
    const [showSelectedPPK, setShowSelectedPPK] = useState(false);
    const [userPPK, setUserPPK] = useState<UserProps[]>([]);
    const location = useLocation();
    const {
        note,
        handleEntryKelompokKerjaPut,
        handleChangeEntryPenjabatPengadaan,
        handleChangeFileEntryPenjabatPengadaan,
        setSelectedId,
        selectedPPK,
        dataEntryPengadaanById,
        formDataMandotary,
        setFormDataMandotrary,
        handleChangeMadotaryPenjabatPengadaan
    } = useDataEntryHooks();

    useEffect(() => {
        const fetchtenderId = () => {
            if (id) {
                setSelectedId(id);
            }

            if (location.pathname.startsWith("/pokja/data-entry-kelompok-kerja/lihat/")) {
                setIsDisabled(true);
            }
        }

        if (dataEntryPengadaanById) {
            setFormDataMandotrary({
                no_kontrak: dataEntryPengadaanById?.nomor_kontrak ?? null,
                nilai_kontrak: dataEntryPengadaanById?.nilai_kontrak ?? null,
                tgl_kontrak: dataEntryPengadaanById?.tanggal_kontrak ?? null,
                nama_ppk: dataEntryPengadaanById?.nama_ppk ?? null,
                jabatan_ppk: dataEntryPengadaanById?.jabatan_ppk ?? null,
                nama_pimpinan_perusahaan: dataEntryPengadaanById?.nama_pimpinan_perusahaan ?? null,
                jabatan_pimpinan: dataEntryPengadaanById?.jabatan_pimpinan ?? null,

                nama_penyedia: dataEntryPengadaanById?.pemenang ?? null,
                nilai_penawaran: dataEntryPengadaanById?.nilai_penawaran ?? null,
                nilai_negosiasi: dataEntryPengadaanById?.nilai_negosiasi ?? null,
                nomor_telp: dataEntryPengadaanById?.nomor_telp ?? null,
                email: dataEntryPengadaanById?.email ?? null,
                npwp_penyedia: dataEntryPengadaanById?.npwp ?? null,

                alamat_pemenang: dataEntryPengadaanById?.alamat_pemenang ?? null,
                lokasi_pekerjaan: dataEntryPengadaanById?.lokasi_pekerjaan ?? null,

                pendaftar: dataEntryPengadaanById?.pendaftar ?? null,
                pemasukan: dataEntryPengadaanById?.pemasukan ?? null,

                pagu: dataEntryPengadaanById?.nilai_pagu ?? null,
                hps: dataEntryPengadaanById?.nilai_hps ?? null,
            });
        }

        const filteringUserPPK = () => {
            const filteringData = listUser?.filter((item: UserProps) => {
                const filter = item.role_id === 2;
                return filter;
            });

            setUserPPK(filteringData);
        }

        const fetchShowPPK = () => {
            if (dataEntryPengadaanById?.jenis_pengadaan) {
                if (dataEntryPengadaanById?.jenis_pengadaan.toLowerCase() === ("Pekerjaan Konstruksi").toLowerCase()) {
                    setShowSelectedPPK(true);
                }
            }
        }

        fetchtenderId();
        filteringUserPPK();
        fetchShowPPK();
    }, [listUser, id, setSelectedId, location, dataEntryPengadaanById, setFormDataMandotrary]);

    if (loading || !dataEntryPengadaanById) {
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

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="font-poppins-bold text-2xl text-gray-800 mb-8">
                            {isDisabled ? "Lihat" : "Ubah"} Laporan kelompok Kerja
                        </h1>

                        <div className="space-y-8">
                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    1. TRANSAKSI INFORMASI
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <FormSelect disabled={true} title="Metode Pengadaan" name="" value={dataEntryPengadaanById?.metode_pengadaan?.toString()}>
                                            <option value={dataEntryPengadaanById?.metode_pengadaan?.toString()}>{dataEntryPengadaanById?.metode_pengadaan?.toString()}</option>
                                        </FormSelect>
                                    </div>

                                    <div className="md:col-span-2">
                                        <ShowTableForm disabled={true} tenderCode={dataEntryPengadaanById?.kode_paket?.toString()} />
                                    </div>

                                    <FormInput disabled={true} title="Kode RUP" name="" value={dataEntryPengadaanById?.kode_rup?.toString()} placeholder="Otomatis terisi" />
                                    <FormInput disabled={true} title="Tahun Anggaran" name="" value={dataEntryPengadaanById?.tahun_anggaran?.toString()} placeholder="Otomatis terisi" />

                                    <div className="md:col-span-2">
                                        <FormInput disabled={true} title="Satuan Kerja" name="" value={dataEntryPengadaanById?.satuan_kerja?.toString()} placeholder="Otomatis terisi" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <FormInput disabled={true} title="Nama Paket" name="" value={dataEntryPengadaanById?.nama_paket?.toString()} placeholder="Otomatis terisi" />
                                    </div>

                                    <FormInput disabled={true} title="Sumber Dana" name="" value={dataEntryPengadaanById?.sumber_dana?.toString()} placeholder="Otomatis terisi" />
                                    <FormInput disabled={true} title="Jenis Pengadaan" name="" value={dataEntryPengadaanById?.jenis_pengadaan?.toString()} placeholder="Otomatis terisi" />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    2. INFORMASI KEUANGAN
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput disabled={true} title="Nilai Pagu (Rp)" name="pagu" value={formDataMandotary?.pagu?.toString()} placeholder="Otomatis terisi" />
                                    <FormInput disabled={true} title="Nilai HPS (Rp)" name="hps" value={formDataMandotary?.hps?.toString()} placeholder="Otomatis terisi" />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    3. DETAIL KONTRAK
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput disabled={isDisabled} required={false} title="Jumlah Pendaftar" name="pendaftar" value={formDataMandotary?.pendaftar} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} required={false} title="Jumlah Pemasukan" name="pemasukan" value={formDataMandotary?.pemasukan} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} required={false} title="Nomor Kontrak" name='no_kontrak' value={formDataMandotary?.no_kontrak} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} required={false} title="Nilai Kontrak" name="nilai_kontrak" value={formDataMandotary?.nilai_kontrak} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} type='date' required={false} title="Tanggal Kontrak" name="tgl_kontrak" value={formDataMandotary?.tgl_kontrak} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} required={false} title="Nama PPK" name="nama_ppk" value={formDataMandotary?.nama_ppk} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} required={false} title="Jabatan PPK" name="jabatan_ppk" value={formDataMandotary?.jabatan_ppk} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} required={false} title="Nama Pimpinan Perusahaan" name="nama_pimpinan_perusahaan" value={formDataMandotary?.nama_pimpinan_perusahaan} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} required={false} title="Jabatan Pimpinan" name="jabatan_pimpinan" value={formDataMandotary?.jabatan_pimpinan} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    4. INFORMASI PEMENANG
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput disabled={isDisabled} title="Pemenang" name="nama_penyedia" value={formDataMandotary?.nama_penyedia} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} title="Nilai Penawaran" name="nilai_penawaran" value={formDataMandotary?.nilai_penawaran} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} title="Nilai Negosiasi" name="nilai_negosiasi" value={formDataMandotary?.nilai_negosiasi} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} title="Nomor Telepon/HP" name="nomor_telp" value={formDataMandotary?.nomor_telp} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} title="Email" name="email" value={formDataMandotary?.email} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} title="NPWP" name="npwp_penyedia" value={formDataMandotary?.npwp_penyedia} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    5. LOKASI & ALAMAT
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormInput disabled={isDisabled} title="Alamat Pemenang" name="alamat_pemenang" value={formDataMandotary?.alamat_pemenang} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} title="Lokasi Pekerjaan" name="lokasi_pekerjaan" value={formDataMandotary?.lokasi_pekerjaan} placeholder="Silahkan Isi" onChange={handleChangeMadotaryPenjabatPengadaan} />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    6. LAMPIRAN DAN CATATAN
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormUploadFile disabled={isDisabled} value={dataEntryPengadaanById ? dataEntryPengadaanById.bukti_file : ''} title="Evidence/Bukti Laporan Hasil Pemilihan PP" name="file" onChange={handleChangeFileEntryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} title="Catatan" type='textarea' name="note" value={note ? note as any : dataEntryPengadaanById?.catatan} onChange={handleChangeEntryPenjabatPengadaan} placeholder="Catatan" />

                                    {showSelectedPPK && (
                                        <FormSelect disabled={isDisabled} title="Ditujukan ke PPK" name="ppk" value={selectedPPK} onChange={handleChangeEntryPenjabatPengadaan}>
                                            {userPPK.map((item, index) => (
                                                <option key={index} value={item.id}>PPK - {item.fullname}</option>
                                            ))}
                                        </FormSelect>
                                    )}
                                </div>
                            </div>

                            {!isDisabled && (
                                <div className="flex justify-end gap-4 pt-4">
                                    <SubmitButton text='Simpan' onClick={() => handleEntryKelompokKerjaPut(dataEntryPengadaanById, dataEntryPengadaanById?.metode_pengadaan?.toString() as any)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}