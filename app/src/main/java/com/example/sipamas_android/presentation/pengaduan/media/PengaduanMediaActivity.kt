package com.example.sipamas_android.presentation.pengaduan.media

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.bumptech.glide.Glide
import com.example.sipamas_android.R
import com.example.sipamas_android.databinding.ActivityPengaduanMediaBinding
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.Toasthelper
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class PengaduanMediaActivity : AppCompatActivity() {
    private var _binding: ActivityPengaduanMediaBinding? = null
    private val binding get() = _binding!!

    private val selectedMediaUris = mutableListOf<Uri>()
    private var tempUri: Uri? = null

    private val takePictureLauncher = registerForActivityResult(ActivityResultContracts.TakePicture()) { success ->
        if (success) {
            tempUri?.let { uri ->
                if (selectedMediaUris.size < 3) {
                    selectedMediaUris.add(uri)
                    updateUI()
                } else {
                    Toasthelper.show(this, "Maksimal 3 media")
                }
            }
        }
    }

    private val captureVideoLauncher = registerForActivityResult(ActivityResultContracts.CaptureVideo()) { success ->
        if (success) {
            tempUri?.let { uri ->
                if (selectedMediaUris.size < 3) {
                    selectedMediaUris.add(uri)
                    updateUI()
                } else {
                    Toasthelper.show(this, "Maksimal 3 media")
                }
            }
        }
    }

    private val requestPermissionLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
        if (isGranted) {
            showCameraOptions()
        } else {
            Toasthelper.show(this, "Izin kamera ditolak")
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        _binding = ActivityPengaduanMediaBinding.inflate(layoutInflater)
        setContentView(binding.root)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = true

        setupAction()
        updateUI()
    }

    private fun setupAction() {
        binding.ivBack.setOnClickListener {
            IntenHelper.finish(this)
        }

        binding.layoutTakePhoto.setOnClickListener {
            if (selectedMediaUris.size < 3) {
                checkPermissionAndShowOptions()
            } else {
                Toasthelper.show(this, "Maksimal memilih 3 File")
            }
        }

        binding.btnClose1.setOnClickListener { removeMedia(0) }
        binding.btnClose2.setOnClickListener { removeMedia(1) }
        binding.btnClose3.setOnClickListener { removeMedia(2) }

        binding.tvDeleteAll.setOnClickListener {
            selectedMediaUris.clear()
            updateUI()
        }
    }

    private fun checkPermissionAndShowOptions() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            showCameraOptions()
        } else {
            requestPermissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    private fun showCameraOptions() {
        val options = arrayOf("Ambil Foto", "Rekam Video")
        AlertDialog.Builder(this)
            .setTitle("Pilih Media")
            .setItems(options) { _, which ->
                when (which) {
                    0 -> openCameraForPhoto()
                    1 -> openCameraForVideo()
                }
            }
            .show()
    }

    private fun openCameraForPhoto() {
        val photoFile = createTempFile(".jpg", Environment.DIRECTORY_PICTURES)
        val uri = FileProvider.getUriForFile(
            this,
            "${applicationContext.packageName}.fileprovider",
            photoFile
        )
        tempUri = uri
        takePictureLauncher.launch(uri)
    }

    private fun openCameraForVideo() {
        val videoFile = createTempFile(".mp4", Environment.DIRECTORY_MOVIES)
        val uri = FileProvider.getUriForFile(
            this,
            "${applicationContext.packageName}.fileprovider",
            videoFile
        )
        tempUri = uri
        captureVideoLauncher.launch(uri)
    }

    private fun createTempFile(extension: String, environmentDir: String): File {
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val storageDir = getExternalFilesDir(environmentDir)
        return File.createTempFile("MEDIA_${timeStamp}_", extension, storageDir)
    }

    private fun removeMedia(index: Int) {
        if (index < selectedMediaUris.size) {
            selectedMediaUris.removeAt(index)
            updateUI()
        }
    }

    private fun updateUI() {
        val placeholders = listOf(binding.imgPlaceholder1, binding.imgPlaceholder2, binding.imgPlaceholder3)
        val previews = listOf(binding.cvPreview1, binding.cvPreview2, binding.cvPreview3)
        val previewImages = listOf(binding.imgPreview1, binding.imgPreview2, binding.imgPreview3)
        val closeButtons = listOf(binding.btnClose1, binding.btnClose2, binding.btnClose3)

        for (i in 0 until 3) {
            if (i < selectedMediaUris.size) {
                placeholders[i].visibility = View.GONE
                previews[i].visibility = View.VISIBLE
                closeButtons[i].visibility = View.VISIBLE
                
                Glide.with(this)
                    .load(selectedMediaUris[i])
                    .into(previewImages[i])
            } else {
                placeholders[i].visibility = View.VISIBLE
                previews[i].visibility = View.GONE
                closeButtons[i].visibility = View.GONE
            }
        }

        binding.tvCountMedia.text = "(${selectedMediaUris.size}/3)"
        binding.tvDeleteAll.visibility = if (selectedMediaUris.isNotEmpty()) View.VISIBLE else View.GONE
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
