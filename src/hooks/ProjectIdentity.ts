/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import API from "../server/API";
import { SortDescById } from "../utils/SortDescById";
import { SwalMessage } from "../utils/SwalMessage";
import SwalLoading from "../utils/SwalLoading";
import { ConvertToBase64 } from "../utils/ConvertToBase64";
import { useNavigate } from "react-router-dom";
import { FormatDate } from "../utils/FormatDate";

export default function useProjectIdentity() {
    const [projectIdentityData, setProjectIdentityData] = useState<ProjectIdentityProps[]>([]);
    const [projectIdentityByIdData, setProjectIdentityByIdData] = useState<ProjectIdentityProps | null>(null);
    const [tahunData, setTahunData] = useState<any>([]);
    const [selectedProjectIdentityId, setSelectedProjectIdentityId] = useState<number | null>(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [projectIdentityForm, setProjectIdentityForm] = useState({
        nama: "",
        tahun_anggaran: "",
        kategori: "",
        provinsi: "Maluku Utara",
        kabupaten: "Halmahera Tengah",
        kecamatan: "",
        kecamatan_kode: "",
        kelurahan: "",
        nilai_kontrak: "",
        sumber_dana: "",
        kontraktor_pelaksana: "",
        konsultas_pengawas: "",
        kontrak_file: "",
        surat_perintah_file: "",
        surat_penunjukan_file: "",
        berita_acara_file: "",
    });

    const buildTahunOptions = (data: any) => {
        const uniqueYears = Array.from(
            new Set(
                data
                    .map((item: any) => Number(item?.tahun_anggaran))
                    .filter((v: any): v is number => typeof v === "number")
            )
        ).sort((a: any, b: any) => b - a);

        return uniqueYears.map((tahun: any) => ({
            id: tahun.toString(),
            text: tahun.toString()
        }));
    };

    const fetchIdentityProjectById = async () => {
        if (!selectedProjectIdentityId) return;
        const response = await API.get(`/identitas-proyek/${selectedProjectIdentityId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = response.data.data;
        const mappingData = {
            ...data,
            "documents": data.documents.map((item: ProjectIdentityDocumentProps) => ({
                ...item,
                "created_at": FormatDate(item.created_at!.toString())
            }))
        }

        setProjectIdentityByIdData(mappingData);
        setProjectIdentityForm(prev => ({
            ...prev,
            nama: data?.nama ?? "",
            tahun_anggaran: data?.tahun_anggaran ?? "",
            kategori: data?.kategori ?? "",
            provinsi: data?.provinsi ?? "",
            kabupaten: data?.kabupaten ?? "",
            kecamatan: data?.kecamatan ?? "",
            kecamatan_kode: data?.kecamatan_kode ?? "",
            kelurahan: data?.kelurahan ?? "",
            nilai_kontrak: data?.nilai_kontrak ?? "",
            sumber_dana: data?.sumber_dana ?? "",
            kontraktor_pelaksana: data?.kontraktor_pelaksana ?? "",
            konsultas_pengawas: data?.konsultas_pengawas ?? "",
            kontrak_file: data?.kontrak_file,
            surat_perintah_file: data?.surat_perintah_file,
            surat_penunjukan_file: data?.surat_penunjukan_file,
            berita_acara_file: data?.berita_acara_file,
        }));
    }

    useEffect(() => {
        const fetchIdentityProject = async () => {
            try {
                const response = await API.get("/identitas-proyek", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data.data;
                const mappingData = data.map((item: ProjectIdentityProps) => ({
                    ...item,
                    project_id: `TND-0${item.id}`,
                    status: item.photos.filter(data => data.type == "end").length == 0 || item.photos.filter(data => data.type == "end").length == 0 ? "Belum Lengkap" : "Sudah Lengkap"
                }));

                const tahunOpts = buildTahunOptions(data);

                setTahunData(tahunOpts);
                setProjectIdentityData(SortDescById(mappingData || []));
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan!")
                }
            }
        }

        fetchIdentityProject();
        fetchIdentityProjectById();
    }, [token, selectedProjectIdentityId]);

    const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProjectIdentityForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files || files.length === 0) return;
        setProjectIdentityForm(prev => ({
            ...prev,
            [name]: files[0],
        }))
    }

    const handleProjectIdentityPost = async (photosData: any, documentsData: ProjectIdentityDocumentProps[], coords: any) => {
        try {
            if (photosData.start.length == 0 || !coords) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Data wajib diiisi!"
                });

                return;
            }

            const formData = new FormData();
            formData.append("nama", projectIdentityForm.nama);
            formData.append("tahun_anggaran", projectIdentityForm.tahun_anggaran);
            formData.append("kategori", projectIdentityForm.kategori);
            formData.append("kecamatan", projectIdentityForm.kecamatan);
            formData.append("kelurahan", projectIdentityForm.kelurahan);
            formData.append("longitude", coords.lng);
            formData.append("latitude", coords.lat);
            formData.append("nilai_kontrak", projectIdentityForm.nilai_kontrak);
            formData.append("kontraktor_pelaksana", projectIdentityForm.kontraktor_pelaksana);
            formData.append("konsultas_pengawas", projectIdentityForm.konsultas_pengawas);
            formData.append("sumber_dana", projectIdentityForm.sumber_dana);
            formData.append("kontrak_file", projectIdentityForm.kontrak_file);
            formData.append("surat_perintah_file", projectIdentityForm.surat_perintah_file);
            formData.append("surat_penunjukan_file", projectIdentityForm.surat_penunjukan_file);
            formData.append("berita_acara_file", projectIdentityForm.berita_acara_file);

            SwalLoading();
            const responseParent = await API.post("/identitas-proyek/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const parentId = responseParent.data.data.id;
            for (let index = 0; index < photosData.start.length; index++) {
                const photoData = photosData.start[index];

                const formData = new FormData();
                formData.append("identitas_proyek_id", parentId);
                formData.append("title", photoData.title);
                formData.append("type", "start");
                formData.append("photo_file", ConvertToBase64(photoData.photo_file, `photo-${index}.png`));

                await API.post("/identitas-proyek/photo/create", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            for (let index = 0; index < photosData.end.length; index++) {
                const photoData = photosData.end[index];

                const formData = new FormData();
                formData.append("identitas_proyek_id", parentId);
                formData.append("title", photoData.title);
                formData.append("type", "end");
                formData.append("photo_file", ConvertToBase64(photoData.photo_file, `photo-${index}.png`));

                await API.post("/identitas-proyek/photo/create", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            for (let index = 0; index < documentsData.length; index++) {
                const documentData = documentsData[index];

                const formData = new FormData();
                formData.append("identitas_proyek_id", parentId);
                formData.append("name", documentData?.name);
                formData.append("kategori", documentData?.kategori);
                formData.append("photo_file", documentData?.photo_file);

                await API.post("/identitas-proyek/document/create", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            const message = responseParent?.data?.message;
            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: message
            });

            setTimeout(() => {
                navigate("/admin-direksi/identitas-proyek")
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                type: 'error',
                title: "Gagal!",
                text: error?.response?.data?.message,
            });
        }
    }

    const handleProjectIdentityPut = async (coords: any) => {
        try {
            const formData = new FormData();
            formData.append("nama", projectIdentityForm.nama);
            formData.append("tahun_anggaran", projectIdentityForm.tahun_anggaran);
            formData.append("kategori", projectIdentityForm.kategori);
            formData.append("kecamatan", projectIdentityForm.kecamatan);
            formData.append("kelurahan", projectIdentityForm.kelurahan);
            formData.append("longitude", coords.lng);
            formData.append("latitude", coords.lat);
            formData.append("nilai_kontrak", projectIdentityForm.nilai_kontrak);
            formData.append("kontraktor_pelaksana", projectIdentityForm.kontraktor_pelaksana);
            formData.append("konsultas_pengawas", projectIdentityForm.konsultas_pengawas);
            formData.append("sumber_dana", projectIdentityForm.sumber_dana);
            formData.append("kontrak_file", projectIdentityForm.kontrak_file);
            formData.append("surat_perintah_file", projectIdentityForm.surat_perintah_file);
            formData.append("surat_penunjukan_file", projectIdentityForm.surat_penunjukan_file);
            formData.append("berita_acara_file", projectIdentityForm.berita_acara_file);

            SwalLoading();
            const responseParent = await API.put(`/identitas-proyek/update/${selectedProjectIdentityId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const message = responseParent?.data?.message;
            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: message
            });

            setTimeout(() => {
                navigate("/admin-direksi/identitas-proyek")
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                type: 'error',
                title: "Gagal!",
                text: error?.response?.data?.message,
            });
        }
    }

    const handleProjectIdentityDelete = async (ids: number[]) => {
        try {
            if (ids.length == 0) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Harap pilih satu data terlebih dahulu!"
                })

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
                SwalLoading();

                for (let index = 0; index < ids.length; index++) {
                    const id = ids[index];
                    response = await API.delete(`/identitas-proyek/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const message = response.data.message;
                    SwalMessage({
                        type: "success",
                        title: "Berhasil!",
                        text: message
                    });
                }

                const message = response?.data.message;
                SwalMessage({
                    type: "success",
                    title: "Berhasil!",
                    text: message
                });

                fetchIdentityProjectById();
            }
        } catch (error: any) {
            SwalMessage({
                type: "error",
                title: "Gagal!",
                text: error.response?.data?.message
            });
        }
    }

    const handleProjectIdentityPhotoPost = async (datas: ProjectIdentityPhotoProps[], type: string, id: number) => {
        try {
            let response;
            SwalLoading();

            for (let index = 0; index < datas.length; index++) {
                const data = datas[index];

                const formData = new FormData();
                formData.append("identitas_proyek_id", String(id));
                formData.append("title", data.title ?? "");
                formData.append("type", type);
                formData.append("photo_file", ConvertToBase64(data.photo_file as any, `photo-${index}.png`));

                response = await API.post("/identitas-proyek/photo/create", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            const message = response?.data.message;
            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: message
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                type: 'error',
                title: "Gagal!",
                text: error?.response?.data?.message,
            });
        }
    }

    const handleProjectIdentityPhotoDelete = async (id: number) => {
        try {
            const result = await SwalMessage({
                title: "Peringatan!",
                text: "Apakah anda yakin untuk menghapus data ini?",
                type: 'warning',
                confirmText: "Iya",
                cancelText: "Tidak",
                showCancelButton: true,
            });

            if (result.isConfirmed) {
                const response = await API.delete(`/identitas-proyek/photo/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const message = response.data.message;
                SwalMessage({
                    type: "success",
                    title: "Berhasil!",
                    text: message
                });

                fetchIdentityProjectById();
            }
        } catch (error: any) {
            if (error) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: error?.response?.data?.message
                })
            }
        }
    }

    const handleProjectIdentityDocumentPost = async (data: ProjectIdentityDocumentProps, id: number) => {
        try {
            SwalLoading();
            const formData = new FormData();
            formData.append("identitas_proyek_id", String(id));
            formData.append("name", data.name);
            formData.append("kategori", data.kategori);
            formData.append("photo_file", data.photo_file);

            const response = await API.post("/identitas-proyek/document/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const message = response.data.message;
            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: message
            });

            setTimeout(() => {
                window.location.reload()
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                type: "error",
                title: "Gagal!",
                text: error.response?.data?.message
            })
        }
    }

    const handleProjectIdentityDocumentDelete = async (ids: number[]) => {
        try {
            if (ids.length == 0) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Harap pilih satu data terlebih dahulu!"
                })

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
            
            if (result.isConfirmed) {
                SwalLoading();
                let response;

                for (let index = 0; index < ids.length; index++) {
                    const id = ids[index];
                    response = await API.delete(`/identitas-proyek/document/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const message = response.data.message;
                    SwalMessage({
                        type: "success",
                        title: "Berhasil!",
                        text: message
                    });
                }

                const message = response?.data.message;
                SwalMessage({
                    type: "success",
                    title: "Berhasil!",
                    text: message
                });

                fetchIdentityProjectById();
            }
        } catch (error) {
            if (error) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Terjadi Kesalahan!"
                })
            }
        }
    }

    return {
        projectIdentityData,
        tahunData,
        handleChangeFile,
        handleChangeForm,
        handleProjectIdentityPost,
        handleProjectIdentityPut,
        handleProjectIdentityDelete,
        projectIdentityForm,
        setProjectIdentityForm,
        projectIdentityByIdData,
        setSelectedProjectIdentityId,
        handleProjectIdentityPhotoPost,
        handleProjectIdentityPhotoDelete,
        handleProjectIdentityDocumentPost,
        handleProjectIdentityDocumentDelete
    }
}
