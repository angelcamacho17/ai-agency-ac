import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
      <div class="max-w-4xl mx-auto">
        <a routerLink="/" class="inline-block mb-8 text-neon-green hover:text-neon-teal transition-colors duration-300">&larr; Volver al inicio</a>

        <h1 class="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Términos y <span class="text-neon-green">Condiciones</span>
        </h1>
        <p class="text-text-tertiary mb-12">Última actualización: 17 de marzo de 2026</p>

        <div class="space-y-10">
          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar los servicios de Michelangelo Devs, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder a nuestros servicios.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">2. Descripción de los Servicios</h2>
            <p>Michelangelo Devs ofrece servicios de desarrollo de software, diseño web, consultoría tecnológica y soluciones digitales personalizadas. Los detalles específicos de cada servicio serán acordados mediante contrato individual con cada cliente.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">3. Propiedad Intelectual</h2>
            <p>Todo el contenido presente en este sitio web, incluyendo pero no limitado a textos, gráficos, logotipos, íconos, imágenes y software, es propiedad de Michelangelo Devs y está protegido por las leyes de propiedad intelectual aplicables. La propiedad intelectual del trabajo desarrollado para clientes será transferida según lo estipulado en el contrato de servicio correspondiente.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">4. Obligaciones del Cliente</h2>
            <p>El cliente se compromete a proporcionar información veraz y completa necesaria para la prestación de los servicios, realizar los pagos en los plazos acordados, y colaborar de buena fe durante el desarrollo del proyecto.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">5. Pagos y Facturación</h2>
            <p>Los términos de pago serán establecidos en cada propuesta o contrato individual. Los pagos atrasados podrán generar intereses según lo permitido por la ley. Michelangelo Devs se reserva el derecho de suspender los servicios en caso de impago.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">6. Limitación de Responsabilidad</h2>
            <p>Michelangelo Devs no será responsable por daños indirectos, incidentales o consecuentes que surjan del uso o la imposibilidad de uso de nuestros servicios. Nuestra responsabilidad total no excederá el monto pagado por el cliente por los servicios en cuestión.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">7. Confidencialidad</h2>
            <p>Ambas partes se comprometen a mantener la confidencialidad de toda información sensible compartida durante la relación comercial. Esta obligación permanecerá vigente incluso después de la terminación de los servicios.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">8. Modificaciones</h2>
            <p>Michelangelo Devs se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor una vez publicados en este sitio web. El uso continuado de nuestros servicios constituye la aceptación de los términos modificados.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-text-primary mb-3">9. Contacto</h2>
            <p>Para consultas sobre estos Términos y Condiciones, puede contactarnos a través de nuestros canales oficiales disponibles en nuestro sitio web.</p>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    section p {
      line-height: 1.8;
    }
  `]
})
export class TermsComponent {}
