const Client = require('../models/Client');
const Message = require('../models/Message');
const Debt = require('../models/Debt');
const {
  shouldSendFollowUp,
  calculateBudget,
  generateFollowUpMessage,
} = require('../services/followUpService');

const clientFollowUp = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Obtener cliente con mensajes y deudas
    const client = await Client.findByPk(id, {
      include: [
        { model: Message, attributes: ['id', 'text', 'sentAt', 'role'] },
        { model: Debt, attributes: ['id', 'amount', 'institution', 'dueDate'] },
      ],
    });

    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // 2. Calcular deuda total
    const totalDebts = (client.Debts || []).reduce((sum, d) => sum + d.amount, 0);

    // 3. Aplicar reglas de negocio
    const followUpResult  = shouldSendFollowUp(client, totalDebts);
    if (!followUpResult.send) {
      console.log(`Follow-up no enviado para cliente ${id}: ${followUpResult.reason}`);
      return res.status(200).json({});
    }

    // 4. Calcular presupuesto
    const response_budget = calculateBudget(client, totalDebts);
    const budget = response_budget.presupuesto

    // 5. Generar mensaje con IA
    const messageText = await generateFollowUpMessage(client, budget);

    // 6. Guardar el mensaje en la base de datos
    const newMessage = await Message.create({
      text: messageText,
      role: 'agent',
      sentAt: new Date(),
      clientId: client.id,
    });

    // 7. Devolver el mensaje creado
    res.status(201).json({
      id: newMessage.id,
      text: newMessage.text,
      sentAt: newMessage.sentAt,
      role: newMessage.role,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al generar follow-up', error: error.message });
  }
};

module.exports = { clientFollowUp };