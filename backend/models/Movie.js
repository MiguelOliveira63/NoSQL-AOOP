const mongoose = require('mongoose');

// Definição do subdocumento imdb
const imdbSchema = new mongoose.Schema({
  rating: { type: Number, required: true },  // Rating como número
  votes: { type: Number },                   // Exemplo de outro campo que pode existir
  id: { type: String }
});

// Definição do Schema principal para o filme
const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  poster: { type: String },
  genres: { type: [String] },  // Definindo 'genres' como um array de strings
  imdb: imdbSchema            // Referência ao subdocumento imdb
}, { collection: 'movies' });  // Nome real da collection

module.exports = mongoose.model('Movie', MovieSchema);