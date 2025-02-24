import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const reservasFilePath = path.join(process.cwd(), 'reservas.json');

  if (req.method === 'POST') {
    const nuevaReserva = req.body;
    let reservas = JSON.parse(fs.readFileSync(reservasFilePath, 'utf8'));
    reservas.push(nuevaReserva);
    fs.writeFileSync(reservasFilePath, JSON.stringify(reservas, null, 2), 'utf8');
    res.status(201).json({ message: 'Reserva realizada con éxito' });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
