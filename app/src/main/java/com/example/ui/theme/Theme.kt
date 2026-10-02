package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = BluePrimary,
    onPrimary = Color.White,
    primaryContainer = Color(0xFF1E3A8A),
    onPrimaryContainer = Color(0xFFDBEAFE),
    secondary = CyanAccent,
    onSecondary = Color(0xFF0F172A),
    background = SlateBackground,
    onBackground = Color.White,
    surface = SlateSurface,
    onSurface = Color.White,
    surfaceVariant = SlateSurfaceVariant,
    onSurfaceVariant = TextMuted,
    outline = SlateBorder
)

private val LightColorScheme = darkColorScheme(
    primary = BluePrimary,
    onPrimary = Color.White,
    background = SlateBackground,
    onBackground = Color.White,
    surface = SlateSurface,
    onSurface = Color.White,
    surfaceVariant = SlateSurfaceVariant,
    onSurfaceVariant = TextMuted,
    outline = SlateBorder
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = true,
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit,
) {
    val colorScheme = DarkColorScheme
    MaterialTheme(colorScheme = colorScheme, typography = Typography, content = content)
}
