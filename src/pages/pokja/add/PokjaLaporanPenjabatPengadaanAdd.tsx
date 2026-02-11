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
import NonTenderData from '../../../data/NonTenderData';
import KatalogV5Data from '../../../data/KatalogV5Data';
import KatalogV6Data from '../../../data/KatalogV6Data';
import { SwalMessage } from '../../../utils/SwalMessage';
import PenyediaV5Data from '../../../data/PenyediaV5Data';
import PenyediaV6Data from '../../../data/PenyediaV6Data';

export default function PokjaLaporanPenjabatPengadaanAdd() {
    const [metodePengadaan, setMetodePengadaan] = useState<any>("");

    const { nonTenderData, setNonTenderTahun, nonTenderTahun } = NonTenderData();
    const { katalogv5Data, setKatalogV5tahun, katalogv5Tahun } = KatalogV5Data();
    const { katalogv6Data, setKatalogV6Tahun, katalogv6Tahun } = KatalogV6Data();

    const { penyediaV5Data, setPenyediaV5Param } = PenyediaV5Data();
    const { penyediaV6Data, setPenyediaV6Param } = PenyediaV6Data();

    const [noTenderDataFilter, setNoTenderDataFilter] = useState<NonTenderDataProps[]>([]);
    const [katalogV5DataFilter, setKatalogV5DataFilter] = useState<KatalogV5DataProps[]>([]);
    const [katalogV6DataFilter, setKatalogV6DataFilter] = useState<KatalogV6DataProps[]>([]);

    const [showTender, setShowTender] = useState<any>('');
    const [selectedTender, setSelectedTender] = useState<any>(null);
    const [showSelectedPPK, setShowSelectedPPK] = useState(false);

    const { user, loading } = useAuth();
    const { listUser } = useUserHooks();
    const [userPPK, setUserPPK] = useState<UserProps[]>([]);
    const [search, setSearch] = useState("");

    const {
        dataEntryPengadaan,
        selectedPPK,
        note,
        handleEntryPenjabatPengadaanPost,
        handleChangeEntryPenjabatPengadaan,
        handleChangeFileEntryPenjabatPengadaan,
        formDataMandotary,
        setFormDataMandotrary,
        handleChangeMadotaryPenjabatPengadaan
    } = useDataEntryHooks();

    const metodePengadaanOptions = [
        { id: 1, name: 'Pengadaan Langsung' },
        { id: 2, name: 'E-Purchasing V5' },
        { id: 3, name: 'E-Purchasing V6' }
    ];

    const noTenderColumns = [
        {
            key: "id",
            label: "No"
        },
        {
            key: "kd_nontender",
            label: "Kode Tender"
        },
        {
            key: "kd_rup",
            label: "Kode RUP"
        },
        {
            key: "tahun_anggaran",
            label: "Tahun Anggaran"
        }
    ]

    const paketColumns = [
        {
            key: "id",
            label: "No"
        },
        {
            key: "kd_paket",
            label: "Kode Tender"
        },
        {
            key: "kd_rup",
            label: "Kode RUP"
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

        if (selectedTender?.jenis_pengadaan) {
            if (selectedTender?.jenis_pengadaan.toLowerCase() === ("Pekerjaan Konstruksi").toLowerCase()) {
                setShowSelectedPPK(true);
            } else {
                setShowSelectedPPK(false)
            }
        }

        fetchTender();
        filteringUserPPK();
    }, [selectedTender, showTender, listUser, setSelectedTender]);

    useEffect(() => {
        const filteringDataNonTender = () => {
            const filter = nonTenderData.filter((item: NonTenderDataProps) => {
                const data = item?.kd_nontender?.toString().toLowerCase().includes(search.toLowerCase());
                const isExisting = dataEntryPengadaan?.some(
                    kode => String(kode?.kode_paket).trim() == String(item?.kd_nontender)
                );
                return data && !isExisting;
            });

            setNoTenderDataFilter(filter);
        }

        const filteringDataKatalogV5 = () => {
            const filter = katalogv5Data.filter((item: KatalogV5DataProps) => {
                const data = item?.kd_paket?.toString().toLowerCase().includes(search.toLowerCase());
                const isExisting = dataEntryPengadaan?.some(
                    kode => String(kode?.kode_paket).trim() == String(item?.kd_paket)
                );
                return data && !isExisting;
            });

            setKatalogV5DataFilter(filter)
        }

        const filteringDataKatalogV6 = () => {
            const filter = katalogv6Data.filter((item: KatalogV6DataProps) => {
                const data = item?.kd_paket?.toString().toLowerCase().includes(search.toLowerCase());
                const isExisting = dataEntryPengadaan?.some(
                    kode => String(kode?.kode_paket).trim() == String(item?.kd_paket)
                );
                return data && !isExisting;
            });

            setKatalogV6DataFilter(filter);
        }

        const fetchPenyediaV5 = () => {
            if (!selectedTender) return;
            setPenyediaV5Param(selectedTender?.kd_penyedia);
        }

        const fetchPenyediaV6 = () => {
            if (!selectedTender) return;
            setPenyediaV6Param(selectedTender?.kd_penyedia_v6);
        }

        if (selectedTender) {
            setFormDataMandotrary({
                no_kontrak: selectedTender?.no_kontrak ?? '',
                nilai_kontrak: selectedTender?.nilai_kontrak ?? '',
                tgl_kontrak: selectedTender?.tgl_kontrak ?? '',
                nama_ppk: selectedTender?.nama_ppk ?? '',
                jabatan_ppk: selectedTender?.jabatan_ppk ?? '',
                nama_pimpinan_perusahaan: selectedTender?.nama_pimpinan_perusahaan ?? '',
                jabatan_pimpinan: selectedTender?.jabatan_pimpinan ?? '',

                nama_penyedia: selectedTender?.nama_penyedia ?? penyediaV5Data?.[0]?.nama_penyedia ?? penyediaV6Data?.[0]?.nama_penyedia ?? '',
                nilai_penawaran: selectedTender?.nilai_penawaran ?? '',
                nilai_negosiasi: selectedTender?.nilai_negosiasi ?? '',
                nomor_telp: selectedTender?.no_telp_penyedia ?? penyediaV6Data?.[0]?.telepon ?? penyediaV5Data?.[0]?.no_telp_penyedia ?? '',
                email: selectedTender?.email_penyedia ?? penyediaV6Data?.[0]?.email ?? penyediaV5Data?.[0]?.email_penyedia ?? '',
                npwp_penyedia: selectedTender?.npwp_penyedia ?? penyediaV6Data?.[0]?.npwp_penyedia ?? penyediaV5Data?.[0]?.npwp_penyedia ?? '',

                alamat_pemenang: selectedTender?.alamat ?? penyediaV5Data?.[0]?.alamat_penyedia ?? penyediaV6Data?.[0]?.alamat_penyedia ?? '',
                lokasi_pekerjaan: selectedTender?.lokasi_pekerjaan ?? '',

                pendaftar: selectedTender?.pendaftar ?? '',
                pemasukan: selectedTender?.pemasukan ?? '',

                pagu: selectedTender?.pagu ?? '',
                hps: selectedTender?.hps ?? ''
            });
        }

        filteringDataNonTender();
        filteringDataKatalogV5();
        filteringDataKatalogV6();

        fetchPenyediaV5();
        fetchPenyediaV6();
    }, [search, nonTenderData, katalogv5Data, katalogv6Data, setPenyediaV5Param, selectedTender, setPenyediaV6Param, dataEntryPengadaan, setFormDataMandotrary, penyediaV5Data, penyediaV6Data]);


    const isEPurchasing = String(metodePengadaan) === 'E-Purchasing V5' || String(metodePengadaan) === 'E-Purchasing V6';
    const handleShowTender = () => {
        if (metodePengadaan) {
            setShowTender(true);
            setSelectedTender(null);
        } else {
            SwalMessage({
                type: "error",
                title: "Gagal!",
                text: "Harap pilih metode pengadaan terlebih dahulu!"
            });
        }
    }

    if (loading) {
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
                    <BackButton type='custom' link='/pokja/data-entry-penjabat-pengadaan' />

                    {showTender && (
                        <div className="fixed inset-0 h-screen flex justify-center items-center bg-black/20 z-20">
                            <div className="bg-white p-4 rounded-lg flex flex-col max-w-[90vw] max-h-[70vh] gap-4 relative">
                                <div className="absolute top-4 right-4 cursor-pointer text-primary" onClick={() => setShowTender(false)}>
                                    <X />
                                </div>

                                {metodePengadaan === "Pengadaan Langsung" && (
                                    <TableHeader
                                        title="Data Tender / Paket"
                                        type='pokja'
                                        showHapus={false}
                                        showTambah={false}
                                        searchValue={search}
                                        selectedTahunQuery={nonTenderTahun}
                                        onTahunQueryChange={(item) => setNonTenderTahun(item)}
                                        onSearchChange={(item) => setSearch(item)}
                                    />
                                )}

                                {metodePengadaan === "Pengadaan Langsung" && (
                                    <div className="overflow-y-auto max-h-[70vh] w-full">
                                        <TableContent
                                            columns={noTenderColumns}
                                            data={noTenderDataFilter}
                                            isSelect={false}
                                            showEdit={false}
                                            showPreview={false}
                                            showSelect={true}
                                            idKey="id"
                                            onSelectedDataChange={(item) => {
                                                setSelectedTender(item as any)
                                                setShowTender(false)
                                            }}
                                        />
                                    </div>
                                )}

                                {metodePengadaan === "E-Purchasing V5" && (
                                    <TableHeader
                                        title="Data Tender / Paket"
                                        type='pokja'
                                        showHapus={false}
                                        showTambah={false}
                                        searchValue={search}
                                        selectedTahunQuery={katalogv5Tahun}
                                        onTahunQueryChange={(item) => setKatalogV5tahun(item)}
                                        onSearchChange={(item) => setSearch(item)}
                                    />
                                )}

                                {metodePengadaan === "E-Purchasing V5" && (
                                    <div className="overflow-y-auto max-h-[70vh] w-full">
                                        <TableContent
                                            columns={paketColumns}
                                            data={katalogV5DataFilter}
                                            isSelect={false}
                                            showEdit={false}
                                            showPreview={false}
                                            showSelect={true}
                                            idKey="id"
                                            onSelectedDataChange={(item) => {
                                                setSelectedTender(item as any)
                                                setShowTender(false)
                                            }}
                                        />
                                    </div>
                                )}

                                {metodePengadaan === "E-Purchasing V6" && (
                                    <TableHeader
                                        title="Data Tender / Paket"
                                        type='pokja'
                                        showHapus={false}
                                        showTambah={false}
                                        searchValue={search}
                                        selectedTahunQuery={katalogv6Tahun}
                                        onTahunQueryChange={(item) => setKatalogV6Tahun(item)}
                                        onSearchChange={(item) => setSearch(item)}
                                    />
                                )}

                                {metodePengadaan === "E-Purchasing V6" && (
                                    <div className="overflow-y-auto max-h-[70vh] w-full">
                                        <TableContent
                                            columns={paketColumns}
                                            data={katalogV6DataFilter}
                                            isSelect={false}
                                            showEdit={false}
                                            showPreview={false}
                                            showSelect={true}
                                            idKey="id"
                                            onSelectedDataChange={(item) => {
                                                setSelectedTender(item as any)
                                                setShowTender(false)
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="font-poppins-bold text-2xl text-gray-800 mb-8">
                            Tambah Laporan Penjabat Pengadaan
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
                                            {metodePengadaanOptions.map((item, index) => (
                                                <option key={index} value={item.name}>{item.name}</option>
                                            ))}
                                        </FormSelect>
                                    </div>

                                    {metodePengadaan === "Pengadaan Langsung" ? (
                                        <div className="md:col-span-2">
                                            <ShowTableForm tenderCode={selectedTender ? selectedTender?.kd_nontender?.toString() : "Kode Paket"} onClick={() => handleShowTender()} />
                                        </div>
                                    ) : (
                                        <div className="md:col-span-2">
                                            <ShowTableForm tenderCode={selectedTender ? selectedTender?.kd_paket?.toString() : "Kode Paket"} onClick={() => handleShowTender()} />
                                        </div>
                                    )}

                                    <FormInput title="Kode RUP" name="" value={selectedTender?.kd_rup} placeholder="Otomatis terisi" disabled={true} />
                                    <FormInput title="Tahun Anggaran" name="" value={selectedTender?.tahun_anggaran.toString()} placeholder="Otomatis terisi" disabled={true} />

                                    <div className="md:col-span-2">
                                        <FormInput title="Satuan Kerja" name="" value={selectedTender?.nama_satker} placeholder="Otomatis terisi" disabled={true} />
                                    </div>

                                    {metodePengadaan == "Pengadaan Langsung" || metodePengadaan == "E-Purchasing V5" ? (
                                        <div className="md:col-span-2">
                                            <FormInput title="Nama Paket" name="" value={selectedTender?.nama_paket} placeholder="Otomatis terisi" disabled={true} />
                                        </div>
                                    ) : (
                                        <div className="md:col-span-2">
                                            <FormInput title="Nama Paket" name="" value={selectedTender?.rup_nama_pkt} placeholder="Otomatis terisi" disabled={true} />
                                        </div>
                                    )}

                                    {metodePengadaan == "Pengadaan Langsung" && (
                                        <FormInput title="Sumber Dana" name="" value={selectedTender?.sumber_dana} placeholder="Otomatis terisi" disabled={true} />
                                    )}
                                    {metodePengadaan == "E-Purchasing V5" && (
                                        <FormInput title="Sumber Dana" name="" value={selectedTender?.nama_sumber_dana} placeholder="Otomatis terisi" disabled={true} />
                                    )}
                                    {metodePengadaan == "E-Purchasing V6" && (
                                        <FormInput title="Sumber Dana" name="" value={selectedTender?.sumber_dana} placeholder="Otomatis terisi" disabled={true} />
                                    )}

                                    {!isEPurchasing && (
                                        <FormInput title="Jenis Pengadaan" name="" value={selectedTender?.jenis_pengadaan?.toString()} placeholder="Otomatis terisi" disabled={true} />
                                    )}
                                </div>
                            </div>

                            {isEPurchasing && (
                                <div>
                                    <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                        2. REALISASI PAKET
                                    </h2>
                                    {metodePengadaan == "E-Purchasing V5" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput title="Status Paket" value={selectedTender?.status_paket} name="" placeholder="Otomatis terisi" disabled={true} />
                                            <FormInput title="Status Pengiriman" value={selectedTender?.paket_status_str} name="" placeholder="Otomatis terisi" disabled={true} />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput title="Status Paket" value={selectedTender?.status_pkt} name="" placeholder="Otomatis terisi" disabled={true} />
                                            <FormInput title="Status Pengiriman" value={selectedTender?.status_pengiriman} name="" placeholder="Otomatis terisi" disabled={true} />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    {isEPurchasing ? '3' : '2'}. INFORMASI KEUANGAN
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput onChange={handleChangeMadotaryPenjabatPengadaan} title="Nilai Pagu (Rp)" name="pagu" value={formDataMandotary?.pagu} placeholder="Otomatis terisi" disabled={formDataMandotary?.pagu ? true : false} />
                                    <FormInput onChange={handleChangeMadotaryPenjabatPengadaan} title="Nilai HPS (Rp)" name="hps" value={formDataMandotary?.hps} placeholder="Otomatis terisi" disabled={formDataMandotary?.hps ? true : false} />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    {isEPurchasing ? '4' : '3'}. DETAIL KONTRAK
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Nomor Kontrak" name="no_kontrak" value={formDataMandotary?.no_kontrak} placeholder="Otomatis terisi" disabled={false} />
                                    <FormInput required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Nilai Kontrak" name="nilai_kontrak" value={formDataMandotary?.nilai_kontrak} placeholder="Otomatis terisi" disabled={false} />
                                    <FormInput required={false} onChange={handleChangeMadotaryPenjabatPengadaan} type='date' title="Tanggal Kontrak" name="tgl_kontrak" value={formDataMandotary?.tgl_kontrak} placeholder="Otomatis terisi" disabled={false} />
                                    <FormInput required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Nama PPK" name="nama_ppk" value={formDataMandotary?.nama_ppk} placeholder="Otomatis terisi" disabled={false} />
                                    <FormInput required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Jabatan PPK" name="jabatan_ppk" value={formDataMandotary?.jabatan_ppk} placeholder="Otomatis terisi" disabled={false} />
                                    <FormInput required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Nama Pimpinan Perusahaan" name="nama_pimpinan_perusahaan" value={formDataMandotary?.nama_pimpinan} placeholder="Otomatis terisi" disabled={false} />
                                    <FormInput required={false} onChange={handleChangeMadotaryPenjabatPengadaan} title="Jabatan Pimpinan" name="jabatan_pimpinan" value={formDataMandotary?.jabatan_pimpinan} placeholder="Otomatis terisi" disabled={false} />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    {isEPurchasing ? '5' : '4'}. INFORMASI PEMENANG
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput onChange={handleChangeMadotaryPenjabatPengadaan} title="Pemenang" name="nama_penyedia" value={formDataMandotary.nama_penyedia} placeholder="Otomatis terisi" />
                                    <FormInput onChange={handleChangeMadotaryPenjabatPengadaan} title="Nilai Penawaran" name="nilai_penawaran" value={formDataMandotary?.nilai_penawaran} placeholder="Otomatis terisi" />
                                    <FormInput onChange={handleChangeMadotaryPenjabatPengadaan} title="Nilai Negosiasi" name="nilai_negosiasi" value={formDataMandotary?.nilai_negosiasi?.toString()} placeholder="Otomatis terisi" />
                                    <FormInput onChange={handleChangeMadotaryPenjabatPengadaan} title="Email" name="email" value={formDataMandotary?.email} placeholder="Otomatis terisi" />
                                    <FormInput onChange={handleChangeMadotaryPenjabatPengadaan} title="Nomor Telepon/HP" name="nomor_telp" value={formDataMandotary?.nomor_telp} placeholder="Otomatis terisi" />
                                    <FormInput onChange={handleChangeMadotaryPenjabatPengadaan} title="NPWP" name="npwp" value={formDataMandotary?.npwp_penyedia} placeholder="Otomatis terisi" />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    {isEPurchasing ? '6' : '5'}. LOKASI & ALAMAT
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormInput onChange={handleChangeMadotaryPenjabatPengadaan} title="Alamat Pemenang" value={formDataMandotary.alamat_pemenang} name="alamat_pemenang" placeholder="Otomatis terisi" />
                                    <FormInput onChange={handleChangeMadotaryPenjabatPengadaan} title="Lokasi Pekerjaan" name="lokasi_pekerjaan" value={formDataMandotary.lokasi_pekerjaan} placeholder="Otomatis terisi" />
                                </div>
                            </div>

                            <div>
                                <h2 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
                                    {isEPurchasing ? '7' : '6'}. LAMPIRAN DAN CATATAN
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormUploadFile title="Evidence/Bukti Laporan Hasil Pemilihan PP" name="file" onChange={handleChangeFileEntryPenjabatPengadaan} />
                                    <FormInput title="Catatan" type='textarea' name="note" value={note} onChange={handleChangeEntryPenjabatPengadaan} placeholder="Catatan" />

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
                                <SubmitButton text='Simpan' onClick={() => handleEntryPenjabatPengadaanPost(selectedTender, metodePengadaan)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}