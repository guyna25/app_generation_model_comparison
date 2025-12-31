const requiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  mongoUri: process.env.MONGODB_URI || "",
  localDbPath: process.env.LOCAL_DB_PATH || ""
};

export const getMongoUri = () => requiredEnv("MONGODB_URI");
