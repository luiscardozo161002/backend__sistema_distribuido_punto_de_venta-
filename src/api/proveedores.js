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
        const [rows, fields] = await conexion.execute('SELECT * FROM proveedores p WHERE p.estado = 1 ORDER BY P.id_proveedor DESC;');
        const obj = {};
        if (rows.length > 0) {
            obj.listaProveedores = rows;
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
    const { nombre_proveedor, telefono_proveedor, direccion_proveedor } = req.body;
    try {
        const [result] = await conexion.execute('CALL InsertarProveedores(?, ?, ?);', [ nombre_proveedor, telefono_proveedor, direccion_proveedor]);
        res.json(`Se insertó correctamente el proveedor con ID: ${result.insertId}`);
    } catch (error) {
        console.error("Error en la inserción:", error.message);
        res.status(500).send('Error en el servidor');
    }
});

router.put('/', async (req, res) => {
    const { id_proveedor } = req.headers;
    const { nombre_proveedor, telefono_proveedor, direccion_proveedor } = req.body;
    try {
        const [result] = await conexion.execute('CALL ActualizarProveedor(?, ?, ?, ?);', [id_proveedor, nombre_proveedor, telefono_proveedor, direccion_proveedor]);
        res.json(`Se actualizó correctamente el proveedor`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

router.delete('/', async (req, res) => {
    const { id_proveedor } = req.headers;
    try {
        const [result] = await conexion.execute('CALL EliminarProveedorPorEstado(?);;', [id_proveedor]);
        res.json(`Se eliminó correctamente el proveedor`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});


export default router;