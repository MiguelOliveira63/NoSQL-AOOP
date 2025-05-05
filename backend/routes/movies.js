const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

router.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find({}, 'title year poster').limit(50);
    res.json(movies);
  } catch (err) {
    console.error('Erro ao buscar filmes:', err); // debug
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json(movie);
  } catch (err) {
    console.error('Erro ao buscar filme por ID:', err); // debug
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
