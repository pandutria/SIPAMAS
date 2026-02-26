/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Search, Calendar, TrendingUp, X, Download } from 'lucide-react';
import Navbar from '../../components/Navbar';
import ShowTableForm from '../../ui/ShowTableForm';
import useRealisasiHooks from '../../hooks/RealisasiHooks';
import TableHeader from '../../ui/TableHeader';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { Navigate } from 'react-router-dom';
import TableContent from '../../ui/TableContent';
import { FormatDate } from '../../utils/FormatDate';
import { RemainingWeeks } from '../../utils/RemainingWeek';
import { ScheduleWeekAggregate } from '../../utils/ScheduleWeekAggregate';
import { buildKurvaData } from '../../utils/BuildKurvaData';
import { RemainingProgress } from '../../utils/RemainingProgress';
import { ConvertToPercent } from '../../utils/CovertToPercent';
import html2pdf from 'html2pdf.js';
import { PlannedProgressUntilWeek } from '../../utils/PlannedProgressUntilWeek';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function AdminDireksiProjectKurvaS() {
  const [selectedProject, setSelectedProject] = useState<RealizationProps | null>(null);
  const [showTender, setShowTender] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { realisasiData } = useRealisasiHooks();
  const { loading, user } = useAuth();
  const [search, setSearch] = useState("");
  const [tenderDataFilter, setTenderDataFilter] = useState<RealizationProps[]>([]);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (showTender && !selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = "auto"
    }
  }, [showTender, selectedProject]);

  useEffect(() => {
    const filteringDataTender = () => {
      const filter = realisasiData?.filter((item: RealizationProps) => {
        const data = item?.schedule?.rab?.proyek?.nama?.toLowerCase().includes(search.toLowerCase());
        return data;
      });

      setTenderDataFilter(filter);
    }

    filteringDataTender();
  }, [search, realisasiData]);

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
      label: 'Satuan Kerja'
    },
    {
      key: 'nama',
      label: 'Nama Paket'
    },
  ];

  const scheduleAggreateWeeks = ScheduleWeekAggregate(selectedProject?.schedule.items ?? []);
  const plannedValue = PlannedProgressUntilWeek(scheduleAggreateWeeks, String(selectedProject?.schedule?.tanggal_mulai));
  const totalPlanned = RemainingProgress(scheduleAggreateWeeks);
  const scheduleProgress = ConvertToPercent(plannedValue, totalPlanned);
  const actualProgress = ConvertToPercent(RemainingProgress(selectedProject?.details), RemainingProgress(scheduleAggreateWeeks));
  const kurvaData = buildKurvaData(selectedProject?.schedule, selectedProject as any);

  const exportToPDF = async () => {
    if (!selectedProject) return;

    setIsExporting(true);

    try {
      const chartImage = chartRef.current?.toBase64Image();

      const element = document.createElement('div');
      element.style.width = '297mm';
      element.style.padding = '15mm';
      element.style.backgroundColor = '#ffffff';
      element.style.fontFamily = 'Arial, sans-serif';

      element.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(0, 89, 37, 1) 0%, rgba(0, 191, 80, 1) 100%); color: white; padding: 30px 25px; text-align: center; margin-bottom: 25px; border-radius: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 0.5px;">LAPORAN KURVA S PROJECT</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.95; font-weight: 500;">Monitoring & Analisis Progress Proyek</p>
        </div>

        ${chartImage ? `
          <div style="background: rgba(0, 105, 44, 1); padding: 12px 20px; margin-bottom: 15px; border-radius: 0;">
            <h2 style="margin: 0; font-size: 14px; font-weight: bold; color: white; letter-spacing: 0.3px;">GRAFIK KURVA S</h2>
          </div>
          <div style="background: white; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; margin-bottom: 25px;">
            <img src="${chartImage}" style="width: 100%; height: auto; display: block;" />
          </div>
        ` : ''}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
          <!-- Informasi Proyek -->
          <div>
            <div style="background: rgba(0, 105, 44, 1); padding: 12px 20px; margin-bottom: 15px; border-radius: 0;">
              <h2 style="margin: 0; font-size: 14px; font-weight: bold; color: white; letter-spacing: 0.3px;">INFORMASI PROYEK</h2>
            </div>

            <table style="width: 100%; font-size: 11px; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; width: 35%; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">Program</td>
                <td style="padding: 12px 15px; border: 1px solid #e5e7eb; color: #1f2937;">${selectedProject.schedule.rab?.program || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">
                  Nama Proyek
                </td>
                <td style="padding: 12px 15px; border: 1px solid #e5e7eb; color: #1f2937;">
                  ${selectedProject.schedule.rab?.proyek.nama || '-'}
                </td>
              </tr>

              <tr>
                <td style="padding: 12px 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">
                  Tahun Anggaran
                </td>
                <td style="padding: 12px 15px; border: 1px solid #e5e7eb; color: #1f2937;">
                  ${selectedProject.schedule.rab?.proyek.tahun_anggaran || '-'}
                </td>
              </tr>

              <tr>
                <td style="padding: 12px 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">
                  Kategori
                </td>
                <td style="padding: 12px 15px; border: 1px solid #e5e7eb; color: #1f2937;">
                  ${selectedProject.schedule.rab?.proyek.kategori || '-'}
                </td>
              </tr>

              <tr>
                <td style="padding: 12px 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">
                  Provinsi
                </td>
                <td style="padding: 12px 15px; border: 1px solid #e5e7eb; color: #1f2937;">
                  ${selectedProject.schedule.rab?.proyek.provinsi || '-'}
                </td>
              </tr>

              <tr>
                <td style="padding: 12px 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">
                  Kabupaten
                </td>
                <td style="padding: 12px 15px; border: 1px solid #e5e7eb; color: #1f2937;">
                  ${selectedProject.schedule.rab?.proyek.kabupaten || '-'}
                </td>
              </tr>

              <tr>
                <td style="padding: 12px 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">
                  Kecamatan
                </td>
                <td style="padding: 12px 15px; border: 1px solid #e5e7eb; color: #1f2937;">
                  ${selectedProject.schedule.rab?.proyek.kecamatan || '-'}
                </td>
              </tr>

              <tr>
                <td style="padding: 12px 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">
                  Kode Kecamatan
                </td>
                <td style="padding: 12px 15px; border: 1px solid #e5e7eb; color: #1f2937;">
                  ${selectedProject.schedule.rab?.proyek.kecamatan_kode || '-'}
                </td>
              </tr>

              <tr>
                <td style="padding: 12px 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">
                  Kelurahan
                </td>
                <td style="padding: 12px 15px; border: 1px solid #e5e7eb; color: #1f2937;">
                  ${selectedProject.schedule.rab?.proyek.kelurahan || '-'}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">Tanggal Mulai</td>
                <td style="padding: 12px 15px; border: 1px solid #e5e7eb; color: #1f2937;">${FormatDate(String(selectedProject.schedule?.tanggal_mulai))}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">Tanggal Selesai</td>
                <td style="padding: 12px 15px; border: 1px solid #e5e7eb; color: #1f2937;">${FormatDate(String(selectedProject.schedule?.tanggal_akhir))}</td>
              </tr>
            </table>
          </div>

          <!-- Ringkasan Progress -->
          <div>
            <div style="background: rgba(0, 105, 44, 1); padding: 12px 20px; margin-bottom: 15px; border-radius: 0;">
              <h2 style="margin: 0; font-size: 14px; font-weight: bold; color: white; letter-spacing: 0.3px;">RINGKASAN PROGRESS</h2>
            </div>

            <table style="width: 100%; font-size: 11px; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 15px; font-weight: 600; width: 35%; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">Sisa Minggu</td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: #1f2937; font-weight: 700; font-size: 18px;">${RemainingWeeks(String(selectedProject?.schedule?.tanggal_mulai), String(selectedProject?.schedule?.tanggal_akhir))} <span style="font-size: 11px; font-weight: 500;">Minggu</span></td>
              </tr>
              <tr>
                <td style="padding: 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">Progress Rencana</td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: rgba(0, 191, 80, 1); font-weight: 700; font-size: 18px;">${scheduleProgress}%</td>
              </tr>
              <tr>
                <td style="padding: 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">Progress Aktual</td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: rgba(0, 191, 80, 1); font-weight: 700; font-size: 18px;">${actualProgress}%</td>
              </tr>
              <tr>
                <td style="padding: 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">Deviasi</td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: ${Number(actualProgress) - Number(scheduleProgress) >= 0 ? '#059669' : '#dc2626'}; font-weight: 700; font-size: 18px;">${(Number(actualProgress) - Number(scheduleProgress)).toFixed(1)}%</td>
              </tr>
              <tr>
                <td style="padding: 15px; font-weight: 600; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151;">Status</td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: ${Number(actualProgress) - Number(scheduleProgress) >= 0 ? '#059669' : '#dc2626'}; font-weight: 600; font-size: 12px;">
                  ${Number(actualProgress) - Number(scheduleProgress) > 0 ? 'Lebih Cepat dari Rencana' : Number(actualProgress) - Number(scheduleProgress) < 0 ? 'Tertinggal dari Rencana' : 'Sesuai Rencana'}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div style="background: rgba(0, 105, 44, 1); padding: 12px 20px; margin-bottom: 15px; border-radius: 0;">
          <h2 style="margin: 0; font-size: 14px; font-weight: bold; color: white; letter-spacing: 0.3px;">DATA KURVA S</h2>
        </div>

        <div style="max-height: 350px; overflow-y: auto; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: white;">
            <thead style="position: sticky; top: 0; z-index: 10;">
              <tr style="background: rgba(0, 105, 44, 1); color: white;">
                <th style="padding: 12px; text-align: center; border: 1px solid rgba(0, 89, 37, 1); font-weight: 600;">Minggu</th>
                <th style="padding: 12px; text-align: center; border: 1px solid rgba(0, 89, 37, 1); font-weight: 600;">Rencana</th>
                <th style="padding: 12px; text-align: center; border: 1px solid rgba(0, 89, 37, 1); font-weight: 600;">Aktual</th>
              </tr>
            </thead>
            <tbody>
              ${kurvaData.map((row, index) => `
                <tr style="background: ${index % 2 === 0 ? '#f9fafb' : 'white'};">
                  <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">${row.minggu}</td>
                  <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb; color: rgba(0, 191, 80, 1); font-weight: 600;">${row.rencana.toFixed(2)}</td>
                  <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb; color: rgba(0, 191, 80, 1); font-weight: 600;">${row.aktual.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="text-align: center; color: #6b7280; font-size: 10px; margin-top: 25px; padding: 15px 0; border-top: 2px solid #e5e7eb;">
          <strong>Dicetak pada:</strong> ${new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })} | <strong>Sistem Monitoring Proyek</strong>
        </div>
      `;

      const opt = {
        margin: 8,
        filename: `Kurva_S_${selectedProject.schedule.rab?.proyek.nama}_${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };

      await html2pdf().set(opt as any).from(element).save();

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user || user.role != "admin-direksi") {
    return <Navigate to="/" replace />
  }

  return (
    <div>
      <Navbar />

      {showTender && (
        <div className="fixed inset-0 h-screen flex justify-center items-center bg-black/20 z-20">
          <div className="bg-white p-4 rounded-lg flex flex-col max-w-[90vw] max-h-[70vh] gap-4 relative">
            <div className="absolute top-4 right-4 cursor-pointer text-primary" onClick={() => setShowTender(false)}>
              <X />
            </div>
            <TableHeader
              title="Data Tender Dari Realisasi"
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
                data={tenderDataFilter}
                isSelect={false}
                showEdit={false}
                showPreview={false}
                showSelect={true}
                idKey="id"
                onSelectedDataChange={(item) => {
                  setSelectedProject(item as any)
                  setShowTender(false)
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="top-0 z-10 bg-white border-b border-gray-200 pt-24" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-poppins-bold text-3xl text-gray-900 mb-2">Project Kurva S</h1>
              <p className="font-poppins-regular text-gray-500 text-sm">Monitor dan analisis progres proyek secara real-time</p>
            </div>
            <div className="flex items-center gap-4">
              {selectedProject && (
                <button
                  onClick={exportToPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-poppins-semibold text-sm hover:bg-primary/90 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Membuat PDF...' : 'Export PDF'}
                </button>
              )}
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          <div className="w-full gap-6 font-poppins-regular">
            <ShowTableForm tenderCode={selectedProject?.schedule?.rab?.proyek?.nama} onClick={() => {
              setShowTender(true);
              setSelectedProject(null);
            }} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8" data-aos="fade-up" data-aos-duration="1000">
        {selectedProject && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-md p-4 border border-primary/30 hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  <p className="font-poppins-medium text-gray-600 text-xs uppercase tracking-wider">Program Kegiatan</p>
                </div>
                <p className="font-poppins-semibold text-gray-900 text-sm leading-relaxed">{selectedProject.schedule.rab?.program}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 border border-blue-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                  <p className="font-poppins-medium text-gray-600 text-xs uppercase tracking-wider">Kegiatan</p>
                </div>
                <p className="font-poppins-semibold text-gray-900 text-sm leading-relaxed">{selectedProject.schedule.rab?.proyek.nama}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 border border-cyan-200 hover:shadow-lg hover:border-cyan-300 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  <p className="font-poppins-medium text-gray-600 text-xs uppercase tracking-wider">Tanggal Mulai</p>
                </div>
                <p className="font-poppins-semibold text-gray-900 text-sm">
                  {FormatDate(String(selectedProject.schedule?.tanggal_mulai))}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 border border-purple-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <p className="font-poppins-medium text-gray-600 text-xs uppercase tracking-wider">Tanggal Selesai</p>
                </div>
                <p className="font-poppins-semibold text-gray-900 text-sm">
                  {FormatDate(String(selectedProject.schedule.tanggal_akhir))}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-md p-5 border border-yellow-200 hover:shadow-lg hover:border-yellow-300 transition-all duration-300">
                <p className="font-poppins-bold text-gray-700 text-xs uppercase tracking-wider mb-4">Sisa Minggu</p>
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-poppins-bold text-2xl border border-yellow-300">
                    {RemainingWeeks(String(selectedProject?.schedule?.tanggal_mulai), String(selectedProject?.schedule?.tanggal_akhir))}
                  </div>
                  <p className="font-poppins-medium text-xs text-yellow-600">Minggu tersisa</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-5 border border-hover hover:shadow-lg transition-all duration-300">
                <p className="font-poppins-bold text-gray-700 text-xs uppercase tracking-wider mb-4">Progress Perencanaan</p>
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center px-4 py-2 bg-hover/20 text-secondary rounded-lg font-poppins-bold text-2xl border border-third">
                    {scheduleProgress}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-third rounded-full transition-all duration-700 shadow-lg"
                      style={{ width: `${scheduleProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-5 border border-blue-200 hover:shadow-lg transition-all duration-300">
                <p className="font-poppins-bold text-gray-700 text-xs uppercase tracking-wider mb-4">Progress Aktual</p>
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-poppins-bold text-2xl border border-blue-300">
                    {actualProgress}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-700 shadow-lg"
                      style={{ width: `${actualProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className={`bg-white rounded-xl shadow-md p-5 border transition-all duration-300 hover:shadow-lg ${Number(actualProgress) - Number(scheduleProgress) >= 0 ? 'border-emerald-200' : 'border-red-200'}`}>
                <p className="font-poppins-bold text-gray-700 text-xs uppercase tracking-wider mb-4">Deviasi</p>
                <div className="space-y-3">
                  <div className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-poppins-bold text-2xl border ${Number(actualProgress) - Number(scheduleProgress) >= 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
                    {(Number(actualProgress) - Number(scheduleProgress)).toFixed(2)}%
                  </div>
                  <p className={`font-poppins-medium text-xs ${Number(actualProgress) - Number(scheduleProgress) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {Number(actualProgress) - Number(scheduleProgress) > 0 ? '✓ Lebih cepat dari rencana' : Number(actualProgress) - Number(scheduleProgress) < 0 ? '✗ Tertinggal dari rencana' : '= Sesuai rencana'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <h2 className="font-poppins-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                Kurva S - Perbandingan Rencana vs Aktual
              </h2>
              <div className="w-full overflow-x-auto">
                <div className="min-w-150">
                  <Line
                    ref={chartRef}
                    data={{
                      labels: kurvaData.map(d => `Minggu ke-${d.minggu}`),
                      datasets: [
                        {
                          label: 'Rencana',
                          data: kurvaData.map(d => ConvertToPercent(d.rencana, RemainingProgress(scheduleAggreateWeeks))),
                          borderColor: '#f60',
                          backgroundColor: 'rgba(255, 102, 0, 0.05)',
                          borderWidth: 3,
                          pointRadius: 5,
                          pointBackgroundColor: '#f60',
                          pointBorderColor: '#fff',
                          pointBorderWidth: 2,
                          pointHoverRadius: 7,
                          tension: 0.4,
                          fill: false,
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                return `${context.dataset.label}: ${context.parsed.y}%`;
                              }
                            }
                          }

                        },
                        {
                          label: 'Aktual',
                          data: kurvaData.map(d => ConvertToPercent(d.aktual, RemainingProgress(scheduleAggreateWeeks))),
                          borderColor: '#3b82f6',
                          backgroundColor: 'rgba(59, 130, 246, 0.05)',
                          borderWidth: 3,
                          pointRadius: 5,
                          pointBackgroundColor: '#3b82f6',
                          pointBorderColor: '#fff',
                          pointBorderWidth: 2,
                          pointHoverRadius: 7,
                          tension: 0.4,
                          fill: false,
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                return `${context.dataset.label}: ${context.parsed.y}%`;
                              }
                            }
                          }

                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          labels: {
                            font: { family: 'poppins-regular', size: 13 },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                          }
                        },
                        tooltip: {
                          backgroundColor: '#fff',
                          borderColor: '#f60',
                          borderWidth: 2,
                          titleFont: { family: 'poppins-semibold', size: 13 },
                          bodyFont: { family: 'poppins-regular', size: 12 },
                          padding: 12,
                          displayColors: true,
                          cornerRadius: 10,
                          titleColor: '#111827',
                          bodyColor: '#111827'
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            font: { family: 'poppins-regular', size: 12 },
                            color: '#9ca3af'
                          },
                          grid: {
                            color: '#e5e7eb'
                          }
                        },
                        x: {
                          ticks: {
                            font: { family: 'poppins-regular', size: 12 },
                            color: '#9ca3af'
                          },
                          grid: {
                            display: false
                          }
                        }
                      }
                    }}
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedProject && (
          <div className="bg-white rounded-xl shadow-xl p-16 text-center border-2 border-dashed border-primary/20">
            <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <p className="font-poppins-bold text-gray-900 text-xl mb-2">Silahkan Cari Project</p>
            <p className="font-poppins-regular text-gray-500 text-base">Masukkan Kode Tender untuk melihat detail analisis Kurva S</p>
          </div>
        )}
      </div>
    </div>
  );
}