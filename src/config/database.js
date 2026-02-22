import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from '@sequelize/core';

const sequelize = new Sequelize({
  database: process.env.DB_DATABASE || 'express_db',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOSTNAME || 'localhost',
  dialect: 'mysql',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
});

export default sequelize;