// WebIncidentResponse - Asistente Inteligente de Respuesta a Incidentes
// Sistema de diagnóstico interactivo

class IncidentResponseAssistant {
    constructor() {
        this.currentIncidentType = null;
        this.currentStep = 0;
        this.answers = {};
        this.cases = this.loadCases();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCaseHistory();
    }

    setupEventListeners() {
        // Selección de tipo de incidente
        document.querySelectorAll('.incident-type-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const type = card.dataset.type;
                this.startDiagnostic(type);
            });
        });

        // Navegación del wizard
        document.getElementById('back-button').addEventListener('click', () => this.goBack());
        document.getElementById('prev-button').addEventListener('click', () => this.previousStep());
        document.getElementById('next-button').addEventListener('click', () => this.nextStep());

        // Resultados
        document.getElementById('restart-button').addEventListener('click', () => this.restart());
        document.getElementById('download-report').addEventListener('click', () => this.downloadReport());
        document.getElementById('save-case').addEventListener('click', () => this.saveCase());
    }

    startDiagnostic(type) {
        this.currentIncidentType = type;
        this.currentStep = 0;
        this.answers = {};

        // Ocultar selector y mostrar wizard
        document.getElementById('incident-selector').classList.add('hidden');
        document.getElementById('case-history').classList.add('hidden');
        document.getElementById('diagnostic-wizard').classList.remove('hidden');

        const typeNames = {
            'ransomware': 'Ransomware',
            'phishing': 'Phishing',
            'data-breach': 'Brecha de Datos',
            'malware': 'Malware',
            'ddos': 'DDoS',
            'unauthorized-access': 'Acceso No Autorizado'
        };

        document.getElementById('wizard-title').textContent = `Diagnóstico: ${typeNames[type]}`;
        this.renderCurrentQuestion();
    }

    renderCurrentQuestion() {
        const questions = this.getQuestions();
        const question = questions[this.currentStep];

        if (!question) {
            this.showResults();
            return;
        }

        const container = document.getElementById('question-container');
        let html = `
            <div class="question-card">
                <h3 class="question-title">${question.title}</h3>
                ${question.description ? `<p class="question-description">${question.description}</p>` : ''}
        `;

        if (question.type === 'single') {
            html += '<div class="answer-options">';
            question.options.forEach((option, index) => {
                const isSelected = this.answers[question.id] === option.value;
                html += `
                    <div class="answer-option ${isSelected ? 'selected' : ''}" onclick="assistant.selectOption('${question.id}', '${option.value}', 'single')">
                        <input type="radio" name="${question.id}" value="${option.value}" ${isSelected ? 'checked' : ''}>
                        <label>${option.label}</label>
                    </div>
                `;
            });
            html += '</div>';
        } else if (question.type === 'multiple') {
            html += '<div class="answer-options">';
            const selectedAnswers = this.answers[question.id] || [];
            question.options.forEach((option, index) => {
                const isSelected = selectedAnswers.includes(option.value);
                html += `
                    <div class="answer-option ${isSelected ? 'selected' : ''}" onclick="assistant.toggleOption('${question.id}', '${option.value}')">
                        <input type="checkbox" value="${option.value}" ${isSelected ? 'checked' : ''}>
                        <label>${option.label}</label>
                    </div>
                `;
            });
            html += '</div>';
        } else if (question.type === 'text') {
            const value = this.answers[question.id] || '';
            html += `<textarea class="text-input" id="text-${question.id}" placeholder="${question.placeholder || ''}">${value}</textarea>`;
        }

        html += '</div>';
        container.innerHTML = html;

        // Actualizar progreso
        const totalSteps = questions.length;
        document.getElementById('current-step').textContent = this.currentStep + 1;
        document.getElementById('total-steps').textContent = totalSteps;
        document.getElementById('progress-fill').style.width = `${((this.currentStep + 1) / totalSteps) * 100}%`;

        // Mostrar/ocultar botón anterior
        if (this.currentStep === 0) {
            document.getElementById('prev-button').classList.add('hidden');
        } else {
            document.getElementById('prev-button').classList.remove('hidden');
        }

        // Cambiar texto del botón siguiente
        if (this.currentStep === totalSteps - 1) {
            document.getElementById('next-button').textContent = 'Ver Resultados';
        } else {
            document.getElementById('next-button').textContent = 'Siguiente';
        }
    }

    selectOption(questionId, value, type) {
        this.answers[questionId] = value;
        this.renderCurrentQuestion();
    }

    toggleOption(questionId, value) {
        if (!this.answers[questionId]) {
            this.answers[questionId] = [];
        }
        const index = this.answers[questionId].indexOf(value);
        if (index > -1) {
            this.answers[questionId].splice(index, 1);
        } else {
            this.answers[questionId].push(value);
        }
        this.renderCurrentQuestion();
    }

    nextStep() {
        // Guardar respuesta de texto si existe
        const textInput = document.querySelector(`#text-${this.getQuestions()[this.currentStep].id}`);
        if (textInput) {
            this.answers[this.getQuestions()[this.currentStep].id] = textInput.value;
        }

        this.currentStep++;
        this.renderCurrentQuestion();
    }

    previousStep() {
        this.currentStep--;
        this.renderCurrentQuestion();
    }

    goBack() {
        document.getElementById('diagnostic-wizard').classList.add('hidden');
        document.getElementById('incident-selector').classList.remove('hidden');
        document.getElementById('case-history').classList.remove('hidden');
    }

    showResults() {
        document.getElementById('diagnostic-wizard').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');

        const analysis = this.generateAnalysis();
        this.renderResults(analysis);
    }

    generateAnalysis() {
        const type = this.currentIncidentType;
        const answers = this.answers;

        // Lógica específica por tipo de incidente
        if (type === 'ransomware') {
            return this.analyzeRansomware(answers);
        } else if (type === 'phishing') {
            return this.analyzePhishing(answers);
        } else if (type === 'data-breach') {
            return this.analyzeDataBreach(answers);
        } else if (type === 'malware') {
            return this.analyzeMalware(answers);
        } else if (type === 'ddos') {
            return this.analyzeDDoS(answers);
        } else if (type === 'unauthorized-access') {
            return this.analyzeUnauthorizedAccess(answers);
        }

        return this.getDefaultAnalysis();
    }

    analyzeRansomware(answers) {
        let severity = 'medium';
        let situation = '';
        let immediateActions = [];
        let containment = [];
        let recovery = [];
        let longTerm = [];

        // Determinar severidad basada en respuestas
        if (answers.encryption_scope === 'entire_network' || answers.encryption_scope === 'critical_systems') {
            severity = 'critical';
        } else if (answers.encryption_scope === 'multiple_systems') {
            severity = 'high';
        } else {
            severity = 'medium';
        }

        // Análisis de situación
        const scopeTexts = {
            'single_device': 'un único dispositivo',
            'multiple_systems': 'múltiples sistemas',
            'critical_systems': 'sistemas críticos',
            'entire_network': 'toda la red'
        };

        situation = `Has identificado un incidente de ransomware que ha afectado a ${scopeTexts[answers.encryption_scope] || 'sistemas de tu organización'}. `;

        if (answers.has_backups === 'yes_recent') {
            situation += 'Afortunadamente, cuentas con copias de seguridad recientes que facilitarán la recuperación. ';
        } else if (answers.has_backups === 'yes_old') {
            situation += 'Cuentas con copias de seguridad, aunque no son recientes. ';
        } else {
            situation += 'No dispones de copias de seguridad, lo que complica significativamente la recuperación. ';
            severity = severity === 'medium' ? 'high' : 'critical';
        }

        // Acciones inmediatas
        immediateActions = [
            'AISLAR INMEDIATAMENTE los sistemas afectados de la red para evitar propagación',
            'NO APAGAR los sistemas encriptados - mantenerlos encendidos para análisis forense',
            'Desconectar sistemas no afectados para protegerlos',
            'Tomar fotografías de las pantallas con notas de rescate',
            'Documentar todo: hora de detección, sistemas afectados, usuarios impactados',
            'Notificar al equipo de seguridad y dirección de TI',
            'NO PAGAR el rescate sin antes consultar con expertos en ciberseguridad'
        ];

        if (answers.encryption_scope === 'entire_network' || answers.encryption_scope === 'critical_systems') {
            immediateActions.push('Activar el plan de continuidad de negocio');
            immediateActions.push('Notificar a la dirección ejecutiva');
        }

        // Plan de contención
        containment = [
            'Identificar el vector de infección inicial (correo, RDP, vulnerabilidad)',
            'Revisar logs de firewall, proxy y sistemas para identificar actividad maliciosa',
            'Cambiar todas las contraseñas de administradores y cuentas privilegiadas',
            'Deshabilitar cuentas comprometidas temporalmente',
            'Bloquear IPs y dominios asociados al ransomware en firewall',
            'Escanear toda la red en busca de IOCs (Indicadores de Compromiso)'
        ];

        if (answers.network_isolated === 'no') {
            containment.push('URGENTE: Segmentar la red inmediatamente');
        }

        // Pasos de recuperación
        if (answers.has_backups === 'yes_recent' || answers.has_backups === 'yes_old') {
            recovery = [
                'Verificar la integridad de las copias de seguridad',
                'Asegurar que las copias de seguridad no están comprometidas',
                'Preparar un entorno limpio para la restauración',
                'Restaurar sistemas críticos primero en entorno aislado',
                'Verificar que el malware no persiste antes de conectar a producción',
                'Restaurar gradualmente, monitoreando constantemente',
                'Implementar monitoring adicional en sistemas restaurados'
            ];
        } else {
            recovery = [
                'Consultar con empresa especializada en recuperación de ransomware',
                'Identificar la variante específica de ransomware',
                'Buscar en NoMoreRansom.org si existe descifrador gratuito',
                'Evaluar si existen puntos de restauración del sistema',
                'Considerar la reconstrucción completa de sistemas afectados',
                'Priorizar sistemas según criticidad para el negocio'
            ];
        }

        // Recomendaciones a largo plazo
        longTerm = [
            'Implementar estrategia de backup 3-2-1 (3 copias, 2 medios diferentes, 1 offsite)',
            'Establecer copias de seguridad inmutables (air-gapped o WORM)',
            'Implementar EDR (Endpoint Detection and Response) en todos los endpoints',
            'Configurar monitoreo 24/7 con alertas de comportamiento anómalo',
            'Realizar pruebas periódicas de restauración de backups',
            'Implementar segmentación de red (Zero Trust)',
            'Capacitar al personal en ciberseguridad y phishing',
            'Mantener todos los sistemas actualizados con parches de seguridad',
            'Implementar autenticación multifactor (MFA) en todos los accesos',
            'Desarrollar y probar el plan de respuesta a incidentes',
            'Contratar seguro de ciberseguridad',
            'Realizar auditorías de seguridad periódicas'
        ];

        return {
            severity,
            situation,
            immediateActions,
            containment,
            recovery,
            longTerm,
            resources: [
                'No More Ransom: https://www.nomoreransom.org/',
                'CISA Ransomware Guide: https://www.cisa.gov/stopransomware',
                'INCIBE (España): https://www.incibe.es/',
                'ID Ransomware (identificar variante): https://id-ransomware.malwarehunterteam.com/'
            ]
        };
    }

    analyzePhishing(answers) {
        let severity = 'medium';
        let situation = '';
        let immediateActions = [];
        let containment = [];
        let recovery = [];
        let longTerm = [];

        if (answers.credentials_entered === 'yes') {
            severity = 'high';
            situation = 'Has identificado un incidente de phishing donde las credenciales fueron comprometidas. ';

            immediateActions = [
                'CAMBIAR INMEDIATAMENTE todas las contraseñas de las cuentas afectadas',
                'Cerrar todas las sesiones activas de las cuentas comprometidas',
                'Habilitar autenticación multifactor (MFA) si no estaba activa',
                'Notificar al equipo de seguridad',
                'Revisar actividad reciente en las cuentas comprometidas',
                'Bloquear temporalmente las cuentas si hay actividad sospechosa'
            ];
        } else if (answers.clicked_link === 'yes') {
            severity = 'medium';
            situation = 'Has identificado un incidente de phishing donde se hizo clic en un enlace malicioso. ';

            immediateActions = [
                'Aislar el dispositivo de la red inmediatamente',
                'Ejecutar análisis antivirus completo',
                'Revisar procesos y conexiones de red activas',
                'Cambiar contraseñas desde un dispositivo seguro como precaución',
                'Documentar el incidente: URL del enlace, remitente, hora'
            ];
        } else {
            severity = 'low';
            situation = 'Has identificado un intento de phishing que fue correctamente detectado sin interacción. ';

            immediateActions = [
                'Reportar el correo como phishing',
                'Bloquear el remitente en los filtros de correo',
                'Alertar a otros usuarios sobre este intento',
                'Documentar el incidente para análisis de tendencias'
            ];
        }

        containment = [
            'Bloquear el dominio del remitente en filtros de correo',
            'Añadir URLs maliciosas a listas de bloqueo',
            'Buscar correos similares en otras bandejas de entrada',
            'Revisar logs de acceso para detectar accesos no autorizados'
        ];

        recovery = [
            'Monitorear cuentas afectadas durante las próximas 48-72 horas',
            'Revisar configuración de reenvío de correo y reglas',
            'Verificar que no se hayan creado cuentas adicionales',
            'Confirmar que no se modificaron permisos de acceso'
        ];

        longTerm = [
            'Implementar filtros anti-phishing avanzados',
            'Capacitar a usuarios en identificación de phishing',
            'Implementar DMARC, SPF y DKIM para correo electrónico',
            'Realizar simulacros de phishing periódicos',
            'Implementar MFA en todos los servicios críticos',
            'Establecer protocolo de reporte de correos sospechosos'
        ];

        return {
            severity,
            situation,
            immediateActions,
            containment,
            recovery,
            longTerm,
            resources: [
                'PhishTank: https://www.phishtank.com/',
                'Have I Been Pwned: https://haveibeenpwned.com/',
                'Google Safe Browsing: https://transparencyreport.google.com/safe-browsing/search'
            ]
        };
    }

    analyzeDataBreach(answers) {
        let severity = answers.data_type?.includes('pii') || answers.data_type?.includes('financial') ? 'critical' : 'high';

        let situation = 'Has identificado una posible brecha de datos en tu organización. ';

        if (answers.data_type?.includes('pii')) {
            situation += 'Los datos comprometidos incluyen información personal identificable (PII), lo que requiere notificación a autoridades y usuarios afectados. ';
        }

        return {
            severity,
            situation,
            immediateActions: [
                'Detener inmediatamente la filtración si está en curso',
                'Preservar evidencias para análisis forense',
                'Identificar el alcance: qué datos, cuántos registros, desde cuándo',
                'Notificar al equipo legal y de cumplimiento',
                'Preparar comunicación para partes afectadas',
                'Documentar todo el proceso detalladamente'
            ],
            containment: [
                'Cerrar el vector de acceso que permitió la brecha',
                'Revocar credenciales comprometidas',
                'Aplicar parches de seguridad urgentes',
                'Revisar logs de acceso completos',
                'Implementar monitoreo adicional'
            ],
            recovery: [
                'Evaluar daños y exposición de datos',
                'Notificar a autoridades (GDPR: 72 horas)',
                'Informar a usuarios afectados',
                'Ofrecer servicios de protección de identidad si aplica',
                'Implementar medidas correctivas'
            ],
            longTerm: [
                'Implementar DLP (Data Loss Prevention)',
                'Clasificar y etiquetar datos sensibles',
                'Cifrar datos en reposo y en tránsito',
                'Implementar principio de mínimo privilegio',
                'Realizar auditorías de acceso periódicas',
                'Establecer programa de gestión de vulnerabilidades',
                'Capacitar en protección de datos y GDPR'
            ],
            resources: [
                'AEPD (España): https://www.aepd.es/',
                'GDPR Info: https://gdpr.eu/',
                'OWASP Data Protection: https://owasp.org/www-project-proactive-controls/'
            ]
        };
    }

    analyzeMalware(answers) {
        return {
            severity: 'high',
            situation: 'Se ha detectado malware en los sistemas de la organización que requiere atención inmediata.',
            immediateActions: [
                'Aislar sistemas infectados de la red',
                'Detener procesos maliciosos identificados',
                'Capturar muestras del malware para análisis',
                'Escanear sistemas con múltiples antivirus',
                'Documentar IOCs (Indicadores de Compromiso)'
            ],
            containment: [
                'Identificar todos los sistemas comprometidos',
                'Bloquear C&C (Command and Control) servers',
                'Actualizar firewalls y IDS/IPS',
                'Desplegar EDR en endpoints críticos'
            ],
            recovery: [
                'Limpiar sistemas infectados o reimaginarlos',
                'Restaurar desde backups limpios',
                'Cambiar credenciales potencialmente expuestas',
                'Verificar integridad de datos'
            ],
            longTerm: [
                'Implementar whitelisting de aplicaciones',
                'Mantener antivirus actualizado',
                'Implementar sandboxing para ejecutables',
                'Capacitar usuarios en seguridad',
                'Establecer baseline de comportamiento de red'
            ],
            resources: [
                'VirusTotal: https://www.virustotal.com/',
                'Hybrid Analysis: https://www.hybrid-analysis.com/',
                'ANY.RUN: https://any.run/'
            ]
        };
    }

    analyzeDDoS(answers) {
        return {
            severity: 'high',
            situation: 'Estás experimentando un ataque de denegación de servicio distribuido (DDoS) contra tus servicios.',
            immediateActions: [
                'Activar mitigación DDoS con tu ISP o proveedor CDN',
                'Documentar patrones de tráfico anómalo',
                'Identificar IPs de origen del ataque',
                'Comunicar a stakeholders sobre posible downtime',
                'Activar plan de contingencia'
            ],
            containment: [
                'Implementar rate limiting agresivo',
                'Bloquear rangos IP sospechosos',
                'Activar modo "Under Attack" en CDN',
                'Escalar recursos si es posible',
                'Filtrar tráfico malicioso en edge'
            ],
            recovery: [
                'Monitorear normalización del tráfico',
                'Analizar logs para identificar vectores',
                'Restaurar servicios gradualmente',
                'Verificar integridad de aplicaciones'
            ],
            longTerm: [
                'Contratar servicio de protección DDoS',
                'Implementar CDN con protección DDoS',
                'Diseñar arquitectura resiliente',
                'Establecer acuerdos con ISP para mitigación',
                'Realizar pruebas de estrés periódicas',
                'Implementar redundancia geográfica'
            ],
            resources: [
                'Cloudflare DDoS Protection',
                'Akamai Kona Site Defender',
                'AWS Shield'
            ]
        };
    }

    analyzeUnauthorizedAccess(answers) {
        return {
            severity: 'critical',
            situation: 'Se ha detectado acceso no autorizado a sistemas o datos de la organización.',
            immediateActions: [
                'Revocar inmediatamente el acceso no autorizado',
                'Cambiar todas las credenciales comprometidas',
                'Cerrar todas las sesiones activas',
                'Aislar sistemas afectados',
                'Preservar logs para análisis forense',
                'Notificar a equipo de seguridad y legal'
            ],
            containment: [
                'Identificar método de acceso utilizado',
                'Cerrar vulnerabilidades explotadas',
                'Revisar todos los accesos recientes',
                'Implementar MFA inmediatamente',
                'Auditar privilegios de todas las cuentas'
            ],
            recovery: [
                'Analizar qué datos fueron accedidos',
                'Evaluar si hubo exfiltración de datos',
                'Restaurar configuraciones modificadas',
                'Verificar integridad de sistemas',
                'Evaluar necesidad de notificación a autoridades'
            ],
            longTerm: [
                'Implementar Zero Trust Architecture',
                'Establecer monitoreo de comportamiento de usuarios (UEBA)',
                'Implementar PAM (Privileged Access Management)',
                'Realizar auditorías de acceso periódicas',
                'Implementar autenticación multifactor obligatoria',
                'Establecer políticas de contraseñas robustas',
                'Capacitar en higiene de seguridad',
                'Implementar micro-segmentación de red'
            ],
            resources: [
                'NIST Cybersecurity Framework',
                'CIS Controls',
                'MITRE ATT&CK Framework'
            ]
        };
    }

    getDefaultAnalysis() {
        return {
            severity: 'medium',
            situation: 'Se ha identificado un incidente de seguridad que requiere atención.',
            immediateActions: [
                'Documentar todos los detalles del incidente',
                'Notificar al equipo de seguridad',
                'Aislar sistemas afectados si es necesario',
                'Preservar evidencias'
            ],
            containment: [
                'Identificar alcance del incidente',
                'Implementar controles temporales',
                'Monitorear actividad anómala'
            ],
            recovery: [
                'Desarrollar plan de recuperación',
                'Implementar medidas correctivas',
                'Verificar efectividad de controles'
            ],
            longTerm: [
                'Realizar análisis de causa raíz',
                'Actualizar políticas de seguridad',
                'Capacitar al personal',
                'Mejorar controles preventivos'
            ],
            resources: [
                'INCIBE: https://www.incibe.es/',
                'NIST: https://www.nist.gov/cyberframework'
            ]
        };
    }

    renderResults(analysis) {
        // Situación
        document.getElementById('situation-analysis').innerHTML = `<p>${analysis.situation}</p>`;

        // Severidad
        const severityTexts = {
            'critical': 'CRÍTICO',
            'high': 'ALTO',
            'medium': 'MEDIO',
            'low': 'BAJO'
        };
        document.getElementById('severity-level').innerHTML = `
            <div class="severity-badge ${analysis.severity}">
                ${severityTexts[analysis.severity]}
            </div>
            <p style="margin-top: 1rem; color: white;">Este incidente requiere ${analysis.severity === 'critical' ? 'atención inmediata' : analysis.severity === 'high' ? 'acción urgente' : 'atención'} del equipo de seguridad.</p>
        `;

        // Acciones inmediatas
        document.getElementById('immediate-actions').innerHTML = `
            <ul class="action-list">
                ${analysis.immediateActions.map(action => `<li>${action}</li>`).join('')}
            </ul>
        `;

        // Contención
        document.getElementById('containment-plan').innerHTML = `
            <ul class="action-list">
                ${analysis.containment.map(action => `<li>${action}</li>`).join('')}
            </ul>
        `;

        // Recuperación
        document.getElementById('recovery-steps').innerHTML = `
            <ul class="action-list">
                ${analysis.recovery.map(step => `<li>${step}</li>`).join('')}
            </ul>
        `;

        // Largo plazo
        document.getElementById('long-term-recommendations').innerHTML = `
            <ul class="recommendation-list">
                ${analysis.longTerm.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        `;

        // Recursos
        document.getElementById('additional-resources').innerHTML = `
            <ul class="recommendation-list">
                ${analysis.resources.map(res => `<li>${res}</li>`).join('')}
            </ul>
        `;
    }

    restart() {
        document.getElementById('results-section').classList.add('hidden');
        document.getElementById('incident-selector').classList.remove('hidden');
        document.getElementById('case-history').classList.remove('hidden');
        this.currentIncidentType = null;
        this.currentStep = 0;
        this.answers = {};
    }

    downloadReport() {
        const analysis = this.generateAnalysis();
        const typeNames = {
            'ransomware': 'Ransomware',
            'phishing': 'Phishing',
            'data-breach': 'Brecha de Datos',
            'malware': 'Malware',
            'ddos': 'DDoS',
            'unauthorized-access': 'Acceso No Autorizado'
        };

        const report = `
REPORTE DE RESPUESTA A INCIDENTE
=================================
Fecha: ${new Date().toLocaleString('es-ES')}
Tipo de Incidente: ${typeNames[this.currentIncidentType]}

ANÁLISIS DE SITUACIÓN
---------------------
${analysis.situation}

NIVEL DE SEVERIDAD: ${analysis.severity.toUpperCase()}

ACCIONES INMEDIATAS
-------------------
${analysis.immediateActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

PLAN DE CONTENCIÓN
------------------
${analysis.containment.map((a, i) => `${i + 1}. ${a}`).join('\n')}

PASOS DE RECUPERACIÓN
---------------------
${analysis.recovery.map((a, i) => `${i + 1}. ${a}`).join('\n')}

RECOMENDACIONES A LARGO PLAZO
------------------------------
${analysis.longTerm.map((a, i) => `${i + 1}. ${a}`).join('\n')}

RECURSOS ADICIONALES
--------------------
${analysis.resources.join('\n')}

---
Generado por WebIncidentResponse
        `.trim();

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `incident-report-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Reporte descargado correctamente');
    }

    saveCase() {
        const analysis = this.generateAnalysis();
        const typeNames = {
            'ransomware': 'Ransomware',
            'phishing': 'Phishing',
            'data-breach': 'Brecha de Datos',
            'malware': 'Malware',
            'ddos': 'DDoS',
            'unauthorized-access': 'Acceso No Autorizado'
        };

        const caseData = {
            id: Date.now(),
            type: this.currentIncidentType,
            typeName: typeNames[this.currentIncidentType],
            date: new Date().toISOString(),
            answers: this.answers,
            analysis: analysis
        };

        this.cases.unshift(caseData);
        localStorage.setItem('incident_cases', JSON.stringify(this.cases));
        this.renderCaseHistory();
        this.showNotification('Caso guardado correctamente');
    }

    loadCases() {
        const stored = localStorage.getItem('incident_cases');
        return stored ? JSON.parse(stored) : [];
    }

    renderCaseHistory() {
        const container = document.getElementById('cases-container');

        if (this.cases.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <p>No hay casos guardados</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.cases.map(case => `
            <div class="case-item" onclick="assistant.viewCase(${case.id})">
                <div class="case-header">
                    <div>
                        <div class="case-title">${case.typeName}</div>
                        <div class="case-date">${new Date(case.date).toLocaleString('es-ES')}</div>
                    </div>
                    <div class="case-type">${case.analysis.severity.toUpperCase()}</div>
                </div>
            </div>
        `).join('');
    }

    viewCase(id) {
        const caseData = this.cases.find(c => c.id === id);
        if (!caseData) return;

        this.currentIncidentType = caseData.type;
        this.answers = caseData.answers;

        document.getElementById('incident-selector').classList.add('hidden');
        document.getElementById('case-history').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');

        this.renderResults(caseData.analysis);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getQuestions() {
        const questions = {
            'ransomware': [
                {
                    id: 'encryption_scope',
                    title: '¿Cuál es el alcance de la encriptación?',
                    description: 'Selecciona la opción que mejor describe el alcance del ataque',
                    type: 'single',
                    options: [
                        { value: 'single_device', label: 'Un único dispositivo' },
                        { value: 'multiple_systems', label: 'Múltiples sistemas (2-10)' },
                        { value: 'critical_systems', label: 'Sistemas críticos del negocio' },
                        { value: 'entire_network', label: 'Toda la red empresarial' }
                    ]
                },
                {
                    id: 'has_backups',
                    title: '¿Tienes copias de seguridad de los datos afectados?',
                    description: 'Las copias de seguridad son fundamentales para la recuperación',
                    type: 'single',
                    options: [
                        { value: 'yes_recent', label: 'Sí, tengo backups recientes (menos de 24h)' },
                        { value: 'yes_old', label: 'Sí, pero son antiguos (más de 24h)' },
                        { value: 'no', label: 'No tengo copias de seguridad' },
                        { value: 'unknown', label: 'No estoy seguro' }
                    ]
                },
                {
                    id: 'network_isolated',
                    title: '¿Los sistemas afectados ya están aislados de la red?',
                    type: 'single',
                    options: [
                        { value: 'yes', label: 'Sí, ya están aislados' },
                        { value: 'no', label: 'No, aún están conectados' },
                        { value: 'partial', label: 'Parcialmente aislados' }
                    ]
                },
                {
                    id: 'ransom_note',
                    title: '¿Has documentado la nota de rescate?',
                    description: 'La nota de rescate contiene información valiosa para identificar la variante',
                    type: 'single',
                    options: [
                        { value: 'yes', label: 'Sí, tengo fotos/capturas' },
                        { value: 'no', label: 'No, no la he documentado' }
                    ]
                },
                {
                    id: 'additional_info',
                    title: 'Información adicional (opcional)',
                    description: 'Describe cualquier detalle adicional que consideres relevante',
                    type: 'text',
                    placeholder: 'Ej: Cómo se detectó el incidente, extensiones de archivos encriptados, etc.'
                }
            ],
            'phishing': [
                {
                    id: 'clicked_link',
                    title: '¿Se hizo clic en el enlace del correo sospechoso?',
                    type: 'single',
                    options: [
                        { value: 'yes', label: 'Sí, se hizo clic en el enlace' },
                        { value: 'no', label: 'No, no se hizo clic' }
                    ]
                },
                {
                    id: 'credentials_entered',
                    title: '¿Se introdujeron credenciales en algún formulario?',
                    type: 'single',
                    options: [
                        { value: 'yes', label: 'Sí, se introdujeron credenciales' },
                        { value: 'no', label: 'No se introdujeron credenciales' },
                        { value: 'unknown', label: 'No estoy seguro' }
                    ]
                },
                {
                    id: 'attachment_opened',
                    title: '¿Se abrió algún archivo adjunto?',
                    type: 'single',
                    options: [
                        { value: 'yes', label: 'Sí, se abrió un adjunto' },
                        { value: 'no', label: 'No había adjuntos o no se abrieron' }
                    ]
                },
                {
                    id: 'mfa_enabled',
                    title: '¿Las cuentas afectadas tienen autenticación multifactor (MFA)?',
                    type: 'single',
                    options: [
                        { value: 'yes', label: 'Sí, tienen MFA activo' },
                        { value: 'no', label: 'No tienen MFA' }
                    ]
                }
            ],
            'data-breach': [
                {
                    id: 'data_type',
                    title: '¿Qué tipo de datos fueron comprometidos?',
                    description: 'Puedes seleccionar múltiples opciones',
                    type: 'multiple',
                    options: [
                        { value: 'pii', label: 'Datos personales (PII - nombres, direcciones, etc.)' },
                        { value: 'financial', label: 'Datos financieros (tarjetas, cuentas bancarias)' },
                        { value: 'health', label: 'Datos de salud' },
                        { value: 'credentials', label: 'Credenciales de acceso' },
                        { value: 'corporate', label: 'Datos corporativos confidenciales' },
                        { value: 'other', label: 'Otros' }
                    ]
                },
                {
                    id: 'data_volume',
                    title: '¿Cuántos registros fueron afectados aproximadamente?',
                    type: 'single',
                    options: [
                        { value: 'low', label: 'Menos de 100 registros' },
                        { value: 'medium', label: '100 - 10,000 registros' },
                        { value: 'high', label: '10,000 - 100,000 registros' },
                        { value: 'massive', label: 'Más de 100,000 registros' },
                        { value: 'unknown', label: 'No determinado aún' }
                    ]
                },
                {
                    id: 'breach_vector',
                    title: '¿Cómo ocurrió la brecha?',
                    type: 'single',
                    options: [
                        { value: 'external_attack', label: 'Ataque externo (hacking)' },
                        { value: 'insider', label: 'Amenaza interna (empleado)' },
                        { value: 'misconfiguration', label: 'Error de configuración' },
                        { value: 'lost_device', label: 'Dispositivo perdido/robado' },
                        { value: 'third_party', label: 'Proveedor tercero' },
                        { value: 'unknown', label: 'Aún bajo investigación' }
                    ]
                }
            ],
            'malware': [
                {
                    id: 'malware_detected',
                    title: '¿Cómo se detectó el malware?',
                    type: 'single',
                    options: [
                        { value: 'antivirus', label: 'Alerta de antivirus/EDR' },
                        { value: 'behavior', label: 'Comportamiento anómalo del sistema' },
                        { value: 'network', label: 'Anomalía en tráfico de red' },
                        { value: 'user_report', label: 'Reporte de usuario' }
                    ]
                },
                {
                    id: 'malware_active',
                    title: '¿El malware sigue activo?',
                    type: 'single',
                    options: [
                        { value: 'yes', label: 'Sí, aún está activo' },
                        { value: 'no', label: 'Ya fue contenido/eliminado' },
                        { value: 'unknown', label: 'No estoy seguro' }
                    ]
                }
            ],
            'ddos': [
                {
                    id: 'service_status',
                    title: '¿Cuál es el estado actual de los servicios?',
                    type: 'single',
                    options: [
                        { value: 'down', label: 'Completamente caídos' },
                        { value: 'degraded', label: 'Funcionando con degradación' },
                        { value: 'recovering', label: 'En proceso de recuperación' }
                    ]
                },
                {
                    id: 'attack_duration',
                    title: '¿Cuánto tiempo lleva el ataque?',
                    type: 'single',
                    options: [
                        { value: 'minutes', label: 'Minutos' },
                        { value: 'hours', label: 'Horas' },
                        { value: 'days', label: 'Días' }
                    ]
                }
            ],
            'unauthorized-access': [
                {
                    id: 'access_method',
                    title: '¿Cómo se obtuvo el acceso no autorizado?',
                    type: 'single',
                    options: [
                        { value: 'stolen_credentials', label: 'Credenciales robadas' },
                        { value: 'vulnerability', label: 'Explotación de vulnerabilidad' },
                        { value: 'social_engineering', label: 'Ingeniería social' },
                        { value: 'insider', label: 'Amenaza interna' },
                        { value: 'unknown', label: 'Bajo investigación' }
                    ]
                },
                {
                    id: 'access_ongoing',
                    title: '¿El acceso no autorizado sigue activo?',
                    type: 'single',
                    options: [
                        { value: 'yes', label: 'Sí, aún tiene acceso' },
                        { value: 'no', label: 'Ya fue revocado' },
                        { value: 'unknown', label: 'No estoy seguro' }
                    ]
                }
            ]
        };

        return questions[this.currentIncidentType] || [];
    }
}

// Inicializar la aplicación
const assistant = new IncidentResponseAssistant();
