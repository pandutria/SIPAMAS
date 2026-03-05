package com.example.sipamas_android.presentation.profile

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.sipamas_android.data.model.User
import com.example.sipamas_android.data.repository.AuthRepository
import com.example.sipamas_android.data.response.BaseResponse
import com.example.sipamas_android.data.state.State
import com.google.gson.Gson
import kotlinx.coroutines.launch

class ProfileViewModel(private val repo: AuthRepository) : ViewModel() {
    private val _meState = MutableLiveData<State<User>>()
    val meState: LiveData<State<User>> = _meState

    fun getMe(context: Context) {
        viewModelScope.launch {
            _meState.postValue(State.Loading)
            try {
                val res = repo.me(context)
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
}

class ProfileViewModelFactory(private val repo: AuthRepository) :
    ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(ProfileViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return ProfileViewModel(repo) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
