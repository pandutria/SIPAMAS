/* eslint-disable @typescript-eslint/no-explicit-any */
import { Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useUserHooks from '../hooks/UserHooks';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner';
import { BASE_URL_FILE } from '../server/API';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
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
    handleChangeUser,
    handleFileChangeUser,
    handleShowUser,
    handleUserPut,
  } = useUserHooks();
  const opdOrganisasiOptions = [
    { id: '1', name: 'Dinas Pekerjaan Umum' },
    { id: '2', name: 'Dinas Perhubungan' },
    { id: '3', name: 'Dinas Kesehatan' }
  ];

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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-8 pb-12">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <BackButton/>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 hover:shadow-md transition-shadow duration-300" data-aos="fade-up" data-aos-duration="1000">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
              <div className={`w-40 h-40 rounded-full ${user.file_photo ? 'border-white' : 'bg-linear-to-br from-hover to-hover border-hover'} flex items-center justify-center overflow-hidden border-4 shadow-lg`}>
                {user.file_photo ? (
                  <img src={`${BASE_URL_FILE}/${user.file_photo}`} alt="Profile" className="w-full h-full object-cover" />
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
                  name="photo_file"
                  onChange={handleFileChangeUser}
                />
                <label
                  htmlFor="profile-photo-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-third bg-hover rounded-xl font-poppins-medium text-secondary hover:bg-hover transition-all duration-200 cursor-pointer hover:border-third"
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
              {filePhoto && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-sm font-poppins-medium text-emerald-800">
                    ✓ File dipilih: <span className="font-poppins-semibold">{filePhoto.name}</span>
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
            {user.pokja_group_id && (
                <FormInput title="Kelompok Kerja" value={user?.pokja_group?.name} placeholder="Kelompok Kerja" disabled />
            )}
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

            <FormSelect title="OPD Organisasi" name="opdOrganization" value={opdOrganization} onChange={handleChangeUser}>
              {opdOrganisasiOptions.map((item, index) => (
                <option key={index} value={item.name}>{item.name}</option>
              ))}
            </FormSelect>

            <FormInput title="Pangkat Golongan" name="group" value={group} onChange={handleChangeUser} placeholder="Masukkan Pangkat Golongan" />
            <FormInput type='number' title="NIK" name="nik" value={nik} onChange={handleChangeUser} placeholder="Masukkan NIK" />
            <FormInput type='number' title="NIP" name="nip" value={nip} onChange={handleChangeUser} placeholder="Masukkan NIP" />
            <FormInput title="No. SK" name="skNumber" value={skNumber} onChange={handleChangeUser} placeholder="Masukkan No. SK" />

            <FormUploadFile title="Unggah SK" name="sk_file" value={skFile as any} onChange={handleFileChangeUser} />
            <FormInput title="No. PBJ Sertifikat" name="pbjNumber" value={pbjNumber} onChange={handleChangeUser} placeholder="Masukkan No. PBJ Sertifikat" />
            <FormUploadFile title="Unggah PBJ Sertifikat" name="pbj_file" value={pbjFile as any} onChange={handleFileChangeUser} />
            <FormInput title="No. Kompetensi Sertifikat" name="competenceNumber" value={competenceNumber} onChange={handleChangeUser} placeholder="Masukkan No. Kompetensi sertifikat" />
            <FormUploadFile title="Unggah Kompetensi Sertifikat" name="competence_file" value={competenceFile as any} onChange={handleFileChangeUser} />
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-gray-100">            
            <SubmitButton text='Simpan Perubahan' onClick={() => handleUserPut(user.id)}/>
          </div>
        </div>
      </div>
    </div >
  );
}