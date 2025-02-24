import db from '../firebase-config';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const nuevaReserva = req.body;
    await db.collection('reservas').add(nuevaReserva);
    res.status(201).json({ message: 'Reserva realizada con éxito' });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
