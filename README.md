# API de Cotizaciones

API REST desarrollada con Node.js y Express para un sistema de cotizaciones de servicios. Incluye gestión de usuarios, clientes, categorías, servicios y procesamiento de cotizaciones por email.

## Características

- Autenticación con JWT
- CRUD completo para todas las entidades
- Validación de datos con Zod
- Documentación con Swagger
- Arquitectura modular y escalable
- MongoDB como base de datos

## Requisitos

- Node.js (v16 o superior)
- MongoDB

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd backend-01
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cotizaciones
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

## Uso

1. Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

2. Iniciar el servidor en modo producción:

```bash
npm start
```

## Documentación de la API

La documentación completa de la API está disponible en la ruta `/api-docs` una vez que el servidor esté en funcionamiento.

### Endpoints Principales

#### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario

#### Categorías

- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

#### Cotizaciones

- `POST /api/quotes` - Crear cotización
- `GET /api/quotes/:id` - Obtener cotización
- `PATCH /api/quotes/:id/status` - Actualizar estado de cotización
- `POST /api/email-quotes/process` - Procesar cotización desde email

## Estructura del Proyecto

```
src/
├── controllers/     # Controladores de la aplicación
├── middleware/      # Middleware personalizado
├── models/          # Modelos de Mongoose
├── routes/          # Definición de rutas
├── schemas/         # Esquemas de validación
├── app.js           # Configuración de Express
└── index.js         # Punto de entrada
```

## Modelos de Datos

### Categoría

```javascript
{
  name: String,
  description: String,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Cliente

```javascript
{
  name: String,
  email: String,
  customPricing: Map,
  phone: String,
  address: String,
  active: Boolean
}
```

### Servicio

```javascript
{
  name: String,
  category: ObjectId,
  location: String,
  basePrice: Number,
  description: String,
  lastUpdated: Date
}
```

### Cotización

```javascript
{
  customerId: ObjectId,
  services: Array,
  status: String,
  total: Number,
  validUntil: Date
}
```

## Seguridad

- Autenticación mediante JWT
- Validación de datos con Zod
- Encriptación de contraseñas con bcrypt
- Manejo de roles y permisos

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request
