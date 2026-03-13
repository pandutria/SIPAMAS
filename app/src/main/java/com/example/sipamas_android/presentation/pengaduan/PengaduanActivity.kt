package com.example.sipamas_android.presentation.pengaduan

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Geocoder
import android.location.Location
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.lifecycleScope
import com.bumptech.glide.Glide
import com.example.sipamas_android.R
import com.example.sipamas_android.data.local.PrivacyManager
import com.example.sipamas_android.data.model.CategoryView
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.databinding.ActivityPengaduanBinding
import com.example.sipamas_android.presentation.detail.PengaduanDetailActivity
import com.example.sipamas_android.presentation.map.SelectMapActivity
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.LogHelper
import com.example.sipamas_android.utils.Toasthelper
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.util.Locale

class PengaduanActivity : AppCompatActivity(), OnMapReadyCallback {
    private var _binding: ActivityPengaduanBinding? = null
    private val binding get() = _binding!!

    private var selectedCategory: String = ""
    private var mediaUris: List<Uri> = listOf()

    private var mMap: GoogleMap? = null
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var currentLatLng: LatLng? = null
    private lateinit var privacyManager: PrivacyManager

    private val defaultLatLng = LatLng(0.4811, 128.2411)

    private var pengaduanId: Int? = null
    private var uploadedMediaCount = 0

    private val viewModel: PengaduanViewModel by viewModels {
        PengaduanModelFactory(PengaduanRepository())
    }

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val fineLocationGranted =
            permissions.getOrDefault(Manifest.permission.ACCESS_FINE_LOCATION, false)
        val coarseLocationGranted =
            permissions.getOrDefault(Manifest.permission.ACCESS_COARSE_LOCATION, false)

