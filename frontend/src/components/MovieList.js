import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './MovieList.css';

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    api.get('/movies')
      .then(response => {
        console.log('filmes recebidos:', response.data);
        setMovies(response.data);
      })
      .catch(err => {
        console.error('erro API completo:', err.response && err.response.data);
        console.error(err);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="title"> Lista de Filmes</h1>
      <div className="movie-grid">
        {movies.map(movie => (
          <Link key={movie._id} to={`/movies/${movie._id}`} className="movie-card">
            <img src={movie.poster} alt={movie.title} className="movie-poster" />
            <p className="movie-title">{movie.title} ({movie.year})</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
