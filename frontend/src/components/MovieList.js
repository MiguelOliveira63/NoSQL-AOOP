import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './MovieList.css';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' ou 'desc'

  useEffect(() => {
    api.get('/movies', {
      params: { searchTerm, year: selectedYear, genre: selectedGenre, sortOrder }
    })
    .then(response => setMovies(response.data))
    .catch(err => console.error(err));
  }, [searchTerm, selectedYear, selectedGenre, sortOrder]);

  // Filtragem por título, ano e gênero
  const filteredMovies = movies.filter(movie => {
    const matchesTitle = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear ? movie.year === parseInt(selectedYear) : true;
    const matchesGenre = selectedGenre ? movie.genres?.includes(selectedGenre) : true;
    return matchesTitle && matchesYear && matchesGenre;
  });

  // Ordenação por rating IMDb
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    const ratingA = typeof a.imdb?.rating === 'number' ? a.imdb.rating : 0;
    const ratingB = typeof b.imdb?.rating === 'number' ? b.imdb.rating : 0;
    return sortOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA;
  });

  const years = [...new Set(movies.map(m => m.year))].sort((a, b) => b - a);
  const genres = [...new Set(movies.flatMap(m => m.genres || []))];


  return (
    <div className="container">
      <h1 className="title">Lista de Filmes</h1>

      <div className="list-header">
        <Link to="/movies/new" className="add-button">+ Adicionar Filme</Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Pesquisar por título..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="year-selector"
        >
          <option value="">Selecione um ano</option>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>

        <select
          value={selectedGenre}
          onChange={e => setSelectedGenre(e.target.value)}
          className="genre-selector"
        >
          <option value="">Selecione um gênero</option>
          {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
        </select>

        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="sort-selector"
        >
          <option value="desc">Rating Decrescente</option>
          <option value="asc">Rating Crescente</option>
        </select>
      </div>

      <div className="movie-grid">
        {sortedMovies.map(movie => (
          <Link key={movie._id} to={`/movies/${movie._id}`} className="movie-card">
            <img src={movie.poster} alt={movie.title} className="movie-poster" />
            <p className="movie-title">{movie.title} ({movie.year})</p>
            {typeof movie.imdb?.rating === 'number' && (
              <p className="movie-rating">IMDb: {movie.imdb.rating}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
