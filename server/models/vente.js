
const mongoose = require('mongoose');

const venteSchema = new mongoose.Schema({
  id: { 
    type: String,
    required: true,
    unique: true
  },
  quantiteVente: { 
    type: Number, 
    required: true,
    min: 0
  },
  dateVente: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  modePaiement: { 
    type: String, 
    required: true,
    enum: ['espèces', 'carte bancaire', 'chèque', 'virement']
  }
}, { timestamps: true });

module.exports = mongoose.model('Vente', venteSchema);
