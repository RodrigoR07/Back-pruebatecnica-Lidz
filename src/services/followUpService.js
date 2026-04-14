const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Reglas de negocio ────────────────────────────────────────────────────────

const shouldSendFollowUp = (client, totalDebts) => {
  // Regla 1: score crediticio mínimo 700
  if (client.credit_history_score < 700) {
    return { send: false, reason: 'Score crediticio insuficiente' };
  }

  // Regla 2: urgencia mínima 3
  if (client.urgencyLevel < 3) {
    return { send: false, reason: 'Nivel de urgencia muy bajo' };
  }

  // Regla 3: no enviar si el último mensaje del cliente fue hace más de 3 días
  const messages = client.Messages || [];
  const lastClientMessage = messages
  .filter(m => m.role === 'client')
  .sort((a, b) => {
    const fechaMensajeA = new Date(a.sentAt);
    const fechaMensajeB = new Date(b.sentAt);

    if (fechaMensajeB > fechaMensajeA) return 1;  // B es más reciente, va primero
    if (fechaMensajeB < fechaMensajeA) return -1; // A es más reciente, va primero
    return 0;                                     // Son iguales, no se mueven
  })[0];

  if (lastClientMessage) {
    const daysSinceLastMessage =
      (Date.now() - new Date(lastClientMessage.sentAt)) / (1000 * 60 * 60 * 24);
    if (daysSinceLastMessage > 3) {
      return { send: false, reason: 'El cliente lleva más de 3 días sin escribir, no se ve un interes real en comprar' };
    }
  }

  // Regla 4: calcular presupuesto disponible
  const budget = calculateBudget(client, totalDebts);
  if (!budget.send) {
    return budget;
  }

  return { send: true };
};

// ─── Cálculo de presupuesto ───────────────────────────────────────────────────

const calculateBudget = (client, totalDebts) => {
  const salary = client.salary;
  const savings = client.savings;
  const BASIC_LIVING_COST = 300000;

  // Ahorro liquido, quitanto las deudas
  const liquid_savings = savings - totalDebts
  if (liquid_savings < 0){
    if ((salary + liquid_savings)<300000)
        return {send:false, reason: 'El presupuesto no alcanza para poder cubrir las necesidades basicas'}
  }

  // Presupuesto total: Ahorro liquido + salary - BASIC_LIVING_COST
  const totalBudget = liquid_savings + salary - BASIC_LIVING_COST;

  return {send:true, presupuesto:totalBudget}
};

// ─── Generación del mensaje con IA ───────────────────────────────────────────

const generateFollowUpMessage = async (client, budget) => {
  const lastMessages = (client.Messages || [])
    .slice(-5) // últimos 5 mensajes para contexto
    .map(m => `${m.role === 'client' ? 'Cliente' : 'Agente'}: ${m.text}`)
    .join('\n');

  const prompt = `
Eres un ejecutivo comercial experto en bienes raíces en Chile. Tu nombre es Sofía.
Tu objetivo es generar oportunidades reales de negocio guiando al cliente hacia una acción concreta.

PERFIL DEL CLIENTE:
- Nombre: ${client.name}
- Motivación de compra: ${client.purchaseMotivation || 'No especificada'}
- Tipo de propiedad buscada: ${client.propertyType || 'No especificado'}
- Comuna de preferencia: ${client.preferredLocation || 'No especificada'}
- Tamaño deseado: ${client.propertySize ? `${client.propertySize} m2` : 'No especificado'}
- Tipo de compra: ${client.purchaseType || 'No especificado'}
- Nivel de urgencia: ${client.urgencyLevel}/5
- Presupuesto disponible estimado: $${budget.toLocaleString('es-CL')} CLP

HISTORIAL RECIENTE DE CONVERSACIÓN (ordenado del más antiguo al más reciente):
${lastMessages || 'Sin mensajes previos'}

INSTRUCCIONES:
0. Lee CUIDADOSAMENTE el historial de conversación antes de responder.
1. Identifica en qué etapa del proceso está el cliente:
   - Si ya agendó una visita o reunión, NO vuelvas a sugerirlo. Confirma o da seguimiento a esa reunión.
   - Si está pidiendo información, entrégala directamente sin redirigir a agendar.
   - Si está indeciso, guíalo hacia una acción concreta.
2. Redacta un mensaje de seguimiento breve, cálido y profesional en español.
3. Busca propiedades REALES que se ajusten al presupuesto del cliente considerando su tipo de compra.
   El dinero que sobre cada mes debe alcanzar para cubrir al menos $300.000 de gastos básicos mensuales.
4. Sugiere propiedades que coincidan con el tipo (${client.propertyType}), 
   ubicación (${client.preferredLocation}) y tamaño (${client.propertySize} m2) buscados.
5. Si no tienes información de propiedades exactas que cumplan los criterios, 
   EVITA INVENTAR INFORMACION. En su lugar invita al cliente a agendar una visita o solicitar más información (En caso de que no lo hayas hecho antes).
6. Guía al cliente hacia UNA acción concreta: agendar visita, dejar datos o solicitar información.
7. El mensaje debe sonar humano, cercano y NO como spam.
8. Máximo 5 oraciones.

Responde ÚNICAMENTE con el texto del mensaje, sin saludos adicionales ni explicaciones.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
};

module.exports = { shouldSendFollowUp, calculateBudget, generateFollowUpMessage };