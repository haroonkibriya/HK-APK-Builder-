package com.example

import com.example.builder.BuildConfig
import com.example.builder.ProjectExporter
import com.example.network.WebAnalyzer
import org.junit.Assert.*
import org.junit.Test

class ExampleUnitTest {
  private val webAnalyzer = WebAnalyzer()

  @Test
  fun testPackageNameSanitization() {
    val pkg1 = webAnalyzer.sanitizePackageName("hkclinic.example.com", "HK Clinic Manager")
    assertTrue("Package should start with valid prefix", pkg1.startsWith("com.example") || pkg1.startsWith("com.hk"))
    assertFalse("Package should not contain spaces", pkg1.contains(" "))
    assertTrue("Package should be lowercase", pkg1 == pkg1.lowercase())
  }

  @Test
  fun testCapacitorConfigGeneration() {
    val config = BuildConfig(
      buildId = "HK-2026-000101",
      appName = "HK Clinic",
      packageName = "com.hkclinic.app",
      versionName = "1.0.0",
      versionCode = 1,
      webUrl = "https://clinic.example.com",
      orientation = "portrait",
      showStatusBar = true,
      fullScreen = false,
      allowExternalBrowser = true,
      enablePullToRefresh = true,
      enableZoom = false,
      requireCamera = true,
      requireLocation = false,
      requireMicrophone = false,
      enableSplashScreen = true
    )

    val json = ProjectExporter.generateCapacitorConfig(config)
    assertTrue("Config contains appId", json.contains("\"appId\": \"com.hkclinic.app\""))
    assertTrue("Config contains target URL", json.contains("\"url\": \"https://clinic.example.com\""))
  }

  @Test
  fun testAndroidManifestPermissions() {
    val config = BuildConfig(
      buildId = "HK-2026-000102",
      appName = "HK Camera Portal",
      packageName = "com.hk.cam",
      versionName = "1.0.0",
      versionCode = 1,
      webUrl = "https://cam.example.com",
      orientation = "landscape",
      showStatusBar = false,
      fullScreen = true,
      allowExternalBrowser = true,
      enablePullToRefresh = false,
      enableZoom = true,
      requireCamera = true,
      requireLocation = true,
      requireMicrophone = true,
      enableSplashScreen = false
    )

    val manifest = ProjectExporter.generateAndroidManifest(config)
    assertTrue("Contains CAMERA permission", manifest.contains("android.permission.CAMERA"))
    assertTrue("Contains RECORD_AUDIO permission", manifest.contains("android.permission.RECORD_AUDIO"))
    assertTrue("Contains ACCESS_FINE_LOCATION permission", manifest.contains("android.permission.ACCESS_FINE_LOCATION"))
    assertTrue("Contains screen orientation landscape", manifest.contains("screenOrientation=\"landscape\""))
  }

  @Test
  fun testGitHubWorkflowGeneration() {
    val config = BuildConfig(
      buildId = "HK-2026-000103",
      appName = "Demo App",
      packageName = "com.demo.app",
      versionName = "1.0.0",
      versionCode = 1,
      webUrl = "https://demo.app",
      orientation = "auto",
      showStatusBar = true,
      fullScreen = false,
      allowExternalBrowser = true,
      enablePullToRefresh = true,
      enableZoom = false,
      requireCamera = false,
      requireLocation = false,
      requireMicrophone = false,
      enableSplashScreen = true
    )

    val workflow = ProjectExporter.generateGitHubWorkflow(config)
    assertTrue("Contains actions checkout", workflow.contains("actions/checkout@v4"))
    assertTrue("Contains setup android", workflow.contains("android-actions/setup-android@v3"))
    assertTrue("Contains capacitor sync", workflow.contains("npx cap sync android"))
    assertTrue("Contains assembleDebug", workflow.contains("./gradlew assembleDebug"))
  }
}
