package com.example.sipamas_android.data.model

data class PengaduanTimeline(
    val id: Int? = null,
    val pengaduan_id: Int? = null,
    val created_by_id: Int? = null,
    val judul: String? = null,
    val keterangan: String? = null,
    val created_at: String? = null,
    val updated_at: String? = null,
    val created_by: User? = null
)