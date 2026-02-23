/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import useUserHooks from '../../../hooks/UserHooks';
import FormSelect from '../../../ui/FormSelect';
import { useEffect, useState } from 'react';
import FormInput from '../../../ui/FormInput';
import FormUploadFile from '../../../ui/FormUploadFile';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';

interface UbahUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  data: UserProps
}

export default function SuperAdminLihatUserModal({ isOpen, onClose, data }: UbahUserModalProps) {
  const {
    email,
    role,
    fullname,
    nik,
    nip,
    address,
    phoneNumber,
    skNumber,
    jabatan,
    skFile,
    profilePhoto,
    handleChangeUser,
    handleFileChangeUser,
    handleShowUser
  } = useUserHooks();

  const { loading } = useAuth();
  const [isInit, setIsInit] = useState(false);

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
    {
      id: 4,
      name: "Masyarakat",
      value: "masyarakat"
    },
  ];

  useEffect(() => {
    const fetchData = () => {
      if (data && !isInit) {
        handleShowUser(data);
        setIsInit(true);
      }
    }

    fetchData();
  }, [data, handleShowUser, isInit]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isOpen) {
    if (isInit) {
      handleShowUser(null as any);
      setIsInit(false);
    }
    return;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-poppins-bold text-xl text-gray-800">
            Lihat Pengguna
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8">
          <div>
            <h3 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
              1. Pendaftaran Akun
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect title="Role" name="role" value={role} onChange={handleChangeUser} disabled={true}>
                {roleOptions.map((item, index) => (
                  <option key={index} value={item.value}>{item.name}</option>
                ))}
              </FormSelect>

              <FormInput title="Email" name="email" value={email} onChange={handleChangeUser} placeholder="Masukkan email" disabled={true} />
            </div>
          </div>

          <div>
            <h3 className="font-poppins-semibold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-primary/20">
              2. Pendaftaran Pengguna
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput title="Nama lengkap" name="fullname" value={fullname} onChange={handleChangeUser} placeholder="Masukkan nama lengkap" disabled={true} />
              <FormInput title="Alamat" name="address" value={address} onChange={handleChangeUser} placeholder="Masukkan alamat" disabled={true} />
              <FormInput title="Telepon/HP" name="phoneNumber" value={phoneNumber} onChange={handleChangeUser} placeholder="Masukkan telepon" disabled={true} />

              <FormInput title="NIK" name="nik" value={nik} onChange={handleChangeUser} placeholder="Masukkan NIK" disabled={true} />
              <FormInput title="NIP" name="nip" value={nip} onChange={handleChangeUser} placeholder="Masukkan NIP" disabled={true} />
              <FormInput title="Jabatan" name="jabatan" value={jabatan} onChange={handleChangeUser} placeholder="Masukkan Jabatan" disabled={true} />
              <FormInput title="No. SK" name="skNumber" value={skNumber} onChange={handleChangeUser} placeholder="Masukkan No. SK" disabled={true} />

              <FormUploadFile type='show' title="Lihat SK" name="sk_file" value={skFile as any} onChange={handleFileChangeUser} disabled={true} />
              <FormUploadFile type='show' title="Lihat Foto Pengguna" name="profilePhoto" value={profilePhoto as any} onChange={handleFileChangeUser} disabled={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
