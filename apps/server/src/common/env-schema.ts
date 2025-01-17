import * as Joi from 'joi';
import {
  ENV_PROVISION,
  ENV_PRODUCTION,
  ENV_TEST,
  ENV_DEVELOPMENT,
} from './consts';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(ENV_DEVELOPMENT, ENV_PRODUCTION, ENV_TEST, ENV_PROVISION)
    .default(ENV_DEVELOPMENT),
  PORT: Joi.number().port().default(3000),
});
