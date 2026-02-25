package com.example.sipamas_android.presentation.auth.register

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.sipamas_android.data.model.User
import com.example.sipamas_android.data.repository.AuthRepository
import com.example.sipamas_android.data.response.BaseResponse
import com.example.sipamas_android.data.response.LoginResponse
import com.example.sipamas_android.data.state.State
import com.google.gson.Gson
import kotlinx.coroutines.launch
import java.io.File

class RegisterViewModel(private val repo: AuthRepository) : ViewModel() {
    private val _registerState = MutableLiveData<State<User>>()
    val registerState: LiveData<State<User>> get() = _registerState

    fun register(
        fullname: String,
        email: String,
        address: String,
        password: String,
        ktpFile: File,
    ) {
        viewModelScope.launch {
            _registerState.postValue(State.Loading)
            try {
                val res = repo.register(fullname, email, address, password, ktpFile)
                val body = res.body()

                if (res.isSuccessful && body?.data != null) {
                    _registerState.postValue(
                        State.Success(
                            data = body.data,
                            message = body.message ?: "Berhasil"
                        )
                    )
                } else {
                    val errorBody = res.errorBody()?.string()
                    val errorResponse = Gson().fromJson(errorBody, BaseResponse::class.java)
                    _registerState.postValue(
                        State.Error(
                            message = errorResponse.message ?: "Gagal",
                            error = errorResponse.error ?: "Error"
                        )
                    )
                }

            } catch (e: Exception) {
                _registerState.postValue(
                    State.Error(
                        message = "Gagal",
                        error = e.message ?: "Error"
                    )
                )
            }
        }
    }
}

class RegisterViewModelFactory(private val repo: AuthRepository) :
    ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(RegisterViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return RegisterViewModel(repo) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}