import { Controller, Get, NotImplementedException, Post, Put } from '@nestjs/common';

@Controller('ddi/:workspaceId/controller/v1/:deviceId')
export class DdiController {

  @Get('')
  getRoot() {
    throw new NotImplementedException();
  }

  @Put('/configData')
  putConfigData() {
    throw new NotImplementedException();
  }

  @Get('/installedBase/:deploymentId')
  getInstalledDeployment() {
    throw new NotImplementedException();
  }

  @Get('/deploymentBase/:deploymentId')
  getDeploymentBase() {
    throw new NotImplementedException();
  }

  @Post('/deploymentBase/:deploymentId/feedback')
  postDeploymentFeedback() {
    throw new NotImplementedException();
  }

  @Get('/softwaremodules/:imageVersionId/artifacts')
  getArtifacts() {
    throw new NotImplementedException();
  }

  @Get('/softwaremodules/:imageVersionId/artifacts/:fileName')
  downloadArtifact() {
    throw new NotImplementedException();
  }

  @Get('/softwaremodules/:imageVersionId/artifacts/:fileName.MD5SUM')
  downloadArtifactMD5() {
    throw new NotImplementedException();
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
