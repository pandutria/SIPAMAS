/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { SwalMessage } from "../utils/SwalMessage";
import API from "../server/API";
import { useNavigate } from "react-router-dom";
import type { EvaluasiProps } from "../types/global";
import SwalLoading from "../utils/SwalLoading";

export default function useEvaluasiHooks() {
  const [evaluasiForm, setEvaluasiForm] = useState({
    skor: "",
    tindakan: "",
    catatan: ""
  });
  const navigate = useNavigate();
  const [evaluasiData, setEvaluasiData] = useState<EvaluasiProps[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvaluasi = async() => {
        try {
            const response = await API.get("/evaluasi", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setEvaluasiData(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    fetchEvaluasi();
  }, [token]);

  const handleEvaluasiPost = async(realisasiHeaderId: number) => {
    try {
        if (evaluasiForm.skor == "" || evaluasiForm.tindakan == "" || evaluasiForm.catatan == "") {
            SwalMessage({
                type: "error",
                title: "Gagal!",
                text: "Data wajib diisi!"
            });

            return;
        }

        SwalLoading();
        const formData = new FormData();
        formData.append("realisasi_header_id", String(realisasiHeaderId));
        formData.append("skor", evaluasiForm.skor);
        formData.append("tindakan", evaluasiForm.tindakan);
        formData.append("catatan", evaluasiForm.catatan);

        const response = await API.post("/evaluasi/create", formData, {
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
            navigate("/admin-direksi/evaluasi");
        }, 2000);
    } catch (error: any) {
        SwalMessage({
            type: "error",
            title: "Gagal!",
            text: error?.response?.data?.message
        })
    }
  }

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEvaluasiForm(prev => ({
        ...prev,
        [name]: value
    }))
  }

  const handleEvaluasiDelete = async(id: number) => {
    try {
        SwalLoading();
        const response = await API.delete(`/evaluasi/delete/${id}`, {
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
            navigate("/admin-direksi/evaluasi");
        }, 2000);
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
    evaluasiData,
    evaluasiForm,
    handleChangeForm,
    setEvaluasiForm,
    handleEvaluasiPost,
    handleEvaluasiDelete
  }
}
