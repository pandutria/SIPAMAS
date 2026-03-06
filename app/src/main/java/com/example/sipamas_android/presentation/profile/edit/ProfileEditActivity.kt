package com.example.sipamas_android.presentation.profile.edit

import android.annotation.SuppressLint
import android.net.Uri
import android.os.Bundle
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.bumptech.glide.Glide
import com.example.sipamas_android.R
import com.example.sipamas_android.data.local.AuthManager
import com.example.sipamas_android.data.remote.RetrofitInstance
import com.example.sipamas_android.data.repository.AuthRepository
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.databinding.ActivityProfileEditBinding
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.Toasthelper
import java.io.File
import java.io.FileOutputStream

class ProfileEditActivity : AppCompatActivity() {
    private var _binding: ActivityProfileEditBinding? = null
    private val binding get() = _binding!!

    private val viewModel: ProfileEditViewModel by viewModels {
        ProfileEditViewModelFactory(AuthRepository())
    }

    private var selectedImageFile: File? = null

    private val pickImageLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        uri?.let {
            val file = uriToFile(it)
            selectedImageFile = file
            Glide.with(this).load(it).into(binding.ivProfile)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        _binding = ActivityProfileEditBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = true

        setupInitialData()
        setupAction()
        observeViewModel()
    }

    private fun setupInitialData() {
        val auth = AuthManager(this).get()
        binding.etNama.setText(auth?.fullname)
        binding.etEmail.setText(auth?.email)

        if (!auth?.profile_photo.isNullOrEmpty()) {
            val baseUrl = RetrofitInstance.baseUrl.replace("api/", "")
            val cleanPath = auth?.profile_photo!!.replace("\\", "/")
            val imageUrl = baseUrl + cleanPath

            Glide.with(this)
                .load(imageUrl)
                .placeholder(R.drawable.img_black)
                .error(R.drawable.img_black)
                .into(binding.ivProfile)
        }
    }

    private fun setupAction() {
        binding.ivBack.setOnClickListener {
            IntenHelper.finish(this)
        }

        binding.tvUbahFoto.setOnClickListener {
            pickImageLauncher.launch("image/*")
        }

        binding.btnSave.setOnClickListener {
            val fullname = binding.etNama.text.toString()
            val email = binding.etEmail.text.toString()

            if (fullname.isEmpty() || email.isEmpty()) {
                Toasthelper.show(this, "Mohon lengkapi data")
                return@setOnClickListener
            }

            viewModel.updateProfile(this, fullname, email, selectedImageFile)
        }
    }

    private fun observeViewModel() {
        viewModel.updateState.observe(this) { state ->
            when (state) {
                is State.Loading -> {
                    binding.pbLoading.visibility = View.VISIBLE
                    binding.btnSave.visibility = View.GONE
                }
                is State.Success -> {
                    binding.pbLoading.visibility = View.GONE
                    binding.btnSave.visibility = View.VISIBLE
                    Toasthelper.show(this, state.message)
                    AuthManager(this).save(state.data)
                    IntenHelper.finish(this)
                }
                is State.Error -> {
                    binding.pbLoading.visibility = View.GONE
                    binding.btnSave.visibility = View.VISIBLE
                    Toasthelper.show(this, state.message ?: "Error")
                }
            }
        }
    }

    private fun uriToFile(uri: Uri): File {
        val myFile = File.createTempFile("profile_temp", ".jpg", cacheDir)
        val inputStream = contentResolver.openInputStream(uri)
        val outputStream = FileOutputStream(myFile)
        val buffer = ByteArray(1024)
        var length: Int
        while (inputStream?.read(buffer).also { length = it!! } != -1) {
            outputStream.write(buffer, 0, length)
        }
        outputStream.flush()
        outputStream.close()
        inputStream?.close()
        return myFile
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
