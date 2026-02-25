package com.example.sipamas_android.data.model

data class IdentitasProyek(
    val id: Int? = null,
    val nama: String? = null,
    val tahun_anggaran: String? = null,
    val kategori: String? = null,
    val provinsi: String? = null,
    val kabupaten: String? = null,
    val kecamatan: String? = null,
    val kecamatan_kode: String? = null,
    val kelurahan: String? = null,
    val latitude: String? = null,
    val longitude: String? = null,
    val nilai_kontrak: String? = null,
    val kontraktor_pelaksana: String? = null,
    val konsultas_pengawas: String? = null,
    val sumber_dana: String? = null,
    val kontrak_file: String? = null,
    val surat_perintah_file: String? = null,
    val surat_penunjukan_file: String? = null,
    val berita_acara_file: String? = null,
    val alasan_count: Int? = null,
    val alasan_text: String? = null,
    val created_by_id: Int? = null,
    val created_at: String? = null,
    val updated_at: String? = null,
    val created_by: User? = null
)
