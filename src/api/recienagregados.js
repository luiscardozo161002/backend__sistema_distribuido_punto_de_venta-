import express from 'express';
import { conexion } from '../db.js';

const router = express.Router();

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const [rows] = await conexion.execute('CALL ObtenerProductosRecienAgregados();');
        const obj = {};
        if (rows.length > 0) {
            obj.listaProductosRecientes = rows;
            res.json(obj);
        } else {
            res.json({ message: 'No hay registros' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

export default router;