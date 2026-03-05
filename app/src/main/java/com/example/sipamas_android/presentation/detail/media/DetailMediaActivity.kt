package com.example.sipamas_android.presentation.detail.media

import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.MediaController
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.bumptech.glide.Glide
import com.example.sipamas_android.R
import com.example.sipamas_android.databinding.ActivityDetailMediaBinding
import com.example.sipamas_android.utils.IntenHelper

class DetailMediaActivity : AppCompatActivity() {
    private var _binding: ActivityDetailMediaBinding? = null
    private val binding get() = _binding!!

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        _binding = ActivityDetailMediaBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = false

        binding.ivBack.setOnClickListener {
            IntenHelper.finish(this)
        }

        val mediaUrl = intent.getStringExtra("media_url")
        val mediaType = intent.getStringExtra("media_type")

        if (mediaUrl.isNullOrEmpty()) {
            IntenHelper.finish(this)
            return
        }

        if (mediaType == "video") {
            showVideo(mediaUrl)
        } else {
            showImage(mediaUrl)
        }
    }

    private fun showImage(url: String) {
        binding.imgFull.visibility = View.VISIBLE
        binding.videoFull.visibility = View.GONE
        
        Glide.with(this)
            .load(url)
            .placeholder(R.drawable.img_black)
            .into(binding.imgFull)
    }

    private fun showVideo(url: String) {
        binding.imgFull.visibility = View.GONE
        binding.videoFull.visibility = View.VISIBLE
        binding.pbLoading.visibility = View.VISIBLE

        val uri = Uri.parse(url)
        binding.videoFull.setVideoURI(uri)
        
        val mediaController = MediaController(this)
        mediaController.setAnchorView(binding.videoFull)
        binding.videoFull.setMediaController(mediaController)

        binding.videoFull.setOnPreparedListener { 
            binding.pbLoading.visibility = View.GONE
            it.start() 
        }
        
        binding.videoFull.setOnErrorListener { _, _, _ ->
            binding.pbLoading.visibility = View.GONE
            false
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }
}
