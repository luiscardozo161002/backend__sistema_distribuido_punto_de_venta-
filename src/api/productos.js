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
        const [rows, fields] = await conexion.execute('CALL ObtenerProductosActivos();');
        const obj = {};
        if (rows.length > 0) {
            obj.listaProductos = rows;
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
    const { descripcion, nombre_categoria, nombre_marca, nombre_proveedor, precio_compra, precio_venta, numero_serie, existencia } = req.body;
    try {
        const [result] = await conexion.execute('CALL InsertarProducto(?, ?, ?, ?, ?, ?, ?, ?);', [descripcion, nombre_categoria, nombre_marca, nombre_proveedor, precio_compra, precio_venta, numero_serie, existencia]);
        res.json(`Se insertó correctamente el producto con ID: ${result.insertId}`);
    } catch (error) {
        console.error("Error en la inserción:", error.message);
        res.status(500).send('Error en el servidor');
    }
});


router.put('/', async (req, res) => {
    const { id_producto } = req.headers;
    const { descripcion, nombre_categoria, nombre_marca, nombre_proveedor, precio_compra, precio_venta, numero_serie, existencia } = req.body;
    try {
        const [result] = await conexion.execute('CALL ActualizarProducto(?, ?, ?, ?, ?, ?, ?, ?, ?);', [id_producto, descripcion, nombre_categoria, nombre_marca, nombre_proveedor, precio_compra, precio_venta, numero_serie, existencia]);
        res.json(`Se actualizó correctamente el producto`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

router.delete('/', async (req, res) => {
    const { id_producto } = req.headers;
    try {
        const [result] = await conexion.execute('UPDATE productos SET estado=0 WHERE id_producto=?;', [id_producto]);
        res.json(`Se eliminó correctamente el producto`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});


export default router;