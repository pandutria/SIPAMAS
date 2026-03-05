package com.example.sipamas_android.presentation.map

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.RecyclerView
import com.example.sipamas_android.R
import com.example.sipamas_android.data.local.PrivacyManager
import com.example.sipamas_android.databinding.ActivitySelectMapBinding
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.Toasthelper
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.google.android.libraries.places.api.Places
import com.google.android.libraries.places.api.model.AutocompleteSessionToken
import com.google.android.libraries.places.api.model.Place
import com.google.android.libraries.places.api.net.FetchPlaceRequest
import com.google.android.libraries.places.api.net.FindAutocompletePredictionsRequest
import com.google.android.libraries.places.api.net.PlacesClient
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.Locale

class SelectMapActivity : AppCompatActivity(), OnMapReadyCallback {
    private var _binding: ActivitySelectMapBinding? = null
    private val binding get() = _binding!!

    private var mMap: GoogleMap? = null
    private var selectedLatLng: LatLng? = null
    private var searchJob: Job? = null
    private lateinit var privacyManager: PrivacyManager
    private lateinit var placesClient: PlacesClient

    private val defaultLatLng = LatLng(0.4811, 128.2411)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        _binding = ActivitySelectMapBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = true

        privacyManager = PrivacyManager(this)

        val apiKey = try {
            val ai = packageManager.getApplicationInfo(packageName, PackageManager.GET_META_DATA)
            ai.metaData.getString("com.google.android.geo.API_KEY") ?: ""
        } catch (e: Exception) { "" }

        if (!Places.isInitialized()) {
            Places.initialize(applicationContext, apiKey)
        }
        placesClient = Places.createClient(this)

        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.mapFragment) as SupportMapFragment
        mapFragment.getMapAsync(this)

        val initialLat = intent.getDoubleExtra("latitude", 0.0)
        val initialLng = intent.getDoubleExtra("longitude", 0.0)
        if (initialLat != 0.0 && initialLng != 0.0) {
            selectedLatLng = LatLng(initialLat, initialLng)
        }

        setupAction()
        setupSearch()
    }

    private fun setupAction() {
        binding.ivBack.setOnClickListener {
            IntenHelper.finish(this)
        }

        binding.btnSave.setOnClickListener {
            if (selectedLatLng != null) {
                val resultIntent = Intent().apply {
                    putExtra("latitude", selectedLatLng!!.latitude)
                    putExtra("longitude", selectedLatLng!!.longitude)
                }
                setResult(RESULT_OK, resultIntent)
                finish()
            } else {
                Toasthelper.show(this, "Silakan pilih lokasi di peta terlebih dahulu")
            }
        }
    }

    private fun setupSearch() {
        binding.etSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                searchJob?.cancel()
                if (!s.isNullOrBlank() && s.length > 2) {
                    searchJob = lifecycleScope.launch {
                        delay(800)
                        searchLocation(s.toString())
                    }
                } else {
                    binding.rvSuggestions.visibility = View.GONE
                }
            }
            override fun afterTextChanged(s: Editable?) {}
        })
    }

    private fun searchLocation(query: String) {
        val token = AutocompleteSessionToken.newInstance()
        val request = FindAutocompletePredictionsRequest.builder()
            .setQuery(query)
            .setSessionToken(token)
            .build()

        placesClient.findAutocompletePredictions(request)
            .addOnSuccessListener { response ->
                val suggestions = response.autocompletePredictions.map {
                    it.getFullText(null).toString()
                }
                val placeIds = response.autocompletePredictions.map {
                    it.placeId
                }
                if (suggestions.isNotEmpty()) {
                    showSuggestionsPlaces(suggestions, placeIds)
                } else {
                    binding.rvSuggestions.visibility = View.GONE
                }
            }
            .addOnFailureListener {
                binding.rvSuggestions.visibility = View.GONE
            }
    }

    private fun showSuggestionsPlaces(suggestions: List<String>, placeIds: List<String>) {
        binding.rvSuggestions.visibility = View.VISIBLE
        binding.rvSuggestions.adapter = object : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
            override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
                val view = layoutInflater.inflate(android.R.layout.simple_list_item_1, parent, false)
                return object : RecyclerView.ViewHolder(view) {}
            }

            override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
                val textView = holder.itemView as TextView
                textView.text = suggestions[position]
                textView.textSize = 14f
                textView.setPadding(30, 30, 30, 30)
                textView.setBackgroundColor(ContextCompat.getColor(this@SelectMapActivity, R.color.bg))
                textView.setTextColor(ContextCompat.getColor(this@SelectMapActivity, R.color.textPrimary))
                
                holder.itemView.setOnClickListener {
                    fetchPlaceDetails(placeIds[position], suggestions[position])
                    binding.etSearch.setText(suggestions[position])
                    binding.rvSuggestions.visibility = View.GONE
                }
            }

            override fun getItemCount(): Int = suggestions.size
        }
    }

    private fun fetchPlaceDetails(placeId: String, title: String) {
        val placeFields = listOf(Place.Field.LAT_LNG)
        val request = FetchPlaceRequest.newInstance(placeId, placeFields)

        placesClient.fetchPlace(request)
            .addOnSuccessListener { response ->
                val place = response.place
                place.latLng?.let { latLng ->
                    updateMapSelection(latLng, title)
                }
            }
            .addOnFailureListener {
                Toasthelper.show(this, "Gagal memuat detail lokasi")
            }
    }

    private fun updateMapSelection(latLng: LatLng, title: String = "Lokasi Terpilih") {
        selectedLatLng = latLng
        mMap?.apply {
            clear()
            addMarker(MarkerOptions().position(latLng).title(title))
            animateCamera(CameraUpdateFactory.newLatLngZoom(latLng, 17f))
        }
    }

    @SuppressLint("MissingPermission")
    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap
        
        val hasPermission = ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
        
        if (selectedLatLng != null && selectedLatLng!!.latitude != 0.0) {
            updateMapSelection(selectedLatLng!!, "Lokasi Terpilih")
        } else if (privacyManager.isLocationEnabled() && hasPermission) {
            mMap?.isMyLocationEnabled = true
            googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(defaultLatLng, 10f))
        } else {
            if (!privacyManager.isLocationEnabled()) {
                Toasthelper.show(this, "Akses lokasi dinonaktifkan di Pengaturan Privasi. Menggunakan lokasi default.")
            }
            updateMapSelection(defaultLatLng, "Pusat Halmahera Tengah")
        }

        googleMap.setOnMapClickListener { latLng ->
            updateMapSelection(latLng)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }
}
