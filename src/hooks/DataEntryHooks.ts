/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { SwalMessage } from "../utils/SwalMessage";
import SwalLoading from "../utils/SwalLoading";
import API from "../server/API";
import { useNavigate } from "react-router-dom";
import { SortDescById } from "../utils/SortDescById";
import { FormatDate } from "../utils/FormatDate";
import FormatRupiah from "../utils/FormatRupiah";
import { useAuth } from "../context/AuthContext";

export default function useDataEntryHooks() {
    const [dataEntryPengadaan, setDataEntryPengadaan] = useState<DataEntryProps[]>([]);
    const [dataEntryPengadaanById, setDataEntryPengadaanById] = useState<DataEntryProps | null>(null);
    const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
    const [note, setNote] = useState("");
    const [selectedPPK, setSelectedPPK] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<any>(null);
    const [sumberDanaOptions, setSumberDanaOptions] = useState<any[]>([]);
    const [metodePengadaanOptions, setMetodePengadaanOptions] = useState<any[]>([]);
    const [tahunOptions, setTahunOptions] = useState<any[]>([]);
    const [userOptions, setUserOptions] = useState<any[]>([]);
    const [groupOptions, setGroupOptions] = useState<any[]>([]);
    const { user } = useAuth();
    const [formDataMandotary, setFormDataMandotrary] = useState<any>({
        no_kontrak: null,
        nilai_kontrak: null,
        tgl_kontrak: null,
        nama_ppk: null,
        jabatan_ppk: null,
        nama_pimpinan_perusahaan: null,
        jabatan_pimpinan: null,

        nama_penyedia: null,
        nilai_penawaran: null,
        nilai_negosiasi: null,
        nomor_telp: null,
        email: null,
        npwp_penyedia: null,

        alamat_pemenang: null,
        lokasi_pekerjaan: null,

        pendaftar: null,
        pemasukan: null
    });

    const buildSumberDanaOptions = (data: any[]) => {
        const uniqueMap = new Map<string, string>();

        data.forEach(item => {
            if (typeof item.sumber_dana === "string") {
                uniqueMap.set(item.sumber_dana, item.sumber_dana);
            }

            if (typeof item.sumber_dana === "object" && item.sumber_dana) {
                uniqueMap.set(
                    String(item.sumber_dana.id),
                    item.sumber_dana.name
                );
            }
        });

        return Array.from(uniqueMap.entries()).map(([key, value]) => ({
            id: String(key),
            text: value
        }));
    };

    const buildMetodePengadaanOptions = (data: any[]) => {
        const uniqueMap = new Map<string, string>();

        data.forEach(item => {
            if (typeof item.metode_pengadaan === "string") {
                uniqueMap.set(item.metode_pengadaan, item.metode_pengadaan);
            }

            if (
                typeof item.metode_pengadaan === "object" &&
                item.metode_pengadaan
            ) {
                uniqueMap.set(
                    String(item.metode_pengadaan.id),
                    item.metode_pengadaan.name
                );
            }
        });

        return Array.from(uniqueMap.entries()).map(([key, value]) => ({
            id: key,
            text: value
        }));
    };

    const buildtahunOptions = (data: any[]) => {
        const uniqueMap = new Map<string, string>();

        data.forEach(item => {
            if (typeof item.tahun_anggaran === "string") {
                uniqueMap.set(item.tahun_anggaran, item.tahun_anggaran);
            }

            if (
                typeof item.tahun_anggaran === "object" &&
                item.tahun_anggaran
            ) {
                uniqueMap.set(
                    String(item.tahun_anggaran.id),
                    item.tahun_anggaran.name
                );
            }
        });

        return Array.from(uniqueMap.entries()).map(([key, value]) => ({
            id: key,
            text: value
        }));
    };

    const buildGroupOptions = (data: any[]) => {
        const uniqueMap = new Map<string, string>();

        data.forEach(item => {
            if (typeof item.user.pokja_group === "string") {
                uniqueMap.set(item.user.pokja_group, item.user.pokja_group);
            }

            if (
                typeof item.user.pokja_group === "object" &&
                item.user.pokja_group
            ) {
                uniqueMap.set(
                    String(item.user.pokja_group.id),
                    item.user.pokja_group.name,
                );
            }
        });

        return Array.from(uniqueMap.entries()).map(([key, value]) => ({
            id: key,
            text: value
        }));
    };

    const buildUserOptions = (data: any[]) => {
        const uniqueMap = new Map<string, string>();

        data.forEach(item => {
            if (typeof item.selected_ppk === "string") {
                uniqueMap.set(item.selected_ppk, item.selected_ppk);
            }

            if (
                typeof item.selected_ppk === "object" &&
                item.selected_ppk
            ) {
                uniqueMap.set(
                    String(item.selected_ppk.id),
                    item.selected_ppk.fullname,
                );
            }
        });

        return Array.from(uniqueMap.entries()).map(([key, value]) => ({
            id: key,
            text: value
        }));
    };

    useEffect(() => {
        const fetchDataEntryPengadaan = async () => {
            try {
                const response = await API.get("/dataentry", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = response.data.data;

                const sumberDanaOpts = buildSumberDanaOptions(data);
                setSumberDanaOptions(sumberDanaOpts);

                const metodeOpts = buildMetodePengadaanOptions(data);
                setMetodePengadaanOptions(metodeOpts);

                const tahunOpts = buildtahunOptions(data);
                setTahunOptions(tahunOpts);

                const userOpts = buildUserOptions(data);
                setUserOptions(userOpts);

                const groupOpts = buildGroupOptions(data);
                setGroupOptions(groupOpts)

                const mappingData = data.map((item: DataEntryProps) => ({
                    ...item,
                    pokja: item.user?.fullname,
                    opd: item.user?.opd_organization ?? "Tidak Ada",
                    nomor_kontrak: item.nomor_kontrak ?? "Tidak Ada",
                    nama_pimpinan_perusahaan: item.nama_pimpinan_perusahaan ?? "Tidak Ada",
                    nomor_telp: item.nomor_telp ?? "Tidak Ada",
                    nilai_pagu: FormatRupiah(Number(item.nilai_pagu)),
                    nilai_hps: FormatRupiah(Number(item.nilai_hps)),
                    npwp: item.npwp ?? "Tidak Ada",
                    nilai_penawaran: FormatRupiah(Number(item.nilai_penawaran)) ?? "Tidak Ada",
                    alamat_pemenang: item.alamat_pemenang ?? "Tidak Ada",
                    nilai_negosiasi: FormatRupiah(Number(item.nilai_negosiasi)) ?? "Tidak Ada",
                    nilai_kontrak: FormatRupiah(Number(item.nilai_kontrak)) ?? "Tidak Ada",
                    tanggal_masuk: FormatDate(item.updated_at),
                    efisiensi: FormatRupiah(Number(item.nilai_pagu) - Number(item.nilai_kontrak)),
                    presentase: (((Number(item.nilai_pagu) - Number(item.nilai_kontrak ?? 0)) / Number(item.nilai_pagu)) * 100).toFixed(2) + "%",
                }));

                setDataEntryPengadaan(SortDescById(mappingData));
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        }

        const fetchDataEntryPengadaanById = async () => {
            try {
                if (!selectedId) return;
                const response = await API.get(`/dataentry/${selectedId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDataEntryPengadaanById(response.data.data)

                setSelectedPPK(response.data.data.selected_ppk_id);
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        }

        fetchDataEntryPengadaan();
        fetchDataEntryPengadaanById();
    }, [selectedId, token]);


    const handleEntryPenjabatPengadaanPost = async (data: any, type: string) => {
        try {
            const excludedFields = ["pendaftar", "pemasukan", "no_kontrak", "nilai_kontrak", "tgl_kontrak", "nama_ppk", "jabatan_ppk", "nama_pimpinan_perusahaan", "jabatan_pimpinan"];
            const hasEmptyField = Object.entries(formDataMandotary).some(
                ([key, value]) =>
                    !excludedFields.includes(key) &&
                    (value === "" || value === null || value === undefined)
            );

            if (!data || hasEmptyField || !evidenceFile) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Seluruh field (selain catatan) wajib diisi!",
                    type: "error"
                });
                
                return;
            }

            if (data.jenis_pengadaan == "Pekerjaan Konstruksi") {
                if (!selectedPPK) {
                    SwalMessage({
                        title: "Gagal!",
                        text: "PPK wajib diisi!",
                        type: "error"
                    });
                    return;
                }
            }

            const formData = new FormData();
            if (type == "Pengadaan Langsung") {
                formData.append("tipe", "Penjabat");
                formData.append("kode_paket", data.kd_nontender);
                formData.append("nama_paket", data.nama_paket);
                formData.append("sumber_dana", data.sumber_dana);
                formData.append("jenis_pengadaan", data.jenis_pengadaan);
            }

            if (type == "E-Purchasing V5") {
                formData.append("tipe", "Penjabat");
                formData.append("kode_paket", data.kd_paket);
                formData.append("nama_paket", data.nama_paket);
                formData.append("sumber_dana", data.nama_sumber_dana);
                formData.append("status_paket", data.status_paket);
                formData.append("status_pengiriman", data.paket_status_str);
            }

            if (type == "E-Purchasing V6") {
                formData.append("tipe", "Penjabat");
                formData.append("kode_paket", data.kd_paket);
                formData.append("nama_paket", data.rup_nama_pkt);
                formData.append("sumber_dana", data.sumber_dana);
                formData.append("status_paket", data.status_pkt);
                formData.append("status_pengiriman", data.status_pengiriman);
            }

            if (formDataMandotary.nama_penyedia) {
                formData.append("pemenang", formDataMandotary.nama_penyedia);
            }
            if (formDataMandotary.nomor_telp) {
                formData.append("nomor_telp", formDataMandotary.nomor_telp);
            }
            if (formDataMandotary.email) {
                formData.append("email", formDataMandotary.email);
            }
            if (formDataMandotary.npwp_penyedia) {
                formData.append("npwp", formDataMandotary.npwp_penyedia);
            }

            if (formDataMandotary.alamat_pemenang) {
                formData.append("alamat_pemenang", formDataMandotary.alamat_pemenang);
            }

            formData.append("metode_pengadaan", type);
            formData.append("kode_rup", data.kd_rup);
            formData.append("tahun_anggaran", data.tahun_anggaran);
            if (data.nama_satker) {
                formData.append("satuan_kerja", data.nama_satker);
            }

            if (formDataMandotary.pagu) {
                formData.append("nilai_pagu", formDataMandotary.pagu);
            }
            if (formDataMandotary.hps) {
                formData.append("nilai_hps", formDataMandotary.hps);
            }

            if (formDataMandotary.no_kontrak) {
                formData.append("nomor_kontrak", formDataMandotary.no_kontrak);
            }
            if (formDataMandotary.nilai_kontrak) {
                formData.append("nilai_kontrak", formDataMandotary.nilai_kontrak);
            }
            if (formDataMandotary.tgl_kontrak) {
                formData.append("tanggal_kontrak", formDataMandotary.tgl_kontrak);
            }
            if (formDataMandotary.nama_ppk) {
                formData.append("nama_ppk", formDataMandotary.nama_ppk);
            }
            if (formDataMandotary.jabatan_ppk) {
                formData.append("jabatan_ppk", formDataMandotary.jabatan_ppk);
            }

            if (formDataMandotary.nama_pimpinan_perusahaan) {
                formData.append("nama_pimpinan_perusahaan", formDataMandotary.nama_pimpinan_perusahaan);
            }
            if (formDataMandotary.jabatan_pimpinan) {
                formData.append("jabatan_pimpinan", formDataMandotary.jabatan_pimpinan);
            }

            if (formDataMandotary.nilai_penawaran) {
                formData.append("nilai_penawaran", formDataMandotary.nilai_penawaran);
            }
            if (formDataMandotary.nilai_negosiasi) {
                formData.append("nilai_negosiasi", formDataMandotary.nilai_negosiasi);
            }

            if (formDataMandotary.alamat_pemenang) {
                formData.append("alamat_pemenang", formDataMandotary.alamat_pemenang);
            }

            if (formDataMandotary.lokasi_pekerjaan) {
                formData.append("lokasi_pekerjaan", formDataMandotary.lokasi_pekerjaan);
            }

            if (note) {
                formData.append("catatan", note);
            }
            if (evidenceFile) {
                formData.append("bukti_file", evidenceFile);
            }
            if (selectedPPK) {
                formData.append("selected_ppk_id", selectedPPK);
            } else {
                formData.append("selected_ppk_id", user?.id as any);
            }

            SwalLoading();
            const response = await API.post("/dataentry/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const message = response.data.message;
            SwalMessage({
                title: "Berhasil!",
                text: message,
                type: "success"
            });

            setTimeout(() => {
                navigate("/pokja/data-entry-penjabat-pengadaan/");
            }, 2000);
        } catch (error) {
            if (error) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Terjadi Kesalahan!",
                    type: "error"
                })
            }
        }
    }

    const handleEntryKelompokKerjaPost = async (data: any, type: string) => {
        try {
            const excludedFields = ["pendaftar", "pemasukan", "no_kontrak", "nilai_kontrak", "tgl_kontrak", "nama_ppk", "jabatan_ppk", "nama_pimpinan_perusahaan", "jabatan_pimpinan"];
            const hasEmptyField = Object.entries(formDataMandotary).some(
                ([key, value]) =>
                    !excludedFields.includes(key) &&
                    (value === "" || value === null || value === undefined)
            );

            if (!data || hasEmptyField || !evidenceFile) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Seluruh field (selain catatan) wajib diisi!",
                    type: "error"
                });
                
                return;
            }

            if (data.jenis_pengadaan == "Pekerjaan Konstruksi") {
                if (!selectedPPK) {
                    SwalMessage({
                        title: "Gagal!",
                        text: "PPK wajib diisi!",
                        type: "error"
                    });
                    return;
                }
            }

            const formData = new FormData();
            formData.append("tipe", "Kelompok");
            formData.append("kode_paket", data.kd_tender);
            formData.append("nama_paket", data.nama_paket);
            formData.append("sumber_dana", data.sumber_dana);
            formData.append("jenis_pengadaan", data.jenis_pengadaan);

            if (formDataMandotary.nama_penyedia) {
                formData.append("pemenang", formDataMandotary.nama_penyedia);
            }
            if (formDataMandotary.nomor_telp) {
                formData.append("nomor_telp", formDataMandotary.nomor_telp);
            }
            if (formDataMandotary.email) {
                formData.append("email", formDataMandotary.email);
            }
            if (formDataMandotary.npwp_penyedia) {
                formData.append("npwp", formDataMandotary.npwp_penyedia);
            }

            if (formDataMandotary.alamat) {
                formData.append("alamat_pemenang", formDataMandotary.alamat);
            }

            if (formDataMandotary.pendaftar) {
                formData.append("pendaftar", formDataMandotary.pendaftar);
            }

            if (formDataMandotary.pemasukan) {
                formData.append("pemasukan", formDataMandotary.pemasukan);
            }

            formData.append("metode_pengadaan", type);
            formData.append("kode_rup", data.kd_rup);
            formData.append("tahun_anggaran", data.tahun_anggaran);
            if (data.nama_satker) {
                formData.append("satuan_kerja", data.nama_satker);
            }

            if (formDataMandotary.pagu) {
                formData.append("nilai_pagu", formDataMandotary.pagu);
            }
            if (formDataMandotary.hps) {
                formData.append("nilai_hps", formDataMandotary.hps);
            }

            if (formDataMandotary.no_kontrak) {
                formData.append("nomor_kontrak", formDataMandotary.no_kontrak);
            }
            if (formDataMandotary.nilai_kontrak) {
                formData.append("nilai_kontrak", formDataMandotary.nilai_kontrak);
            }
            if (formDataMandotary.tgl_kontrak) {
                formData.append("tanggal_kontrak", formDataMandotary.tgl_kontrak);
            }
            if (formDataMandotary.nama_ppk) {
                formData.append("nama_ppk", formDataMandotary.nama_ppk);
            }
            if (formDataMandotary.jabatan_ppk) {
                formData.append("jabatan_ppk", formDataMandotary.jabatan_ppk);
            }

            if (formDataMandotary.nama_pimpinan_perusahaan) {
                formData.append("nama_pimpinan_perusahaan", formDataMandotary.nama_pimpinan_perusahaan);
            }
            if (formDataMandotary.jabatan_pimpinan) {
                formData.append("jabatan_pimpinan", formDataMandotary.jabatan_pimpinan);
            }

            if (formDataMandotary.nilai_penawaran) {
                formData.append("nilai_penawaran", formDataMandotary.nilai_penawaran);
            }
            if (formDataMandotary.nilai_negosiasi) {
                formData.append("nilai_negosiasi", formDataMandotary.nilai_negosiasi);
            }

            if (formDataMandotary.alamat_pemenang) {
                formData.append("alamat_pemenang", formDataMandotary.alamat_pemenang);
            }

            if (formDataMandotary.lokasi_pekerjaan) {
                formData.append("lokasi_pekerjaan", formDataMandotary.lokasi_pekerjaan);
            }

            if (note) {
                formData.append("catatan", note);
            }
            if (evidenceFile) {
                formData.append("bukti_file", evidenceFile);
            }
            if (selectedPPK) {
                formData.append("selected_ppk_id", selectedPPK);
            } else {
                formData.append("selected_ppk_id", user?.id as any);
            }

            SwalLoading();
            const response = await API.post("/dataentry/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const message = response.data.message;
            SwalMessage({
                title: "Berhasil!",
                text: message,
                type: "success"
            });

            setTimeout(() => {
                navigate("/pokja/data-entry-kelompok-kerja/");
            }, 2000);
        } catch (error) {
            if (error) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Terjadi Kesalahan!",
                    type: "error"
                })
            }
            console.error(error)
        }
    }

    const handleEntryPenjabatPengadaanPut = async (data: any, type: string) => {
        try {
            const excludedFields = ["pendaftar", "pemasukan", "no_kontrak", "nilai_kontrak", "tgl_kontrak", "nama_ppk", "jabatan_ppk", "nama_pimpinan_perusahaan", "jabatan_pimpinan"];
            const hasEmptyField = Object.entries(formDataMandotary).some(
                ([key, value]) =>
                    !excludedFields.includes(key) &&
                    (value === "" || value === null || value === undefined)
            );

            if (!data || hasEmptyField) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Seluruh field (selain catatan) wajib diisi!",
                    type: "error"
                });
                return;
            }

            if (data.jenis_pengadaan == "Pekerjaan Konstruksi") {
                if (!selectedPPK) {
                    SwalMessage({
                        title: "Gagal!",
                        text: "PPK wajib diisi!",
                        type: "error"
                    });
                    return;
                }
            }

            const formData = new FormData();                    
            formData.append("tipe", "Penjabat");
            formData.append("kode_paket", data.kode_paket);
            formData.append("kode_rup", data.kode_rup);
            formData.append("nama_paket", data.nama_paket);
            formData.append("sumber_dana", data.sumber_dana);
            if (data.satuan_kerja) {
                formData.append("satuan_kerja", data.satuan_kerja);
            }
            if (data.status_paket) {
                formData.append("status_paket", data.status_paket);
            }
            if (data.status_pengiriman) {
                formData.append("status_pengiriman", data.status_pengiriman);
            }

            if (formDataMandotary.nama_penyedia) {
                formData.append("pemenang", formDataMandotary.nama_penyedia);
            }
            if (formDataMandotary.nomor_telp) {
                formData.append("nomor_telp", formDataMandotary.nomor_telp);
            }
            if (formDataMandotary.email) {
                formData.append("email", formDataMandotary.email);
            }
            if (formDataMandotary.npwp_penyedia) {
                formData.append("npwp", formDataMandotary.npwp_penyedia);
            }

            if (formDataMandotary.alamat_pemenang) {
                formData.append("alamat_pemenang", formDataMandotary.alamat_pemenang);
            }

            formData.append("metode_pengadaan", type);
            formData.append("kode_rup", data.kd_rup);
            formData.append("tahun_anggaran", data.tahun_anggaran);
            if (data.nama_satker) {
                formData.append("satuan_kerja", data.nama_satker);
            }

            if (formDataMandotary.pagu) {
                formData.append("nilai_pagu", formDataMandotary.pagu);
            }
            if (formDataMandotary.hps) {
                formData.append("nilai_hps", formDataMandotary.hps);
            }

            if (formDataMandotary.no_kontrak) {
                formData.append("nomor_kontrak", formDataMandotary.no_kontrak);
            }
            if (formDataMandotary.nilai_kontrak) {
                formData.append("nilai_kontrak", formDataMandotary.nilai_kontrak);
            }
            if (formDataMandotary.tgl_kontrak) {
                formData.append("tanggal_kontrak", formDataMandotary.tgl_kontrak);
            }
            if (formDataMandotary.nama_ppk) {
                formData.append("nama_ppk", formDataMandotary.nama_ppk);
            }
            if (formDataMandotary.jabatan_ppk) {
                formData.append("jabatan_ppk", formDataMandotary.jabatan_ppk);
            }

            if (formDataMandotary.nama_pimpinan_perusahaan) {
                formData.append("nama_pimpinan_perusahaan", formDataMandotary.nama_pimpinan_perusahaan);
            }
            if (formDataMandotary.jabatan_pimpinan) {
                formData.append("jabatan_pimpinan", formDataMandotary.jabatan_pimpinan);
            }

            if (formDataMandotary.nilai_penawaran) {
                formData.append("nilai_penawaran", formDataMandotary.nilai_penawaran);
            }
            if (formDataMandotary.nilai_negosiasi) {
                formData.append("nilai_negosiasi", formDataMandotary.nilai_negosiasi);
            }

            if (formDataMandotary.alamat_pemenang) {
                formData.append("alamat_pemenang", formDataMandotary.alamat_pemenang);
            }

            if (formDataMandotary.lokasi_pekerjaan) {
                formData.append("lokasi_pekerjaan", formDataMandotary.lokasi_pekerjaan);
            }

            if (note) {
                formData.append("catatan", note);
            }
            if (evidenceFile) {
                formData.append("bukti_file", evidenceFile);
            }
            if (selectedPPK) {
                formData.append("selected_ppk_id", selectedPPK);
            } else {
                formData.append("selected_ppk_id", user?.id as any);
            }

            SwalLoading();
            const response = await API.put(`/dataentry/update/${selectedId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const message = response.data.message;
            SwalMessage({
                title: "Berhasil!",
                text: message,
                type: "success"
            });

            setTimeout(() => {
                navigate("/pokja/data-entry-penjabat-pengadaan/");
            }, 2000);
        } catch (error) {
            if (error) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Terjadi Kesalahan!",
                    type: "error"
                })
            }
            console.error(error)
        }
    }

    const handleEntryKelompokKerjaPut = async (data: any, type: string) => {
        try {
            const excludedFields = ["pendaftar", "pemasukan", "no_kontrak", "nilai_kontrak", "tgl_kontrak", "nama_ppk", "jabatan_ppk", "nama_pimpinan_perusahaan", "jabatan_pimpinan"];
            const hasEmptyField = Object.entries(formDataMandotary).some(
                ([key, value]) =>
                    !excludedFields.includes(key) &&
                    (value === "" || value === null || value === undefined)
            );

            if (!data || hasEmptyField) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Seluruh field (selain catatan) wajib diisi!",
                    type: "error"
                });
                return;
            }

            const formData = new FormData();
            formData.append("tipe", "Kelompok");
            formData.append("kode_paket", data.kode_paket);
            formData.append("nama_paket", data.nama_paket);
            formData.append("sumber_dana", data.sumber_dana);
            formData.append("jenis_pengadaan", data.jenis_pengadaan);
            formData.append("metode_pengadaan", type);
            formData.append("kode_rup", data.kode_rup);
            formData.append("satuan_kerja", data.satuan_kerja);
            formData.append("tahun_anggaran", data.tahun_anggaran);

            if (formDataMandotary.nama_penyedia) {
                formData.append("pemenang", formDataMandotary.nama_penyedia);
            }
            if (formDataMandotary.nomor_telp) {
                formData.append("nomor_telp", formDataMandotary.nomor_telp);
            }
            if (formDataMandotary.email) {
                formData.append("email", formDataMandotary.email);
            }
            if (formDataMandotary.npwp_penyedia) {
                formData.append("npwp", formDataMandotary.npwp_penyedia);
            }

            if (formDataMandotary.alamat) {
                formData.append("alamat_pemenang", formDataMandotary.alamat);
            }

            if (formDataMandotary.pendaftar) {
                formData.append("pendaftar", formDataMandotary.pendaftar);
            }

            if (formDataMandotary.pemasukan) {
                formData.append("pemasukan", formDataMandotary.pemasukan);
            }

            if (formDataMandotary.pagu) {
                formData.append("nilai_pagu", formDataMandotary.pagu);
            }
            if (formDataMandotary.hps) {
                formData.append("nilai_hps", formDataMandotary.hps);
            }

            if (formDataMandotary.no_kontrak) {
                formData.append("nomor_kontrak", formDataMandotary.no_kontrak);
            }
            if (formDataMandotary.nilai_kontrak) {
                formData.append("nilai_kontrak", formDataMandotary.nilai_kontrak);
            }
            if (formDataMandotary.tgl_kontrak) {
                formData.append("tanggal_kontrak", formDataMandotary.tgl_kontrak);
            }
            if (formDataMandotary.nama_ppk) {
                formData.append("nama_ppk", formDataMandotary.nama_ppk);
            }
            if (formDataMandotary.jabatan_ppk) {
                formData.append("jabatan_ppk", formDataMandotary.jabatan_ppk);
            }

            if (formDataMandotary.nama_pimpinan_perusahaan) {
                formData.append("nama_pimpinan_perusahaan", formDataMandotary.nama_pimpinan_perusahaan);
            }
            if (formDataMandotary.jabatan_pimpinan) {
                formData.append("jabatan_pimpinan", formDataMandotary.jabatan_pimpinan);
            }

            if (formDataMandotary.nilai_penawaran) {
                formData.append("nilai_penawaran", formDataMandotary.nilai_penawaran);
            }
            if (formDataMandotary.nilai_negosiasi) {
                formData.append("nilai_negosiasi", formDataMandotary.nilai_negosiasi);
            }

            if (formDataMandotary.alamat_pemenang) {
                formData.append("alamat_pemenang", formDataMandotary.alamat_pemenang);
            }

            if (formDataMandotary.lokasi_pekerjaan) {
                formData.append("lokasi_pekerjaan", formDataMandotary.lokasi_pekerjaan);
            }

            if (note) {
                formData.append("catatan", note);
            } else {
                formData.append("catatan", data.catatan)
            }
            if (evidenceFile) {
                formData.append("bukti_file", evidenceFile);
            }
            if (selectedPPK) {
                formData.append("selected_ppk_id", selectedPPK);
            } else {
                formData.append("selected_ppk_id", user?.id as any);
            }

            SwalLoading();
            const response = await API.put(`/dataentry/update/${selectedId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const message = response.data.message;
            SwalMessage({
                title: "Berhasil!",
                text: message,
                type: "success"
            });

            setTimeout(() => {
                navigate("/pokja/data-entry-kelompok-kerja/");
            }, 2000);
        } catch (error) {
            if (error) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Terjadi Kesalahan!",
                    type: "error"
                })
            }
            console.error(error)
        }
    }    

    const handleChangeMadotaryPenjabatPengadaan = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormDataMandotrary((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeEntryPenjabatPengadaan = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "note") return setNote(value);
        if (name === "ppk") return setSelectedPPK(value);
    };

    const handleChangeFileEntryPenjabatPengadaan = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setEvidenceFile(e.target.files[0]);
        } else {
            setEvidenceFile(null);
        }
    };

    const handleDataEntryPengadaanDelete = async (ids: number[]) => {
        try {
            if (ids.length === 0) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Harap pilih minimal 1 data yang dihapus!",
                    type: "error"
                });
                return;
            }

            const result = await SwalMessage({
                title: "Peringatan!",
                text: "Apakah anda yakin untuk menghapus data ini?",
                type: 'warning',
                confirmText: "Iya",
                cancelText: "Tidak",
                showCancelButton: true,
            });

            let response;
            if (result.isConfirmed) {
                for (let index = 0; index < ids.length; index++) {
                    const id = ids[index];
                    SwalLoading();
                    response = await API.delete(`/dataentry/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }

                const message = response?.data.message;
                SwalMessage({
                    title: "Berhasil!",
                    text: message,
                    type: "success"
                });

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error: any) {
            if (error) {
                SwalMessage({
                    title: "Gagal!",
                    text: error.response.data.message,
                    type: "error"
                });
            }
        }
    }

    return {
        note,
        selectedPPK,
        handleEntryPenjabatPengadaanPost,
        handleChangeEntryPenjabatPengadaan,
        handleChangeFileEntryPenjabatPengadaan,
        dataEntryPengadaan,
        setSelectedId,
        dataEntryPengadaanById,
        handleEntryPenjabatPengadaanPut,
        handleDataEntryPengadaanDelete,
        sumberDanaOptions,
        metodePengadaanOptions,
        tahunOptions,
        userOptions,
        groupOptions,
        handleChangeMadotaryPenjabatPengadaan,
        formDataMandotary,
        setFormDataMandotrary,
        handleEntryKelompokKerjaPost,
        handleEntryKelompokKerjaPut
    }
}
