/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Navbar from '../../../../components/Navbar';
import BackButton from '../../../../ui/BackButton';
import ShowTableForm from '../../../../ui/ShowTableForm';
import FormInput from '../../../../ui/FormInput';
import useRABHooks from '../../../../hooks/RABHooks';
import { useAuth } from '../../../../context/AuthContext';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import { Navigate, useParams } from 'react-router-dom';
import RabDetailTable from '../../../../ui/RabDetailTable';
import FormSelect from '../../../../ui/FormSelect';

export default function KepalaRencanaAnggaranView() {
  const {
    handleChangeRAB,
  } = useRABHooks();
  const { user, loading } = useAuth();
  const [selectedRevision, setSelectedRevision] = useState<any>(null);
  const { setSelectedId, rabDataByid, revisionCount } = useRABHooks();
  const { id } = useParams();

  useEffect(() => {
    const fetchIsPreview = () => {
      if (selectedRevision) {
        setSelectedId(selectedRevision);
      } else {
        setSelectedId(id);
      }
    }

    fetchIsPreview();
  }, [id, setSelectedId, selectedRevision]);

  if (loading || !rabDataByid) {
    return <LoadingSpinner />
  }

  if (!user || (user.role.name != "kepala biro" && user.role.name != "kepala bagian")) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
              Lihat Rencana Anggaran Biaya
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
              <ShowTableForm disabled={true} tenderCode={rabDataByid?.data_entry.kode_paket?.toString()} />

              <FormInput
                title='Tahun Anggaran'
                placeholder='Masukkan tahun anggaran (otomatis)'
                value={rabDataByid?.data_entry?.tahun_anggaran?.toString()}
                disabled={true}
              />

              <FormInput
                title='Satuan Kerja'
                placeholder='Masukkan tahun satuan kerja (otomatis)'
                value={rabDataByid?.data_entry?.satuan_kerja?.toString()}
                disabled={true}
              />

              <FormInput
                title='Kode RUP'
                placeholder='Masukkan tahun kode RUP (otomatis)'
                value={rabDataByid?.data_entry?.kode_rup?.toString()}
                disabled={true}
              />

              <FormInput
                title='Lokasi Pekerjaan'
                placeholder='Lokasi pekerjaan (otomatis)'
                value={rabDataByid?.data_entry?.lokasi_pekerjaan?.toString()}
                disabled={true}
                type='textarea'
              />

              <FormInput
                title='Program Kegiatan'
                placeholder='Masukkan program kegiatan'
                value={rabDataByid?.program}
                name='program'
                onChange={handleChangeRAB}
                disabled={true}
              />

              <FormInput
                title='Kegiatan'
                placeholder='Masukkan kegiatan'
                value={rabDataByid?.data_entry?.nama_paket?.toString()}
                name='activity'
                onChange={handleChangeRAB}
                disabled={true}
              />

              <FormInput
                title='Alasan'
                placeholder='Alasan'
                value={rabDataByid?.alasan_text ? rabDataByid?.alasan_text : ""}
                disabled={true}
                type='textarea'
              />

              <FormSelect value={selectedRevision} onChange={(e) => setSelectedRevision(e.target.value)} title={`Revisi ke - ${revisionCount[revisionCount.length - 1]?.alasan_count}`}>
                {revisionCount.map((item, index) => (
                  <option key={index} value={item.rab_id}>{item?.alasan_count}</option>
                ))}
              </FormSelect>
            </div>
          </div>

          <RabDetailTable
            dataFile={rabDataByid?.rab_details as any}
            handleDeleteRow={null as any}
            showDelete={false}
          />
        </div>
      </div>
    </div>
  );
}