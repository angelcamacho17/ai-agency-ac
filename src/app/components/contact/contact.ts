import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  onSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    // TODO: Implement actual form submission logic (e.g., send to API)
    console.log('Form submitted:', data);

    // Show success message
    alert('¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.');

    // Reset form
    form.reset();
  }
}
