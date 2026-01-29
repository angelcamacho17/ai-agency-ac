import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DemoProject {
  type: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-project-demo-modal',
  imports: [CommonModule],
  templateUrl: './project-demo-modal.component.html',
  styleUrl: './project-demo-modal.component.scss'
})
export class ProjectDemoModalComponent {
  @Input() project: DemoProject | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  // Web App Demo Data
  webStats = [
    { value: '2.4K', label: 'Usuarios' },
    { value: '89%', label: 'Satisfacción' },
    { value: '156', label: 'Proyectos' },
    { value: '24/7', label: 'Soporte' }
  ];

  webMetrics = [
    { name: 'Performance', value: 95 },
    { name: 'SEO', value: 88 },
    { name: 'Accesibilidad', value: 92 },
    { name: 'Best Practices', value: 97 }
  ];

  // Mobile App Demo Data
  mobileItems = [
    { icon: '🏠', label: 'Inicio' },
    { icon: '📊', label: 'Estadísticas' },
    { icon: '⚙️', label: 'Configuración' },
    { icon: '👤', label: 'Perfil' }
  ];

  // AI Solutions Demo Data
  aiMessages = [
    { text: '¿Cómo puedo ayudarte hoy?', isUser: false },
    { text: 'Necesito optimizar mi código', isUser: true },
    { text: 'Puedo analizar tu código y sugerir mejoras. ¿Qué lenguaje estás usando?', isUser: false }
  ];

  // E-commerce Demo Data
  ecommerceProducts = [
    { name: 'Producto Premium', price: 99, emoji: '💎', gradient: 'from-neon-green to-neon-teal' },
    { name: 'Producto Destacado', price: 149, emoji: '⭐', gradient: 'from-neon-teal to-blue-500' },
    { name: 'Producto Especial', price: 79, emoji: '🎁', gradient: 'from-neon-orange to-yellow-500' }
  ];

  // API Demo Data
  apiEndpoints = [
    { method: 'GET', path: '/api/users', status: '200 OK' },
    { method: 'POST', path: '/api/users', status: '201 Created' },
    { method: 'PUT', path: '/api/users/:id', status: '200 OK' },
    { method: 'DELETE', path: '/api/users/:id', status: '204 No Content' }
  ];

  apiResponse = `{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Usuario Demo",
    "email": "demo@example.com"
  }
}`;

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isOpen) {
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
  }

  sendAIMessage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.trim()) {
      this.aiMessages.push({ text: input.value, isUser: true });
      input.value = '';
      this.simulateAIResponse();
    }
  }

  simulateAIResponse() {
    setTimeout(() => {
      const responses = [
        'Excelente pregunta. Déjame analizar eso...',
        'Basado en las mejores prácticas, recomiendo...',
        'Aquí hay una solución optimizada para tu caso.',
        '¡Perfecto! Eso debería mejorar el rendimiento significativamente.'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      this.aiMessages.push({ text: randomResponse, isUser: false });
    }, 1000);
  }
}
