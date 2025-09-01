# AI Knowledge Hub API

Backend API para el sistema AI Knowledge Hub, construido con TypeScript y siguiendo principios de Arquitectura Hexagonal, Clean Architecture y SOLID.

## Arquitectura

Este proyecto implementa una arquitectura hexagonal (puertos y adaptadores) con las siguientes capas:

### Estructura de Carpetas

```
src/
├── domain/                 # Capa de dominio (entidades, value objects, puertos)
│   └── user/
│       ├── entities/       # Entidades de dominio
│       ├── repositories/   # Puertos (interfaces)
│       └── value-objects/  # Objetos de valor
├── application/            # Capa de aplicación (casos de uso)
│   └── user/
│       ├── dto/           # Data Transfer Objects
│       └── use-cases/     # Casos de uso
├── infrastructure/         # Capa de infraestructura (adaptadores)
│   ├── database/          # Adaptadores de base de datos
│   └── logging/           # Adaptadores de logging
├── config/                # Configuración de la aplicación
├── handlers/              # Handlers de AWS Lambda
└── shared/                # Código compartido
    └── ports/             # Puertos compartidos
```

### Principios Aplicados

- **Hexagonal Architecture**: Separación clara entre lógica de negocio y detalles de implementación
- **Clean Architecture**: Dependencias apuntan hacia el dominio
- **SOLID**: Principios de diseño orientado a objetos
- **Dependency Injection**: Uso de tsyringe para inyección de dependencias
- **Domain-Driven Design**: Modelado rico del dominio

## Tecnologías

- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Framework**: AWS SAM (Serverless Application Model)
- **Database**: PostgreSQL con TypeORM
- **Testing**: Jest
- **Logging**: Pino
- **Dependency Injection**: tsyringe
- **Validation**: class-validator

## Configuración del Entorno

1. Copiar el archivo de configuración:
```bash
cp env.example .env
```

2. Configurar las variables de entorno en `.env`

3. Instalar dependencias:
```bash
npm install
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Compilar TypeScript
npm start           # Ejecutar aplicación compilada

# Testing
npm test            # Ejecutar pruebas
npm run test:watch  # Ejecutar pruebas en modo watch
npm run test:coverage # Generar reporte de cobertura

# Linting
npm run lint        # Ejecutar linter
npm run lint:fix    # Corregir errores de linting automáticamente

# AWS SAM
npm run sam:build   # Construir aplicación SAM
npm run sam:deploy  # Desplegar a AWS
```

## Ejemplo de Uso

### Dominio User

El proyecto incluye un ejemplo completo de implementación para la entidad `User`:

#### Entidad de Dominio
```typescript
// src/domain/user/entities/User.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly role?: string
  ) {}
}
```

#### Caso de Uso
```typescript
// src/application/user/use-cases/CreateUserUseCase.ts
@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UserRepositoryPort') private userRepository: UserRepositoryPort,
    @inject('LoggerPort') private logger: LoggerPort
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // Lógica del caso de uso
  }
}
```

#### Adaptador de Infraestructura
```typescript
// src/infrastructure/database/repositories/TypeOrmUserRepository.ts
@injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
  // Implementación con TypeORM
}
```

## Testing

El proyecto incluye pruebas unitarias completas:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas específicas
npm test -- --testPathPattern=CreateUserUseCase

# Generar reporte de cobertura
npm run test:coverage
```

## Despliegue

### Usando AWS SAM

1. Construir la aplicación:
```bash
npm run sam:build
```

2. Desplegar:
```bash
npm run sam:deploy
```

### Variables de Entorno Requeridas

- `DB_HOST`: Host de la base de datos
- `DB_PORT`: Puerto de la base de datos
- `DB_USERNAME`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_DATABASE`: Nombre de la base de datos
- `AWS_REGION`: Región de AWS
- `SECRETS_MANAGER_SECRET_NAME`: Nombre del secreto en AWS Secrets Manager
- `LOG_LEVEL`: Nivel de logging (debug, info, warn, error)
- `NODE_ENV`: Entorno de ejecución (development, staging, production)

## Endpoints API

### Users

- `POST /users` - Crear usuario
- `GET /users` - Obtener todos los usuarios
- `GET /users/{id}` - Obtener usuario por ID

## Próximos Pasos

Esta estructura base está preparada para extenderse con:

- Más dominios (Document, Chunk, Query)
- Casos de uso RAG (IngestDocumentUseCase, RagQueryUseCase)
- Adaptadores AWS (Textract, Bedrock, S3)
- Adaptadores de vector store (Pinecone)
- Manejo de errores avanzado
- Observabilidad y métricas
- Autenticación y autorización

## Contribución

1. Seguir los principios arquitectónicos establecidos
2. Mantener alta cobertura de pruebas
3. Usar TypeScript estricto
4. Documentar casos de uso complejos
5. Respetar la separación de capas
