import { Injectable } from '@angular/core';

export interface HelpSection {
  id: string;
  title: string;
  description: string;
  icon?: string;
  items?: string[];
  steps?: string[];
  tips?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class HelpCenterService {
  private sections: HelpSection[] = [
    {
      id: 'inicio',
      title: '🏠 Inicio y Dashboard',
      description: 'Panel principal del sistema MRP donde puedes ver estadísticas clave y acceder rápidamente a las funciones principales.',
      items: [
        'Visualización de indicadores clave de rendimiento (KPIs)',
        'Acceso rápido a módulos principales',
        'Resumen de inventario actual',
        'Alertas y notificaciones importantes'
      ],
      tips: [
        'Utiliza el panel de búsqueda global para encontrar productos rápidamente',
        'Personaliza tu vista del dashboard según tus necesidades'
      ]
    },
    {
      id: 'productos',
      title: '📦 Gestión de Productos',
      description: 'Administra el catálogo completo de productos, incluyendo materias primas, productos en proceso y productos terminados.',
      items: [
        'Crear, editar y eliminar productos',
        'Clasificación por tipo (materia prima, semi-elaborado, producto terminado)',
        'Gestión de unidades de medida',
        'Control de stock mínimo y máximo',
        'Imágenes y descripciones detalladas'
      ],
      steps: [
        'Ir al módulo "Productos" en el menú lateral',
        'Hacer clic en "Nuevo Producto"',
        'Completar la información requerida (código, nombre, tipo, unidad)',
        'Establecer niveles de stock mínimo y máximo',
        'Guardar el producto'
      ],
      tips: [
        'Usa códigos únicos y descriptivos para facilitar la identificación',
        'Define correctamente el tipo de producto para cálculos precisos de MRP',
        'Mantén actualizada la información de stock mínimo/máximo'
      ]
    },
    {
      id: 'bom',
      title: '🔧 Lista de Materiales (BOM)',
      description: 'Define las estructuras de productos (Bill of Materials) indicando qué componentes y cantidades se necesitan para fabricar cada producto.',
      items: [
        'Crear estructuras multinivel de productos',
        'Definir cantidades exactas de componentes',
        'Visualizar árbol de componentes',
        'Gestionar versiones de BOM'
      ],
      steps: [
        'Seleccionar el producto terminado o semi-elaborado',
        'Hacer clic en "Agregar Componente"',
        'Seleccionar el componente (materia prima o semi-elaborado)',
        'Ingresar la cantidad necesaria',
        'Guardar la estructura BOM'
      ],
      tips: [
        'Asegúrate de que todos los componentes estén registrados antes de crear el BOM',
        'Verifica las unidades de medida sean consistentes',
        'Revisa el árbol de componentes para validar la estructura'
      ]
    },
    {
      id: 'inventario',
      title: '📊 Control de Inventario',
      description: 'Monitorea el stock actual de todos los productos, realiza ajustes y consulta el historial de movimientos.',
      items: [
        'Consulta de inventario en tiempo real',
        'Registro de entradas y salidas',
        'Ajustes de inventario',
        'Historial de movimientos',
        'Alertas de stock bajo'
      ],
      steps: [
        'Acceder al módulo "Inventario"',
        'Filtrar por tipo de producto o buscar específicamente',
        'Para registrar movimiento: clic en "Nuevo Movimiento"',
        'Seleccionar tipo (entrada/salida), producto y cantidad',
        'Agregar comentarios si es necesario y confirmar'
      ],
      tips: [
        'Revisa regularmente los productos con stock bajo',
        'Documenta los ajustes de inventario con comentarios claros',
        'Programa conteos físicos periódicos para validar el sistema'
      ]
    },
    {
      id: 'ordenes',
      title: '⚙️ Órdenes de Trabajo',
      description: 'Gestiona las órdenes de producción desde su creación hasta su finalización, controlando el consumo de materiales.',
      items: [
        'Crear órdenes de trabajo para fabricación',
        'Especificar producto y cantidad a producir',
        'Consumir materiales automáticamente según BOM',
        'Cambiar estados (pendiente, en proceso, completada, cancelada)',
        'Generar productos terminados al completar'
      ],
      steps: [
        'Ir a "Órdenes de Trabajo" y clic en "Nueva Orden"',
        'Seleccionar el producto a fabricar',
        'Ingresar la cantidad deseada',
        'El sistema calcula automáticamente los materiales necesarios',
        'Confirmar y cambiar estado a "En Proceso"',
        'Al terminar, cambiar a "Completada" para generar el producto'
      ],
      tips: [
        'Verifica que haya suficiente inventario antes de crear la orden',
        'Actualiza el estado de las órdenes para mantener trazabilidad',
        'Los materiales se consumen automáticamente según el BOM configurado'
      ]
    },
    {
      id: 'demanda',
      title: '📈 Gestión de Demanda',
      description: 'Registra la demanda prevista de productos para planificar la producción y compras futuras.',
      items: [
        'Registrar demanda por producto y período',
        'Definir fechas de entrega requeridas',
        'Priorizar demandas urgentes',
        'Consultar histórico de demanda'
      ],
      steps: [
        'Acceder al módulo "Demanda"',
        'Crear nueva demanda especificando producto y cantidad',
        'Establecer fecha de entrega esperada',
        'Marcar como prioritaria si es urgente',
        'Guardar para incluir en la planificación MRP'
      ],
      tips: [
        'Mantén actualizada la demanda para mejorar la precisión del MRP',
        'Considera lead times de producción al definir fechas',
        'Revisa demandas pasadas para identificar patrones'
      ]
    },
    {
      id: 'mps',
      title: '📅 Plan Maestro de Producción (MPS)',
      description: 'Planifica la producción de productos terminados considerando la demanda, inventario disponible y capacidad.',
      items: [
        'Crear planes de producción por período',
        'Considerar inventario inicial y demanda',
        'Calcular necesidades de producción',
        'Ajustar cantidades según capacidad'
      ],
      steps: [
        'Ir a "MPS" y crear nuevo plan',
        'Seleccionar producto y período de planificación',
        'El sistema calcula automáticamente las necesidades',
        'Revisar y ajustar las cantidades propuestas',
        'Aprobar el plan para generar órdenes'
      ],
      tips: [
        'Ejecuta el MPS antes de correr el MRP completo',
        'Considera la capacidad de producción disponible',
        'Revisa los niveles de inventario proyectados'
      ]
    },
    {
      id: 'mrp',
      title: '🎯 Planificación MRP',
      description: 'Ejecuta el algoritmo MRP para calcular automáticamente qué, cuánto y cuándo producir o comprar.',
      items: [
        'Cálculo automático de necesidades netas',
        'Generación de propuestas de órdenes',
        'Consideración de lead times',
        'Explosión de BOM multinivel',
        'Sugerencias de compra y producción'
      ],
      steps: [
        'Asegurarte de tener BOM, demanda y MPS configurados',
        'Ir al módulo "MRP" y clic en "Ejecutar MRP"',
        'Seleccionar horizonte de planificación',
        'Revisar las propuestas generadas',
        'Convertir propuestas en órdenes reales o de compra'
      ],
      tips: [
        'Ejecuta el MRP regularmente (semanal o quincenal)',
        'Verifica la precisión de los BOM antes de ejecutar',
        'Revisa las alertas generadas por el sistema',
        'Ajusta los lead times según la experiencia real'
      ]
    },
    {
      id: 'reportes',
      title: '📄 Reportes y Análisis',
      description: 'Genera reportes detallados sobre inventario, producción, demanda y otros aspectos clave del negocio.',
      items: [
        'Reportes de inventario por categoría',
        'Análisis de órdenes de trabajo',
        'Reportes de consumo de materiales',
        'Estadísticas de producción',
        'Exportación a PDF y Excel'
      ],
      steps: [
        'Acceder al módulo "Reportes"',
        'Seleccionar el tipo de reporte deseado',
        'Aplicar filtros (fechas, productos, etc.)',
        'Generar el reporte',
        'Exportar en el formato preferido'
      ],
      tips: [
        'Programa reportes recurrentes para análisis periódico',
        'Usa filtros para análisis específicos',
        'Compara períodos para identificar tendencias'
      ]
    },
    {
      id: 'usuarios',
      title: '👥 Gestión de Usuarios',
      description: 'Administra los usuarios del sistema, sus roles y permisos de acceso.',
      items: [
        'Crear y editar usuarios',
        'Asignar roles (Administrador, Usuario, Visualizador)',
        'Gestionar permisos por módulo',
        'Activar/desactivar usuarios'
      ],
      steps: [
        'Ir a "Usuarios" (solo administradores)',
        'Crear nuevo usuario con email y contraseña',
        'Asignar rol según responsabilidades',
        'Configurar permisos específicos si es necesario',
        'Guardar y enviar credenciales al usuario'
      ],
      tips: [
        'Usa roles predefinidos para simplificar la gestión',
        'Revisa periódicamente los usuarios activos',
        'Desactiva usuarios en lugar de eliminarlos para mantener trazabilidad'
      ]
    },
    {
      id: 'suscripcion',
      title: '⭐ Suscripción y Planes',
      description: 'Gestiona tu plan de suscripción, visualiza el uso de recursos y actualiza tu plan según las necesidades.',
      items: [
        'Ver plan actual y límites',
        'Consultar uso de recursos (productos, usuarios, órdenes)',
        'Actualizar a planes superiores',
        'Historial de facturación'
      ],
      steps: [
        'Acceder a "Mi Suscripción" desde el menú de perfil',
        'Revisar el plan actual y estadísticas de uso',
        'Si necesitas más capacidad, clic en "Actualizar Plan"',
        'Seleccionar el plan deseado y confirmar'
      ],
      tips: [
        'Monitorea el uso de recursos para evitar alcanzar límites',
        'Los planes superiores ofrecen más funcionalidades',
        'Contacta a soporte para planes empresariales personalizados'
      ]
    },
    {
      id: 'consejos-generales',
      title: '💡 Consejos Generales',
      description: 'Mejores prácticas para aprovechar al máximo el sistema MRP.',
      items: [
        'Mantén los datos maestros actualizados (productos, BOM)',
        'Ejecuta el MRP regularmente',
        'Revisa y actúa sobre las alertas del sistema',
        'Realiza inventarios físicos periódicos',
        'Capacita a tu equipo en el uso del sistema',
        'Usa los reportes para tomar decisiones informadas'
      ],
      tips: [
        'La precisión del sistema depende de la calidad de los datos ingresados',
        'Establece procesos claros para el registro de movimientos',
        'Aprovecha las funciones de búsqueda y filtrado',
        'Contacta a soporte ante cualquier duda'
      ]
    }
  ];

  constructor() {}

  getAllSections(): HelpSection[] {
    return this.sections;
  }

  getSectionById(id: string): HelpSection | undefined {
    return this.sections.find(section => section.id === id);
  }

  searchSections(term: string): HelpSection[] {
    const searchTerm = term.toLowerCase();
    return this.sections.filter(section =>
      section.title.toLowerCase().includes(searchTerm) ||
      section.description.toLowerCase().includes(searchTerm)
    );
  }
}
