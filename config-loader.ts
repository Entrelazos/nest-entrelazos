/* eslint-disable prettier/prettier */
export const configLoader = () => {
  return {
    port: process.env.PORT,
    dbConnection:process.env.DB_CONNECTION,
    dbHost:process.env.DB_HOST,
    dbPort:process.env.DB_PORT,
    dbDatabase:process.env.DB_DATABASE,
    dbUser:process.env.DB_USERNAME,
    dbPass:process.env.DB_PASSWORD,
  };
};
