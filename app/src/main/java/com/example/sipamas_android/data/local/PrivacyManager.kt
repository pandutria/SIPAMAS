package com.example.sipamas_android.data.local

import android.content.Context

class PrivacyManager(context: Context) {
    private val prefName = "privasi_pref"
    private val keyEmail = "email_visibility"
    private val keyLocation = "location_access"
    private val keyCamera = "camera_access"

    private val shared = context.getSharedPreferences(prefName, Context.MODE_PRIVATE)

    fun setEmailVisibility(isVisible: Boolean) {
        shared.edit().putBoolean(keyEmail, isVisible).apply()
    }

    fun isEmailVisible(): Boolean = shared.getBoolean(keyEmail, true)

    fun setLocationAccess(isEnabled: Boolean) {
        shared.edit().putBoolean(keyLocation, isEnabled).apply()
    }

    fun isLocationEnabled(): Boolean = shared.getBoolean(keyLocation, true)

    fun setCameraAccess(isEnabled: Boolean) {
        shared.edit().putBoolean(keyCamera, isEnabled).apply()
    }

    fun isCameraEnabled(): Boolean = shared.getBoolean(keyCamera, true)
}
