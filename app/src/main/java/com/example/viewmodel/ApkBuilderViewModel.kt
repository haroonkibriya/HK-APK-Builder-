package com.example.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.builder.ApkBuildEngine
import com.example.builder.BuildConfig
import com.example.builder.BuildProgressState
import com.example.builder.ProjectExporter
import com.example.data.AppDatabase
import com.example.data.BuildEntity
import com.example.data.BuildRepository
import com.example.network.AnalysisResult
import com.example.network.WebAnalyzer
import com.example.ui.navigation.Screen
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.io.File
import java.util.Random

class ApkBuilderViewModel(application: Application) : AndroidViewModel(application) {
    private val database = AppDatabase.getDatabase(application)
    val repository = BuildRepository(database.buildDao())
    private val webAnalyzer = WebAnalyzer()
    private val buildEngine = ApkBuildEngine(application, repository)

    // Navigation state
    private val _currentScreen = MutableStateFlow<Screen>(Screen.Home)
    val currentScreen: StateFlow<Screen> = _currentScreen.asStateFlow()

    private val navStack = mutableListOf<Screen>(Screen.Home)

    fun navigateTo(screen: Screen) {
        if (_currentScreen.value != screen) {
            navStack.add(screen)
            _currentScreen.value = screen
        }
    }

    fun navigateBack(): Boolean {
        if (navStack.size > 1) {
            navStack.removeAt(navStack.size - 1)
            _currentScreen.value = navStack.last()
            return true
        }
        return false
    }

    // Input & Analysis state
    val urlInput = MutableStateFlow("https://ais-dev-l4aabd7a2si56aia6snwc2-651536177846.asia-east1.run.app")
    val isAnalyzing = MutableStateFlow(false)
    val analysisResult = MutableStateFlow<AnalysisResult?>(null)

    // Configuration Fields
    val appName = MutableStateFlow("HK Web Application")
    val packageName = MutableStateFlow("com.hk.app")
    val versionName = MutableStateFlow("1.0.0")
    val versionCode = MutableStateFlow(1)
    val iconColorHex = MutableStateFlow("#3B82F6")
    val iconInitial = MutableStateFlow("HK")
    val orientation = MutableStateFlow("auto")
    val showStatusBar = MutableStateFlow(true)
    val fullScreen = MutableStateFlow(false)
    val allowExternalBrowser = MutableStateFlow(true)
    val enablePullToRefresh = MutableStateFlow(true)
    val enableZoom = MutableStateFlow(false)
    val requireCamera = MutableStateFlow(false)
    val requireLocation = MutableStateFlow(false)
    val requireMicrophone = MutableStateFlow(false)
    val enableSplashScreen = MutableStateFlow(true)
    val splashColor = MutableStateFlow("#0B1220")

    // Active Build State
    val buildProgress: StateFlow<BuildProgressState> = buildEngine.buildState
    val latestCompletedBuild = MutableStateFlow<BuildEntity?>(null)

