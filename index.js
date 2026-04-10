require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/database');

require('./src/models/Client');
require('./src/models/Message');
require('./src/models/Debt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a MySQL');
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('✅ Tablas sincronizadas'))
  .catch(err => console.error('❌ Error:', err));

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});