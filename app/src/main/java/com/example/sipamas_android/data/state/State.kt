package com.example.sipamas_android.data.state

sealed class State<out T> {
    data class Success<out T>(val data: T, val message: String) : State<T>()
    data class Error(val message: String? = null, val error: String? = null) : State<Nothing>()
    data object Loading : State<Nothing>()
}