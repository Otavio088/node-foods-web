import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth/auth-guard';
import { guestGuard } from './guards/guest/guest-guard';
import { Products } from './components/products/products';
import { Users } from './components/users/users';
import { User } from './components/user/user';
import { RolesUser } from './components/roles-user/roles-user';
import { permissionGuard } from './guards/permission/permission-guard';
import { Ingredients } from './components/ingredients/ingredients';

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
        canActivate: [authGuard, permissionGuard],
        data: { title: 'Listagem Usuários', icon: 'group', module: 'users' }
    },
    {
        path: 'users/new',
        component: User,
        canActivate: [authGuard, permissionGuard],
        data: { title: 'Novo Usuário', icon: 'person_add', module: 'users' }
    },
    {
        path: 'users/roles',
        component: RolesUser,
        canActivate: [authGuard, permissionGuard],
        data: { title: 'Papéis de Usuário', icon: 'lock_person', module: 'users' }
    },
    {
        path: 'users/:id',
        component: User,
        canActivate: [authGuard, permissionGuard],
        data: { title: 'Edição de Usuário', icon: 'person_search', module: 'users' }
    },
    {
        path: 'products',
        component: Products,
        canActivate: [authGuard, permissionGuard],
        data: { title: 'Listagem de Produtos', icon: 'fastfood', module: 'products' }
    },

    {
        path: 'products/ingredients',
        component: Ingredients,
        canActivate: [authGuard, permissionGuard],
        data: { title: 'Ingredientes de Produtos', icon: 'kitchen', module: 'products' }
    }
];
