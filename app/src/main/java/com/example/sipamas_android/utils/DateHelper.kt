package com.example.sipamas_android.utils

import android.os.Build
import java.text.SimpleDateFormat
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone

object DateHelper {
    fun format(isoDate: String?): String {
        if (isoDate.isNullOrEmpty()) return "-"

        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val zonedDateTime = ZonedDateTime.parse(isoDate)
                val formatter = java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale("id", "ID"))
                zonedDateTime.format(formatter)
            } else {
                val datePart = isoDate.split("T")[0]
                val inputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)
                val outputFormat = SimpleDateFormat("dd MMMM yyyy", Locale("id", "ID"))
                val date = inputFormat.parse(datePart)
                date?.let { outputFormat.format(it) } ?: "-"
            }
        } catch (e: Exception) {
            isoDate
        }
    }

    fun formatRelative(isoDate: String?): String {
        if (isoDate.isNullOrEmpty()) return "-"

        return try {
            val date: Date = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Date.from(ZonedDateTime.parse(isoDate).toInstant())
            } else {
                val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US)
                // Hapus offset jika ada untuk parsing manual sederhana atau gunakan parser yang lebih kuat
                val cleanDate = isoDate.substring(0, 19) 
                sdf.parse(cleanDate) ?: return "-"
            }

            val now = Calendar.getInstance().time
            val diffInMillis = now.time - date.time
            val diffInDays = diffInMillis / (1000 * 60 * 60 * 24)

            when {
                diffInDays < 1 -> "Hari Ini"
                diffInDays == 1L -> "Kemarin"
                else -> "$diffInDays hari yang lalu"
            }
        } catch (e: Exception) {
            "-"
        }
    }
}
