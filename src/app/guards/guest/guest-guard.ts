import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = async (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  try {
    await authService.checkUser();
    return router.createUrlTree(['/home']);
  } catch {
    return true;
  }
};
