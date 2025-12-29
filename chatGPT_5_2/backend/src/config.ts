import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 4000,
  dbType: (process.env.DB_TYPE || 'local').toLowerCase(),
  mongoUri: process.env.MONGO_URI ?? ''
};

