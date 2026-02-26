package com.example.sipamas_android.utils

import android.util.Log

object LogHelper {
    fun log(text: String? = null) {
        Log.d("DEBUG_LOG", text ?: "null")
    }
}