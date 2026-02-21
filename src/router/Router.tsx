import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "../pages/auth/Login"
import Dashboard from "../pages/Dashboard"
import PPKRencanaAnggaran from "../pages/ppk/PPKRencanaAnggaran"
import PPKRencanaAnggaranAdd from "../pages/ppk/add/PPKRencanaAnggaranAdd"
import PPKJadwalPelaksanaan from "../pages/ppk/PPKJadwalPelaksanaan"
import PPKJadwalPelaksanaanAdd from "../pages/ppk/add/PPKJadwalPelaksanaanAdd"
import PokjaLaporanPenjabatPengadaan from "../pages/pokja/PokjaLaporanPenjabatPengadaan"
import PokjaLaporanPenjabatPengadaanAdd from "../pages/pokja/add/PokjaLaporanPenjabatPengadaanAdd"  
import KepalaRencanaAnggaran from "../pages/kepala/laporan/KepalaRencanaAnggaran"
import PokjaHasilKelompokKerja from "../pages/pokja/PokjaHasilKelompokKerja"
import PokjaHasilPenjabatPengadaan from "../pages/pokja/PokjaHasilPenjabatPengadaan"
import KepalaHasilPenjabatPengadaan from "../pages/kepala/hasil/KepalaHasilPenjabatPengadaan"
import KepalaHasilKelompokKerja from "../pages/kepala/hasil/KepalaHasilKelompokKerja"
import EditProfile from "../pages/EditProfile"
import PokjaLaporanPenjabatPengadaanUpdateView from "../pages/pokja/edit/PokjaLaporanPenjabatPengadaanUpdateView"
import PokjaLaporanKelompok from "../pages/pokja/PokjaLaporankelompok"
import PokjaLaporanKelompokAdd from "../pages/pokja/add/PokjaLaporanKelompokAdd"
import PokjaLaporanKelompokUpdateView from "../pages/pokja/edit/PokjaLaporanKelompokUpdateView"
import PPKRencanaAnggaranUpdateView from "../pages/ppk/edit/PPKRencanaAnggaranUpdateView"
import PPKJadwalPelaksanaanUpdateView from "../pages/ppk/edit/PPKJadwalPelaksanaanUpdateView"
import PPKRealisasiAdd from "../pages/ppk/add/PPKRealisasiAdd"
import PPKRealisasi from "../pages/ppk/PPKRealisasi"
import PPKRealisasiUpdateView from "../pages/ppk/edit/PPKRealisasiUpdateView"
import ProjectKurvaS from "../pages/ppk/ProjectKurvaS"
import KepalaRencanaAnggaranView from "../pages/kepala/laporan/show/KepalaRencanaAnggaranView"
import KepalaJadwalPelaksanaan from "../pages/kepala/laporan/KepalaJadwalPelaksanaan"
import KepalaRealisasi from "../pages/kepala/laporan/KepalaRealisasi"
import KepalaRealisasiView from "../pages/kepala/laporan/show/KepalaRealisasiView"
import KepalaProjectKurvaS from "../pages/kepala/laporan/KepalaProjectKurvaS"
import KepalaJadwalPelaksanaanView from "../pages/kepala/laporan/show/KepalaJadwalPelaksanaanView"
import NotFound from "../pages/NotFound"
import ForgotPassword from "../pages/auth/ForgotPassword"
import ResetPassword from "../pages/auth/ResetPassword"
import SuperAdminManajemenPengguna from "../pages/superadmin/SuperAdminManajemenPengguna"
import SuperAdminKelompokKerja from "../pages/superadmin/SuperAdminKelompokKerja"
import MasyarakatHistory from "../pages/masyarakat/MasyarakatHistory"
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

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All User */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/ubah-profile" element={<EditProfile/>}/>
        <Route path="*" element={<NotFound/>}/>

        {/* Auth */}
        <Route path="/masuk" element={<Login/>} />
        <Route path="/lupa-kata-sandi" element={<ForgotPassword/>} />
        <Route path="/reset-kata-sandi" element={<ResetPassword />} />

        {/* Masyarakat */}
        <Route path="/masyarakat/riwayat-laporan" element={<MasyarakatHistory/>}/>

        {/* PPK */}
        <Route path="/ppk/rencana-anggaran" element={<PPKRencanaAnggaran/>}/>
        <Route path="/ppk/rencana-anggaran/tambah" element={<PPKRencanaAnggaranAdd/>}/>
        <Route path="/ppk/rencana-anggaran/ubah/:id" element={<PPKRencanaAnggaranUpdateView/>}/>
        <Route path="/ppk/rencana-anggaran/lihat/:id" element={<PPKRencanaAnggaranUpdateView/>}/>

        <Route path="/ppk/jadwal-pelaksanaan" element={<PPKJadwalPelaksanaan/>}/>
        <Route path="/ppk/jadwal-pelaksanaan/tambah" element={<PPKJadwalPelaksanaanAdd/>}/>
        <Route path="/ppk/jadwal-pelaksanaan/lihat/:id" element={<PPKJadwalPelaksanaanUpdateView/>}/>
        <Route path="/ppk/jadwal-pelaksanaan/ubah/:id" element={<PPKJadwalPelaksanaanUpdateView/>}/>

        <Route path="/ppk/realisasi-pekerjaan" element={<PPKRealisasi/>}/>
        <Route path="/ppk/realisasi-pekerjaan/tambah" element={<PPKRealisasiAdd/>}/>
        <Route path="/ppk/realisasi-pekerjaan/ubah/:id" element={<PPKRealisasiUpdateView/>}/>
        <Route path="/ppk/realisasi-pekerjaan/lihat/:id" element={<PPKRealisasiUpdateView/>}/>

        <Route path="/ppk/project-kurva-s" element={<ProjectKurvaS/>}/>

        {/* Pokja */}
        <Route path="/pokja/data-entry-penjabat-pengadaan" element={<PokjaLaporanPenjabatPengadaan/>}/>
        <Route path="/pokja/data-entry-penjabat-pengadaan/tambah" element={<PokjaLaporanPenjabatPengadaanAdd/>}/>
        <Route path="/pokja/data-entry-penjabat-pengadaan/ubah/:id" element={<PokjaLaporanPenjabatPengadaanUpdateView/>}/>
        <Route path="/pokja/data-entry-penjabat-pengadaan/lihat/:id" element={<PokjaLaporanPenjabatPengadaanUpdateView/>}/>

        <Route path="/pokja/data-entry-kelompok-kerja" element={<PokjaLaporanKelompok/>}/>
        <Route path="/pokja/data-entry-kelompok-kerja/tambah" element={<PokjaLaporanKelompokAdd/>}/>
        <Route path="/pokja/data-entry-kelompok-kerja/ubah/:id" element={<PokjaLaporanKelompokUpdateView/>}/>
        <Route path="/pokja/data-entry-kelompok-kerja/lihat/:id" element={<PokjaLaporanKelompokUpdateView/>}/>

        <Route path="/pokja/penjabat-pengadaan" element={<PokjaHasilPenjabatPengadaan/>}/>
        <Route path="/pokja/kelompok-kerja" element={<PokjaHasilKelompokKerja/>}/>

        {/* Kepala Biro & Kepala Biro */}
        <Route path="/kepala/rencana-anggaran" element={<KepalaRencanaAnggaran/>}/>
        <Route path="/kepala/rencana-anggaran/lihat/:id" element={<KepalaRencanaAnggaranView/>}/>

        <Route path="/kepala/jadwal-pelaksanaan" element={<KepalaJadwalPelaksanaan/>}/>
        <Route path="/kepala/jadwal-pelaksanaan/lihat/:id" element={<KepalaJadwalPelaksanaanView/>}/>

        <Route path="/kepala/realisasi-pekerjaan" element={<KepalaRealisasi/>}/>
        <Route path="/kepala/realisasi-pekerjaan/lihat/:id" element={<KepalaRealisasiView/>}/>

        <Route path="/kepala/penjabat-pengadaan" element={<KepalaHasilPenjabatPengadaan/>}/>
        <Route path="/kepala/kelompok-kerja" element={<KepalaHasilKelompokKerja/>}/>

        <Route path="/kepala/project-kurva-s" element={<KepalaProjectKurvaS/>}/>

        {/* Super Admin */}
        <Route path="/superadmin/manajemen-pengguna" element={<SuperAdminManajemenPengguna/>}/>        
        <Route path="/superadmin/kelompok-kerja" element={<SuperAdminKelompokKerja/>}/>

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
      </Routes>
    </BrowserRouter>
  )
}
