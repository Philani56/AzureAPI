const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');

const app = express(); // Define app here
const port = 3000; // Define the port number

// Database configuration
const dbConfig = {
  user: 'shravan',
  password: '1234*',
  server: 'alsproject.database.windows.net', 
  database: 'als',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
  },
};

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to database
sql.connect(dbConfig, err => {
  if (err) {
    console.log('Database connection failed:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// API endpoint for user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const request = new sql.Request();
    const result = await request
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .query('SELECT * FROM respondenttable WHERE Email = @username AND Password = @password');
    
    if (result.recordset.length > 0) {
      res.json({ success: true, message: 'Login successful', user: result.recordset[0] });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.log('Query failed:', err);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
