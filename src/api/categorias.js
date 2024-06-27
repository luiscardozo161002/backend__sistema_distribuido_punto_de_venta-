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
        const [rows, fields] = await conexion.execute('SELECT * FROM categorias c WHERE estado = 1 ORDER BY c.id_categoria DESC;');
        const obj = {};
        if (rows.length > 0) {
            obj.listaCategorias = rows;
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
    const { nombre_categoria } = req.body;
    try {
        const [result] = await conexion.execute('CALL InsertarCategoria(?);', [ nombre_categoria]);
        res.json(`Se insertó correctamente el producto con ID: ${result.insertId}`);
    } catch (error) {
        console.error("Error en la inserción:", error.message);
        res.status(500).send('Error en el servidor');
    }
});

router.put('/', async (req, res) => {
    const { id_categoria } = req.headers;
    const { nombre_categoria } = req.body;
    try {
        const [result] = await conexion.execute('CALL ActualizarCategoria(?,?);', [nombre_categoria, id_categoria]);
        res.json(`Se actualizó correctamente la categoria`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

router.delete('/', async (req, res) => {
    const { id_categoria } = req.headers;
    try {
        const [result] = await conexion.execute('CALL EliminarCategoriaPorEstado(?);;', [id_categoria]);
        res.json(`Se eliminó correctamente la categoria`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

export default router;
     