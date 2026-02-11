/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { SwalMessage } from "../utils/SwalMessage";
import API from "../server/API";
import { SortDescById } from "../utils/SortDescById";
import SwalLoading from "../utils/SwalLoading";

export default function usePokjaGroupHooks() {
    const [pokjaGroupName, setPokjaGroupName] = useState('');
    const token = localStorage.getItem("token");
    const [pokjaGroup, setPokjaGroup] = useState<pokjaGroupProps[]>([]);

    useEffect(() => {
        const fetchPokjaGroup = async () => {
            try {
                const response = await API.get("/pokja-group", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPokjaGroup(SortDescById(response.data.data));
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        }

        fetchPokjaGroup();
    }, [token]);

    const handlePokjaGroupPost = async () => {
        try {
            if (!pokjaGroupName) {
                SwalMessage({
                    type: 'error',
                    title: "Gagal!",
                    text: "Harap mengisi kolom yang disediakan!",
                });
                return;
            }

            SwalLoading();
            const response = await API.post("/pokja-group/create", {
                name: pokjaGroupName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            SwalMessage({
                type: 'success',
                title: "Berhasil!",
                text: response.data.message,
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                type: 'error',
                title: "Gagal!",
                text: error.response.data.message,
            })
        }
    }

    const handlePokjaGroupUpdate = async (id: number) => {
        try {
            if (!pokjaGroupName) {
                SwalMessage({
                    type: 'error',
                    title: "Gagal!",
                    text: "Harap mengisi kolom yang disediakan!",
                })
            }

            const response = await API.put(`/pokja-group/update/${id}`, {
                name: pokjaGroupName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            SwalMessage({
                type: 'success',
                title: "Berhasil!",
                text: response.data.message,
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                type: 'error',
                title: "Gagal!",
                text: error.response.data.message,
            })
        }
    }

    const handlePokjaGroupDelete = async (ids: number[]) => {
        try {
            if (ids.length === 0) {
                SwalMessage({
                    type: 'error',
                    title: "Gagal!",
                    text: "Harap pilih data yang ingin dihapus!",
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
                    response = await API.delete(`/pokja-group/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
            }

            SwalMessage({
                type: 'success',
                title: "Berhasil!",
                text: response?.data.message,
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            if (error) {
                SwalMessage({
                    type: 'error',
                    title: "Gagal!",
                    text: "Harap pilih data yang ingin dihapus!",
                });
            }
        }
    }

    const handlePokjaGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'pokja-group') return setPokjaGroupName(value);
    }

    return {
        pokjaGroupName,
        handlePokjaGroupChange,
        handlePokjaGroupPost,
        pokjaGroup,
        handlePokjaGroupUpdate,
        handlePokjaGroupDelete
    }
}
