import express from 'express';
import mysql from 'mysql2/promise';

// No password only applied on xampp and windows ONLY, adjust if needed
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // adjust if needed
  database: 'hk_dgpg',
  connectionLimit: 10,
  charset: 'utf8mb4_general_ci'
});

const ERRORS = {

}





// Start at 3001
server.listen(3001, () => {
  console.log('Server started at 3001, welcome to the HK dog Garden API');
});