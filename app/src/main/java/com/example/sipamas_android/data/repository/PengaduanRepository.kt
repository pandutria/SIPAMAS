package com.example.sipamas_android.data.repository

import android.content.Context
import com.example.sipamas_android.data.local.TokenManager
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.model.PengaduanMedia
import com.example.sipamas_android.data.model.PengaduanReview
import com.example.sipamas_android.data.remote.RetrofitInstance
import com.example.sipamas_android.data.response.BaseResponse
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import retrofit2.Response
import java.io.File

class PengaduanRepository {
    suspend fun getPengaduan(context: Context): Response<BaseResponse<List<Pengaduan>>> {
        val token = TokenManager(context).getToken()
        val res = RetrofitInstance.api.getPengaduan(token)
        return res
    }

    suspend fun getPengaduanById(context: Context, id: Int): Response<BaseResponse<Pengaduan>> {
        val token = TokenManager(context).getToken()
        val res = RetrofitInstance.api.getPengaduanById(token, id)
        return res
    }

    suspend fun createPengaduan(
        context: Context,
        judul: String,
        deskripsi: String,
        kategori: String,
        alamat: String,
        latitude: String,
        longitude: String
    ): Response<BaseResponse<Pengaduan>>{
        val token = TokenManager(context).getToken()
        val res = RetrofitInstance.api.createPengaduan(
            token = token,
            judul = judul,
            deskripsi = deskripsi,
            kategori = kategori,
            alamat = alamat,
            latitude = latitude,
            longitude = longitude
        )

        return res
    }

    suspend fun createPengaduanMedia(
        context: Context,
        pengaduanId: Int,
        media_tipe: String,
        media_file: File
    ): Response<BaseResponse<PengaduanMedia>> {
        val token = TokenManager(context).getToken()

        val mimeType = if (media_tipe.lowercase().contains("video")) "video/*" else "image/*"
        
        val requestFile = media_file.asRequestBody(mimeType.toMediaType())
        val filePart = MultipartBody.Part.createFormData("media_file", media_file.name, requestFile)
        
        return RetrofitInstance.api.createPengaduanMedia(
            token = token,
            pengaduan_id = pengaduanId,
            media_tipe = media_tipe,
            media_file = filePart
        )
    }

    suspend fun createPengaduanReview(
        context: Context,
        pengaduanId: Int,
        rating: Int,
        catatan: String
    ): Response<BaseResponse<PengaduanReview>> {
        val token = TokenManager(context).getToken()
        val res = RetrofitInstance.api.CreatePengaduanReview(token, pengaduanId, rating, catatan)
        return res
    }
}
