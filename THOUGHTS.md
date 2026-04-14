### 1.Cómo resolviste la tarea,
Primero empece leyendo detalladamente las instrucciones de la tarea, luego tuve que escoger las tecnologias a utilizar, las cuales fueron Node.js junto con Express ya que son herramientas que trabajan bien en conjunto y he trabajado anteriormente con ellas, Luego investigue sore Inmobiliarias para entender las variables y herramientas que usa este sector para eegir posibles Clientes.

### 2.Como usaste la IA para desarrollar, ¿usaste algún framework?
Para Desarrollar, use la IA para generar codigo, en particular Claude, donde este me ayudo en la seccion de codigo mas monotona y comun que esta en cada proyecto como por ejemplo la creacion de modelos, creacion de rutas, creacion de Controllers. Para tareas mas importante como la Ruta de POST /client-to-do-follow-up/<id>, Primero tuve que investigar el sector inmobiliario (Variables, tipos de Clientes, Patrones Comunes, etc), Luego crear todo el flujo de esta ruta, crear la mayoria de Reglas de Negocio y con todo esto ya hecho pude tambien ayudarme de la IA para realizar esta feat.

### 3.Qué decisiones técnicas tomaste
Las decisiones tecnicas que tome fueron en gran parte las reglas de Negocio y los campos Extras del modelo Cliente, Decidi agregar 7 campos nuevo a este modelo, para asi que el flujo de la Ruta /client-to-do-follow-up/<id> junto con su Chatbot estuviera hecho mas cercano a la realidad.

Los campos que agregue fueron:

-credit_history_score: Puntaje del historial crediticio del cliente, esto para saber si el cliente en su pasado tenia experiencia con creditos y asi saber como habia sido su rendimiento pagando estos.

-purchaseMotivation: La motivacion de Compra, esto es importante ya que con esto puedo saber mas sobre el cliente y me permite calificarlo dentro de diferentes grupos de Clientes.

-propertyType: Tipo de Propiedad, campo muy importante ya que asi el Chatbot puede saber el tipo de vivienda que ofrecerle al cliente.

-preferredLocation: Lugar de preferencia, otro campo muy importante ya que asi el Chatbot le ofrece propiedades preferentemente de ese lugar o lugares cercanos a este.

-propertySize: Tamaño de Propiedad, esto para que asi el chatbot tambien pueda ofrecer Viviendas con tamaños adecuados a lo requerido por el cliente.

-urgencyLevel: Nivel de urgencia de Compra, campo realmente importante, ya que nos permite calificar al cliente en un posible Comprador, o en un cliente que no es provechoso hacer seguimiento.

Luego tambien Aplique las reglas de Negocio:

1. Se definio un score crediticio mínimo 700 para hacer envio de mensaje de seguimiento, esto pues, si un cliente tiene un score mas bajo que este, pierde confiabilidad de pago de arriendo o credito, que puede resultar desfavorable para la empresa

2. Se definio un nivel de urgencia minima de 3, esto pues, queremos hacer seguimiento a clientes los cuales sean posibles compradores y mientras mas alto sea su nivel de urgencia mas chance tendremos de Compra

3. Se definio que en el caso que el último mensaje del cliente fuera hace más de 3 días, no se enviara mensaje de seguimiento, esto pues, nos muestras un poco nivel de urgencia o motivacion para buscar una propiedad, lo que nos indica que probablemente haya otros clientes los cuales nos indican mayor probabilidad de compra

4. Se definio que dependiendo del presupuesto de Cliente, si este tiene que ocupar un monto del presupuesto demasiado alto para pagar el arriendo o compra de propiedad, este no deje enviar tampoco mensaje de seguimiento, esto pues el Cliente necesita un monto mensual para las necesidades basicas y sin esto, se vuelve complicado el pago del arriendo o cuotas al dia.


### 4.Qué aspectos de la tarea pondrías en discusión y buscarías aclarar en mayor detalle. Que asumiste en dichos casos.

Uno de los aspectos que pondria en discusion es que el chatbot debe tener informacion real de propiedas en venta, el problema es que no se aclara como lograr esto. En mi caso yo hice que si el chatbot no tenia una vivienda para ofrecer no inventara informacion, y solo recolectara mas informacion del cliente o intentara agendar una reunion presencial con el.

### 5.Qué aspectos y dimensiones crees que son primordiales para un agente de IA tipo chatbot en producción. Y que harías para asegurar que se cumplan. Responde desde una perspectiva ingenieril de ciencia de computación y producto.

Creo que es escencial que el chatbot no invente datos falsos de propiedas y para esto hay diferentes maneras de poder solucionarlo, una de ellas es conectanse a una API externa de Propiedades , o tambien llenando la base de datos con datos reales de propiedades para que el chatbot pueda responder.

Otro aspecto importante es que el chatbot sepa entender el contexto del cliente con el que trata y que dependiendo del tipo de cliente, el chatbot le ofrezca ofertas asociadas a las necesidades y preferencias específicas para ese tipo de perfil de cliente, para que se logre esto, el chatbot debe intentar recolectar la mayor informacion posible de datos y asi poder calificar al cliente en un grupo en particular.

Otros aspecto muy importante, es que el chatbot haga seguimiento de inmediato a los clientes que sean compradores potenciales, y para esto debemos haber hecho algun estudio de todos los datos y conversaciones con cada cliente, para poder calificarlos y poder ser eficiente a la hora de comunicarnos con dichos potenciales Clientes.

### 6.Explicación del prompt y el razonamiento utilizado.

Para realizar el promt, primero se inicializa el chatbot diciendo que este se debe comportar como un ejecutivo comercial experto en bienes raíces en Chile, Luego se le dan todos los campos necesarios del cliente en especifico, para que asi pueda entender el contexto y perfil de cliente con el que trata, Luego se le dan instrucciones de como debe comportarse en diferentes situaciones, para que este parezca como si fuera una persona real hablando, luego se le pide que busque propiedades que esten alineadas a los datos y requisitos del cliente, para asi lograr ofrecer una propiedad que sea conforme a lo requerido por el cliente, en el caso que no encuentre nada, No inventa informacion si no que intenta recolectar mas informacion de cliente o intenta agendar una reunion presencial con el.

### 7.Despliegue funcional (deploy) en un servicio como Cloud Run (Google Cloud) o similar.
No alcance a realizar el despliegue funcional.