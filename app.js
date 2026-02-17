const express = require('express');
const app = express();

app.use(express.json());

app.use('/level1', require('./routes/level1'));
app.use('/level2', require('./routes/level2'));
// app.use('/level3', require('./routes/level3'));
// app.use('/level4', require('./routes/level4'));

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
