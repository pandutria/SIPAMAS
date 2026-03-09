/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import BackButton from '../../../ui/BackButton';
import ShowTableForm from '../../../ui/ShowTableForm';
import FormInput from '../../../ui/FormInput';
import useRABHooks from '../../../hooks/RABHooks';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import FormSelect from '../../../ui/FormSelect';
import RabDetailTable from '../../../ui/RabDetailTable';
import { FormatDate } from '../../../utils/FormatDate';
import MapsShow from '../../../components/maps/MapsShow';

export default function AdminPPKRencanaAnggaranUpdateView() {
  const location = useLocation();
  const {
    handleChangeRAB,
    program,
    revisionCount,
    rabDataByid,
    setSelectedId
  } = useRABHooks();
  const { user, loading } = useAuth();
  const { id } = useParams();
  const [selectedRevision, setSelectedRevision] = useState<any>(null);

  useEffect(() => {
    const fetchIsPreview = () => {
      if (selectedRevision) {
        setSelectedId(selectedRevision);
      } else {
        setSelectedId(id);
      }
    }

    document.body.style.overflow = 'auto';
    fetchIsPreview();
  }, [id, location, selectedRevision, setSelectedId, revisionCount, rabDataByid]);

  if (loading || !rabDataByid) {
    return <LoadingSpinner />
  }

  if (!user || user.role != "admin-ppk") {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-7xl mx-auto">
          <BackButton type='custom' link='/admin-ppk/rencana-anggaran' />
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
              Lihat Rencana Anggaran Biaya
            </h1>

            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                <ShowTableForm
                  disabled={true}
                  tenderCode={`TND-0${rabDataByid.identitas_proyek_id}`}
                  onClick={() => false}
                />

                <FormInput
                  title='Nama Proyek'
                  placeholder='Masukkan nama proyek (otomatis)'
                  value={rabDataByid?.proyek.nama}
                  disabled={true}
                />

                <FormInput
                  title='Tahun Anggaran'
                  placeholder='Masukkan tahun anggaran (otomatis)'
                  value={rabDataByid?.proyek.tahun_anggaran}
                  disabled={true}
                />

                <FormInput
                  title='Kategori Proyek'
                  placeholder='Masukkan kategori proyek (otomatis)'
                  value={rabDataByid?.proyek.kategori}
                  disabled={true}
                />

                <FormInput
                  title='Kontraktor Pelaksana'
                  placeholder='Masukkan kontrator pelaksana (otomatis)'
                  value={rabDataByid?.proyek.kontraktor_pelaksana}
                  disabled={true}
                />

                <FormInput
                  title='Konsultas Pengawas'
                  placeholder='Masukkan konsultas pengawas (otomatis)'
                  value={rabDataByid?.proyek.konsultas_pengawas}
                  disabled={true}
                />
              </div>

              {(rabDataByid.proyek?.locations?.length || 0) > 0 && (
                <MapsShow data={rabDataByid.proyek.locations} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                <FormInput
                  title='Nilai Kontrak'
                  placeholder='Masukkan nilai kontrak (otomatis)'
                  value={rabDataByid?.proyek.nilai_kontrak}
                  disabled={true}
                />

                <FormInput
                  title='Sumber Dana'
                  placeholder='Masukkan nilai kontrak (otomatis)'
                  value={rabDataByid?.proyek.nilai_kontrak}
                  disabled={true}
                />

                <FormInput
                  title='Kontraktor Pelaksana'
                  placeholder='Masukkan kontraktor pelaksana (otomatis)'
                  value={rabDataByid?.proyek.kontraktor_pelaksana}
                  disabled={true}
                />

                <FormInput
                  title='Konsultas Pengawas'
                  placeholder='Masukkan konsultas pengawas (otomatis)'
                  value={rabDataByid?.proyek.konsultas_pengawas}
                  disabled={true}
                />

                <FormInput
                  title='Program'
                  placeholder='Masukkan program'
                  value={program}
                  onChange={handleChangeRAB}
                  disabled={true}
                  name='program'
                  type='textarea'
                />

                <FormInput
                  title='Alasan'
                  placeholder='Alasan'
                  value={rabDataByid?.alasan_text ?? ""}
                  disabled={true}
                  type='textarea'
                />
              </div>

              <FormSelect required={false} value={selectedRevision ?? id} onChange={(e) => setSelectedRevision(e.target.value)} title="Revisi">
                {revisionCount.map((item, index) => (
                  <option key={index} value={item?.rab_id}>{item?.alasan_count} - Diubah pada {FormatDate(item.created_at)}</option>
                ))}
              </FormSelect>
            </div>
          </div>

          <RabDetailTable
            dataFile={rabDataByid?.details as any}
            handleDeleteRow={null as any}
            showDelete={false}
          />
        </div>
      </div>
    </div>
  );
}