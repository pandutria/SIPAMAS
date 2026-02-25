package com.example.sipamas_android.utils

import android.os.Build
import java.text.SimpleDateFormat
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

object DateHelper {
    fun format(isoDate: String?): String {
        if (isoDate.isNullOrEmpty()) return "-"

        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val zonedDateTime = ZonedDateTime.parse(isoDate)
                val formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale("id", "ID"))
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
}
