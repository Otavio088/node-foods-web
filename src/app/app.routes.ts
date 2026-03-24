import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth/auth-guard';
import { guestGuard } from './guards/guest/guest-guard';
import { Products } from './components/products/products';
import { Users } from './components/users/users';
import { User } from './components/user/user';

export const routes: Routes = [
    {
        path: '',
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: 'home',
        component: Home,
        canActivate: [authGuard],
        data: { title: 'Home', icon: 'home' }
    },
    {
        path: 'users',
        component: Users,
        canActivate: [authGuard],
        data: { title: 'Usuários', icon: 'group' }
    },
    {
        path: 'user/new',
        component: User,
        canActivate: [authGuard],
        data: { title: 'Novo Usuário', icon: 'person_add' }
    },
    {
        path: 'user/:id',
        component: User,
        canActivate: [authGuard],
        data: { title: 'Edição de Usuário', icon: 'person_search' }
    },
    {
        path: 'products',
        component: Products,
        canActivate: [authGuard],
        data: { title: 'Listagem de Produtos', icon: 'fastfood' }
    }
];
