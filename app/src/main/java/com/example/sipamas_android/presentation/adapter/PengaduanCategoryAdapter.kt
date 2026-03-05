package com.example.sipamas_android.presentation.adapter

import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.example.sipamas_android.R
import com.example.sipamas_android.data.model.Pengaduan
import com.example.sipamas_android.databinding.ItemActivityBinding
import com.example.sipamas_android.utils.DateHelper
import com.example.sipamas_android.utils.IdHelper

class PengaduanCategoryAdapter(
    private val list: MutableList<Pengaduan> = mutableListOf(),
    private val onClick: (Pengaduan) -> Unit
): RecyclerView.Adapter<PengaduanCategoryAdapter.ViewHolder>() {
    class ViewHolder(val binding: ItemActivityBinding): RecyclerView.ViewHolder(binding.root) {
        fun bind(pengaduan: Pengaduan, onClick: (Pengaduan) -> Unit) {
            binding.tvTitle.text = pengaduan.judul
            binding.tvStatus.text = pengaduan.status
            binding.tvDate.text = DateHelper.format(pengaduan.created_at)
            binding.tvId.text = IdHelper.formatId(pengaduan.id)

            val shortAddress = pengaduan.alamat?.split(" ")?.take(2)?.joinToString(" ")
            binding.tvAddress.text = shortAddress ?: pengaduan.alamat

            when (pengaduan.status) {
                "Ditolak" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#FF0000"))
                    binding.imgImage.setImageResource(R.drawable.img_menunggu)
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_cancel)
                }
                "Menunggu" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#0022FF"))
                    binding.imgImage.setImageResource(R.drawable.img_menunggu)
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_pending)
                }
                "Diterima" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#009EB0"))
                    binding.imgImage.setImageResource(R.drawable.img_diterima)
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_accept)
                }
                "Diproses" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#FF8400"))
                    binding.imgImage.setImageResource(R.drawable.img_diprosess)
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_process)
                }
                "Selesai" -> {
                    binding.tvStatus.setTextColor(Color.parseColor("#00B112"))
                    binding.imgImage.setImageResource(R.drawable.img_selesai)
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_done)
                }
                else -> {
                    binding.tvStatus.setTextColor(Color.GRAY)
                    binding.imgImage.setImageResource(R.drawable.img_menunggu)
                    binding.tvStatus.background = ContextCompat.getDrawable(binding.root.context, R.drawable.bg_status_item_pending)
                }
            }

            binding.root.setOnClickListener {
                onClick(pengaduan)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemActivityBinding.inflate(LayoutInflater.from(parent.context), parent, false)
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
