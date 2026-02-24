/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import useUserHooks from '../../../hooks/UserHooks';
import FormSelect from '../../../ui/FormSelect';
import FormInput from '../../../ui/FormInput';
import FormUploadFile from '../../../ui/FormUploadFile';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import SubmitButton from '../../../ui/SubmitButton';

interface TambahUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export default function SuperAdminTambahUserModal({ isOpen, onClose }: TambahUserModalProps) {
  const {
    email,
    password,
    role,
    fullname,
    nik,
    nip,
    address,
    jabatan,
    phoneNumber,
    skNumber,
    skFile,
    profilePhoto,
    handleChangeUser,
    handleFileChangeUser,
    handleUserPost,
  } = useUserHooks();

  const { loading } = useAuth();
  const roleOptions = [
    {
      id: 1,
      name: "Super Admin",
      value: "super-admin"
    },
    {
      id: 2,
      name: "Admin Direksi",
      value: "admin-direksi"
    },
    {
      id: 3,
      name: "Admin PPK",
      value: "admin-ppk"
    },
    // {
    //   id: 4,
    //   name: "Masyarakat",
    //   value: "masyarakat"
    // },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10000 overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-poppins-bold text-xl text-gray-800">
            Tambah Pengguna
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 font-poppins-medium">
          <div>
            <h3 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
              1. Pendaftaran Akun
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect title="Role" name="role" value={role} onChange={handleChangeUser}>
                {roleOptions.map((item, index) => (
                  <option key={index} value={item.value}>{item.name}</option>
                ))}
              </FormSelect>

              <FormInput type='email' title="Email" name="email" value={email} onChange={handleChangeUser} placeholder="Masukkan email" />
              <FormInput type='password' title="Kata Sandi" name="password" value={password} onChange={handleChangeUser} placeholder="Masukkan kata sandi" />
            </div>
          </div>

          <div>
            <h3 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
              2. Pendaftaran Pengguna
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput title="Nama lengkap" name="fullname" value={fullname} onChange={handleChangeUser} placeholder="Masukkan nama lengkap" />
              <FormInput title="Alamat" name="address" value={address} onChange={handleChangeUser} placeholder="Masukkan alamat" />
              <FormInput type='number' title="Telepon/HP" name="phoneNumber" value={phoneNumber} onChange={handleChangeUser} placeholder="Masukkan telepon" />

              <FormInput type='number' title="NIK" name="nik" value={nik} onChange={handleChangeUser} placeholder="Masukkan NIK" />
              <FormInput type='number' title="NIP" name="nip" value={nip} onChange={handleChangeUser} placeholder="Masukkan NIP" />
              <FormInput title="Jabatan" name="jabatan" value={jabatan} onChange={handleChangeUser} placeholder="Masukkan Jabtan" />
              <FormInput title="No. SK" name="skNumber" value={skNumber} onChange={handleChangeUser} placeholder="Masukkan No. SK" />
              <FormUploadFile title="Unggah SK" name="sk_file" value={skFile as any} onChange={handleFileChangeUser} />

              <FormUploadFile title="Unggah Foto Pengguna" name="profilePhoto" value={profilePhoto} onChange={handleFileChangeUser} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">          
          <SubmitButton text='Simpan' onClick={() => handleUserPost()}/>
        </div>
      </div>
    </div>
  );
}
