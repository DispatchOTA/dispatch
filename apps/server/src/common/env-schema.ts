import * as Joi from 'joi';
import {
  ENV_PROVISION,
  ENV_PRODUCTION,
  ENV_TEST,
  ENV_DEVELOPMENT,
} from './consts';
import { ProviderType } from '../object-storage/providers';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(ENV_DEVELOPMENT, ENV_PRODUCTION, ENV_TEST, ENV_PROVISION)
    .default(ENV_DEVELOPMENT),
  PORT: Joi.number().port().default(3000),
  ORIGIN: Joi.string().uri().default('http://localhost:3000'),
  OBJECT_STORAGE_PROVIDER: Joi.string().valid(
    ProviderType.Filesystem,
    ProviderType.S3,
  ).default(ProviderType.Filesystem),
});
