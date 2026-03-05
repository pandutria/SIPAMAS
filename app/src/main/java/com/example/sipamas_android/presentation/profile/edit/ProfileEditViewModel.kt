package com.example.sipamas_android.presentation.profile.edit

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
import java.io.File

class ProfileEditViewModel(private val repo: AuthRepository) : ViewModel() {
    private val _updateState = MutableLiveData<State<User>>()
    val updateState: LiveData<State<User>> = _updateState

    fun updateProfile(
        context: Context,
        fullname: String,
        email: String,
        profilePhoto: File?
    ) {
        viewModelScope.launch {
            _updateState.postValue(State.Loading)
            try {
                val res = repo.updateProfile(context, fullname, email, profilePhoto)
                val body = res.body()

                if (res.isSuccessful && body?.data != null) {
                    _updateState.postValue(
                        State.Success(
                            data = body.data,
                            message = body.message ?: "Berhasil memperbarui profil"
                        )
                    )
                } else {
                    val errorBody = res.errorBody()?.string()
                    val errorResponse = Gson().fromJson(errorBody, BaseResponse::class.java)
                    _updateState.postValue(
                        State.Error(
                            message = errorResponse.message ?: "Gagal memperbarui profil",
                            error = errorResponse.error ?: "Error"
                        )
                    )
                }
            } catch (e: Exception) {
                _updateState.postValue(
                    State.Error(
                        message = "Gagal memperbarui profil",
                        error = e.message ?: "Error"
                    )
                )
            }
        }
    }
}

class ProfileEditViewModelFactory(private val repo: AuthRepository) :
    ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(ProfileEditViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return ProfileEditViewModel(repo) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
