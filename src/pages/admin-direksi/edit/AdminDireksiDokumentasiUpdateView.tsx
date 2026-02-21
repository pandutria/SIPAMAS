/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { Plus, Trash } from "lucide-react";
import { BASE_URL_FILE } from "../../../server/API";
import useProjectIdentity from "../../../hooks/ProjectIdentity";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../../ui/LoadingSpinner";
import useRealisasiHooks from "../../../hooks/RealisasiHooks";
import BackButton from "../../../ui/BackButton";
import AdminDireksiTambahDokumentasiModal from "../modal/AdminDireksiTambahDokumentasiModal";

type PhotoType = "start" | "progres" | "end";

export default function AdminDireksiDokumentasiUpdateView() {
  const [showModalPhoto, setShowModalPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoType>("start");
  const [photoData, setPhotoData] = useState<Record<PhotoType, any[]>>({
    start: [],
    progres: [],
    end: []
  });
  const {
    projectIdentityByIdData,
    handleProjectIdentityPhotoDelete,
    setSelectedProjectIdentityId
  } = useProjectIdentity();
  const { realisasiData } = useRealisasiHooks();
  const { loading, user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const fetchShow = () => {
      if (showModalPhoto) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = "auto";
      }

      if (id) {
        setSelectedProjectIdentityId(Number(id));
      }

      if (projectIdentityByIdData) {
        const photoStartFilter = projectIdentityByIdData.photos.filter((item) => item.type == "start");
        const photoEndFilter = projectIdentityByIdData.photos.filter((item) => item.type == "end");

        const allDetails = realisasiData
          .filter((item) => Number(item.schedule.rab?.proyek.id) == Number(id))
          .flatMap((item) => item.details);

        const byMinggu: Record<number, any> = {};
        allDetails.forEach((detail) => {
          const m = detail.minggu_nomor;
          if (!byMinggu[m] || Number(detail.alasan_count) > Number(byMinggu[m].alasan_count)) {
            byMinggu[m] = detail;
          }
        });

        const photoProgresFilter = Object.values(byMinggu).sort(
          (a, b) => a.minggu_nomor - b.minggu_nomor
        );

        setPhotoData({
          start: photoStartFilter,
          progres: photoProgresFilter,
          end: photoEndFilter
        });
      }
    }

    fetchShow();
  }, [showModalPhoto, projectIdentityByIdData, id, setSelectedProjectIdentityId, realisasiData]);

  if (loading || !projectIdentityByIdData) {
    return <LoadingSpinner />
  }

  if (!user || user.role != "admin-direksi") {
    return <Navigate to="/" replace />
  }

  return (
    <div>
      <Navbar />

      {showModalPhoto && (
        <AdminDireksiTambahDokumentasiModal
          setShowModal={setShowModalPhoto}
          type={selectedPhoto}
          setPhotoData={setPhotoData}
          isEdit={true}
        />
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 lg:pt-24 pt-26" data-aos="fade-up" data-aos-duration="1000">
        <BackButton type="custom" link="/admin-direksi/dokumentasi" />
        <h1 className="font-poppins-bold text-2xl mt-8 text-gray-800 mb-6">
          Dokumentasi Lapangan
        </h1>

        <div className="font-poppins-regular bg-white border-2 border-gray-200 rounded-md p-4 pb-10 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedPhoto("start")}
                className={`font-poppins-semibold duration-200 flex-1 sm:flex-none ${selectedPhoto == "start" ? "text-white bg-linear-to-r from-primary to-secondary" : "text-primary border-2 border-primary"} py-2.5 px-3 sm:py-3 sm:px-4 cursor-pointer rounded-md text-[13px] sm:text-[14px]`}
              >
                Foto Lokasi Awal
              </button>
              <button
                onClick={() => setSelectedPhoto("progres")}
                className={`font-poppins-semibold duration-200 flex-1 sm:flex-none ${selectedPhoto == "progres" ? "text-white bg-linear-to-r from-primary to-secondary" : "text-primary border-2 border-primary"} py-2.5 px-3 sm:py-3 sm:px-4 cursor-pointer rounded-md text-[13px] sm:text-[14px]`}
              >
                Foto Progres Berkala
              </button>
              <button
                onClick={() => setSelectedPhoto("end")}
                className={`font-poppins-semibold duration-200 flex-1 sm:flex-none ${selectedPhoto == "end" ? "text-white bg-linear-to-r from-primary to-secondary" : "text-primary border-2 border-primary"} py-2.5 px-3 sm:py-3 sm:px-4 cursor-pointer rounded-md text-[13px] sm:text-[14px]`}
              >
                Foto Lokasi Akhir
              </button>
            </div>

            {selectedPhoto !== "progres" && (
              <button
                onClick={() => setShowModalPhoto(true)}
                className='font-poppins-semibold w-full sm:w-fit text-white bg-linear-to-r from-primary to-secondary py-2.5 sm:py-3 px-4 cursor-pointer hover:scale-95 duration-300 hover:opacity-95 rounded-md text-[13px] sm:text-[14px] flex justify-center items-center gap-2'
              >
                <Plus size={18} />
                Tambahkan Sekarang
              </button>
            )}
          </div>

          {photoData[selectedPhoto].length > 0 ? (
            <div className="flex items-start gap-4 overflow-x-auto scrollbar-hidden py-4">
              {selectedPhoto === "progres" ? (
                photoData.progres.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col shrink-0 gap-3 rounded-lg border-2 border-gray-200 w-56 sm:w-70 overflow-hidden"
                  >
                    <img
                      src={item.bukti_file ? `${BASE_URL_FILE}/${item.bukti_file}` : item.bukti_file}
                      className="w-full object-cover h-36 sm:h-40"
                    />
                    <p className="mx-3 mb-3 text-[13px] sm:text-[14px] font-poppins-semibold text-black">
                      Minggu {item.minggu_nomor}
                    </p>
                  </div>
                ))
              ) : (
                photoData[selectedPhoto].map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex relative flex-col shrink-0 gap-3 rounded-lg border-2 border-gray-200 w-56 sm:w-70"
                  >
                    <Trash onClick={() => handleProjectIdentityPhotoDelete(item.id)} className="absolute text-white bg-red-600 p-2 rounded-full w-8 h-8 cursor-pointer -top-4 -right-4 hover:bg-white hover:text-red-600 duration-200 hover:border-red-600 hover:border-2" />
                    <img
                      src={item.photo_file ? `${BASE_URL_FILE}/${item.photo_file}` : item.photo_file}
                      className="w-full object-cover rounded-t-lg h-36 sm:h-40"
                    />
                    <p className="mx-3 mb-3 text-[13px] sm:text-[14px] font-poppins-medium line-clamp-2">
                      {item.title}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <p className="text-center font-poppins-medium text-[14px] sm:text-[16px] text-gray-400 py-6">
              Belum ada data yang diunggah
            </p>
          )}
        </div>
      </div>
    </div>
  )
}