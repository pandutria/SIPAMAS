/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import * as XLSX from 'xlsx';
import { SwalMessage } from '../../../utils/SwalMessage';
import TableContent from '../../../ui/TableContent';
import BackButton from '../../../ui/BackButton';
import ShowTableForm from '../../../ui/ShowTableForm';
import FormInput from '../../../ui/FormInput';
import SubmitButton from '../../../ui/SubmitButton';
import FormGenerateExcel from '../../../ui/FormGenerateExcel';
import useRABHooks from '../../../hooks/RABHooks';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Navigate } from 'react-router-dom';
import TableHeader from '../../../ui/TableHeader';
import useDataEntryHooks from '../../../hooks/DataEntryHooks';
import RabDetailTable from '../../../ui/RabDetailTable';
import { ParseNumber } from '../../../utils/ParseNumber';

const parseRABExcel = (
  worksheet: XLSX.WorkSheet,
  startRow: number = 7,
  maxRow: number = 1210
): RABDetailProps[] => {
  const result: RABDetailProps[] = [];

  const range = XLSX.utils.decode_range(worksheet['!ref'] as string);
  const endRow = Math.min(range.e.r + 1, maxRow);

  const getCell = (col: string, row: number) => {
    const cell = worksheet[`${col}${row}`];
    return cell ? cell.v : '';
  };

  for (let row = startRow; row <= endRow; row++) {
    const unit_price = ParseNumber(Number(getCell('F', row)) || 0);
    if (unit_price === 0) {
      break;
    }

    result.push({
      description: String(getCell('C', row)),
      unit: String(getCell('D', row)),
      volume: ParseNumber(Number(getCell('E', row)) || 0),
      unit_price,
      total: ParseNumber(Number(getCell('G', row)) || 0),
    } as any);
  }

  return result;
};

export default function PPKRencanaAnggaranAdd() {
  const [dataFile, setDataFile] = useState<any[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [showTender, setShowTender] = useState(false);
  const [search, setSearch] = useState("");

  const [tenderDataFilter, setTenderDataFilter] = useState<DataEntryProps[]>([]);
  const [selectedTender, setSelectedTender] = useState<DataEntryProps | any>(null);

  const { dataEntryPengadaan } = useDataEntryHooks();
  const {
    handleRABPost,
    handleChangeRAB,
    program,
    rabData
  } = useRABHooks();
  const { user, loading } = useAuth();

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/downloads/template-rab.xlsx';
    link.download = 'template-rab.xlsx';
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
      const parsedData = parseRABExcel(worksheet);

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
    if (!selectedTender) {
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
    const renderShowtender = () => {
      if (showTender && !selectedTender) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = "auto"
        setShowTender(false)
      }
    }

    const filteringDataTender = () => {
      const filter = dataEntryPengadaan?.filter((item: DataEntryProps) => {
        const data = item?.kode_paket?.toString().toLowerCase().includes(search.toLowerCase());
        const isGroup = item?.tipe?.includes("Kelompok");
        const isUser = item?.selected_ppk_id === user?.id;
        const isExisting = rabData?.some(
          rab => String(rab?.data_entry?.kode_paket).trim() == String(item?.kode_paket)
        );

        return data && isGroup && !isExisting && isUser;
      });

      setTenderDataFilter(filter);
    }

    renderShowtender();
    filteringDataTender();
  }, [showTender, selectedTender, search, dataEntryPengadaan, user, rabData]);

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

  if (loading || dataEntryPengadaan.length === 0) {
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
              title="Data Tender"
              type='pokja'
              showHapus={false}
              showTambah={false}
              showTahunQuery={false}
              searchValue={search}
              onSearchChange={(item) => setSearch(item)}
            />
            <div className="overflow-y-auto max-h-[70vh] w-full">
              <TableContent
                columns={columns}
                data={tenderDataFilter}
                isSelect={false}
                showEdit={false}
                showPreview={false}
                showSelect={true}
                idKey="id"
                onSelectedDataChange={(item) => {
                  setSelectedTender(item)
                  setShowTender(false)
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-7xl mx-auto">
          <BackButton type='custom' link='/ppk/rencana-anggaran'/>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
              Rencana Anggaran Biaya
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
              <ShowTableForm tenderCode={selectedTender?.kode_paket} onClick={() => {
                setShowTender(true);
                setSelectedTender(null);
              }} />

              <FormInput
                title='Tahun Anggaran'
                placeholder='Masukkan tahun anggaran (otomatis)'
                value={selectedTender?.tahun_anggaran as any}
                disabled={true}
              />

              <FormInput
                title='Satuan Kerja'
                placeholder='Masukkan tahun satuan kerja (otomatis)'
                value={selectedTender?.satuan_kerja}
                disabled={true}
              />

              <FormInput
                title='Kode RUP'
                placeholder='Masukkan tahun kode RUP (otomatis)'
                value={selectedTender?.kode_rup}
                disabled={true}
              />

              <FormInput
                title='Lokasi Pekerjaan'
                placeholder='Masukkan lokasi pekerjaan (otomatis)'
                value={selectedTender?.lokasi_pekerjaan}
                disabled={true}
                type='textarea'
              />

              <FormInput
                title='Program Kegiatan'
                placeholder='Masukkan program kegiatan'
                value={program}
                name='program'
                onChange={handleChangeRAB}
              />

              <FormInput
                title='Kegiatan'
                placeholder='Masukkan kegiatan (otomatis)'
                value={selectedTender?.nama_paket}
                disabled={true}
              />

              <FormInput
                title='Alasan'
                placeholder='Alasan'
                disabled={true}
                type='textarea'
              />
            </div>

            <SubmitButton text='Buat RAB' onClick={() => handleShowDetail()} />
          </div>

          {showDetail && (
            <FormGenerateExcel handleSave={() => handleRABPost(selectedTender.id, dataFile)} title='RAB' handleFileChange={handleFileChange} handleDownloadTemplate={handleDownloadTemplate} />
          )}

          <RabDetailTable
            dataFile={dataFile}
            handleDeleteRow={null as any}
            showDelete={false}
          />
        </div>
      </div>
    </div>
  );
}