# WebIncidentResponse

**Asistente Inteligente de Respuesta a Incidentes de Seguridad**

WebIncidentResponse es una aplicación web interactiva diseñada para guiar a equipos de TI y seguridad a través del proceso de respuesta a incidentes de ciberseguridad. Mediante un sistema de diagnóstico basado en preguntas, la herramienta identifica la situación actual y proporciona recomendaciones específicas y accionables.

## Características Principales

### Sistema de Diagnóstico Interactivo

- **6 Tipos de Incidentes Soportados:**
  - **Ransomware** - Archivos encriptados, sistemas bloqueados, notas de rescate
  - **Phishing** - Correos sospechosos, robo de credenciales, ingeniería social
  - **Brecha de Datos** - Filtración de información, acceso no autorizado
  - **Malware** - Virus, troyanos, comportamiento anómalo
  - **DDoS** - Denegación de servicio, servicios caídos
  - **Acceso No Autorizado** - Intrusión, cuentas comprometidas

### Flujo de Diagnóstico

1. **Selección del Tipo de Incidente** - El usuario selecciona el tipo de incidente que está experimentando
2. **Cuestionario Guiado** - Serie de preguntas específicas para identificar el estado actual
3. **Análisis Automático** - El sistema analiza las respuestas y determina la severidad
4. **Plan de Acción Personalizado** - Genera recomendaciones específicas basadas en las respuestas

### Resultados Detallados

Para cada incidente diagnosticado, la aplicación proporciona:

- **Análisis de Situación** - Resumen contextual del incidente
- **Nivel de Severidad** - Clasificación (Crítico, Alto, Medio, Bajo)
- **Acciones Inmediatas** - Pasos urgentes a tomar de inmediato
- **Plan de Contención** - Estrategias para contener el incidente
- **Pasos de Recuperación** - Proceso de recuperación y restauración
- **Recomendaciones a Largo Plazo** - Mejoras de seguridad preventivas
- **Recursos Adicionales** - Enlaces a herramientas y documentación útil

### Funcionalidades Adicionales

- **Descarga de Reportes** - Genera reportes en texto plano descargables
- **Historial de Casos** - Guarda casos en localStorage para referencia futura
- **Interfaz Responsive** - Compatible con desktop, tablet y móvil
- **Barra de Progreso** - Visualización del avance en el cuestionario
- **Navegación Flexible** - Permite retroceder y modificar respuestas

## Ejemplos de Uso

### Ejemplo: Ransomware

**Escenario:** Una empresa detecta que sus archivos están encriptados

1. Usuario selecciona "Ransomware"
2. Responde preguntas sobre:
   - Alcance de la encriptación (un dispositivo vs toda la red)
   - Disponibilidad de copias de seguridad
   - Estado de aislamiento de sistemas
   - Documentación de la nota de rescate

3. El sistema genera un plan que incluye:
   - **Si NO tiene backups:** Recomendación de buscar decifradores en NoMoreRansom, consultar expertos
   - **Si tiene backups recientes:** Pasos detallados para restauración segura
   - **Si afecta toda la red:** Activación del plan de continuidad de negocio
   - Acciones como aislar sistemas, NO apagar equipos, documentar todo
   - Recomendaciones a largo plazo: Estrategia 3-2-1, EDR, segmentación de red

### Ejemplo: Phishing

**Escenario:** Un empleado hace clic en un enlace sospechoso

1. Usuario selecciona "Phishing"
2. Responde:
   - ¿Se hizo clic en el enlace? Sí
   - ¿Se introdujeron credenciales? No
   - ¿Tiene MFA habilitado? Sí

3. El sistema proporciona:
   - Severidad: Media (podría ser Alta si se introdujeron credenciales)
   - Aislar dispositivo inmediatamente
   - Ejecutar escaneo antivirus
   - Cambiar contraseñas por precaución
   - Revisar procesos y conexiones de red

## Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Diseño moderno con variables CSS, Grid y Flexbox
- **JavaScript (ES6+)** - Lógica de aplicación orientada a objetos
- **LocalStorage API** - Persistencia de datos del navegador

## Instalación y Uso

### Opción 1: Uso Directo

1. Clonar el repositorio:
```bash
git clone https://github.com/MinoTauro2020/WebIncidentReponse.git
```

2. Navegar al directorio:
```bash
cd WebIncidentReponse
```

3. Abrir `index.html` en tu navegador web

**No se requiere instalación de dependencias ni servidor web.**

### Opción 2: Servidor Web Local

