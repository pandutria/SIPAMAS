package com.example.sipamas_android.presentation.review

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.sipamas_android.data.model.PengaduanReview
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.response.BaseResponse
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.presentation.pengaduan.PengaduanViewModel
import com.google.gson.Gson
import kotlinx.coroutines.launch

class PengaduanReviewViewModel(private val repo: PengaduanRepository) : ViewModel() {
    private val _createState = MutableLiveData<State<PengaduanReview>>()
    val createState: LiveData<State<PengaduanReview>> = _createState

    fun create(
        context: Context,
        pengaduanId: Int,
        rating: Int,
        catatan: String
    ) {
        viewModelScope.launch {
            _createState.postValue(State.Loading)
            try {
                val res = repo.createPengaduanReview(context, pengaduanId, rating, catatan)
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
}

class PengaduanReviewViewModelFactory(private val repo: PengaduanRepository) :
    ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(PengaduanReviewViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return PengaduanReviewViewModel(repo) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}