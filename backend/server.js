//bring in express
const express = require('express');

const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db')

const PORT = process.env.PORT || 8000;

//connect to Database
connectDB()

//initialize app variable
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create route req's
app.get('/', (req, res) => {
  res.status(200).json({ message: `Welcome to the Support Desk API` });
});

//Routing
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
