package com.example.sipamas_android.presentation.profile

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import com.bumptech.glide.Glide
import com.example.sipamas_android.R
import com.example.sipamas_android.data.local.AuthManager
import com.example.sipamas_android.data.local.PrivacyManager
import com.example.sipamas_android.data.local.TokenManager
import com.example.sipamas_android.data.remote.RetrofitInstance
import com.example.sipamas_android.data.repository.AuthRepository
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.databinding.FragmentProfileBinding
import com.example.sipamas_android.presentation.auth.login.LoginActivity
import com.example.sipamas_android.presentation.privasi.PrivasiActivity
import com.example.sipamas_android.presentation.profile.edit.ProfileEditActivity
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.Toasthelper

class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    private val viewModel: ProfileViewModel by viewModels {
        ProfileViewModelFactory(AuthRepository())
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(layoutInflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupAction()
        observeViewModel()
        
        viewModel.getMe(requireContext())
    }

    private fun setupAction() {
        binding.btnLogout.setOnClickListener {
            logout()
        }
        
        binding.btnEditProfile.setOnClickListener {
            IntenHelper.navigate(requireActivity(), ProfileEditActivity::class.java)
        }
        
        binding.btnPrivacy.setOnClickListener {
            IntenHelper.navigate(requireActivity(), PrivasiActivity::class.java)
        }
        
        binding.btnChangePassword.setOnClickListener {
            Toasthelper.show(requireContext(), "Fitur Ubah Sandi segera hadir")
        }
    }

    private fun observeViewModel() {
        val privacyManager = PrivacyManager(requireContext())
        
        viewModel.meState.observe(viewLifecycleOwner) { state ->
            when (state) {
                is State.Loading -> { }
                is State.Success -> {
                    val user = state.data
                    binding.tvFullname.text = user.fullname ?: "-"

                    if (privacyManager.isEmailVisible()) {
                        binding.tvEmail.text = user.email ?: "-"
                        binding.tvEmail.visibility = View.VISIBLE
                    } else {
                        binding.tvEmail.visibility = View.GONE
                    }

                    if (!user.profile_photo.isNullOrEmpty()) {
                        val baseUrl = RetrofitInstance.baseUrl.replace("api/", "")
                        val cleanPath = user.profile_photo.replace("\\", "/")
                        val imageUrl = baseUrl + cleanPath

                        Glide.with(this)
                            .load(imageUrl)
                            .placeholder(R.drawable.img_black)
                            .error(R.drawable.img_black)
                            .into(binding.ivProfile)
                    }

                    AuthManager(requireContext()).save(user)
                }
                is State.Error -> {
                    Toasthelper.show(requireContext(), state.message ?: "Gagal memuat data profile")
                }
            }
        }
    }

    private fun logout() {
        AuthManager(requireContext()).remove()
        TokenManager(requireContext()).removeToken()

        IntenHelper.navigate(requireActivity(), LoginActivity::class.java)
        requireActivity().finishAffinity()
        
        Toasthelper.show(requireContext(), "Berhasil keluar")
    }

    override fun onResume() {
        super.onResume()
        viewModel.getMe(requireContext())
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
