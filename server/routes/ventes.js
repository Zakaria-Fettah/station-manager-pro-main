
const express = require('express');
const router = express.Router();
const Vente = require('../models/vente');

// Get all ventes
router.get('/', async (req, res) => {
  try {
    const ventes = await Vente.find();
    res.json(ventes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one vente
router.get('/:id', async (req, res) => {
  try {
    const vente = await Vente.findOne({ id: req.params.id });
    if (!vente) return res.status(404).json({ message: 'Vente non trouvée' });
    res.json(vente);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create vente
router.post('/', async (req, res) => {
  const vente = new Vente({
    id: req.body.id,
    quantiteVente: req.body.quantiteVente,
    dateVente: req.body.dateVente,
    modePaiement: req.body.modePaiement
  });

  try {
    const newVente = await vente.save();
    res.status(201).json(newVente);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update vente
router.put('/:id', async (req, res) => {
  try {
    const vente = await Vente.findOne({ id: req.params.id });
    if (!vente) return res.status(404).json({ message: 'Vente non trouvée' });
    
    if (req.body.id) vente.id = req.body.id;
    if (req.body.quantiteVente) vente.quantiteVente = req.body.quantiteVente;
    if (req.body.dateVente) vente.dateVente = req.body.dateVente;
    if (req.body.modePaiement) vente.modePaiement = req.body.modePaiement;
    
    const updatedVente = await vente.save();
    res.json(updatedVente);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete vente
router.delete('/:id', async (req, res) => {
  try {
    const vente = await Vente.findOne({ id: req.params.id });
    if (!vente) return res.status(404).json({ message: 'Vente non trouvée' });
    
    await Vente.deleteOne({ id: req.params.id });
    res.json({ message: 'Vente supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
