import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const user = authService.getUser();

  if (user.id)
    return true;

  try {
    await authService.checkUser();
    return true;
  } catch {
    return router.createUrlTree(['/']);
  }
};
