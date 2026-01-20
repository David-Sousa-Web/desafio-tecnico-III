import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MenubarModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <i class="pi pi-heart-fill"></i>
        <span>Medical System</span>
      </div>
      <div class="navbar-menu">
        <a
          routerLink="/pacientes"
          routerLinkActive="active"
          class="nav-link"
        >
          <i class="pi pi-users"></i>
          Pacientes
        </a>
        <a
          routerLink="/exames"
          routerLinkActive="active"
          class="nav-link"
        >
          <i class="pi pi-file"></i>
          Exames
        </a>
      </div>
    </nav>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: #ffffff;
      border-bottom: 3px solid #059669;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: #059669;

      i {
        font-size: 1.5rem;
        color: #10b981;
      }
    }

    .navbar-menu {
      display: flex;
      gap: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      text-decoration: none;
      color: #475569;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        background: #ecfdf5;
        color: #059669;
      }

      &.active {
        background: #059669;
        color: #ffffff;
      }
    }

    main {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
  `],
})
export class App {
  title = 'Medical System';
}
