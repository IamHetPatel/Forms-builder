const mongoose = require("mongoose");
require('dotenv').config();

  mongoose.connect(`mongodb+srv://hetp943:${process.env.MONGO_PASS}@cluster0.ewu1pqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
  