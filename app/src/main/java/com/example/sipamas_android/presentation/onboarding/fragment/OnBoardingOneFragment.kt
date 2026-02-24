package com.example.sipamas_android.presentation.onboarding.fragment

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.OnBackPressedCallback
import androidx.navigation.fragment.findNavController
import com.example.sipamas_android.R
import com.example.sipamas_android.databinding.FragmentOnBoardingOneBinding
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.IntenHelper.handleOnBackPressed

class OnBoardingOneFragment : Fragment() {
    private var _binding: FragmentOnBoardingOneBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentOnBoardingOneBinding.inflate(layoutInflater, container, false)

        binding.tvSkip.setOnClickListener {
            findNavController().navigate(R.id.action_onboard1Screen_to_onboard3Screen)
        }

        binding.btnNext.setOnClickListener {
            findNavController().navigate(R.id.action_onboard1Screen_to_onboard2Screen)
        }

        handleOnBackPressed {
            requireActivity().finish()
        }

        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}