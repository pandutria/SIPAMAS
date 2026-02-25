package com.example.sipamas_android.presentation.home

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.viewModels
import androidx.fragment.app.viewModels
import com.example.sipamas_android.R
import com.example.sipamas_android.data.local.AuthManager
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.repository.AuthRepository
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.databinding.FragmentHomeBinding
import com.example.sipamas_android.presentation.adapter.PengaduanAdapter
import com.example.sipamas_android.presentation.auth.login.LoginViewModel
import com.example.sipamas_android.presentation.auth.login.LoginViewModelFactory
import com.example.sipamas_android.utils.Toasthelper
import kotlin.getValue

class HomeFragment : Fragment() {
    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private lateinit var adapter: PengaduanAdapter

    private var data: List<Pengaduan> = mutableListOf()

    private val viewModel: HomeViewModel by viewModels {
        HomeViewModelFactory(PengaduanRepository())
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentHomeBinding.inflate(layoutInflater, container, false)

        val auth = AuthManager(requireContext()).get()
        binding.tvFullname.text = auth?.fullname ?: "Masyarakat"

        adapter = PengaduanAdapter{ data ->

        }

        binding.swipeRefresh.setColorSchemeResources(R.color.primary)

        binding.swipeRefresh.setOnRefreshListener {
            viewModel.getPengaduan(requireContext())
        }

        viewModel.getPengaduan(requireContext())
        viewModel.getState.observe(viewLifecycleOwner){state ->
            when(state) {
                is State.Loading -> {
                    binding.tvTotalPengaduan.text = "0"
                    binding.tvPengaduanProses.text = "0"
                    binding.tvPengaduanSelesai.text = "0"
                    binding.pbLoading.visibility = View.VISIBLE
                    binding.rvPengaduan.visibility = View.GONE
                    binding.tvEmpty.visibility = View.GONE

                    if (!binding.swipeRefresh.isRefreshing) {
                        binding.pbLoading.visibility = View.VISIBLE
                    }
                }
                is State.Success -> {
                    binding.pbLoading.visibility = View.GONE
                    binding.swipeRefresh.isRefreshing = false

                    if (state.data.isEmpty()) {
                        binding.pbLoading.visibility = View.GONE
                        binding.tvEmpty.visibility = View.VISIBLE
                        return@observe
                    }

                    data = state.data.filter { x -> x.created_by?.ID == auth?.ID}
                    adapter.setData(data)

                    binding.rvPengaduan.adapter = adapter
                    binding.rvPengaduan.visibility = View.VISIBLE
                    binding.pbLoading.visibility = View.GONE

                    binding.tvTotalPengaduan.text = data.count().toString()
                    binding.tvPengaduanProses.text = data.filter { x -> x.status == "Diproses" }.count().toString()
                    binding.tvPengaduanSelesai.text = data.filter { x -> x.status == "Selesai" }.count().toString()
                }
                is State.Error -> {
                    binding.swipeRefresh.isRefreshing = false
                    binding.pbLoading.visibility = View.GONE
                    binding.tvEmpty.visibility = View.VISIBLE
                    Toasthelper.show(requireContext(), state.message ?: "Error")
                }
                else -> {
                    binding.swipeRefresh.isRefreshing = false
                    binding.pbLoading.visibility = View.GONE
                    binding.tvEmpty.visibility = View.VISIBLE
                    Toasthelper.show(requireContext(),  "Error")
                }
            }
        }

        return binding.root
    }
}