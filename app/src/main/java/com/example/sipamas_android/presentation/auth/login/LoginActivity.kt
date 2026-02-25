package com.example.sipamas_android.presentation.auth.login

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.sipamas_android.MainActivity
import com.example.sipamas_android.R
import com.example.sipamas_android.data.local.TokenManager
import com.example.sipamas_android.data.repository.AuthRepository
import com.example.sipamas_android.data.state.State
import com.example.sipamas_android.databinding.ActivityLoginBinding
import com.example.sipamas_android.presentation.auth.register.RegisterActivity
import com.example.sipamas_android.presentation.auth.register.RegisterViewModel
import com.example.sipamas_android.presentation.auth.register.RegisterViewModelFactory
import com.example.sipamas_android.utils.IntenHelper
import com.example.sipamas_android.utils.Toasthelper
import kotlin.getValue

class LoginActivity : AppCompatActivity() {
    private var _binding: ActivityLoginBinding? = null
    private val binding get() = _binding!!

    private val viewModel: LoginViewModel by viewModels {
        LoginViewModelFactory(AuthRepository())
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        _binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        binding.tvRegister.setOnClickListener {
            IntenHelper.navigate(this, RegisterActivity::class.java)
        }

        viewModel.loginState.observe(this){state ->
            when(state) {

                is State.Loading -> {
                    binding.btnLogin.visibility = View.GONE
                    binding.pbLoading.visibility = View.VISIBLE
                }
                is State.Success -> {
                    if (state.data.role != "masyarakat") {
                        Toasthelper.show(this, "Role kamu bukan masyarakat!")
                        return@observe
                    }
                    TokenManager(this).saveToken(state.data.token!!)
                    viewModel.me(this)
                }
                is State.Error -> {
                    Toasthelper.show(this, state.message ?: "Error")
                    binding.btnLogin.visibility = View.VISIBLE
                    binding.pbLoading.visibility = View.GONE
                }
                else -> {
                    Toasthelper.show(this, "Error")
                    binding.btnLogin.visibility = View.VISIBLE
                    binding.pbLoading.visibility = View.GONE
                }
            }

            viewModel.meState.observe(this){ state ->
                when(state) {
                    is State.Loading -> {
                        binding.btnLogin.visibility = View.GONE
                        binding.pbLoading.visibility = View.VISIBLE
                    }
                    is State.Success -> {
                        Toasthelper.show(this, state.message)
                        IntenHelper.navigate(this, MainActivity::class.java)
                    }
                    is State.Error -> {
                        Toasthelper.show(this, state.message ?: "Error")
                        binding.btnLogin.visibility = View.VISIBLE
                        binding.pbLoading.visibility = View.GONE
                    }
                    else -> {
                        Toasthelper.show(this, "Error")
                        binding.btnLogin.visibility = View.VISIBLE
                        binding.pbLoading.visibility = View.GONE
                    }
                }
            }

        }

        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString()
            val password = binding.etPassword.text.toString()

            if (email.isEmpty() || password.isEmpty()) {
                Toasthelper.show(this, "Semua input wajib di isi")
                return@setOnClickListener
            }

            viewModel.login(email, password)
        }
    }

    @SuppressLint("GestureBackNavigation")
    override fun onBackPressed() {
        super.onBackPressed()
        IntenHelper.finish(this)
    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }
}