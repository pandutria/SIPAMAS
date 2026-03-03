package com.example.sipamas_android.presentation.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.sipamas_android.R
import com.example.sipamas_android.data.model.PengaduanMedia
import com.example.sipamas_android.data.remote.RetrofitInstance
import com.example.sipamas_android.databinding.ItemLampiranBinding

class LampiranAdapter(
    private val list: MutableList<PengaduanMedia> = arrayListOf()
): RecyclerView.Adapter<LampiranAdapter.ViewHolder>() {
    class ViewHolder(val binding: ItemLampiranBinding): RecyclerView.ViewHolder(binding.root) {
        fun bind(media: PengaduanMedia) {
            if (!media.media_file.isNullOrEmpty()) {
                val baseUrl = RetrofitInstance.baseUrl.replace("api/", "")
                val cleanPath = media.media_file!!.replace("\\", "/")
                val imageUrl = baseUrl + cleanPath

                Glide.with(binding.root.context)
                    .load(imageUrl)
                    .placeholder(R.drawable.img_black)
                    .error(R.drawable.img_black)
                    .into(binding.image)
            } else {
                binding.image.setImageResource(R.drawable.img_black)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemLampiranBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(list[position])
    }

    override fun getItemCount(): Int {
        return list.size
    }

    fun setData(data: List<PengaduanMedia>) {
        list.clear()
        list.addAll(data)
        notifyDataSetChanged()
    }
}
