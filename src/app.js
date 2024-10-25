const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { config } = require('dotenv');

config();
  
const bookRoutes = require('./routes/book.route');

// Usamos express para los middleware
const app = express();
app.use(bodyParser.json()); // Parseador de Bodies

// Aca conectamos la base de datos
mongoose.connect(process.env.MONGO_URL,
    { dbName: process.env.MONGO_DB_NAME }) 
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const db = mongoose.connection;

app.use('/books', bookRoutes);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});