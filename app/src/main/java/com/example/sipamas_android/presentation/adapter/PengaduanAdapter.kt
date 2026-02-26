package com.example.sipamas_android.presentation.adapter

import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.sipamas_android.R
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.data.remote.RetrofitInstance
import com.example.sipamas_android.databinding.ItemPengaduanBinding
import com.example.sipamas_android.utils.DateHelper
import com.example.sipamas_android.utils.IdHelper
import com.example.sipamas_android.utils.LogHelper

class PengaduanAdapter(
    private val list: MutableList<Pengaduan> = mutableListOf(),
    private val onClick: (Pengaduan) -> Unit
): RecyclerView.Adapter<PengaduanAdapter.ViewHolder>() {
    class ViewHolder(val binding: ItemPengaduanBinding): RecyclerView.ViewHolder(binding.root) {
        fun bind(pengaduan: Pengaduan, onClick: (Pengaduan) -> Unit) {
            binding.tvJudul.text = pengaduan.judul
            binding.tvStatus.text = pengaduan.status
            binding.tvDesc.text = pengaduan.deskripsi
            binding.tvDate.text = DateHelper.format(pengaduan.created_at)
            binding.tvId.text = IdHelper.formatId(pengaduan.id)

            val media = pengaduan.medias?.firstOrNull()
            if (media != null && !media.media_file.isNullOrEmpty()) {
                val baseUrl = RetrofitInstance.baseUrl.replace("api/", "")
                val filePath = media.media_file!!.replace("\\", "/")
                val imageUrl = baseUrl + filePath

                Glide.with(binding.root.context)
                    .load(imageUrl)
                    .placeholder(R.drawable.example_home)
                    .error(R.drawable.example_home)
                    .into(binding.imgImage)

                LogHelper.log("Loading Image: $imageUrl")
            } else {
                binding.imgImage.setImageResource(R.drawable.example_home)
            }

            when (pengaduan.status) {
                "Ditolak" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#FF0000"))
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_cancel)
                }
                "Menunggu" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#0022FF"))
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_pending)
                }
                "Diterima" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#009EB0"))
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_accept)
                }
                "Diproses" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#FF8400"))
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_process)
                }
                "Selesai" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#00B112"))
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_done)
                }
                else -> {
                    binding.tvStatus.setTextColor(Color.GRAY)
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_pending)
                }
            }

            binding.root.setOnClickListener {
                onClick(pengaduan)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemPengaduanBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(list[position], onClick)
    }

    override fun getItemCount(): Int {
        return list.size
    }

    fun setData(data: List<Pengaduan>) {
        list.clear()
        list.addAll(data)
        notifyDataSetChanged()
    }
}
