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

const createClient = async (req, res) => {
  try {
    const { 
            name, 
            rut, 
            salary,
            savings,
            credit_history_score,
            purchaseMotivation,
            propertyType,
            preferredLocation,
            propertySize,
            urgencyLevel,
            purchaseType,
            messages = [], 
            debts = [] 
            } = req.body;

    // El nuevo cliente es creado, con los parametros obtenidos del body de la URL
    const client = await Client.create({ 
        name, 
        rut,
        salary,
        savings,
        credit_history_score,
        purchaseMotivation,
        propertyType,
        preferredLocation,
        propertySize,
        urgencyLevel,
        purchaseType,
        });

    // Se crean todos los mensajes asociados al cliente, utilizando una sola consulta por medio de bulkCreate
    if (messages.length > 0) {
      const messagesWithClientId = messages.map(message => ({
        ...message,
        clientId: client.id,
      }));
      await Message.bulkCreate(messagesWithClientId);
    }

    // Se crean todas las deudas asociadas al cliente, utilizando una sola consulta por medio de bulkCreate
    if (debts.length > 0) {
      const debtsWithClientId = debts.map(debt => ({
        ...debt,
        clientId: client.id,
      }));
      await Debt.bulkCreate(debtsWithClientId);
    }

    // Se retorna el cliente recien creado con sus mensajes y deudas asociadas
    const clientWithRelations = await Client.findByPk(client.id, {
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

    res.status(201).json(clientWithRelations);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente', error: error.message });
  }
};

module.exports = { getClients, getClientById, createClient };