import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  APP_PORT: Joi.number().default(3000),

  // Database
  DB_HOST: Joi.string().required(),

  DB_PORT: Joi.number().default(5432),

  DB_USERNAME: Joi.string().required(),

  DB_PASSWORD: Joi.string().allow('').required(),

  DB_DATABASE: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),

  JWT_EXPIRES_IN: Joi.string().default('1d'),

  // CORS
  CORS_ORIGIN: Joi.string().required(),

  // Mailtrap / SMTP
  MAIL_HOST: Joi.string().required(),

  MAIL_PORT: Joi.number().default(2525),

  MAIL_USERNAME: Joi.string().required(),

  MAIL_PASSWORD: Joi.string().required(),

  MAIL_FROM_EMAIL: Joi.string().email().required(),

  MAIL_FROM_NAME: Joi.string().required(),
});
