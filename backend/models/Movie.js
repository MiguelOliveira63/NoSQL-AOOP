const mongoose = require('mongoose');

// Subdocumentos
const imdbSchema = new mongoose.Schema({
  rating: { type: Number },
  votes: { type: Number },
  id: { type: String }
});

const awardsSchema = new mongoose.Schema({
  wins: { type: Number },
  nominations: { type: Number },
  text: { type: String }
});

const tomatoesSchema = new mongoose.Schema({
  viewer: {
    rating: { type: Number },
    numReviews: { type: Number },
    meter: { type: Number }
  },
  critic: {
    rating: { type: Number },
    numReviews: { type: Number },
    meter: { type: Number }
  },
  lastUpdated: { type: Date }
});

// Schema principal
const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  plot: { type: String },
  fullplot: { type: String },
  runtime: { type: Number },
  cast: { type: [String] },
  directors: { type: [String] },
  writers: { type: [String] },
  genres: { type: [String] },
  poster: { type: String },
  languages: { type: [String] },
  released: { type: Date },
  countries: { type: [String] },
  type: { type: String },
  num_mflix_comments: { type: Number },
  imdb: imdbSchema,
  awards: awardsSchema,
  tomatoes: tomatoesSchema,
  lastupdated: { type: String } // mantém como string para compatibilidade com MongoDB antigo
}, { collection: 'movies' });

module.exports = mongoose.model('Movie', MovieSchema);
