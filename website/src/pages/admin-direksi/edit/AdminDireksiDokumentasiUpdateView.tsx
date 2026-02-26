/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { Plus, Trash2, ImageOff, Camera, TrendingUp, MapPin } from "lucide-react";
import { BASE_URL_FILE } from "../../../server/API";
import useProjectIdentity from "../../../hooks/ProjectIdentity";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../../ui/LoadingSpinner";
import useRealisasiHooks from "../../../hooks/RealisasiHooks";
import BackButton from "../../../ui/BackButton";
import AdminDireksiTambahDokumentasiModal from "../modal/AdminDireksiTambahDokumentasiModal";
import FormInput from "../../../ui/FormInput";
import ShowTableForm from "../../../ui/ShowTableForm";

type PhotoType = "start" | "progres" | "end";

const tabConfig: Record<PhotoType, { label: string; icon: React.ReactNode; color: string }> = {
  start: {
    label: "Foto Lokasi Awal",
    icon: <MapPin size={15} />,
    color: "from-primary to-secondary",
  },
  progres: {
    label: "Foto Progres Berkala",
    icon: <TrendingUp size={15} />,
    color: "from-primary to-secondary",
  },
  end: {
    label: "Foto Lokasi Akhir",
    icon: <Camera size={15} />,
    color: "from-primary to-secondary",
  },
};

