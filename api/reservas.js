import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const reservasFilePath = path.join(process.cwd(), 'reservas.json');

  if (req.method === 'GET') {
    const data = fs.readFileSync(reservasFilePath, 'utf8');
    res.status(200).json(JSON.parse(data));
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
