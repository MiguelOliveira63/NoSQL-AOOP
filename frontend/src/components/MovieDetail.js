import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './MovieDetail.css';

function formatDate(dateString) {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateString;
  }
}

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/movies/${id}`)
      .then(response => setMovie(response.data))
      .catch(() => setError('Não foi possível carregar os detalhes do filme.'));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p className="loading">Carregando...</p>;

  const { title, year, poster, genres, imdb, plot, fullplot, runtime, num_mflix_comments, languages, released, directors, writers, awards, lastupdated, countries, type, tomatoes
  } = movie;

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">← Voltar</Link>
      <div className="movie-detail">
        <img
          src={poster || '/default-poster.jpg'}
          alt={title}
          className="detail-poster"
        />
        <div className="detail-info">
          <h1>{title} ({year})</h1>
          {type && <p><strong>Tipo:</strong> {type}</p>}
          {released && <p><strong>Lançamento:</strong> {formatDate(released)}</p>}
          {runtime != null && <p><strong>Duração:</strong> {runtime} min</p>}
          {genres?.length > 0 && <p><strong>Gêneros:</strong> {genres.join(', ')}</p>}
          {countries?.length > 0 && <p><strong>Países:</strong> {countries.join(', ')}</p>}
          {languages?.length > 0 && <p><strong>Idiomas:</strong> {languages.join(', ')}</p>}
          {directors?.length > 0 && <p><strong>Direção:</strong> {directors.join(', ')}</p>}
          {writers?.length > 0 && <p><strong>Roteiro:</strong> {writers.join(', ')}</p>}
          {typeof num_mflix_comments === 'number' && <p><strong>Comentários:</strong> {num_mflix_comments}</p>}
          {imdb?.rating != null && (
            <p><strong>IMDb:</strong> {imdb.rating} / 10 ({imdb.votes} votos)</p>
          )}
          {awards && (
            <p><strong>Prêmios:</strong> {awards.text || JSON.stringify(awards)}</p>
          )}
          {plot && (
            <div className="synopsis">
              <h2>Sinopse</h2>
              <p>{plot}</p>
            </div>
          )}
          {fullplot && (
            <div className="synopsis">
              <h2>Full Plot</h2>
              <p>{fullplot}</p>
            </div>
          )}
          {tomatoes && (
            <div className="tomatoes">
              <h2>Tomatoes</h2>
              {tomatoes.viewer && <p><strong>Viewer:</strong> {tomatoes.viewer.rating} ({tomatoes.viewer.numReviews} reviews)</p>}
              {tomatoes.critic && <p><strong>Critic:</strong> {tomatoes.critic.rating} ({tomatoes.critic.numReviews} reviews)</p>}
              {tomatoes.meter != null && <p><strong>Meter:</strong> {tomatoes.meter}%</p>}
            </div>
          )}
          {lastupdated && <p className="updated"><em>Atualizado em: {lastupdated}</em></p>}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
