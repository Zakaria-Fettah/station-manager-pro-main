
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const employeeRoutes = require('./routes/employees');
app.use('/api/employees', employeeRoutes);

// Add ventes routes
const ventesRoutes = require('./routes/ventes');
app.use('/api/ventes', ventesRoutes);

// Add citernes routes
const citernesRoutes = require('./routes/citernes');
app.use('/api/citernes', citernesRoutes);

// Add produits routes
const produitsRoutes = require('./routes/produits');
app.use('/api/produits', produitsRoutes);

// Add fournisseurs routes
const fournisseursRoutes = require('./routes/fournisseurs');
app.use('/api/fournisseurs', fournisseursRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
