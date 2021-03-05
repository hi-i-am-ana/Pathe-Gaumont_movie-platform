const pgp = require('pg-promise')();
const { pgport, pguser, pgdatabase, pgpassword } = require('../config');

const connection = `postgres://${pguser}:${pgpassword}@localhost:${pgport}/${pgdatabase}`;
const db = pgp(connection);

module.exports = db;