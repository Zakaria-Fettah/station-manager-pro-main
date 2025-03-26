
const express = require('express');
const router = express.Router();
const Fournisseur = require('../models/fournisseur');

// Get all fournisseurs
router.get('/', async (req, res) => {
  try {
    const fournisseurs = await Fournisseur.find();
    res.json(fournisseurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one fournisseur
router.get('/:id', async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findOne({ id: req.params.id });
    if (!fournisseur) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    res.json(fournisseur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create fournisseur
router.post('/', async (req, res) => {
  const fournisseur = new Fournisseur({
    id: req.body.id,
    nomFournisseur: req.body.nomFournisseur,
    adresseFournisseur: req.body.adresseFournisseur,
    telephoneFournisseur: req.body.telephoneFournisseur,
    emailFournisseur: req.body.emailFournisseur,
    ville: req.body.ville,
    contact: req.body.contact
  });

  try {
    const newFournisseur = await fournisseur.save();
    res.status(201).json(newFournisseur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update fournisseur
router.put('/:id', async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findOne({ id: req.params.id });
    if (!fournisseur) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    
    if (req.body.id) fournisseur.id = req.body.id;
    if (req.body.nomFournisseur) fournisseur.nomFournisseur = req.body.nomFournisseur;
    if (req.body.adresseFournisseur) fournisseur.adresseFournisseur = req.body.adresseFournisseur;
    if (req.body.telephoneFournisseur) fournisseur.telephoneFournisseur = req.body.telephoneFournisseur;
    if (req.body.emailFournisseur) fournisseur.emailFournisseur = req.body.emailFournisseur;
    if (req.body.ville) fournisseur.ville = req.body.ville;
    if (req.body.contact) fournisseur.contact = req.body.contact;
    
    const updatedFournisseur = await fournisseur.save();
    res.json(updatedFournisseur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete fournisseur
router.delete('/:id', async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findOne({ id: req.params.id });
    if (!fournisseur) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    
    await Fournisseur.deleteOne({ id: req.params.id });
    res.json({ message: 'Fournisseur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
