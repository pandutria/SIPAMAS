package com.example.sipamas_android.presentation.activity

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.example.sipamas_android.databinding.FragmentActivityBinding

class ActivityFragment : Fragment() {
    private var _binding: FragmentActivityBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentActivityBinding.inflate(layoutInflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupSpinner()
    }

    private fun setupSpinner() {
        val statusList = listOf("Menunggu", "Diterima", "Ditolak", "Proses", "Selesai")
        binding.spinnerStatus.setItems(statusList)
        
        binding.spinnerStatus.setOnSpinnerItemSelectedListener<String> { oldIndex, oldItem, newIndex, newItem ->

        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
