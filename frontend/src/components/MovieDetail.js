import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    console.log('Buscando o filme com ID:', id);

    api.get(`/movies/${id}`)
      .then(response => {
        console.log('Resposta da API:', response.data);
        setMovie(response.data);
      })
      .catch(err => {
        console.error('Erro ao carregar filme:', err);
        setMovie(null);
      });
  }, [id]);

  if (!movie) return <p className="loading">Carregando...</p>;

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">← Voltar</Link>
      <div className="movie-detail">
        {/* Verifique se 'poster' existe antes de renderizar a imagem */}
        <img 
          src={movie.poster || '/default-poster.jpg'} 
          alt={movie.title || 'Poster do filme'} 
          className="detail-poster" 
        />
        <div className="detail-info">
          <h1>{movie.title}</h1>
          <p><strong>Ano:</strong> {movie.year}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
