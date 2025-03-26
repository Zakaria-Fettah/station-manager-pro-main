
const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  id: { 
    type: String,
    required: true,
    unique: true
  },
  nomStation: { 
    type: String, 
    required: true 
  },
  adresseStation: { 
    type: String, 
    required: true 
  },
  villeStation: { 
    type: String, 
    required: true 
  },
  dateMiseEnService: { 
    type: Date, 
    required: true 
  },
  latitude: { 
    type: Number,
    required: true
  },
  longitude: { 
    type: Number,
    required: true
  },
  telephone: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir une adresse email valide']
  },
  horairesOuverture: { 
    type: String, 
    required: true 
  },
  statut: { 
    type: String, 
    required: true,
    enum: ['active', 'inactive', 'maintenance']
  }
}, { timestamps: true });

module.exports = mongoose.model('Station', stationSchema);
