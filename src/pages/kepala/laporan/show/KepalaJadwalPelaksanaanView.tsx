/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Navbar from '../../../../components/Navbar';
import BackButton from '../../../../ui/BackButton';
import ShowTableForm from '../../../../ui/ShowTableForm';
import FormInput from '../../../../ui/FormInput';
import { useAuth } from '../../../../context/AuthContext';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import { Navigate, useParams } from 'react-router-dom';
import useScheduleHooks from '../../../../hooks/ScheduleHooks';
import WeekScheduleTable from '../../../../ui/WeekScheduleTable';
import FormSelect from '../../../../ui/FormSelect';

export default function KepalaJadwalPelaksanaanView() {
  const [selectedRevision, setSelectedRevision] = useState<any>(null);

  const {
    setSelectedId,
    scheduleDataById,
    revisionCount
  } = useScheduleHooks();

  const { user, loading } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    if (selectedRevision) {
      setSelectedId(selectedRevision);
    } else {
      setSelectedId(id);
    }
  }, [id, setSelectedId, selectedRevision]);

  if (loading || !scheduleDataById) {
    return <LoadingSpinner />
  }

  if (!user || (user.role.name != "kepala bagian" && user.role.name != "kepala biro")) {
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
              Lihat Jadwal Pelaksanaan
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
              <ShowTableForm disabled={true} tenderCode={scheduleDataById?.rab?.data_entry?.kode_paket?.toString()} />

              <FormInput
                title='Tahun Anggaran'
                placeholder='Masukkan tahun anggaran (otomatis)'
                value={scheduleDataById?.rab?.data_entry?.tahun_anggaran?.toString()}
                disabled={true}
              />

              <FormInput
                title='Satuan Kerja'
                placeholder='Masukkan tahun satuan kerja (otomatis)'
                value={scheduleDataById?.rab?.data_entry?.satuan_kerja?.toString()}
                disabled={true}
              />

              <FormInput
                title='Kode RUP'
                placeholder='Masukkan tahun kode RUP (otomatis)'
                value={scheduleDataById?.rab?.data_entry?.kode_rup?.toString()}
                disabled={true}
              />

              <FormInput
                title='Lokasi Pekerjaan'
                placeholder='Masukkan lokasi pekerjaan (otomatis)'
                value={scheduleDataById?.rab?.data_entry?.lokasi_pekerjaan?.toString()}
                disabled={true}
                type='textarea'
              />

              <FormInput
                title='Program Kegiatan'
                placeholder='Masukkan program kegiatan'
                value={scheduleDataById?.rab?.program?.toString()}
                name='program'
                disabled={true}
              />

              <FormInput
                title='Kegiatan'
                placeholder='Masukkan kegiatan'
                value={scheduleDataById?.rab?.data_entry?.nama_paket?.toString()}
                name='activity'
                disabled={true}
              />

              <FormInput
                title='Tanggal Awal'
                placeholder='Masukkan tanggal awal'
                value={scheduleDataById?.tanggal_mulai?.toString()}
                name='start'
                disabled={true}
                type='date'
              />

              <FormInput
                title='Tanggal Akhir'
                placeholder='Masukkan tanggal akhir'
                value={scheduleDataById?.tanggal_akhir?.toString()}
                name='end'
                disabled={true}
                type='date'
              />

              <FormInput
                title={`Alasan (Revisi ke- ${scheduleDataById?.alasan_count ?? ""})`}
                placeholder='Alasan'
                value={scheduleDataById?.alasan_text ? scheduleDataById?.alasan_text : ""}
                disabled={true}
                type='textarea'
              />

              <FormSelect value={selectedRevision} onChange={(e) => setSelectedRevision(e.target.value)} title={`Revisi ke - ${revisionCount[revisionCount.length - 1]?.alasan_count}`}>
                {revisionCount.map((item, index) => (
                  <option key={index} value={item.schedule_id}>{item?.alasan_count}</option>
                ))}
              </FormSelect>
            </div>
          </div>

          <WeekScheduleTable
            dataFile={scheduleDataById.items as any}
            totalMinggu={
              Math.max(
                ...(scheduleDataById?.items?.map(
                  (item: any) => item.schedule_weeks?.length || 0
                ) ?? [0])
              )
            }
            showDelete={false}
            handleDeleteRow={null as any}
          />
        </div>
      </div>
    </div>
  );
}