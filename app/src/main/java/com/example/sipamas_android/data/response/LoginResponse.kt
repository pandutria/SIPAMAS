package com.example.sipamas_android.data.response

data class LoginResponse(
    val message: String? = null,
    val token: String? = null,
    val role: String? = null,
    val error: String? = null
)
