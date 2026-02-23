import React, { useState } from 'react'
import { ArrowLeft, Upload, RefreshCw } from 'lucide-react'
import useUserHooks from '../../hooks/UserHooks'
import logo from "/image/logo/logo-sipamas.png"
import background from "/image/auth/background.jpg"
import { useNavigate } from 'react-router-dom'
import FormInput from '../../ui/FormInput'
import FormUploadFile from '../../ui/FormUploadFile'
import SubmitButton from '../../ui/SubmitButton'
import { SwalMessage } from '../../utils/SwalMessage'

export default function Register() {
    const {
        email,
        password,
        fullname,
        nik,
        nip,
        address,
        jabatan,
        phoneNumber,
        skNumber,
        skFile,
        handleChangeUser,
        handleFileChangeUser,
        handleUserPost,
    } = useUserHooks()

    const navigate = useNavigate()
    const [captchaCode, setCaptchaCode] = useState(generateCaptcha())
    const [captchaInput, setCaptchaInput] = useState('')
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)

    function generateCaptcha() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
        return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    }

    function refreshCaptcha() {
        setCaptchaCode(generateCaptcha())
        setCaptchaInput('')
    }

    function handleProfilePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleFileChangeUser(e)
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setProfilePhotoPreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    function handleSubmit() {
        if (captchaInput !== captchaCode) {
            SwalMessage({
                type: "error",
                title: "Gagal!",
                text: "Kode captcha salah, silahkan coba lagi!"
            });

            refreshCaptcha()
            return
        }
        handleUserPost()
    }

    return (
        <div
            className="min-h-screen font-poppins-medium flex items-center justify-center p-4"
            style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div
                className="rounded-2xl p-8 w-full max-w-2xl my-8"
                data-aos="fade-up"
                data-aos-duration="1000"
                style={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)'
                }}
            >
                <div className="text-center mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <ArrowLeft
                            className="w-6 h-6 cursor-pointer hover:scale-90 transition-all"
                            onClick={() => navigate('/')}
                        />
                        <img src={logo} className="w-auto h-4 mx-auto" />
                        <div className="w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Buat Akun Baru</h1>
                    <p className="text-gray-600 text-sm">Daftarkan diri Anda sebagai masyarakat</p>
                </div>

                <div className="flex flex-col items-center mb-6">
                    <div
                        className="w-24 h-24 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors duration-200 bg-gray-50"
                        onClick={() => document.getElementById('profilePhoto')?.click()}
                    >
                        {profilePhotoPreview ? (
                            <img src={profilePhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <Upload className="w-6 h-6 mb-1" />
                                <span className="text-[10px] text-center px-1">Foto Profil</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        id="profilePhoto"
                        name="profilePhoto"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePhotoChange}
                    />
                    <p className="text-xs text-gray-500 mt-2">Klik untuk unggah foto profil *</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <FormInput
                            title="Nama Lengkap"
                            name="fullname"
                            value={fullname}
                            onChange={handleChangeUser}
                            placeholder="Masukkan nama lengkap"
                        />
                    </div>

                    <div className="hidden">
                        <FormInput
                            title="Role"
                            name="role"
                            value={"masyarakat"}
                            onChange={handleChangeUser}
                            placeholder="Role"
                        />
                    </div>

                    <FormInput
                        title="NIK"
                        name="nik"
                        type='number'
                        value={nik}
                        onChange={handleChangeUser}
                        placeholder="16 digit NIK"
                    />

                    <FormInput
                        title="NIP"
                        name="nip"
                        type='number'
                        value={nip}
                        onChange={handleChangeUser}
                        placeholder="Masukkan NIP"
                    />

                    <FormInput
                        title="Jabatan"
                        name="jabatan"
                        value={jabatan}
                        onChange={handleChangeUser}
                        placeholder="Masukkan jabatan"
                    />

                    <FormInput
                        title="Nomor Telepon"
                        name="phoneNumber"
                        type='number'
                        value={phoneNumber}
                        onChange={handleChangeUser}
                        placeholder="Contoh: 08123456789"
                    />

                    <FormInput
                        title="Nomor SK"
                        name="skNumber"
                        value={skNumber}
                        onChange={handleChangeUser}
                        placeholder="Masukkan nomor SK"
                    />

                    <FormUploadFile 
                        title="Unggah SK" 
                        name="sk_file" 
                        value={skFile} 
                        onChange={handleFileChangeUser} 
                    />

                    <div className="md:col-span-2">
                        <FormInput
                            title="Alamat"
                            name="address"
                            value={address}
                            onChange={handleChangeUser}
                            placeholder="Masukkan alamat lengkap"
                            type='textarea'
                        />
                    </div>

                    <FormInput
                        title="Alamat Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={handleChangeUser}
                        placeholder="contoh@email.com"
                    />

                    <FormInput
                        title="Kata Sandi"
                        name="password"
                        type="password"
                        value={password}
                        onChange={handleChangeUser}
                        placeholder="Masukkan Kata Sandi"
                    />

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Kode Verifikasi (CAPTCHA) *</label>
                        <div className="flex gap-3 items-center">
                            <div
                                className="flex-1 rounded-lg flex items-center justify-center select-none font-semibold text-2xl tracking-widest text-gray-600 italic"
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    border: '2px dashed #ddd',
                                    minHeight: '56px'
                                }}
                            >
                                {captchaCode}
                            </div>
                            <button
                                type="button"
                                onClick={refreshCaptcha}
                                className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg transition-colors duration-200"
                                title="Muat ulang captcha"
                            >
                                <RefreshCw className="h-5 w-5 text-gray-700" />
                            </button>
                            <input
                                type="text"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                                className="flex-1 font-poppins-regular lg:text-[16px] text-[12px] px-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-third focus:ring-2 focus:ring-hover"
                                placeholder="Masukkan kode"
                                maxLength={5}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleSubmit()
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <SubmitButton
                        width='full'
                        text='Daftar Sekarang'
                        onClick={() => handleSubmit()}
                    />
                    <p className="text-center text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/masuk')}
                            className="font-semibold text-primary hover:underline"
                        >
                            Masuk di sini
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}