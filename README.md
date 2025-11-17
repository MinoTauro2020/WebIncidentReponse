# WebIncidentResponse

Sistema web de gestión de incidentes de seguridad informática diseñado para ayudar a equipos de respuesta a incidentes a rastrear, documentar y gestionar eventos de seguridad.

## Características

- **Dashboard en tiempo real** - Visualización de incidentes por severidad
- **Registro de incidentes** - Formulario completo para documentar incidentes de seguridad
- **Clasificación por severidad** - Crítico, Alto, Medio, Bajo
- **Tipos de incidentes** - Malware, Phishing, Brechas de datos, DDoS, Acceso no autorizado, etc.
- **Almacenamiento local** - Los datos se guardan en localStorage del navegador
- **Interfaz responsive** - Compatible con dispositivos móviles y tablets
- **Gestión de incidentes** - Crear, visualizar y eliminar incidentes

## Tecnologías Utilizadas

- HTML5
- CSS3 (con variables CSS y Grid/Flexbox)
- JavaScript (ES6+)
- LocalStorage API

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/MinoTauro2020/WebIncidentReponse.git
```

2. Navegar al directorio:
```bash
cd WebIncidentReponse
```

3. Abrir `index.html` en tu navegador web

No se requiere instalación de dependencias ni servidor web. La aplicación funciona completamente del lado del cliente.

## Uso

### Registrar un Incidente

1. Completar el formulario "Registrar Nuevo Incidente"
2. Ingresar título y descripción del incidente
3. Seleccionar la severidad (Crítico, Alto, Medio, Bajo)
4. Seleccionar el tipo de incidente
5. Opcionalmente, agregar la fuente o IP del incidente
6. Hacer clic en "Registrar Incidente"

### Visualizar Incidentes

Los incidentes se muestran en la sección "Incidentes Recientes" ordenados por fecha (más reciente primero).

### Dashboard

El panel de control muestra un resumen de incidentes activos clasificados por severidad.

## Estructura del Proyecto

```
WebIncidentReponse/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos de la aplicación
├── js/
│   └── app.js          # Lógica de la aplicación
├── img/                # Imágenes (actualmente vacío)
└── README.md           # Documentación
```

## Características de Seguridad

- Escapado de HTML para prevenir XSS
- Validación de formularios del lado del cliente
- No se exponen datos sensibles en el código

## Mejoras Futuras

- [ ] Backend con base de datos
- [ ] Autenticación de usuarios
- [ ] Exportación de reportes (PDF, CSV)
- [ ] Gráficos y estadísticas avanzadas
- [ ] Sistema de notificaciones
- [ ] Integración con herramientas SIEM
- [ ] Timeline de eventos
- [ ] Asignación de incidentes a usuarios
- [ ] Estados de incidente (Abierto, En progreso, Resuelto, Cerrado)

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Contacto

MinoTauro2020 - [@MinoTauro2020](https://github.com/MinoTauro2020)

Link del Proyecto: [https://github.com/MinoTauro2020/WebIncidentReponse](https://github.com/MinoTauro2020/WebIncidentReponse)
