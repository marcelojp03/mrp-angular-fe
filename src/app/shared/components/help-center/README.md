# Centro de Ayuda - Help Center Component

## Descripción

Componente flotante de ayuda al usuario que proporciona documentación interactiva sobre cómo usar el sistema MRP.

## Características

- **Botón flotante**: Siempre visible en la esquina inferior derecha
- **Panel lateral deslizable**: Muestra la documentación de forma organizada
- **Búsqueda**: Permite buscar contenido específico
- **Acordeón organizado**: Agrupa la ayuda por módulos
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## Integración

El componente ya está integrado en el layout principal (`app.layout.ts`) y estará visible en toda la aplicación.

## Contenido de Ayuda

El contenido está organizado por los siguientes módulos:

1. **Inicio y Dashboard** - Panel principal y estadísticas
2. **Gestión de Productos** - Administración del catálogo
3. **Lista de Materiales (BOM)** - Estructuras de productos
4. **Control de Inventario** - Seguimiento de stock
5. **Órdenes de Trabajo** - Gestión de producción
6. **Gestión de Demanda** - Planificación de requerimientos
7. **Plan Maestro de Producción (MPS)** - Programación de producción
8. **Planificación MRP** - Algoritmo de cálculo de necesidades
9. **Reportes y Análisis** - Generación de informes
10. **Gestión de Usuarios** - Administración de usuarios y roles
11. **Suscripción y Planes** - Gestión de suscripción
12. **Consejos Generales** - Mejores prácticas

## Personalización

### Agregar nueva sección de ayuda

Editar `help-center.service.ts` y agregar un nuevo objeto al array `sections`:

```typescript
{
  id: 'nuevo-modulo',
  title: '🆕 Nuevo Módulo',
  description: 'Descripción del módulo',
  items: [
    'Funcionalidad 1',
    'Funcionalidad 2'
  ],
  steps: [
    'Paso 1',
    'Paso 2'
  ],
  tips: [
    'Consejo útil 1',
    'Consejo útil 2'
  ]
}
```

### Modificar estilos

Los estilos del botón flotante y el panel están en el componente. Puedes modificarlos editando la sección `styles` en `help-center.component.ts`.

## Uso

El componente se muestra automáticamente en todas las páginas del dashboard. Los usuarios pueden:

1. Hacer clic en el botón flotante `?` para abrir el centro de ayuda
2. Navegar por las secciones usando el acordeón
3. Usar el buscador para encontrar información específica
4. Cerrar el panel haciendo clic fuera de él o en el botón "Cerrar"

## Tecnologías

- Angular Standalone Component
- PrimeNG (Sidebar, Accordion, Button, Tooltip, InputText)
- SCSS para estilos personalizados
