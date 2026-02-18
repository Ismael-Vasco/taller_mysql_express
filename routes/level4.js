const express = require('express');
const router = express.Router();
const pool = require('../db');


// 31 Usuarios cuyo gasto total es superior al promedio general ******************SOLUCIONAR
// router.get('/ejercicio-31', async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//             SELECT u.name, total_gastado
//             FROM (
//                 SELECT u.id, u.name,
//                        SUM(op.quantity * op.price_at_purchase) AS total_gastado
//                 FROM users u
//                 JOIN orders o ON o.user_id = u.id
//                 JOIN order_product op ON op.order_id = o.id
//                 GROUP BY u.id
//             ) AS sub
//             WHERE total_gastado > (
//                 SELECT AVG(total_cliente)
//                 FROM (
//                     SELECT SUM(op.quantity * op.price_at_purchase) AS total_cliente
//                     FROM orders o
//                     JOIN order_product op ON op.order_id = o.id
//                     GROUP BY o.user_id
//                 ) AS promedio
//             )
//         `);

//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });



// 32 Productos Estrella (>2% del total de ingresos) ******************SOLUCIONAR

// router.get('/ejercicio-32', async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//             SELECT p.name,
//                    SUM(op.quantity * op.price_at_purchase) AS ingresos_producto,
//                    ROUND(
//                        (SUM(op.quantity * op.price_at_purchase) /
//                        (SELECT SUM(quantity * price_at_purchase) FROM order_product)) * 100, 2
//                    ) AS porcentaje
//             FROM products p
//             JOIN order_product op ON op.product_id = p.id
//             GROUP BY p.id
//             HAVING porcentaje > 2
//             ORDER BY porcentaje DESC
//         `);

//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });



// 33 Churn Rate (usuarios sin compras en últimos 6 meses) ******************SOLUCIONAR
router.get('/ejercicio-33', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT u.name, MAX(o.order_date) AS ultima_compra
            FROM users u
            JOIN orders o ON o.user_id = u.id
            GROUP BY u.id
            HAVING MAX(o.order_date) < DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 34 Clasificación de clientes
router.get('/ejercicio-34', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT u.name,
                   SUM(op.quantity * op.price_at_purchase) AS total_gastado,
                   CASE
                       WHEN SUM(op.quantity * op.price_at_purchase) > 5000 THEN 'VIP'
                       WHEN SUM(op.quantity * op.price_at_purchase) BETWEEN 1000 AND 5000 THEN 'Frecuente'
                       ELSE 'Regular'
                   END AS categoria_cliente
            FROM users u
            JOIN orders o ON o.user_id = u.id
            JOIN order_product op ON op.order_id = o.id
            GROUP BY u.id
            ORDER BY total_gastado DESC
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 35 Mes y año con mayor facturación histórica
router.get('/ejercicio-35', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                YEAR(o.order_date) AS año,
                MONTH(o.order_date) AS mes,
                SUM(op.quantity * op.price_at_purchase) AS facturacion
            FROM orders o
            JOIN order_product op ON op.order_id = o.id
            GROUP BY año, mes
            ORDER BY facturacion DESC
            LIMIT 1
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 36 Órdenes pendientes con productos stock < 5 (Asume campo products.stock)
router.get('/ejercicio-36', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT o.order_number, p.name, p.stock
            FROM orders o
            JOIN order_product op ON op.order_id = o.id
            JOIN products p ON p.id = op.product_id
            WHERE o.status = 'pending'
            AND p.stock < 5
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 37 % de ventas que representa cada categoría
router.get('/ejercicio-37', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT c.name,
                   ROUND(
                       (SUM(op.quantity * op.price_at_purchase) /
                       (SELECT SUM(quantity * price_at_purchase) FROM order_product)) * 100, 2
                   ) AS porcentaje
            FROM categories c
            JOIN products p ON p.category_id = c.id
            JOIN order_product op ON op.product_id = p.id
            GROUP BY c.id
            ORDER BY porcentaje DESC
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 38 Comparar ventas de cada ciudad vs promedio general
router.get('/ejercicio-38', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT u.city,
                   SUM(op.quantity * op.price_at_purchase) AS total_ciudad,
                   (
                       SELECT AVG(total_ciudad)
                       FROM (
                           SELECT SUM(op2.quantity * op2.price_at_purchase) AS total_ciudad
                           FROM users u2
                           JOIN orders o2 ON o2.user_id = u2.id
                           JOIN order_product op2 ON op2.order_id = o2.id
                           GROUP BY u2.city
                       ) AS promedio
                   ) AS promedio_general
            FROM users u
            JOIN orders o ON o.user_id = u.id
            JOIN order_product op ON op.order_id = o.id
            GROUP BY u.city
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 39 Tasa de cancelación por mes
router.get('/ejercicio-39', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                YEAR(order_date) AS año,
                MONTH(order_date) AS mes,
                ROUND(
                    (SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) 
                    / COUNT(*)) * 100, 2
                ) AS tasa_cancelacion
            FROM orders
            GROUP BY año, mes
            ORDER BY año, mes
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 40 Análisis de Canasta Productos que se venden juntos con mayor frecuencia
router.get('/ejercicio-40', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p1.name AS producto_1,
                p2.name AS producto_2,
                COUNT(*) AS veces_juntos
            FROM order_product op1
            JOIN order_product op2 
                ON op1.order_id = op2.order_id
                AND op1.product_id < op2.product_id
            JOIN products p1 ON p1.id = op1.product_id
            JOIN products p2 ON p2.id = op2.product_id
            GROUP BY producto_1, producto_2
            ORDER BY veces_juntos DESC
            LIMIT 10
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
