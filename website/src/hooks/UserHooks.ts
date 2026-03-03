/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { SwalMessage } from "../utils/SwalMessage";
import API from "../server/API";
import { SortDescById } from "../utils/SortDescById";
import SwalLoading from "../utils/SwalLoading";

export default function useUserHooks() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [fullname, setFullname] = useState('');
    const [nik, setNik] = useState('');
    const [nip, setNip] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [jabatan, setJabatan] = useState("");
    const [skNumber, setSkNumber] = useState('');
    const [skFile, setSkFile] = useState<File | null>(null);
    const [ktpFile, setKtpFile] = useState<File | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [isActive, setIsActive] = useState<any>("true");
    const [listUser, setListUser] = useState<UserProps[]>([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await API.get("/user", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const users = SortDescById(response.data.data).map((item: any) => ({
                    ...item,
                    phone_number: item?.phone_number ?? "-",
                    jabatan: item?.jabatan ?? "-",
                    nik: item?.nik ?? "-",
                    status: item.is_active == "true" ? "Aktif" : "Tidak Aktif"
                }));

                setListUser(users);
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        }

        fetchUser();
    }, [token]);

    const handleUserPost = async () => {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Format email tidak valid!",
                    type: "error"
                })
                return;
            }

            if (password && password.length < 8) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Kata sandi tidak boleh kurang dari 8 karakter",
                    type: "error"
                });
                return;
            }

            const formData = new FormData();
            formData.append("email", email);
            formData.append("role", role);
            formData.append("is_active", `${isActive}`);
            if (fullname) formData.append("fullname", fullname);
            if (password) formData.append("password", password);
            if (nik) formData.append("nik", nik);
            if (nip) formData.append("nip", nip);
            if (address) formData.append("address", address);
            if (jabatan) formData.append("jabatan", jabatan);
            if (phoneNumber) formData.append("phone_number", phoneNumber);
            if (skNumber) formData.append("sk_number", skNumber);
            if (skFile) formData.append("sk_file", skFile);
            if (profilePhoto) formData.append("profile_file", profilePhoto);

            SwalLoading()
            const response = await API.post("/user/create", formData, {
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
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                title: "Gagal!",
                text: error.response.data.message,
                type: "error"
            });
        }
    }

    const handleUserRegister = async () => {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Format email tidak valid!",
                    type: "error"
                })
                return;
            }

            if (password && password.length < 8) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Kata sandi tidak boleh kurang dari 8 karakter",
                    type: "error"
                });
                return;
            }

            const formData = new FormData();
            formData.append("email", email);
            if (fullname) formData.append("fullname", fullname);
            if (nik) formData.append("nik", nik);
            if (password) formData.append("password", password);
            if (address) formData.append("address", address);
            if (ktpFile ) formData.append("ktp_file", ktpFile);

            SwalLoading()
            const response = await API.post("/auth/register", formData);
            const message = response.data.message;

            SwalMessage({
                title: "Berhasil!",
                text: message,
                type: "success"
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                title: "Gagal!",
                text: error.response.data.message,
                type: "error"
            });
        }
    }

    const handleUserPut = async (id: number) => {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Format email tidak valid!",
                    type: "error"
                })
                return;
            }

            if (password && password.length < 8) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Kata sandi tidak boleh kurang dari 8 karakter",
                    type: "error"
                });
                return;
            }

            const formData = new FormData();
            formData.append("email", email);
            formData.append("role", role);
            formData.append("is_active", `${isActive}`);
            if (fullname) formData.append("fullname", fullname);
            if (password) formData.append("password", password);
            if (nik) formData.append("nik", nik);
            if (nip) formData.append("nip", nip);
            if (address) formData.append("address", address);
            if (jabatan) formData.append("jabatan", jabatan);
            if (phoneNumber) formData.append("phone_number", phoneNumber);
            if (skNumber) formData.append("sk_number", skNumber);
            if (skFile) formData.append("sk_file", skFile);
            if (profilePhoto) formData.append("profile_file", profilePhoto);

            SwalLoading();
            const response = await API.put(`/user/update/${id}`, formData, {
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
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                title: "Gagal!",
                text: error.response?.data?.message,
                type: "error"
            });
        }
    }

    const handleVerificationUserPut = async (id: number) => {
        try {
            const formData = new FormData();
            formData.append("is_active", isActive);

            SwalLoading();
            await API.put(`/user/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const message = "Akun pengguna berhasil diverifikasi!";
            SwalMessage({
                title: "Berhasil!",
                text: message,
                type: "success"
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                title: "Gagal!",
                text: error.response?.data?.message,
                type: "error"
            });
        }
    }

    const handleUserUpdateProfile = async () => {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Format email tidak valid!",
                    type: "error"
                })
                return;
            }

            if (password && password.length < 8) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Kata sandi tidak boleh kurang dari 8 karakter",
                    type: "error"
                });
                return;
            }

            const formData = new FormData();
            formData.append("email", email);
            formData.append("role", role);
            formData.append("is_active", `${isActive}`);
            if (fullname) formData.append("fullname", fullname);
            if (password) formData.append("password", password);
            if (nik) formData.append("nik", nik);
            if (nip) formData.append("nip", nip);
            if (address) formData.append("address", address);
            if (jabatan) formData.append("jabatan", jabatan);
            if (phoneNumber) formData.append("phone_number", phoneNumber);
            if (skNumber) formData.append("sk_number", skNumber);
            if (skFile) formData.append("sk_file", skFile);
            if (ktpFile) formData.append("ktp_file", ktpFile);
            if (profilePhoto) formData.append("profile_file", profilePhoto);

            SwalLoading();
            const response = await API.put("/auth/profile/update", formData, {
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
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                title: "Gagal!",
                text: error.response?.data?.message,
                type: "error",
            });
        }
    }

    const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const setters: Record<string, React.Dispatch<React.SetStateAction<any>>> = {
            email: setEmail,
            password: setPassword,
            role: setRole,
            jabatan: setJabatan,
            fullname: setFullname,
            nik: setNik,
            isActive: setIsActive,
            nip: setNip,
            address: setAddress,
            phoneNumber: setPhoneNumber,
            skNumber: setSkNumber,
            profilePhoto: setProfilePhoto
        };

        const setState = setters[name];
        if (setState) setState(value);
    };

    const handleFileChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files?.[0]) return;

        if (name === "sk_file") setSkFile(files[0]);
        if (name === "ktp_file") setKtpFile(files[0]);
        if (name === "profilePhoto") setProfilePhoto(files[0]);
    };

    const handleShowUser = (data: UserProps) => {
        setEmail(data?.email ?? '');
        setPassword('');
        setRole(data?.role ?? '');
        setJabatan(data?.jabatan ?? '');
        setIsActive(data?.is_active ?? '')
        setFullname(data?.fullname ?? '');
        setNik(data?.nik ?? '');
        setNip(data?.nip ?? '');
        setAddress(data?.address ?? '');
        setPhoneNumber(data?.phone_number ?? '');
        setSkNumber(data?.sk_number ?? '');
        setKtpFile(data?.ktp_file as any);
        setSkFile(data?.sk_file as any);
        setProfilePhoto(data?.profile_photo as any);
    };

    return {
        email,
        password,
        role,
        fullname,
        nik,
        nip,
        jabatan,
        address,
        phoneNumber,
        skNumber,
        skFile,
        ktpFile,
        profilePhoto,
        handleUserPost,
        handleChangeUser,
        handleFileChangeUser,
        listUser,
        handleShowUser,
        handleUserPut,
        isActive,
        setIsActive,
        handleUserRegister,
        handleUserUpdateProfile,
        handleVerificationUserPut
    };
}
