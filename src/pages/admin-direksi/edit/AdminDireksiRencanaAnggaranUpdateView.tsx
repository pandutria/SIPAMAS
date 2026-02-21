/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import Navbar from '../../../components/Navbar';
import BackButton from '../../../ui/BackButton';
import ShowTableForm from '../../../ui/ShowTableForm';
import FormInput from '../../../ui/FormInput';
import SubmitButton from '../../../ui/SubmitButton';
import useRABHooks from '../../../hooks/RABHooks';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import FormSelect from '../../../ui/FormSelect';
import RabDetailTable from '../../../ui/RabDetailTable';
import { ParseNumber } from '../../../utils/ParseNumber';
import * as XLSX from 'xlsx';
import { SwalMessage } from '../../../utils/SwalMessage';
import FormGenerateExcel from '../../../ui/FormGenerateExcel';
import { FormatDate } from '../../../utils/FormatDate';
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

export default function AdminDireksiRencanaAnggaranUpdateView() {
  const [dataFile, setDataFile] = useState<any[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const location = useLocation();
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    handleRABPut,
    handleChangeRAB,
    program,
    revisionCount,
    rabDataByid,
    setSelectedId
  } = useRABHooks();
  const { user, loading } = useAuth();
  const { id } = useParams();
  const reason = localStorage.getItem("reason");
  const [selectedRevision, setSelectedRevision] = useState<any>(null);

  useEffect(() => {
    const fetchIsPreview = () => {
      if (location.pathname.startsWith("/admin-direksi/rencana-anggaran/lihat")) {
        setIsDisabled(true);
      }

      if (selectedRevision) {
        setSelectedId(selectedRevision);
      } else {
        setSelectedId(id);
      }
    }

    document.body.style.overflow = 'auto';
    fetchIsPreview();
  }, [id, location, selectedRevision, setSelectedId, revisionCount, rabDataByid]);

  const handleShowDetail = () => {
    setShowDetail(true);
  }

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

  if (loading || !rabDataByid) {
    return <LoadingSpinner />
  }

  if (!user || user.role != "admin-direksi") {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4 md:px-8" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-7xl mx-auto">
          <BackButton type='custom' link='/admin-direksi/rencana-anggaran' />
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="font-poppins-bold text-2xl text-gray-800 mb-6">
              {isDisabled ? "Lihat" : "Ubah"} Rencana Anggaran Biaya
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

              <MapPicker latitude={Number(rabDataByid?.proyek.latitude)} longitude={Number(rabDataByid?.proyek.longitude)} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
                <FormInput
                  title='Provinsi'
                  placeholder='Masukkan provinsi'
                  value={rabDataByid?.proyek.provinsi}
                  disabled={true}
                />

                <FormInput
                  title='Kabupaten/Kota'
                  placeholder='Masukkan kabupaten/kota'
                  value={rabDataByid?.proyek.kabupaten}
                  disabled={true}
                />

                <FormInput
                  title='Kecamatan'
                  placeholder='Masukkan kecamatan'
                  value={rabDataByid?.proyek.kecamatan}
                  disabled={true}
                />

                <FormInput
                  title='Kelurahan/Desa'
                  placeholder='Masukkan kelurahan/desa'
                  value={rabDataByid?.proyek.kelurahan}
                  disabled={true}
                />

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
                  disabled={isDisabled}
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

              {isDisabled && (
                <FormSelect required={false} value={selectedRevision ?? id} onChange={(e) => setSelectedRevision(e.target.value)} title="Revisi">
                  {revisionCount.map((item, index) => (
                    <option key={index} value={item?.rab_id}>{item?.alasan_count} - Diubah pada {FormatDate(item.created_at)}</option>
                  ))}
                </FormSelect>
              )}
            </div>

            {!isDisabled && (
              <SubmitButton text='Perbarui RAB' onClick={() => handleShowDetail()} />
            )}
          </div>

          {showDetail && (
            <FormGenerateExcel 
              handleSave={() => handleRABPut(rabDataByid.identitas_proyek_id, rabDataByid, reason as any, dataFile.length > 0 ? dataFile : rabDataByid?.details as any)} 
              title='RAB' 
              handleFileChange={handleFileChange} 
              handleDownloadTemplate={handleDownloadTemplate} 
            />
          )}

          <RabDetailTable
            dataFile={dataFile.length > 0 ? dataFile : rabDataByid?.details as any}
            handleDeleteRow={null as any}
            showDelete={false}
          />
        </div>
      </div>
    </div>
  );
}