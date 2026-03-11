/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import API from "../server/API";
import { SortDescById } from "../utils/SortDescById";
import { SwalMessage } from "../utils/SwalMessage";
import { useNavigate } from "react-router-dom";
import SwalLoading from "../utils/SwalLoading";

export default function usePengaduanHooks() {
    const [pengaduanData, setPengaduanData] = useState<PengaduanProps[]>([]);
    const [pengaduanDataById, setPengaduanDataById] = useState<PengaduanProps | null>(null);
    const [selectedPengaduanId, setSelectedPengaduanId] = useState<number | null>(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [projectIdentityForm, setProjectIdentityForm] = useState<string | null | number>("");
    const [pengaduanForm, setPengaduanForm] = useState({
        kategori: "",
        judul: "",
        deskripsi: "",
        alamat: "",
    });
    const [pengaduanReviewForm, setPengaduanReviewForm] = useState({
        catatan: "",
        rating: ""
    });

    useEffect(() => {
        const fetchPengaduan = async () => {
            try {
                const response = await API.get("/pengaduan", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data.data;
                const mappingData = data?.map((item: PengaduanProps) => ({
                    ...item,
                    nama: item.created_by!.fullname,
                    kontak: item?.created_by!.phone_number ?? "-",
                }))

                setPengaduanData(SortDescById(mappingData || []))
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        }

        const fetchPengaduanById = async () => {
            try {
                if (!selectedPengaduanId) return;
                const response = await API.get(`/pengaduan/${selectedPengaduanId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data.data;
                setPengaduanDataById(data)
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        }

        fetchPengaduan();
        fetchPengaduanById();
    }, [token, selectedPengaduanId]);

    const handlePengaduanPost = async (mediaForms: PengaduanMediaProps[]) => {
        try {
            SwalLoading();
            const formData = new FormData();
            formData.append("kategori", pengaduanForm.kategori);
            formData.append("judul", pengaduanForm.judul);
            formData.append("deskripsi", pengaduanForm.deskripsi);
            formData.append("alamat", pengaduanForm.alamat);
            formData.append("longitude", "");
            formData.append("latitude", "");

            const responseParent = await API.post("/pengaduan/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            for (let index = 0; index < mediaForms.length; index++) {
                const mediaForm = mediaForms[index];
                const formMediaData = new FormData();
                formMediaData.append("pengaduan_id", responseParent.data.data.id);
                formMediaData.append("media_file", mediaForm.media_file);
                formMediaData.append("media_tipe", mediaForm.media_tipe);
                console.log(mediaForm);

                await API.post("/pengaduan/media/create", formMediaData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            const message = responseParent.data.message;
            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: message
            });

            setTimeout(() => {
                navigate("/masyarakat/riwayat-laporan");
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                type: "error",
                title: "Gagal!",
                text: error.response?.data.message
            });
        }
    }

    const handlePegaduanChangeForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPengaduanForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handlePengaduanStatusPut = async (status: string, catatan: string | null, id: number) => {
        try {
            SwalLoading();
            const formData = new FormData();
            formData.append("status", status);
            if (catatan) {
                formData.append("catatan", catatan);
            }

            const response = await API.put(`/pengaduan/status/update/${id}`, formData, {
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
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                type: "error",
                title: "Gagal!",
                text: error?.response.data.message
            })
        }
    }

    const handlePengaduanSetProjectIdentity = async (id: number) => {
        try {
            SwalLoading();
            const formData = new FormData();
            formData.append("identitas_proyek_id", String(projectIdentityForm));

            const response = await API.put(`/pengaduan/update/identitas/${id}`, formData, {
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
        } catch (error: any) {
            if (error) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: error?.response.data.message
                })
            }
        }
    }

    const handlePengaduanReviewPost = async (id: number) => {
        try {
            SwalLoading();
            const formData = new FormData();
            formData.append("pengaduan_id", String(id));
            formData.append("rating", pengaduanReviewForm.rating);
            formData.append("catatan", pengaduanReviewForm.catatan);

            const response = await API.post("/pengaduan/review/create", formData, {
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
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                type: "error",
                title: "Gagal!",
                text: error.response?.data.message
            });
        }
    }

    const handleChangePengaduanReviewForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPengaduanReviewForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return {
        pengaduanData,
        pengaduanForm,
        handlePegaduanChangeForm,
        handlePengaduanPost,
        setSelectedPengaduanId,
        pengaduanDataById,
        handlePengaduanStatusPut,
        pengaduanReviewForm,
        handleChangePengaduanReviewForm,
        handlePengaduanReviewPost,
        handlePengaduanSetProjectIdentity,
        projectIdentityForm,
        setProjectIdentityForm
    }
}
