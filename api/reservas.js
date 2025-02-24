import db from '../firebase-config';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const snapshot = await db.collection('reservas').get();
      const reservas = snapshot.docs.map(doc => doc.data()) || [];
      res.status(200).json(reservas);
    } else {
      res.status(405).json({ message: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en /api/reservas:', error);
    res.status(500).json({ message: 'Error al obtener reservas', error: error.message });
  }
}
