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
        const [rows, fields] = await conexion.execute('SELECT * FROM marcas c WHERE estado = 1 ORDER BY c.id_marca DESC;');
        const obj = {};
        if (rows.length > 0) {
            obj.listaMarcas = rows;
            res.json(obj);
        } else {
            res.json({ message: 'No hay registros' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.post('/', async (req, res) => {
    const { nombre_marca } = req.body;
    try {
        const [result] = await conexion.execute('CALL InsertarMarca(?);', [ nombre_marca]);
        res.json(`Se insertó correctamente la marca con ID: ${result.insertId}`);
    } catch (error) {
        console.error("Error en la inserción:", error.message);
        res.status(500).send('Error en el servidor');
    }
});

router.put('/', async (req, res) => {
    const { id_marca } = req.headers;
    const { nombre_marca } = req.body;
    try {
        const [result] = await conexion.execute('CALL ActualizarMarca(?,?);', [nombre_marca, id_marca]);
        res.json(`Se actualizó correctamente la marca`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

router.delete('/', async (req, res) => {
    const { id_marca } = req.headers;
    try {
        const [result] = await conexion.execute('CALL EliminarMarcaPorEstado(?);;', [id_marca]);
        res.json(`Se eliminó correctamente la marca`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});


export default router;