const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  poster: String
}, { collection: 'movies' }); // importante: nome real da collection

module.exports = mongoose.model('Movie', MovieSchema);