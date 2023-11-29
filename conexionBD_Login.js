const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Conexión a la base de datos de XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'almacen'
});

db.connect((err) => {
    if(err) throw err;
    console.log('Conectado a la base de datos');
});



// Endpoint para agregar un nuevo producto y obtener todos los productos
app.post('/agregarProducto', (req, res) => {
    const { nombreProducto, min, max } = req.body;

    // Insertar datos en la tabla 'almacen'
    const sql = 'INSERT INTO almacen (nombreProducto, min, max, Stock) VALUES (?, ?, ?, 0)';
    db.query(sql, [nombreProducto, min, max], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al agregar el producto' });
        } else {
            // Después de agregar el producto, obtener todos los productos
            const sqlObtenerProductos = 'SELECT * FROM almacen';
            db.query(sqlObtenerProductos, (err, productos) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Error al obtener los productos' });
                } else {
                    res.status(200).json({ message: 'Producto agregado exitosamente', productos });
                }
            });
        }
    });
});

// Endpoint para obtener todos los productos
app.get('/obtenerProductos', (req, res) => {
    // Consulta SQL para obtener los datos de la tabla 'almacen'
    const sql = 'SELECT * FROM almacen';
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener los productos' });
        } else {
            res.status(200).json(result);
        }
    });
});

// No olvides configurar el middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
