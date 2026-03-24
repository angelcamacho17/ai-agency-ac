import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
      <div class="max-w-4xl mx-auto">
        <a routerLink="/" class="inline-block mb-8 text-neon-green hover:text-neon-teal transition-colors duration-300">&larr; Volver al inicio</a>

        <h1 class="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Política de <span class="text-neon-green">Privacidad</span>
        </h1>
        <p class="text-text-tertiary mb-12">Última actualización: 17 de marzo de 2026</p>

        <div class="space-y-10">
          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">1. Información que Recopilamos</h2>
            <p>Podemos recopilar la siguiente información cuando interactúa con nuestro sitio web o servicios:</p>
            <ul class="list-disc list-inside mt-3 space-y-2">
              <li>Nombre y datos de contacto (correo electrónico, teléfono)</li>
              <li>Información de la empresa u organización</li>
              <li>Datos de navegación y uso del sitio web</li>
              <li>Información proporcionada voluntariamente a través de formularios de contacto</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">2. Uso de la Información</h2>
            <p>La información recopilada se utiliza para:</p>
            <ul class="list-disc list-inside mt-3 space-y-2">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Comunicarnos con usted sobre proyectos y consultas</li>
              <li>Enviar información relevante sobre nuestros servicios (con su consentimiento)</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Mejorar la experiencia de usuario en nuestro sitio web</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">3. Protección de Datos</h2>
            <p>Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra el acceso no autorizado, la alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión por Internet es 100% seguro.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">4. Compartir Información</h2>
            <p>No vendemos, intercambiamos ni transferimos su información personal a terceros sin su consentimiento, excepto cuando sea necesario para prestar nuestros servicios o cuando la ley lo requiera.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">5. Cookies y Tecnologías de Seguimiento</h2>
            <p>Nuestro sitio web puede utilizar cookies y tecnologías similares para mejorar la experiencia de navegación. Usted puede configurar su navegador para rechazar cookies, aunque esto podría afectar la funcionalidad del sitio.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">6. Sus Derechos</h2>
            <p>Usted tiene derecho a:</p>
            <ul class="list-disc list-inside mt-3 space-y-2">
              <li>Acceder a su información personal</li>
              <li>Solicitar la corrección de datos inexactos</li>
              <li>Solicitar la eliminación de sus datos</li>
              <li>Oponerse al procesamiento de su información</li>
              <li>Solicitar la portabilidad de sus datos</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">7. Retención de Datos</h2>
            <p>Conservamos su información personal únicamente durante el tiempo necesario para cumplir con los fines para los que fue recopilada, incluyendo el cumplimiento de obligaciones legales, contables o de información.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">8. Cambios en esta Política</h2>
            <p>Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Los cambios serán publicados en esta página con la fecha de actualización correspondiente.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">9. Contacto</h2>
            <p>Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, puede contactarnos a través de nuestros canales oficiales disponibles en nuestro sitio web.</p>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    section p, section ul {
      line-height: 1.8;
    }
  `]
})
export class PrivacyComponent {}
