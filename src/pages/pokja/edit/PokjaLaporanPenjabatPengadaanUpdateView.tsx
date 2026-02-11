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

export default function PokjaLaporanPenjabatPengadaanUpdateView() {
    const { id } = useParams();
    const { user, loading } = useAuth();
    const { listUser } = useUserHooks();
    const [userPPK, setUserPPK] = useState<UserProps[]>([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const location = useLocation();
    const {
        selectedPPK,
        note,
        handleEntryPenjabatPengadaanPut,
        handleChangeEntryPenjabatPengadaan,
        handleChangeFileEntryPenjabatPengadaan,
        setSelectedId,
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

            if (location.pathname.startsWith("/pokja/data-entry-penjabat-pengadaan/lihat/")) {
                setIsDisabled(true);
            }
        }

        const filteringUserPPK = () => {
            const filteringData = listUser?.filter((item: UserProps) => {
                const filter = item.role_id === 2 || item.role_id === 3;
                return filter;
            });

            setUserPPK(filteringData);
        }

        if (dataEntryPengadaanById) {
            setFormDataMandotrary({
                nilai_kontrak: dataEntryPengadaanById?.nilai_kontrak ?? '',
                no_kontrak: dataEntryPengadaanById?.nomor_kontrak ?? '',
                tgl_kontrak: dataEntryPengadaanById?.tanggal_kontrak ?? '',
                nama_ppk: dataEntryPengadaanById?.nama_ppk ?? '',
                jabatan_ppk: dataEntryPengadaanById?.jabatan_ppk ?? '',
                nama_pimpinan_perusahaan: dataEntryPengadaanById?.nama_pimpinan_perusahaan ?? '',
                jabatan_pimpinan: dataEntryPengadaanById?.jabatan_pimpinan ?? '',

                nama_penyedia: dataEntryPengadaanById?.pemenang ?? '',
                nilai_penawaran: dataEntryPengadaanById?.nilai_penawaran ?? '',
                nilai_negosiasi: dataEntryPengadaanById?.nilai_negosiasi ?? '',
                nomor_telp: dataEntryPengadaanById?.nomor_telp ?? '',
                email: dataEntryPengadaanById?.email ?? '',
                npwp_penyedia: dataEntryPengadaanById?.npwp ?? '',

                alamat_pemenang: dataEntryPengadaanById?.alamat_pemenang ?? '',
                lokasi_pekerjaan: dataEntryPengadaanById?.lokasi_pekerjaan ?? '',

                pendaftar: dataEntryPengadaanById?.pendaftar ?? '',
                pemasukan: dataEntryPengadaanById?.pemasukan ?? '',

                pagu: dataEntryPengadaanById?.nilai_pagu ?? '',
                hps: dataEntryPengadaanById?.nilai_hps ?? ''
            });
        }

        filteringUserPPK();
        fetchtenderId();
    }, [listUser, id, setSelectedId, location, dataEntryPengadaanById, setFormDataMandotrary]);

    const isEPurchasing = String(dataEntryPengadaanById?.metode_pengadaan?.toString()) === 'E-Purchasing V6' || String(dataEntryPengadaanById?.metode_pengadaan?.toString()) === 'E-Purchasing V5';
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
                            {isDisabled ? "Lihat" : "Ubah"} Laporan Penjabat Pengadaan
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

                                    {!isEPurchasing && (
                                        <FormInput disabled={true} title="Jenis Pengadaan" name="" value={dataEntryPengadaanById?.jenis_pengadaan?.toString()} placeholder="Otomatis terisi" />
                                    )}
                                </div>
                            </div>

                            {isEPurchasing && (
                                <div>
                                    <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                        2. REALISASI PAKET
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormInput disabled={true} title="Status Paket" name="" value={dataEntryPengadaanById?.status_paket?.toString()} placeholder="Otomatis terisi" />
                                        <FormInput disabled={true} title="Status Pengiriman" name="" value={dataEntryPengadaanById?.status_pengiriman?.toString()} placeholder="Otomatis terisi" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    {isEPurchasing ? '3' : '2'}. INFORMASI KEUANGAN
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput disabled={true} title="Nilai Pagu (Rp)" name="pagu" value={dataEntryPengadaanById?.nilai_pagu?.toString()} placeholder="Otomatis terisi" />
                                    <FormInput disabled={true} title="Nilai HPS (Rp)" name="hps" value={dataEntryPengadaanById?.nilai_hps?.toString()} placeholder="Otomatis terisi" />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    {isEPurchasing ? '4' : '3'}. DETAIL KONTRAK
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput disabled={isDisabled} required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Nomor Kontrak" name="no_kontrak" value={formDataMandotary?.no_kontrak} placeholder="Otomatis terisi" />
                                    <FormInput disabled={isDisabled} required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Nilai Kontrak" name="nilai_kontrak" value={formDataMandotary?.nilai_kontrak} placeholder="Otomatis terisi" />
                                    <FormInput disabled={isDisabled} required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Tanggal Kontrak" name="tgl_kontrak" value={formDataMandotary?.tgl_kontrak} placeholder="Otomatis terisi" />
                                    <FormInput disabled={isDisabled} required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Nama PPK" name="nama_ppk" value={formDataMandotary?.nama_ppk} placeholder="Otomatis terisi" />
                                    <FormInput disabled={isDisabled} required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Jabatan PPK" name="jabatan_ppk" value={formDataMandotary?.jabatan_ppk} placeholder="Otomatis terisi" />
                                    <FormInput disabled={isDisabled} required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Nama Pimpinan Perusahaan" name="nama_pimpinan_perusahaan" value={formDataMandotary?.nama_pimpinan_perusahaan} placeholder="Otomatis terisi" />
                                    <FormInput disabled={isDisabled} required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Jabatan Pimpinan" name="jabatan_pimpinan" value={formDataMandotary?.jabatan_pimpinan} placeholder="Otomatis terisi" />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    {isEPurchasing ? '5' : '4'}. INFORMASI PEMENANG
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput disabled={isDisabled} onChange={handleChangeMadotaryPenjabatPengadaan} title="Pemenang" name="nama_penyedia" value={formDataMandotary?.nama_penyedia} placeholder="Otomatis terisi" />
                                    <FormInput disabled={isDisabled} onChange={handleChangeMadotaryPenjabatPengadaan} title={isEPurchasing ? 'Nilai Total' : 'Nilai Penawaran'} name="nilai_penawaran" value={formDataMandotary?.nilai_penawaran} placeholder="Otomatis terisi" />
                                    <FormInput disabled={isDisabled} onChange={handleChangeMadotaryPenjabatPengadaan} title="Nilai Negosiasi/Nilai SPK (Rp)" name="nilai_negosiasi" value={formDataMandotary?.nilai_negosiasi} placeholder="Otomatis terisi" />
                                    <FormInput disabled={isDisabled} onChange={handleChangeMadotaryPenjabatPengadaan} title="Nomor Telepon/HP" name="nomor_telp" value={formDataMandotary?.nomor_telp} placeholder="Otomatis terisi" />
                                    <FormInput disabled={isDisabled} onChange={handleChangeMadotaryPenjabatPengadaan} title="Email" name="email" value={formDataMandotary?.email} placeholder="Otomatis terisi" />
                                    <FormInput disabled={isDisabled} onChange={handleChangeMadotaryPenjabatPengadaan} title="NPWP" name="npwp_penyedia" value={formDataMandotary?.npwp_penyedia} placeholder="Otomatis terisi" />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    {isEPurchasing ? '6' : '5'}. LOKASI & ALAMAT
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormInput disabled={isDisabled} onChange={handleChangeMadotaryPenjabatPengadaan} title="Alamat Pemenang" name="alamat_pemenang" value={formDataMandotary?.alamat_pemenang} placeholder="Otomatis terisi" />
                                    <FormInput disabled={isDisabled} onChange={handleChangeMadotaryPenjabatPengadaan} title="Lokasi Pekerjaan" name="lokasi_pekerjaan" value={formDataMandotary?.lokasi_pekerjaan} placeholder="Otomatis terisi" />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    {isEPurchasing ? '7' : '6'}. LAMPIRAN DAN CATATAN
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormUploadFile disabled={isDisabled} value={dataEntryPengadaanById ? dataEntryPengadaanById.bukti_file : ''} title="Evidence/Bukti Laporan Hasil Pemilihan PP" name="file" onChange={handleChangeFileEntryPenjabatPengadaan} />
                                    <FormInput disabled={isDisabled} title="Catatan" type='textarea' name="note" value={note != "" ? note as any : dataEntryPengadaanById?.catatan} onChange={handleChangeEntryPenjabatPengadaan} placeholder="Catatan" />

                                    {!isEPurchasing && (
                                        <FormSelect disabled={isDisabled} title="Ditujukan ke" name="ppk" value={selectedPPK ? selectedPPK : dataEntryPengadaanById?.selected_ppk_id?.toString()} onChange={handleChangeEntryPenjabatPengadaan}>
                                            {userPPK.map((item, index) => (
                                                <option key={index} value={item.id}>PPK - {item.fullname}</option>
                                            ))}
                                        </FormSelect>
                                    )}
                                </div>
                            </div>

                            {!isDisabled && (
                                <div className="flex justify-end gap-4 pt-4">
                                    <SubmitButton text='Simpan' onClick={() => handleEntryPenjabatPengadaanPut(dataEntryPengadaanById, dataEntryPengadaanById?.metode_pengadaan as any)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}