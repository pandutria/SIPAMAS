package com.example.sipamas_android.data.response

data class BaseResponse<T>(
    val message: String? = null,
    val data: T? = null,
    val error: String? = null
)