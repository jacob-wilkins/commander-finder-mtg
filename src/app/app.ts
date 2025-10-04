import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Home } from './home/home';

@Component({
  selector: 'app-root',
  imports: [RouterModule, Navbar, Home],
  template: `
   <main>
      <app-navbar></app-navbar>
      <section class="content">
        <app-home ></app-home>
      </section>
   </main> 
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('commander-finder-mtg');
}
