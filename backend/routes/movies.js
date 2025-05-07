const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

router.get('/api/movies', async (req, res) => {
  try {
    const { searchTerm, year, genre, sortOrder } = req.query;

    // 1) Monta filtros
    const filters = {};
    if (searchTerm) {
      filters.title = new RegExp(searchTerm, 'i');
    }
    if (year) {
      filters.year = parseInt(year);
    }
    if (genre) {
      filters.genres = genre;
    }

    // 2) Define direção da ordenação: 1 = ascendente, -1 = descendente
    const sortDir = sortOrder === 'asc' ? 1 : -1;

    // 3) Executa consulta com filtros, ordenação e limite
    const movies = await Movie.find(filters)
      .select('title year poster genres imdb.rating')
      .sort({ 'imdb.rating': sortDir })
      .limit(50);

    res.json(movies);
  } catch (err) {
    console.error('Erro ao buscar filmes:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json(movie);
  } catch (err) {
    console.error('Erro ao buscar filme por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
