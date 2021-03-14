module.exports = {
  port: process.env.PORT,

  pgport: process.env.POSTGRES_PORT,
  pguser: process.env.POSTGRES_USERNAME,
  pgdatabase: process.env.POSTGRES_DATABASE,
  pgpassword: process.env.POSTGRES_PASSWORD,

  api_key: process.env.API_KEY,

  sendgrid_api_key: process.env.SENDGRID_API_KEY,
};

// This is how my .env looks like:
// PORT=2046

// POSTGRES_PORT=5432
// POSTGRES_DATABASE="pathe_gaumont"
// POSTGRES_USERNAME="anastasia"
// POSTGRES_PASSWORD="password"
