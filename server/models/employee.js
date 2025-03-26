
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  id: { 
    type: String,
    required: true,
    unique: true
  },
  cin: { 
    type: String,
    required: true,
    unique: true
  },
  nom: { 
    type: String, 
    required: true 
  },
  prenom: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  telephone: { 
    type: String 
  },
  genre: {
    type: String,
    enum: ['Homme', 'Femme', 'Autre'],
    required: true
  },
  dateNaissance: {
    type: Date,
    required: true
  },
  adresse: {
    type: String
  },
  nationalite: {
    type: String
  },
  status: {
    type: String,
    enum: ['Actif', 'Inactif', 'En congé'],
    default: 'Actif'
  },
  cnss: {
    type: String
  },
  typeContrat: {
    type: String,
    enum: ['CDI', 'CDD', 'Stagiaire', 'Intérimaire', 'Consultant']
  },
  position: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
