package com.example.sipamas_android.data.local

import android.content.Context

class TokenManager(context: Context) {
    val tokenPref = "token_pref"
    val tokenKey = "token_key"

    val shared = context.getSharedPreferences(tokenPref, Context.MODE_PRIVATE)

    fun saveToken(token: String) {
        shared.edit().putString(tokenKey, "Bearer $token").apply()
    }

    fun getToken(): String {
        return shared.getString(tokenKey, "").toString()
    }

    fun removeToken() {
        shared.edit().remove(tokenKey).apply()
    }
}