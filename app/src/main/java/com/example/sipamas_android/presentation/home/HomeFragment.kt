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
    private var data: List<Pengaduan> = mutableListOf()

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

        val auth = AuthManager(requireContext()).get()
        val privacyManager = PrivacyManager(requireContext())
        
        binding.tvFullname.text = auth?.fullname ?: "Masyarakat"

        binding.ivProfile.setOnClickListener {
            val bottomNav = requireActivity().findViewById<BottomNavigationView>(R.id.bottomNavbar)
            bottomNav.selectedItemId = R.id.profileMenu
        }

        adapter = PengaduanAdapter { data ->
            val bundle = Bundle().apply {
                putInt("id", data.id!!)
            }
            IntenHelper.navigate(requireActivity(), PengaduanDetailActivity::class.java, bundle)
        }

        binding.swipeRefresh.setColorSchemeResources(R.color.primary)
        binding.swipeRefresh.setOnRefreshListener {
            viewModel.getPengaduan(requireContext())
            viewModel.getMe(requireContext())
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
            if (privacyManager.isCameraEnabled()) {
                val bundle = Bundle().apply {
                    putBoolean("useCamera", true)
                }
                IntenHelper.navigate(requireActivity(), PengaduanMediaActivity::class.java, bundle)
            } else {
                Toasthelper.show(requireContext(), "Akses kamera dinonaktifkan. Silakan aktifkan di Pengaturan Privasi.")
            }
        }

        binding.btnBuatLaporan.setOnClickListener {
            IntenHelper.navigate(requireActivity(), PengaduanMediaActivity::class.java)
        }

        viewModel.getPengaduan(requireContext())
        viewModel.getMe(requireContext())
        
        observeViewModel()
    }

    private fun observeViewModel() {
        val authManager = AuthManager(requireContext())
        
        viewModel.meState.observe(viewLifecycleOwner) { state ->
            when (state) {
                is State.Loading -> { }
                is State.Success -> {
                    val user = state.data
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
                    } else {
                        binding.ivProfile.setImageResource(R.drawable.example_user)
                    }

                    authManager.save(user)
                }
                is State.Error -> {
                    // Fail silently or show minor toast for profile refresh
                }
            }
        }

        viewModel.getState.observe(viewLifecycleOwner) { state ->
            val auth = authManager.get()
            when (state) {
                is State.Loading -> {
                    if (!binding.swipeRefresh.isRefreshing) {
                        binding.tvTotalPengaduan.text = "0"
                        binding.tvPengaduanProses.text = "0"
                        binding.tvPengaduanSelesai.text = "0"
                        binding.pbLoading.visibility = View.VISIBLE
                        binding.rvPengaduan.visibility = View.GONE
                        binding.tvEmpty.visibility = View.GONE
                    }
                }

                is State.Success -> {
                    binding.pbLoading.visibility = View.GONE
                    binding.swipeRefresh.isRefreshing = false

                    if (state.data.isEmpty()) {
                        binding.tvEmpty.visibility = View.VISIBLE
                        return@observe
                    }

                    data = state.data.filter { x -> x.created_by?.ID == auth?.ID }
                    adapter.setData(data)

                    binding.rvPengaduan.adapter = adapter
                    binding.rvPengaduan.visibility = View.VISIBLE

                    binding.tvTotalPengaduan.text = data.count().toString()
                    binding.tvPengaduanProses.text =
                        data.filter { x -> x.status == "Diproses" }.count().toString()
                    binding.tvPengaduanSelesai.text =
                        data.filter { x -> x.status == "Selesai" }.count().toString()
                }

                is State.Error -> {
                    binding.swipeRefresh.isRefreshing = false
                    binding.pbLoading.visibility = View.GONE
                    TokenManager(requireContext()).removeToken()
                    requireActivity().finishAffinity()
                }

                else -> {
                    binding.swipeRefresh.isRefreshing = false
                    binding.pbLoading.visibility = View.GONE
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
