import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secret } from './config.js'; 
import { conexion } from './db.js'; 

const router = express.Router();


router.post('/login', async (req, res) => {
  const { nombre, clave } = req.body;

  if (!nombre || !clave) {
    return res.status(400).json({ msg: 'Por favor ingrese todos los campos' });
  }

  try {
    const [rows] = await conexion.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
    if (rows.length === 0) return res.status(400).json({ msg: 'Usuario no existe' });

    const usuario = rows[0];
    const isMatch = await bcrypt.compare(clave, usuario.clave);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre },
      secret,
      { expiresIn: '5h' }
    );
    if (!token) return res.status(400).json({ msg: 'Token inválido' });

    res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
      },
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


router.post('/registro', async (req, res) => {
  const { nombre, clave } = req.body;

  if (!nombre || !clave) {
    return res.status(400).json({ msg: 'Por favor ingrese todos los campos' });
  }

  try {
    const [rows] = await conexion.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
    if (rows.length > 0) return res.status(400).json({ msg: 'Usuario ya existe' });

    const salt = await bcrypt.genSalt(10);
    if (!salt) return res.status(400).json({ msg: 'Error bcrypt salt' });

    const hash = await bcrypt.hash(clave, salt);
    if (!hash) return res.status(400).json({ msg: 'Error bcrypt hash' });

    await conexion.query('INSERT INTO usuarios (nombre, clave) VALUES (?, ?)', [nombre, hash]);

    const token = jwt.sign(
      { nombre },
      secret,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      usuario: {
        nombre,
      },
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


router.post('/logout', (req, res) => {
  res.status(200).json({ mensaje: 'Cierre de sesión exitoso' });
});

export default router;
