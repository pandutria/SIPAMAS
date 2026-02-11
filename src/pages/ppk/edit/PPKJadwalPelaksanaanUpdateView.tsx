/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import TableContent from '../../../ui/TableContent';
import BackButton from '../../../ui/BackButton';
import ShowTableForm from '../../../ui/ShowTableForm';
import FormInput from '../../../ui/FormInput';
import SubmitButton from '../../../ui/SubmitButton';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import TableHeader from '../../../ui/TableHeader';
import useScheduleHooks from '../../../hooks/ScheduleHooks';
import useRABHooks from '../../../hooks/RABHooks';
import WeekScheduleTable from '../../../ui/WeekScheduleTable';
import FormSelect from '../../../ui/FormSelect';
import { ParseNumber } from '../../../utils/ParseNumber';
import * as XLSX from 'xlsx';
import { SwalMessage } from '../../../utils/SwalMessage';
import FormGenerateExcel from '../../../ui/FormGenerateExcel';
import { FormatDate } from '../../../utils/FormatDate';

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
        week_number: i + 1,
        value: Number(getCell(col, row)) || 0
      });
    }

    const total_price = ParseNumber(getCell('C', row) || 0);
    if (total_price === 0) {
      break;
    }

    result.push({
      id: 0,
      schedule_header_id: 0,
      number: String(numberCounter++),
      description: String(getCell('B', row)),
      total_price,
      weight: ParseNumber(Number(getCell('D', row)) || 0),
      created_at: '',
      updated_at: '',
      schedule_weeks: scheduleWeeks
    });
  }

  return result;
}

const getTotalMingguFromData = (data: ScheduleItemProps[]): number => {
  return data.length > 0 ? data[0].schedule_weeks.length : 0;
};

