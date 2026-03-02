/* eslint-disable @typescript-eslint/no-explicit-any */
import { Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useUserHooks from '../hooks/UserHooks';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner';
import { BASE_URL_FILE } from '../server/API';
import FormInput from '../ui/FormInput';
import FormUploadFile from '../ui/FormUploadFile';
import { useEffect, useState } from 'react';
import SubmitButton from '../ui/SubmitButton';
import BackButton from '../ui/BackButton';

export default function EditProfile() {
  const { user, loading } = useAuth();
  const [isInit, setIsInit] = useState(true);
  const {
    email,
    fullname,
    nik,
    nip,
    address,
    ktpFile,
    phoneNumber,
    jabatan,
    skNumber,
    skFile,
    profilePhoto,
    handleChangeUser,
    handleFileChangeUser,
    handleShowUser,
    handleUserUpdateProfile,
  } = useUserHooks();

  useEffect(() => {
    const fetchUser = async () => {
      if (isInit && user) {
        await handleShowUser(user as any);
        setIsInit(false);
      }
    }

    fetchUser();
  }, [handleShowUser, user, isInit]);

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-8 pb-12 font-poppins-medium">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <BackButton />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 hover:shadow-md transition-shadow duration-300" data-aos="fade-up" data-aos-duration="1000">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
              <div className={`w-40 h-40 rounded-full ${user.profile_photo ? 'border-white' : 'bg-hover/30 border-hover'} flex items-center justify-center overflow-hidden border-4 shadow-lg`}>
                {user.profile_photo ? (
                  <img src={`${BASE_URL_FILE}/${user.profile_photo}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-poppins-bold text-5xl text-third">
                    {user.fullname.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="w-full md:w-48">
                <input
                  type="file"
                  className="hidden"
                  id="profile-photo-upload"
                  accept=".jpg,.jpeg,.png"
                  name="profilePhoto"
                  onChange={handleFileChangeUser}
                />
                <label
                  htmlFor="profile-photo-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-third bg-hover/30 rounded-xl font-poppins-medium text-secondary hover:bg-hover transition-all duration-200 cursor-pointer hover:border-third"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-sm">Ubah Foto</span>
                </label>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="font-poppins-semibold text-2xl text-gray-900 mb-3">
                Foto Profil
              </h2>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Unggah foto profil baru Anda untuk memperbarui tampilan profil. Format yang didukung: JPG, JPEG, PNG. Ukuran maksimal: 5MB.
              </p>
              {profilePhoto && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-sm font-poppins-medium text-emerald-800">
                    ✓ File dipilih: <span className="font-poppins-semibold">{profilePhoto.name}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 hover:shadow-md transition-shadow duration-300" data-aos="fade-up" data-aos-duration="1000">
          <h3 className="font-poppins-semibold text-2xl text-gray-900 mb-6 pb-4 border-b-2 border-hover">
            Informasi Akun
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput type='email' title="Email" name="email" value={email} onChange={handleChangeUser} placeholder="Masukkan email" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300" data-aos="fade-up" data-aos-duration="1000">
          <h3 className="font-poppins-semibold text-2xl text-gray-900 mb-6 pb-4 border-b-2 border-hover">
            Informasi Pribadi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput title="Nama lengkap" name="fullname" value={fullname} onChange={handleChangeUser} placeholder="Masukkan nama lengkap" />
            <FormInput title="Alamat" name="address" value={address} onChange={handleChangeUser} placeholder="Masukkan alamat" />
            <FormInput type='number' title="Telepon/HP" name="phoneNumber" value={phoneNumber} onChange={handleChangeUser} placeholder="Masukkan telepon" />
            {user.role != "masyarakat" && (
              <FormInput title="Jabatan" name="jabatan" value={jabatan} onChange={handleChangeUser} placeholder="Masukkan jabatan" />
            )}

            <FormInput type='number' title="NIK" name="nik" value={nik} onChange={handleChangeUser} placeholder="Masukkan NIK" />

            {user.role != "masyarakat" && (
              <FormInput type='number' title="NIP" name="nip" value={nip} onChange={handleChangeUser} placeholder="Masukkan NIP" />
            )}

            {user.role != "masyarakat" && (
              <FormInput title="No. SK" name="skNumber" value={skNumber} onChange={handleChangeUser} placeholder="Masukkan No. SK" />
            )}

            {user.role == "masyarakat" && (
              <FormUploadFile title="Unggah KTP" name="ktp_file" value={ktpFile as any} onChange={handleFileChangeUser} />
            )}

            {user.role != "masyarakat" && (
              <FormUploadFile title="Unggah SK" name="sk_file" value={skFile as any} onChange={handleFileChangeUser} />
            )}
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-gray-100">
            <SubmitButton text='Simpan Perubahan' onClick={() => handleUserUpdateProfile()} />
          </div>
        </div>
      </div>
    </div >
  );
}