    // Database Builds Flow
    val allBuilds: StateFlow<List<BuildEntity>> = repository.allBuilds.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    val totalBuildsCount: StateFlow<Int> = repository.totalBuildsCount.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = 0
    )

    val successBuildsCount: StateFlow<Int> = repository.successBuildsCount.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = 0
    )

    init {
        // Seed default sample data if empty for first-launch experience
        viewModelScope.launch {
            if (repository.getBuildByBuildId("HK-2026-000101") == null) {
                val sample = BuildEntity(
                    buildId = "HK-2026-000101",
                    appName = "HK Clinic Portal",
                    packageName = "com.hkclinic.portal",
                    versionName = "1.0.0",
                    versionCode = 1,
                    webUrl = "https://example.github.io/hk-clinic/",
                    iconColorHex = "#10B981",
                    iconInitial = "CP",
                    orientation = "auto",
                    status = "SUCCESS",
                    apkFileName = "HK-Clinic-Portal-v1.0.0.apk",
                    apkFileSize = "19.4 MB",
                    apkSha256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    createdAt = System.currentTimeMillis() - 86400000L,
                    expiresAt = System.currentTimeMillis() + 86400000L,
                    buildDurationMs = 4200L,
                    logs = "[14:22:01.120] Scaffolding Capacitor wrapper\n[14:22:03.450] Gradle assembleDebug SUCCESS\n[14:22:04.200] APK generated",
                    downloadUrl = "https://apk-builder.hk/artifacts/HK-2026-000101/HK-Clinic-Portal-v1.0.0.apk",
                    isPwa = true
                )
                repository.insertBuild(sample)
            }
        }
    }

    fun setUrlPreset(url: String, presetName: String) {
        urlInput.value = url
    }

    fun startAnalysis() {
        val url = urlInput.value.trim()
        if (url.isBlank()) return

        isAnalyzing.value = true
        analysisResult.value = null
        navigateTo(Screen.Analysis)

        viewModelScope.launch {
            val result = webAnalyzer.analyzeUrl(url)
            analysisResult.value = result
            isAnalyzing.value = false

            // Pre-populate configuration fields
            if (result.isValidUrl) {
                appName.value = result.suggestedAppName.ifBlank { "My Web App" }
                packageName.value = result.suggestedPackageName.ifBlank { "com.hk.app" }
                val initials = appName.value.split(" ")
                    .filter { it.isNotBlank() }
                    .take(2)
                    .map { it.first().uppercase() }
                    .joinToString("")
                iconInitial.value = initials.ifBlank { "HK" }
            }
        }
    }

    fun updatePackageNameFromAppName(name: String) {
        appName.value = name
        val sanitized = name.lowercase().replace(Regex("[^a-z0-9]"), "")
        packageName.value = "com.hk.${sanitized.take(15).ifBlank { "app" }}"
        val initials = name.split(" ")
            .filter { it.isNotBlank() }
            .take(2)
            .map { it.first().uppercase() }
            .joinToString("")
        iconInitial.value = initials.ifBlank { "HK" }
    }

    fun startBuild() {
        val randId = String.format("%06d", Random().nextInt(900000) + 100000)
        val buildId = "HK-2026-$randId"

        val config = BuildConfig(
            buildId = buildId,
            appName = appName.value.trim().ifBlank { "My Web App" },
            packageName = packageName.value.trim().ifBlank { "com.hk.app" },
            versionName = versionName.value.trim().ifBlank { "1.0.0" },
            versionCode = versionCode.value,
            webUrl = urlInput.value.trim(),
            orientation = orientation.value,
            showStatusBar = showStatusBar.value,
            fullScreen = fullScreen.value,
            allowExternalBrowser = allowExternalBrowser.value,
            enablePullToRefresh = enablePullToRefresh.value,
            enableZoom = enableZoom.value,
            requireCamera = requireCamera.value,
            requireLocation = requireLocation.value,
            requireMicrophone = requireMicrophone.value,
            enableSplashScreen = enableSplashScreen.value,
            splashColor = splashColor.value
        )

        navigateTo(Screen.BuildProgress)

        viewModelScope.launch {
            try {
                val entity = buildEngine.runBuild(
                    config = config,
                    iconColorHex = iconColorHex.value,
                    iconInitial = iconInitial.value
                )
                latestCompletedBuild.value = entity
                navigateTo(Screen.BuildSuccess)
            } catch (e: Exception) {
                // Handled in buildProgress state
            }
        }
    }

    fun cancelBuild() {
        buildEngine.cancelBuild()
    }

    fun rebuildFrom(build: BuildEntity) {
        urlInput.value = build.webUrl
        appName.value = build.appName
        packageName.value = build.packageName
        versionName.value = build.versionName
        versionCode.value = build.versionCode + 1
        iconColorHex.value = build.iconColorHex
        iconInitial.value = build.iconInitial
        orientation.value = build.orientation
        enablePullToRefresh.value = build.enablePullToRefresh
        enableZoom.value = build.enableZoom
        allowExternalBrowser.value = build.allowExternalBrowser
        requireCamera.value = build.requireCamera
        requireLocation.value = build.requireLocation
        requireMicrophone.value = build.requireMicrophone
        enableSplashScreen.value = build.enableSplashScreen
        showStatusBar.value = build.showStatusBar
        navigateTo(Screen.Config)
    }

    fun deleteBuild(id: Long) {
        viewModelScope.launch {
            repository.deleteBuild(id)
        }
    }

    fun cleanExpiredBuilds() {
        viewModelScope.launch {
            repository.deleteExpiredBuilds()
        }
    }

    fun getExportedProjectZip(build: BuildEntity): File? {
        val config = BuildConfig(
            buildId = build.buildId,
            appName = build.appName,
            packageName = build.packageName,
            versionName = build.versionName,
            versionCode = build.versionCode,
            webUrl = build.webUrl,
            orientation = build.orientation,
            showStatusBar = build.showStatusBar,
            fullScreen = false,
            allowExternalBrowser = build.allowExternalBrowser,
            enablePullToRefresh = build.enablePullToRefresh,
            enableZoom = build.enableZoom,
            requireCamera = build.requireCamera,
            requireLocation = build.requireLocation,
            requireMicrophone = build.requireMicrophone,
            enableSplashScreen = build.enableSplashScreen
        )
        return try {
            ProjectExporter.createProjectZip(getApplication(), config)
        } catch (e: Exception) {
            null
        }
    }

    fun getApkFile(build: BuildEntity): File? {
        val cleanName = build.appName.replace(Regex("[^a-zA-Z0-9.-]"), "-")
        val apkFile = File(getApplication<Application>().filesDir, "apks/$cleanName-v${build.versionName}.apk")
        return if (apkFile.exists()) apkFile else {
            val config = BuildConfig(
                buildId = build.buildId,
                appName = build.appName,
                packageName = build.packageName,
                versionName = build.versionName,
                versionCode = build.versionCode,
                webUrl = build.webUrl,
                orientation = build.orientation,
                showStatusBar = build.showStatusBar,
                fullScreen = false,
                allowExternalBrowser = build.allowExternalBrowser,
                enablePullToRefresh = build.enablePullToRefresh,
                enableZoom = build.enableZoom,
                requireCamera = build.requireCamera,
                requireLocation = build.requireLocation,
                requireMicrophone = build.requireMicrophone,
                enableSplashScreen = build.enableSplashScreen
            )
            ProjectExporter.createApkPackage(getApplication(), config)
        }
    }
}
