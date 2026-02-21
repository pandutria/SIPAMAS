/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../../../components/Navbar';
import * as XLSX from 'xlsx';
import { SwalMessage } from '../../../utils/SwalMessage';
import TableContent from '../../../ui/TableContent';
import BackButton from '../../../ui/BackButton';
import ShowTableForm from '../../../ui/ShowTableForm';
import FormInput from '../../../ui/FormInput';
import SubmitButton from '../../../ui/SubmitButton';
import FormGenerateExcel from '../../../ui/FormGenerateExcel';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Navigate } from 'react-router-dom';
import TableHeader from '../../../ui/TableHeader';
import useScheduleHooks from '../../../hooks/ScheduleHooks';
import WeekScheduleTable from '../../../ui/WeekScheduleTable';
import useRABHooks from '../../../hooks/RABHooks';
import { ParseNumber } from '../../../utils/ParseNumber';
import L from "leaflet";
import maps from "/icon/maps.png";
import "leaflet/dist/leaflet.css";

const WEEK_START_COL = 'E';
const formatLoopExcel = (index: number): string => {
  let col = '';
  while (index >= 0) {
    col = String.fromCharCode((index % 26) + 65) + col;
    index = Math.floor(index / 26) - 1;
  }
  return col;
};

const getTotalMingguFromExcel = (
  worksheet: XLSX.WorkSheet,
  startRow: number = 5,
  maxWeek: number = 20000
): number => {
  const startColIndex = XLSX.utils.decode_col(WEEK_START_COL);
  let total = 0;

  for (let i = 0; i < maxWeek; i++) {
    const col = formatLoopExcel(startColIndex + i);
    const cell = worksheet[`${col}${startRow}`];

    if (cell && cell.v !== '' && cell.v !== null) {
      total = i + 1;
    }
  }

  return total;
};

const parseRABExcel = (
  worksheet: XLSX.WorkSheet,
  totalMinggu: number,
  startRow: number = 5,
  maxRow: number = 8300
): ScheduleItemProps[] => {
  const result: ScheduleItemProps[] = [];

  const range = XLSX.utils.decode_range(worksheet['!ref'] as string);
  const endRow = Math.min(range.e.r + 1, maxRow);

  const getCell = (col: string, row: number) => {
    const cell = worksheet[`${col}${row}`];
    return cell ? cell.v : '';
  };

  const startColIndex = XLSX.utils.decode_col(WEEK_START_COL);
  let numberCounter = 1;

  for (let row = startRow; row <= endRow; row++) {
    const scheduleWeeks = [];

    for (let i = 0; i < totalMinggu; i++) {
      const col = formatLoopExcel(startColIndex + i);

      scheduleWeeks.push({
        id: 0,
        schedule_item_id: 0,
        minggu_nomor: i + 1,
        nilai: Number(getCell(col, row)) || 0
      });
    }

    const total_price = ParseNumber(getCell('C', row) || 0);
    if (total_price === 0) {
      break;
    }

    result.push({
      id: 0,
      schedule_header_id: 0,
      nomor: String(numberCounter++),
      keterangan: String(getCell('B', row)),
      jumlah: total_price,
      bobot: ParseNumber(Number(getCell('D', row)) || 0),
      created_at: '',
      updated_at: '',
      weeks: scheduleWeeks
    } as any);
  }

  return result;
};

const getTotalMingguFromData = (data: ScheduleItemProps[]): number => {
  return data.length > 0 ? data[0].weeks.length : 0;
};

