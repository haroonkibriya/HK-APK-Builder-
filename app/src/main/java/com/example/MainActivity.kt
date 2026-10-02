package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.HelpOutline
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.navigation.Screen
import com.example.ui.screens.AdminHealthScreen
import com.example.ui.screens.AnalysisScreen
import com.example.ui.screens.BuildProgressScreen
import com.example.ui.screens.BuildSuccessScreen
import com.example.ui.screens.ConfigScreen
import com.example.ui.screens.GuideScreen
import com.example.ui.screens.HistoryScreen
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.WebShellScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.viewmodel.ApkBuilderViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: ApkBuilderViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                MainAppContent(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun MainAppContent(viewModel: ApkBuilderViewModel) {
    val currentScreen by viewModel.currentScreen.collectAsState()

    val showBottomBar = currentScreen in listOf(
        Screen.Home,
        Screen.History,
        Screen.Guide,
        Screen.AdminHealth
    )

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = Color(0xFF0B1220),
        contentWindowInsets = WindowInsets.safeDrawing,
        bottomBar = {
            if (showBottomBar) {
                NavigationBar(
                    containerColor = Color(0xFF131D31),
                    contentColor = Color.White,
                    tonalElevation = 8.dp,
                    windowInsets = WindowInsets.navigationBars
                ) {
                    NavigationBarItem(
                        selected = currentScreen == Screen.Home,
                        onClick = { viewModel.navigateTo(Screen.Home) },
                        icon = {
                            Icon(imageVector = Icons.Default.Build, contentDescription = "Create APK")
                        },
                        label = { Text("Create APK", fontSize = 11.sp) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color.White,
                            selectedTextColor = Color(0xFF38BDF8),
                            indicatorColor = Color(0xFF2563EB),
                            unselectedIconColor = Color(0xFF64748B),
                            unselectedTextColor = Color(0xFF64748B)
                        )
                    )

                    NavigationBarItem(
                        selected = currentScreen == Screen.History,
                        onClick = { viewModel.navigateTo(Screen.History) },
                        icon = {
                            Icon(imageVector = Icons.Default.History, contentDescription = "Build History")
                        },
                        label = { Text("History", fontSize = 11.sp) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color.White,
                            selectedTextColor = Color(0xFF38BDF8),
                            indicatorColor = Color(0xFF2563EB),
                            unselectedIconColor = Color(0xFF64748B),
                            unselectedTextColor = Color(0xFF64748B)
                        )
                    )

                    NavigationBarItem(
                        selected = currentScreen == Screen.Guide,
                        onClick = { viewModel.navigateTo(Screen.Guide) },
                        icon = {
                            Icon(imageVector = Icons.AutoMirrored.Filled.HelpOutline, contentDescription = "Guide")
                        },
                        label = { Text("Guide", fontSize = 11.sp) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color.White,
                            selectedTextColor = Color(0xFF38BDF8),
                            indicatorColor = Color(0xFF2563EB),
                            unselectedIconColor = Color(0xFF64748B),
                            unselectedTextColor = Color(0xFF64748B)
                        )
                    )

                    NavigationBarItem(
                        selected = currentScreen == Screen.AdminHealth,
                        onClick = { viewModel.navigateTo(Screen.AdminHealth) },
                        icon = {
                            Icon(imageVector = Icons.Default.Memory, contentDescription = "Status")
                        },
                        label = { Text("Status", fontSize = 11.sp) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color.White,
                            selectedTextColor = Color(0xFF38BDF8),
                            indicatorColor = Color(0xFF2563EB),
                            unselectedIconColor = Color(0xFF64748B),
                            unselectedTextColor = Color(0xFF64748B)
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(Color(0xFF0B1220))
        ) {
            Crossfade(targetState = currentScreen, label = "screen_crossfade") { screen ->
                when (screen) {
                    is Screen.Home -> HomeScreen(viewModel = viewModel)
                    is Screen.Analysis -> AnalysisScreen(viewModel = viewModel)
                    is Screen.Config -> ConfigScreen(viewModel = viewModel)
                    is Screen.BuildProgress -> BuildProgressScreen(viewModel = viewModel)
                    is Screen.BuildSuccess -> BuildSuccessScreen(viewModel = viewModel)
                    is Screen.History -> HistoryScreen(viewModel = viewModel)
                    is Screen.Guide -> GuideScreen(viewModel = viewModel)
                    is Screen.AdminHealth -> AdminHealthScreen(viewModel = viewModel)
                    is Screen.WebShell -> WebShellScreen(viewModel = viewModel)
                }
            }
        }
    }
}
