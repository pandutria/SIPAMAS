package com.example.sipamas_android.presentation.activity

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import com.example.sipamas_android.data.local.AuthManager
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.databinding.FragmentActivityBinding
import com.example.sipamas_android.presentation.adapter.PengaduanCategoryAdapter
import com.example.sipamas_android.presentation.detail.PengaduanDetailActivity
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.Toasthelper

class ActivityFragment : Fragment() {
    private var _binding: FragmentActivityBinding? = null
    private val binding get() = _binding!!

    private lateinit var adapter: PengaduanCategoryAdapter
    private var allData: List<Pengaduan> = listOf()

    private val viewModel: ActivityViewModel by viewModels {
        ActivityViewModelFactory(PengaduanRepository())
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentActivityBinding.inflate(layoutInflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        setupSpinner()
        observeViewModel()
        
        viewModel.getPengaduan(requireContext())
    }

    private fun setupRecyclerView() {
        adapter = PengaduanCategoryAdapter { pengaduan ->
            val bundle = Bundle().apply {
                putInt("id", pengaduan.id!!)
            }
            IntenHelper.navigate(requireActivity(), PengaduanDetailActivity::class.java, bundle)
        }
        binding.rvPengaduan.adapter = adapter
    }

    private fun setupSpinner() {
        val statusList = listOf("Semua", "Menunggu", "Diterima", "Ditolak", "Diproses", "Selesai")
        binding.spinnerStatus.setItems(statusList)
        
        binding.spinnerStatus.setOnSpinnerItemSelectedListener<String> { _, _, _, newItem ->
            filterData(newItem)
        }
    }

    private fun observeViewModel() {
        val auth = AuthManager(requireContext()).get()
        
        viewModel.getState.observe(viewLifecycleOwner) { state ->
            when (state) {
                is State.Loading -> {
                    binding.pbLoading.visibility = View.VISIBLE
                    binding.rvPengaduan.visibility = View.GONE
                    binding.tvEmpty.visibility = View.GONE
                }
                is State.Success -> {
                    binding.pbLoading.visibility = View.GONE
                    // Filter data hanya milik user yang sedang login
                    allData = state.data.filter { it.created_by?.ID == auth?.ID }
                    
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
                    Toasthelper.show(requireContext(), state.message ?: "Terjadi kesalahan")
                }
            }
        }
    }

    private fun filterData(status: String) {
        val filteredList = if (status == "Semua") {
            allData
        } else {
            allData.filter { it.status?.equals(status, ignoreCase = true) == true }
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

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
