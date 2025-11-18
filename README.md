# SI2 MRP - Sistema de Planificación de Recursos de Manufactura

Sistema de gestión MRP (Material Requirements Planning) desarrollado con Angular 20 para la materia Sistemas de Información 2.

---

## Requisitos Previos

- Node.js 18 o superior
- npm 9 o superior
- Angular CLI 20 (se instala con las dependencias)

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/marcelojp03/mrp-angular-fe.git
cd mrp-angular-fe

# Instalar dependencias
npm install
```

---

## Desarrollo

### Iniciar servidor de desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Build de desarrollo

```bash
npm run build
```

### Build de producción

```bash
npm run build:prod
```

Los archivos compilados se generarán en el directorio `dist/`

---

## Despliegue

### Deploy a AWS S3

```bash
# Deploy completo (build + upload)
npm run deploy

# Deploy rápido (sin build)
npm run deploy:quick
```

**URL de producción**: http://si2-mrp-fe.s3-website-us-east-1.amazonaws.com

Ver [Guía de Despliegue](./deploy/DEPLOY_AWS.md) para más detalles.

---

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia servidor de desarrollo |
| `npm run build` | Build de desarrollo |
| `npm run build:prod` | Build de producción |
| `npm test` | Ejecuta tests unitarios |
| `npm run deploy` | Deploy completo a AWS S3 |
| `npm run deploy:quick` | Deploy rápido |

---

## Estructura del Proyecto

```
mrp_angular_fe/
├── src/                    # Código fuente
│   ├── app/                # Aplicación Angular
│   ├── assets/             # Assets estáticos
│   └── environments/       # Configuración por ambiente
├── docs/                   # Documentación técnica
├── deploy/                 # Scripts de despliegue
└── public/                 # Archivos públicos
```

---

## Documentación

### General
- [Información del Proyecto](./docs/PROJECT_INFO.md) - Descripción completa del sistema
- [Resumen de Implementación](./docs/IMPLEMENTATION_SUMMARY.md) - Sprint y funcionalidades

### Desarrollo
- [Estándares de Componentes](./docs/COMPONENT_STANDARDS.md) - Patrones y guías de desarrollo
- [Mapeo de Rutas](./docs/ROUTE_MAPPING.md) - Estructura de navegación

### Seguridad
- [Autenticación](./docs/AUTENTICACION.md) - Sistema de autenticación OAuth2
- [Refresh Token](./docs/REFRESH_TOKEN.md) - Renovación automática de tokens

### Despliegue
- [Guía de Despliegue AWS](./deploy/DEPLOY_AWS.md) - Configuración de AWS S3

---

## Configuración de Environments

### Development
Archivo: `src/environments/environment.ts`
- Backend: `http://localhost:4646/api`
- OAuth Server: `http://localhost:8585/api`

### Production
Archivo: `src/environments/environment.prod.ts`
- Backend: AWS App Runner
- OAuth Server: Servidor de producción

El archivo correcto se selecciona automáticamente según el comando de build utilizado.

---

## Tecnologías Principales

- Angular 20
- PrimeNG 20
- TypeScript 5.8
- TailwindCSS 3.4
- RxJS
- Chart.js

---

## Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## Equipo

**Universidad Autónoma Gabriel René Moreno**  
Facultad de Ciencias Exactas y Tecnología  
Carrera de Ingeniería de Sistemas

Sistemas de Información 2 - Semestre 2-2025

---

## Licencia

Proyecto académico desarrollado para la materia Sistemas de Información 2.