export default function PPKJadwalPelaksanaanUpdateView() {
  const [dataFile, setDataFile] = useState<ScheduleItemProps[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [showTender, setShowTender] = useState(false);
  const [search, setSearch] = useState("");
  const [tahun, setTahun] = useState('');
  const [satuanKerja, setSatuanKerja] = useState('');
  const [selectedRab, setSelectedRab] = useState<any>(null);
  const [selectedRevision, setSelectedRevision] = useState<any>(null);

  const {
    setSelectedId,
    scheduleDataById,
    handleSchedulePut,
    scheduleData,
    revisionCount,
    startDate,
    endDate,
    handleChangeSchedule
  } = useScheduleHooks();
  const { rabData } = useRABHooks();
  const [rabDataFilter, setRabDataFilter] = useState<RABProps[]>([]);

  const { user, loading } = useAuth();
  const location = useLocation();
  const [isDisabled, setIsDisabled] = useState(false);
  const { id } = useParams();
  const reason = localStorage.getItem("reason");
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
    if (showTender && !selectedRab) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = "auto"
    }

    const fetchSelected = async () => {
      if (!isDisabled && location.pathname.startsWith("/ppk/jadwal-pelaksanaan/lihat")) {
        setIsDisabled(true);
      }

      if (selectedRevision) {
        setSelectedId(Number(selectedRevision))
      } else {
        setSelectedId(id)
      }
    }

    fetchSelected();
  }, [showTender, selectedRab, location, isDisabled, id, setSelectedId, scheduleDataById, selectedRevision]);

  useEffect(() => {
    const filteringDataRab = () => {
      const dataFilter = rabData?.filter((item: RABProps) => {
        const searchFilter = search ? item?.data_entry?.nama_paket?.toString().toLowerCase().includes(search.toLowerCase()) : true;
        const isExisting = scheduleData.some(
          schedule => schedule?.rab?.data_entry?.kode_paket == item?.data_entry.kode_paket
        );

        return searchFilter && !isExisting;
      });

      setRabDataFilter(dataFilter);
    }

    const fetchSelected = async () => {
      if (scheduleDataById) {
        setSelectedRab({
          ...scheduleDataById,
          alasan_text: scheduleDataById.alasan_text ?? ""
        });
      }
    }

    fetchSelected();
    filteringDataRab();
  }, [search, satuanKerja, tahun, rabData, scheduleData, scheduleDataById]);

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
      key: 'satuan_kerja',
      label: 'Satuan Kerja'
    },
    {
      key: 'kode_rup',
      label: 'Kode RUP'
    },
    {
      key: 'kode_paket',
      label: 'kode Tender'
    },
    {
      key: 'nama_paket',
      label: 'Nama Paket'
    },
  ];

  if (loading || !scheduleDataById) {
    return <LoadingSpinner />
  }

  if (!user || user.role.name != "ppk") {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {showTender && (
        <div className="fixed inset-0 h-screen flex justify-center items-center bg-black/20 z-20">
          <div className="bg-white p-4 rounded-lg flex flex-col max-w-[90vw] max-h-[70vh] gap-4 relative">
            <div className="absolute top-4 right-4 cursor-pointer text-primary" onClick={() => setShowTender(false)}>
              <X />
            </div>
            <TableHeader
              title="Data Tender Dari RAB"
              type='pokja'
              showHapus={false}
              showTambah={false}
              searchValue={search}
              onTahunChange={(item) => setTahun(item)}
              onSatuanKerjaChange={(item) => setSatuanKerja(item)}
              onSearchChange={(item) => setSearch(item)}
              showTahunQuery={false}
            />
            <div className="overflow-y-auto max-h-[70vh] w-full">
              <TableContent
                columns={columns}
                data={rabDataFilter}
                isSelect={false}
                showEdit={false}
                showPreview={false}
                showSelect={true}
                idKey="id"
                onSelectedDataChange={(item) => {
                  setSelectedRab(item as any)
                  setShowTender(false)
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-7xl mx-auto">
          <BackButton type='custom' link='/ppk/jadwal-pelaksanaan' />
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
              {isDisabled ? "Lihat" : "Ubah"} Jadwal Pelaksanaan
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
              <ShowTableForm disabled={true} tenderCode={selectedRab?.rab?.data_entry?.kode_paket} onClick={() => {
                if (!isDisabled) {
                  setShowTender(true);
                  setSelectedRab(null);
                }
              }} />

              <FormInput
                title='Tahun Anggaran'
                placeholder='Masukkan tahun anggaran (otomatis)'
                value={selectedRab?.rab?.data_entry?.tahun_anggaran}
                disabled={true}
              />

              <FormInput
                title='Satuan Kerja'
                placeholder='Masukkan tahun satuan kerja (otomatis)'
                value={selectedRab?.rab?.data_entry?.satuan_kerja}
                disabled={true}
              />

              <FormInput
                title='Kode RUP'
                placeholder='Masukkan tahun kode RUP (otomatis)'
                value={selectedRab?.rab?.data_entry?.kode_rup}
                disabled={true}
              />

              <FormInput
                title='Lokasi Pekerjaan'
                placeholder='Masukkan lokasi pekerjaan (otomatis)'
                value={selectedRab?.rab?.data_entry?.lokasi_pekerjaan}
                disabled={true}
                type='textarea'
              />

              <FormInput
                title='Program Kegiatan'
                placeholder='Masukkan program kegiatan'
                value={selectedRab?.rab?.program}
                name='program'
                disabled={true}
              />

              <FormInput
                title='Kegiatan'
                placeholder='Masukkan kegiatan'
                value={selectedRab?.rab?.data_entry?.nama_paket}
                name='activity'
                disabled={true}
              />

              <FormInput
                title='Tanggal Awal'
                placeholder='Masukkan tanggal awal'
                value={startDate ? startDate : selectedRab?.tanggal_mulai ? selectedRab?.tanggal_mulai : ""}
                name='start'
                disabled={isDisabled}
                onChange={handleChangeSchedule}
                type='date'
              />

              <FormInput
                title='Tanggal Akhir'
                placeholder='Masukkan tanggal akhir'
                value={endDate ? endDate : selectedRab?.tanggal_akhir ? selectedRab?.tanggal_akhir : ""} 
                name='end'
                disabled={isDisabled}
                onChange={handleChangeSchedule}
                type='date'
              />

              <FormInput
                title={`Alasan (Revisi ke- ${scheduleDataById?.alasan_count ?? 0})`}
                placeholder='Alasan'
                value={selectedRab?.alasan_text}
                disabled={true}
                type='textarea'
              />

              {isDisabled && (
                <FormSelect required={false} value={selectedRevision ?? id} onChange={(e) => setSelectedRevision(e.target.value)} title={"Revisi"}>
                  {revisionCount.map((item, index) => (
                    <option key={index} value={item.schedule_id}>{item?.alasan_count} - Diubah pada {FormatDate(item.created_at)}</option>
                  ))}
                </FormSelect>
              )}
            </div>
            {!isDisabled && (
              <SubmitButton text='Ubah Jadwal' onClick={() => handleShowDetail()} />
            )}
          </div>

          {showDetail && (
            <FormGenerateExcel handleSave={() => handleSchedulePut(selectedRab, scheduleDataById.schedule_group_id, dataFile.length > 0 ? dataFile : scheduleDataById.items as any, reason as any, totalMinggu ? totalMinggu : Math.max(...(scheduleDataById?.items?.map((item: any) => item.schedule_weeks?.length || 0) ?? [0])))} title='jadwal Pelaksanaan' handleFileChange={handleFileChange} handleDownloadTemplate={handleDownloadTemplate} />
          )}

          <WeekScheduleTable
            dataFile={dataFile.length > 0 ? dataFile : scheduleDataById.items as any}
            totalMinggu={totalMinggu ? totalMinggu : Math.max(...(scheduleDataById?.items?.map((item: any) => item.schedule_weeks?.length || 0) ?? [0]))}
            handleDeleteRow={null as any}
          />
        </div>
      </div>
    </div>
  );
}