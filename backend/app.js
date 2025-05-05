const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Conexão ao MongoDB
const mongoUri = process.env.MONGO_URI;
console.log("MONGO_URI:", mongoUri);
mongoose.connect(mongoUri)
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
const filmesRouter = require('./routes/movies');
app.use(filmesRouter);

// Start do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr em http:localhost:${PORT}`);
});