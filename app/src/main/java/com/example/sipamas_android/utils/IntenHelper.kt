package com.example.sipamas_android.utils

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import androidx.activity.OnBackPressedCallback
import androidx.fragment.app.Fragment
import com.example.sipamas_android.R

object IntenHelper {
    fun navigate(activity: Activity, destination: Class<out Activity>, extras: Bundle? = null) {
        val intent = Intent(activity, destination)
        if (extras != null) intent.putExtras(extras)
        activity.startActivity(intent)
        activity.overridePendingTransition(R.anim.zoom_fade_in, R.anim.zoom_fade_out)
    }
    fun finish(activity: Activity) {
        activity.finish()
        activity.overridePendingTransition(R.anim.zoom_fade_in, R.anim.zoom_fade_out)
    }

    fun Fragment.handleOnBackPressed(action: () -> Unit) {
        requireActivity().onBackPressedDispatcher.addCallback(
            viewLifecycleOwner,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    action()
                }
            }
        )
    }
}