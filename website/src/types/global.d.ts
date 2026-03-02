export { };

declare global {
  export interface UserProps {
    id: number;
    fullname: string;
    email: string;
    nik: string;
    phone_number: string;
    address: string;
    password: string;
    profile_photo: string;
    nip: string;
    sk_number: string;
    sk_file: string;
    ktp_file: string;
    role: string;
    is_active: string;
    jabatan: string;
  }

  export interface ProjectIdentityProps {
    status: string;
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
    pengaduan: PengaduanProps[];
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
    evaluasi: EvaluasiProps[];
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

  export interface EvaluasiProps {
    id: number;
    realisasi_header_id: number;
    created_by_id: number;
    catatan: string;
    tindakan: string;
    skor: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
  }

  export interface PengaduanProps {
    id: number;
    created_by_id: number;
    identitas_proyek_id: number;
    kategori: string | null;
    judul: string | null;
    deskripsi: string | null;
    alamat: string | null;
    latitude: string | null;
    longitude: string | null;
    catatan: string;
    status: string;
    created_at: string;
    updated_at: string;

    proyek: ProjectIdentityProps;
    created_by?: UserProps | null;
    medias?: PengaduanMediaProps[];
    timelines?: PengaduanTimelineProps[];
    review?: PengaduanReviewProps | null;
  }

  export interface PengaduanMediaProps {
    id: number;
    pengaduan_id: number;
    media_file: string | File;
    media_tipe: string;

    created_at?: string;
    updated_at?: string;
  }

  export interface PengaduanTimelineProps {
    id: number;
    pengaduan_id: number;
    created_by_id: number;
    judul: string | null;
    keterangan: string | null;
    created_at: string;
    updated_at: string;

    created_by?: UserProps | null;
    pengaduan?: PengaduanProps | null;
  }

  export interface PengaduanReviewProps {
    id: number;
    pengaduan_id: number;
    rating: number | null;
    catatan: string | null;
    created_at: string;
    updated_at: string;
  }
}