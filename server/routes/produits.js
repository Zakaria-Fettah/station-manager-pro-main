
const express = require('express');
const router = express.Router();
const Produit = require('../models/produit');

// Get all produits
router.get('/', async (req, res) => {
  try {
    const produits = await Produit.find();
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one produit
router.get('/:id', async (req, res) => {
  try {
    const produit = await Produit.findOne({ id: req.params.id });
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create produit
router.post('/', async (req, res) => {
  const produit = new Produit({
    id: req.body.id,
    nomProduit: req.body.nomProduit,
    type: req.body.type,
    dateAjout: req.body.dateAjout,
    unite: req.body.unite
  });

  try {
    const newProduit = await produit.save();
    res.status(201).json(newProduit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update produit
router.put('/:id', async (req, res) => {
  try {
    const produit = await Produit.findOne({ id: req.params.id });
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    
    if (req.body.id) produit.id = req.body.id;
    if (req.body.nomProduit) produit.nomProduit = req.body.nomProduit;
    if (req.body.type) produit.type = req.body.type;
    if (req.body.dateAjout) produit.dateAjout = req.body.dateAjout;
    if (req.body.unite) produit.unite = req.body.unite;
    
    const updatedProduit = await produit.save();
    res.json(updatedProduit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete produit
router.delete('/:id', async (req, res) => {
  try {
    const produit = await Produit.findOne({ id: req.params.id });
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    
    await Produit.deleteOne({ id: req.params.id });
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
