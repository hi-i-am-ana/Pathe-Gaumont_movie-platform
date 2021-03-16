module.exports = {
  port: process.env.PORT,

  pgport: process.env.POSTGRES_PORT,
  pguser: process.env.POSTGRES_USERNAME,
  pgdatabase: process.env.POSTGRES_DATABASE,
  pgpassword: process.env.POSTGRES_PASSWORD,
  pghost: process.env.POSTGRES_HOST,

  api_key: process.env.API_KEY,

  sendgrid_api_key: process.env.SENDGRID_API_KEY,
};
