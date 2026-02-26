package com.example.sipamas_android.presentation.detail

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.presentation.home.HomeViewModel
import kotlinx.coroutines.launch

class PengaduanDetailViewModel(private val repo: PengaduanRepository): ViewModel() {
    private val _getState = MutableLiveData<State<Pengaduan>>()
    val getState: LiveData<State<Pengaduan>> = _getState

    fun getById(context: Context, id: Int) {
        viewModelScope.launch {
            _getState.postValue(State.Loading)

            try {
                val res = repo.getPengaduanById(context, id)
                val body = res.body()

                if (res.isSuccessful && body?.data != null) {
                    _getState.postValue(
                        State.Success(
                            data = body.data,
                            message = body.message ?: "Berhasil"
                        )
                    )
                } else {

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

class PengaduanDetailViewModelFactory(private val repo: PengaduanRepository) :
    ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(PengaduanDetailViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return PengaduanDetailViewModel(repo) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}