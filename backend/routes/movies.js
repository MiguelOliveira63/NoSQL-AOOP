const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// GET /api/movies?searchTerm=...&year=...&genre=...&sortOrder=asc|desc
router.get('/api/movies', async (req, res) => {
  try {
    const { searchTerm, year, genre, sortOrder } = req.query;
    const filters = {};
    if (searchTerm) filters.title = new RegExp(searchTerm, 'i');
    if (year) filters.year = parseInt(year);
    if (genre) filters.genres = genre;
    const sortDir = sortOrder === 'asc' ? 1 : -1;
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

// GET /api/movies/:id
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

// POST /api/movies - criar novo filme
router.post('/api/movies', async (req, res) => {
  try {
    const data = req.body;
    const movie = new Movie(data);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    console.error('Erro ao criar filme:', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/movies/:id — atualizar um filme
router.put('/api/movies/:id', async (req, res) => {
  try {
    const updates = req.body;
    const movie = await Movie.findByIdAndUpdate(req.params.id, updates, {
      new: true,            // retorna o documento já atualizado
      runValidators: true   // aplica validações do schema
    });
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json(movie);
  } catch (err) {
    console.error('Erro ao atualizar filme:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/movies/:id — apagar um filme
router.delete('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json({ message: 'Filme apagado com sucesso' });
  } catch (err) {
    console.error('Erro ao apagar filme:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
