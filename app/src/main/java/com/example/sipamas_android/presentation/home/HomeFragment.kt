package com.example.sipamas_android.presentation.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.bumptech.glide.Glide
import com.example.sipamas_android.R
import com.example.sipamas_android.data.local.AuthManager
import com.example.sipamas_android.data.local.PrivacyManager
import com.example.sipamas_android.data.local.TokenManager
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.model.User
import com.example.sipamas_android.data.remote.RetrofitInstance
import com.example.sipamas_android.data.repository.AuthRepository
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.databinding.FragmentHomeBinding
import com.example.sipamas_android.presentation.adapter.PengaduanAdapter
import com.example.sipamas_android.presentation.detail.PengaduanDetailActivity
import com.example.sipamas_android.presentation.pengaduan.media.PengaduanMediaActivity
import com.example.sipamas_android.presentation.search.SearchActivity
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.Toasthelper
import com.google.android.material.bottomnavigation.BottomNavigationView

class HomeFragment : Fragment() {
    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private lateinit var adapter: PengaduanAdapter
    private var allData: List<Pengaduan> = listOf()
    private var auth: User? = null

    private val viewModel: HomeViewModel by viewModels {
        HomeViewModelFactory(PengaduanRepository(), AuthRepository())
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(layoutInflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupUI()
        observeViewModel()
        refreshData()
    }

    private fun setupUI() {
        auth = AuthManager(requireContext()).get()
        binding.tvFullname.text = auth?.fullname ?: "Masyarakat"

        adapter = PengaduanAdapter { data ->
            val bundle = Bundle().apply {
                putInt("id", data.id!!)
            }
            IntenHelper.navigate(requireActivity(), PengaduanDetailActivity::class.java, bundle)
        }

        binding.swipeRefresh.setColorSchemeResources(R.color.primary)
        binding.swipeRefresh.setOnRefreshListener {
            refreshData()
        }

        binding.ivProfile.setOnClickListener {
            val bottomNav = requireActivity().findViewById<BottomNavigationView>(R.id.bottomNavbar)
            bottomNav.selectedItemId = R.id.profileMenu
        }

        binding.etSearch.setOnClickListener {
            IntenHelper.navigate(requireActivity(), SearchActivity::class.java)
        }

        binding.etSearch.setOnFocusChangeListener { _, hasFocus ->
            if (hasFocus) {
                IntenHelper.navigate(requireActivity(), SearchActivity::class.java)
            }
        }

        binding.layoutCamera.setOnClickListener {
            if (PrivacyManager(requireContext()).isCameraEnabled()) {
                val bundle = Bundle().apply {
                    putBoolean("useCamera", true)
                }
                IntenHelper.navigate(requireActivity(), PengaduanMediaActivity::class.java, bundle)
            } else {
                Toasthelper.show(requireContext(), "Akses kamera dinonaktifkan di Pengaturan Privasi.")
            }
        }

        binding.btnBuatLaporan.setOnClickListener {
            IntenHelper.navigate(requireActivity(), PengaduanMediaActivity::class.java)
        }
    }

    private fun refreshData() {
        viewModel.getPengaduan(requireContext())
        viewModel.getMe(requireContext())
    }

    private fun observeViewModel() {
        viewModel.meState.observe(viewLifecycleOwner) { state ->
            when (state) {
                is State.Success -> {
                    auth = state.data
                    AuthManager(requireContext()).save(state.data)
                    updateProfileUI(state.data)
                    if (allData.isNotEmpty()) filterAndDisplay(allData)
                }
                is State.Error -> handleAuthError()
                else -> {}
            }
        }

        viewModel.getState.observe(viewLifecycleOwner) { state ->
            when (state) {
                is State.Loading -> showLoading(true)
                is State.Success -> {
                    showLoading(false)
                    allData = state.data
                    filterAndDisplay(allData)
                }
                is State.Error -> handleAuthError()
                else -> showLoading(false)
            }
        }
    }

    private fun filterAndDisplay(list: List<Pengaduan>) {
        val currentUserId = auth?.id ?: return
        
        val filtered = list.filter { 
            it.created_by_id == currentUserId || it.created_by?.id == currentUserId
        }

        if (filtered.isEmpty()) {
            binding.rvPengaduan.visibility = View.GONE
            binding.tvEmpty.visibility = View.VISIBLE
        } else {
            binding.rvPengaduan.visibility = View.VISIBLE
            binding.tvEmpty.visibility = View.GONE
            adapter.setData(filtered)
            binding.rvPengaduan.adapter = adapter
        }

        updateStats(filtered)
    }

    private fun updateStats(filteredList: List<Pengaduan>) {
        binding.tvTotalPengaduan.text = filteredList.size.toString()
        binding.tvPengaduanProses.text = filteredList.count { it.status?.lowercase() == "diproses" }.toString()
        binding.tvPengaduanSelesai.text = filteredList.count { it.status?.lowercase() == "selesai" }.toString()
    }

    private fun updateProfileUI(user: User) {
        binding.tvFullname.text = user.fullname ?: "Masyarakat"
        if (!user.profile_photo.isNullOrEmpty()) {
            val baseUrl = RetrofitInstance.baseUrl.replace("api/", "")
            val cleanPath = user.profile_photo.replace("\\", "/")
            val imageUrl = if (cleanPath.startsWith("/")) {
                baseUrl.removeSuffix("/") + cleanPath
            } else {
                baseUrl + cleanPath
            }

            Glide.with(this)
                .load(imageUrl)
                .placeholder(R.drawable.example_user)
                .error(R.drawable.example_user)
                .into(binding.ivProfile)
        }
    }

    private fun showLoading(isLoading: Boolean) {
        if (!binding.swipeRefresh.isRefreshing) {
            binding.pbLoading.visibility = if (isLoading) View.VISIBLE else View.GONE
        }
        if (!isLoading) binding.swipeRefresh.isRefreshing = false
    }

    private fun handleAuthError() {
        TokenManager(requireContext()).removeToken()
        AuthManager(requireContext()).remove()
        requireActivity().finishAffinity()
        Toasthelper.show(requireContext(), "Sesi berakhir, silakan login kembali")
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
