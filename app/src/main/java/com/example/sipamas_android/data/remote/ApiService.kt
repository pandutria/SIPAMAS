package com.example.sipamas_android.data.remote

import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.model.PengaduanMedia
import com.example.sipamas_android.data.model.PengaduanReview
import com.example.sipamas_android.data.model.User
import com.example.sipamas_android.data.response.BaseResponse
import com.example.sipamas_android.data.response.LoginResponse
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path

interface ApiService {
    @Multipart
    @POST("auth/register")
    suspend fun register(
        @Part("fullname") fullname: RequestBody,
        @Part("email") email: RequestBody,
        @Part("address") address: RequestBody,
        @Part("password") password: RequestBody,
        @Part ktp_file: MultipartBody.Part
    ): Response<BaseResponse<User>>

    @FormUrlEncoded
    @POST("auth/login")
    suspend fun login(
        @Field("email") email: String,
        @Field("password") password: String,
    ): Response<LoginResponse>

    @GET("auth/me")
    suspend fun me(
        @Header("Authorization") token: String
    ): Response<BaseResponse<User>>

    @GET("pengaduan")
    suspend fun getPengaduan(
        @Header("Authorization") token: String
    ): Response<BaseResponse<List<Pengaduan>>>

    @GET("pengaduan/{id}")
    suspend fun getPengaduanById(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): Response<BaseResponse<Pengaduan>>

    @FormUrlEncoded
    @POST("pengaduan/create")
    suspend fun createPengaduan(
        @Header("Authorization") token: String,
        @Field("judul") judul: String,
        @Field("deskripsi") deskripsi: String,
        @Field("kategori") kategori: String,
        @Field("alamat") alamat: String,
        @Field("latitude") latitude: String,
        @Field("longitude") longitude: String,
    ): Response<BaseResponse<Pengaduan>>

    @Multipart
    @POST("pengaduan/media/create")
    suspend fun createPengaduanMedia(
        @Header("Authorization") token: String,
        @Part("pengaduan_id") pengaduan_id: Int,
        @Part("media_tipe") media_tipe: String,
        @Part media_file: MultipartBody.Part
    ): Response<BaseResponse<PengaduanMedia>>

    @Multipart
    @POST("pengaduan/review/create")
    suspend fun CreatePengaduanReview(
        @Header("Authorization") token: String,
        @Part("pengaduan_id") pengaduan_id: Int,
        @Part("rating") rating: Int,
        @Part("catatan") catatan: String,
    ): Response<BaseResponse<PengaduanReview>>
}