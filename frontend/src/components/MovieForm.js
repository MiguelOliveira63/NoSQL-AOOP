import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MovieForm.css';

const MovieForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    poster: '',
    genres: '',
    imdbRating: '',
    imdbVotes: ''
  });
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // prepare payload
    const payload = {
      title: formData.title,
      year: parseInt(formData.year),
      poster: formData.poster,
      genres: formData.genres.split(',').map(s => s.trim()),
      imdb: {
        rating: parseFloat(formData.imdbRating),
        votes: parseInt(formData.imdbVotes)
      }
    };
    try {
      await api.post('/movies', payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar filme');
    }
  };

  return (
    <div className="form-container">
      <h2>Adicionar Novo Filme</h2>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit} className="movie-form">
        <label>Título:</label>
        <input name="title" value={formData.title} onChange={handleChange} required />

        <label>Ano:</label>
        <input name="year" type="number" value={formData.year} onChange={handleChange} required />

        <label>Poster (URL):</label>
        <input name="poster" value={formData.poster} onChange={handleChange} />

        <label>Gêneros (vírgula separados):</label>
        <input name="genres" value={formData.genres} onChange={handleChange} />

        <label>IMDb Rating:</label>
        <input name="imdbRating" type="number" step="0.1" value={formData.imdbRating} onChange={handleChange} />

        <label>IMDb Votes:</label>
        <input name="imdbVotes" type="number" value={formData.imdbVotes} onChange={handleChange} />

        <button type="submit">Salvar Filme</button>
      </form>
    </div>
  );
};

export default MovieForm;
