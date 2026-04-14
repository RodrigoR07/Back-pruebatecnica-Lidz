# 🏠 Backend Inmobiliario con IA

Backend desarrollado con **Node.js + Express + Sequelize + MySQL**, que incluye generación de mensajes de seguimiento con inteligencia artificial usando la API de OpenAI. (FrotEnd y Deploy no se alcanzo a realizar)

---

## 📋 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [MySQL](https://dev.mysql.com/downloads/mysql/) (v8 o superior)
- [MySQL Workbench](https://www.mysql.com/products/workbench/) (opcional, para visualizar la base de datos)
- La API Key de OpenAI

---

## 🚀 Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/RodrigoR07/Back-pruebatecnica-Lidz.git
cd Back-pruebatecnica-Lidz
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Crea la base de datos en MySQL

Conéctate a MySQL y ejecuta:

```sql
CREATE DATABASE nombre_de_tu_base_de_datos;
```

### 4. Configura las variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`:

```bash

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nombre_de_tu_base_de_datos
DB_USER=root
DB_PASSWORD=tu_contraseña

# OpenAI
OPENAI_API_KEY=sk-...
```

### 5. Inicia el servidor

```bash
npm run dev
```

Si todo está bien configurado, deberías ver:

```
Servidor corriendo en http://localhost:3000
✅ Conectado a MySQL
✅ Tablas sincronizadas
```

> Las tablas se crean automáticamente al iniciar el servidor, no necesitas crearlas manualmente.

---

## 📁 Estructura del proyecto

```
backend/
├── index.js                  # Punto de entrada, configuración del servidor
├── .env                      # Variables de entorno (no se sube a Git)
├── .env.example              # Plantilla de variables de entorno
├── package.json
└── src/
    ├── config/
    │   └── database.js       # Configuración de conexión a MySQL con Sequelize
    ├── controllers/
    │   ├── clientController.js     # Lógica de las rutas de clientes
    │   └── followUpController.js   # Lógica de la ruta de follow-up
    ├── models/
    │   ├── Client.js         # Modelo de cliente
    │   ├── Message.js        # Modelo de mensaje
    │   └── Debt.js           # Modelo de deuda
    ├── routes/
    │   ├── clientRoutes.js   # Rutas de clientes
    │   └── followUpRoutes.js # Rutas de follow-up
    └── services/
        └── followUpService.js # Lógica de negocio y generación de mensajes con IA
```

---

## 🗄️ Modelos de la base de datos

### Client
| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER | Identificador único autoincremental |
| name | STRING | Nombre del cliente |
| rut | STRING | RUT del cliente (único) |
| salary | INTEGER | Sueldo mensual en CLP |
| savings | INTEGER | Ahorros en CLP |
| score | INTEGER | Score de historial crediticio |
| purchaseMotivation | STRING | Motivación de compra (inversión, mudanza, etc.) |
| propertyType | ENUM | Tipo de propiedad (casa, departamento) |
| preferredLocation | STRING | Comuna de preferencia |
| propertySize | INTEGER | Tamaño deseado en m2 |
| urgencyLevel | INTEGER | Nivel de urgencia del 1 al 5 |
| purchaseType | ENUM | Tipo de compra (arriendo, compra_pie, compra_contado) |

### Message
| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER | Identificador único autoincremental |
| text | TEXT | Contenido del mensaje |
| role | ENUM | Quien envió el mensaje (client, agent) |
| sentAt | DATE | Fecha de envío |
| clientId | INTEGER | Llave foránea hacia Client |

### Debt
| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER | Identificador único autoincremental |
| institution | STRING | Institución acreedora (Banco Estado, Hites, etc.) |
| amount | INTEGER | Monto adeudado en CLP |
| dueDate | DATE | Fecha de vencimiento |
| clientId | INTEGER | Llave foránea hacia Client |

---

## 🛣️ Rutas disponibles
Para probar las rutas, es recomendable empezar probando la ruta POST /client, para comenzar creando Clientes y que con esto se vayan llenando las tablas, esto debido a que si partimos con GET /clients no devolvera ningun cliente pues las tablas se encuentran vacias debido a que la base de datos recien fue creada

### GET /clients
Retorna un listado de todos los clientes.

```bash
curl http://localhost:3000/clients
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Carlos Mendoza",
    "rut": "15.234.567-8",
    "..."
  }
]
```

---

### GET /clients/:id
Retorna la información completa de un cliente, incluyendo sus mensajes y deudas.

```bash
curl http://localhost:3000/clients/1
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "Carlos Mendoza",
  "rut": "15.234.567-8",
  "messages": [
    {
      "id": 1,
      "text": "Hola, estoy buscando una casa",
      "sentAt": "2024-01-01T10:00:00.000Z",
      "role": "client"
    }
  ],
  "debts": [
    {
      "id": 1,
      "amount": 500000,
      "institution": "Banco Estado",
      "dueDate": "2024-06-01T00:00:00.000Z"
    }
  ]
}
```

---

### POST /client
Crea un nuevo cliente junto con sus mensajes y deudas.
Ejemplo en Windows

```bash
curl -X POST http://localhost:3000/client -H "Content-Type: application/json" -d "{\"name\": \"Carlos Mendoza\", \"rut\": \"4.214.507-8\", \"salary\": 2500000, \"savings\": 15000000, \"credit_history_score\": 750, \"purchaseMotivation\": \"crecimiento_familiar\", \"propertyType\": \"casa\", \"preferredLocation\": \"Las Condes\", \"propertySize\": 90, \"urgencyLevel\": 4, \"purchaseType\": \"compra_pie\", \"messages\": [{\"text\": \"Hola, estoy buscando una casa para mi familia\", \"sentAt\": \"2026-04-15T10:00:00.000Z\", \"role\": \"client\"}, {\"text\": \"Perfecto Carlos, te puedo ayudar. Que comuna prefieres?\", \"sentAt\": \"2026-04-15T10:05:00.000Z\", \"role\": \"agent\"}, {\"text\": \"Prefiero Las Condes o Vitacura, tengo dos hijos\", \"sentAt\": \"2026-04-15T11:00:00.000Z\", \"role\": \"client\"}], \"debts\": [{\"amount\": 500000, \"institution\": \"Banco Estado\", \"dueDate\": \"2024-06-01T00:00:00.000Z\"}, {\"amount\": 300000, \"institution\": \"Hites\", \"dueDate\": \"2024-05-01T00:00:00.000Z\"}]}"
```

**Respuesta:** Retorna el cliente creado con sus mensajes y deudas (igual que GET /clients/:id).

---

### POST /client-to-do-follow-up/:id
Genera un mensaje de seguimiento con IA para el cliente identificado por el id. Aplica reglas de negocio para determinar si el mensaje debe enviarse o no.

```bash
curl -X POST http://localhost:3000/client-to-do-follow-up/1
```

**Respuesta si se envía el mensaje:**
```json
{
  "id": 45,
  "text": "Hola Carlos, te escribo para ver si podemos coordinar una visita a las propiedades que encontré en Las Condes que se ajustan a tu presupuesto.",
  "sentAt": "2025-01-24T14:35:09.000Z",
  "role": "agent"
}
```

**Respuesta si no se envía el mensaje:**
```json
{}
```

---
