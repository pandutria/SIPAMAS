/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import BackButton from '../../../ui/BackButton';
import ShowTableForm from '../../../ui/ShowTableForm';
import FormInput from '../../../ui/FormInput';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import useScheduleHooks from '../../../hooks/ScheduleHooks';
import WeekScheduleTable from '../../../ui/WeekScheduleTable';
import FormSelect from '../../../ui/FormSelect';
import MapsShow from '../../../components/maps/MapsShow';
import { FormatDate } from '../../../utils/FormatDate';

export default function AdminPPKJadwalPelaksanaanUpdateView() {
  const [selectedRevision, setSelectedRevision] = useState<any>(null);
  const {
    setSelectedId,
    scheduleDataById,
    revisionCount,
    startDate,
    endDate,
    handleChangeSchedule
  } = useScheduleHooks();

  const { user, loading } = useAuth();
  const location = useLocation();
  const [isDisabled, setIsDisabled] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    document.body.style.overflow = "auto"
    const fetchSelected = async () => {
      if (!isDisabled && location.pathname.startsWith("/admin-direksi/jadwal-pelaksanaan/lihat")) {
        setIsDisabled(true);
      }

      if (selectedRevision) {
        setSelectedId(Number(selectedRevision))
      } else {
        setSelectedId(id)
      }
    }

    fetchSelected();
  }, [location, isDisabled, id, setSelectedId, scheduleDataById, selectedRevision]);

  if (loading || !scheduleDataById) {
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
          <BackButton type='custom' link='/admin-ppk/jadwal-pelaksanaan' />

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
              Lihat Jadwal Pelaksanaan
            </h1>

            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                <ShowTableForm disabled={true} tenderCode={`TND-0${scheduleDataById?.rab?.proyek.id}`} onClick={() => false} />

                <FormInput
                  title='Nama Proyek'
                  placeholder='Masukkan nama proyek (otomatis)'
                  value={scheduleDataById?.rab?.proyek.nama}
                  disabled={true}
                />

                <FormInput
                  title='Tahun Anggaran'
                  placeholder='Masukkan tahun anggaran (otomatis)'
                  value={scheduleDataById?.rab?.proyek.tahun_anggaran}
                  disabled={true}
                />

                <FormInput
                  title='Kategori Proyek'
                  placeholder='Masukkan kategori proyek (otomatis)'
                  value={scheduleDataById?.rab?.proyek.kategori}
                  disabled={true}
                />

                <FormInput
                  title='Kontraktor Pelaksana'
                  placeholder='Masukkan kontrator pelaksana (otomatis)'
                  value={scheduleDataById?.rab?.proyek.kontraktor_pelaksana}
                  disabled={true}
                />

                <FormInput
                  title='Konsultas Pengawas'
                  placeholder='Masukkan konsultas pengawas (otomatis)'
                  value={scheduleDataById?.rab?.proyek.konsultas_pengawas}
                  disabled={true}
                />
              </div>

              {(scheduleDataById?.rab?.proyek?.locations?.length || 0) > 0 && (
                <MapsShow data={scheduleDataById!.rab!.proyek.locations} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                <FormInput
                  title='Nilai Kontrak'
                  placeholder='Masukkan nilai kontrak (otomatis)'
                  value={scheduleDataById?.rab?.proyek.nilai_kontrak}
                  disabled={true}
                />

                <FormInput
                  title='Sumber Dana'
                  placeholder='Masukkan nilai kontrak (otomatis)'
                  value={scheduleDataById?.rab?.proyek.nilai_kontrak}
                  disabled={true}
                />

                <FormInput
                  title='Kontraktor Pelaksana'
                  placeholder='Masukkan kontraktor pelaksana (otomatis)'
                  value={scheduleDataById?.rab?.proyek.kontraktor_pelaksana}
                  disabled={true}
                />

                <FormInput
                  title='Konsultas Pengawas'
                  placeholder='Masukkan konsultas pengawas (otomatis)'
                  value={scheduleDataById?.rab?.proyek.konsultas_pengawas}
                  disabled={true}
                />

                <FormInput
                  title='Waktu Pelaksanaan (Mulai)'
                  placeholder='Masukkan waktu pelaksanaan (mulai)'
                  value={startDate}
                  disabled={true}
                  onChange={handleChangeSchedule}
                  name='start'
                  type='date'
                />

                <FormInput
                  title='Waktu Pelaksanaan (Akhir)'
                  placeholder='Masukkan waktu pelaksanaan (akhir)'
                  value={endDate}
                  onChange={handleChangeSchedule}
                  disabled={true}
                  name='end'
                  type='date'
                />

                <FormInput
                  title='Program'
                  placeholder='Masukkan program'
                  value={scheduleDataById?.rab?.program}
                  disabled={true}
                  type='textarea'
                />

                <FormInput
                  title='Alasan'
                  placeholder='Alasan'
                  disabled={true}
                  value={scheduleDataById?.alasan_text ?? ""}
                  type='textarea'
                />
              </div>

              <FormSelect required={false} value={selectedRevision ?? id} onChange={(e) => setSelectedRevision(e.target.value)} title={"Revisi"}>
                {revisionCount.map((item, index) => (
                  <option key={index} value={item.schedule_id}>{item?.alasan_count} - Diubah pada {FormatDate(item.created_at)}</option>
                ))}
              </FormSelect>
            </div>
          </div>

          <WeekScheduleTable
            dataFile={scheduleDataById.items as any}
            totalMinggu={Math.max(...(scheduleDataById?.items?.map((item: any) => item.weeks?.length || 0) ?? [0]))}
            handleDeleteRow={null as any}
          />
        </div>
      </div>
    </div>
  );
}