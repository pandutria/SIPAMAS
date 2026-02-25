package com.example.sipamas_android.data.model

data class Pengaduan(
    val id: Int? = null,
    val identitas_proyek_id: Int? = null,
    val created_by_id: Int? = null,
    val kategori: String? = null,
    val judul: String? = null,
    val deskripsi: String? = null,
    val alamat: String? = null,
    val latitude: String? = null,
    val longitude: String? = null,
    val catatan: String? = null,
    val status: String? = null,
    val created_at: String? = null,
    val updated_at: String? = null,
    val created_by: User? = null,
    val proyek: IdentitasProyek? = null,
    val medias: List<PengaduanMedia>? = null,
    val timelines: List<PengaduanTimeline>? = null,
    val review: PengaduanReview? = null
)
