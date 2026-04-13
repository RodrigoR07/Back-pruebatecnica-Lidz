const Client = require('../models/Client');

const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error });
  }
};

module.exports = { getClients };