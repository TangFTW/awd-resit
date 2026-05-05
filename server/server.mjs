import express from 'express'
import mysql from 'mysql2/promise';

const server = express();
server.use(express.json());

// Create a connection pool to database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // adjust if needed
  database: 'hkpo_mobile',
  connectionLimit: 10,
  charset: 'utf8mb4_general_ci'
});


//create post
server.post('/mobilepost', async (req, res) => {
  //note: you are getting all columns from a box of parcel by request body(req.body)
  const {
  mobileCode, dayOfWeekCode, seq,
  nameEN, districtEN, locationEN, addressEN,
  // Trad Chinese data
  nameTC, districtTC, locationTC, addressTC,
  // Simplified Chinese data
  nameSC, districtSC, locationSC, addressSC,
  // Geographical data like open and close hour, latitude and longitude
  openHour, closeHour, latitude, longitude
} = req.body;
  // Step 2: Check the required fields exist, remember using null is of numrical data
    if (!mobileCode || dayOfWeekCode == null || seq == null) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
  // Insert SQL script (? are for prevent SQL injection)
    const sql = `INSERT INTO mobilepost (
    mobileCode, dayOfWeekCode, seq, 
    nameEN, districtEN, locationEN, addressEN,
    nameTC, districtTC, locationTC, addressTC,
    nameSC, districtSC, locationSC, addressSC,
    openHour, closeHour, latitude, longitude
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
// params is a varable ,using || '' or || 0 to avoid null inputs, to prevent SQL errors
  const params = [
    mobileCode, dayOfWeekCode, seq , 
    nameEN, districtEN || '', locationEN || '', addressEN || '', 
    nameTC || '', districtTC || '', locationTC || '', addressTC || '',
    nameSC || '', districtSC || '', locationSC || '', addressSC || '',
    openHour || '00:00' , closeHour || '00:00' ,  latitude || 0 , longitude || 0];
  // Step 4: Run it, return success with the new ID
    try {
      const [ result ] = await pool.query(sql, params);
      console.log('New mobile post created.')
      res.status(201).json({ success: true, id: result.insertId }); 
    } 
    //  If err, returns 500 with message.
      catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Db operation failed." }); 
    }
    


})

//DELETE Post
server.delete('/mobilepost/:id', async (req, res) => {
  const id = req.params.id;
  const recordId = Number(id);
    if (!Number.isInteger(recordId) || recordId <= 0) {
      return res.status(400).json({ success: false, message: 'Invild id.' });
    }
  const sql = 'DELETE FROM mobilepost WHERE ID = ?';

  try{
    const [ result ] = await pool.query(sql, [recordId])
    if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, message: 'Record deleted successfully' });
    }

 //  If err, returns 500 with message.
      catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ success: false, message: "Db operation failed." }); 
      }


// Start server
server.listen(3001, () => {
  console.log('Server started at 3001, welcome to the HKPO Mobile Post API');
  });