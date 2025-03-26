
const mongoose = require('mongoose');

const planningSchema = new mongoose.Schema({
  id: { 
    type: String,
    required: true,
    unique: true
  },
  semaine: { 
    type: Number, 
    required: true,
    min: 1,
    max: 53
  },
  jour: { 
    type: String, 
    required: true,
    enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
  },
  heureDebut: { 
    type: String, 
    required: true
  },
  heureFin: { 
    type: String, 
    required: true
  },
  annee: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100
  },
  employeeId: {
    type: String,
    ref: 'Employee'
  }
}, { timestamps: true });

module.exports = mongoose.model('Planning', planningSchema);
