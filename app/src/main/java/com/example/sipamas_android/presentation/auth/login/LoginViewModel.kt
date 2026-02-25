package com.example.sipamas_android.presentation.auth.login

import android.content.Context
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

class LoginViewModel(private val repo: AuthRepository) : ViewModel() {
    private val _loginState = MutableLiveData<State<LoginResponse>>()
    val loginState: LiveData<State<LoginResponse>> = _loginState

    private val _meState = MutableLiveData<State<User>>()
    val meState: LiveData<State<User>> = _meState

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _loginState.postValue(State.Loading)

            try {
                val res = repo.login(email, password)
                val body = res.body()

                if (res.isSuccessful && body != null) {
                    _loginState.postValue(
                        State.Success(
                            body,
                            body?.message ?: "Berhasil"
                        )
                    )
                } else {
                    val errorBody = res.errorBody()?.string()
                    val errorResponse = Gson().fromJson(errorBody, LoginResponse::class.java)
                    _loginState.postValue(
                        State.Error(
                            message = errorResponse.message ?: "Gagal",
                            error = errorResponse.error ?: "Error"
                        )
                    )
                }
            } catch (e: Exception) {
                _loginState.postValue(
                    State.Error(
                        message = "Gagal",
                        error = e.message ?: "Error"
                    )
                )
            }
        }
    }

    fun me(context: Context) {
        viewModelScope.launch {
            _meState.postValue(State.Loading)

            try {
                val res = repo.me(context)
                val body = res.body()

                if (res.isSuccessful && body?.data != null) {
                    _meState.postValue(
                        State.Success(
                            data = body.data,
                            message = body?.message ?: ""
                        )
                    )
                } else {
                    val errorBody = res.errorBody()?.string()
                    val errorResponse = Gson().fromJson(errorBody, BaseResponse::class.java)
                    _loginState.postValue(
                        State.Error(
                            message = errorResponse.message ?: "Gagal",
                            error = errorResponse.error ?: "Error"
                        )
                    )
                }
            } catch (e: Exception) {

            }
        }
    }
}

class LoginViewModelFactory(private val repo: AuthRepository) :
    ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(LoginViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return LoginViewModel(repo) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}