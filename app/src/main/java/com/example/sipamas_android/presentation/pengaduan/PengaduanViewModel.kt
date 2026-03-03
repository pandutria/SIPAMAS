package com.example.sipamas_android.presentation.pengaduan

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.model.PengaduanMedia
import com.example.sipamas_android.data.remote.RetrofitInstance
import com.example.sipamas_android.data.repository.AuthRepository
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.response.BaseResponse
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.presentation.auth.login.LoginViewModel
import com.google.gson.Gson
import kotlinx.coroutines.launch
import java.io.File

class PengaduanViewModel(private val repo: PengaduanRepository): ViewModel() {
    private val _createState = MutableLiveData<State<Pengaduan>>()
    val createState: LiveData<State<Pengaduan>> = _createState

    private val _createMediaState = MutableLiveData<State<PengaduanMedia>>()
    val createMediaState: LiveData<State<PengaduanMedia>> = _createMediaState

    fun create(
        context: Context,
        judul: String,
        deskripsi: String,
        kategori: String,
        alamat: String,
        latitude: String,
        longitude: String
    ) {
        viewModelScope.launch {
            _createState.postValue(State.Loading)

            try {
                val res = repo.createPengaduan(
                    context,
                    judul,
                    deskripsi,
                    kategori,
                    alamat,
                    latitude,
                    longitude
                )
                val body = res.body()

                if (res.isSuccessful && body?.data != null) {
                    _createState.postValue(
                        State.Success(
                            data = body.data,
                            message = body.message ?: "Berhasil"
                        )
                    )
                } else {
                    val errorBody = res.errorBody()?.string()
                    val errorResponse = Gson().fromJson(errorBody, BaseResponse::class.java)
                    _createState.postValue(
                        State.Error(
                            message = errorResponse.message,
                            error = errorResponse.error
                        )
                    )
                }
            } catch (e: Exception) {
                _createState.postValue(
                    State.Error(
                        message = "Gagal",
                        error = e.message ?: "Error"
                    )
                )
            }
        }
    }

    fun createMedia(
        context: Context,
        pengaduanId: Int,
        media_tipe: String,
        media_file: File
    ) {
        viewModelScope.launch {
            _createMediaState.postValue(State.Loading)

            try {
                val res = repo.createPengaduanMedia(
                    context,
                    pengaduanId,
                    media_tipe,
                    media_file
                )
                val body = res.body()

                if (res.isSuccessful && body?.data != null) {
                    _createMediaState.postValue(
                        State.Success(
                            data = body.data,
                            message = body.message ?: "Berhasil"
                        )
                    )
                } else {
                    val errorBody = res.errorBody()?.string()
                    val errorResponse = Gson().fromJson(errorBody, BaseResponse::class.java)
                    _createMediaState.postValue(
                        State.Error(
                            message = errorResponse.message,
                            error = errorResponse.error
                        )
                    )
                }
            } catch (e: Exception) {
                _createMediaState.postValue(
                    State.Error(
                        message = "Gagal",
                        error = e.message ?: "Error"
                    )
                )
            }
        }
    }
}

class PengaduanModelFactory(private val repo: PengaduanRepository) :
    ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(PengaduanViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return PengaduanViewModel(repo) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}