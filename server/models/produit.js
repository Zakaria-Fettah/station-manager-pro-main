
const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  id: { 
    type: String,
    required: true,
    unique: true
  },
  nomProduit: { 
    type: String, 
    required: true
  },
  type: { 
    type: String, 
    required: true
  },
  dateAjout: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  unite: { 
    type: String, 
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Produit', produitSchema);
