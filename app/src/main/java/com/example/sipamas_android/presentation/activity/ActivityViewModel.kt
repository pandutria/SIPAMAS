package com.example.sipamas_android.presentation.activity

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.response.BaseResponse
import com.example.sipamas_android.data.state.State
import com.google.gson.Gson
import kotlinx.coroutines.launch

class ActivityViewModel(private val repo: PengaduanRepository): ViewModel() {
    private val _getState = MutableLiveData<State<List<Pengaduan>>>()
    val getState: LiveData<State<List<Pengaduan>>> = _getState

    fun getPengaduan(context: Context) {
        viewModelScope.launch {
            _getState.postValue(State.Loading)
            try {
                val res = repo.getPengaduan(context)
                val body = res.body()

                if (res.isSuccessful && body?.data != null) {
                    _getState.postValue(
                        State.Success(
                            data = body.data,
                            message = body.message ?: "Berhasil"
                        )
                    )
                } else {
                    val errorBody = res.errorBody()?.string()
                    val errorResponse = Gson().fromJson(errorBody, BaseResponse::class.java)
                    _getState.postValue(
                        State.Error(
                            message = errorResponse.message ?: "Gagal",
                            error = errorResponse.error ?: "Error"
                        )
                    )
                }
            } catch (e: Exception) {
                _getState.postValue(
                    State.Error(
                        message = "Gagal",
                        error = e.message ?: "Error"
                    )
                )
            }
        }
    }
}

class ActivityViewModelFactory(private val repo: PengaduanRepository) :
    ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(ActivityViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return ActivityViewModel(repo) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
