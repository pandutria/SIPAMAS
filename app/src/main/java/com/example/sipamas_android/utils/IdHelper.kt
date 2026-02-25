package com.example.sipamas_android.utils

object IdHelper {
    fun formatId(id: Int?): String {
        return String.format("#%03d", id ?: 0)
    }
}
