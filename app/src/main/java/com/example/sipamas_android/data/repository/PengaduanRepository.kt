package com.example.sipamas_android.data.repository

import android.content.Context
import com.example.sipamas_android.data.local.TokenManager
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.remote.RetrofitInstance
import com.example.sipamas_android.data.response.BaseResponse
import retrofit2.Response

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
}