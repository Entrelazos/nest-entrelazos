module.exports = {
  apps: [
    {
      name: 'nest-entrelazos',
      script: 'dist/src/main.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        DB_CONNECTION: 'mysql',
        DB_HOST: 'localhost',
        DB_PORT: 3306,
        DB_DATABASE: 'dbname',
        DB_USERNAME: 'dbuser',
        DB_PASSWORD: 'dbpass',
      },
    },
  ],
};
