import express from 'express'
import mysql from 'mysql'
import bodyParser from 'body-parser'
import validator from 'validator'
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 5000 
app.use(bodyParser.json());
app.use(cors({
    methods : ["GET" ,"POST"] ,
    origin : "http://localhost:3000" ,
    credentials : true ,
}))
app.use(express.json())

// Create connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ivru251002',
  database: 'twitter',
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
  app.listen(PORT, () => {console.log(`Server is listening on port : ${PORT}`)})
});


// Sign Up route
app.post('/signup', (req, res) => {
  const { username, email, phoneNumber, password } = req.body;
  if (!validator.isEmail(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  } 
  console.log(username, email, phoneNumber, password)
  
  const sql = 'INSERT INTO users (username, email, phone_number, password) VALUES (?, ?, ?, ?)';
  connection.query(sql, [username, email, "", password], (err, result) => {
    if (err) {
      console.error('Error signing up:', err);
      res.status(500).json({ error: 'Error signing up' });
      return;
    }
    console.log('User signed up:', username);
    res.status(200).json({ message: 'User signed up successfully' });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(username)
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).json({ error: 'Error logging in' });
      return;
    }
    if (result.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }
    console.log('User logged in:', username);
    res.status(200).json({ message: 'User logged in successfully', username : username });
    })
})

// Make Tweet route
app.post('/tweets', (req, res) => {
    const { username, tweetContent } = req.body;
    const sql = 'INSERT INTO tweets (username, tweet_content) VALUES (?, ?)';
    connection.query(sql, [username, tweetContent], (err, result) => {
      if (err) {
        console.error('Error making tweet:', err);
        res.status(500).json({ error: 'Error making tweet' });
        return;
      }
      console.log('Tweet made by', username);
      res.status(200).json({ message: 'Tweet made successfully' });
    });
  });
  
  // Get Tweets route
  app.get('/tweets', (req, res) => {
    const sql = 'SELECT * FROM tweets';
    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error getting tweets:', err);
        res.status(500).json({ error: 'Error getting tweets' });
        return;
      }
      console.log('Tweets retrieved');
      res.status(200).json(result);
    });
  });
  
