const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes       = require('./routes/userRoutes');        
const storeOwnerRoutes = require('./routes/storeOwnerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes); 
app.use('/user',  userRoutes);     
app.use('/owner', storeOwnerRoutes);

// DB connection test + server start
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('DB connection failed:', err));