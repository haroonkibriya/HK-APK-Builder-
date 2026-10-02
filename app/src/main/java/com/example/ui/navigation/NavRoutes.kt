package com.example.ui.navigation

sealed class Screen(val route: String, val title: String) {
    data object Home : Screen("home", "HK APK Builder")
    data object Analysis : Screen("analysis", "Website Analysis")
    data object Config : Screen("config", "App Configuration")
    data object BuildProgress : Screen("build_progress", "Building APK")
    data object BuildSuccess : Screen("build_success", "APK Ready")
    data object History : Screen("history", "Build History")
    data object Guide : Screen("guide", "How It Works")
    data object AdminHealth : Screen("admin_health", "System Status")
    data object WebShell : Screen("web_shell", "Native Android Shell")
}
