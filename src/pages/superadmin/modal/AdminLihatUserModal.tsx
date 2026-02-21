/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import useUserHooks from '../../../hooks/UserHooks';
import useRoleHooks from '../../../hooks/RoleHooks';
import FormSelect from '../../../ui/FormSelect';
import { useEffect, useState } from 'react';
import usePokjaGroupHooks from '../../../hooks/PokjaGroupHooks';
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

export default function AdminLihatUserModal({ isOpen, onClose, data }: UbahUserModalProps) {
  const {
    email,
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
    handleChangeUser,
    handleFileChangeUser,
    handleShowUser
  } = useUserHooks();

  const { role } = useRoleHooks();
  const { loading } = useAuth();
  const { pokjaGroup } = usePokjaGroupHooks();
  const [showGroupPokja, setShowGroupPokja] = useState(false);
  const [isInit, setIsInit] = useState(false);

  const opdOrganisasiOptions = [
    { id: '1', name: 'Dinas Pekerjaan Umum' },
    { id: '2', name: 'Dinas Perhubungan' },
    { id: '3', name: 'Dinas Kesehatan' }
  ];

  useEffect(() => {
    const fetchData = () => {
      setShowGroupPokja(roleId === '3');
      if (data && !isInit) {
        handleShowUser(data);
        setIsInit(true);
      }
    }

    fetchData();
  }, [roleId, data, handleShowUser, isInit]);

  if (loading || !role || !pokjaGroup) {
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
              <FormSelect title="Role" name="roleId" value={roleId} onChange={handleChangeUser} disabled={true}>
                {role.map((item, index) => (
                  <option key={index} value={item.id}>{item.name}</option>
                ))}
              </FormSelect>

              {showGroupPokja && (
                <FormSelect title="Kelompok Pokja" name="pokjaGroupId" value={pokjaGroupId} onChange={handleChangeUser} disabled={true}>
                  {pokjaGroup.map((item, index) => (
                    <option key={index} value={item.id}>{item.name}</option>
                  ))}
                </FormSelect>
              )}

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

              <FormSelect title="OPD Organisasi" name="opdOrganization" value={opdOrganization} onChange={handleChangeUser} disabled={true}>
                {opdOrganisasiOptions.map((item, index) => (
                  <option key={index} value={item.name}>{item.name}</option>
                ))}
              </FormSelect>

              <FormInput title="Pangkat Golongan" name="group" value={group} onChange={handleChangeUser} placeholder="Masukkan Pangkat Golongan" disabled={true} />
              <FormInput title="NIK" name="nik" value={nik} onChange={handleChangeUser} placeholder="Masukkan NIK" disabled={true} />
              <FormInput title="NIP" name="nip" value={nip} onChange={handleChangeUser} placeholder="Masukkan NIP" disabled={true} />
              <FormInput title="No. SK" name="skNumber" value={skNumber} onChange={handleChangeUser} placeholder="Masukkan No. SK" disabled={true} />

              <FormUploadFile type='show' title="Lihat SK" name="sk_file" value={skFile as any} onChange={handleFileChangeUser} disabled={true} />

              <FormInput title="No. PBJ Sertifikat" name="pbj_number" value={pbjNumber} onChange={handleChangeUser} placeholder="Masukkan No. PBJ Sertifikat" disabled={true} />

              <FormUploadFile type='show' title="Lihat PBJ Sertifikat" name="pbj_file" value={pbjFile as any} onChange={handleFileChangeUser} disabled={true} />

              <FormInput title="No. Kompetensi Sertifikat" name="competenceNumber" value={competenceNumber} onChange={handleChangeUser} placeholder="Masukkan No. Kompetensi sertifikat" disabled={true} />

              <FormUploadFile type='show' title="Lihat Kompetensi Sertifikat" name="competence_file" value={competenceFile as any} onChange={handleFileChangeUser} disabled={true} />
              <FormUploadFile type='show' title="Lihat Foto Pengguna" name="filePhoto" value={filePhoto as any} onChange={handleFileChangeUser} disabled={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
