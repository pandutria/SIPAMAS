package com.example.sipamas_android.presentation.privasi

import android.annotation.SuppressLint
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.example.sipamas_android.R
import com.example.sipamas_android.data.local.PrivacyManager
import com.example.sipamas_android.databinding.ActivityPrivasiBinding
import com.example.sipamas_android.utils.IntenHelper

class PrivasiActivity : AppCompatActivity() {
    private var _binding: ActivityPrivasiBinding? = null
    private val binding get() = _binding!!

    private lateinit var privacyManager: PrivacyManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        _binding = ActivityPrivasiBinding.inflate(layoutInflater)
        setContentView(binding.root)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = true

        privacyManager = PrivacyManager(this)

        setupUI()
        setupAction()
    }

    private fun setupUI() {
        binding.switchEmail.isChecked = privacyManager.isEmailVisible()
        binding.switchLocation.isChecked = privacyManager.isLocationEnabled()
        binding.switchCamera.isChecked = privacyManager.isCameraEnabled()
    }

    private fun setupAction() {
        binding.ivBack.setOnClickListener {
            IntenHelper.finish(this)
        }

        binding.switchEmail.setOnCheckedChangeListener { _, isChecked ->
            privacyManager.setEmailVisibility(isChecked)
        }

        binding.switchLocation.setOnCheckedChangeListener { _, isChecked ->
            privacyManager.setLocationAccess(isChecked)
        }

        binding.switchCamera.setOnCheckedChangeListener { _, isChecked ->
            privacyManager.setCameraAccess(isChecked)
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
