import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth/auth-guard';
import { guestGuard } from './guards/guest/guest-guard';
import { Products } from './components/products/products';
import { Users } from './components/users/users';

export const routes: Routes = [
    {
        path: '',
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: 'home',
        component: Home,
        canActivate: [authGuard]
    },
    {
        path: 'users',
        component: Users,
        canActivate: [authGuard]
    },
    {
        path: 'products',
        component: Products,
        canActivate: [authGuard]
    }
];
