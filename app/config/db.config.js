module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "root",
  DB: "semomun-backend",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
};
