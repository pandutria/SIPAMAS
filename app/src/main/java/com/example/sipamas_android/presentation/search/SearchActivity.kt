package com.example.sipamas_android.presentation.search

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.view.WindowManager
import android.view.inputmethod.InputMethodManager
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.example.sipamas_android.R
import com.example.sipamas_android.data.local.AuthManager
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.databinding.ActivitySearchBinding
import com.example.sipamas_android.presentation.adapter.PengaduanAdapter
import com.example.sipamas_android.presentation.detail.PengaduanDetailActivity
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.Toasthelper

class SearchActivity : AppCompatActivity() {
    private var _binding: ActivitySearchBinding? = null
    private val binding get() = _binding!!

    private lateinit var adapter: PengaduanAdapter
    private var allData: List<Pengaduan> = listOf()

    private val viewModel: SearchViewModel by viewModels {
        SearchViewModelFactory(PengaduanRepository())
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        _binding = ActivitySearchBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = true

        binding.ivBack.setOnClickListener {
            IntenHelper.finish(this)
        }

        binding.etSearch.requestFocus()
        
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE)
        
        val auth = AuthManager(this).get()

        adapter = PengaduanAdapter { data ->
            val bundle = Bundle().apply {
                putInt("id", data.id!!)
            }
            IntenHelper.navigate(this, PengaduanDetailActivity::class.java, bundle)
        }
        
        binding.rvPengaduan.adapter = adapter

        setupSearch()
        
        viewModel.getPengaduan(this)

        viewModel.getState.observe(this) { state ->
            when (state) {
                is State.Loading -> {
                    binding.pbLoading.visibility = View.VISIBLE
                    binding.rvPengaduan.visibility = View.GONE
                    binding.tvEmpty.visibility = View.GONE
                }

                is State.Success -> {
                    binding.pbLoading.visibility = View.GONE
                    allData = state.data.filter { x -> x.created_by?.ID == auth?.ID }
                    
                    if (allData.isEmpty()) {
                        binding.tvEmpty.visibility = View.VISIBLE
                    } else {
                        adapter.setData(allData)
                        binding.rvPengaduan.visibility = View.VISIBLE
                    }
                }

                is State.Error -> {
                    binding.pbLoading.visibility = View.GONE
                    binding.tvEmpty.visibility = View.VISIBLE
                    Toasthelper.show(this, state.message ?: "Error")
                }
            }
        }
    }

    private fun setupSearch() {
        binding.etSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                filterData(s.toString())
            }
            override fun afterTextChanged(s: Editable?) {}
        })
    }

    private fun filterData(query: String) {
        val filteredList = allData.filter { 
            it.judul?.contains(query, ignoreCase = true) == true || 
            it.deskripsi?.contains(query, ignoreCase = true) == true 
        }
        
        adapter.setData(filteredList)
        
        if (filteredList.isEmpty()) {
            binding.tvEmpty.visibility = View.VISIBLE
            binding.rvPengaduan.visibility = View.GONE
        } else {
            binding.tvEmpty.visibility = View.GONE
            binding.rvPengaduan.visibility = View.VISIBLE
        }
    }

    @SuppressLint("GestureBackNavigation")
    override fun onBackPressed() {
        super.onBackPressed()
        IntenHelper.finish(this)
    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }
}
