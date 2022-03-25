module.exports = {
  HOST: process.env.DB_DEV_HOST,
  USER: process.env.DB_DEV_USER,
  PASSWORD: process.env.DB_DEV_PASSWORD,
  DB: process.env.DB_DEV_DATABASE,
  PORT: process.env.PORT,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

