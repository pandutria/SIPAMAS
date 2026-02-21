/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { SwalMessage } from '../utils/SwalMessage';
import API from '../server/API';
import SwalLoading from '../utils/SwalLoading';

export default function useAuthHooks() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [captchaInput, setCaptchaInput] = useState<any>('');
    const [captchaCode, setCaptchaCode] = useState<any>('');

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let captcha = '';
        for (let i = 0; i < 5; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return captcha;
    };

    const refreshCaptcha = (): void => {
        setCaptchaCode(generateCaptcha());
        setCaptchaInput('');
    };

    useEffect(() => {
        setCaptchaCode(generateCaptcha());
    }, []);

    const handleLogin = async () => {
        if (captchaInput !== captchaCode) {
            SwalMessage({
                title: "Gagal!",
                text: "Kode Capctha Salah!",
                type: "error"
            })
            refreshCaptcha();
            return;
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

        try {
            SwalLoading();
            const response = await API.post('/auth/login', {
                email,
                password
            });

            const token = response.data.token;
            const message = response.data.message;

            localStorage.setItem("token", token);
            SwalMessage({
                title: "Berhasil!",
                text: message,
                type: 'success'
            })

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                title: "Gagal",
                text: error.response.data.message,
                type: 'error'
            })
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        SwalMessage({
            type: 'success',
            title: "Berhasil!",
            text: "Keluar Berhasil!"
        });

        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email") return setEmail(value);
        if (name === "password") return setPassword(value);
    }

    const handleChangePassword = async (email: string) => {
        try {
            if (!email) {
                SwalMessage({
                    type: "error",
                    title: "Gagal!",
                    text: "Tidak Valid!"
                });

                window.location.href = "/masuk";
                return;
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

            const response = await API.put('/auth/password/update', {
                email,
                password
            });

            SwalMessage({
                type: "success",
                title: "Berhasil!",
                text: response.data.message
            });

            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        } catch (error: any) {
            SwalMessage({
                type: "error",
                title: "Gagal!",
                text: error.response.data.message
            })
        }
    }

    return {
        email,
        password,
        handleChange,
        handleLogin,
        captchaCode,
        refreshCaptcha,
        captchaInput,
        setCaptchaInput,
        handleLogout,
        handleChangePassword
    }
}
