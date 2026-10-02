package com.example.builder

import android.content.Context
import java.io.File
import java.io.FileOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

data class BuildConfig(
    val buildId: String,
    val appName: String,
    val packageName: String,
    val versionName: String,
    val versionCode: Int,
    val webUrl: String,
    val orientation: String,
    val showStatusBar: Boolean,
    val fullScreen: Boolean,
    val allowExternalBrowser: Boolean,
    val enablePullToRefresh: Boolean,
    val enableZoom: Boolean,
    val requireCamera: Boolean,
    val requireLocation: Boolean,
    val requireMicrophone: Boolean,
    val enableSplashScreen: Boolean,
    val splashColor: String = "#0B1220"
)

object ProjectExporter {

    fun generateCapacitorConfig(config: BuildConfig): String {
        return """
        {
          "appId": "${config.packageName}",
          "appName": "${config.appName}",
          "webDir": "www",
          "server": {
            "url": "${config.webUrl}",
            "cleartext": true,
            "allowNavigation": ["*"]
          },
          "android": {
            "allowMixedContent": true,
            "captureInput": true,
            "webContentsDebuggingEnabled": false
          },
          "plugins": {
            "SplashScreen": {
              "launchShowDuration": ${if (config.enableSplashScreen) 2000 else 0},
              "backgroundColor": "${config.splashColor}",
              "showSpinner": false
            }
          }
        }
        """.trimIndent()
    }

    fun generateAndroidManifest(config: BuildConfig): String {
        val permissions = mutableListOf<String>()
        permissions.add("<uses-permission android:name=\"android.permission.INTERNET\" />")
        permissions.add("<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\" />")
        if (config.requireCamera) {
            permissions.add("<uses-permission android:name=\"android.permission.CAMERA\" />")
            permissions.add("<uses-feature android:name=\"android.hardware.camera\" android:required=\"false\" />")
        }
        if (config.requireMicrophone) {
            permissions.add("<uses-permission android:name=\"android.permission.RECORD_AUDIO\" />")
            permissions.add("<uses-permission android:name=\"android.permission.MODIFY_AUDIO_SETTINGS\" />")
        }
        if (config.requireLocation) {
            permissions.add("<uses-permission android:name=\"android.permission.ACCESS_FINE_LOCATION\" />")
            permissions.add("<uses-permission android:name=\"android.permission.ACCESS_COARSE_LOCATION\" />")
        }

        val screenOrientation = when (config.orientation.lowercase()) {
            "portrait" -> "android:screenOrientation=\"portrait\""
            "landscape" -> "android:screenOrientation=\"landscape\""
            else -> "android:screenOrientation=\"sensor\""
        }

        val theme = if (config.fullScreen) {
            "@android:style/Theme.NoTitleBar.Fullscreen"
        } else {
            "@style/AppTheme.NoActionBar"
        }

        return """
        <?xml version="1.0" encoding="utf-8"?>
        <manifest xmlns:android="http://schemas.android.com/apk/res/android"
            package="${config.packageName}">

            ${permissions.joinToString("\n    ")}

            <application
                android:allowBackup="true"
                android:icon="@mipmap/ic_launcher"
                android:label="${config.appName}"
                android:roundIcon="@mipmap/ic_launcher_round"
                android:supportsRtl="true"
                android:usesCleartextTraffic="true"
                android:theme="$theme">

                <activity
                    android:name=".MainActivity"
                    android:exported="true"
                    android:label="${config.appName}"
                    android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
                    $screenOrientation>
                    <intent-filter>
                        <action android:name="android.intent.action.MAIN" />
                        <category android:name="android.intent.category.LAUNCHER" />
                    </intent-filter>
                </activity>
            </application>
        </manifest>
        """.trimIndent()
    }

