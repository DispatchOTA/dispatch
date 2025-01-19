import { IsEnum, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

enum ErrorCode {
  BadRequest = '400',
  Unauthorized = '401',
  Forbidden = '403',
  NotFound = '404',
  MethodNotAllowed = '405',
  NotAcceptable = '406',
  Conflict = '409',
  Gone = '410',
  UnsupportedMediaType = '415',
  TooManyRequests = '429',
}

export class ErrorResDto {
  @IsString()
  exceptionClass: string;

  @IsEnum(ErrorCode)
  errorCode: ErrorCode;

  @IsString()
  message: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  parameters: string[];
}
