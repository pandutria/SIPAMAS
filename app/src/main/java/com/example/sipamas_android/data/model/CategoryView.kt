package com.example.sipamas_android.data.model

import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView

data class CategoryView(
    val layout: LinearLayout,
    val icon: ImageView,
    val textView: TextView,
    val name: String,
    val selectedIconRes: Int,
    val unselectedIconRes: Int
)