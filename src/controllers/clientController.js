const Client = require('../models/Client');
const Message = require('../models/Message');
const Debt = require('../models/Debt');

const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error });
  }
};

const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id, {
      include: [
        {
            model: Message,
            attributes: ['id', 'text', 'sentAt', 'role'],
         },
        {
            model: Debt,
            attributes: ['id', 'amount', 'institution', 'dueDate'],
         },
      ],
    });

    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error });
  }
};

module.exports = { getClients, getClientById };