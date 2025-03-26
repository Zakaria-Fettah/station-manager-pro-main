
const express = require('express');
const router = express.Router();
const Citerne = require('../models/citerne');

// Get all citernes
router.get('/', async (req, res) => {
  try {
    const citernes = await Citerne.find();
    res.json(citernes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one citerne
router.get('/:id', async (req, res) => {
  try {
    const citerne = await Citerne.findOne({ id: req.params.id });
    if (!citerne) return res.status(404).json({ message: 'Citerne non trouvée' });
    res.json(citerne);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create citerne
router.post('/', async (req, res) => {
  const citerne = new Citerne({
    id: req.body.id,
    capacite: req.body.capacite,
    dateInstallation: req.body.dateInstallation,
    typeCarburant: req.body.typeCarburant,
    statut: req.body.statut
  });

  try {
    const newCiterne = await citerne.save();
    res.status(201).json(newCiterne);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update citerne
router.put('/:id', async (req, res) => {
  try {
    const citerne = await Citerne.findOne({ id: req.params.id });
    if (!citerne) return res.status(404).json({ message: 'Citerne non trouvée' });
    
    if (req.body.id) citerne.id = req.body.id;
    if (req.body.capacite) citerne.capacite = req.body.capacite;
    if (req.body.dateInstallation) citerne.dateInstallation = req.body.dateInstallation;
    if (req.body.typeCarburant) citerne.typeCarburant = req.body.typeCarburant;
    if (req.body.statut) citerne.statut = req.body.statut;
    
    const updatedCiterne = await citerne.save();
    res.json(updatedCiterne);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete citerne
router.delete('/:id', async (req, res) => {
  try {
    const citerne = await Citerne.findOne({ id: req.params.id });
    if (!citerne) return res.status(404).json({ message: 'Citerne non trouvée' });
    
    await Citerne.deleteOne({ id: req.params.id });
    res.json({ message: 'Citerne supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
