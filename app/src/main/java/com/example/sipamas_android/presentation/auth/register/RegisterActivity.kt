package com.example.sipamas_android.presentation.auth.register

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.sipamas_android.R
import com.example.sipamas_android.data.repository.AuthRepository
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.databinding.ActivityRegisterBinding
import com.example.sipamas_android.presentation.auth.login.LoginActivity
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.Toasthelper
import java.io.File
import java.io.FileOutputStream

class RegisterActivity : AppCompatActivity() {
    private var _binding: ActivityRegisterBinding? = null
    private val binding get() = _binding!!

    private val viewModel: RegisterViewModel by viewModels {
        RegisterViewModelFactory(AuthRepository())
    }

    private var selectedKtpFile: File? = null

    private val requestPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
            if (isGranted) {
                openFilePicker()
            } else {
                Toast.makeText(this, "Izin ditolak", Toast.LENGTH_SHORT).show()
            }
        }

    private val filePickerLauncher =
        registerForActivityResult(ActivityResultContracts.OpenDocument()) { uri: Uri? ->
            uri?.let {
                selectedKtpFile = uriToFile(it)
                val fileName = getFileName(it)

                binding.layoutRegister.visibility = View.GONE
                binding.layoutFilePreview.visibility = View.VISIBLE
                binding.tvFileName.text = fileName
                Toast.makeText(this, "File dipilih", Toast.LENGTH_SHORT).show()
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        _binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        binding.tvLogin.setOnClickListener {
            IntenHelper.finish(this)
        }

        binding.layoutRegister.setOnClickListener {
            val permission = if (android.os.Build.VERSION.SDK_INT >= 33) {
                Manifest.permission.READ_MEDIA_IMAGES
            } else {
                Manifest.permission.READ_EXTERNAL_STORAGE
            }

            when {
                ContextCompat.checkSelfPermission(
                    this,
                    permission
                ) == PackageManager.PERMISSION_GRANTED -> {

                    openFilePicker()
                }

                else -> {
                    requestPermissionLauncher.launch(permission)
                }
            }
        }

        viewModel.registerState.observe(this){state ->
            when(state) {
                is State.Loading -> {
                    binding.btnRegister.visibility = View.GONE
                    binding.pbLoading.visibility = View.VISIBLE
                }
                is State.Success -> {

                    Toasthelper.show(this, state.message)
                    IntenHelper.navigate(this, LoginActivity::class.java)
                }
                is State.Error -> {
                    Toasthelper.show(this, state.message ?: "Error")
                    binding.btnRegister.visibility = View.VISIBLE
                    binding.pbLoading.visibility = View.GONE
                }
                else -> {
                    Toasthelper.show(this, "Error")
                    binding.btnRegister.visibility = View.VISIBLE
                    binding.pbLoading.visibility = View.GONE
                }
            }
        }

        binding.btnRegister.setOnClickListener {
            val fullname = binding.etFullname.text.toString()
            val email = binding.etEmail.text.toString()
            val address = binding.etAddress.text.toString()
            val password = binding.etPassword.text.toString()

            val file = selectedKtpFile
            if (file == null || fullname.isEmpty() || email.isEmpty() || address.isEmpty() || password.isEmpty()) {
                Toasthelper.show(this, "Semua input wajib di isi")
                return@setOnClickListener
            }

            viewModel.register(fullname, email, address, password, file)
        }

        binding.btnRetakeFile.setOnClickListener {
            selectedKtpFile = null
            binding.layoutFilePreview.visibility = View.GONE
            binding.layoutRegister.visibility = View.VISIBLE
            binding.tvFileName.text = "-"
        }
    }

    private fun getFileName(uri: Uri): String {
        var name = "file_tidak_diketahui"
        val cursor = contentResolver.query(uri, null, null, null, null)
        cursor?.use {
            if (it.moveToFirst()) {
                val index = it.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME)
                if (index != -1) name = it.getString(index)
            }
        }
        return name
    }

    private fun openFilePicker() {
        filePickerLauncher.launch(
            arrayOf(
                "image/*",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
        )
    }

    private fun uriToFile(uri: Uri): File {
        val inputStream = contentResolver.openInputStream(uri)
        val file = File(cacheDir, "ktp_${System.currentTimeMillis()}.jpg")
        val outputStream = FileOutputStream(file)

        inputStream?.copyTo(outputStream)

        inputStream?.close()
        outputStream.close()

        return file
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