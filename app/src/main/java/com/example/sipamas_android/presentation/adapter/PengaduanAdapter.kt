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

            if (pengaduan.medias?.firstOrNull() != null) {
                val url = RetrofitInstance.baseUrl
                val imageUrl = url + pengaduan.medias[0].file

                Glide.with(binding.root.context)
                    .load(imageUrl)
                    .into(binding.imgImage)
            }

            when (pengaduan.status?.lowercase()) {
                "menunggu", "pending" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#0022FF"))
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_pending)
                }
                "diproses", "proses" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#FF8400"))
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_process)
                }
                "selesai", "done" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#00B112"))
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_done)
                }
                else -> {
                    binding.tvStatus.setTextColor(Color.GRAY)
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_pending)
                }
            }

            onClick(pengaduan)
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