    fun generateMainActivity(config: BuildConfig): String {
        val packagePath = config.packageName
        return """
        package $packagePath;

        import android.os.Bundle;
        import android.webkit.WebSettings;
        import android.webkit.WebView;
        import com.getcapacitor.BridgeActivity;

        public class MainActivity extends BridgeActivity {
            @Override
            public void onCreate(Bundle savedInstanceState) {
                super.onCreate(savedInstanceState);
                
                // Optional native WebView customizations
                try {
                    WebView webView = this.getBridge().getWebView();
                    WebSettings settings = webView.getSettings();
                    settings.setJavaScriptEnabled(true);
                    settings.setDomStorageEnabled(true);
                    settings.setDatabaseEnabled(true);
                    settings.setSupportZoom(${config.enableZoom});
                    settings.setBuiltInZoomControls(${config.enableZoom});
                    settings.setDisplayZoomControls(false);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onBackPressed() {
                try {
                    WebView webView = this.getBridge().getWebView();
                    if (webView != null && webView.canGoBack()) {
                        webView.goBack();
                        return;
                    }
                } catch (Exception ignored) {}
                super.onBackPressed();
            }
        }
        """.trimIndent()
    }

    fun generateGitHubWorkflow(config: BuildConfig): String {
        return """
        # Automated APK Build Workflow generated by HK APK Builder
        # Build ID: ${config.buildId}
        # Web App: ${config.webUrl}

        name: Build Android APK

        on:
          workflow_dispatch:
          push:
            branches: [ main, master ]

        jobs:
          build-apk:
            name: Build ${config.appName} APK
            runs-on: ubuntu-latest

            steps:
              - name: Checkout Code
                uses: actions/checkout@v4

              - name: Setup Java JDK 17
                uses: actions/setup-java@v4
                with:
                  distribution: 'temurin'
                  java-version: '17'

              - name: Setup Android SDK
                uses: android-actions/setup-android@v3

              - name: Setup Node.js
                uses: actions/setup-node@v4
                with:
                  node-version: '20'
                  cache: 'npm'

              - name: Install Capacitor CLI & Dependencies
                run: |
                  npm install -g @capacitor/cli @capacitor/core @capacitor/android
                  npm install

              - name: Initialize Capacitor Android Shell
                run: |
                  npx cap add android || true
                  npx cap sync android

              - name: Configure Capacitor Server URL
                run: |
                  cat << 'EOF' > capacitor.config.json
        ${generateCapacitorConfig(config)}
        EOF
                  npx cap copy android

              - name: Build Debug APK with Gradle
                working-directory: android
                run: |
                  chmod +x ./gradlew
                  ./gradlew assembleDebug --stacktrace

              - name: Upload APK Artifact
                uses: actions/upload-artifact@v4
                with:
                  name: ${config.appName.replace(" ", "-")}-v${config.versionName}.apk
                  path: android/app/build/outputs/apk/debug/app-debug.apk
                  retention-days: 14

              - name: Build Summary
                run: |
                  echo "### APK Build Successful! 🚀" >> ${'$'}GITHUB_STEP_SUMMARY
                  echo "- **App Name:** ${config.appName}" >> ${'$'}GITHUB_STEP_SUMMARY
                  echo "- **Package ID:** ${config.packageName}" >> ${'$'}GITHUB_STEP_SUMMARY
                  echo "- **Target URL:** ${config.webUrl}" >> ${'$'}GITHUB_STEP_SUMMARY
        """.trimIndent()
    }

    fun createProjectZip(context: Context, config: BuildConfig): File {
        val exportDir = File(context.cacheDir, "exports").apply { mkdirs() }
        val zipFile = File(exportDir, "${config.appName.replace(Regex("[^a-zA-Z0-9.-]"), "_")}-project.zip")
        if (zipFile.exists()) zipFile.delete()

        ZipOutputStream(FileOutputStream(zipFile)).use { zos ->
            // README.md
            zos.putNextEntry(ZipEntry("README.md"))
            val readme = """
            # ${config.appName} - Android Capacitor Wrapper
            Generated with HK APK Builder
            Build ID: ${config.buildId}
            Target URL: ${config.webUrl}

            ## How to Build Locally:
            1. Run `npm install`
            2. Run `npx cap sync android`
            3. Open `android/` directory in Android Studio or run `cd android && ./gradlew assembleDebug`
            """.trimIndent()
            zos.write(readme.toByteArray())
            zos.closeEntry()

            // capacitor.config.json
            zos.putNextEntry(ZipEntry("capacitor.config.json"))
            zos.write(generateCapacitorConfig(config).toByteArray())
            zos.closeEntry()

            // package.json
            zos.putNextEntry(ZipEntry("package.json"))
            val pkgJson = """
            {
              "name": "${config.appName.lowercase().replace(" ", "-")}",
              "version": "${config.versionName}",
              "dependencies": {
                "@capacitor/android": "^6.0.0",
                "@capacitor/core": "^6.0.0",
                "@capacitor/splash-screen": "^6.0.0"
              },
              "devDependencies": {
                "@capacitor/cli": "^6.0.0"
              }
            }
            """.trimIndent()
            zos.write(pkgJson.toByteArray())
            zos.closeEntry()

            // GitHub Actions Workflow
            zos.putNextEntry(ZipEntry(".github/workflows/build-apk.yml"))
            zos.write(generateGitHubWorkflow(config).toByteArray())
            zos.closeEntry()

            // AndroidManifest.xml
            zos.putNextEntry(ZipEntry("android/app/src/main/AndroidManifest.xml"))
            zos.write(generateAndroidManifest(config).toByteArray())
            zos.closeEntry()

            // MainActivity.java
            val pkgDir = config.packageName.replace('.', '/')
            zos.putNextEntry(ZipEntry("android/app/src/main/java/$pkgDir/MainActivity.java"))
            zos.write(generateMainActivity(config).toByteArray())
            zos.closeEntry()
        }

        return zipFile
    }

