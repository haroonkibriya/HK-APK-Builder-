package com.example.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface BuildDao {
    @Query("SELECT * FROM build_records ORDER BY createdAt DESC")
    fun getAllBuilds(): Flow<List<BuildEntity>>

    @Query("SELECT * FROM build_records WHERE id = :id LIMIT 1")
    suspend fun getBuildById(id: Long): BuildEntity?

    @Query("SELECT * FROM build_records WHERE buildId = :buildId LIMIT 1")
    suspend fun getBuildByBuildId(buildId: String): BuildEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBuild(build: BuildEntity): Long

    @Update
    suspend fun updateBuild(build: BuildEntity)

    @Query("DELETE FROM build_records WHERE id = :id")
    suspend fun deleteBuildById(id: Long)

    @Query("DELETE FROM build_records WHERE expiresAt < :currentTime")
    suspend fun deleteExpiredBuilds(currentTime: Long): Int

    @Query("SELECT COUNT(*) FROM build_records")
    fun getBuildCount(): Flow<Int>

    @Query("SELECT COUNT(*) FROM build_records WHERE status = 'SUCCESS'")
    fun getSuccessCount(): Flow<Int>
}
