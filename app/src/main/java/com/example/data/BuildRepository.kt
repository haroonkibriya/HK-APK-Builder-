package com.example.data

import kotlinx.coroutines.flow.Flow

class BuildRepository(private val buildDao: BuildDao) {
    val allBuilds: Flow<List<BuildEntity>> = buildDao.getAllBuilds()
    val totalBuildsCount: Flow<Int> = buildDao.getBuildCount()
    val successBuildsCount: Flow<Int> = buildDao.getSuccessCount()

    suspend fun getBuildById(id: Long): BuildEntity? = buildDao.getBuildById(id)

    suspend fun getBuildByBuildId(buildId: String): BuildEntity? = buildDao.getBuildByBuildId(buildId)

    suspend fun insertBuild(build: BuildEntity): Long = buildDao.insertBuild(build)

    suspend fun updateBuild(build: BuildEntity) = buildDao.updateBuild(build)

    suspend fun deleteBuild(id: Long) = buildDao.deleteBuildById(id)

    suspend fun deleteExpiredBuilds(): Int = buildDao.deleteExpiredBuilds(System.currentTimeMillis())
}
