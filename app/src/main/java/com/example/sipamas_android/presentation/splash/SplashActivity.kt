package com.example.sipamas_android.presentation.splash

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.lifecycleScope
import com.example.sipamas_android.MainActivity
import com.example.sipamas_android.R
import com.example.sipamas_android.data.local.AuthManager
import com.example.sipamas_android.data.local.TokenManager
import com.example.sipamas_android.presentation.onboarding.OnBoardingActivity
import com.example.sipamas_android.utils.IntenHelper
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_splash)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = true

        lifecycleScope.launch {
            delay(3000)
            val token = TokenManager(this@SplashActivity).getToken()
            if (token != "") {
                IntenHelper.navigate(this@SplashActivity, MainActivity::class.java)
            } else {
                IntenHelper.navigate(this@SplashActivity, OnBoardingActivity::class.java)
            }
            finish()
        }
    }
}