const customIcon = L.icon({
  iconUrl: maps,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

function MapPicker({
  latitude,
  longitude
}: {
  latitude: number;
  longitude: number;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      attributionControl: false,
    }).setView([-2.5489, 118.0149], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    if (latitude || longitude) {
      markerRef.current = L.marker(
        [latitude, longitude],
        { icon: customIcon }
      ).addTo(map);
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [latitude, longitude]);

  return (
    <div className="relative w-full h-80">
      <div ref={mapRef} className="w-full h-full rounded-lg z-0" />
    </div>
  );
}

export default function AdminDireksiJadwalPelaksanaanAdd() {
  const [dataFile, setDataFile] = useState<ScheduleItemProps[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [showProjectIdentity, setShowProjectIdentity] = useState(false);
  const [search, setSearch] = useState("");

  const [projectIdentityDataFilter, setProjectIdentityDataFilter] = useState<RABProps[]>([]);
  const [selectedRab, setSelectedRab] = useState<RABProps | null>(null);

  const { rabData } = useRABHooks();
  const { handleSchedulePost, scheduleData, startDate, endDate, handleChangeSchedule } = useScheduleHooks();
  const { user, loading } = useAuth();

  const totalMinggu = getTotalMingguFromData(dataFile);

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/downloads/template-jadwal.xlsx';
    link.download = 'template-jadwal-pelaksanaan.xlsx';
    link.click();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const total = getTotalMingguFromExcel(worksheet);
      const parsedData = parseRABExcel(worksheet, total);

      SwalMessage({
        title: "Berhasil!",
        text: "Data berhasil diimpor",
        type: "success"
      });

      setDataFile(parsedData);
    };

    reader.readAsBinaryString(file);
  };

  const handleShowDetail = () => {
    if (!selectedRab) {
      SwalMessage({
        type: "error",
        title: "Gagal!",
        text: "Pilih Tender terlebih dahulu!"
      });

      return;
    }

    setShowDetail(true);
  }

  useEffect(() => {
    if (showProjectIdentity && !selectedRab) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = "auto"
    }
  }, [showProjectIdentity, selectedRab]);

  useEffect(() => {
    const filteringDataTender = () => {
      const filter = rabData?.filter((item: RABProps) => {
        const data = item?.proyek?.nama?.toLowerCase().includes(search.toLowerCase());
        const isExisting = scheduleData.some(
          schedule => schedule?.rab?.proyek?.nama == item?.proyek.nama
        );
        return data && !isExisting;
      });

      setProjectIdentityDataFilter(filter as any);
    }

    filteringDataTender();
  }, [search, rabData, scheduleData]);

  const columns = [
    {
      key: 'id',
      label: 'No'
    },
    {
      key: 'tahun_anggaran',
      label: 'Tahun Anggaran'
    },
    {
      key: 'proyek_id',
      label: 'ID Proyek'
    },
    {
      key: 'nama',
      label: 'Nama Paket'
    },
    {
      key: 'kontraktor_pelaksana',
      label: 'Kontraktor Pelaksana'
    },
    {
      key: 'alasan_count',
      label: 'Revisi'
    },
  ];

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user || user.role != "admin-direksi") {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {showProjectIdentity && (
        <div className="fixed inset-0 h-screen flex justify-center items-center bg-black/20 z-20">
          <div className="bg-white p-4 rounded-lg flex flex-col max-w-[90vw] max-h-[70vh] gap-4 relative">
            <div className="absolute top-4 right-4 cursor-pointer text-primary" onClick={() => setShowProjectIdentity(false)}>
              <X />
            </div>
            <TableHeader
              title="Data Identitas Proyek Dari RAB"
              type='pokja'
              showHapus={false}
              showTambah={false}
              searchValue={search}
              onSearchChange={(item) => setSearch(item)}
              showTahunQuery={false}
            />
            <div className="overflow-y-auto max-h-[70vh] w-full">
              <TableContent
                columns={columns}
                data={projectIdentityDataFilter}
                isSelect={false}
                showEdit={false}
                showPreview={false}
                showSelect={true}
                idKey="id"
                onSelectedDataChange={(item) => {
                  setSelectedRab(item as any)
                  setShowProjectIdentity(false)
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-7xl mx-auto">
          <BackButton type='custom' link='/admin-direksi/jadwal-pelaksanaan' />

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
              Jadwal Pelaksanaan
            </h1>

            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                <ShowTableForm tenderCode={selectedRab?.proyek.id ? `TND-0${selectedRab?.proyek.id}` : ""} onClick={() => {
                  setShowProjectIdentity(true);
                  setSelectedRab(null);
                }} />

                <FormInput
                  title='Nama Proyek'
                  placeholder='Masukkan nama proyek (otomatis)'
                  value={selectedRab?.proyek.nama}
                  disabled={true}
                />

                <FormInput
                  title='Tahun Anggaran'
                  placeholder='Masukkan tahun anggaran (otomatis)'
                  value={selectedRab?.proyek.tahun_anggaran}
                  disabled={true}
                />

                <FormInput
                  title='Kategori Proyek'
                  placeholder='Masukkan kategori proyek (otomatis)'
                  value={selectedRab?.proyek.kategori}
                  disabled={true}
                />

                <FormInput
                  title='Kontraktor Pelaksana'
                  placeholder='Masukkan kontrator pelaksana (otomatis)'
                  value={selectedRab?.proyek.kontraktor_pelaksana}
                  disabled={true}
                />

                <FormInput
                  title='Konsultas Pengawas'
                  placeholder='Masukkan konsultas pengawas (otomatis)'
                  value={selectedRab?.proyek.konsultas_pengawas}
                  disabled={true}
                />
              </div>

              <MapPicker latitude={Number(selectedRab?.proyek.latitude)} longitude={Number(selectedRab?.proyek.longitude)} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                <FormInput
                  title='Provinsi'
                  placeholder='Masukkan provinsi'
                  value={selectedRab?.proyek.provinsi}
                  disabled={true}
                />

                <FormInput
                  title='Kabupaten/Kota'
                  placeholder='Masukkan kabupaten/kota'
                  value={selectedRab?.proyek.kabupaten}
                  disabled={true}
                />

                <FormInput
                  title='Kecamatan'
                  placeholder='Masukkan kecamatan'
                  value={selectedRab?.proyek.kecamatan}
                  disabled={true}
                />

                <FormInput
                  title='Kelurahan/Desa'
                  placeholder='Masukkan kelurahan/desa'
                  value={selectedRab?.proyek.kelurahan}
                  disabled={true}
                />

                <FormInput
                  title='Nilai Kontrak'
                  placeholder='Masukkan nilai kontrak (otomatis)'
                  value={selectedRab?.proyek.nilai_kontrak}
                  disabled={true}
                />

                <FormInput
                  title='Sumber Dana'
                  placeholder='Masukkan nilai kontrak (otomatis)'
                  value={selectedRab?.proyek.nilai_kontrak}
                  disabled={true}
                />

                <FormInput
                  title='Kontraktor Pelaksana'
                  placeholder='Masukkan kontraktor pelaksana (otomatis)'
                  value={selectedRab?.proyek.kontraktor_pelaksana}
                  disabled={true}
                />

                <FormInput
                  title='Konsultas Pengawas'
                  placeholder='Masukkan konsultas pengawas (otomatis)'
                  value={selectedRab?.proyek.konsultas_pengawas}
                  disabled={true}
                />

                <FormInput
                  title='Waktu Pelaksanaan (Mulai)'
                  placeholder='Masukkan waktu pelaksanaan (mulai)'
                  value={startDate}
                  onChange={handleChangeSchedule}
                  name='start'
                  type='date'
                />

                <FormInput
                  title='Waktu Pelaksanaan (Akhir)'
                  placeholder='Masukkan waktu pelaksanaan (akhir)'
                  value={endDate}
                  onChange={handleChangeSchedule}
                  name='end'
                  type='date'
                />

                <FormInput
                  title='Program'
                  placeholder='Masukkan program'
                  value={selectedRab?.program}
                  disabled={true}
                  type='textarea'
                />

                <FormInput
                  title='Alasan'
                  placeholder='Alasan'
                  disabled={true}
                  type='textarea'
                />
              </div>
            </div>

            <SubmitButton text='Buat Jadwal' onClick={() => handleShowDetail()} />
          </div>

          {showDetail && (
            <FormGenerateExcel
              handleSave={() => handleSchedulePost(selectedRab as any, dataFile as any, totalMinggu)}
              title='jadwal Pelaksanaan'
              handleFileChange={handleFileChange}
              handleDownloadTemplate={handleDownloadTemplate}
            />
          )}

          <WeekScheduleTable
            totalMinggu={totalMinggu}
            dataFile={dataFile}

            handleDeleteRow={null as any}
          />
        </div>
      </div>
    </div>
  );
}