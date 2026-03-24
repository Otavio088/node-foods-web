import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  if (user.id)
    return router.createUrlTree(['/home']);

  try {
    await authService.checkUser();
    return router.createUrlTree(['/home']);
  } catch {
    return true;
  }
};
