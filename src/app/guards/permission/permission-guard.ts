import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

export const permissionGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let user = authService.getUser();

  if (!user.id) {
    try {
      user = await authService.checkUser();
    } catch {
      return router.createUrlTree(['/']);
    }
  }

  const moduleScreen = route.data && route.data['module'] ? route.data['module'] : '';

  if (!moduleScreen || (user.modules && user.modules.length > 0 && !user.modules.includes(moduleScreen)))
    return router.navigateByUrl('home');

  return true;

};
