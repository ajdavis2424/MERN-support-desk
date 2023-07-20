const path = require('path');
//bring in express
const express = require('express');

const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5005;

//connect to Database
connectDB();

//initialize app variable
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routing
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

//Serve frontend
if (process.env.NODE_ENV === 'production') {
  //static build folder/frontend build folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(__dirname, '../', 'frontend', 'build', 'index.html')
  );

  // app.get('*', (_, res) => {
  //   res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  // });
} else {
  app.get('/', (_, res) => {
    res.status(200).json({ message: 'Welcome to the Support Desk API' });
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
