package com.example.sipamas_android.data.remote

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
}