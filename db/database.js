const pgp = require('pg-promise')();
const { pgport, pguser, pgdatabase, pgpassword, pghost } = require('../config');

let connection

if (process.env.SSL) {
    connection = {
        connectionString: `postgres://${pguser}:${pgpassword}@${pghost}:${pgport}/${pgdatabase}`,
        ssl: { rejectUnauthorized: false }
    };
} else {
    connection = `postgres://${pguser}:${pgpassword}@${pghost}:${pgport}/${pgdatabase}`
}

const db = pgp(connection);

module.exports = db;

