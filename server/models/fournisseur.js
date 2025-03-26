
const mongoose = require('mongoose');

const fournisseurSchema = new mongoose.Schema({
  id: { 
    type: String,
    required: true,
    unique: true
  },
  nomFournisseur: { 
    type: String, 
    required: true
  },
  adresseFournisseur: { 
    type: String, 
    required: true
  },
  telephoneFournisseur: { 
    type: String, 
    required: true
  },
  emailFournisseur: { 
    type: String, 
    required: true
  },
  ville: { 
    type: String, 
    required: true
  },
  contact: { 
    type: String, 
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Fournisseur', fournisseurSchema);
