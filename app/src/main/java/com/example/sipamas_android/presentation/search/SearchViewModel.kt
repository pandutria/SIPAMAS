package com.example.sipamas_android.presentation.search

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.state.State
import kotlinx.coroutines.launch

class SearchViewModel(private val repo: PengaduanRepository): ViewModel() {
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
                            message = body.message ?: "Berhasil mengambil data"
                        )
                    )
                } else {
                    _getState.postValue(State.Error("Gagal mengambil data"))
                }
            } catch (e: Exception) {
                _getState.postValue(
                    State.Error(
                        message = "Terjadi kesalahan",
                        error = e.message ?: "Error"
                    )
                )
            }
        }
    }
}

class SearchViewModelFactory(private val repo: PengaduanRepository) :
    ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(SearchViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return SearchViewModel(repo) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
