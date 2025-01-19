import { Controller, Get, NotImplementedException, Param, Post, Put } from '@nestjs/common';
import { WorkspaceDeviceDeploymentParams, WorkspaceDeviceImageVersionFilenameParams, WorkspaceDeviceImageVersionParams, WorkspaceDeviceParams } from './dtos/path-params.dto';
import { DdiService } from './ddi.service';

@Controller('ddi/:workspaceId/controller/v1/:deviceId')
export class DdiController {

  constructor(
    private readonly ddiService: DdiService
  ) {}

  @Get('')
  getRoot(@Param() params: WorkspaceDeviceParams) {
    return this.ddiService.getRoot(params.workspaceId, params.deviceId);
  }

  @Put('/configData')
  putConfigData() {
    throw new NotImplementedException();
  }

  @Get('/installedBase/:deploymentId')
  getInstalledDeployment(@Param() params: WorkspaceDeviceDeploymentParams) {
    return this.ddiService.getInstalledDeployment(params.workspaceId, params.deviceId, params.deploymentId);
  }

  @Get('/deploymentBase/:deploymentId')
  getDeploymentBase(@Param() params: WorkspaceDeviceDeploymentParams) {
    return this.ddiService.getDeploymentBase(params.workspaceId, params.deviceId, params.deploymentId);
  }

  @Post('/deploymentBase/:deploymentId/feedback')
  postDeploymentFeedback(@Param() params: WorkspaceDeviceDeploymentParams) {
    return this.ddiService.postDeploymentFeedback(params.workspaceId, params.deviceId, params.deploymentId);
  }

  @Get('/softwaremodules/:imageVersionId/artifacts')
  getArtifacts(@Param() params: WorkspaceDeviceImageVersionParams) {
    return this.ddiService.getArtifacts(params.workspaceId, params.deviceId, params.imageVersionId);
  }

  @Get('/softwaremodules/:imageVersionId/artifacts/:fileName')
  downloadArtifact(@Param() params: WorkspaceDeviceImageVersionFilenameParams) {
    return this.ddiService.downloadArtifact(params.workspaceId, params.deviceId, params.imageVersionId, params.fileName);
  }

  @Get('/softwaremodules/:imageVersionId/artifacts/:fileName.MD5SUM')
  downloadArtifactMD5(@Param() params: WorkspaceDeviceImageVersionFilenameParams) {
    return this.ddiService.downloadArtifactMD5(params.workspaceId, params.deviceId, params.imageVersionId, params.fileName);
  }

  @Get('/cancelAction/:deploymentId')
  cancelDeployment() {
    throw new NotImplementedException();
  }

  @Post('/cancelAction/:deploymentId/feedback')
  cancelDeploymentFeedback() {
    throw new NotImplementedException();
  }

  @Get('/confirmationBase')
  getConfirmationBase() {
    throw new NotImplementedException();
  }

  @Get('/confirmationBase/:deploymentId')
  getDeploymentConfirmation() {
    throw new NotImplementedException();
  }

  @Post('/confirmationBase/:deploymentId/feedback')
  postConfirmationFeedback() {
    throw new NotImplementedException();
  }

  @Post('/confirmationBase/activateAutoConfirm')
  activateAutoConfirm() {
    throw new NotImplementedException();
  }

  @Post('/confirmationBase/deactivateAutoConfirm')
  deactivateAutoConfirm() {
    throw new NotImplementedException();
  }

}
