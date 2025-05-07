import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMovie, setUpdatedMovie] = useState({});

  // Fetch movie details
  useEffect(() => {
    api.get(`/movies/${id}`)
      .then(response => setMovie(response.data))
      .catch(() => setError('Não foi possível carregar os detalhes do filme.'));
  }, [id]);

  // Handle edit field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMovie({
      ...updatedMovie,
      [name]: value,
    });
  };

  // Handle movie update
  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/movies/${id}`, updatedMovie);
      setMovie(response.data);
      setIsEditing(false); // Close editing mode
    } catch (err) {
      setError('Erro ao atualizar o filme');
    }
  };

  // Handle movie deletion
  const handleDeleteMovie = async () => {
    const confirmDelete = window.confirm("Tem certeza de que deseja excluir este filme?");
    if (confirmDelete) {
      try {
        await api.delete(`/movies/${id}`);
        navigate('/'); // Redirect to the home page after deletion
      } catch (err) {
        setError('Erro ao excluir o filme');
      }
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p className="loading">Carregando...</p>;

  const { title, year, poster, genres, imdb, plot, fullplot, runtime, num_mflix_comments, languages, released, directors, writers, awards, lastupdated, countries, type, tomatoes } = movie;

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
          {isEditing ? (
            <form onSubmit={handleUpdateMovie}>
              <label>Título</label>
              <input
                type="text"
                name="title"
                value={updatedMovie.title || title}
                onChange={handleInputChange}
              />

              <label>Ano</label>
              <input
                type="number"
                name="year"
                value={updatedMovie.year || year}
                onChange={handleInputChange}
              />

              <label>Gêneros</label>
              <input
                type="text"
                name="genres"
                value={updatedMovie.genres?.join(', ') || ''}
                onChange={handleInputChange}
              />

              <button type="submit">Salvar alterações</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
            </form>
          ) : (
            <>
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

              <div className="actions">
                <button onClick={() => setIsEditing(true)}>Editar</button>
                <button onClick={handleDeleteMovie}>Excluir</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
