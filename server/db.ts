import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  decimalNumbers: true, // lat/lng come back as numbers, not strings
  waitForConnections: true,
  connectionLimit: 10,
});