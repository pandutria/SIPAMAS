package com.example.sipamas_android.presentation.detail

import android.graphics.Color
import android.location.Geocoder
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.example.sipamas_android.R
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.databinding.ActivityPengaduanDetailBinding
import com.example.sipamas_android.presentation.adapter.LampiranAdapter
import com.example.sipamas_android.presentation.adapter.LinimasaAdapter
import com.example.sipamas_android.utils.DateHelper
import com.example.sipamas_android.utils.IdHelper
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.LogHelper
import com.example.sipamas_android.utils.Toasthelper
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import java.io.IOException

class PengaduanDetailActivity : AppCompatActivity(), OnMapReadyCallback {
    private var _binding: ActivityPengaduanDetailBinding? = null
    private val binding get() = _binding!!

    private val viewModel: PengaduanDetailViewModel by viewModels {
        PengaduanDetailViewModelFactory(PengaduanRepository())
    }
    private lateinit var mediaAdapter: LampiranAdapter
    private lateinit var timelineAdapter: LinimasaAdapter

    private var mMap: GoogleMap? = null
    private var currentLatLng: LatLng? = null

    private lateinit var googleMap: GoogleMap

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        _binding = ActivityPengaduanDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = true

        binding.ivBack.setOnClickListener {
            IntenHelper.finish(this)
        }

        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.mapFragment) as SupportMapFragment

        mapFragment.getMapAsync(this)

        mediaAdapter = LampiranAdapter()
        timelineAdapter = LinimasaAdapter()
        binding.rvLampiran.adapter = mediaAdapter
        binding.rvTimeline.adapter = timelineAdapter

        val id = intent.getIntExtra("id", 0)
        binding.tvHeaderTitle.text = "Pelaporan ${IdHelper.formatId(id)}"
        viewModel.getById(this, id)
        viewModel.getState.observe(this) { state ->
            when (state) {
                is State.Loading -> {
                    binding.layoutContent.visibility = View.GONE
                    binding.pbLoading.visibility = View.VISIBLE
                }

                is State.Success -> {
                    binding.layoutContent.visibility = View.VISIBLE
                    binding.pbLoading.visibility = View.GONE

                    binding.tvTitle.text = state.data.judul
                    binding.tvCategory.text = state.data.kategori
                    binding.tvDescription.text = state.data.deskripsi
                    binding.tvAddress.text = state.data.alamat
                    setStatus(state.data.status ?: "Menunggu")
                    binding.tvDate.text =
                        "Diajukan pada ${DateHelper.format(state.data.created_at)}"
                    binding.tvKordinat.text =
                        "Kordinat: ${state.data.latitude} ${state.data.longitude}"

                    mediaAdapter.setData(state.data.medias ?: emptyList())
                    timelineAdapter.setData(state.data.timelines?.sortedByDescending { x -> x.created_at } ?: emptyList())

                    val lat = state.data.latitude?.toDoubleOrNull()
                    val lng = state.data.longitude?.toDoubleOrNull()
                    if (lat != null && lng != null) {
                        currentLatLng = LatLng(lat, lng)
                        updateMap()
                    } else {
                        state.data.alamat?.let { address ->
                            getLatLngFromAddress(address)
                        }
                    }
                }

                is State.Error -> {
                    Toasthelper.show(this, state.message ?: "Error")
                    IntenHelper.finish(this)
                }

                else -> {
                    Toasthelper.show(this, "Error")
                    IntenHelper.finish(this)
                }
            }
        }
    }

    private fun getLatLngFromAddress(address: String) {
        val geocoder = Geocoder(this)
        try {
            val list = geocoder.getFromLocationName(address, 1)
            if (!list.isNullOrEmpty()) {
                val location = list[0]
                currentLatLng = LatLng(location.latitude, location.longitude)
                updateMap()
                binding.tvKordinat.text = "Kordinat: ${location.latitude} ${location.longitude}"
            }
        } catch (e: IOException) {
            Log.e("Geocoder", "Error fetching location from address", e)
        }
    }

    private fun setStatus(status: String) {
        val colorGray = Color.parseColor("#BCBCBC")
        val colorPrimary = ContextCompat.getColor(this, R.color.primary)

        when (status) {
            "Ditolak" -> {
                binding.ivStatus1.setImageResource(R.drawable.ic_ditolak)
                binding.ivStatus2.setImageResource(R.drawable.ic_menunggu_gray)
                binding.ivStatus3.setImageResource(R.drawable.ic_diterima_gray)

                binding.tvStatusLabel1.text = "Ditolak"
                binding.tvStatusLabel2.text = "Menunggu"
                binding.tvStatusLabel3.text = "Diterima"

                binding.viewLine1.setBackgroundColor(colorGray)
                binding.viewLine2.setBackgroundColor(colorGray)
            }

            "Menunggu" -> {
                binding.ivStatus1.setImageResource(R.drawable.ic_ditolak_gray)
                binding.ivStatus2.setImageResource(R.drawable.ic_menunggu)
                binding.ivStatus3.setImageResource(R.drawable.ic_diterima_gray)

                binding.tvStatusLabel1.text = "Ditolak"
                binding.tvStatusLabel2.text = "Menunggu"
                binding.tvStatusLabel3.text = "Diterima"

                binding.viewLine1.setBackgroundColor(colorGray)
                binding.viewLine2.setBackgroundColor(colorGray)
            }

            "Diterima" -> {
                binding.ivStatus1.setImageResource(R.drawable.ic_menunggu)
                binding.ivStatus2.setImageResource(R.drawable.ic_diterima)
                binding.ivStatus3.setImageResource(R.drawable.ic_diproses_gray)

                binding.tvStatusLabel1.text = "Menunggu"
                binding.tvStatusLabel2.text = "Diterima"
                binding.tvStatusLabel3.text = "Diproses"

                binding.viewLine1.setBackgroundColor(colorPrimary)
                binding.viewLine2.setBackgroundColor(colorGray)
            }

            "Diproses" -> {
                binding.ivStatus1.setImageResource(R.drawable.ic_diterima)
                binding.ivStatus2.setImageResource(R.drawable.ic_diproses)
                binding.ivStatus3.setImageResource(R.drawable.ic_selesai_gray)

                binding.tvStatusLabel1.text = "Diterima"
                binding.tvStatusLabel2.text = "Diproses"
                binding.tvStatusLabel3.text = "Sukses"

                binding.viewLine1.setBackgroundColor(colorPrimary)
                binding.viewLine2.setBackgroundColor(colorGray)
            }

            "Selesai" -> {
                binding.ivStatus1.setImageResource(R.drawable.ic_diterima)
                binding.ivStatus2.setImageResource(R.drawable.ic_diproses)
                binding.ivStatus3.setImageResource(R.drawable.ic_selesai)

                binding.tvStatusLabel1.text = "Diterima"
                binding.tvStatusLabel2.text = "Diproses"
                binding.tvStatusLabel3.text = "Sukses"

                binding.viewLine1.setBackgroundColor(colorPrimary)
                binding.viewLine2.setBackgroundColor(colorPrimary)
            }
        }
    }

    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap
        updateMap()
    }

    private fun updateMap() {
        val map = mMap ?: return
        val latLng = currentLatLng ?: return

        map.clear()
        map.addMarker(MarkerOptions().position(latLng).title("Lokasi Pengaduan"))
        map.moveCamera(CameraUpdateFactory.newLatLngZoom(latLng, 15f))
        map.uiSettings.isZoomControlsEnabled = true
    }


    override fun onBackPressed() {
        super.onBackPressed()
        IntenHelper.finish(this)
    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }
}