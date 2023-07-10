/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DB_CONNECTION: Joi.string().default('mysql'),
  DB_HOST: Joi.string().default('127.0.0.1'),
  DB_PORT: Joi.number().default(3306),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
});
