import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Portfolio } from './components/portfolio/portfolio';
import { Contact } from './components/contact/contact';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Hero, About, Portfolio, Contact],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
