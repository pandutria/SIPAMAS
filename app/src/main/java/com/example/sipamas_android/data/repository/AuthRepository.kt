package com.example.sipamas_android.data.repository

import com.example.sipamas_android.data.model.User
import com.example.sipamas_android.data.remote.RetrofitInstance
import com.example.sipamas_android.data.response.BaseResponse
import com.example.sipamas_android.data.response.LoginResponse
import java.io.File
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import retrofit2.Response

class AuthRepository {
    suspend fun register(
        fullname: String,
        email: String,
        address: String,
        password: String,
        ktpFile: File
    ): Response<BaseResponse<User>> {

        val fullnameBody = fullname.toRequestBody("text/plain".toMediaType())
        val emailBody = email.toRequestBody("text/plain".toMediaType())
        val addressBody = address.toRequestBody("text/plain".toMediaType())
        val passwordBody = password.toRequestBody("text/plain".toMediaType())

        val requestFile = ktpFile.asRequestBody("image/*".toMediaType())

        val ktpPart = MultipartBody.Part.createFormData(
            "ktp_file",
            ktpFile.name,
            requestFile
        )

        val res = RetrofitInstance.api.register(
            fullnameBody,
            emailBody,
            addressBody,
            passwordBody,
            ktpPart
        )

        return res
    }

    suspend fun login(
        email: String,
        password: String
    ): Response<LoginResponse> {
        val res = RetrofitInstance.api.login(email, password)
        return res
    }
}