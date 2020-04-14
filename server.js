const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to DB
connectDB();

const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', [
    'http://localhost:3000/',
    'https://sharp-clarke-2b9a68.netlify.com/',
  ]);
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.use(cors());

app.get('/', (req, res) => res.send('API Running...'));

// Body parser
app.use(express.json());

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notes', require('./routes/notes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
