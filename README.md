# To-Do API – Clean Architecture

RESTful API en Node.js + Express + MongoDB (Mongoose) que permite a los usuarios registrarse, iniciar sesión y gestionar sus propias tareas siguiendo principios de Arquitectura Limpia.

## Tabla de Contenido
1. [Características](#características)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Requisitos](#requisitos)
4. [Instalación](#instalación)
5. [Uso](#uso)
6. [Endpoints](#endpoints)
7. [Docker](#docker)
8. [Licencia](#licencia)

## Características
- Registro y login con JWT
- CRUD de tareas seguras (un usuario no puede ver/edit/eliminar tareas de otro)
- Arquitectura por capas (API, Domain, Infrastructure, Config)
- Base de datos MongoDB en contenedor Docker
- Variables de entorno con **dotenv**

## Estructura de Carpetas
```
├── app.js                 # entrypoint Express
├── docker-compose.yml     # servicio MongoDB
├── src
│   ├── api
│   │   ├── routes         # routing layer
│   │   └── controllers    # HTTP controllers (req/res)
│   ├── domain
│   │   ├── models         # Mongoose schemas
│   │   └── use-cases      # business logic
│   ├── infrastructure
│   │   ├── repositories   # data access
│   │   └── middlewares    # auth middleware
│   └── config             # DB connection, env
└── .env.example
```

## Requisitos
- Node.js ≥ 18
- Docker y Docker Compose (para MongoDB)

## Instalación
```bash
# Clonar el repo
git clone https://github.com/tu-usuario/todo-api-clean-architecture.git
cd todo-api-clean-architecture

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
# Edita .env si es necesario
```

## Uso
1. Levantar MongoDB en contenedor:
   ```bash
   docker-compose up -d
   ```
2. Ejecutar la API en modo dev con recarga automática:
   ```bash
   npm run dev
   ```
   o modo producción:
   ```bash
   npm start
   ```
3. La API corre en `http://localhost:5000`

## Endpoints
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar un nuevo usuario |
| POST | `/api/auth/login` | Login – devuelve JWT |
| POST | `/api/tasks` | Crear tarea (protegido) |
| GET | `/api/tasks` | Listar mis tareas |
| GET | `/api/tasks/:id` | Obtener tarea por id |
| PUT | `/api/tasks/:id` | Actualizar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

Ejemplo cabecera común:
```
Authorization: Bearer <token>
```

## Docker
`docker-compose.yml` solo define MongoDB; si quieres agregar la API, puedes crear otro servicio o desplegar en una plataforma externa.

Comandos útiles:
```bash
# parar contenedores y borrar volumen
docker-compose down -v
```

## Licencia
MIT © 2025
