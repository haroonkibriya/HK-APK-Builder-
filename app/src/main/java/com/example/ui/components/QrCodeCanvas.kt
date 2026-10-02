package com.example.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import java.security.MessageDigest

@Composable
fun QrCodeCanvas(
    content: String,
    modifier: Modifier = Modifier,
    size: Dp = 200.dp
) {
    val matrix = remember(content) {
        generateQrMatrix(content, 25)
    }

    Box(
        modifier = modifier
            .size(size)
            .clip(RoundedCornerShape(16.dp))
            .background(Color.White)
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.matchParentSize()) {
            val n = matrix.size
            val cellSize = this.size.width / n

            for (r in 0 until n) {
                for (c in 0 until n) {
                    if (matrix[r][c]) {
                        drawRect(
                            color = Color(0xFF0F172A),
                            topLeft = Offset(c * cellSize, r * cellSize),
                            size = Size(cellSize, cellSize)
                        )
                    }
                }
            }
        }
    }
}

private fun generateQrMatrix(data: String, size: Int): Array<BooleanArray> {
    val matrix = Array(size) { BooleanArray(size) }

    fun drawFinderPattern(row: Int, col: Int) {
        for (r in 0 until 7) {
            for (c in 0 until 7) {
                val isOuter = r == 0 || r == 6 || c == 0 || c == 6
                val isInner = r in 2..4 && c in 2..4
                matrix[row + r][col + c] = isOuter || isInner
            }
        }
    }

    // Top-Left, Top-Right, Bottom-Left finders
    drawFinderPattern(0, 0)
    drawFinderPattern(0, size - 7)
    drawFinderPattern(size - 7, 0)

    // Timing lines
    for (i in 8 until size - 8) {
        val on = (i % 2) == 0
        matrix[6][i] = on
        matrix[i][6] = on
    }

    // Deterministic data fill based on sha256 of data
    val hash = MessageDigest.getInstance("SHA-256").digest(data.toByteArray())
    var hashIndex = 0
    var bitIndex = 0

    for (r in 0 until size) {
        for (c in 0 until size) {
            // Skip finder patterns + separators
            val inTopLeft = r <= 7 && c <= 7
            val inTopRight = r <= 7 && c >= size - 8
            val inBottomLeft = r >= size - 8 && c <= 7
            val isTiming = (r == 6 || c == 6)

            if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
                val byteVal = hash[hashIndex % hash.size].toInt()
                val bit = ((byteVal ushr bitIndex) and 1) == 1
                // Add pseudo-random pattern mixed with data
                matrix[r][c] = bit xor ((r + c) % 3 == 0)

                bitIndex++
                if (bitIndex >= 8) {
                    bitIndex = 0
                    hashIndex++
                }
            }
        }
    }

    return matrix
}