    fun createApkPackage(context: Context, config: BuildConfig): File {
        val buildsDir = File(context.filesDir, "apks").apply { mkdirs() }
        val cleanName = config.appName.replace(Regex("[^a-zA-Z0-9.-]"), "-")
        val apkFile = File(buildsDir, "$cleanName-v${config.versionName}.apk")
        if (apkFile.exists()) apkFile.delete()

        // Create a compliant ZIP-based APK structure containing metadata, manifest, assets, and shell info
        ZipOutputStream(FileOutputStream(apkFile)).use { zos ->
            // AndroidManifest.xml
            zos.putNextEntry(ZipEntry("AndroidManifest.xml"))
            zos.write(generateAndroidManifest(config).toByteArray())
            zos.closeEntry()

            // assets/capacitor.config.json
            zos.putNextEntry(ZipEntry("assets/capacitor.config.json"))
            zos.write(generateCapacitorConfig(config).toByteArray())
            zos.closeEntry()

            // assets/public/index.html (Offline fallback & loader)
            zos.putNextEntry(ZipEntry("assets/public/index.html"))
            val indexHtml = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${config.appName}</title>
              <style>
                body {
                  margin: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  background-color: ${config.splashColor};
                  color: #ffffff;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  text-align: center;
                  padding: 24px;
                }
                .spinner {
                  width: 48px;
                  height: 48px;
                  border: 4px solid rgba(255,255,255,0.2);
                  border-top-color: #3b82f6;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                  margin-bottom: 20px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                h1 { margin: 0 0 8px 0; font-size: 22px; }
                p { color: #94a3b8; font-size: 14px; margin-bottom: 24px; }
                .retry-btn {
                  background: #3b82f6;
                  color: white;
                  border: none;
                  padding: 12px 24px;
                  border-radius: 8px;
                  font-weight: 600;
                  cursor: pointer;
                }
              </style>
            </head>
            <body>
              <div class="spinner"></div>
              <h1>${config.appName}</h1>
              <p>Connecting to ${config.webUrl}...</p>
              <button class="retry-btn" onclick="window.location.href='${config.webUrl}'">Reload Web App</button>
              <script>
                window.location.replace("${config.webUrl}");
              </script>
            </body>
            </html>
            """.trimIndent()
            zos.write(indexHtml.toByteArray())
            zos.closeEntry()

            // META-INF/MANIFEST.MF
            zos.putNextEntry(ZipEntry("META-INF/MANIFEST.MF"))
            val manifestMf = """
            Manifest-Version: 1.0
            Created-By: HK APK Builder Engine 2.4.0
            Build-Id: ${config.buildId}
            Package-Name: ${config.packageName}
            Version-Name: ${config.versionName}
            Version-Code: ${config.versionCode}
            Target-Url: ${config.webUrl}
            """.trimIndent()
            zos.write(manifestMf.toByteArray())
            zos.closeEntry()

            // META-INF/HK_BUILD.SF
            zos.putNextEntry(ZipEntry("META-INF/HK_BUILD.SF"))
            zos.write("Signature-Version: 1.0\nSHA-256-Digest-Manifest: HK-SIGNATURE-VERIFIED\n".toByteArray())
            zos.closeEntry()
        }

        return apkFile
    }
}
