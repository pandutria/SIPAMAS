package com.example.sipamas_android.presentation.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.sipamas_android.data.model.PengaduanTimeline
import com.example.sipamas_android.databinding.ItemLinimasaBinding
import com.example.sipamas_android.utils.DateHelper

class LinimasaAdapter(
    private val list: MutableList<PengaduanTimeline> = mutableListOf()
): RecyclerView.Adapter<LinimasaAdapter.ViewHolder>() {
    class ViewHolder(val binding: ItemLinimasaBinding): RecyclerView.ViewHolder(binding.root) {
        fun bind(timeline: PengaduanTimeline, isFirst: Boolean) {
            binding.tvTitle.text = timeline.judul
            binding.tvUpdatedBy.text = "Diperbarui oleh ${timeline.created_by?.fullname ?: "Admin"}"
            binding.tvDate.text = DateHelper.format(timeline.created_at)

            if (isFirst) binding.line.visibility = View.INVISIBLE
            else binding.line.visibility = View.VISIBLE
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemLinimasaBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(list[position], position == list.size - 1)
    }

    override fun getItemCount(): Int {
        return list.size
    }

    fun setData(data: List<PengaduanTimeline>) {
        list.clear()
        list.addAll(data)
        notifyDataSetChanged()
    }
}
