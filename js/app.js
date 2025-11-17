// WebIncidentResponse - Sistema de Gestión de Incidentes
// Almacenamiento de incidentes en LocalStorage

class IncidentManager {
    constructor() {
        this.incidents = this.loadIncidents();
        this.init();
    }

    init() {
        // Event listeners
        document.getElementById('incidentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addIncident();
        });

        // Cargar datos iniciales
        this.updateDashboard();
        this.renderIncidents();
    }

    loadIncidents() {
        const stored = localStorage.getItem('incidents');
        return stored ? JSON.parse(stored) : [];
    }

    saveIncidents() {
        localStorage.setItem('incidents', JSON.stringify(this.incidents));
    }

    addIncident() {
        const incident = {
            id: Date.now(),
            title: document.getElementById('incident-title').value,
            description: document.getElementById('incident-description').value,
            severity: document.getElementById('incident-severity').value,
            type: document.getElementById('incident-type').value,
            source: document.getElementById('incident-source').value,
            timestamp: new Date().toISOString(),
            status: 'open'
        };

        this.incidents.unshift(incident);
        this.saveIncidents();
        this.updateDashboard();
        this.renderIncidents();

        // Reset form
        document.getElementById('incidentForm').reset();

        // Mostrar notificación
        this.showNotification('Incidente registrado correctamente');
    }

    deleteIncident(id) {
        if (confirm('¿Estás seguro de eliminar este incidente?')) {
            this.incidents = this.incidents.filter(inc => inc.id !== id);
            this.saveIncidents();
            this.updateDashboard();
            this.renderIncidents();
            this.showNotification('Incidente eliminado');
        }
    }

    updateDashboard() {
        const stats = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
        };

        this.incidents.forEach(incident => {
            if (incident.status === 'open') {
                stats[incident.severity]++;
            }
        });

        document.getElementById('critical-count').textContent = stats.critical;
        document.getElementById('high-count').textContent = stats.high;
        document.getElementById('medium-count').textContent = stats.medium;
        document.getElementById('low-count').textContent = stats.low;
    }

    renderIncidents() {
        const container = document.getElementById('incidents-container');

        if (this.incidents.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No hay incidentes registrados</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.incidents.map(incident => `
            <div class="incident-item">
                <div class="incident-header">
                    <h3 class="incident-title">${this.escapeHtml(incident.title)}</h3>
                    <span class="severity-badge ${incident.severity}">
                        ${this.getSeverityText(incident.severity)}
                    </span>
                </div>
                <div class="incident-details">
                    <div class="incident-meta">
                        <span><strong>Tipo:</strong> ${this.getTypeText(incident.type)}</span>
                        <span><strong>Fecha:</strong> ${this.formatDate(incident.timestamp)}</span>
                        ${incident.source ? `<span><strong>Fuente:</strong> ${this.escapeHtml(incident.source)}</span>` : ''}
                    </div>
                    <p class="incident-description">${this.escapeHtml(incident.description)}</p>
                </div>
                <div class="incident-actions">
                    <button class="btn btn-danger" onclick="incidentManager.deleteIncident(${incident.id})">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    getSeverityText(severity) {
        const severities = {
            critical: 'Crítico',
            high: 'Alto',
            medium: 'Medio',
            low: 'Bajo'
        };
        return severities[severity] || severity;
    }

    getTypeText(type) {
        const types = {
            malware: 'Malware',
            phishing: 'Phishing',
            breach: 'Brecha de Datos',
            ddos: 'DDoS',
            unauthorized: 'Acceso No Autorizado',
            other: 'Otro'
        };
        return types[type] || type;
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        // Crear notificación simple (puede mejorarse con una librería)
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar la aplicación
const incidentManager = new IncidentManager();

// Agregar animaciones CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
