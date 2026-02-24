package com.example.sipamas_android.presentation.onboarding.fragment

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.findNavController
import com.example.sipamas_android.R
import com.example.sipamas_android.databinding.FragmentOnBoardingThreeBinding
import com.example.sipamas_android.presentation.auth.login.LoginActivity
import com.example.sipamas_android.presentation.auth.register.RegisterActivity
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.IntenHelper.handleOnBackPressed

class OnBoardingThreeFragment : Fragment() {
    private var _binding: FragmentOnBoardingThreeBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentOnBoardingThreeBinding.inflate(layoutInflater, container, false)

        handleOnBackPressed {
            findNavController().popBackStack()
        }

        binding.btnLogin.setOnClickListener {
            IntenHelper.navigate(requireActivity(), LoginActivity::class.java)
            requireActivity().finish()
        }

        binding.btnRegister.setOnClickListener {
            IntenHelper.navigate(requireActivity(), RegisterActivity::class.java)
            requireActivity().finish()
        }

        return binding.root
    }
}