import { IsEnum, IsOptional, IsNumber, IsArray, IsString } from 'class-validator';

enum ConfirmationEnum {
  CONFIRMED = 'confirmed',
  DENIED = 'denied'
}

export class ConfirmationFeedbackReqDto {
  @IsEnum(ConfirmationEnum)
  confirmation: ConfirmationEnum;

  @IsOptional()
  @IsNumber()
  code?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  details?: string[];
}
