
const mongoose = require('mongoose');

const citerneSchema = new mongoose.Schema({
  id: { 
    type: String,
    required: true,
    unique: true
  },
  capacite: { 
    type: Number, 
    required: true,
    min: 0
  },
  dateInstallation: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  typeCarburant: { 
    type: String, 
    required: true,
    enum: ['essence', 'diesel', 'gpl', 'bioéthanol', 'superéthanol']
  },
  statut: { 
    type: String, 
    required: true,
    enum: ['en service', 'hors service', 'en maintenance']
  }
}, { timestamps: true });

module.exports = mongoose.model('Citerne', citerneSchema);