        if (fineLocationGranted || coarseLocationGranted) {
            getCurrentLocation()
        } else {
            Toasthelper.show(
                this,
                "Izin lokasi ditolak. Menggunakan lokasi default Halmahera Tengah."
            )
            useDefaultLocation()
        }
    }

    private val selectMapLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == RESULT_OK) {
                val lat = result.data?.getDoubleExtra("latitude", 0.0) ?: 0.0
                val lng = result.data?.getDoubleExtra("longitude", 0.0) ?: 0.0
                if (lat != 0.0 && lng != 0.0) {
                    currentLatLng = LatLng(lat, lng)
                    updateMap()
                    getAddressFromLatLng(lat, lng)
                }
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        _binding = ActivityPengaduanBinding.inflate(layoutInflater)
        setContentView(binding.root)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = true

        privacyManager = PrivacyManager(this)
        mediaUris = intent.getParcelableArrayListExtra<Uri>("EXTRA_MEDIA_URIS") ?: listOf()

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.mapFragment) as SupportMapFragment
        mapFragment.getMapAsync(this)

        setupAction()
        setupCategorySelection()
        displayMediaPreviews()
        observeViewModel()

        checkLocationPermission()
    }

    private fun setupAction() {
        binding.ivBack.setOnClickListener {
            IntenHelper.finish(this)
        }
        binding.tvEdit.setOnClickListener {
            IntenHelper.finish(this)
        }
        binding.btnGps.setOnClickListener {
            val intent = Intent(this, SelectMapActivity::class.java)
            selectMapLauncher.launch(intent)
        }

        binding.btnSend.setOnClickListener {
            createPengaduan()
        }
    }

    private fun createPengaduan() {
        val judul = binding.etFullname.text.toString()
        val deskripsi = binding.etDesc.text.toString()
        val kategori = selectedCategory
        val alamat = binding.etSearch.text.toString()
        val latitude = currentLatLng?.latitude.toString()
        val longitude = currentLatLng?.longitude.toString()

        if (judul.isEmpty() || deskripsi.isEmpty() || kategori.isEmpty() || alamat.isEmpty()) {
            Toasthelper.show(this, "Mohon lengkapi semua data")
            return
        }

        viewModel.create(this, judul, deskripsi, kategori, alamat, latitude, longitude)
    }

    private fun observeViewModel() {
        viewModel.createState.observe(this) { state ->
            when (state) {
                is State.Loading -> {
                    binding.pbLoading.visibility = View.VISIBLE
                    binding.btnSend.visibility = View.INVISIBLE
                }

                is State.Success -> {
                    pengaduanId = state.data.id
                    if (mediaUris.isNotEmpty()) {
                        uploadMedia(pengaduanId!!)
                    } else {
                        navigateToDetail(pengaduanId!!)
                    }
                }

                is State.Error -> {
                    binding.pbLoading.visibility = View.GONE
                    binding.btnSend.visibility = View.VISIBLE
                    Toasthelper.show(this, state.message ?: "Gagal membuat pengaduan")
                }

                else -> {
                    binding.pbLoading.visibility = View.GONE
                    binding.btnSend.visibility = View.VISIBLE
                }
            }
        }

        viewModel.createMediaState.observe(this) { state ->
            when (state) {
                is State.Loading -> {}
                is State.Success -> {
                    uploadedMediaCount++
                    checkUploadStatus()
                }

                is State.Error -> {
                    uploadedMediaCount++
                    Toasthelper.show(this, "Gagal mengunggah salah satu media: ${state.message}")
                    LogHelper.log(state.error)
                    checkUploadStatus()
                }

                else -> {}
            }
        }
    }

    private fun checkUploadStatus() {
        if (uploadedMediaCount >= mediaUris.size) {
            navigateToDetail(pengaduanId!!)
        }
    }

    private fun navigateToDetail(id: Int) {
        binding.pbLoading.visibility = View.GONE
        Toasthelper.show(this, "Berhasil membuat pengaduan")
        val bundle = Bundle().apply { putInt("id", id) }

        setResult(RESULT_OK)

        IntenHelper.navigate(this, PengaduanDetailActivity::class.java, bundle)
        finish()
    }

    private fun uploadMedia(pengaduanId: Int) {
        uploadedMediaCount = 0
        mediaUris.forEach { uri ->
            lifecycleScope.launch {
                val file = withContext(Dispatchers.IO) { uriToFile(uri) }
                val mediaType =
                    if (contentResolver.getType(uri)?.contains("video") == true || uri.toString()
                            .contains(".mp4")
                    ) "video" else "image"
                viewModel.createMedia(this@PengaduanActivity, pengaduanId, mediaType, file)
            }
        }
    }

    private fun uriToFile(uri: Uri): File {
        val fileName = getFileName(uri) ?: "temp_media"
        val extension = fileName.substringAfterLast(".", "tmp")
        val prefix = fileName.substringBeforeLast(".", "temp_media")
        
        val myFile = File.createTempFile(prefix, ".$extension", cacheDir)
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

    @SuppressLint("Range")
    private fun getFileName(uri: Uri): String? {
        var result: String? = null
        if (uri.scheme == "content") {
            val cursor = contentResolver.query(uri, null, null, null, null)
            cursor.use {
                if (it != null && it.moveToFirst()) {
                    result = it.getString(it.getColumnIndex(OpenableColumns.DISPLAY_NAME))
                }
            }
        }
        if (result == null) {
            result = uri.path
            val cut = result?.lastIndexOf('/')
            if (cut != -1) {
                result = result?.substring(cut!! + 1)
            }
        }
        return result
    }

    private fun checkLocationPermission() {
        if (!privacyManager.isLocationEnabled()) {
            Toasthelper.show(
                this,
                "Akses lokasi dinonaktifkan di Pengaturan Privasi. Menggunakan lokasi default."
            )
            useDefaultLocation()
            return
        }

        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {

            requestPermissionLauncher.launch(
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                )
            )
        } else {
            getCurrentLocation()
        }
    }

    @SuppressLint("MissingPermission")
    private fun getCurrentLocation() {
        fusedLocationClient.lastLocation.addOnSuccessListener { location: Location? ->
            if (location != null) {
                currentLatLng = LatLng(location.latitude, location.longitude)
                updateMap()
                getAddressFromLatLng(location.latitude, location.longitude)
            } else {
                Toasthelper.show(
                    this,
                    "Gagal mendapatkan lokasi otomatis. Menggunakan lokasi default."
                )
                useDefaultLocation()
            }
        }.addOnFailureListener {
            useDefaultLocation()
        }
    }

    private fun useDefaultLocation() {
        currentLatLng = defaultLatLng
        updateMap()
        getAddressFromLatLng(defaultLatLng.latitude, defaultLatLng.longitude)
    }

    private fun getAddressFromLatLng(lat: Double, lng: Double) {
        val geocoder = Geocoder(this, Locale.getDefault())
        try {
            val addresses = geocoder.getFromLocation(lat, lng, 1)
            if (!addresses.isNullOrEmpty()) {
                val address = addresses[0].getAddressLine(0)
                binding.etSearch.setText(address)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun setupCategorySelection() {
        val categories = listOf(
            CategoryView(
                binding.layoutJalanRusak,
                binding.icJalanRusak,
                binding.tvJalanRusak,
                "Jalan Rusak",
                R.drawable.ic_jalan_rusak_selected,
                R.drawable.ic_jalan_rusak_unselected
            ),
            CategoryView(
                binding.layoutSampah,
                binding.icSampah,
                binding.tvSampah,
                "Sampah",
                R.drawable.ic_trash_selected,
                R.drawable.ic_trash_unselected
            ),
            CategoryView(
                binding.layoutaBanjir,
                binding.icBanjir,
                binding.tvBanjir,
                "Banjir",
                R.drawable.ic_banjir_selected,
                R.drawable.ic_banjir_unselected
            ),
            CategoryView(
                binding.layoutMacet,
                binding.icMacet,
                binding.tvMacet,
                "Macet",
                R.drawable.ic_macet_selected,
                R.drawable.ic_macet_unselected
            ),
            CategoryView(
                binding.layoutPolusi,
                binding.icPolusi,
                binding.tvPolusi,
                "Polusi",
                R.drawable.ic_polusi_selected,
                R.drawable.ic_polusi_unselected
            ),
            CategoryView(
                binding.layoutOther,
                binding.icOther,
                binding.tvOther,
                "Lainnya",
                R.drawable.ic_other_selected,
                R.drawable.ic_other_unselected
            )
        )

        categories.forEach { category ->
            category.layout.setOnClickListener {
                selectCategory(category, categories)
            }
        }

        selectCategory(categories[0], categories)
    }

    private fun selectCategory(selected: CategoryView, allCategories: List<CategoryView>) {
        selectedCategory = selected.name

        allCategories.forEach { category ->
            val isSelected = category == selected

            category.layout.background = ContextCompat.getDrawable(
                this,
                if (isSelected) R.drawable.bg_category_selected else R.drawable.bg_category_unselected
            )

            category.icon.setImageResource(if (isSelected) category.selectedIconRes else category.unselectedIconRes)

            val colorRes = if (isSelected) R.color.primary else R.color.textSecondary
            category.textView.setTextColor(ContextCompat.getColor(this, colorRes))
        }
    }

    private fun displayMediaPreviews() {
        val placeholders =
            listOf(binding.imgPlaceholder1, binding.imgPlaceholder2, binding.imgPlaceholder3)
        val previews = listOf(binding.cvPreview1, binding.cvPreview2, binding.cvPreview3)
        val previewImages = listOf(binding.imgPreview1, binding.imgPreview2, binding.imgPreview3)

        binding.btnClose1.visibility = View.GONE
        binding.btnClose2.visibility = View.GONE
        binding.btnClose3.visibility = View.GONE

        for (i in 0 until 3) {
            if (i < mediaUris.size) {
                placeholders[i].visibility = View.GONE
                previews[i].visibility = View.VISIBLE

                Glide.with(this)
                    .load(mediaUris[i])
                    .into(previewImages[i])
            } else {
                placeholders[i].visibility = View.VISIBLE
                previews[i].visibility = View.GONE
            }
        }
    }

    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap
        updateMap()
    }

    private fun updateMap() {
        val map = mMap ?: return
        val latLng = currentLatLng ?: defaultLatLng

        map.clear()
        map.addMarker(MarkerOptions().position(latLng).title("Lokasi Kejadian"))
        map.animateCamera(CameraUpdateFactory.newLatLngZoom(latLng, 15f))
        map.uiSettings.isZoomControlsEnabled = true
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
