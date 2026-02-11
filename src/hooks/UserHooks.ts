/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { SwalMessage } from "../utils/SwalMessage";
import API from "../server/API";
import { SortDescById } from "../utils/SortDescById";
import SwalLoading from "../utils/SwalLoading";

export default function useUserHooks() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [fullname, setFullname] = useState('');
    const [nik, setNik] = useState('');
    const [nip, setNip] = useState('');
    const [pokjaGroupId, setPokjaGroupId] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [opdOrganization, setOpdOrganization] = useState('');
    const [group, setGroup] = useState('');
    const [skNumber, setSkNumber] = useState('');
    const [pbjNumber, setPbjNumber] = useState('');
    const [competenceNumber, setCompotenceNumber] = useState('');
    const [skFile, setSkFile] = useState<File | null>(null);
    const [pbjFile, setPbjFile] = useState<File | null>(null);
    const [competenceFile, setCompotenceFile] = useState<File | null>(null);
    const [filePhoto, setFilePhoto] = useState<File | null>(null);
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
                    role: item.role?.name || '-',
                    status: item.is_active ? "Aktif" : "Tidak Aktif"
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
            if (
                !email ||
                !password ||
                !fullname ||
                !nik ||
                !nip ||
                !address ||
                !phoneNumber ||
                !opdOrganization ||
                !group ||
                !skNumber ||
                !pbjNumber ||
                !competenceNumber ||
                !skFile ||
                !pbjFile ||
                !competenceFile
            ) {
                SwalMessage({
                    title: "Gagal!",
                    text: "Semua field wajib diisi!",
                    type: "error"
                });
                return;
            }

            if (Number(roleId) == 3) {
                if (!pokjaGroupId) {
                    SwalMessage({
                        title: "Gagal!",
                        text: "Kelompok Kerja wajib diisi!",
                        type: "error"
                    });

                    return;
                }
            }

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
            formData.append("password", password);
            formData.append("role_id", roleId);
            formData.append("is_active", "true");
            formData.append("fullname", fullname);
            formData.append("nik", nik);
            formData.append("nip", nip);
            if (pokjaGroupId) formData.append("pokja_group_id", pokjaGroupId);
            formData.append("address", address);
            formData.append("phone_number", phoneNumber);
            formData.append("opd_organization", opdOrganization);
            formData.append("group", group);
            formData.append("sk_number", skNumber);
            formData.append("pbj_number", pbjNumber);
            formData.append("competence_number", competenceNumber);
            formData.append("sk_file", skFile);
            formData.append("pbj_file", pbjFile);
            formData.append("competence_file", competenceFile);
            if (filePhoto) formData.append("file_photo", filePhoto);

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
            formData.append("role_id", roleId);
            formData.append("is_active", `${isActive}`);
            if (fullname) formData.append("fullname", fullname);
            if (password) formData.append("password", password);
            if (nik) formData.append("nik", nik);
            if (nip) formData.append("nip", nip);
            if (pokjaGroupId) formData.append("pokja_group_id", pokjaGroupId);
            if (address) formData.append("address", address);
            if (phoneNumber) formData.append("phone_number", phoneNumber);
            if (opdOrganization) formData.append("opd_organization", opdOrganization);
            if (group) formData.append("group", group);
            if (skNumber) formData.append("sk_number", skNumber);
            if (pbjNumber) formData.append("pbj_number", pbjNumber);
            if (competenceNumber) formData.append("competence_number", competenceNumber);
            if (skFile) formData.append("sk_file", skFile);
            if (pbjFile) formData.append("pbj_file", pbjFile);
            if (competenceFile) formData.append("competence_file", competenceFile);
            if (filePhoto) formData.append("file_photo", filePhoto);

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

    const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const setters: Record<string, React.Dispatch<React.SetStateAction<any>>> = {
            email: setEmail,
            password: setPassword,
            roleId: setRoleId,
            fullname: setFullname,
            nik: setNik,
            nip: setNip,
            pokjaGroupId: setPokjaGroupId,
            address: setAddress,
            phoneNumber: setPhoneNumber,
            opdOrganization: setOpdOrganization,
            group: setGroup,
            skNumber: setSkNumber,
            pbjNumber: setPbjNumber,
            competenceNumber: setCompotenceNumber,
        };

        const setState = setters[name];
        if (setState) setState(value);
    };

    const handleFileChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files?.[0]) return;

        if (name === "sk_file") setSkFile(files[0]);
        if (name === "pbj_file") setPbjFile(files[0]);
        if (name === "competence_file") setCompotenceFile(files[0]);
        if (name === "photo_file") setFilePhoto(files[0]);
    };

    const handleShowUser = (data: UserProps) => {
        setEmail(data?.email ?? '');
        setPassword('');
        setRoleId(data?.role_id?.toString() ?? '');
        setIsActive(data?.is_active?.toString() ?? '')
        setFullname(data?.fullname ?? '');
        setNik(data?.nik ?? '');
        setNip(data?.nip ?? '');
        setPokjaGroupId(data?.pokja_group_id?.toString() ?? '');
        setAddress(data?.address ?? '');
        setPhoneNumber(data?.phone_number ?? '');
        setOpdOrganization(data?.opd_organization ?? '');
        setGroup(data?.group ?? '');
        setSkNumber(data?.sk_number ?? '');
        setPbjNumber(data?.pbj_number ?? '');
        setCompotenceNumber(data?.competence_number ?? '');

        setSkFile(data?.sk_file as any);
        setPbjFile(data?.pbj_file as any);
        setCompotenceFile(data?.competence_file as any);
        setFilePhoto(data?.file_photo as any);
    };

    return {
        email,
        password,
        roleId,
        fullname,
        nik,
        nip,
        pokjaGroupId,
        address,
        phoneNumber,
        opdOrganization,
        group,
        skNumber,
        pbjNumber,
        competenceNumber,
        skFile,
        pbjFile,
        competenceFile,
        filePhoto,
        handleUserPost,
        handleChangeUser,
        handleFileChangeUser,
        listUser,
        handleShowUser,
        handleUserPut,
        isActive,
        setIsActive
    };

}
