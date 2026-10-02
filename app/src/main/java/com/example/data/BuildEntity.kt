package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "build_records")
data class BuildEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val buildId: String,
    val appName: String,
    val packageName: String,
    val versionName: String,
    val versionCode: Int,
    val webUrl: String,
    val iconColorHex: String = "#3B82F6",
    val iconInitial: String = "HK",
    val orientation: String = "auto",
    val status: String, // QUEUED, ANALYZING, PREPARING, BUILDING, PACKAGING, SUCCESS, FAILED
    val apkFileName: String,
    val apkFileSize: String,
    val apkSha256: String,
    val createdAt: Long = System.currentTimeMillis(),
    val expiresAt: Long = System.currentTimeMillis() + 86400000L, // 24 hours
    val buildDurationMs: Long = 0L,
    val logs: String = "",
    val downloadUrl: String = "",
    val isPwa: Boolean = false,
    val enablePullToRefresh: Boolean = true,
    val enableZoom: Boolean = false,
    val allowExternalBrowser: Boolean = true,
    val requireCamera: Boolean = false,
    val requireLocation: Boolean = false,
    val requireMicrophone: Boolean = false,
    val enableSplashScreen: Boolean = true,
    val showStatusBar: Boolean = true
)
