import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { GitProject, GitRepo, GitStaff } from '@repo/db'

import { GitHelperService } from './git-helper.service'

@Controller('/git-helper')
export class GitHelperController {
  constructor(private readonly gitHelperService: GitHelperService) {}

  @Post('/project')
  async addProject(@Body() gitProject: GitProject) {
    return this.gitHelperService.addProject(gitProject)
  }

  @Get('/project')
  async listAllProject() {
    return this.gitHelperService.listAllProject()
  }

  @Get('/project/:projectId')
  async getProject(@Param('projectId') projectId: string) {
    return this.gitHelperService.selectProjectById(projectId)
  }

  @Put('/project/:projectId')
  async updateProject(@Param('projectId') projectId: string, @Body() gitProject: GitProject) {
    return this.gitHelperService.updateProject(projectId, gitProject)
  }

  @Delete('/project/:projectId')
  async deleteProject(@Param('projectId') projectId: string) {
    return this.gitHelperService.deleteProject(projectId)
  }

  @Post('/project/:projectId/repo')
  async addRepo(@Param('projectId') projectId: string, @Body() gitRepo: GitRepo) {
    return this.gitHelperService.addRepo(projectId, gitRepo)
  }

  @Get('/project/:projectId/repo/:repoId')
  async getRepo(@Param('projectId') projectId: string, @Param('repoId') repoId: string) {
    return this.gitHelperService.selectRepo(projectId, repoId)
  }

  @Delete('/project/:projectId/repo/:repoId')
  async deleteRepo(@Param('projectId') projectId: string, @Param('repoId') repoId: string) {
    return this.gitHelperService.deleteRepo(projectId, repoId)
  }

  @Post('/project/:projectId/staff')
  async addStaff(@Param('projectId') projectId: string, @Body() gitStaff: GitStaff) {
    return this.gitHelperService.addStaff(projectId, gitStaff)
  }

  @Put('/project/:projectId/staff/:staffId')
  async updateStaff(
    @Param('projectId') projectId: string,
    @Param('staffId') staffId: string,
    @Body() gitStaff: GitStaff
  ) {
    return this.gitHelperService.updateStaff(projectId, staffId, gitStaff)
  }

  @Delete('/project/:projectId/staff/:staffId')
  async deleteStaff(@Param('projectId') projectId: string, @Param('staffId') staffId: string) {
    return this.gitHelperService.deleteStaff(projectId, staffId)
  }

  @Post('/project/:projectId/repo/:repoId/sync')
  async syncRepo(@Param('projectId') projectId: string, @Param('repoId') repoId: string) {
    return this.gitHelperService.syncRepo(projectId, repoId)
  }

  @Post('/project/:projectId/sync-all-repos')
  async syncAllRepos(@Param('projectId') projectId: string) {
    return this.gitHelperService.syncAllRepos(projectId)
  }

  @Post('/project/:projectId/repo/:repoId/aggregate-commits')
  async aggregateCommits(@Param('projectId') projectId: string, @Param('repoId') repoId: string) {
    return this.gitHelperService.aggregateCommits(projectId, repoId)
  }

  @Post('/project/:projectId/git-weekly')
  async gitWeekly(@Param('projectId') projectId: string) {
    this.gitHelperService.gitWeekly(projectId)
  }

  @Post('/project/:projectId/staff/:staffId/git-weekly')
  async gitWeeklyByStaffName(@Param('projectId') projectId: string, @Param('staffId') staffId: string) {
    this.gitHelperService.gitWeekly(projectId, staffId)
  }
}
