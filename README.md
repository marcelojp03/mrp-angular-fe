# 🏭 SI2 MRP - Sistema de Planificación de Recursos de Manufactura

> **Angular Frontend** para el sistema MRP desarrollado en Sistemas de Información 2

[![Angular](https://img.shields.io/badge/Angular-20.x-red)](https://angular.io/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-20.x-blue)](https://primeng.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-cyan)](https://tailwindcss.com/)

---

## 🚀 Inicio Rápido

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
# Aplicación disponible en: http://localhost:4200
```

### Despliegue a AWS S3
```bash
# Deploy completo (build + subida)
npm run deploy

# Deploy rápido (usa build existente)
npm run deploy:quick
```

---

## 📁 Estructura del Proyecto

```
si2-mrp-fe/
├── 📂 src/app/
│   ├── 📂 auth/              # Autenticación y login
│   ├── 📂 core/              # Guards, interceptors, layouts
│   ├── 📂 dashboard/         # Componentes principales del MRP
│   │   ├── 📂 components/
│   │   │   ├── 📂 product/           # Gestión de productos
│   │   │   ├── 📂 inventory/         # Control de inventario
│   │   │   ├── 📂 warehouses/        # Almacenes
│   │   │   ├── 📂 suppliers/         # Proveedores
│   │   │   └── 📂 ...
│   └── 📂 shared/            # Componentes y servicios compartidos
├── 📂 docs/                  # Documentación técnica
├── 📂 deploy/                # Scripts de despliegue
└── 📂 public/               # Assets estáticos
```

---

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo |
| `npm run build:prod` | Build para producción |
| `npm run deploy` | Deploy completo a AWS S3 |
| `npm run deploy:quick` | Deploy rápido a S3 |
| `npm test` | Ejecutar tests unitarios |

---

## 🎯 Funcionalidades Principales

### 📊 **Dashboard de Control**
- KPIs en tiempo real
- Gráficos interactivos con Chart.js
- Monitoreo de inventario y producción

### 🏭 **Gestión de Producción**
- **BOMs (Bills of Materials)**: Listas de materiales con componentes
- **Órdenes de Trabajo**: Planificación y seguimiento de producción
- **Reportes de Producción**: Análisis de eficiencia y tiempos

### 📦 **Control de Inventario**
- Gestión de productos y categorías
- Control de almacenes múltiples
- Movimientos y trazabilidad
- Sugerencias de reposición automáticas

### 🤖 **Reportes con IA**
- Generación de reportes con lenguaje natural
- Exportación a múltiples formatos (CSV, Excel, PDF)
- Análisis inteligente de datos

### 👥 **Gestión de Usuarios y Roles**
- Autenticación OAuth2
- Roles y permisos granulares
- Gestión de organizaciones

---

## 🏗️ Arquitectura Técnica

### **Frontend Stack**
- **Angular 20**: Framework principal
- **PrimeNG**: Componentes UI
- **TailwindCSS**: Styling utility-first
- **Chart.js**: Gráficos y visualizaciones
- **RxJS**: Programación reactiva

### **Patrones de Componentes**
- **Patrón A (CRUD)**: Componentes con operaciones completas
- **Patrón B (Read-Only)**: Componentes de análisis y reportes
- **Signals**: Estado reactivo de Angular
- **Standalone Components**: Sin módulos NgModule

### **Backend Integration**
- **OAuth2**: Autenticación con JWT
- **REST APIs**: Comunicación con backend
- **Interceptors**: Manejo automático de tokens
- **Environment-based**: Configuración por ambiente

---

## 🌐 Despliegue

### **AWS S3 + CloudFront**
- **Bucket**: `si2-mrp-fe`
- **Región**: `us-east-1`
- **URL**: http://si2-mrp-fe.s3-website-us-east-1.amazonaws.com

### **Environments**
- **Development**: `localhost:4200` → `localhost:4646/api`
- **Production**: AWS S3 → AWS App Runner backend

---

## 📚 Documentación

- [📋 Estándares de Componentes](./docs/COMPONENT_STANDARDS.md)
- [🔐 Configuración de Autenticación](./docs/AUTENTICACION.md)
- [🗺️ Mapeo de Rutas](./docs/ROUTE_MAPPING.md)
- [📝 Resumen de Implementación](./docs/IMPLEMENTATION_SUMMARY.md)
- [☁️ Guía de Despliegue AWS](./deploy/DEPLOY_AWS.md)

---

## 🤝 Contribución

1. **Fork** el proyecto
2. **Crea** una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

---

## 📄 Licencia

Este proyecto es desarrollado para fines académicos en la materia **Sistemas de Información 2**.

---

## 👨‍💻 Desarrollado por

**Universidad Autónoma Gabriel René Moreno**  
**Facultad de Ciencias Exactas y Tecnología**  
**Carrera de Ingeniería de Sistemas**

*Sistemas de Información 2 - Semestre 2-2025*
