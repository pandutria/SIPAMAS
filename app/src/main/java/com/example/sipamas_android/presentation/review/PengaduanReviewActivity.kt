package com.example.sipamas_android.presentation.review

import android.os.Bundle
import android.view.View
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.bumptech.glide.Glide
import com.example.sipamas_android.MainActivity
import com.example.sipamas_android.R
import com.example.sipamas_android.data.repository.PengaduanRepository
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.databinding.ActivityPengaduanReviewBinding
import com.example.sipamas_android.utils.DateHelper
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.Toasthelper

class PengaduanReviewActivity : AppCompatActivity() {
    private var _binding: ActivityPengaduanReviewBinding? = null
    private val binding get() = _binding!!
    
    private var selectedOption: String? = null

    private val viewModel: PengaduanReviewViewModel by viewModels {
        PengaduanReviewViewModelFactory(PengaduanRepository())
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        _binding = ActivityPengaduanReviewBinding.inflate(layoutInflater)
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = true
        
        setupOptions()
        
        binding.ivBack.setOnClickListener {
            IntenHelper.finish(this)
        }

        val id = intent.getStringExtra("id")
        val pengaduanId = intent.getIntExtra("pengaduanId", 0)
        val title = intent.getStringExtra("title")
        val image = intent.getStringExtra("image")
        val updated_at = intent.getStringExtra("updated_at")
        val address = intent.getStringExtra("address")

        if (pengaduanId == 0) {
            IntenHelper.finish(this)
        }

        binding.tvId.text = id
        binding.tvTitle.text = title
        
        val shortAddress = address?.split(" ")?.take(2)?.joinToString(" ")
        binding.tvAddress.text = shortAddress ?: address

        binding.tvDate.text = "${DateHelper.formatRelative(updated_at)}"

        if (!image.isNullOrEmpty()) {
            Glide.with(this)
                .load(image)
                .placeholder(R.drawable.img_black)
                .error(R.drawable.img_black)
                .into(binding.imgImage)
        }

        viewModel.createState.observe(this){state ->
            when(state) {
                is State.Loading -> {
                    binding.pbLoading.visibility = View.VISIBLE
                    binding.btnSend.visibility = View.GONE
                }
                is State.Success -> {
                    Toasthelper.show(this, state.message)
                    IntenHelper.navigate(this, MainActivity::class.java)
                }
                is State.Error -> {
                    binding.pbLoading.visibility = View.GONE
                    binding.btnSend.visibility = View.VISIBLE
                    Toasthelper.show(this, state.message ?: "Error")
                }
            }
        }

        binding.btnSend.setOnClickListener {
            val rating = binding.ratingBar.rating.toInt()
            val catatan = buildString {
                selectedOption?.let { append(it) }
                }

            if (rating == 0) {
                Toasthelper.show(this, "Silakan berikan rating")
                return@setOnClickListener
            }

            if (catatan.isEmpty()) {
                Toasthelper.show(this, "Tolong pilih salah 1 opsi catatan")
                return@setOnClickListener
            }

            viewModel.create(this, pengaduanId, rating, catatan)
        }
    }

    private fun setupOptions() {
        val options = listOf(binding.option1, binding.option2, binding.option3, binding.option4)
        
        options.forEach { textView ->
            textView.setOnClickListener {
                selectOption(textView, options)
            }
        }
    }

    private fun selectOption(selected: TextView, allOptions: List<TextView>) {
        selectedOption = selected.text.toString()
        
        allOptions.forEach { textView ->
            val isSelected = textView == selected

            textView.background = ContextCompat.getDrawable(
                this,
                if (isSelected) R.drawable.bg_option_review_selected else R.drawable.bg_option_review_unselected
            )

            val textColor = if (isSelected) R.color.primary else R.color.textSecondary
            textView.setTextColor(ContextCompat.getColor(this, textColor))
        }
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
