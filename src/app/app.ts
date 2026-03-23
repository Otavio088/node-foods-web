import { Component, inject, signal, ViewChild, viewChild } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { MatDividerModule } from  '@angular/material/divider' ;
import { MatListModule } from  '@angular/material/list' ;
import { filter, switchScan } from 'rxjs';
import { Auth } from './services/auth/auth';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface MenuOption {
  name: string;
  type: string;
  children?: MenuOption[];
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, MatCheckboxModule, FormsModule, MatButtonModule, MatIcon, 
    MatDividerModule, MatListModule, MatTreeModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('node-foods-web');
  router = inject(Router);
  authService = inject(Auth);
  breakpointObserver = inject(BreakpointObserver);
  user: any;
  events: string[] = [];
  opened = true;
  dataSource: MenuOption[] = [
    {
      name: 'Pedidos',
      type: '',
      children: [
        { name: 'Listar', type: 'orders' }, 
        { name: 'Novo', type: 'orders/new' }, 
        { name: 'Relatórios', type: 'orders/relatory' }
      ],
    },
    {
      name: 'Produtos',
      type: '',
      children: [
        { name: 'Listar', type: 'products' }, 
        { name: 'Novo', type: 'products/new' },
      ],
    },
    {
      name: 'Usuários',
      type: '',
      children: [
        { name: 'Listar', type: 'users' },
        { name: 'Novo', type: 'users/new' },
      ],
    },
  ];
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  screenType: string = 'Home';
  nameIcon: string = 'group';
  url: string = '/';

  childrenAccessor = (node: MenuOption) => node.children ? node.children : [];

  hasChild = (_: number, node: MenuOption) => !!node.children && node.children.length > 0;

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.url = event.urlAfterRedirects || '/';

        if (this.url === '/') {
          this.user = {};
          return;
        }

        this.setupTypeScreen();

        if (!this.user || !this.user.id) {
          this.user = this.authService.getUser();
          const namesUser = this.user && this.user.name ? this.user.name.split(' ') : [];
          this.user.first_name = namesUser.length > 0 ? namesUser[0] : 'Usuário';
        }
      });

    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  navigateScreen(screen: string) {
    this.router.navigateByUrl(screen);

    if (this.isMobile) {
      this.sidenav.close()
    }
  }

  async exit() {
    try {
      await this.authService.logoutUser();
      this.router.navigateByUrl('/');
    } catch (err) {
      console.log('err: ', err);
    }
  }

  setupTypeScreen() {
    switch (this.url) {
      case '/home':
        this.screenType = 'Home';
        this.nameIcon = 'home';
        break;
      case '/users':
        this.screenType = 'Listagem de Usuários';
        this.nameIcon = 'group';
        break;
      case '/products':
        this.screenType = 'Listagem de Produtos';
        this.nameIcon = 'fastfood';
        break;
      default:
        break;
    }
  }
}

