package com.example.sipamas_android.presentation.home

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.model.User
import com.example.sipamas_android.data.repository.AuthRepository
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.response.BaseResponse
import com.example.sipamas_android.data.state.State
import com.google.gson.Gson
import kotlinx.coroutines.launch

class HomeViewModel(
    private val repo: PengaduanRepository,
    private val authRepo: AuthRepository
): ViewModel() {
    private val _getState = MutableLiveData<State<List<Pengaduan>>>()
    val getState: LiveData<State<List<Pengaduan>>> = _getState

    private val _meState = MutableLiveData<State<User>>()
    val meState: LiveData<State<User>> = _meState

    fun getMe(context: Context) {
        viewModelScope.launch {
            _meState.postValue(State.Loading)
            try {
                val res = authRepo.me(context)
                val body = res.body()

                if (res.isSuccessful && body?.data != null) {
                    _meState.postValue(
                        State.Success(
                            data = body.data,
                            message = body.message ?: "Berhasil"
                        )
                    )
                } else {
                    val errorBody = res.errorBody()?.string()
                    val errorResponse = Gson().fromJson(errorBody, BaseResponse::class.java)
                    _meState.postValue(
                        State.Error(
                            message = errorResponse.message ?: "Gagal",
                            error = errorResponse.error ?: "Error"
                        )
                    )
                }
            } catch (e: Exception) {
                _meState.postValue(
                    State.Error(
                        message = "Gagal",
                        error = e.message ?: "Error"
                    )
                )
            }
        }
    }

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
                            message = body.message ?: "Gagal"
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

class HomeViewModelFactory(
    private val repo: PengaduanRepository,
    private val authRepo: AuthRepository
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(HomeViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return HomeViewModel(repo, authRepo) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
