package com.example.sipamas_android.utils

import android.content.Context
import android.widget.Toast

object Toasthelper {
    fun show(context: Context, text: String) {
        Toast.makeText(context, text, Toast.LENGTH_LONG).show()
    }
}