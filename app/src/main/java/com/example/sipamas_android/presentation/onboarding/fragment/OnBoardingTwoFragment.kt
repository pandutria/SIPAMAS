package com.example.sipamas_android.presentation.onboarding.fragment

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.findNavController
import com.example.sipamas_android.R
import com.example.sipamas_android.databinding.FragmentOnBoardingTwoBinding
import com.example.sipamas_android.utils.IntenHelper.handleOnBackPressed

class OnBoardingTwoFragment : Fragment() {
    private var _binding: FragmentOnBoardingTwoBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentOnBoardingTwoBinding.inflate(layoutInflater, container, false)

        binding.btnBack.setOnClickListener {
            findNavController().popBackStack()
        }

        binding.tvSkip.setOnClickListener {
            findNavController().navigate(R.id.action_onboard2Screen_to_onboard3Screen)
        }

        binding.btnNext.setOnClickListener {
            findNavController().navigate(R.id.action_onboard2Screen_to_onboard3Screen)
        }

        handleOnBackPressed {
            findNavController().popBackStack()
        }

        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}