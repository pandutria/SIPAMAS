import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "../pages/auth/Login"
import Dashboard from "../pages/Dashboard"
import EditProfile from "../pages/EditProfile"
import NotFound from "../pages/NotFound"
import ForgotPassword from "../pages/auth/ForgotPassword"
import ResetPassword from "../pages/auth/ResetPassword"
import SuperAdminManajemenPengguna from "../pages/superadmin/SuperAdminManajemenPengguna"
import AdminDireksiIndentitasProyek from "../pages/admin-direksi/AdminDireksiIndentitasProyek"
import AdminDireksiIdentitasProyekAdd from "../pages/admin-direksi/add/AdminDireksiIdentitasProyekAdd"
import AdminDireksiIdentitasProyekUpdateView from "../pages/admin-direksi/edit/AdminDireksiIdentitasProyekUpdateView"
import AdminDireksiRencanaAnggaran from "../pages/admin-direksi/AdminDireksiRencanaAnggaran"
import AdminDireksiRencanaAnggaranAdd from "../pages/admin-direksi/add/AdminDireksiRencanaAnggaranAdd"
import AdminDireksiRencanaAnggaranUpdateView from "../pages/admin-direksi/edit/AdminDireksiRencanaAnggaranUpdateView"
import AdminDireksiJadwalPelaksanaan from "../pages/admin-direksi/AdminDireksiJadwalPelaksanaan"
import AdminDireksiJadwalPelaksanaanAdd from "../pages/admin-direksi/add/AdminDireksiJadwalPelaksanaanAdd"
import AdminDireksiJadwalPelaksanaanUpdateView from "../pages/admin-direksi/edit/AdminDireksiJadwalPelaksanaanUpdateView"
import AdminDireksiRealisasi from "../pages/admin-direksi/AdminDireksiRealisasi"
import AdminDireksiRealisasiAdd from "../pages/admin-direksi/add/AdminDireksiRealisasiAdd"
import AdminDireksiRealisasiUpdateView from "../pages/admin-direksi/edit/AdminDireksiRealisasiUpdateView"
import AdminDireksiProjectKurvaS from "../pages/admin-direksi/AdminDireksiProjectKurvaS"
import AdminDireksiDokumentasi from "../pages/admin-direksi/AdminDireksiDokumentasi"
import AdminDireksiDokumentasiUpdateView from "../pages/admin-direksi/edit/AdminDireksiDokumentasiUpdateView"
import AdminDireksiEvaluasi from "../pages/admin-direksi/AdminDireksiEvaluasi"
import AdminDireksiEvaluasiUpdateView from "../pages/admin-direksi/edit/AdminDireksiEvaluasiUpdateView"
import AdminPPKIndentitasProyek from "../pages/admin-ppk/AdminPPKIndentitasProyek"
import AdminPPKIdentitasProyekUpdateView from "../pages/admin-ppk/edit/AdminPPKIdentitasProyekUpdateView"
import AdminPPKRencanaAnggaran from "../pages/admin-ppk/AdminPPKRencanaAnggaran"
import AdminPPKRencanaAnggaranUpdateView from "../pages/admin-ppk/edit/AdminPPKRencanaAnggaranUpdateView"
import AdminPPKJadwalPelaksanaan from "../pages/admin-ppk/AdminPPKJadwalPelaksanaan"
import AdminPPKJadwalPelaksanaanUpdateView from "../pages/admin-ppk/edit/AdminPPKJadwalPelaksanaanUpdateView"
import AdminPPKRealisasi from "../pages/admin-ppk/AdminPPKRealisasi"
import AdminPPKRealisasiUpdateView from "../pages/admin-ppk/edit/AdminPPKRealisasiUpdateView"
import AdminPPKProjectKurvaS from "../pages/admin-ppk/AdminPPKProjectKurvaS"
import AdminPPKDokumentasi from "../pages/admin-ppk/AdminPPKDokumentasi"
import AdminPPKDokumentasiUpdateView from "../pages/admin-ppk/edit/AdminPPKDokumentasiUpdateView"
import AdminPPKEvaluasi from "../pages/admin-ppk/AdminPPKEvaluasi"
import AdminPPKEvaluasiUpdateView from "../pages/admin-ppk/edit/AdminPPKEvaluasiUpdateView"
import MasyarakatLaporanBaru from "../pages/masyarakat/MasyarakatLaporanBaru"
import MasyarakatLaporanDetail from "../pages/masyarakat/MasyarakatLaporanDetail"
import MasyarakatRiwayatLaporan from "../pages/masyarakat/MasyarakatRiwayatLaporan"
import SuperAdminManajemenLaporan from "../pages/superadmin/SuperAdminManajemenLaporan"
import LokasiProyek from "../pages/LokasiProyek"
import Register from "../pages/auth/Register"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All User */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/lokasi-proyek" element={<LokasiProyek />} />
        <Route path="/ubah-profile" element={<EditProfile/>}/>
        <Route path="*" element={<NotFound/>}/>

        {/* Auth */}
        <Route path="/masuk" element={<Login/>} />
        <Route path="/daftar" element={<Register/>} />
        <Route path="/lupa-kata-sandi" element={<ForgotPassword/>} />
        <Route path="/reset-kata-sandi" element={<ResetPassword />} />

        {/* Masyarakat */}
        <Route path="/masyarakat/laporan-baru" element={<MasyarakatLaporanBaru/>}/>
        <Route path="/masyarakat/laporan/detail/:id" element={<MasyarakatLaporanDetail/>}/>
        <Route path="/masyarakat/riwayat-laporan" element={<MasyarakatRiwayatLaporan/>}/>

        {/* Super Admin */}
        <Route path="/superadmin/manajemen-pengguna" element={<SuperAdminManajemenPengguna/>}/> 
        <Route path="/superadmin/manajemen-laporan" element={<SuperAdminManajemenLaporan/>}/> 

        {/* Admin Direksi */}
        <Route path="/admin-direksi/identitas-proyek" element={<AdminDireksiIndentitasProyek/>}/>
        <Route path="/admin-direksi/identitas-proyek/tambah" element={<AdminDireksiIdentitasProyekAdd/>}/>
        <Route path="/admin-direksi/identitas-proyek/ubah/:id" element={<AdminDireksiIdentitasProyekUpdateView/>}/>
        <Route path="/admin-direksi/identitas-proyek/lihat/:id" element={<AdminDireksiIdentitasProyekUpdateView/>}/>

        <Route path="/admin-direksi/rencana-anggaran" element={<AdminDireksiRencanaAnggaran/>}/>
        <Route path="/admin-direksi/rencana-anggaran/tambah" element={<AdminDireksiRencanaAnggaranAdd/>}/>
        <Route path="/admin-direksi/rencana-anggaran/ubah/:id" element={<AdminDireksiRencanaAnggaranUpdateView/>}/>
        <Route path="/admin-direksi/rencana-anggaran/lihat/:id" element={<AdminDireksiRencanaAnggaranUpdateView/>}/>

        <Route path="/admin-direksi/jadwal-pelaksanaan" element={<AdminDireksiJadwalPelaksanaan/>}/>
        <Route path="/admin-direksi/jadwal-pelaksanaan/tambah" element={<AdminDireksiJadwalPelaksanaanAdd/>}/>
        <Route path="/admin-direksi/jadwal-pelaksanaan/ubah/:id" element={<AdminDireksiJadwalPelaksanaanUpdateView/>}/>
        <Route path="/admin-direksi/jadwal-pelaksanaan/lihat/:id" element={<AdminDireksiJadwalPelaksanaanUpdateView/>}/>

        <Route path="/admin-direksi/realisasi-pekerjaan" element={<AdminDireksiRealisasi/>} />
        <Route path="/admin-direksi/realisasi-pekerjaan/tambah" element={<AdminDireksiRealisasiAdd/>} />
        <Route path="/admin-direksi/realisasi-pekerjaan/ubah/:id" element={<AdminDireksiRealisasiUpdateView/>} />
        <Route path="/admin-direksi/realisasi-pekerjaan/lihat/:id" element={<AdminDireksiRealisasiUpdateView/>} />

        <Route path="/admin-direksi/project-kurva-s" element={<AdminDireksiProjectKurvaS/>}/>
        <Route path="/admin-direksi/dokumentasi" element={<AdminDireksiDokumentasi/>}/>
        <Route path="/admin-direksi/dokumentasi/lihat/:id" element={<AdminDireksiDokumentasiUpdateView/>}/>

        <Route path="/admin-direksi/evaluasi" element={<AdminDireksiEvaluasi/>}/>
        <Route path="/admin-direksi/evaluasi/lihat/:id" element={<AdminDireksiEvaluasiUpdateView/>}/>

        {/* Admin PPK */}
        <Route path="/admin-ppk/identitas-proyek" element={<AdminPPKIndentitasProyek/>}/>
        <Route path="/admin-ppk/identitas-proyek/lihat/:id" element={<AdminPPKIdentitasProyekUpdateView/>}/>

        <Route path="/admin-ppk/rencana-anggaran" element={<AdminPPKRencanaAnggaran/>}/>
        <Route path="/admin-ppk/rencana-anggaran/lihat/:id" element={<AdminPPKRencanaAnggaranUpdateView/>}/>

        <Route path="/admin-ppk/jadwal-pelaksanaan" element={<AdminPPKJadwalPelaksanaan/>}/>
        <Route path="/admin-ppk/jadwal-pelaksanaan/lihat/:id" element={<AdminPPKJadwalPelaksanaanUpdateView/>}/>

        <Route path="/admin-ppk/realisasi-pekerjaan" element={<AdminPPKRealisasi/>}/>
        <Route path="/admin-ppk/realisasi-pekerjaan/lihat/:id" element={<AdminPPKRealisasiUpdateView/>}/>

        <Route path="/admin-ppk/project-kurva-s" element={<AdminPPKProjectKurvaS/>}/>
        <Route path="/admin-ppk/dokumentasi" element={<AdminPPKDokumentasi/>}/>
        <Route path="/admin-ppk/dokumentasi/lihat/:id" element={<AdminPPKDokumentasiUpdateView/>}/>

        <Route path="/admin-ppk/evaluasi" element={<AdminPPKEvaluasi/>}/>
        <Route path="/admin-ppk/evaluasi/lihat/:id" element={<AdminPPKEvaluasiUpdateView/>}/>
      </Routes>
    </BrowserRouter>
  )
}
