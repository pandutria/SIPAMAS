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
import useRABHooks from '../../../hooks/RABHooks';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Navigate } from 'react-router-dom';
import TableHeader from '../../../ui/TableHeader';
import RabDetailTable from '../../../ui/RabDetailTable';
import { ParseNumber } from '../../../utils/ParseNumber';
import useProjectIdentity from '../../../hooks/ProjectIdentity';
import L from "leaflet";
import maps from "/icon/maps.png";
import "leaflet/dist/leaflet.css";

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
    const harga = ParseNumber(Number(getCell('F', row)) || 0);
    if (harga === 0) {
      break;
    }

    result.push({
      keterangan: String(getCell('C', row)),
      satuan: String(getCell('D', row)),
      volume: ParseNumber(Number(getCell('E', row)) || 0),
      harga,
      total: ParseNumber(Number(getCell('G', row)) || 0),
    } as any);
  }

  return result;
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

export default function AdminDireksiRencanaAnggaranAdd() {
  const [dataFile, setDataFile] = useState<any[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [showProjectIdentity, setShowProjectIdentity] = useState(false);
  const [search, setSearch] = useState("");

  const { projectIdentityData } = useProjectIdentity();
  const [projectIdentityDataFilter, setProjectIdentityDataFilter] = useState<ProjectIdentityProps[]>([]);
  const [selectedProjectIdentity, setSelectedProjectIdentity] = useState<ProjectIdentityProps | null>(null);

  const {
    handleRABPost,
    rabData,
    program,
    handleChangeRAB
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
    if (!selectedProjectIdentity) {
      SwalMessage({
        type: "error",
        title: "Gagal!",
        text: "Pilih Identitas Proyek terlebih dahulu!"
      });

      return;
    }

    setShowDetail(true);
  }

  useEffect(() => {
    const renderShowtender = () => {
      if (showProjectIdentity && !selectedProjectIdentity) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = "auto"
        setShowProjectIdentity(false)
      }
    }

    const filteringDataTender = () => {
      const filter = projectIdentityData?.filter((item: ProjectIdentityProps) => {
        const data = item?.nama?.toString().toLowerCase().includes(search.toLowerCase());
        const isExisting = rabData?.some(
          rab => String(rab?.proyek?.id).trim() == String(item?.id)
        );

        return data && !isExisting;
      });

      setProjectIdentityDataFilter(filter);
    }

    renderShowtender();
    filteringDataTender();
  }, [showProjectIdentity, selectedProjectIdentity, search, projectIdentityData, user, rabData]);

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
      key: 'project_id',
      label: 'ID Proyek'
    },
    {
      key: 'kontraktor_pelaksana',
      label: 'Kontraktor Pelaksana'
    },
    {
      key: 'nama',
      label: 'Nama Paket'
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
                data={projectIdentityDataFilter}
                isSelect={false}
                showEdit={false}
                showPreview={false}
                showSelect={true}
                idKey="id"
                onSelectedDataChange={(item) => {
                  setSelectedProjectIdentity(item as any)
                  setShowProjectIdentity(false)
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-7xl mx-auto">
          <BackButton type='custom' link='/admin-direksi/rencana-anggaran' />
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
              Rencana Anggaran Biaya
            </h1>

            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                <ShowTableForm tenderCode={selectedProjectIdentity?.id ? `TND-0${selectedProjectIdentity?.id}` : ""} onClick={() => {
                  setShowProjectIdentity(true);
                  setSelectedProjectIdentity(null);
                }} />

                <FormInput
                  title='Nama Proyek'
                  placeholder='Masukkan nama proyek (otomatis)'
                  value={selectedProjectIdentity?.nama}
                  disabled={true}
                />

                <FormInput
                  title='Tahun Anggaran'
                  placeholder='Masukkan tahun anggaran (otomatis)'
                  value={selectedProjectIdentity?.tahun_anggaran}
                  disabled={true}
                />

                <FormInput
                  title='Kategori Proyek'
                  placeholder='Masukkan kategori proyek (otomatis)'
                  value={selectedProjectIdentity?.kategori}
                  disabled={true}
                />

                <FormInput
                  title='Kontraktor Pelaksana'
                  placeholder='Masukkan kontrator pelaksana (otomatis)'
                  value={selectedProjectIdentity?.kontraktor_pelaksana}
                  disabled={true}
                />

                <FormInput
                  title='Konsultas Pengawas'
                  placeholder='Masukkan konsultas pengawas (otomatis)'
                  value={selectedProjectIdentity?.konsultas_pengawas}
                  disabled={true}
                />
              </div>

              <MapPicker latitude={Number(selectedProjectIdentity?.latitude)} longitude={Number(selectedProjectIdentity?.longitude)}/>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                <FormInput
                  title='Provinsi'
                  placeholder='Masukkan provinsi'
                  value={selectedProjectIdentity?.provinsi}
                  disabled={true}
                />

                <FormInput
                  title='Kabupaten/Kota'
                  placeholder='Masukkan kabupaten/kota'
                  value={selectedProjectIdentity?.kabupaten}
                  disabled={true}
                />

                <FormInput
                  title='Kecamatan'
                  placeholder='Masukkan kecamatan'
                  value={selectedProjectIdentity?.kecamatan}
                  disabled={true}
                />

                <FormInput
                  title='Kelurahan/Desa'
                  placeholder='Masukkan kelurahan/desa'
                  value={selectedProjectIdentity?.kelurahan}
                  disabled={true}
                />
                
                <FormInput
                  title='Nilai Kontrak'
                  placeholder='Masukkan nilai kontrak (otomatis)'
                  value={selectedProjectIdentity?.nilai_kontrak}
                  disabled={true}
                />
                
                <FormInput
                  title='Sumber Dana'
                  placeholder='Masukkan nilai kontrak (otomatis)'
                  value={selectedProjectIdentity?.nilai_kontrak}
                  disabled={true}
                />
                
                <FormInput
                  title='Kontraktor Pelaksana'
                  placeholder='Masukkan kontraktor pelaksana (otomatis)'
                  value={selectedProjectIdentity?.kontraktor_pelaksana}
                  disabled={true}
                />
                
                <FormInput
                  title='Konsultas Pengawas'
                  placeholder='Masukkan konsultas pengawas (otomatis)'
                  value={selectedProjectIdentity?.konsultas_pengawas}
                  disabled={true}
                />

                <FormInput
                  title='Program'
                  placeholder='Masukkan program'
                  value={program}
                  onChange={handleChangeRAB}
                  name='program'
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

            <SubmitButton text='Buat RAB' onClick={() => handleShowDetail()} />
          </div>

          {showDetail && (
            <FormGenerateExcel handleSave={() => handleRABPost(selectedProjectIdentity!.id, dataFile)} title='RAB' handleFileChange={handleFileChange} handleDownloadTemplate={handleDownloadTemplate} />
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