export default function AdminDireksiDokumentasiUpdateView() {
  const [showModalPhoto, setShowModalPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoType>("start");
  const [photoData, setPhotoData] = useState<Record<PhotoType, any[]>>({
    start: [],
    progres: [],
    end: [],
  });
  const {
    projectIdentityByIdData,
    handleProjectIdentityPhotoDelete,
    setSelectedProjectIdentityId,
  } = useProjectIdentity();
  const { realisasiData } = useRealisasiHooks();
  const { loading, user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const fetchShow = () => {
      if (showModalPhoto) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }

      if (id) {
        setSelectedProjectIdentityId(Number(id));
      }

      if (projectIdentityByIdData) {
        const photoStartFilter = projectIdentityByIdData.photos.filter(
          (item) => item.type == "start"
        );
        const photoEndFilter = projectIdentityByIdData.photos.filter(
          (item) => item.type == "end"
        );

        const allDetails = realisasiData
          .filter((item) => Number(item.schedule.rab?.proyek.id) == Number(id))
          .flatMap((item) => item.details);

        const byMinggu: Record<number, any> = {};
        allDetails.forEach((detail) => {
          const m = detail.minggu_nomor;
          if (
            !byMinggu[m] ||
            Number(detail.alasan_count) > Number(byMinggu[m].alasan_count)
          ) {
            byMinggu[m] = detail;
          }
        });

        const photoProgresFilter = Object.values(byMinggu).sort(
          (a, b) => a.minggu_nomor - b.minggu_nomor
        );

        setPhotoData({
          start: photoStartFilter,
          progres: photoProgresFilter,
          end: photoEndFilter,
        });
      }
    };

    fetchShow();
  }, [
    showModalPhoto,
    projectIdentityByIdData,
    id,
    setSelectedProjectIdentityId,
    realisasiData,
  ]);

  if (loading || !projectIdentityByIdData) {
    return <LoadingSpinner />;
  }

  if (!user || user.role != "admin-direksi") {
    return <Navigate to="/" replace />;
  }

  const currentData = photoData[selectedPhoto];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {showModalPhoto && (
        <AdminDireksiTambahDokumentasiModal
          setShowModal={setShowModalPhoto}
          type={selectedPhoto}
          setPhotoData={setPhotoData}
          isEdit={true}
        />
      )}

      <div
        className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <BackButton type="custom" link="/admin-direksi/dokumentasi" />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h1 className="font-poppins-bold text-2xl text-gray-800">
                Dokumentasi Lapangan
              </h1>
            </div>
            <span className="text-xs font-poppins-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {currentData.length} Foto
            </span>
          </div>

          <div className="flex flex-col gap-4 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins-regular">
              <ShowTableForm disabled={true} tenderCode={`TND-0${projectIdentityByIdData?.id}`} onClick={() => false} />

              <FormInput
                title='Nama Proyek'
                placeholder='Masukkan nama proyek (otomatis)'
                value={projectIdentityByIdData?.nama}
                disabled={true}
              />

              <FormInput
                title='Tahun Anggaran'
                placeholder='Masukkan tahun anggaran (otomatis)'
                value={projectIdentityByIdData?.tahun_anggaran}
                disabled={true}
              />

              <FormInput
                title='Kategori Proyek'
                placeholder='Masukkan kategori proyek (otomatis)'
                value={projectIdentityByIdData?.kategori}
                disabled={true}
              />

              <FormInput
                title='Kontraktor Pelaksana'
                placeholder='Masukkan kontrator pelaksana (otomatis)'
                value={projectIdentityByIdData?.kontraktor_pelaksana}
                disabled={true}
              />

              <FormInput
                title='Konsultas Pengawas'
                placeholder='Masukkan konsultas pengawas (otomatis)'
                value={projectIdentityByIdData?.konsultas_pengawas}
                disabled={true}
              />

              <FormInput
                title='Lokasi'
                placeholder='Masukkan lokasi (otomatis)'
                value={projectIdentityByIdData?.kecamatan}
                disabled={true}
              />

              <FormInput
                title='Nilai Kontrak'
                placeholder='Masukkan nilai kontrak (otomatis)'
                value={projectIdentityByIdData?.nilai_kontrak}
                disabled={true}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {(Object.keys(tabConfig) as PhotoType[]).map((tab) => {
                const isActive = selectedPhoto === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedPhoto(tab)}
                    className={`flex items-center gap-2 font-poppins-semibold text-[13px] px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-all duration-300 cursor-pointer ${isActive
                        ? `bg-linear-to-r ${tabConfig[tab].color} text-white shadow-sm`
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
                      }`}
                  >
                    {tabConfig[tab].icon}
                    <span className="hidden sm:inline">{tabConfig[tab].label}</span>
                    <span className="sm:hidden">
                      {tab === "start" ? "Awal" : tab === "progres" ? "Progres" : "Akhir"}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedPhoto !== "progres" && (
              <button
                onClick={() => setShowModalPhoto(true)}
                className="font-poppins-semibold w-full sm:w-fit text-white bg-linear-to-r from-primary to-secondary py-2.5 px-5 cursor-pointer hover:opacity-90 hover:scale-95 duration-300 rounded-xl text-[13px] sm:text-[14px] flex justify-center items-center gap-2 shadow-sm"
              >
                <Plus size={16} />
                Tambahkan Sekarang
              </button>
            )}
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-6"></div>

          {currentData.length > 0 ? (
            <>
              {selectedPhoto === "progres" ? (
                <div className="relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-linear-to-r from-primary/20 via-primary to-primary/20 hidden sm:block"></div>
                  <div className="flex gap-5 overflow-x-auto scrollbar-hidden pb-4">
                    {photoData.progres.map((item: any, index: number) => (
                      <div
                        key={index}
                        data-aos="zoom-in"
                        data-aos-delay={index * 60}
                        data-aos-duration="500"
                        className="flex flex-col shrink-0 w-64 sm:w-80 group"
                      >
                        <div className="relative flex justify-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-poppins-bold text-xs shadow-md z-10 ring-2 ring-white">
                            {item.minggu_nomor}
                          </div>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                          <a
                            href={item.bukti_file ? `${BASE_URL_FILE}/${item.bukti_file}` : item.bukti_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative overflow-hidden h-44 sm:h-52"
                          >
                            <img
                              src={item.bukti_file ? `${BASE_URL_FILE}/${item.bukti_file}` : item.bukti_file}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </a>
                          <div className="bg-white px-4 py-3">
                            <p className="text-[13px] font-poppins-semibold text-primary">
                              Minggu {item.minggu_nomor}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {currentData.map((item: any, index: number) => (
                    <div
                      key={index}
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                      data-aos-duration="500"
                      className="group relative rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <a
                        href={item.photo_file ? `${BASE_URL_FILE}/${item.photo_file}` : item.photo_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative overflow-hidden h-48 sm:h-56"
                      >
                        <img
                          src={item.photo_file ? `${BASE_URL_FILE}/${item.photo_file}` : item.photo_file}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </a>

                      <button
                        onClick={() => handleProjectIdentityPhotoDelete(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="bg-white px-4 py-3">
                        <p className="text-[13px] font-poppins-medium text-gray-700 line-clamp-2 leading-relaxed">
                          {item.title || "Tanpa judul"}
                        </p>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setShowModalPhoto(true)}
                    className="group rounded-xl border-2 border-dashed border-gray-200 hover:border-primary min-h-64 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:bg-green-50 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                      <Plus size={22} className="text-gray-400 group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <p className="text-[13px] font-poppins-medium text-gray-400 group-hover:text-primary transition-colors duration-300">
                      Tambah Foto
                    </p>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-24 gap-4"
              data-aos="fade-up"
              data-aos-duration="600"
            >
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
                <ImageOff size={32} className="text-gray-300" />
              </div>
              <div className="text-center">
                <p className="font-poppins-semibold text-gray-400 text-[15px]">
                  Belum ada foto diunggah
                </p>
                <p className="font-poppins-regular text-gray-300 text-[13px] mt-1">
                  {selectedPhoto === "progres"
                    ? "Data progres akan muncul setelah realisasi diinput"
                    : "Klik tombol di atas untuk menambahkan foto"}
                </p>
              </div>
              {selectedPhoto !== "progres" && (
                <button
                  onClick={() => setShowModalPhoto(true)}
                  className="mt-2 font-poppins-semibold text-white bg-linear-to-r from-primary to-secondary py-2.5 px-6 cursor-pointer hover:opacity-90 duration-300 rounded-xl text-[13px] flex items-center gap-2 shadow-sm"
                >
                  <Plus size={15} />
                  Tambahkan Sekarang
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}