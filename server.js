const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const reservasFilePath = path.join(__dirname, 'reservas.json');

app.use(express.static(__dirname)); // Sirve los archivos estáticos
app.use(bodyParser.json());

app.get('/api/reservas', (req, res) => {
  const data = fs.readFileSync(reservasFilePath, 'utf8');
  res.json(JSON.parse(data));
});

app.post('/api/reservas', (req, res) => {
  const nuevaReserva = req.body;
  let reservas = JSON.parse(fs.readFileSync(reservasFilePath, 'utf8'));
  reservas.push(nuevaReserva);
  fs.writeFileSync(reservasFilePath, JSON.stringify(reservas, null, 2), 'utf8');
  res.sendStatus(201);
});

app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000');
});