```bash
# Usando Python 3
python -m http.server 8000

# Usando Node.js
npx http-server

# Luego abrir: http://localhost:8000
```

## Estructura del Proyecto

```
WebIncidentReponse/
├── index.html          # Página principal con 3 vistas principales
├── css/
│   └── style.css       # Estilos completos (incident selector, wizard, results)
├── js/
│   └── app.js          # Lógica de aplicación (1000+ líneas)
├── img/                # Imágenes (reservado para futuras mejoras)
└── README.md           # Esta documentación
```

## Cómo Funciona

### Arquitectura de la Aplicación

```javascript
class IncidentResponseAssistant {
    // Gestiona todo el flujo de la aplicación
    - startDiagnostic()      // Inicia el wizard
    - renderCurrentQuestion() // Muestra pregunta actual
    - generateAnalysis()      // Analiza respuestas
    - renderResults()         // Muestra recomendaciones
}
```

### Flujo de Datos

1. Usuario selecciona tipo de incidente → `startDiagnostic(type)`
2. Sistema carga preguntas específicas → `getQuestions()`
3. Usuario responde → Almacena en `this.answers`
4. Al finalizar → `generateAnalysis()` ejecuta lógica específica
5. Sistema genera recomendaciones → `analyzeRansomware()`, `analyzePhishing()`, etc.
6. Renderiza resultados → `renderResults(analysis)`

### Lógica de Severidad

El sistema determina automáticamente la severidad basándose en:

- **Ransomware:**
  - Crítico: Red completa o sistemas críticos afectados sin backups
  - Alto: Múltiples sistemas afectados
  - Medio: Un solo dispositivo

- **Phishing:**
  - Alto: Credenciales comprometidas
  - Medio: Clic en enlace sin introducir credenciales
  - Bajo: Detectado sin interacción

- **Brecha de Datos:**
  - Crítico: Datos PII o financieros comprometidos
  - Alto: Otros tipos de datos sensibles

## Casos de Uso Reales

### Para Equipos de TI

- Respuesta rápida a incidentes fuera de horario laboral
- Guía paso a paso para personal junior
- Checklist de acciones a tomar

### Para Pequeñas Empresas

- Sin equipo de seguridad dedicado
- Necesitan orientación inmediata
- No tienen experiencia en respuesta a incidentes

### Para Formación

- Entrenamiento de equipos de respuesta
- Simulacros de incidentes
- Documentación de mejores prácticas

## Mejoras Futuras

### Corto Plazo
- [ ] Más tipos de incidentes (Cryptojacking, Insider Threats, etc.)
- [ ] Exportar reportes en PDF y JSON
- [ ] Modo oscuro
- [ ] Múltiples idiomas

### Medio Plazo
- [ ] Backend con base de datos
- [ ] Autenticación de usuarios
- [ ] Compartir casos con el equipo
- [ ] Integración con herramientas SIEM
- [ ] Notificaciones por email

### Largo Plazo
- [ ] IA para análisis predictivo
- [ ] Integración con APIs de threat intelligence
- [ ] Dashboard de métricas y estadísticas
- [ ] Workflow de aprobaciones
- [ ] Integración con ticketing systems
- [ ] Mobile app nativa

## Seguridad

- **Almacenamiento Local** - Los datos se guardan solo en el navegador del usuario
- **Sin Transmisión de Datos** - No se envía información a servidores externos
- **Escapado de HTML** - Prevención de XSS en inputs de usuario
- **Sin Dependencias Externas** - No se cargan librerías de terceros

## Contribuir

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Ideas de Contribución

- Agregar más tipos de incidentes
- Mejorar algoritmos de análisis
- Añadir más preguntas al diagnóstico
- Traducir a otros idiomas
- Mejorar el diseño UI/UX
- Agregar tests unitarios

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Soporte

Para reportar bugs o solicitar features, por favor abre un issue en GitHub.

## Autor

MinoTauro2020 - [@MinoTauro2020](https://github.com/MinoTauro2020)

Link del Proyecto: [https://github.com/MinoTauro2020/WebIncidentReponse](https://github.com/MinoTauro2020/WebIncidentReponse)

## Agradecimientos

- Basado en frameworks de respuesta a incidentes (NIST, SANS)
- Inspirado en mejores prácticas de INCIBE y CISA
- Comunidad de ciberseguridad

---

**Nota Importante:** Esta herramienta proporciona orientación general y no reemplaza la consulta con profesionales de ciberseguridad calificados. En caso de incidentes críticos, siempre contacta con expertos en seguridad.
