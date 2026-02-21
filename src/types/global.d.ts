export { };

declare global {
  // Data Props
  export interface NonTenderDataProps {
    hps: number;
    jenis_klpd: string;
    jenis_pengadaan: string;
    kd_klpd: string;
    kd_lpse: number;
    kd_nontender: number;
    kd_paket_dce: number | null;
    kd_penyedia: number;
    kd_rup: string;
    kd_satker: string;
    kd_satker_str: string;
    kontrak_pembayaran: string;
    kualifikasi_paket: string;
    lpse_id: number;
    mak: string;
    mtd_pemilihan: string;
    nama_klpd: string;
    nama_lpse: string;
    nama_paket: string;
    nama_penyedia: string;
    nama_satker: string;
    nilai_kontrak: number;
    nilai_negosiasi: number;
    nilai_pdn_kontrak: number;
    nilai_penawaran: number;
    nilai_terkoreksi: number;
    nilai_umk_kontrak: number;
    npwp_16_penyedia: string | null;
    npwp_penyedia: string;
    pagu: number;
    status_nontender: string;
    sumber_dana: string;
    tahun_anggaran: number;
    tgl_penarikan: string | null;
    tgl_pengumuman_nontender: string;
    tgl_selesai_nontender: string;
    url_lpse: string;
  }

  export interface KatalogV5DataProps {
    alamat_satker: string;
    catatan_produk: string;
    deskripsi: string | null;
    email_user_pokja: string;
    harga_satuan: string;
    jabatan_ppk: string;
    jml_jenis_produk: string;
    kd_klpd: string;
    kd_komoditas: string;
    kd_paket: string;
    kd_penyedia: string;
    kd_penyedia_distributor: string;
    kd_produk: string;
    kd_rup: string;
    kd_user_pokja: string;
    kd_user_ppk: string;
    kode_anggaran: string;
    kuantitas: string;
    nama_paket: string;
    nama_satker: string | null;
    nama_sumber_dana: string;
    no_paket: string;
    no_telp_user_pokja: string;
    npwp_satker: string;
    ongkos_kirim: string;
    paket_status_str: string;
    ppk_nip: string;
    satker_id: string;
    status_paket: string;
    tahun_anggaran: string;
    tanggal_buat_paket: string;
    tanggal_edit_paket: string;
    total: string | null;
    total_harga: string;
  }

  export interface KatalogV6DataProps {
    jenis_instansi: string | null;
    jml_jenis_produk: number;
    jml_produk: number;
    kd_klpd: string;
    kd_paket: string;
    kd_penyedia_sikap: number;
    kd_penyedia_v6: string;
    kd_rup: string;
    kd_satker_str: string;
    mak: string;
    nama_instansi: string | null;
    nama_satker: string;
    ongkir: number;
    product_ids: string[] | null;
    rup_nama_pkt: string;
    status_pengiriman: string;
    status_pkt: string;
    sumber_dana: string;
    tahun_anggaran: number;
    tgl_order: string;
    total_harga: number;
  }

  export interface TenderDataProps {
    _event_date: string | null;

    hps: number;
    pagu: number;

    jenis_klpd: string;
    jenis_pengadaan?: string;

    kd_klpd: string;
    kd_lpse: number;

    kd_paket?: number;
    kd_pkt_dce?: number | null;

    kd_rup?: string;
    kd_rup_paket?: string;

    kd_satker: string;
    kd_satker_str?: string;

    kd_tender: number;

    kd_penyedia?: number;

    kontrak_pembayaran?: string;
    kualifikasi_paket?: string;

    list_tahun_anggaran?: string;
    tahun_anggaran: number;

    lokasi_pekerjaan?: string;

    mtd_evaluasi?: string;
    mtd_kualifikasi?: string;
    mtd_pemilihan?: string;

    nama_klpd: string;
    nama_lpse?: string;
    nama_paket?: string;

    nama_penyedia?: string;
    nama_satker: string;

    nama_pokja?: string;
    nama_ppk?: string;

    nip_pokja?: string;
    nip_ppk?: string;

    nilai_kontrak?: number;
    nilai_negosiasi?: number;
    nilai_pdn_kontrak?: number | null;
    nilai_penawaran?: number;
    nilai_terkoreksi?: number;
    nilai_umk_kontrak?: number | null;

    npwp_16_penyedia?: string | null;
    npwp_penyedia?: string | null;

    status_tender?: string;
    sumber_dana?: string;

    tanggal_status?: string;
    tgl_buat_paket?: string;
    tgl_kolektif_kolegial?: string;
    tgl_penetapan_pemenang?: string;
    tgl_pengumuman_tender?: string;

    url_lpse?: string;
    versi_tender?: string;
  }

  // Hooks Props
  export interface RoleProps {
    id: number;
    name: string;
  }

  export interface UserProps {
    id: number;
    email: string
    password: string
    role_id: number
    role: string;

    fullname: string
    is_active?: boolean

    nik?: string
    nip?: string
    group?: string
    address?: string

    phone_number?: string
    opd_organization?: string
    pokja_group_id?: number
    pokja_group: pokjaGroupProps

    sk_number?: string
    pbj_number?: string
    competence_number?: string
    jabatan: string;

    satker_code?: number
    gp_id?: number

    sk_file: string;
    pbj_file: string;
    competence_file: string;
    file_photo: string;
  }

  export interface pokjaGroupProps {
    id: number;
    name: string;
  }

  export interface DataEntryProps {
    efisiensi: number | string;
    presentase: number | string;
    id: number;

    metode_pengadaan: string | null;
    kode_paket: string | null;
    kode_rup: string | null;
    tahun_anggaran: string | null;
    satuan_kerja: string | null;
    nama_paket: string | null;
    tanggal_masuk: string | null;
    sumber_dana: string | null;
    jenis_pengadaan: string | null;

    realisasi_paket: string | null;
    status_paket: string | null;
    status_pengiriman: string | null;

    nilai_pagu: string | null;
    nilai_hps: string | null;

    pendaftar: string;
    pemasukan: string;

    nomor_kontrak: string | null;
    nilai_kontrak: string | null;
    tanggal_kontrak: string | null;
    nama_ppk: string | null;
    jabatan_ppk: string | null;

    nama_pimpinan_perusahaan: string | null;
    jabatan_pimpinan: string | null;

    pemenang: string | null;
    nilai_penawaran: string | null;
    nilai_total: string | null;
    nilai_negosiasi: string | null;
    nomor_telp: string | null;
    email: string | null;
    npwp: string | null;

    alamat_pemenang: string | null;
    lokasi_pekerjaan: string | null;

    bukti_file: string | null;
    catatan: string | null;

    selected_ppk_id: number | null;
    selected_ppk: UserProps | null;
    user?: UserProps | null;

    user_id: number;
    user?: UserProps | null;

    tipe: string;
    updated_at: string;
  }

  export interface ProjectIdentityProps {
    id: number;

    nama: string;
    tahun_anggaran: string;
    kategori?: string;
    provinsi?: string;
    kabupaten?: string;
    kecamatan?: string;
    kecamatan_kode?: string;
    kelurahan?: string;
    latitude?: string;
    longitude?: string;
    nilai_kontrak?: string;
    kontraktor_pelaksana?: string;
    konsultas_pengawas?: string;
    sumber_dana?: string;
    kontrak_file?: string;
    surat_perintah_file?: string;
    surat_penunjukan_file?: string;
    berita_acara_file?: string;
    created_by_id?: number;

    identitas_proyek_group_id: number;
    alasan_count?: number;
    alasan_text?: string;

    created_at: string;
    updated_at: string;
    created_by: UserProps;

    photos: ProjectIdentityPhotoProps[];
    documents: ProjectIdentityDocumentProps[];
  }

  export interface ProjectIdentityPhotoProps {
    id?: number;

    identitas_proyek_id?: number;
    title?: string;
    type?: string;
    photo_file?: string;

    created_at?: string;
    updated_at?: string;
  }

  export interface ProjectIdentityDocumentProps {
    id: number;

    identitas_proyek_id?: number;
    name: string;
    kategori: string;
    photo_file: File | string;

    created_at?: string;
    updated_at?: string;
  }

  export interface RABProps {
    id: number;
    alasan_count: number;
    alasan_text: string;
    program: string;

    identitas_proyek_id: number;
    proyek: ProjectIdentityProps;

    rab_group_id: number;
    details: RABDetailProps[];
    created_at: string;
  }

  export interface RABDetailProps {
    id: number;
    rab_header_id: number;

    rab_header?: RABProps | null;

    keterangan: string;
    volume: number;
    satuan: string;
    harga: number;
    total: number;
  }

  interface ScheduleProps {
    id: number;
    rab_id: number;
    rab?: RABProps;

    alasan_count: number;
    alasan_text?: string | null;

    items: ScheduleItemProps[];
    schedule_group_id: number;

    tanggal_mulai: string;
    tanggal_akhir: string;

    created_by_id: number;
    created_by?: UserProps | null;
    created_at: string;
    updated_at: string;
  }

  interface ScheduleItemProps {
    id: number;

    schedule_header_id: number;
    schedule_header?: ScheduleHeaderProps | null;

    nomor?: string;
    keterangan: string;
    jumlah: number | string;
    bobot: number;

    created_at: string;
    updated_at: string;

    weeks: ScheduleWeekProps[];
  }

  interface ScheduleWeekProps {
    id: number;

    schedule_item_id: number;
    schedule_item?: ScheduleItemProps[] | null;

    minggu_nomor: number;
    nilai: number;
  }

  export interface RealizationProps {
    id: number;
    schedule_header_id: number;
    details: RealizationDetailProps[];
    schedule: ScheduleProps;

    created_by_id: number;
    created_at: string;
  }

  export interface RealizationDetailProps {
    id: number;
    bukti_file: string;
    realisasi_header_id: number;
    nilai: string;
    minggu_nomor: number;

    alasan_text: string;
    alasan_count: number;
    created_at: string;
  }
}
