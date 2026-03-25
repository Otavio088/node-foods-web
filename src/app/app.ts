import { Component, inject, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { MatDividerModule } from  '@angular/material/divider' ;
import { MatListModule } from  '@angular/material/list' ;
import { filter } from 'rxjs';
import { AuthService } from './services/auth/auth';
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
export class App implements OnInit {
  protected readonly title = signal('node-foods-web');
  childrenAccessor = (node: MenuOption) => node.children ? node.children : [];
  hasChild = (_: number, node: MenuOption) => !!node.children && node.children.length > 0;

  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  breakpointObserver = inject(BreakpointObserver);

  user: any;
  events: string[] = [];
  opened: boolean = true;
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
  isMobile: boolean = false;
  screenType: string = 'Home';
  nameIcon: string = 'group';
  url: string = '/';

  ngOnInit(): void {
    this.validationRoutes();
    this.typeScreen();
  }

  validationRoutes() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.url = event.urlAfterRedirects || '/';

        if (this.url === '/') {
          this.user = {};
          return;
        }

        if (!this.user || !this.user.id) {
          this.user = this.authService.getUser();
          const namesUser = this.user && this.user.name ? this.user.name.split(' ') : [];
          this.user.first_name = namesUser.length > 0 ? namesUser[0] : 'Usuário';
        }

        let route = this.route.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }

        this.screenType = route?.snapshot.data['title'] || '';
        this.nameIcon = route?.snapshot.data['icon'] || '';
      });
  }

  typeScreen() {
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
}