# HK APK Builder

> **Paste GitHub Live URL → Build APK → Download**
> Turn Any Web App Into an Android APK with zero manual Android Studio or Gradle configuration.

## 🚀 Overview

HK APK Builder is a modern application tailored for developers using **Google AI Studio** and web technologies. It allows you to package any live HTTPS web application into a native Android APK shell powered by Capacitor and Android WebView.

### Main Workflow:
1. **Create** web app in Google AI Studio.
2. **Push** to GitHub.
3. **Deploy** to GitHub Pages, Cloud Run, Vercel, or Netlify.
4. **Paste** the HTTPS live URL into HK APK Builder.
5. **Analyze** web app (mobile viewport, PWA manifest, reachability).
6. **Configure** app identity, package ID, version, icon, splash screen, and hardware permissions.
7. **Build APK** via the isolated containerized build engine.
8. **Download** the generated APK or scan the on-screen QR Code directly with your Android phone!

---

## 🛠 Features

- **Instant URL Reachability & SSL Verification**: Validates protocol, HTTP status codes, response time, and SSRF prevention.
- **PWA & Mobile Viewport Detection**: Automatically detects `manifest.json`, theme colors, and responsiveness.
- **Custom Native Shell**: Embeds web apps in a hardened Capacitor 6 Android container with pull-to-refresh, zoom controls, and custom back navigation.
- **Hardware Permissions On-Demand**: Opt-in permissions for Camera, Microphone, and Location.
- **Interactive Phone Frame Mockup**: Real-time live web app preview with Mobile (390px) and Desktop (1024px) viewport toggles.
- **QR Code Phone Transfer**: Instantly scan and download the APK artifact to any physical device.
- **SQLite / Room Build History**: Local persistence of previous builds with one-tap Rebuild, APK download, and logs inspection.
- **GitHub Actions CI/CD Integration**: Export ready-to-run `.github/workflows/build-apk.yml` workflows.

---

## 📂 Project Structure

```
├── app/
│   ├── src/main/java/com/example/
│   │   ├── MainActivity.kt               # Main Jetpack Compose Scaffold & Navigation
│   │   ├── builder/                      # APK Build Engine & Capacitor Project Exporter
│   │   ├── data/                         # Room Database Entities, DAOs & Repository
│   │   ├── network/                      # Live Web Reachability & PWA Analyzer
│   │   ├── ui/
│   │   │   ├── components/               # PhoneMockup, QrCodeCanvas, Badges
│   │   │   ├── navigation/               # Type-safe Screen routes
│   │   │   ├── screens/                  # Home, Analysis, Config, Progress, Success, History, Guide, Health
│   │   │   └── theme/                    # Material 3 Design System
│   │   └── viewmodel/                    # ApkBuilderViewModel
│   ├── src/test/                         # JVM Unit Tests & Robolectric Tests
│   └── build.gradle.kts                  # Android Gradle build configuration
├── .github/workflows/                    # Automated CI/CD workflows
└── README.md
```

---

## 🧪 Local Development & Testing

```bash
# Build debug APK locally
gradle assembleDebug

# Run unit tests
gradle :app:testDebugUnitTest
```

---

## 📄 License
MIT License. Created with Google AI Studio.
